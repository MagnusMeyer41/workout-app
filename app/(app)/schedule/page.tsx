"use client"

import * as React from "react"
import Link from "next/link"
import { Calendar, ChevronLeft, ChevronRight, Dumbbell, CheckCircle2, Clock, XCircle, Circle } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ScheduledWorkout {
  id: string
  scheduledDate: string
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED"
  workoutDay: {
    name: string
    exerciseTemplates: { exercise: { name: string } }[]
    week: {
      weekNumber: number
      program: { id: string; name: string; type: string }
    }
  }
}

const STATUS_CONFIG = {
  SCHEDULED: { label: "Scheduled", icon: Circle, color: "text-muted-foreground", badge: "secondary" as const },
  IN_PROGRESS: { label: "In Progress", icon: Clock, color: "text-blue-400", badge: "default" as const },
  COMPLETED: { label: "Completed", icon: CheckCircle2, color: "text-green-400", badge: "default" as const },
  SKIPPED: { label: "Skipped", icon: XCircle, color: "text-muted-foreground", badge: "outline" as const },
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function SchedulePage() {
  const [workouts, setWorkouts] = React.useState<ScheduledWorkout[]>([])
  const [loading, setLoading] = React.useState(true)
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date())

  React.useEffect(() => {
    const from = startOfMonth(currentMonth).toISOString()
    const to = endOfMonth(currentMonth).toISOString()
    setLoading(true)
    fetch(`/api/schedule?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((d) => setWorkouts(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [currentMonth])

  // Build a map: date string → workouts
  const workoutsByDate = React.useMemo(() => {
    const map = new Map<string, ScheduledWorkout[]>()
    for (const w of workouts) {
      const key = new Date(w.scheduledDate).toDateString()
      const existing = map.get(key) ?? []
      map.set(key, [...existing, w])
    }
    return map
  }, [workouts])

  const selectedWorkouts = selectedDate ? (workoutsByDate.get(selectedDate.toDateString()) ?? []) : []

  // Build calendar grid
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDay = monthStart.getDay() // 0=Sun
  const totalDays = monthEnd.getDate()
  const calendarCells: (Date | null)[] = [
    ...Array.from({ length: startDay }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)),
  ]
  // Pad to full weeks
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)

  const today = new Date()
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <AppShell role="PLAYER">
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground text-sm mt-1">Your training calendar across all active programs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardContent className="p-6">
                {/* Month nav */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold">{monthName}</h2>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar cells */}
                {loading ? (
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {calendarCells.map((date, i) => {
                      if (!date) return <div key={i} />
                      const isToday = isSameDay(date, today)
                      const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
                      const dayWorkouts = workoutsByDate.get(date.toDateString()) ?? []
                      const hasCompleted = dayWorkouts.some((w) => w.status === "COMPLETED")
                      const hasScheduled = dayWorkouts.some((w) => w.status === "SCHEDULED")
                      const hasInProgress = dayWorkouts.some((w) => w.status === "IN_PROGRESS")

                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(date)}
                          className={cn(
                            "aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all duration-150 text-sm font-medium",
                            isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                            isToday && !isSelected ? "ring-1 ring-primary text-primary" : ""
                          )}
                        >
                          <span>{date.getDate()}</span>
                          {dayWorkouts.length > 0 && (
                            <span className={cn(
                              "absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5"
                            )}>
                              {hasCompleted && <span className="h-1 w-1 rounded-full bg-green-400" />}
                              {hasInProgress && <span className="h-1 w-1 rounded-full bg-blue-400" />}
                              {hasScheduled && <span className="h-1 w-1 rounded-full bg-primary" />}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Selected day panel */}
          <div>
            <div className="sticky top-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {selectedDate
                  ? selectedDate.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })
                  : "Select a day"}
              </h3>
              {selectedWorkouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl">
                  <Calendar className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No workouts scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedWorkouts.map((w) => {
                    const cfg = STATUS_CONFIG[w.status]
                    const StatusIcon = cfg.icon
                    const exercises = w.workoutDay.exerciseTemplates.slice(0, 4)
                    return (
                      <Card key={w.id} className="border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Dumbbell className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold">{w.workoutDay.name}</span>
                            </div>
                            <Badge variant={cfg.badge} className="text-[10px] flex items-center gap-1">
                              <StatusIcon className={cn("h-2.5 w-2.5", cfg.color)} />
                              {cfg.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {w.workoutDay.week.program.name} · Week {w.workoutDay.week.weekNumber}
                          </p>
                          {exercises.length > 0 && (
                            <div className="space-y-1 mb-3">
                              {exercises.map((et, idx) => (
                                <p key={idx} className="text-xs text-muted-foreground">
                                  · {et.exercise.name}
                                </p>
                              ))}
                              {w.workoutDay.exerciseTemplates.length > 4 && (
                                <p className="text-xs text-muted-foreground">
                                  +{w.workoutDay.exerciseTemplates.length - 4} more
                                </p>
                              )}
                            </div>
                          )}
                          {w.status === "SCHEDULED" || w.status === "IN_PROGRESS" ? (
                            <Button size="sm" className="w-full" asChild>
                              <Link href={`/training/${w.id}`}>
                                {w.status === "IN_PROGRESS" ? "Continue Session" : "Start Session"}
                              </Link>
                            </Button>
                          ) : null}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
