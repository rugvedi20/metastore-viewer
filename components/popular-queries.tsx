"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Terminal, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Query {
  id: string
  query: string
  description: string
  usageCount: number
}

export function PopularQueries() {
  const [queries, setQueries] = useState<Query[]>([
    {
      id: "q1",
      query: "SELECT * FROM customer_profiles WHERE signup_date > '2024-01-01'",
      description: "Recent customers",
      usageCount: 156,
    },
    {
      id: "q2",
      query: "SELECT AVG(lifetime_value) FROM customer_profiles",
      description: "Average customer value",
      usageCount: 124,
    },
    {
      id: "q3",
      query: "SELECT COUNT(*) FROM transactions WHERE amount > 1000",
      description: "High-value transactions",
      usageCount: 98,
    },
  ])

  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (id: string, query: string) => {
    navigator.clipboard.writeText(query)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto metanexus-scrollbar">
      {queries.map((query, index) => (
        <motion.div
          key={query.id}
          className="p-3 rounded-md bg-secondary/30 border border-border/40"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Terminal className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium">{query.description}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleCopy(query.id, query.query)}>
              {copiedId === query.id ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <div className="text-xs font-mono bg-secondary/50 p-2 rounded-md overflow-x-auto whitespace-nowrap">
            {query.query}
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-right">Used {query.usageCount} times</div>
        </motion.div>
      ))}
    </div>
  )
}

