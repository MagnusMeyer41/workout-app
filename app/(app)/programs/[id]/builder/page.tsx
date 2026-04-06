"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Plus, Trash2, ChevronLeft, Loader2, GripVertical, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SetTemplate {
  id: string
  setNumber: number
  targetReps: number
  targetWeight: number | null
  targetWeightPercent: number | null
  restSeconds: number
  notes: string | null
}

interface ExerciseTemplate {
  id: string
  order: number
  notes: string | null
  exercise: { id: string; name: string; category: string }
  setTemplates: SetTemplate[]
}

interface WorkoutDay {
  id: string
  dayNumber: number
  name: string
  notes: string | null
  exerciseTemplates: ExerciseTemplate[]
}

interface ProgramWeek {
  id: string
  weekNumber: number
  days: WorkoutDay[]
}

interface Program {
  id: string
  name: string
  type: string
  isTemplate: boolean
  weeks: ProgramWeek[]
  _count?: { assignments: number }
}

interface Exercise {
  id: string
  name: string
  category: string
}

export default function ProgramBuilderPage() {
  const { id: programId } = useParams<{ id: string }>()

  const [program, setProgram] = React.useState<Program | null>(null)
  const [exercises, setExercises] = React.useState<Exercise[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  // Add day dialog state
  const [addDayWeekId, setAddDayWeekId] = React.useState<string | null>(null)
  const [addDayForm, setAddDayForm] = React.useState({ name: "", dayNumber: "1" })

  // Add exercise dialog state
  const [addExDayId, setAddExDayId] = React.useState<string | null>(null)
  const [addExWeekId, setAddExWeekId] = React.useState<string | null>(null)
  const [addExForm, setAddExForm] = React.useState({ exerciseId: "" })

  const fetchProgram = React.useCallback(async () => {
    const [pRes, eRes] = await Promise.all([
      fetch(`/api/programs/${programId}`),
      fetch(`/api/exercises`),
    ])
    if (pRes.ok) setProgram(await pRes.json())
    if (eRes.ok) setExercises(await eRes.json())
    setLoading(false)
  }, [programId])

  React.useEffect(() => {
    fetchProgram()
  }, [fetchProgram])

  const addWeek = async () => {
    if (!program) return
    setSaving(true)
    const nextNum = (program.weeks[program.weeks.length - 1]?.weekNumber ?? 0) + 1
    await fetch(`/api/programs/${programId}/weeks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekNumber: nextNum }),
    })
    await fetchProgram()
    setSaving(false)
  }

  const deleteWeek = async (weekId: string) => {
    setSaving(true)
    await fetch(`/api/programs/${programId}/weeks/${weekId}`, { method: "DELETE" })
    await fetchProgram()
    setSaving(false)
  }

  const addDay = async () => {
    if (!addDayWeekId) return
    setSaving(true)
    await fetch(`/api/programs/${programId}/weeks/${addDayWeekId}/days`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: addDayForm.name, dayNumber: parseInt(addDayForm.dayNumber) }),
    })
    setAddDayWeekId(null)
    setAddDayForm({ name: "", dayNumber: "1" })
    await fetchProgram()
    setSaving(false)
  }

  const deleteDay = async (weekId: string, dayId: string) => {
    setSaving(true)
    await fetch(`/api/programs/${programId}/weeks/${weekId}/days/${dayId}`, { method: "DELETE" })
    await fetchProgram()
    setSaving(false)
  }

  const addExercise = async () => {
    if (!addExDayId || !addExWeekId || !addExForm.exerciseId) return
    const day = program?.weeks.find((w) => w.id === addExWeekId)?.days.find((d) => d.id === addExDayId)
    const nextOrder = (day?.exerciseTemplates.length ?? 0) + 1
    setSaving(true)
    await fetch(`/api/programs/${programId}/weeks/${addExWeekId}/days/${addExDayId}/exercises`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseId: addExForm.exerciseId, order: nextOrder }),
    })
    setAddExDayId(null)
    setAddExWeekId(null)
    setAddExForm({ exerciseId: "" })
    await fetchProgram()
    setSaving(false)
  }

  const addSet = async (weekId: string, dayId: string, etId: string, etSetsCount: number) => {
    setSaving(true)
    await fetch(`/api/programs/${programId}/weeks/${weekId}/days/${dayId}/exercises/${etId}/sets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setNumber: etSetsCount + 1, targetReps: 8, restSeconds: 60 }),
    })
    await fetchProgram()
    setSaving(false)
  }

  if (loading) {
    return (
      <AppShell role="COACH">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    )
  }

  if (!program) {
    return (
      <AppShell role="COACH">
        <div className="p-8"><p className="text-muted-foreground">Program not found.</p></div>
      </AppShell>
    )
  }

  const hasOutOfSyncAssignments = (program._count?.assignments ?? 0) > 0

  return (
    <AppShell role="COACH">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/programs"><ChevronLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{program.name}</h1>
                {program.isTemplate && <Badge variant="secondary">Template</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">Program Builder · {program.weeks.length} week{program.weeks.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <Button onClick={addWeek} disabled={saving}>
            <Plus className="h-4 w-4" />
            Add Week
          </Button>
        </div>

        {/* Out-of-sync warning */}
        {hasOutOfSyncAssignments && (
          <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-6 text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0" />
            <span className="text-yellow-300">
              This program has active athlete assignments. Changes will mark them as out-of-sync until re-synced.
            </span>
          </div>
        )}

        {/* Weeks */}
        {program.weeks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground font-medium mb-4">No weeks yet</p>
            <Button onClick={addWeek} disabled={saving}>
              <Plus className="h-4 w-4" />
              Add Week 1
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {program.weeks.map((week) => (
              <Card key={week.id} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Week {week.weekNumber}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAddDayWeekId(week.id)}
                        disabled={saving}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Day
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteWeek(week.id)}
                        disabled={saving}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {week.days.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No days yet — add your first workout day
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {week.days
                        .sort((a, b) => a.dayNumber - b.dayNumber)
                        .map((day) => (
                          <Card key={day.id} className="border-border/60">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-muted-foreground">Day {day.dayNumber}</p>
                                  <p className="text-sm font-semibold">{day.name}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => { setAddExDayId(day.id); setAddExWeekId(week.id) }}
                                    disabled={saving}
                                  >
                                    <Plus className="h-3 w-3" />
                                    Exercise
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => deleteDay(week.id, day.id)}
                                    disabled={saving}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                              {day.exerciseTemplates.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-3">No exercises</p>
                              ) : (
                                <div className="space-y-2">
                                  {day.exerciseTemplates
                                    .sort((a, b) => a.order - b.order)
                                    .map((et) => (
                                      <div key={et.id} className="rounded-lg bg-muted/50 p-2.5">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-1.5">
                                            <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
                                            <span className="text-xs font-medium">{et.exercise.name}</span>
                                          </div>
                                          <Badge variant="outline" className="text-[10px]">
                                            {et.exercise.category}
                                          </Badge>
                                        </div>
                                        {et.setTemplates.length > 0 && (
                                          <div className="space-y-1 mb-2">
                                            {et.setTemplates.map((st) => (
                                              <div key={st.id} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                <span className="font-mono">S{st.setNumber}</span>
                                                <span>{st.targetReps} reps</span>
                                                {st.targetWeight && <span>@ {st.targetWeight}kg</span>}
                                                {st.targetWeightPercent && <span>@ {st.targetWeightPercent}%</span>}
                                                <span>· {st.restSeconds}s rest</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 text-[10px] text-muted-foreground w-full"
                                          onClick={() => addSet(week.id, day.id, et.id, et.setTemplates.length)}
                                          disabled={saving}
                                        >
                                          <Plus className="h-2.5 w-2.5" />
                                          Add set
                                        </Button>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Day Dialog */}
      <Dialog open={!!addDayWeekId} onOpenChange={(o) => !o && setAddDayWeekId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Add Workout Day</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Day Name</Label>
              <Input
                placeholder="e.g. Upper Body Push"
                value={addDayForm.name}
                onChange={(e) => setAddDayForm({ ...addDayForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Day Number</Label>
              <Input
                type="number"
                min="1"
                value={addDayForm.dayNumber}
                onChange={(e) => setAddDayForm({ ...addDayForm, dayNumber: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDayWeekId(null)}>Cancel</Button>
            <Button onClick={addDay} disabled={!addDayForm.name || saving}>Add Day</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Exercise Dialog */}
      <Dialog open={!!addExDayId} onOpenChange={(o) => !o && setAddExDayId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Add Exercise</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Exercise</Label>
              <Select onValueChange={(v) => setAddExForm({ exerciseId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick from library..." />
                </SelectTrigger>
                <SelectContent>
                  {exercises.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name} <span className="text-muted-foreground">({e.category})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddExDayId(null)}>Cancel</Button>
            <Button onClick={addExercise} disabled={!addExForm.exerciseId || saving}>Add Exercise</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
