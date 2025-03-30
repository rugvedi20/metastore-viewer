"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { RefreshCw, Database, Terminal, Shield } from "lucide-react"

export function QuickActions() {
  const actions = [
    { icon: RefreshCw, label: "Refresh" },
    { icon: Database, label: "Query" },
    { icon: Terminal, label: "Console" },
    { icon: Shield, label: "Security" },
  ]

  return (
    <div className="flex gap-2">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 btn-hover-effect"
          >
            <action.icon className="h-4 w-4 mr-2 text-primary" />
            {action.label}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

