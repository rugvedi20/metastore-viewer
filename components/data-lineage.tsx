"use client"

import { useState } from "react"
import type { Node } from "reactflow"
import "reactflow/dist/style.css"

export function DataLineage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'input',
      data: { label: 'raw_customer_data' },
      position: { x: 250, y: 25 },
      style: {
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        borderRadius: '8px',
        padding: '10px',
        width: 180,
      },
    },
    {
      id: '2',
      data: { label: 'customer_profiles' },
      position: { x: 100, y: 125 },
      style: {
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        borderRadius: '8px',
        padding: '10px',
        width: 180,
      },
    },
    {
      id: '3',
      data: { label: 'customer_preferences' },
      position: { x: 400, y: 125 },
      style: {
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        borderRadius: '8px',
        padding: '10px',
        width: 180,
      },
    },
    {
      id: '4',
      data: { label: 'customer_segments' },
      position: { x: 100, y: 225 },
      style: {
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        borderRadius: '8px',
        padding: '10px',
        width: 180,
      },
    },
    {
      id: '5',
      type: 'output',
      data: { label: 'marketing_campaigns' },
      position: { x: 400, y: 225 },
      style: {
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        borderRadius: '8px',
        padding: '10px',
        width:\

