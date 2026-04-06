"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle2, ChevronLeft, Plus, Loader2, XCircle } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface SetTemplate {
  id: string
  setNumber: number
  targetReps: number
  targetWeight: number | null
  targetWeightPercent: number | null
  restSeconds: number
  benchmarkDef: { name: string; unit: string } | null
}

interface ExerciseTemplate {
  id: string
  order: number
  exercise: { id: string; name: string }
  setTemplates: SetTemplate[]
}

interface WorkoutDay {
  id: string
  name: string
  exerciseTemplates: ExerciseTemplate[]
}

interface ScheduledWorkout {
  id: string
  status: string
  workoutDay: WorkoutDay & {
    week: { weekNumber: number; program: { name: string } }
  }
}

interface SetLogEntry {
  setNumber: number
  reps: string
  weight: string
  rpe: string
  completed: boolean
}

export default function TrainingSessionPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const scheduledWorkoutId = params.id

  const [scheduledWorkout, setScheduledWorkout] = React.useState<ScheduledWorkout | null>(null)
  const [sessionId, setSessionId] = React.useState<string | null>(null)
  const [setLogs, setSetLogs] = React.useState<Record<string, SetLogEntry[]>>({}) // exerciseTemplateId → sets
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  // Load the scheduled workout details from schedule API
  React.useEffect(() => {
    fetch(`/api/schedule`)
      .then((r) => r.json())
      .then((workouts: ScheduledWorkout[]) => {
        const found = Array.isArray(workouts)
          ? workouts.find((w) => w.id === scheduledWorkoutId)
          : null
        setScheduledWorkout(found ?? null)

        if (found) {
          // Initialize set log state from templates
          const initial: Record<string, SetLogEntry[]> = {}
          for (const et of found.workoutDay.exerciseTemplates) {
            initial[et.id] = et.setTemplates.map((st) => ({
              setNumber: st.setNumber,
              reps: "",
              weight: st.targetWeight ? String(st.targetWeight) : "",
              rpe: "",
              completed: false,
            }))
          }
          setSetLogs(initial)
        }
      })
      .finally(() => setLoading(false))
  }, [scheduledWorkoutId])

  const startSession = async () => {
    setSaving(true)
    const res = await fetch("/api/training-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledWorkoutId, date: new Date().toISOString() }),
    })
    const session = await res.json()
    setSessionId(session.id)
    setSaving(false)
  }

  const updateSet = (etId: string, setIdx: number, field: keyof SetLogEntry, value: string | boolean) => {
    setSetLogs((prev) => ({
      ...prev,
      [etId]: prev[etId].map((s, i) => (i === setIdx ? { ...s, [field]: value } : s)),
    }))
  }

  const addSet = (etId: string) => {
    setSetLogs((prev) => ({
      ...prev,
      [etId]: [
        ...prev[etId],
        { setNumber: prev[etId].length + 1, reps: "", weight: "", rpe: "", completed: false },
      ],
    }))
  }

  const finishSession = async (status: "COMPLETED" | "SKIPPED") => {
    if (!sessionId) return
    setSaving(true)

    // Save all exercise + set logs
    if (status === "COMPLETED" && scheduledWorkout) {
      for (const et of scheduledWorkout.workoutDay.exerciseTemplates) {
        const logRes = await fetch(`/api/training-sessions/${sessionId}/exercises`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exerciseId: et.exercise.id, order: et.order }),
        })
        const log = await logRes.json()
        const sets = setLogs[et.id] ?? []
        for (const s of sets) {
          if (s.reps || s.weight) {
            await fetch(`/api/training-sessions/${sessionId}/exercises/${log.id}/sets`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                setNumber: s.setNumber,
                reps: s.reps ? parseInt(s.reps) : null,
                weight: s.weight ? parseFloat(s.weight) : null,
                rpe: s.rpe ? parseFloat(s.rpe) : null,
                completed: s.completed,
              }),
            })
          }
        }
      }
    }

    await fetch(`/api/training-sessions/${sessionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    setSaving(false)
    router.push("/schedule")
  }

  if (loading) {
    return (
      <AppShell role="PLAYER">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    )
  }

  if (!scheduledWorkout) {
    return (
      <AppShell role="PLAYER">
        <div className="p-6 lg:p-8">
          <p className="text-muted-foreground">Workout not found.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/schedule">Back to Schedule</Link>
          </Button>
        </div>
      </AppShell>
    )
  }

  const { workoutDay } = scheduledWorkout

  return (
    <AppShell role="PLAYER">
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/schedule"><ChevronLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">{workoutDay.name}</h1>
            <p className="text-sm text-muted-foreground">
              {workoutDay.week.program.name} · Week {workoutDay.week.weekNumber}
            </p>
          </div>
        </div>

        {/* Start session banner */}
        {!sessionId ? (
          <Card className="border-primary/30 bg-primary/5 mb-6">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-sm font-medium">Ready to train?</p>
              <Button onClick={startSession} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Start Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center gap-2 mb-6 px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm font-medium text-blue-400">Session in progress</span>
          </div>
        )}

        {/* Exercise list */}
        <div className="space-y-4">
          {workoutDay.exerciseTemplates
            .sort((a, b) => a.order - b.order)
            .map((et) => {
              const logs = setLogs[et.id] ?? []
              return (
                <Card key={et.id} className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{et.exercise.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {et.setTemplates.length} sets prescribed
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Set log rows */}
                    <div className="space-y-2 mb-3">
                      <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground px-1 mb-1">
                        <span>Set</span>
                        <span>Target</span>
                        <span>Reps</span>
                        <span>Weight</span>
                        <span>RPE</span>
                      </div>
                      {logs.map((log, idx) => {
                        const template = et.setTemplates[idx]
                        return (
                          <div key={idx} className="grid grid-cols-5 gap-2 items-center">
                            <button
                              onClick={() => sessionId && updateSet(et.id, idx, "completed", !log.completed)}
                              className="flex items-center justify-center"
                            >
                              {log.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                              ) : (
                                <span className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                              )}
                            </button>
                            <span className="text-xs text-muted-foreground">
                              {template
                                ? `${template.targetReps}r${template.targetWeight ? ` @${template.targetWeight}kg` : template.targetWeightPercent ? ` @${template.targetWeightPercent}%` : ""}`
                                : "—"}
                            </span>
                            <Input
                              type="number"
                              placeholder="—"
                              value={log.reps}
                              onChange={(e) => updateSet(et.id, idx, "reps", e.target.value)}
                              disabled={!sessionId}
                              className="h-8 text-xs"
                            />
                            <Input
                              type="number"
                              step="0.5"
                              placeholder="—"
                              value={log.weight}
                              onChange={(e) => updateSet(et.id, idx, "weight", e.target.value)}
                              disabled={!sessionId}
                              className="h-8 text-xs"
                            />
                            <Input
                              type="number"
                              step="0.5"
                              min="1"
                              max="10"
                              placeholder="—"
                              value={log.rpe}
                              onChange={(e) => updateSet(et.id, idx, "rpe", e.target.value)}
                              disabled={!sessionId}
                              className="h-8 text-xs"
                            />
                          </div>
                        )
                      })}
                    </div>
                    {sessionId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground text-xs"
                        onClick={() => addSet(et.id)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add set
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
        </div>

        {/* Finish buttons */}
        {sessionId && (
          <div className="flex gap-3 mt-6">
            <Button
              className="flex-1"
              onClick={() => finishSession("COMPLETED")}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Complete Session
            </Button>
            <Button
              variant="outline"
              onClick={() => finishSession("SKIPPED")}
              disabled={saving}
            >
              <XCircle className="h-4 w-4" />
              Skip
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
