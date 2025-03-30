"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export function MetadataHealth() {
  const [score, setScore] = useState(82)
  const [issues, setIssues] = useState({
    high: 2,
    medium: 3,
    low: 1,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newScore = Math.max(0, Math.min(100, score + (Math.random() * 6 - 3)))
        setScore(Math.round(newScore))
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [score])

  const getScoreColor = () => {
    if (score >= 80) return "#10b981" // Green
    if (score >= 60) return "#f59e0b" // Amber
    return "#ef4444" // Red
  }

  const getScoreText = () => {
    if (score >= 80) return "Healthy"
    if (score >= 60) return "Needs Attention"
    return "Critical Issues"
  }

  const circumference = 2 * Math.PI * 60
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="metanexus-gauge mb-4">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle className="metanexus-gauge-bg" cx="75" cy="75" r="60" />
          <circle
            className="metanexus-gauge-fill"
            cx="75"
            cy="75"
            r="60"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ stroke: getScoreColor() }}
          />
          <text className="metanexus-gauge-text" x="75" y="70" fill={getScoreColor()}>
            {score}
          </text>
          <text className="metanexus-gauge-label" x="75" y="90">
            {getScoreText()}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-500/20 mb-2">
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-lg font-bold">{issues.high}</div>
          <div className="text-xs text-muted-foreground">High</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/20 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold">{issues.medium}</div>
          <div className="text-xs text-muted-foreground">Medium</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-lg font-bold">{issues.low}</div>
          <div className="text-xs text-muted-foreground">Low</div>
        </div>
      </div>
    </div>
  )
}

