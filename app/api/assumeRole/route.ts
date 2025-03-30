import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import * as parquet from "parquetjs";
import fs from "fs/promises";
import os from "os";
import path from "path";

// --------------------------------------------------------------------------------
// Helper: Convert stream to string (used for reading S3 file contents)
const streamToString = (stream: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });

// Helper: Convert stream to Buffer (for binary data)
const streamToBuffer = (stream: any): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });

//  Helper: Extract schema and row count from a sample Parquet file.
async function getParquetFileDetails(
  bucketName: string,
  key: string,
  s3Client: S3Client
): Promise<{ stats: any; schema: any; rowCount: number }> {
  try {
    const getObjectResponse = await s3Client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: key })
    );

    if (!getObjectResponse.Body) {
      throw new Error(`No body found for key: ${key}`);
    }

    // Get the file contents as a Buffer
    const buffer = await streamToBuffer(getObjectResponse.Body);

    // Write the buffer to a temporary file
    const tmpDir = os.tmpdir();
    const tmpPath = path.join(tmpDir, `temp-${Date.now()}.parquet`);
    await fs.writeFile(tmpPath, buffer);

    // Open the Parquet file using the temporary file
    const reader = await parquet.ParquetReader.openFile(tmpPath);

    // Get the schema and row count
    const tableSchema = reader.getSchema();
    const rowCount = Number(reader.getRowCount());

    // Initialize stats object based on the schema field names
    const stats: Record<string, { min: any; max: any }> = {};
    for (const fieldName in tableSchema.fieldList) {
      stats[fieldName] = { min: undefined, max: undefined };
    }

    // Iterate through rows to compute min/max
    const cursor = reader.getCursor();
    let record;
    while ((record = await cursor.next())) {
      for (const [key, value] of Object.entries(record)) {
        if (stats[key].min === undefined || value < stats[key].min) {
          stats[key].min = value;
        }
        if (stats[key].max === undefined || value > stats[key].max) {
          stats[key].max = value;
        }
      }
    }

    await reader.close();
    await fs.unlink(tmpPath);

    console.log(
      `Successfully extracted schema, row count (${rowCount}), and stats for ${key}`
    );
    return { schema: tableSchema, rowCount, stats };
  } catch (error) {
    console.error(`Error reading parquet file ${key}:`, error);
    throw error;
  }
}


// --------------------------------------------------------------------------------
// SECTION 1: Bucket Exploration & Listing

// Recursive function to list all objects in the bucket
async function listAllObjects(
  bucketName: string,
  s3Client: S3Client,
  prefix: string = ""
): Promise<any[]> {
  let objects: any[] = [];
  let continuationToken: string | undefined = undefined;
  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });
    const listResponse: any = await s3Client.send(listCommand);
    if (listResponse.Contents) {
      objects.push(...listResponse.Contents);
    }
    continuationToken = listResponse.NextContinuationToken;
  } while (continuationToken);
  return objects;
}

// Group objects by top-level object (treat this as the table name)
function groupObjectsByobject(objects: any[]): Record<string, any[]> {
  const objectMap: Record<string, any[]> = {};
  objects.forEach((obj) => {
    if (obj.Key) {
      const objectName = obj.Key.split("/")[0];
      if (!objectMap[objectName]) objectMap[objectName] = [];
      objectMap[objectName].push(obj);
    }
  });
  return objectMap;
}

// --------------------------------------------------------------------------------
// SECTION 2: Table Format Detection

enum TableFormat {
  Delta = "Delta Lake",
  Iceberg = "Iceberg",
  Hudi = "Hudi",
  Parquet = "Parquet Files",
  Unknown = "Unknown",
}

function detectTableFormat(object: string, files: any[]): TableFormat {
  const keys = files.map((f) => f.Key);
  // Delta detection
  if (keys.some((key) => key.startsWith(`${object}/_delta_log/`))) {
    return TableFormat.Delta;
  }
  // Hudi detection
  if (
    keys.some((key) => key.startsWith(`${object}/.hoodie/`)) ||
    keys.some((key) => key.endsWith("hoodie.properties"))
  ) {
    return TableFormat.Hudi;
  }
  // Iceberg detection
  if (
    keys.some(
      (key) =>
        key.endsWith(".json") &&
        key.toLowerCase().includes("metadata") &&
        !key.includes("_delta_log") &&
        !key.includes(".hoodie")
    )
  ) {
    return TableFormat.Iceberg;
  }
  // If Parquet files exist, consider it a Parquet table
  if (keys.some((key) => key.endsWith(".parquet"))) {
    return TableFormat.Parquet;
  }
  return TableFormat.Unknown;
}

// --------------------------------------------------------------------------------
// SECTION 3: Metadata Extraction Functions

// --- Delta Lake Extraction ---
// Returns common keys: tableSchema, tableProperties, partitionDetails, versioningFiles, keyMetrics
// --- Delta Lake Extraction (Updated) ---
async function extractDeltaDetails(
  bucketName: any,
  object: string,
  s3Client: S3Client,
  files: any[]
) {
  const deltaLogFiles = files
    .filter((f) => f.Key.startsWith(`${object}/_delta_log/`))
    .map((f) => f.Key);
  if (deltaLogFiles.length === 0) return null;

  // Filter commit JSON files (ignore checkpoint and crc files)
  const commitFiles = deltaLogFiles.filter(
    (key) =>
      key.endsWith(".json") &&
      !key.includes(".checkpoint") &&
      !key.endsWith(".crc")
  );
  if (commitFiles.length === 0) return null;

  // Parse and sort commit files by version number
  const versionedFiles = commitFiles
    .map((key) => {
      const fileName = key.split("/").pop() || "0.json";
      const commitNumber = parseInt(fileName.split(".")[0], 10);
      return {
        key,
        version: commitNumber,
        versionDisplay: `v${commitNumber}.${object}`,
      };
    })
    .sort((a, b) => b.version - a.version); // Sort descending

  let latestFile = versionedFiles[0].key;

  try {
    const getObjectResponse = await s3Client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: latestFile })
    );
    if (!getObjectResponse.Body) return null;

    const bodyContents = await streamToString(getObjectResponse.Body);
    const lines = bodyContents.trim().split(/\r?\n/);
    const metadataActions = lines
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (error) {
          console.error("Delta JSON parse error:", line, error);
          return null;
        }
      })
      .filter((action) => action !== null);

    // Get the metaData action (for schema and table properties)
    const metaDataAction =
      metadataActions.find((item) => item.metaData) || null;

    // For versioning, use the checkpoint files' paths (if any)
    const checkpointFiles = deltaLogFiles.filter((key) =>
      key.includes(".checkpoint")
    );

    // --- KEY METRICS CALCULATION WITH STATS (NO AGGREGATION) ---
    const addActions = metadataActions.filter((action) => action.add);
    const dataFileCount = addActions.length;
    const totalDataFileSize = addActions.reduce(
      (acc, action) => acc + (action.add.size || 0),
      0
    );

    // For each add action, parse and include its stats (min/max/compression)
    const statsArray = addActions.reduce((acc, action) => {
      if (action.add && action.add.stats) {
        try {
          const fileStats = JSON.parse(action.add.stats);
          acc.push(fileStats);
        } catch (err) {
          console.error("Error parsing stats for", action.add, err);
        }
      }
      return acc;
    }, []);

    return {
      tableSchema: metaDataAction ? metaDataAction.metaData : null,
      tableProperties: metaDataAction ? metaDataAction.protocol : null,
      partitionDetails: metaDataAction
        ? metaDataAction.metaData.partitionColumns
        : null,
      versioningFiles: checkpointFiles, // For compatibility
      versionData: versionedFiles, // For hierarchical version display
      keyMetrics: {
        totalDataFileSize,
        dataFileCount,
        stats: statsArray, // File-level stats (no aggregation)
      },
    };
  } catch (error) {
    console.error(`Error reading Delta metadata from ${latestFile}:`, error);
    return null;
  }
}

  

// --- Iceberg Extraction ---
// Returns common keys for Iceberg tables.
// --- Iceberg Extraction (Updated) ---
async function extractIcebergDetails(
  bucketName: string,
  tableBase: string,
  s3Client: S3Client,
  files: any[]
) {
  // Normalize table base path
  const folder = tableBase.endsWith("/") ? tableBase.slice(0, -1) : tableBase;
  console.log("All files for folder:", folder, files.map((f: { Key: any; }) => f.Key));

  // Filter files in the metadata folder that end with metadata.json
  const metadataFiles = files.filter(
    (f: { Key: string; }) =>
      f.Key.startsWith(`${folder}/metadata/`) && f.Key.endsWith("metadata.json")
  );
  console.log("Filtered metadata files:", metadataFiles.map((f: { Key: any; }) => f.Key));

  if (metadataFiles.length === 0) {
    console.error("No Iceberg metadata file found for table in", folder);
    return null;
  }

  // Regex to match an optional numeric version prefix before the dot.
  const regex = new RegExp(`^${folder}/metadata/(?:0*([0-9]+)\\.)?metadata\\.json$`);
  
  // Sort metadata files by version number
  const versionedFiles = metadataFiles
    .map((file: { Key: string; }) => {
      const match = file.Key.match(regex);
      const version = match && match[1] ? parseInt(match[1], 10) : 0;
      return {
        file,
        version,
        versionDisplay: `v${version}.${tableBase}`,
        key: file.Key,
      };
    })
    .sort((a: { version: number; }, b: { version: number; }) => b.version - a.version);

  let latestFile = versionedFiles[0].file;

  try {
    console.log("Reading metadata file:", latestFile.Key);
    const getObjectResponse = await s3Client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: latestFile.Key })
    );
    if (!getObjectResponse.Body) return null;
    const metadataContent = await streamToString(getObjectResponse.Body);
    const icebergMetadata = JSON.parse(metadataContent);

    // Extract table schema from the current schema id.
    const currentSchemaId = icebergMetadata["current-schema-id"];
    let tableSchema = null;
    if (Array.isArray(icebergMetadata.schemas)) {
      tableSchema = icebergMetadata.schemas.find(
        (s: { [x: string]: any; }) => s["schema-id"] === currentSchemaId
      ) || null;
    }

    // Extract partition details based on the default spec id.
    const defaultSpecId = icebergMetadata["default-spec-id"];
    let partitionDetails = null;
    if (Array.isArray(icebergMetadata["partition-specs"])) {
      partitionDetails = icebergMetadata["partition-specs"].find(
        (spec) => spec["spec-id"] === defaultSpecId
      ) || null;
    }

    const tableProperties = icebergMetadata.properties || null;
    const snapshots = icebergMetadata.snapshots || null;
    
    // Calculate file metrics
    const dataFiles = files.filter((f: { Key: string; }) => f.Key.endsWith(".parquet"));
    const totalDataFileSize = dataFiles.reduce(
      (acc: any, file: { Size: any; }) => acc + (file.Size || 0),
      0
    );
    const dataFileCount = dataFiles.length;
    
    // Get stats for each parquet file (no aggregation)
    const statsArray = await Promise.all(
      dataFiles.map(async (file: { Key: string; }) => {
        try {
          // Extend getParquetFileDetails to return a stats property
          const details = await getParquetFileDetails(bucketName, file.Key, s3Client);
          return {
            key: file.Key,
            stats: details.stats || null,
          };
        } catch (err) {
          console.error("Error fetching parquet stats for", file.Key, err);
          return { key: file.Key, stats: null };
        }
      })
    );

    const versionData = versionedFiles.map((vf: { versionDisplay: any; key: any; version: any; }) => ({
      versionDisplay: vf.versionDisplay,
      key: vf.key,
      version: vf.version,
    }));

    return {
      tableSchema,
      tableProperties,
      partitionDetails,
      versioningFiles: snapshots, // For compatibility
      versionData, // For hierarchical version display
      keyMetrics: {
        totalDataFileSize,
        dataFileCount,
        stats: statsArray, // File-level stats (no aggregation)
      },
    };
  } catch (error) {
    console.error("Error reading Iceberg metadata:", error);
    return null;
  }
}


  

// --- Hudi Extraction ---
// Returns common keys for Hudi tables.
async function extractHudiDetails(
    bucketName: string,
    object: string,
    s3Client: S3Client,
    files: any[]
  ): Promise<any> {
    // Look for the hoodie.properties file explicitly in the .hoodie folder.
    const hoodiePropsKey =
      files.find((f) => f.Key === `${object}/.hoodie/hoodie.properties`)?.Key ||
      files.find((f) => f.Key.endsWith("hoodie.properties"))?.Key;
    if (!hoodiePropsKey) {
      console.error("No hoodie.properties file found in", object);
      return null;
    }
  
    // Read hoodie.properties to get table properties.
    let tableProperties: Record<string, string> = {};
    try {
      const propsResponse = await s3Client.send(
        new GetObjectCommand({ Bucket: bucketName, Key: hoodiePropsKey })
      );
      if (!propsResponse.Body) return null;
      const propsContent = await streamToString(propsResponse.Body);
      propsContent.split(/\r?\n/).forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
          tableProperties[key.trim()] = value.trim();
        }
      });
    } catch (error) {
      console.error("Error reading hoodie.properties:", error);
      return null;
    }
  
    // Look for commit metadata files in the .hoodie/metadata folder.
    // In your Hudi layout, commit metadata may be stored in this folder.
    const commitFiles = files.filter(
      (f) =>
        f.Key.startsWith(`${object}/.hoodie/metadata/`) &&
        f.Key.endsWith(".json")
    );
    let latestCommitKey: string | null = null;
    if (commitFiles.length > 0) {
      // Sort commit files lexically; adjust if your naming convention differs.
      commitFiles.sort((a, b) => b.Key.localeCompare(a.Key));
      latestCommitKey = commitFiles[0].Key;
    } else {
      console.warn("No Hudi commit metadata found for table", object);
    }
  
    let tableSchema = null;
    let partitionDetails = null;
    const versioningFiles: string[] = [];
    if (latestCommitKey) {
      versioningFiles.push(latestCommitKey);
      try {
        const commitResponse = await s3Client.send(
          new GetObjectCommand({ Bucket: bucketName, Key: latestCommitKey })
        );
        if (commitResponse.Body) {
          const commitContent = await streamToString(commitResponse.Body);
          const commitJson = JSON.parse(commitContent);
          // Adjust these field names if your commit metadata uses different names.
          tableSchema = commitJson.schema || null;
          partitionDetails =
            commitJson.partitionColumns || commitJson.partitionPaths || null;
        }
      } catch (error) {
        console.error("Error reading Hudi commit metadata:", error);
      }
    }
  
    // Calculate key metrics based on the parquet files.
    const parquetFiles = files.filter((f) => f.Key.endsWith(".parquet"));
    const totalFileSize = parquetFiles.reduce(
      (acc, file) => acc + (file.Size || 0),
      0
    );
  
    return {
      tableSchema,      // Extracted from commit metadata (if available).
      tableProperties,  // Parsed from hoodie.properties.
      partitionDetails, // Extracted from commit metadata.
      versioningFiles,  // The commit metadata file key.
      keyMetrics: { totalFileSize, fileCount: parquetFiles.length },
    };
  }
  

// --- Parquet Extraction ---
// Returns common keys for plain Parquet tables.
async function extractParquetDetails(
  bucketName: string,
  object: string,
  s3Client: S3Client,
  files: any[]
): Promise<any> {
  const parquetFiles = files.filter((f) => f.Key.endsWith(".parquet"));
  const totalFileSize = parquetFiles.reduce(
    (acc, file) => acc + (file.Size || 0),
    0
  );
  let tableSchema = null;
  let rowCount = 0;
  if (parquetFiles.length > 0) {
    try {
      const details = await getParquetFileDetails(
        bucketName,
        parquetFiles[0].Key,
        s3Client
      );
      tableSchema = details.schema;
      rowCount = details.rowCount;
    } catch (error) {
      console.error("Error extracting Parquet file details:", error);
    }
  }
  return {
    tableSchema,
    tableProperties: null,
    partitionDetails: null,
    versioningFiles: null, // Plain Parquet files don't have version control files
    keyMetrics: {
      totalFileSize,
      fileCount: parquetFiles.length,
      rowCount,
    },
  };
}

// --------------------------------------------------------------------------------
// --- Main Handler (Updated to include version display in response) ---
export const POST = async (req: Request): Promise<Response> => {
  try {
    const { roleArn, bucketName, bucketRegion } = await req.json();
    console.log(
      "Received - roleArn:",
      roleArn,
      "bucketName:",
      bucketName,
      "bucketRegion:",
      bucketRegion
    );
    if (!roleArn || !bucketName || !bucketRegion) {
      return new Response(
        JSON.stringify({
          error: "Role ARN, bucket name, and bucket region are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return new Response(
        JSON.stringify({
          error: "Base AWS credentials are missing in environment variables",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- Step 1: Assume Role and Initialize S3 Client ---
    const stsClient = new STSClient({ region: process.env.AWS_REGION });
    const assumeRoleResponse = await stsClient.send(
      new AssumeRoleCommand({
        RoleArn: roleArn,
        RoleSessionName: `AssumeRoleSession-${Date.now()}`,
        DurationSeconds: 3600,
      })
    );
    if (!assumeRoleResponse.Credentials) {
      return new Response(JSON.stringify({ error: "Failed to assume role" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    const s3Client = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId: assumeRoleResponse.Credentials.AccessKeyId!,
        secretAccessKey: assumeRoleResponse.Credentials.SecretAccessKey!,
        sessionToken: assumeRoleResponse.Credentials.SessionToken!,
      },
    });

    // --- Step 2: List and Group Bucket Objects ---
    const allObjects = await listAllObjects(bucketName, s3Client);
    const objectMap = groupObjectsByobject(allObjects);

    // --- Step 3: Process Each Table and Extract Details ---
    const tables = await Promise.all(
      Object.entries(objectMap).map(async ([object, files]) => {
        const detectedFormat = detectTableFormat(object, files);
        const tableResult: any = {
          tableName: object,
          formatType: detectedFormat,
          totalFiles: files.length,
        };
        switch (detectedFormat) {
          case TableFormat.Delta:
            tableResult.details = await extractDeltaDetails(
              bucketName,
              object,
              s3Client,
              files
            );
            // Add version structure for UI display
            if (tableResult.details && tableResult.details.versionData) {
              tableResult.versions = tableResult.details.versionData.map((v: { versionDisplay: any; key: any; }) => ({
                display: v.versionDisplay,
                key: v.key
              }));
            }
            break;
          case TableFormat.Iceberg:
            tableResult.details = await extractIcebergDetails(
              bucketName,
              object,
              s3Client,
              files
            );
            // Add version structure for UI display
            if (tableResult.details && tableResult.details.versionData) {
              tableResult.versions = tableResult.details.versionData.map((v: { versionDisplay: any; key: any; }) => ({
                display: v.versionDisplay,
                key: v.key
              }));
            }
            break;
          case TableFormat.Hudi:
            tableResult.details = await extractHudiDetails(
              bucketName,
              object,
              s3Client,
              files
            );
            break;
          case TableFormat.Parquet:
            tableResult.details = await extractParquetDetails(
              bucketName,
              object,
              s3Client,
              files
            );
            break;
          default:
            tableResult.message =
              "Format could not be identified or is not supported.";
        }
        return tableResult;
      })
    );

    // Build final response JSON with a single bucket.
    const responseData = {
      bucket: {
        bucketName,
        region: bucketRegion,
        tables,
      },
    };

    console.log("Response Data:", JSON.stringify(responseData, null, 2));
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to access S3 bucket",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
