"use client"

import { useState } from "react"
import { MainHeader } from "@/components/main-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, GitBranch, Clock, FileText, RefreshCw, ArrowUpDown, Eye, Download } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Schema {
  id: string
  name: string
  namespace: string
  type: "AVRO" | "JSON" | "PROTOBUF"
  version: number
  status: "ACTIVE" | "DEPRECATED" | "DRAFT"
  updatedAt: string
  updatedBy: string
}

export function SchemaRegistry() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sortField, setSortField] = useState<keyof Schema>("updatedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const [schemas, setSchemas] = useState<Schema[]>([
    {
      id: "schema-001",
      name: "customer",
      namespace: "com.metanexus.customers",
      type: "AVRO",
      version: 3,
      status: "ACTIVE",
      updatedAt: "2025-03-26T10:30:00Z",
      updatedBy: "john.doe",
    },
    {
      id: "schema-002",
      name: "transaction",
      namespace: "com.metanexus.transactions",
      type: "AVRO",
      version: 5,
      status: "ACTIVE",
      updatedAt: "2025-03-25T14:15:00Z",
      updatedBy: "jane.smith",
    },
    {
      id: "schema-003",
      name: "product",
      namespace: "com.metanexus.products",
      type: "JSON",
      version: 2,
      status: "ACTIVE",
      updatedAt: "2025-03-24T09:45:00Z",
      updatedBy: "john.doe",
    },
    {
      id: "schema-004",
      name: "order",
      namespace: "com.metanexus.orders",
      type: "AVRO",
      version: 4,
      status: "DEPRECATED",
      updatedAt: "2025-03-20T16:30:00Z",
      updatedBy: "jane.smith",
    },
    {
      id: "schema-005",
      name: "inventory",
      namespace: "com.metanexus.inventory",
      type: "PROTOBUF",
      version: 1,
      status: "DRAFT",
      updatedAt: "2025-03-18T11:20:00Z",
      updatedBy: "john.doe",
    },
  ])

  const [filteredSchemas, setFilteredSchemas] = useState<Schema[]>(schemas)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  const handleSort = (field: keyof Schema) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500 text-white">Active</Badge>
      case "DEPRECATED":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Deprecated
          </Badge>
        )
      case "DRAFT":
        return (
          <Badge variant="outline" className="border-primary text-primary">
            Draft
          </Badge>
        )
      default:
        return null
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "AVRO":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            AVRO
          </Badge>
        )
      case "JSON":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            JSON
          </Badge>
        )
      case "PROTOBUF":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            PROTOBUF
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col metanexus-gradient-bg">
        <MainHeader />

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <AppSidebar />
          </div>

          <main className="flex-1 overflow-auto p-4 md:p-6 metanexus-bg-pattern">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col space-y-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                      Schema Registry
                      <span className="text-xs font-normal text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                        Version Control
                      </span>
                    </h2>
                    <p className="text-muted-foreground">Manage and version your data schemas</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="bg-secondary/50 border-border/40"
                    >
                      {isRefreshing ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Refresh
                    </Button>
                    <Button className="metanexus-button">
                      <Plus className="h-4 w-4 mr-2" />
                      Register Schema
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="bg-secondary/50 border border-border/40 p-1">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      All Schemas
                    </TabsTrigger>
                    <TabsTrigger
                      value="active"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      Active
                    </TabsTrigger>
                    <TabsTrigger
                      value="deprecated"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      Deprecated
                    </TabsTrigger>
                    <TabsTrigger
                      value="draft"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      Draft
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-4 mt-6 mb-4">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Search schemas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 bg-secondary/50 border-border/40"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 bg-secondary/50 border-border/40">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>

                  <Card className="metanexus-card">
                    <CardContent className="p-0">
                      <Table className="metanexus-table">
                        <TableHeader className="bg-secondary/50">
                          <TableRow>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                              <div className="flex items-center">
                                Schema Name
                                {sortField === "name" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                              </div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("namespace")}>
                              <div className="flex items-center">
                                Namespace
                                {sortField === "namespace" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                              </div>
                            </TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("version")}>
                              <div className="flex items-center">
                                Version
                                {sortField === "version" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                              </div>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("updatedAt")}>
                              <div className="flex items-center">
                                Updated
                                {sortField === "updatedAt" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                              </div>
                            </TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {schemas.map((schema) => (
                            <TableRow key={schema.id} className="transition-colors">
                              <TableCell className="font-medium">{schema.name}</TableCell>
                              <TableCell className="text-muted-foreground">{schema.namespace}</TableCell>
                              <TableCell>{getTypeBadge(schema.type)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <GitBranch className="h-4 w-4 mr-1 text-primary" />
                                  {schema.version}
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(schema.status)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="text-muted-foreground">
                                    {new Date(schema.updatedAt).toLocaleString(undefined, {
                                      dateStyle: "short",
                                      timeStyle: "short",
                                    })}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Tabs>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

