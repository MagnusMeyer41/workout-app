"use client"

import * as React from "react"
import {
  Building2,
  Users,
  Dumbbell,
  Activity,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"

const globalStats = [
  { label: "Total Organizations", value: "12", change: "+2 this month", icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Total Coaches", value: "48", change: "Across all orgs", icon: Users, color: "text-primary", bg: "bg-primary/10" },
  { label: "Total Players", value: "312", change: "+24 this month", icon: Dumbbell, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Total Sessions", value: "1,847", change: "This month", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10" },
]

const organizations = [
  { id: "1", name: "Titan Athletics", coaches: 6, players: 48, programs: 12, sessions: 124, createdDate: "Jan 15, 2025", status: "Active" },
  { id: "2", name: "Peak Performance", coaches: 4, players: 31, programs: 8, sessions: 89, createdDate: "Mar 1, 2025", status: "Active" },
  { id: "3", name: "Iron Works", coaches: 3, players: 22, programs: 5, sessions: 67, createdDate: "Apr 12, 2025", status: "Active" },
  { id: "4", name: "Elite Edge", coaches: 8, players: 72, programs: 18, sessions: 201, createdDate: "Feb 5, 2025", status: "Active" },
  { id: "5", name: "Velocity Sports", coaches: 2, players: 15, programs: 4, sessions: 34, createdDate: "Jun 20, 2025", status: "Trial" },
  { id: "6", name: "ProForm Athletics", coaches: 5, players: 41, programs: 9, sessions: 112, createdDate: "May 8, 2025", status: "Active" },
  { id: "7", name: "Apex Training", coaches: 3, players: 28, programs: 7, sessions: 78, createdDate: "Jul 1, 2025", status: "Active" },
  { id: "8", name: "Gridiron Academy", coaches: 7, players: 55, programs: 14, sessions: 189, createdDate: "Aug 15, 2025", status: "Active" },
]

const orgChartData = organizations.slice(0, 6).map((org) => ({
  name: org.name.length > 10 ? org.name.slice(0, 10) + "…" : org.name,
  coaches: org.coaches,
  players: org.players,
  sessions: org.sessions,
}))

const recentSignups = [
  { name: "Jordan Kim", email: "jordan@email.com", role: "PLAYER", org: "Titan Athletics", joinedAt: "2 hours ago" },
  { name: "Blake Santos", email: "blake@team.com", role: "COACH", org: "Elite Edge", joinedAt: "5 hours ago" },
  { name: "Riley Chen", email: "riley@email.com", role: "PLAYER", org: "Peak Performance", joinedAt: "1 day ago" },
  { name: "Morgan Davis", email: "morgan@sports.com", role: "PLAYER", org: "Velocity Sports", joinedAt: "1 day ago" },
  { name: "Casey Williams", email: "casey@team.com", role: "COACH", org: "Iron Works", joinedAt: "2 days ago" },
  { name: "Alex Rivera", email: "alex.r@email.com", role: "PLAYER", org: "Titan Athletics", joinedAt: "3 days ago" },
]

const customTooltipStyle = {
  backgroundColor: "#18181f",
  border: "1px solid #27272a",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#fafafa",
}

export default function AdminPage() {
  return (
    <AppShell role="SUPER_ADMIN" userName="System Admin" userEmail="admin@athleteos.com">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Full platform oversight and system management
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {globalStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1 tracking-tight">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl shrink-0", stat.bg)}>
                      <Icon className={cn("h-5 w-5", stat.color)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Organizations Table */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Organizations</CardTitle>
            <Button size="sm">
              <Building2 className="h-4 w-4" />
              Add Organization
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Organization</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Coaches</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Players</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Programs</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Sessions</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Created</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {organizations.map((org) => (
                    <tr key={org.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{org.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-right text-muted-foreground">{org.coaches}</td>
                      <td className="px-4 py-3.5 text-sm text-right text-muted-foreground">{org.players}</td>
                      <td className="px-4 py-3.5 text-sm text-right text-muted-foreground">{org.programs}</td>
                      <td className="px-4 py-3.5 text-sm text-right font-medium text-foreground">{org.sessions}</td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">{org.createdDate}</td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant={org.status === "Active" ? "success" : "warning"}
                          className="text-[10px]"
                        >
                          {org.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4" /> Edit Organization
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Charts + Recent Signups */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Org Comparison Bar Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base font-semibold">Organization Comparison</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orgChartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#a1a1aa", fontSize: 11 }}
                        axisLine={{ stroke: "#27272a" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#a1a1aa", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                      <Legend
                        wrapperStyle={{ fontSize: "12px", color: "#a1a1aa", paddingTop: "12px" }}
                      />
                      <Bar dataKey="players" name="Players" fill="#60a5fa" radius={[3, 3, 0, 0]} maxBarSize={24} />
                      <Bar dataKey="sessions" name="Sessions" fill="#C9A84C" radius={[3, 3, 0, 0]} maxBarSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Signups */}
          <div>
            <Card className="bg-card border-border h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold">Recent Signups</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSignups.map((user, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <Badge
                          variant={user.role === "COACH" ? "default" : "secondary"}
                          className="text-[10px] shrink-0"
                        >
                          {user.role === "COACH" ? "Coach" : "Player"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.org}</p>
                      <p className="text-[11px] text-muted-foreground/60 mt-0.5">{user.joinedAt}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Admin User Management */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Admin User Management</CardTitle>
            <Button size="sm" variant="outline">
              <UserPlus className="h-4 w-4" />
              Add Admin
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "System Admin", email: "admin@athleteos.com", role: "SUPER_ADMIN", lastLogin: "Just now", status: "Active" },
                { name: "Sarah Mitchell", email: "sarah.m@athleteos.com", role: "SUPER_ADMIN", lastLogin: "2 hours ago", status: "Active" },
                { name: "Tom Bradley", email: "tom@athleteos.com", role: "SUPER_ADMIN", lastLogin: "1 day ago", status: "Active" },
              ].map((admin, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                      {admin.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{admin.name}</p>
                      <p className="text-xs text-muted-foreground">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Last login</p>
                      <p className="text-xs font-medium text-foreground">{admin.lastLogin}</p>
                    </div>
                    <Badge variant="destructive" className="text-[10px]">Super Admin</Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
