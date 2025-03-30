"use client"

import { useState } from "react"
import { MainHeader } from "@/components/main-header"
import { MetadataOverview } from "@/components/metadata-overview"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, RefreshCw, ArrowRight, BarChart2, Database, FileText, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetadataStats } from "@/components/metadata-stats"
import { StorageDistribution } from "@/components/storage-distribution"
import { VersionHistory } from "@/components/version-history"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentActivity } from "@/components/recent-activity"
import { MetadataHealth } from "@/components/metadata-health"
import { PopularQueries } from "@/components/popular-queries"

export default function Dashboard() {
  const [s3Path, setS3Path] = useState("s3://analytics-bucket/customer_data/")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  const handleFetchMetadata = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col bg-[#0d1424] text-white">
        <MainHeader />

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <AppSidebar />
          </div>

          <main className="flex-1 overflow-auto p-4 md:p-6 bg-[#0d1424]">
            <div className="container mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col space-y-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-white">
                      Dashboard
                      <span className="text-xs font-normal text-gray-400 bg-[#1a2237] px-2 py-1 rounded-full">
                        Overview
                      </span>
                    </h2>
                    <p className="text-gray-400">Real-time metadata insights and analytics</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="metanexus-button-secondary"
                    >
                      {isRefreshing ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Refresh
                    </Button>
                    <Button className="metanexus-button-primary" size="sm">
                      Add Data Source
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex-1 space-y-1 w-full">
                    <div className="text-sm font-medium text-gray-400">S3 Path</div>
                    <div className="flex items-center space-x-2 w-full">
                      <div className="relative flex-1">
                        <div className="metanexus-search flex items-center w-full">
                          <Input
                            value={s3Path}
                            onChange={(e) => setS3Path(e.target.value)}
                            placeholder="Enter a complete S3 path to view table metadata"
                            className="h-9 w-full bg-transparent border-none focus:outline-none"
                          />
                        </div>
                      </div>
                      <Button
                        className="metanexus-button-primary h-9"
                        onClick={handleFetchMetadata}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Fetching...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Fetch Metadata
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 metanexus-button-secondary">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Enter a complete S3 path to view table metadata, or select a data source from the sidebar.
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <MetadataOverview onRefresh={handleRefresh} isRefreshing={isRefreshing} />
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <MetadataStats />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <Card className="metanexus-dark-card h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                          Metadata Growth
                        </CardTitle>
                        <CardDescription>Historical growth of metadata across tables</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <VersionHistory />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="metanexus-dark-card h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Database className="h-5 w-5 mr-2 text-primary" />
                          Storage Distribution
                        </CardTitle>
                        <CardDescription>How your data is distributed</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <StorageDistribution />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <Card className="metanexus-dark-card h-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-primary" />
                            Recent Activity
                          </CardTitle>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            See all
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <RecentActivity />
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="metanexus-dark-card h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          Metadata Health
                        </CardTitle>
                        <CardDescription>Overall health of your metadata</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <MetadataHealth />
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="metanexus-dark-card h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Search className="h-5 w-5 mr-2 text-primary" />
                          Popular Queries
                        </CardTitle>
                        <CardDescription>Most frequently used queries</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PopularQueries />
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="bg-secondary/50 border border-border/50 p-1">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="schema"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      Schema
                    </TabsTrigger>
                    <TabsTrigger
                      value="schema-history"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      Schema History
                    </TabsTrigger>
                    <TabsTrigger
                      value="partitions"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      Partitions
                    </TabsTrigger>
                    <TabsTrigger
                      value="files"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      Files
                    </TabsTrigger>
                    <TabsTrigger
                      value="properties"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      Properties
                    </TabsTrigger>
                    <TabsTrigger
                      value="sample-data"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      Sample Data
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-6">
                    <div className="metanexus-dark-card p-8 text-center text-gray-400">
                      Detailed overview information would be displayed here
                    </div>
                  </TabsContent>

                  <TabsContent value="schema">
                    <div className="metanexus-dark-card mt-6">
                      <div className="p-8 text-center text-gray-400">
                        Schema information would be displayed here
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="schema-history">
                    <div className="metanexus-dark-card mt-6">
                      <div className="p-8 text-center text-gray-400">
                        Schema history would be displayed here
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="partitions">
                    <div className="metanexus-dark-card mt-6">
                      <div className="p-8 text-center text-gray-400">
                        Partition information would be displayed here
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="files">
                    <div className="metanexus-dark-card mt-6">
                      <div className="p-8 text-center text-gray-400">
                        Files information would be displayed here
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="properties">
                    <div className="metanexus-dark-card mt-6">
                      <div className="p-8 text-center text-gray-400">Properties would be displayed here</div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sample-data">
                    <div className="metanexus-dark-card mt-6">
                      <div className="p-8 text-center text-gray-400">Sample data would be displayed here</div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

