"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { Search, Bell, Menu, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AppSidebar } from "@/components/app-sidebar"

export function MainHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [notifications, setNotifications] = useState(3)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Metadata", path: "/metadata" },
    { name: "AI Chat", path: "/ai-chat" },
    { name: "Reports", path: "/reports" },
    { name: "Query", path: "/query-generator" },
    { name: "Data Quality", path: "/data-quality" },
    { name: "Schema Registry", path: "/schema-registry" },
  ]

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 metanexus-header ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px] metanexus-sidebar">
                <div className="h-full">
                  <AppSidebar />
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="metanexus-logo">
              MetaNexus
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`metanexus-nav-item text-sm font-medium ${
                    isActive(item.path) ? "active text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:flex items-center">
              <div className="metanexus-search flex items-center px-3 py-1.5">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <input
                  type="text"
                  placeholder="Search metadata..."
                  className="bg-transparent border-none focus:outline-none text-sm w-[180px] transition-all focus:w-[240px]"
                />
              </div>
            </div>

            <Link href="/chat">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300"
              >
                <MessageSquare className="h-4 w-4" />
                Ask AI
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                  {notifications}
                </Badge>
              )}
            </Button>

            <ThemeToggle />

            <UserNav />
          </div>
        </div>
      </div>
    </header>
  )
}

