"use client";

import React, { useState, useEffect } from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  LinearScale,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Info,
  Search,
  Database,
  BarChart2,
  ArrowLeft,
  MessageSquare,
  FileType2,
} from "lucide-react";
import { formatBytes } from "@/lib/utils"; // You'll need to create this utility

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend, Title, LinearScale);

// Define types for our data structure
interface TableDetails {
  keyMetrics?: {
    totalDataFileSize?: number;
    totalFileSize?: number;
    fileCount?: number;
    rowCount?: number;
    stats?: Array<{
      numRecords?: number;
      minValues?: Record<string, any>;
      maxValues?: Record<string, any>;
      nullCount?: Record<string, number>;
    }>;
  };
  tableSchema?: any;
  tableProperties?: any;
  partitionDetails?: any;
  versioningFiles?: any;
}

interface Table {
  tableName: string;
  formatType: string;
  totalFiles: number;
  details?: TableDetails;
  message?: string;
}

interface Bucket {
  bucketName: string;
  region: string;
  tables: Table[];
}

interface Data {
  bucket: Bucket;
}

const parseSchemaString = (schemaString: any) => {
  if (!schemaString) return [];
  try {
    // Try parsing as JSON
    const parsed = JSON.parse(schemaString);

    // Handle Parquet JSON schema (tableSchema.fields)
    if (
      parsed.tableSchema &&
      parsed.tableSchema.fields &&
      Array.isArray(parsed.tableSchema.fields)
    ) {
      return parsed.tableSchema.fields.map((field) => ({
        name: field.name || field.field_name,
        type: field.type, // e.g. "long", "string", etc.
        nullable: field.required !== true, // "required": false means nullable
      }));
    }

    // If parsed JSON has a "fields" array
    if (Array.isArray(parsed.fields)) {
      return parsed.fields.map((field) => ({
        name: field.name || field.field_name,
        type:
          typeof field.type === "object"
            ? field.type.primitiveType ||
              field.type.name ||
              JSON.stringify(field.type)
            : field.type || field.data_type,
        nullable: field.nullable !== false,
      }));
    }
  } catch (e) {
    // Not valid JSON? Continue to try regex-based or other parsing.
  }

  // Fallback: if schemaString contains Delta Lake format or similar
  if (schemaString.includes("struct<") || schemaString.includes("StructType")) {
    // Try to extract fields from Delta Lake schema string using regex.
    const fieldsMatch =
      schemaString.match(/struct<(.*)>/i) ||
      schemaString.match(/StructType\(StructField\((.*)\)\)/i) ||
      schemaString.match(/StructType\((.*)\)/i);
    if (fieldsMatch && fieldsMatch[1]) {
      const fieldList = parseNestedFields(fieldsMatch[1]);
      return fieldList.map((fieldStr) => {
        // Try "name:type" format
        let match = fieldStr.match(
          /([^:]+):([^,]+)(?:,\s*nullable\s*=\s*(\w+))?/
        );
        if (match) {
          const [_, name, type, nullableStr] = match;
          return {
            name: name.trim(),
            type: type.trim(),
            nullable: nullableStr ? nullableStr.toLowerCase() === "true" : true,
          };
        }
        // Fallback simple parsing
        const parts = fieldStr.trim().split(/\s+/);
        if (parts.length >= 2) {
          return {
            name: parts[0],
            type: parts
              .slice(1)
              .join(" ")
              .replace(/NOT NULL$/i, "")
              .trim(),
            nullable: !fieldStr.toUpperCase().includes("NOT NULL"),
          };
        }
        return { name: fieldStr, type: "unknown", nullable: true };
      });
    }
  }

  // Last resort: split by lines and try to extract fields
  const lines = schemaString.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length > 0) {
    return lines.map((line) => {
      const match = line.match(/([^\s]+)\s+([^\s]+)(?:\s+(.*))?/);
      if (match) {
        return {
          name: match[1],
          type: match[2],
          nullable: !(match[3] && match[3].toUpperCase().includes("NOT NULL")),
        };
      }
      return { name: line, type: "unknown", nullable: true };
    });
  }

  // If no method succeeded, return an empty array
  return [];
};

// Helper to split nested field definitions (used for Delta Lake schemas)
const parseNestedFields = (fieldsString) => {
  const fields = [];
  let current = "";
  let depth = 0;
  let inQuotes = false;

  for (let i = 0; i < fieldsString.length; i++) {
    const char = fieldsString[i];
    if (char === '"' || char === "'") {
      if (i === 0 || fieldsString[i - 1] !== "\\") {
        inQuotes = !inQuotes;
      }
    }
    if (!inQuotes) {
      if (char === "(" || char === "<" || char === "[") depth++;
      if (char === ")" || char === ">" || char === "]") depth--;
    }
    if (char === "," && depth === 0 && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) fields.push(current.trim());
  return fields;
};
export default function Dashboard() {
  // State for decoded JSON data, selected table, and search filter.
  const [data, setData] = useState<Data | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // On mount, read the "data" query parameter, decode and parse it.
  useEffect(() => {
    const jsonData = localStorage.getItem("storedParams");

    if (jsonData) {
      try {
        const parsedData: Data = JSON.parse(jsonData); // No need for decodeURIComponent
        setData(parsedData);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <Card className="w-96 bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-blue-400">
              Data Lake Explorer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4 text-blue-500 animate-spin h-10 w-10 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <p className="text-slate-300">
              Loading your data lake information...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bucket = data.bucket;

  // Calculate bucket size by summing sizes from each table (if available)
  const bucketSize = bucket.tables.reduce((acc, table) => {
    const size =
      table.details?.keyMetrics?.totalDataFileSize ||
      table.details?.keyMetrics?.totalFileSize ||
      0;
    return acc + size;
  }, 0);

  // Filter tables based on the search input.
  const filteredTables = bucket.tables.filter((table) =>
    table.tableName.toLowerCase().includes(filter.toLowerCase())
  );

  // Calculate the table format distribution for the chart.
  const formatCounts = bucket.tables.reduce<Record<string, number>>(
    (acc, table) => {
      const fmt = table.formatType;
      acc[fmt] = (acc[fmt] || 0) + 1;
      return acc;
    },
    {}
  );

  // Calculate size distribution per format
  const formatSizes = bucket.tables.reduce<Record<string, number>>(
    (acc, table) => {
      const fmt = table.formatType;
      const size =
        table.details?.keyMetrics?.totalDataFileSize ||
        table.details?.keyMetrics?.totalFileSize ||
        0;
      acc[fmt] = (acc[fmt] || 0) + size;
      return acc;
    },
    {}
  );

  const formatLabels = Object.keys(formatCounts);
  const formatColors = [
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 99, 132, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
  ];

  const formatCountChartData = {
    labels: formatLabels,
    datasets: [
      {
        label: "Number of Tables",
        data: Object.values(formatCounts),
        backgroundColor: formatColors,
        borderColor: formatColors.map((color) => color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  const formatSizeChartData = {
    labels: formatLabels,
    datasets: [
      {
        label: "Storage Size",
        data: Object.values(formatSizes),
        backgroundColor: formatColors,
        borderColor: formatColors.map((color) => color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "white",
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            if (context.dataset.label === "Storage Size") {
              return ` ${context.label}: ${formatBytes(context.raw)}`;
            }
            return ` ${context.label}: ${context.raw} tables`;
          },
        },
      },
    },
  };

  // If no table is selected, show the Bucket Detail Page.
  if (!selectedTable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Data Lake Explorer
              </h1>
              <p className="text-slate-400 mt-1">
                Analyze and explore your data lake structures
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => (window.location.href = "/chat")}
                className="bg-[#ff6384] hover:bg-slate-600"
              >
                Ask MetaNexus
              </Button>
            </div>
          </div>
        </header>

        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <Database size={18} className="text-blue-400" />
              <CardTitle>Bucket Overview</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              {bucket.bucketName} • {bucket.region} • {bucket.tables.length}{" "}
              tables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-700/50 rounded-lg p-4 flex flex-col">
                <span className="text-sm font-medium text-slate-400">
                  Bucket Name
                </span>
                <span className="text-2xl font-bold mt-1 text-blue-400">
                  {bucket.bucketName}
                </span>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 flex flex-col">
                <span className="text-sm font-medium text-slate-400">
                  Region
                </span>
                <span className="text-2xl font-bold mt-1 text-indigo-400">
                  {bucket.region}
                </span>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 flex flex-col">
                <span className="text-sm font-medium text-slate-400">
                  Total Size
                </span>
                <span className="text-2xl font-bold mt-1 text-emerald-400">
                  {formatBytes(bucketSize)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BarChart2 size={18} className="text-blue-400" />
                <CardTitle>Storage Analytics</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Visualization of table formats and storage distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="count" className="w-full">
                <TabsList className="mb-4 bg-slate-700/50">
                  <TabsTrigger value="count">Table Count</TabsTrigger>
                  <TabsTrigger value="size">Storage Size</TabsTrigger>
                </TabsList>
                <TabsContent value="count" className="mt-0">
                  <div className="h-64">
                    <Doughnut
                      data={formatCountChartData}
                      options={chartOptions}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="size" className="mt-0">
                  <div className="h-64">
                    <Doughnut
                      data={formatSizeChartData}
                      options={chartOptions}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Search size={18} className="text-blue-400" />
                <CardTitle>Find Tables</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Search for specific tables in this bucket
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by table name"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-8 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="text-sm text-slate-400">
                  {filteredTables.length} tables available
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileType2 size={18} className="text-blue-400" />
                <CardTitle>Tables in Bucket</CardTitle>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-500/10 text-blue-400 border-blue-500/30"
              >
                {bucket.tables.length} Tables
              </Badge>
            </div>
            <CardDescription className="text-slate-400">
              Detailed list of all tables in your data lake
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ScrollArea className="h-[420px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700 text-left text-xs text-slate-400">
                      <th className="p-3 font-medium">Table Name</th>
                      <th className="p-3 font-medium">Format</th>
                      <th className="p-3 font-medium">Size</th>
                      <th className="p-3 font-medium">Files</th>
                      <th className="p-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTables.map((table) => {
                      const size =
                        table.details?.keyMetrics?.totalDataFileSize ||
                        table.details?.keyMetrics?.totalFileSize ||
                        0;
                      return (
                        <tr
                          key={table.tableName}
                          className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="p-3 font-medium truncate max-w-xs">
                            <div className="flex items-center">
                              <Database
                                size={16}
                                className="mr-2 text-slate-400"
                              />
                              <span>{table.tableName}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge
                              className={
                                table.formatType === "parquet"
                                  ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                  : table.formatType === "delta"
                                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                  : table.formatType === "iceberg"
                                  ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                                  : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                              }
                            >
                              {table.formatType}
                            </Badge>
                          </td>
                          <td className="p-3 text-slate-300">
                            {formatBytes(size)}
                          </td>
                          <td className="p-3 text-slate-300">
                            {table.totalFiles}
                          </td>
                          <td className="p-3">
                            <Button
                              onClick={() => setSelectedTable(table)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* AI Chatbot Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg shadow-blue-900/20 group"
            onClick={() => alert("Chatbot activated!")}
          >
            <MessageSquare
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
          </Button>
        </div>
      </div>
    );
  }

  // Table Detail Page
  // Extract basic values for display.
  const tableSize =
    selectedTable.details?.keyMetrics?.totalDataFileSize ||
    selectedTable.details?.keyMetrics?.totalFileSize ||
    0;
  const fileCount =
    selectedTable.details?.keyMetrics?.fileCount ||
    selectedTable.totalFiles ||
    0;
  const rowCount = selectedTable.details?.keyMetrics?.rowCount || "N/A";
  const schema = selectedTable.details?.tableSchema;
  const partitioning = selectedTable.details?.partitionDetails;
  const versioning = selectedTable.details?.versioningFiles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <header className="mb-8">
        <Button
          onClick={() => setSelectedTable(null)}
          className="mb-4 bg-slate-700 hover:bg-slate-600 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Bucket
        </Button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              <span className="mr-2">{selectedTable.tableName}</span>
              <Badge
                className={
                  selectedTable.formatType === "parquet"
                    ? "bg-blue-500/20 text-blue-400"
                    : selectedTable.formatType === "delta"
                    ? "bg-green-500/20 text-green-400"
                    : selectedTable.formatType === "iceberg"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-orange-500/20 text-orange-400"
                }
              >
                {selectedTable.formatType}
              </Badge>
            </h1>
            <p className="text-slate-400 mt-1">
              Table details and schema information
            </p>
          </div>
        </div>
      </header>

      <Card className="bg-slate-800/50 border-slate-700 mb-8">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <Info size={18} className="text-blue-400" />
            <CardTitle>Table Overview</CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            Key metrics and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-700/50 rounded-lg p-4 flex flex-col">
              <span className="text-sm font-medium text-slate-400">
                Storage Size
              </span>
              <span className="text-2xl font-bold mt-1 text-blue-400">
                {formatBytes(tableSize)}
              </span>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 flex flex-col">
              <span className="text-sm font-medium text-slate-400">
                File Count
              </span>
              <span className="text-2xl font-bold mt-1 text-indigo-400">
                {fileCount}
              </span>
            </div>
            {/* <div className="bg-slate-700/50 rounded-lg p-4 flex flex-col">
              <span className="text-sm font-medium text-slate-400">Row Count</span>
              <span className="text-2xl font-bold mt-1 text-emerald-400">{rowCount}</span>
            </div> */}
            <div className="bg-slate-700/50 rounded-lg p-4 flex flex-col">
              <span className="text-sm font-medium text-slate-400">Format</span>
              <span className="text-2xl font-bold mt-1 text-purple-400">
                {selectedTable.formatType}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-slate-700/50 border-b border-slate-700 w-full justify-start p-0 h-auto">
          <TabsTrigger
            value="overview"
            className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none"
          >
            Schema
          </TabsTrigger>
          <TabsTrigger
            value="partitioning"
            className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none"
          >
            Partitioning
          </TabsTrigger>
          <TabsTrigger
            value="versioning"
            className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none"
          >
            Versioning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileType2 size={18} className="text-blue-400" />
                <CardTitle>Table Schema</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Structure and data types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schema ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-700/50 text-left">
                        <th className="p-3 border-b border-slate-600 font-medium text-slate-300">
                          Column Name
                        </th>
                        <th className="p-3 border-b border-slate-600 font-medium text-slate-300">
                          Data Type
                        </th>
                        <th className="p-3 border-b border-slate-600 font-medium text-slate-300">
                          Nullable
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let schemaFields = [];
                        if (schema.schemaString) {
                          schemaFields = parseSchemaString(schema.schemaString);
                        } else if (schema.fields) {
                          if (Array.isArray(schema.fields)) {
                            schemaFields = schema.fields.map((field) => ({
                              name: field.name || field.field_name,
                              type: field.type,
                              nullable:
                                field.nullable !== false &&
                                field.required !== true,
                            }));
                          } else if (typeof schema.fields === "object") {
                            schemaFields = Object.entries(schema.fields).map(
                              ([name, field]) => ({
                                name,
                                type:
                                  typeof field === "object"
                                    ? field.type || JSON.stringify(field)
                                    : field,
                                nullable: true,
                              })
                            );
                          }
                        }
                        return schemaFields.length > 0 ? (
                          schemaFields.map((field, index) => (
                            <tr
                              key={index}
                              className="border-b border-slate-700/30 hover:bg-slate-700/20"
                            >
                              <td className="p-3 font-mono text-blue-300">
                                {field.name}
                              </td>
                              <td className="p-3 text-green-300 font-mono">
                                {field.type}
                              </td>
                              <td className="p-3 text-slate-300">
                                {field.nullable ? (
                                  <span className="text-green-400">Yes</span>
                                ) : (
                                  <span className="text-red-400">No</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="p-4 text-center text-slate-400"
                            >
                              Schema structure detected but couldn't parse
                              fields.
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-md border border-slate-700 bg-slate-900/50 p-4 text-center text-slate-400">
                  No schema information available.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partitioning" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileType2 size={18} className="text-blue-400" />
                <CardTitle>Partitioning Details</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                How data is organized for query performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 rounded-md border border-slate-700 bg-slate-900/50 p-4">
                <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm">
                  {partitioning
                    ? JSON.stringify(partitioning, null, 2)
                    : "No partitioning details available."}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versioning" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileType2 size={18} className="text-blue-400" />
                <CardTitle>Versioning and Snapshots</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Time travel capabilities and version history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 rounded-md border border-slate-700 bg-slate-900/50 p-4">
                <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm">
                  {versioning
                    ? JSON.stringify(versioning, null, 2)
                    : "No versioning/snapshot details available."}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Statistics Section */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <h2 className="text-xl font-bold text-slate-200">Statistics</h2>

        {/* Per-Column Min/Max Table */}
        <div className="mt-4">
          <span className="text-sm font-medium text-slate-400">
            Per-Column Min/Max Values
          </span>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-lg">
              <thead>
                <tr>
                  <th className="p-2 text-left">Column Name</th>
                  <th className="p-2 text-left">Min Value</th>
                  <th className="p-2 text-left">Max Value</th>
                </tr>
              </thead>
              <tbody>
                {selectedTable.details?.keyMetrics?.stats &&
                selectedTable.details.keyMetrics.stats.length > 0 &&
                selectedTable.details.keyMetrics.stats[0]?.minValues ? (
                  Object.keys(
                    selectedTable.details.keyMetrics.stats[0].minValues
                  ).map((colName) => (
                    <tr key={colName} className="border-b border-slate-600">
                      <td className="p-2">{colName}</td>
                      <td className="p-2">
                        {
                          selectedTable.details.keyMetrics.stats[0].minValues[
                            colName
                          ]
                        }
                      </td>
                      <td className="p-2">
                        {
                          selectedTable.details.keyMetrics.stats[0].maxValues[
                            colName
                          ]
                        }
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2" colSpan={3}>
                      No statistics available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
