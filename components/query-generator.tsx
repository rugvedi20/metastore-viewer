"use client"

import type React from "react"

import { useState } from "react"
import { MainHeader } from "@/components/main-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Play, Wand2, RefreshCw, Check, Database, Table } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function QueryGenerator() {
  const [prompt, setPrompt] = useState("")
  const [generatedQuery, setGeneratedQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [suggestions, setSuggestions] = useState([
    "Find high-value customers who haven't logged in for the past 30 days",
    "Show me products with negative prices",
    "Identify transactions with amounts greater than 3 standard deviations from the mean",
  ])
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedQuery)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
  }

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGeneratedQuery("")
    setPreviewData(null)

    // Simulate query generation
    setTimeout(() => {
      const sampleQuery = `-- Query to find high-value customers who haven't logged in recently
SELECT 
  customer_id,
  name,
  email,
  lifetime_value,
  last_login,
  CURRENT_DATE - last_login AS days_since_login
FROM 
  customer_profiles
WHERE 
  lifetime_value > 1000
  AND last_login < CURRENT_DATE - INTERVAL '30 days'
ORDER BY 
  lifetime_value DESC
LIMIT 100;`

      setGeneratedQuery(sampleQuery)
      setIsGenerating(false)
    }, 1500)
  }

  const handleRunQuery = () => {
    if (!generatedQuery) return

    setIsLoadingPreview(true)

    // Simulate query execution and data loading
    setTimeout(() => {
      setPreviewData([
        {
          customer_id: "C1001",
          name: "John Smith",
          email: "john.smith@example.com",
          lifetime_value: 2450.75,
          last_login: "2025-02-15",
          days_since_login: 42,
        },
        {
          customer_id: "C1542",
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          lifetime_value: 2105.3,
          last_login: "2025-02-10",
          days_since_login: 47,
        },
        {
          customer_id: "C2103",
          name: "Michael Brown",
          email: "mbrown@example.com",
          lifetime_value: 1875.25,
          last_login: "2025-02-20",
          days_since_login: 37,
        },
        {
          customer_id: "C1837",
          name: "Emily Davis",
          email: "emily.davis@example.com",
          lifetime_value: 1650.0,
          last_login: "2025-02-05",
          days_since_login: 52,
        },
        {
          customer_id: "C2541",
          name: "Robert Wilson",
          email: "rwilson@example.com",
          lifetime_value: 1425.5,
          last_login: "2025-02-18",
          days_since_login: 39,
        },
      ])
      setIsLoadingPreview(false)
    }, 2000)
  }

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
                      Query Generator
                      <span className="text-xs font-normal text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                        AI-Powered
                      </span>
                    </h2>
                    <p className="text-muted-foreground">Generate SQL queries using natural language</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card className="metanexus-dark-card h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Wand2 className="h-5 w-5 mr-2 text-primary" />
                          Natural Language Query
                        </CardTitle>
                        <CardDescription>Describe what you want to query in natural language</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <Textarea
                          placeholder="Example: Find high-value customers who haven't logged in for the past 30 days"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="min-h-[150px] resize-none metanexus-input"
                        />

                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Suggestions:</h4>
                          <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="metanexus-button-secondary text-xs"
                                >
                                  {suggestion}
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t border-border/20">
                        <Button variant="outline" onClick={() => setPrompt("")} className="metanexus-button-secondary">
                          Clear
                        </Button>
                        <Button
                          onClick={handleGenerate}
                          disabled={isGenerating || !prompt.trim()}
                          className="metanexus-button-primary"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wand2 className="mr-2 h-4 w-4" />
                              Generate Query
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <AnimatePresence mode="wait">
                      {generatedQuery ? (
                        <motion.div
                          key="query-result"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Card className="metanexus-dark-card h-full flex flex-col">
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Database className="h-5 w-5 mr-2 text-primary" />
                                Generated SQL
                              </CardTitle>
                              <CardDescription>Here's the SQL query based on your description</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                              <Tabs defaultValue="query" className="h-full flex flex-col">
                                <TabsList className="bg-secondary/50 border border-border/20 p-1">
                                  <TabsTrigger
                                    value="query"
                                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                                  >
                                    SQL Query
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="explanation"
                                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                                  >
                                    Explanation
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="preview"
                                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                                  >
                                    Preview
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent value="query" className="mt-4 flex-1">
                                  <div className="relative h-full">
                                    <pre className="rounded-md metanexus-input p-4 overflow-x-auto h-full">
                                      <code className="text-sm">{generatedQuery}</code>
                                    </pre>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="absolute top-2 right-2"
                                      onClick={handleCopy}
                                    >
                                      {copied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                      <span className="sr-only">Copy</span>
                                    </Button>
                                  </div>
                                </TabsContent>
                                <TabsContent value="explanation" className="mt-4 flex-1">
                                  <div className="rounded-md metanexus-input p-4 h-full">
                                    <p className="text-sm">
                                      This query searches the <code>customer_profiles</code> table to find customers
                                      who:
                                    </p>
                                    <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                                      <li>Have a lifetime value greater than $1,000</li>
                                      <li>Haven't logged in for at least 30 days</li>
                                      <li>Are sorted by lifetime value (highest first)</li>
                                      <li>Limited to 100 results to prevent overwhelming results</li>
                                    </ul>
                                    <p className="text-sm mt-2">
                                      This helps identify high-value customers who might be at risk of churning due to
                                      inactivity.
                                    </p>
                                  </div>
                                </TabsContent>
                                <TabsContent value="preview" className="mt-4 flex-1">
                                  <div className="rounded-md metanexus-input p-4 h-full">
                                    {isLoadingPreview ? (
                                      <div className="flex items-center justify-center h-full">
                                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                                        <span className="ml-2">Loading preview data...</span>
                                      </div>
                                    ) : previewData ? (
                                      <div className="overflow-auto">
                                        <div className="text-sm font-medium mb-2 flex items-center">
                                          <Table className="h-4 w-4 mr-2 text-primary" />
                                          Query Results (5 of 100 rows)
                                        </div>
                                        <table className="w-full border-collapse metanexus-table">
                                          <thead>
                                            <tr className="bg-secondary/30">
                                              {previewData.length > 0 &&
                                                Object.keys(previewData[0]).map((key) => (
                                                  <th
                                                    key={key}
                                                    className="p-2 text-left text-xs font-medium text-muted-foreground border border-border/20"
                                                  >
                                                    {key}
                                                  </th>
                                                ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {previewData.map((row, i) => (
                                              <tr key={i} className="hover:bg-secondary/20">
                                                {Object.values(row).map((value, j) => (
                                                  <td key={j} className="p-2 text-xs border border-border/20">
                                                    {value as React.ReactNode}
                                                  </td>
                                                ))}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center h-full gap-4">
                                        <p className="text-muted-foreground">
                                          Run the query to see a preview of the results
                                        </p>
                                        <Button onClick={handleRunQuery} className="metanexus-button-primary">
                                          <Play className="mr-2 h-4 w-4" />
                                          Run Query
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </CardContent>
                            <CardFooter className="border-t border-border/20">
                              <Button
                                className="ml-auto metanexus-button-primary"
                                onClick={handleRunQuery}
                                disabled={isLoadingPreview}
                              >
                                {isLoadingPreview ? (
                                  <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Running...
                                  </>
                                ) : (
                                  <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Run Query
                                  </>
                                )}
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty-state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Card className="metanexus-dark-card h-full flex flex-col">
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                              <Database className="h-16 w-16 text-primary/20 mb-4" />
                              <h3 className="text-xl font-medium mb-2">No Query Generated Yet</h3>
                              <p className="text-muted-foreground mb-6">
                                Describe what you want to query in natural language, and I'll generate the SQL for you
                              </p>
                              <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                              >
                                <Wand2 className="h-8 w-8 text-primary" />
                              </motion.div>
                            </div>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

