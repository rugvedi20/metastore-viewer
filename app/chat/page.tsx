import type { Metadata } from "next"
import { AIChatInterface } from "@/components/ai-chat-interface"

export const metadata: Metadata = {
  title: "AI Chatbot - MetaNexus Metadata Explorer",
  description: "Ask questions about your metadata using natural language",
}

export default function AIChatPage() {
  return <AIChatInterface />
}