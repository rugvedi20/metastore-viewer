"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface DataItem {
  name: string
  value: number
  color: string
}

export function StorageDistribution() {
  const [data, setData] = useState<DataItem[]>([
    { name: "Data", value: 75, color: "#3b82f6" },
    { name: "Metadata", value: 15, color: "#8b5cf6" },
    { name: "Indexes", value: 10, color: "#10b981" },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newData = [...data]
        // Randomly adjust values while keeping total at 100
        const idx1 = Math.floor(Math.random() * 3)
        const idx2 = (idx1 + 1) % 3
        const change = Math.floor(Math.random() * 5) + 1

        if (newData[idx1].value > change) {
          newData[idx1].value -= change
          newData[idx2].value += change
          setData(newData)
        }
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [data])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          animationDuration={1000}
          animationBegin={0}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              className="hover:opacity-80 transition-opacity"
              stroke="rgba(0, 0, 0, 0.1)"
              strokeWidth={1}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value}%`, "Percentage"]}
          contentStyle={{
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "var(--radius)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

