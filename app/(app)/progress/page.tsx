"use client"

import * as React from "react"
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Dumbbell,
  Zap,
  Timer,
  ArrowUpRight,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"

const benchmarkHistory = [
  { month: "Aug", squat: 225, deadlift: 265, bench: 185, clean: 155 },
  { month: "Sep", squat: 235, deadlift: 275, bench: 195, clean: 160 },
  { month: "Oct", squat: 245, deadlift: 285, bench: 200, clean: 165 },
  { month: "Nov", squat: 255, deadlift: 295, bench: 210, clean: 170 },
  { month: "Dec", squat: 265, deadlift: 305, bench: 215, clean: 175 },
  { month: "Jan", squat: 275, deadlift: 320, bench: 220, clean: 180 },
  { month: "Feb", squat: 285, deadlift: 335, bench: 225, clean: 185 },
]

const benchmarks = [
  {
    key: "squat",
    name: "Max Squat",
    current: 285,
    previous: 275,
    unit: "lbs",
    icon: Dumbbell,
    color: "text-primary",
    bg: "bg-primary/10",
    pr: 285,
    prDate: "Feb 12, 2026",
  },
  {
    key: "deadlift",
    name: "Max Deadlift",
    current: 335,
    previous: 320,
    unit: "lbs",
    icon: Dumbbell,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    pr: 335,
    prDate: "Feb 15, 2026",
  },
  {
    key: "bench",
    name: "Max Bench",
    current: 225,
    previous: 220,
    unit: "lbs",
    icon: Dumbbell,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    pr: 225,
    prDate: "Feb 10, 2026",
  },
  {
    key: "clean",
    name: "Max Clean",
    current: 185,
    previous: 180,
    unit: "lbs",
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    pr: 185,
    prDate: "Jan 28, 2026",
  },
  {
    key: "vertical",
    name: "Vertical Jump",
    current: 32,
    previous: 30,
    unit: "in",
    icon: ArrowUpRight,
    color: "text-green-400",
    bg: "bg-green-500/10",
    pr: 33,
    prDate: "Dec 15, 2025",
  },
  {
    key: "sprint",
    name: "40-yard Dash",
    current: 4.52,
    previous: 4.60,
    unit: "sec",
    icon: Timer,
    color: "text-red-400",
    bg: "bg-red-500/10",
    pr: 4.48,
    prDate: "Nov 20, 2025",
    lowerIsBetter: true,
  },
]

const personalRecords = [
  { lift: "Back Squat", value: "285 lbs", date: "Feb 12, 2026", improvement: "+15 lbs" },
  { lift: "Deadlift", value: "335 lbs", date: "Feb 15, 2026", improvement: "+20 lbs" },
  { lift: "Bench Press", value: "225 lbs", date: "Feb 10, 2026", improvement: "+10 lbs" },
  { lift: "Power Clean", value: "185 lbs", date: "Jan 28, 2026", improvement: "+10 lbs" },
  { lift: "Vertical Jump", value: "33 in", date: "Dec 15, 2025", improvement: "+3 in" },
  { lift: "40-yard Dash", value: "4.48s", date: "Nov 20, 2025", improvement: "-0.12s" },
]

const customTooltipStyle = {
  backgroundColor: "#18181f",
  border: "1px solid #27272a",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#fafafa",
}

function BenchmarkCard({ benchmark }: { benchmark: typeof benchmarks[0] }) {
  const Icon = benchmark.icon
  const delta = benchmark.current - benchmark.previous
  const isImprovement = benchmark.lowerIsBetter ? delta < 0 : delta > 0
  const isCurrentPR = benchmark.current === benchmark.pr

  return (
    <Card className={cn(
      "bg-card border transition-all duration-200 hover:shadow-lg hover:shadow-black/20",
      isCurrentPR ? "border-primary/30" : "border-border"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", benchmark.bg)}>
            <Icon className={cn("h-5 w-5", benchmark.color)} />
          </div>
          {isCurrentPR && (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-primary">
              <Trophy className="h-3.5 w-3.5" /> PR
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground font-medium mb-1">{benchmark.name}</p>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-bold text-foreground tracking-tight">{benchmark.current}</span>
          <span className="text-sm text-muted-foreground mb-1">{benchmark.unit}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className={cn(
            "flex items-center gap-1 text-sm font-semibold",
            isImprovement ? "text-green-400" : "text-red-400"
          )}>
            {isImprovement ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {delta > 0 ? `+${delta}` : delta} {benchmark.unit}
          </div>
          <span className="text-xs text-muted-foreground">vs last</span>
        </div>

        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            PR: <span className="text-foreground font-medium">{benchmark.pr} {benchmark.unit}</span>
            <span className="ml-1 text-muted-foreground/60">({benchmark.prDate})</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProgressPage() {
  return (
    <AppShell role="PLAYER" userName="Marcus Thompson" userEmail="marcus@email.com">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Progress</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your performance benchmarks and personal records
          </p>
        </div>

        {/* Benchmark Cards */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Key Benchmarks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {benchmarks.map((b) => (
              <BenchmarkCard key={b.key} benchmark={b} />
            ))}
          </div>
        </div>

        {/* Progress Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Benchmark Progression</CardTitle>
              <Badge variant="outline" className="text-[10px]">Last 7 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={benchmarkHistory} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={{ stroke: "#27272a" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={{ stroke: "#27272a" }}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", color: "#a1a1aa", paddingTop: "16px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="squat"
                    name="Squat"
                    stroke="#C9A84C"
                    strokeWidth={2}
                    dot={{ fill: "#C9A84C", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="deadlift"
                    name="Deadlift"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    dot={{ fill: "#60a5fa", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bench"
                    name="Bench"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    dot={{ fill: "#a78bfa", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clean"
                    name="Clean"
                    stroke="#fb923c"
                    strokeWidth={2}
                    dot={{ fill: "#fb923c", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Personal Records */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Personal Records</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground pb-3">Lift / Metric</th>
                    <th className="text-right text-xs font-medium text-muted-foreground pb-3">Record</th>
                    <th className="text-right text-xs font-medium text-muted-foreground pb-3">Improvement</th>
                    <th className="text-right text-xs font-medium text-muted-foreground pb-3">Date Set</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {personalRecords.map((record) => (
                    <tr key={record.lift} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-3.5 w-3.5 text-primary/60" />
                          <span className="text-sm font-medium text-foreground">{record.lift}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm font-bold text-primary">{record.value}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm font-semibold text-green-400">{record.improvement}</span>
                      </td>
                      <td className="py-3 text-right text-xs text-muted-foreground">{record.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
