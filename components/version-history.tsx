"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts"

interface DataItem {
  version: string
  changes: number
}

export function VersionHistory() {
  const [data, setData] = useState<DataItem[]>([
    { version: "v20", changes: 12 },
    { version: "v21", changes: 8 },
    { version: "v22", changes: 15 },
    { version: "v23", changes: 6 },
    { version: "v24", changes: 10 },
  ])

  const [average, setAverage] = useState(0)

  // Calculate average
  useEffect(() => {
    const avg = data.reduce((sum, item) => sum + item.changes, 0) / data.length
    setAverage(Number.parseFloat(avg.toFixed(1)))
  }, [data])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newData = [...data]
        // Add a new version
        const lastVersion = Number.parseInt(data[data.length - 1].version.substring(1))
        const newVersion = `v${lastVersion + 1}`
        const newChanges = Math.floor(Math.random() * 10) + 5

        // Remove the first item and add the new one
        newData.shift()
        newData.push({ version: newVersion, changes: newChanges })

        setData(newData)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [data])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis
          dataKey="version"
          tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.6)" }}
          axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
          tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.6)" }}
          axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
          tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "var(--radius)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
          }}
          formatter={(value) => [`${value} changes`, "Changes"]}
          labelFormatter={(label) => `Version ${label}`}
        />
        <ReferenceLine
          y={average}
          stroke="#8b5cf6"
          strokeDasharray="3 3"
          label={{
            value: `Avg: ${average}`,
            fill: "#8b5cf6",
            fontSize: 12,
            position: "right",
          }}
        />
        <Bar
          dataKey="changes"
          fill="url(#colorGradient)"
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
          animationBegin={0}
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}

