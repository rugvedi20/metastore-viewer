"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, HelpCircle } from "lucide-react"

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full border-none">
          <Avatar className="h-8 w-8 border border-border/40 bg-secondary/50">
            <AvatarImage src="/placeholder.svg" alt="@user" />
            <AvatarFallback className="bg-primary/20 text-primary">JD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-1 rounded-md metanexus-dark-card" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/20" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-primary/10">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-primary/10">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer focus:bg-primary/10">
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/20" />
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

