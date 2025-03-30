"use client"

import type React from "react"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary relative group">
        <span>Dashboard</span>
        <motion.span
          className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </Link>
      <Link
        href="/metadata"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative group"
      >
        <span>Metadata</span>
        <motion.span
          className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </Link>
      <Link
        href="/ai-chat"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative group"
      >
        <span>AI Chat</span>
        <motion.span
          className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </Link>
      <Link
        href="/reports"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative group"
      >
        <span>Reports</span>
        <motion.span
          className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </Link>
      <Link
        href="/query"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative group"
      >
        <span>Query</span>
        <motion.span
          className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </nav>
  )
}

