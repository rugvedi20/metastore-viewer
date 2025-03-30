import type { Metadata } from "next"
import { QueryGenerator } from "@/components/query-generator"

export const metadata: Metadata = {
  title: "Query Generator - MetaNexus Metadata Explorer",
  description: "Generate SQL queries using natural language",
}

export default function QueryGeneratorPage() {
  return <QueryGenerator />
}

