import type { Metadata } from "next"
import { SchemaRegistry } from "@/components/schema-registry"

export const metadata: Metadata = {
  title: "Schema Registry - MetaNexus Metadata Explorer",
  description: "Manage and version your data schemas",
}

export default function SchemaRegistryPage() {
  return <SchemaRegistry />
}

