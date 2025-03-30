"use client"

import { useState, useEffect } from "react"
import { MainHeader } from "@/components/main-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Filter, Eye, ArrowUpDown, Search } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Issue {
  id: number
  table: string
  column: string
  issue: string
  severity: "high" | "medium" | "low"
  description: string
  detectedAt: string
  status: "new" | "investigating" | "resolved"
}

export function DataQualityInsights() {
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 1,
      table: "customer_profiles",
      column: "email",
      issue: "Missing values",
      severity: "high",
      description: "5.2% of email values are null",
      detectedAt: "2025-03-26T10:30:00Z",
      status: "new",
    },
    {
      id: 2,
      table: "transactions",
      column: "amount",
      issue: "Outliers detected",
      severity: "medium",
      description: "3 transactions with amounts > $50,000",
      detectedAt: "2025-03-26T09:15:00Z",
      status: "investigating",
    },
    {
      id: 3,
      table: "product_catalog",
      column: "price",
      issue: "Negative values",
      severity: "high",
      description: "12 products with negative prices",
      detectedAt: "2025-03-25T22:45:00Z",
      status: "new",
    },
    {
      id: 4,
      table: "customer_profiles",
      column: "signup_date",
      issue: "Future dates",
      severity: "medium",
      description: "8 customers with signup dates in the future",
      detectedAt: "2025-03-25T18:20:00Z",
      status: "investigating",
    },
    {
      id: 5,
      table: "orders_incremental",
      column: "customer_id",
      issue: "Foreign key violation",
      severity: "high",
      description: "43 orders with non-existent customer IDs",
      detectedAt: "2025-03-25T14:10:00Z",
      status: "new",
    },
  ])

  const [filteredIssues, setFilteredIssues] = useState<Issue[]>(issues)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sortField, setSortField] = useState<keyof Issue>("detectedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [severityFilter, setSeverityFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...issues]

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (issue) =>
          issue.table.toLowerCase().includes(term) ||
          issue.column.toLowerCase().includes(term) ||
          issue.issue.toLowerCase().includes(term) ||
          issue.description.toLowerCase().includes(term),
      )
    }

    // Apply severity filter
    if (severityFilter.length > 0) {
      result = result.filter((issue) => severityFilter.includes(issue.severity))
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter((issue) => statusFilter.includes(issue.status))
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

    setFilteredIssues(result)
  }, [issues, searchTerm, sortField, sortDirection, severityFilter, statusFilter])

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate data refresh
    setTimeout(() => {
      // Add a new issue
      const newIssue: Issue = {
        id: issues.length + 1,
        table: "transactions",
        column: "transaction_date",
        issue: "Inconsistent format",
        severity: "medium",
        description: "5 transactions with inconsistent date format",
        detectedAt: new Date().toISOString(),
        status: "new",
      }

      setIssues((prev) => [newIssue, ...prev])
      setIsRefreshing(false)
    }, 1500)
  }

  const handleSort = (field: keyof Issue) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const toggleSeverityFilter = (severity: string) => {
    if (severityFilter.includes(severity)) {
      setSeverityFilter((prev) => prev.filter((s) => s !== severity))
    } else {
      setSeverityFilter((prev) => [...prev, severity])
    }
  }

  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter((prev) => prev.filter((s) => s !== status))
    } else {
      setStatusFilter((prev) => [...prev, status])
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-primary text-primary-foreground">New</Badge>
      case "investigating":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Investigating
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Resolved
          </Badge>
        )
      default:
        return null
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const highSeverityCount = issues.filter((i) => i.severity === "high").length
  const mediumSeverityCount = issues.filter((i) => i.severity === "medium").length
  const resolvedCount = issues.filter((i) => i.status === "resolved").length

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col metanexus-main-bg">
        <MainHeader />

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <AppSidebar />
          </div>

          <main className="flex-1 overflow-auto p-4 md:p-6 metanexus-grid-bg">
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
                      Data Quality
                      <span className="text-xs font-normal text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                        Insights
                      </span>
                    </h2>
                    <p className="text-muted-foreground">AI-powered analysis of potential data quality issues</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="metanexus-button-secondary"
                    >
                      {isRefreshing ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Refresh Analysis
                    </Button>
                    <Button className="metanexus-button-primary">Configure Rules</Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card className="metanexus-stat-card-dark">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
                        <CardTitle className="text-sm font-medium">High Severity Issues</CardTitle>
                        <XCircle className="h-4 w-4 text-destructive" />
                      </CardHeader>
                      <CardContent className="px-0 pb-0">
                        <div className="text-2xl font-bold text-destructive">{highSeverityCount}</div>
                        <p className="text-xs text-muted-foreground">+1 since last scan</p>
                        <div className="metanexus-progress mt-2">
                          <motion.div
                            className="metanexus-progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${(highSeverityCount / issues.length) * 100}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="metanexus-stat-card-dark">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
                        <CardTitle className="text-sm font-medium">Medium Severity Issues</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      </CardHeader>
                      <CardContent className="px-0 pb-0">
                        <div className="text-2xl font-bold text-amber-500">{mediumSeverityCount}</div>
                        <p className="text-xs text-muted-foreground">-1 since last scan</p>
                        <div className="metanexus-progress mt-2">
                          <motion.div
                            className="metanexus-progress-bar"
                            style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(mediumSeverityCount / issues.length) * 100}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card className="metanexus-stat-card-dark">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
                        <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </CardHeader>
                      <CardContent className="px-0 pb-0">
                        <div className="text-2xl font-bold text-green-500">{resolvedCount}</div>
                        <p className="text-xs text-muted-foreground">+2 since last scan</p>
                        <div className="metanexus-progress mt-2">
                          <motion.div
                            className="metanexus-progress-bar"
                            style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(resolvedCount / (issues.length + resolvedCount)) * 100}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <Card className="metanexus-dark-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                      Detected Issues
                    </CardTitle>
                    <CardDescription>Review and resolve data quality issues detected by AI analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                      <div className="relative flex-1">
                        <div className="metanexus-search flex items-center w-full">
                          <Search className="h-4 w-4 text-muted-foreground ml-3 mr-2" />
                          <Input
                            placeholder="Search issues..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="metanexus-button-secondary">
                              <Filter className="h-4 w-4 mr-2" />
                              Severity
                              {severityFilter.length > 0 && (
                                <Badge className="ml-2 bg-primary text-primary-foreground">
                                  {severityFilter.length}
                                </Badge>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="metanexus-dark-card">
                            <DropdownMenuItem
                              onClick={() => toggleSeverityFilter("high")}
                              className="cursor-pointer focus:bg-primary/10"
                            >
                              <div className="flex items-center">
                                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                  {severityFilter.includes("high") && <CheckCircle className="h-3 w-3" />}
                                </div>
                                <XCircle className="h-4 w-4 mr-2 text-destructive" />
                                High
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleSeverityFilter("medium")}
                              className="cursor-pointer focus:bg-primary/10"
                            >
                              <div className="flex items-center">
                                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                  {severityFilter.includes("medium") && <CheckCircle className="h-3 w-3" />}
                                </div>
                                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                                Medium
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleSeverityFilter("low")}
                              className="cursor-pointer focus:bg-primary/10"
                            >
                              <div className="flex items-center">
                                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                  {severityFilter.includes("low") && <CheckCircle className="h-3 w-3" />}
                                </div>
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Low
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="metanexus-button-secondary">
                              <Filter className="h-4 w-4 mr-2" />
                              Status
                              {statusFilter.length > 0 && (
                                <Badge className="ml-2 bg-primary text-primary-foreground">{statusFilter.length}</Badge>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="metanexus-dark-card">
                            <DropdownMenuItem
                              onClick={() => toggleStatusFilter("new")}
                              className="cursor-pointer focus:bg-primary/10"
                            >
                              <div className="flex items-center">
                                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                  {statusFilter.includes("new") && <CheckCircle className="h-3 w-3" />}
                                </div>
                                New
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleStatusFilter("investigating")}
                              className="cursor-pointer focus:bg-primary/10"
                            >
                              <div className="flex items-center">
                                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                  {statusFilter.includes("investigating") && <CheckCircle className="h-3 w-3" />}
                                </div>
                                Investigating
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleStatusFilter("resolved")}
                              className="cursor-pointer focus:bg-primary/10"
                            >
                              <div className="flex items-center">
                                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                  {statusFilter.includes("resolved") && <CheckCircle className="h-3 w-3" />}
                                </div>
                                Resolved
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="rounded-md overflow-hidden border border-border/20">
                      <Table className="metanexus-table">
                        <TableHeader className="bg-secondary/20">
                          <TableRow>
                            <TableHead className="w-[50px]">Severity</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("table")}>
                              <div className="flex items-center">
                                Table
                                {sortField === "table" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                              </div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("column")}>
                              <div className="flex items-center">
                                Column
                                {sortField === "column" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                              </div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("issue")}>
                              <div className="flex items-center">
                                Issue
                                {sortField === "issue" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                              </div>
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("detectedAt")}>
                              <div className="flex items-center">
                                Detected
                                {sortField === "detectedAt" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                              </div>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredIssues.map((issue) => (
                            <TableRow key={issue.id} className="transition-colors">
                              <TableCell>{getSeverityIcon(issue.severity)}</TableCell>
                              <TableCell className="font-medium">{issue.table}</TableCell>
                              <TableCell>{issue.column}</TableCell>
                              <TableCell>{issue.issue}</TableCell>
                              <TableCell>{issue.description}</TableCell>
                              <TableCell>
                                {new Date(issue.detectedAt).toLocaleString(undefined, {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </TableCell>
                              <TableCell>{getStatusBadge(issue.status)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {filteredIssues.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={8} className="h-24 text-center">
                                No issues found matching your filters
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

