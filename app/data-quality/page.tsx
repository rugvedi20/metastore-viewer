import type { Metadata } from "next"
import { DataQualityInsights } from "@/components/data-quality-insights"

export const metadata: Metadata = {
  title: "Data Quality - MetaNexus Metadata Explorer",
  description: "Automated data quality insights for your metadata",
}

export default function DataQualityPage() {
  return <DataQualityInsights />
}

