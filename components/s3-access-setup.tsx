"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Clipboard, ChevronDown } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// AWS S3 regions data from the screenshot
const awsRegions = [
  { name: "N. Virginia", value: "us-east-1" },
  { name: "Ohio", value: "us-east-2" },
  { name: "N. California", value: "us-west-1" },
  { name: "Oregon", value: "us-west-2" },
  { name: "Mumbai", value: "ap-south-1" },
  { name: "Osaka", value: "ap-northeast-3" },
  { name: "Seoul", value: "ap-northeast-2" },
  { name: "Singapore", value: "ap-southeast-1" },
  { name: "Sydney", value: "ap-southeast-2" },
  { name: "Tokyo", value: "ap-northeast-1" },
  { name: "Central", value: "ca-central-1" },
  { name: "Frankfurt", value: "eu-central-1" },
  { name: "Ireland", value: "eu-west-1" },
  { name: "London", value: "eu-west-2" },
  { name: "Paris", value: "eu-west-3" },
  { name: "Stockholm", value: "eu-north-1" },
  { name: "São Paulo", value: "sa-east-1" },
];

export default function S3AccessSetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [bucketName, setBucketName] = useState("");
  const [roleARN, setRoleARN] = useState("");
  const [region, setRegion] = useState("us-east-1"); // Default to N. Virginia

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1424] text-white p-6">
      <Card className="p-8 max-w-3xl w-full rounded-2xl shadow-lg bg-[#1a2237]">
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-4 text-white">
              Step 1: Enter Your S3 Bucket Information
            </h2>
            <p className="mb-4 text-gray-200">
              Please provide your S3 bucket name and select the AWS region where
              your bucket is located.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="bucketName"
                  className="block text-sm font-medium text-gray-200 mb-1"
                >
                  S3 Bucket Name
                </label>
                <Input
                  id="bucketName"
                  type="text"
                  placeholder="Enter your S3 Bucket Name"
                  value={bucketName}
                  onChange={(e) => setBucketName(e.target.value)}
                  className="p-3 w-full rounded-lg border border-gray-600 bg-[#0d1424] text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-200 mb-1"
                >
                  AWS Region
                </label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="w-full p-3 rounded-lg bg-[#0d1424] text-white border-gray-600">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2237] text-white border-gray-600">
                    {awsRegions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.name} ({region.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="mt-6 bg-blue-600 hover:bg-blue-700">
              Next
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-4 text-white">Step 2: Set Up IAM Role</h2>
            <p className="mb-4 text-gray-200">
              Follow these steps to create an IAM Role and provide necessary
              permissions:
            </p>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold text-white">1.</span>
                <p className="text-gray-200">
                  Go to the{" "}
                  <a
                    href="https://console.aws.amazon.com/iam"
                    target="_blank"
                    className="text-blue-400 underline"
                  >
                    AWS IAM Console
                  </a>{" "}
                  and select <strong>Roles</strong>.
                </p>
              </div>
              <Image
                src="/images/step1.png"
                alt="Step 1 - IAM Console"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
              />

              {/* Step 2 */}
              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold text-white">2.</span>
                <p className="text-gray-200">
                  Click <strong>Create Role</strong>.
                </p>
              </div>
              <Image
                src="/images/step2.png"
                alt="Step 2 - Create Role"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
              />

              {/* Step 3 */}
              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold text-white">3.</span>
                <p className="text-gray-200">
                  Choose <strong>AWS account</strong> and then{" "}
                  <strong>Another AWS account</strong>.
                </p>
              </div>
              <Image
                src="/images/step3.png"
                alt="Step 3 - Choose AWS Account"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
              />

              {/* Step 4 */}
              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold text-white">4.</span>
                <p className="text-gray-200">
                  Enter the <strong>Account ID</strong> of our service:
                </p>
              </div>
              <div className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
                <span>524823245271</span>
                {/* <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard("524823245271")}
                >
                  <Clipboard className="w-5 h-5" />
                </Button> */}
              </div>

              {/* Step 5 */}
              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold text-white">5.</span>
                <p className="text-gray-200">
                  Search and attach the <strong>AmazonS3ReadOnlyAccess</strong>{" "}
                  policy.
                </p>
              </div>
              <Image
                src="/images/step5.png"
                alt="Step 5 - Attach Policy"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
              />

              {/* Step 6 */}
              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold text-white">6.</span>
                <p className="text-gray-200">
                  Add a <strong>Role Name</strong> and{" "}
                  <strong>Description</strong>, then click{" "}
                  <strong>Create Role</strong>.
                </p>
              </div>
              <Image
                src="/images/step6.png"
                alt="Step 6 - Add Role Name"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
              />

              {/* Step 7 */}
              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold text-white">7.</span>
                <p className="text-gray-200">
                  Go to <strong>Roles</strong> and select the newly created
                  role.
                </p>
              </div>
              <Image
                src="/images/step7.png"
                alt="Step 7 - Select Role"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
              />

              {/* Step 8 */}
              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold text-white">8.</span>
                <p className="text-gray-200">
                  Go to the <strong>Trust Relationships</strong> section and
                  click <strong>Edit Policy</strong>.
                </p>
              </div>
              <Image
                src="/images/step8.png"
                alt="Step 8 - Edit Trust Policy"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
              />

              {/* Step 9 */}
              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold text-white">9.</span>
                <p className="text-gray-200">
                  Paste the following <strong>Trust Policy</strong> and click{" "}
                  <strong>Update Policy</strong>:
                </p>
              </div>
              <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
                {`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::524823245271:user/Devang-IAM"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}`}
              </pre>

              {/* Step 10 */}
              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold text-white">10.</span>
                <p className="text-gray-200">
                  <strong>Updated Policy</strong> and you're done!
                </p>
              </div>
              <Image
                src="/images/step10.png"
                alt="Step 10 - Final Step"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="flex justify-between mt-6">
              <Button onClick={() => setStep(1)} variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-800">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-4 text-white">
              Step 3: Enter Your IAM Role ARN
            </h2>
            <p className="mb-2 text-gray-200">Enter the exact IAM Role ARN of you created.</p>
            <Input
              type="text"
              placeholder="Ex.arn:aws:iam::105580758693:role/MetaNexus"
              value={roleARN}
              onChange={(e) => setRoleARN(e.target.value)}
              className="mb-4 p-3 w-full rounded-lg border border-gray-600 bg-[#0d1424] text-white"
            />
            <div className="flex justify-between">
              <Button onClick={() => setStep(2)} variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-800">
                Back
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch("/api/assumeRole", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        roleArn: roleARN,
                        bucketName: bucketName,
                        bucketRegion: region,
                      }),
                    });
                  
                    const data = await response.json();
                  
                    // Store data in localStorage
                    localStorage.setItem("storedParams", JSON.stringify(data));
                  
                    // Navigate to the output page
                    router.push(`/output`);
                  } catch (error) {
                    console.error("Error:", error);
                  }
                  
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
