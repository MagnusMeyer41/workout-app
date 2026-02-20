"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  BookOpen,
  Mail,
  Calendar,
  TrendingUp,
  Plus,
  UserPlus,
  Activity,
  Flame,
  Clock,
  Building2,
  Dumbbell,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Mock data
const coachStats = [
  { label: "Total Players", value: "24", change: "+3 this month", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Active Programs", value: "8", change: "2 ending soon", icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
  { label: "Pending Invites", value: "3", change: "Awaiting response", icon: Mail, color: "text-orange-400", bg: "bg-orange-500/10" },
  { label: "Sessions This Week", value: "47", change: "+12% vs last week", icon: Calendar, color: "text-green-400", bg: "bg-green-500/10" },
]

const playerStats = [
  { label: "Sessions This Week", value: "4", change: "2 remaining", icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Active Programs", value: "2", change: "On track", icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
  { label: "Current Streak", value: "12", change: "days in a row", icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10" },
  { label: "Next Session", value: "Today", change: "3:00 PM", icon: Clock, color: "text-green-400", bg: "bg-green-500/10" },
]

const adminStats = [
  { label: "Total Orgs", value: "12", change: "+2 this month", icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Total Coaches", value: "48", change: "Across all orgs", icon: Users, color: "text-primary", bg: "bg-primary/10" },
  { label: "Total Players", value: "312", change: "Active members", icon: Dumbbell, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Total Sessions", value: "1,847", change: "This month", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10" },
]

const recentPrograms = [
  { name: "Elite Strength Block", type: "STRENGTH", players: 8, status: "Active", progress: 65 },
  { name: "Speed & Agility", type: "SPORT_SPECIFIC", players: 12, status: "Active", progress: 32 },
  { name: "Off-Season Base", type: "STRENGTH", players: 6, status: "Active", progress: 88 },
  { name: "Pre-Season Prep", type: "SPORT_SPECIFIC", players: 10, status: "Draft", progress: 0 },
]

const playerActivity = [
  { name: "Marcus T.", action: "Completed session", program: "Elite Strength Block", time: "2h ago", avatar: "MT" },
  { name: "Sarah K.", action: "Hit new PR", program: "Max Squat 285 lbs", time: "4h ago", avatar: "SK" },
  { name: "Devon R.", action: "Joined program", program: "Speed & Agility", time: "6h ago", avatar: "DR" },
  { name: "Jenna L.", action: "Logged session", program: "Off-Season Base", time: "8h ago", avatar: "JL" },
]

const upcomingSessions = [
  { date: "Today", time: "3:00 PM", program: "Elite Strength Block", exercises: 6, type: "STRENGTH" },
  { date: "Tomorrow", time: "10:00 AM", program: "Speed & Agility", exercises: 8, type: "SPORT_SPECIFIC" },
  { date: "Thu, Feb 22", time: "4:00 PM", program: "Elite Strength Block", exercises: 5, type: "STRENGTH" },
]

const benchmarks = [
  { name: "Max Squat", value: "285 lbs", trend: "+15", positive: true },
  { name: "Max Deadlift", value: "335 lbs", trend: "+20", positive: true },
  { name: "40-yard Dash", value: "4.52s", trend: "-0.08", positive: true },
]

const orgActivity = [
  { name: "Titan Athletics", coaches: 6, players: 48, sessions: 124, status: "Active" },
  { name: "Peak Performance", coaches: 4, players: 31, sessions: 89, status: "Active" },
  { name: "Iron Works", coaches: 3, players: 22, sessions: 67, status: "Active" },
  { name: "Elite Edge", coaches: 8, players: 72, sessions: 201, status: "Active" },
  { name: "Velocity Sports", coaches: 2, players: 15, sessions: 34, status: "Trial" },
]

function StatCard({ stat }: { stat: typeof coachStats[0] }) {
  const Icon = stat.icon
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1 tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", stat.bg)}>
            <Icon className={cn("h-5 w-5", stat.color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CoachView() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning, Coach Alex</h1>
          <p className="text-muted-foreground text-sm mt-1">{today}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/players">
              <UserPlus className="h-4 w-4" />
              Invite Player
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/programs">
              <Plus className="h-4 w-4" />
              Create Program
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coachStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Programs */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">Recent Programs</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/programs" className="text-primary text-xs">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPrograms.map((program) => (
                <div key={program.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground truncate">{program.name}</span>
                      <Badge variant={program.status === "Active" ? "default" : "secondary"} className="shrink-0 text-[10px]">
                        {program.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{program.players} players</span>
                      <span>{program.type === "STRENGTH" ? "Strength" : "Sport-Specific"}</span>
                    </div>
                    {program.progress > 0 && (
                      <div className="mt-2">
                        <Progress value={program.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold text-primary">{program.progress}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Player Activity */}
        <div>
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">Player Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              {playerActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.action} &mdash; {activity.program}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function PlayerView() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Good morning, Marcus</h1>
        <p className="text-muted-foreground text-sm mt-1">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {playerStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div>
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">Upcoming Sessions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sessions" className="text-primary text-xs">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSessions.map((session, i) => (
                <div key={i} className={cn(
                  "p-3 rounded-lg border transition-colors",
                  i === 0 ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"
                )}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={cn("text-xs font-semibold mb-1", i === 0 ? "text-primary" : "text-muted-foreground")}>
                        {session.date} at {session.time}
                      </p>
                      <p className="text-sm font-medium text-foreground">{session.program}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{session.exercises} exercises</p>
                    </div>
                    <Badge variant={session.type === "STRENGTH" ? "default" : "secondary"} className="text-[10px] shrink-0">
                      {session.type === "STRENGTH" ? "Strength" : "Sport"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Progress Benchmarks */}
        <div>
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">Key Benchmarks</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/progress" className="text-primary text-xs">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {benchmarks.map((b) => (
                <div key={b.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{b.name}</p>
                    <p className="text-xl font-bold text-foreground mt-0.5">{b.value}</p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-semibold",
                    b.positive ? "text-green-400" : "text-red-400"
                  )}>
                    <TrendingUp className="h-4 w-4" />
                    {b.trend}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Assigned Programs */}
        <div>
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">My Programs</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPrograms.slice(0, 2).map((program) => (
                <div key={program.name} className="p-3 rounded-lg bg-muted/40">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{program.name}</p>
                    <Badge variant="default" className="text-[10px]">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{program.type === "STRENGTH" ? "Strength" : "Sport-Specific"}</span>
                    <span>{program.progress}%</span>
                  </div>
                  <Progress value={program.progress} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AdminView() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </div>

      {/* Org Activity */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-semibold">Organization Activity</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin" className="text-primary text-xs">
              Full Admin <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3">Organization</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-3">Coaches</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-3">Players</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-3">Sessions</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orgActivity.map((org) => (
                  <tr key={org.name} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 text-sm font-medium text-foreground">{org.name}</td>
                    <td className="py-3 text-sm text-right text-muted-foreground">{org.coaches}</td>
                    <td className="py-3 text-sm text-right text-muted-foreground">{org.players}</td>
                    <td className="py-3 text-sm text-right text-muted-foreground">{org.sessions}</td>
                    <td className="py-3 text-right">
                      <Badge variant={org.status === "Active" ? "success" : "warning"} className="text-[10px]">
                        {org.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RoleView({ role }: { role: "SUPER_ADMIN" | "COACH" | "PLAYER" }) {
  if (role === "PLAYER") return <PlayerView />
  if (role === "SUPER_ADMIN") return <AdminView />
  return <CoachView />
}

export default function HomePage() {
  // In production this would come from session/context
  // Default to COACH for demo
  const role: "SUPER_ADMIN" | "COACH" | "PLAYER" = "COACH"

  return (
    <AppShell role={role} userName="Alex Johnson" userEmail="alex@athleteos.com">
      <RoleView role={role} />
    </AppShell>
  )
}
