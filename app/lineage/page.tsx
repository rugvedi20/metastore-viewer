import type { Metadata } from "next"
import { DataLineage } from "@/components/data-lineage"

export const metadata: Metadata = {
  title: "Data Lineage - MetaNexus Metadata Explorer",
  description: "Visualize data flow and dependencies",
}

export default function DataLineagePage() {
  return <DataLineage />
}

