"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Database, RefreshCw, AlertTriangle } from "lucide-react"

type ActivityType = "schema_change" | "data_update" | "query" | "alert"

interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  time: string
  user: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "act1",
      type: "schema_change",
      title: "Schema Updated",
      description: "customer_profiles table schema updated",
      time: "10 min ago",
      user: "data-team",
    },
    {
      id: "act2",
      type: "data_update",
      title: "Data Refreshed",
      description: "transactions table data refreshed",
      time: "25 min ago",
      user: "etl-pipeline",
    },
    {
      id: "act3",
      type: "query",
      title: "Query Executed",
      description: "SELECT * FROM customer_profiles LIMIT 100",
      time: "1 hour ago",
      user: "john.doe",
    },
    {
      id: "act4",
      type: "alert",
      title: "Quality Alert",
      description: "Missing values detected in email column",
      time: "2 hours ago",
      user: "data-quality-monitor",
    },
  ])

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "schema_change":
        return <Database className="h-4 w-4 text-primary" />
      case "data_update":
        return <RefreshCw className="h-4 w-4 text-green-500" />
      case "query":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
    }
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto metanexus-scrollbar">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          className="metanexus-activity-item"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="metanexus-activity-icon bg-secondary/50">{getActivityIcon(activity.type)}</div>
          <div className="metanexus-activity-content">
            <div className="metanexus-activity-title">{activity.title}</div>
            <div className="text-xs text-muted-foreground">{activity.description}</div>
          </div>
          <div className="text-xs text-muted-foreground">{activity.time}</div>
        </motion.div>
      ))}
    </div>
  )
}

