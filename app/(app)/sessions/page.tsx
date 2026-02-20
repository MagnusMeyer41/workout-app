"use client"

import * as React from "react"
import {
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  List,
  LayoutGrid,
  Trash2,
  ChevronRight,
  Target,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const sessions = [
  {
    id: "1",
    date: "Feb 19, 2026",
    dayOfWeek: "Thu",
    time: "3:00 PM",
    program: "Elite Strength Block I",
    programType: "STRENGTH",
    exercises: [
      { name: "Back Squat", sets: 5, reps: 5, weight: 275 },
      { name: "Romanian Deadlift", sets: 4, reps: 8, weight: 195 },
      { name: "Bulgarian Split Squat", sets: 3, reps: 10, weight: 135 },
    ],
    completed: false,
    isToday: true,
  },
  {
    id: "2",
    date: "Feb 17, 2026",
    dayOfWeek: "Tue",
    time: "10:00 AM",
    program: "Speed & Agility Protocol",
    programType: "SPORT_SPECIFIC",
    exercises: [
      { name: "Box Jumps", sets: 4, reps: 6, weight: null },
      { name: "Broad Jumps", sets: 3, reps: 5, weight: null },
      { name: "Sled Push", sets: 4, reps: null, weight: 90 },
      { name: "Cone Drills", sets: 3, reps: null, weight: null },
    ],
    completed: true,
    isToday: false,
  },
  {
    id: "3",
    date: "Feb 15, 2026",
    dayOfWeek: "Sun",
    time: "9:00 AM",
    program: "Elite Strength Block I",
    programType: "STRENGTH",
    exercises: [
      { name: "Deadlift", sets: 5, reps: 3, weight: 335 },
      { name: "Barbell Row", sets: 4, reps: 6, weight: 185 },
      { name: "Pull-ups", sets: 3, reps: 8, weight: null },
      { name: "Face Pulls", sets: 3, reps: 15, weight: 40 },
    ],
    completed: true,
    isToday: false,
  },
  {
    id: "4",
    date: "Feb 12, 2026",
    dayOfWeek: "Thu",
    time: "3:00 PM",
    program: "Elite Strength Block I",
    programType: "STRENGTH",
    exercises: [
      { name: "Bench Press", sets: 5, reps: 5, weight: 225 },
      { name: "Incline DB Press", sets: 3, reps: 10, weight: 75 },
      { name: "Tricep Pushdown", sets: 3, reps: 12, weight: 55 },
    ],
    completed: true,
    isToday: false,
  },
  {
    id: "5",
    date: "Feb 10, 2026",
    dayOfWeek: "Tue",
    time: "11:00 AM",
    program: "Speed & Agility Protocol",
    programType: "SPORT_SPECIFIC",
    exercises: [
      { name: "Sprint Intervals", sets: 6, reps: null, weight: null },
      { name: "Lateral Shuffles", sets: 4, reps: null, weight: null },
      { name: "Depth Drops", sets: 3, reps: 5, weight: null },
    ],
    completed: true,
    isToday: false,
  },
]

interface Exercise {
  name: string
  sets: string
  reps: string
  weight: string
}

function LogSessionDialog() {
  const [open, setOpen] = React.useState(false)
  const [exercises, setExercises] = React.useState<Exercise[]>([
    { name: "", sets: "", reps: "", weight: "" },
  ])

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }])
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    setExercises(exercises.map((ex, i) => i === index ? { ...ex, [field]: value } : ex))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Log Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Training Session</DialogTitle>
          <DialogDescription>
            Record your completed training session with exercises and weights.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Program</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select program..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Elite Strength Block I</SelectItem>
                  <SelectItem value="2">Speed &amp; Agility Protocol</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-date">Date</Label>
              <Input
                id="session-date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Exercises</Label>
              <Button variant="outline" size="sm" onClick={addExercise} className="h-7 text-xs">
                <Plus className="h-3 w-3" /> Add Exercise
              </Button>
            </div>
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <div key={index} className="p-3 rounded-lg border border-border bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Exercise {index + 1}</span>
                    {exercises.length > 1 && (
                      <button
                        onClick={() => removeExercise(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <Input
                    placeholder="Exercise name (e.g. Back Squat)"
                    value={exercise.name}
                    onChange={(e) => updateExercise(index, "name", e.target.value)}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Sets</label>
                      <Input
                        type="number"
                        placeholder="5"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, "sets", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Reps</label>
                      <Input
                        type="number"
                        placeholder="5"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, "reps", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Weight (lbs)</label>
                      <Input
                        type="number"
                        placeholder="225"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(index, "weight", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-notes">Notes (Optional)</Label>
            <textarea
              id="session-notes"
              rows={2}
              placeholder="How did the session feel? Any notes..."
              className="flex w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>
            <CheckCircle2 className="h-4 w-4" />
            Log Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SessionCard({ session }: { session: typeof sessions[0] }) {
  return (
    <Card className={cn(
      "bg-card border transition-all duration-200 hover:shadow-lg hover:shadow-black/20",
      session.isToday ? "border-primary/40 shadow-sm shadow-primary/10" : "border-border"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex flex-col items-center justify-center h-12 w-12 rounded-xl shrink-0",
              session.isToday ? "bg-primary/15 border border-primary/30" : "bg-muted"
            )}>
              <span className={cn("text-[10px] font-semibold uppercase", session.isToday ? "text-primary" : "text-muted-foreground")}>
                {session.dayOfWeek}
              </span>
              <span className={cn("text-lg font-bold leading-none", session.isToday ? "text-primary" : "text-foreground")}>
                {session.date.split(" ")[1].replace(",", "")}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                {session.isToday && (
                  <Badge variant="default" className="text-[10px]">Today</Badge>
                )}
                <Badge
                  variant={session.programType === "STRENGTH" ? "outline" : "secondary"}
                  className="text-[10px]"
                >
                  {session.programType === "STRENGTH" ? "Strength" : "Sport-Specific"}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-foreground mt-1">{session.program}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <Clock className="h-3.5 w-3.5" />
                {session.time}
              </div>
            </div>
          </div>
          <div>
            {session.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40" />
            )}
          </div>
        </div>

        <div className="space-y-2 border-t border-border/50 pt-3">
          {session.exercises.map((exercise, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                <span className="text-foreground/80">{exercise.name}</span>
              </div>
              <span className="text-muted-foreground tabular-nums">
                {exercise.sets && exercise.reps
                  ? `${exercise.sets}×${exercise.reps}`
                  : exercise.sets
                  ? `${exercise.sets} sets`
                  : "—"}
                {exercise.weight ? ` @ ${exercise.weight}lbs` : ""}
              </span>
            </div>
          ))}
        </div>

        {session.isToday && (
          <Button className="w-full mt-4" size="sm">
            Start Session <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default function SessionsPage() {
  const [view, setView] = React.useState<"list" | "grid">("list")
  const completedCount = sessions.filter((s) => s.completed).length

  return (
    <AppShell role="PLAYER" userName="Marcus Thompson" userEmail="marcus@email.com">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Training Sessions</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {completedCount} of {sessions.length} sessions completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-border bg-muted p-1 gap-0.5">
              <button
                onClick={() => setView("list")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                  view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-3.5 w-3.5" /> List
              </button>
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                  view === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Grid
              </button>
            </div>
            <LogSessionDialog />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Sessions", value: sessions.length, icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "This Week", value: 4, icon: Target, color: "text-primary", bg: "bg-primary/10" },
            { label: "Streak", value: "12d", icon: Dumbbell, color: "text-orange-400", bg: "bg-orange-500/10" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shrink-0", stat.bg)}>
                      <Icon className={cn("h-4 w-4", stat.color)} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Sessions */}
        <div className={cn(
          view === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            : "space-y-4 max-w-2xl"
        )}>
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
