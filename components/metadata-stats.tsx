"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, FileText, BarChart2, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function MetadataStats() {
  const [rowCount, setRowCount] = useState(42.7)
  const [rowCountChange, setRowCountChange] = useState(2.8)
  const [isUpdating, setIsUpdating] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsUpdating(true)

        setTimeout(() => {
          const newRowCount = rowCount + (Math.random() * 0.3 - 0.1)
          const newChange = rowCountChange + (Math.random() * 0.5 - 0.2)

          setRowCount(Number.parseFloat(newRowCount.toFixed(1)))
          setRowCountChange(Number.parseFloat(newChange.toFixed(1)))
          setIsUpdating(false)
        }, 800)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [rowCount, rowCountChange])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <>
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="metanexus-stat-card-dark">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
            <CardTitle className="text-sm font-medium">Table Format</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="metanexus-stat-value">Iceberg</div>
            <p className="text-xs text-muted-foreground">Format Version: 2</p>
            <p className="text-xs text-muted-foreground">Spec: org.apache.iceberg.2</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
        <Card className={`metanexus-stat-card-dark ${isUpdating ? "metanexus-pulse" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
            <CardTitle className="text-sm font-medium">Row Count</CardTitle>
            <BarChart2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="metanexus-stat-value">{rowCount}M</div>
            <p
              className={`text-xs ${rowCountChange >= 0 ? "metanexus-success-gradient-text" : "metanexus-destructive-gradient-text"} flex items-center`}
            >
              <span className={`inline-block h-3 w-3 mr-1 ${rowCountChange >= 0 ? "rotate-45" : "-rotate-45"}`}>↑</span>
              {rowCountChange >= 0 ? "+" : ""}
              {rowCountChange}% from last snapshot
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="metanexus-stat-card-dark">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
            <CardTitle className="text-sm font-medium">Storage Size</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="metanexus-stat-value">3.91 GB</div>
            <p className="text-xs text-muted-foreground">Data Files: 68</p>
            <p className="text-xs text-muted-foreground">Avg. File Size: 58.9 MB</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="metanexus-stat-card-dark">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
            <CardTitle className="text-sm font-medium">Current Version</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="metanexus-stat-value">v24</div>
            <p className="text-xs text-muted-foreground">Last Updated: 35 minutes ago</p>
            <p className="text-xs text-muted-foreground">Total Snapshots: 4</p>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}

