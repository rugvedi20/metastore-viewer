"use client"

import {
  Database,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Terminal,
  Plus,
  Layers,
  GitBranch,
  AlertTriangle,
  Star,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { motion } from "framer-motion"

export function AppSidebar() {
  return (
    <Sidebar className="metanexus-sidebar h-screen">
      <SidebarHeader className="pb-0">
        <div className="p-4">
          <div className="metanexus-logo text-xl mb-6">MetaNexus</div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-4">
            DATA SOURCES
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Buckets" className="metanexus-sidebar-item group">
                  <Database className="metanexus-sidebar-icon" />
                  <span className="metanexus-sidebar-text">Buckets</span>
                  <motion.div className="ml-auto" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <Plus className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="pl-6">
                <SidebarMenuButton asChild className="transition-all duration-300 hover:pl-4">
                  <a href="#">
                    <span>analytics-bucket</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="pl-6">
                <SidebarMenuButton asChild className="transition-all duration-300 hover:pl-4">
                  <a href="#">
                    <span>data-warehouse</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="pl-6">
                <SidebarMenuButton asChild className="transition-all duration-300 hover:pl-4">
                  <a href="#">
                    <span>ml-datasets</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-4">
            Recent Tables
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="transition-all duration-300 hover:pl-4">
                  <a href="#">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      transactions
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="transition-all duration-300 hover:pl-4">
                  <a href="#">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
                      orders_incremental
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="transition-all duration-300 hover:pl-4">
                  <a href="#">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
                      product_catalog
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive className="transition-all duration-300 hover:pl-4">
                  <a href="#">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                      customer_profiles
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-4">NAVIGATION</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="metanexus-sidebar-item active">
                  <a href="/">
                    <Home className="metanexus-sidebar-icon" />
                    <span className="metanexus-sidebar-text">Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="metanexus-sidebar-item">
                  <a href="/metadata">
                    <Database className="metanexus-sidebar-icon" />
                    <span className="metanexus-sidebar-text">Metadata Insights</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="metanexus-sidebar-item">
                  <a href="/ai-chat">
                    <MessageSquare className="metanexus-sidebar-icon" />
                    <span className="metanexus-sidebar-text">AI Chatbot</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="metanexus-sidebar-item">
                  <a href="/reports">
                    <FileText className="metanexus-sidebar-icon" />
                    <span className="metanexus-sidebar-text">Reports</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="metanexus-sidebar-item">
                  <a href="/query-generator">
                    <Terminal className="metanexus-sidebar-icon" />
                    <span className="metanexus-sidebar-text">Query Generator</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="metanexus-sidebar-item">
                  <a href="/data-quality">
                    <AlertTriangle className="metanexus-sidebar-icon" />
                    <span className="metanexus-sidebar-text">Data Quality</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="metanexus-sidebar-item">
                  <a href="/schema-registry">
                    <Layers className="metanexus-sidebar-icon" />
                    <span className="metanexus-sidebar-text">Schema Registry</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="metanexus-sidebar-item">
                  <a href="/lineage">
                    <GitBranch className="metanexus-sidebar-icon" />
                    <span className="metanexus-sidebar-text">Data Lineage</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="metanexus-sidebar-item">
                  <a href="/favorites">
                    <Star className="metanexus-sidebar-icon" />
                    <span className="metanexus-sidebar-text">Favorites</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="metanexus-sidebar-item">
                  <a href="/settings">
                    <Settings className="metanexus-sidebar-icon" />
                    <span className="metanexus-sidebar-text">Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

