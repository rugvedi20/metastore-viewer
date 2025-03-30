"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function SystemTime() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="hidden md:flex flex-col items-end mr-4">
      <motion.div
        className="text-lg font-mono text-primary glow-text"
        key={time.getSeconds()}
        initial={{ opacity: 0.5, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {formatTime(time)}
      </motion.div>
      <div className="text-xs text-muted-foreground">{formatDate(time)}</div>
    </div>
  )
}

