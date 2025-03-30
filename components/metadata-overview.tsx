"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, History, Play, RefreshCw, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface MetadataOverviewProps {
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function MetadataOverview({ onRefresh, isRefreshing = false }: MetadataOverviewProps) {
  return (
    <Card className="metanexus-dark-card overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <motion.h2
              className="text-2xl font-bold flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="h-2 w-2 rounded-full bg-primary mr-1"></span>
              customer_profiles
              <Badge variant="outline" className="ml-2 text-xs font-normal border-primary/50 text-primary">
                Iceberg
              </Badge>
            </motion.h2>
            <motion.div
              className="flex items-center gap-2 text-sm text-muted-foreground mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span>Last Modified: 26/3/2025, 10:39:15 pm</span>
              <span>•</span>
              <span>Size: 3.91 GB</span>
              <span>•</span>
              <span>Owner: data-team</span>
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="metanexus-button-secondary h-8">
              <ExternalLink className="h-3.5 w-3.5 mr-2" />
              View
            </Button>
            <Button variant="outline" size="sm" className="metanexus-button-secondary h-8">
              <Download className="h-3.5 w-3.5 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="metanexus-button-secondary h-8"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
              ) : (
                <History className="h-3.5 w-3.5 mr-2" />
              )}
              History
            </Button>
            <Button className="metanexus-button-primary h-8" size="sm">
              <Play className="h-3.5 w-3.5 mr-2" />
              Query
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

