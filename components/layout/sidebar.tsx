"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Zap,
  LayoutDashboard,
  BookOpen,
  Users,
  Shield,
  Building2,
  Calendar,
  TrendingUp,
  Home,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

type Role = "SUPER_ADMIN" | "COACH" | "PLAYER"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const coachNav: NavItem[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Programs", href: "/programs", icon: BookOpen },
  { label: "Players", href: "/players", icon: Users },
  { label: "Team Management", href: "/team-management", icon: Shield },
]

const playerNav: NavItem[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Sessions", href: "/sessions", icon: Calendar },
  { label: "Progress", href: "/progress", icon: TrendingUp },
]

const adminNav: NavItem[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Organizations", href: "/organizations", icon: Building2 },
]

function getNav(role: Role): NavItem[] {
  if (role === "SUPER_ADMIN") return adminNav
  if (role === "COACH") return coachNav
  return playerNav
}

interface SidebarProps {
  role: Role
  userName?: string
  userEmail?: string
  userImage?: string
}

export function Sidebar({ role, userName = "Alex Johnson", userEmail = "alex@athleteos.com", userImage }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const navItems = getNav(role)

  const roleLabel = role === "SUPER_ADMIN" ? "Super Admin" : role === "COACH" ? "Coach" : "Player"

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-foreground">AthleteOS</span>
          <div className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mt-0.5">{roleLabel}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="mb-4">
          <p className="px-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-2">
            Navigation
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-3 w-3 text-primary/60" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-border px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/login">
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-border shadow-lg lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col bg-card border-r border-border">
        <SidebarContent />
      </aside>
    </>
  )
}
