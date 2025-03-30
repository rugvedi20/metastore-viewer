"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Send, User, Sparkles, Zap, Database, BarChart2, Loader } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
// import MetadataTextInput from "@/components/data-quality-insights"
import axios from "axios"
import { saveAs } from "file-saver"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

type Suggestion = {
  id: string
  text: string
  icon: React.ElementType
}

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI metadata assistant. How can I help you analyze your metadata today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { id: "s1", text: "Show me the schema for customer_profiles", icon: Database },
    { id: "s2", text: "What tables have the most rows?", icon: BarChart2 },
    { id: "s3", text: "Find data quality issues", icon: Sparkles },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const [loadingReport, setLoadingReport] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Prepare metadata (you can replace this with your actual metadata)
    const metadata = {
      "format-version": 2,
      "table-uuid": "f98dbccf-a96e-412a-941e-35225912b0f8",
      "location": "s3://e6data-hackathon/iceberg_customer-0c1ce7cffd0e4401a637ca86db296e38",
      "last-sequence-number": 1,
      "last-updated-ms": 1743247883350,
      "last-column-id": 8,
      "current-schema-id": 0,
      "schemas": [{
        "type": "struct",
        "schema-id": 0,
        "fields": [{
          "id": 1,
          "name": "custkey",
          "required": false,
          "type": "long"
        }, {
          "id": 2,
          "name": "name",
          "required": false,
          "type": "string"
        }, {
          "id": 3,
          "name": "address",
          "required": false,
          "type": "string"
        }, {
          "id": 4,
          "name": "nationkey",
          "required": false,
          "type": "long"
        }, {
          "id": 5,
          "name": "phone",
          "required": false,
          "type": "string"
        }, {
          "id": 6,
          "name": "acctbal",
          "required": false,
          "type": "double"
        }, {
          "id": 7,
          "name": "mktsegment",
          "required": false,
          "type": "string"
        }, {
          "id": 8,
          "name": "comment",
          "required": false,
          "type": "string"
        }]
      }],
      "default-spec-id": 0,
      "partition-specs": [{
        "spec-id": 0,
        "fields": []
      }],
      "last-partition-id": 999,
      "default-sort-order-id": 0,
      "sort-orders": [{
        "order-id": 0,
        "fields": []
      }],
      "properties": {
        "write.format.default": "PARQUET",
        "write.parquet.compression-codec": "zstd"
      },
      "current-snapshot-id": 388918430335099130,
      "refs": {
        "main": {
          "snapshot-id": 388918430335099130,
          "type": "branch"
        }
      },
      "snapshots": [{
        "sequence-number": 1,
        "snapshot-id": 388918430335099130,
        "timestamp-ms": 1743247882656,
        "summary": {
          "operation": "append",
          "trino_query_id": "20250329_113121_00019_tdg9d",
          "trino_user": "deepakdixit",
          "added-data-files": "1",
          "added-records": "1500",
          "added-files-size": "86416",
          "changed-partition-count": "1",
          "total-records": "1500",
          "total-files-size": "86416",
          "total-data-files": "1",
          "total-delete-files": "0",
          "total-position-deletes": "0",
          "total-equality-deletes": "0",
          "engine-version": "468",
          "engine-name": "trino",
          "iceberg-version": "Apache Iceberg 1.7.1 (commit 4a432839233f2343a9eae8255532f911f06358ef)"
        },
        "manifest-list": "s3://e6data-hackathon/iceberg_customer-0c1ce7cffd0e4401a637ca86db296e38/metadata/snap-388918430335099130-1-85254051-cc6d-499a-bceb-179cdd3cd762.avro",
        "schema-id": 0
      }],
      "statistics": [{
        "snapshot-id": 388918430335099130,
        "statistics-path": "s3://e6data-hackathon/iceberg_customer-0c1ce7cffd0e4401a637ca86db296e38/metadata/20250329_113121_00019_tdg9d-723a21f4-6b6e-4d75-a305-386466f1421f.stats",
        "file-size-in-bytes": 74063,
        "file-footer-size-in-bytes": 1589,
        "blob-metadata": [{
          "type": "apache-datasketches-theta-v1",
          "snapshot-id": 388918430335099130,
          "sequence-number": 1,
          "fields": [1],
          "properties": {
            "ndv": "1500"
          }
        }, {
          "type": "apache-datasketches-theta-v1",
          "snapshot-id": 388918430335099130,
          "sequence-number": 1,
          "fields": [2],
          "properties": {
            "ndv": "1500"
          }
        }, {
          "type": "apache-datasketches-theta-v1",
          "snapshot-id": 388918430335099130,
          "sequence-number": 1,
          "fields": [3],
          "properties": {
            "ndv": "1500"
          }
        }, {
          "type": "apache-datasketches-theta-v1",
          "snapshot-id": 388918430335099130,
          "sequence-number": 1,
          "fields": [4],
          "properties": {
            "ndv": "25"
          }
        }, {
          "type": "apache-datasketches-theta-v1",
          "snapshot-id": 388918430335099130,
          "sequence-number": 1,
          "fields": [5],
          "properties": {
            "ndv": "1500"
          }
        }, {
          "type": "apache-datasketches-theta-v1",
          "snapshot-id": 388918430335099130,
          "sequence-number": 1,
          "fields": [6],
          "properties": {
            "ndv": "1499"
          }
        }, {
          "type": "apache-datasketches-theta-v1",
          "snapshot-id": 388918430335099130,
          "sequence-number": 1,
          "fields": [7],
          "properties": {
            "ndv": "5"
          }
        }, {
          "type": "apache-datasketches-theta-v1",
          "snapshot-id": 388918430335099130,
          "sequence-number": 1,
          "fields": [8],
          "properties": {
            "ndv": "1500"
          }
        }]
      }],
      "partition-statistics": [],
      "snapshot-log": [{
        "timestamp-ms": 1743247882656,
        "snapshot-id": 388918430335099130
      }],
      "metadata-log": [{
        "timestamp-ms": 1743247882656,
        "metadata-file": "s3://e6data-hackathon/iceberg_customer-0c1ce7cffd0e4401a637ca86db296e38/metadata/00000-a888461e-c231-4367-b5df-f7cddf98ba54.metadata.json"
      }]
    };
    // Send request to Flask server
    try {
      const response = await fetch('http://192.168.137.99:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          metadata: metadata,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const aiMessage: Message = {
          id: `${Date.now()}-${Math.random()}`,
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
      } else {
        const errorMessage: Message = {
          id: `${Date.now()}-${Math.random()}`,
          role: "assistant",
          content: "Error: " + data.error,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `${Date.now()}-${Math.random()}`,
        role: "assistant",
        content: "An error occurred while communicating with the server.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }

    // Generate new suggestions based on the conversation
    setSuggestions([
      { id: `s${Date.now()}-1`, text: "Show me data quality trends", icon: Sparkles },
      { id: `s${Date.now()}-2`, text: "Generate an optimization query", icon: Zap },
      { id: `s${Date.now()}-3`, text: "Compare schema versions", icon: Database },
    ])
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const generateReport = async () => {
    setLoadingReport(true)
    // Use the sample metadata directly or pass it as needed
    const sampleMetadata = {
      "format-version": 2,
      "table-uuid": "f98dbccf-a96e-412a-941e-35225912b0f8",
      "location": "s3://e6data-hackathon/iceberg_customer-0c1ce7cffd0e4401a637ca86db296e38",
      "last-sequence-number": 1,
      "last-updated-ms": 1743247883350,
      "last-column-id": 8,
      "current-schema-id": 0,
      "schemas": [{
        "type": "struct",
        "schema-id": 0,
        "fields": [{
          "id": 1,
          "name": "custkey",
          "required": false,
          "type": "long"
        }, {
          "id": 2,
          "name": "name",
          "required": false,
          "type": "string"
        }, {
          "id": 3,
          "name": "address",
          "required": false,
          "type": "string"
        }, {
          "id": 4,
          "name": "nationkey",
          "required": false,
          "type": "long"
        }, {
          "id": 5,
          "name": "phone",
          "required": false,
          "type": "string"
        }, {
          "id": 6,
          "name": "acctbal",
          "required": false,
          "type": "double"
        }, {
          "id": 7,
          "name": "mktsegment",
          "required": false,
          "type": "string"
        }, {
          "id": 8,
          "name": "comment",
          "required": false,
          "type": "string"
        }]
      }],
      // Add other metadata fields as needed
    };

    setIsTyping(true);
    try {
      const response = await axios.post("http://192.168.137.99:8000/generate-report", {
        metadata: sampleMetadata,
      }, {
        responseType: "blob", // Ensure we receive the PDF file
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const fileName = "data_quality_report.pdf";
      saveAs(pdfBlob, fileName);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsTyping(false);
      setLoadingReport(false);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-auto p-4 md:p-6 metanexus-grid-bg">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-6"
          >
            <Card className="metanexus-dark-card flex-1 flex flex-col h-[calc(100vh-12rem)]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  AI Metadata Assistant
                </CardTitle>
                <CardDescription>Ask questions about your metadata using natural language</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4 space-y-4 metanexus-scrollbar">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[80%] md:max-w-[70%] ${
                          message.role === "user" ? "flex-row-reverse" : "flex-row"
                        } items-start gap-3`}
                      >
                        <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
                          {message.role === "assistant" ? (
                            <>
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="bg-primary/20 text-primary">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="bg-secondary/20">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div
                          className={
                            message.role === "user" ? "metanexus-chat-bubble-user" : "metanexus-chat-bubble-ai"
                          }
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className="text-xs text-muted-foreground mt-2 text-right">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback className="bg-primary/20 text-primary">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="metanexus-chat-bubble-ai">
                          <div className="metanexus-typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </AnimatePresence>
              </CardContent>
              <CardFooter className="border-t border-border/40 p-4">
                <div className="w-full space-y-4">
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {suggestions.map((suggestion, index) => (
                          <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion.text)}
                              className="metanexus-button-secondary"
                            >
                              <suggestion.icon className="h-3.5 w-3.5 mr-2 text-primary" />
                              {suggestion.text}
                            </Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex w-full items-center space-x-2">
                    <div className="relative flex-1">
                      <div className="metanexus-search flex items-center w-full">
                        <Input
                          placeholder="Ask about your metadata..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          className="bg-transparent border-none focus:outline-none"
                        />
                        <Sparkles className="h-4 w-4 text-muted-foreground mr-3" />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className={`metanexus-button-primary flex items-center justify-center space-x-2 transition duration-300 ease-in-out transform hover:bg-blue-600 hover:shadow-lg ${loadingReport ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={generateReport}
                      disabled={loadingReport}
                    >
                      {loadingReport ? (
                        <>
                          <Loader className="animate-spin h-4 w-4" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Generate Data Quality Report</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}