import type { Metadata } from "next"
import S3AccessSetup from "@/components/s3-access-setup"

export const metadata: Metadata = {
  title: "AI-Powered Metadata Viewer",
  description: "Explore and analyze metadata with AI-powered insights",
}

export default function Home() {
  return <S3AccessSetup />
}

