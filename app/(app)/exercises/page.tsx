"use client"

import * as React from "react"
import { Plus, Search, Dumbbell, Filter } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Muscle {
  id: string
  name: string
}

interface ExerciseMuscle {
  isPrimary: boolean
  muscle: Muscle
}

interface Exercise {
  id: string
  name: string
  category: string
  defaultUnit: string
  organizationId: string | null
  muscles: ExerciseMuscle[]
}

const CATEGORIES = ["Strength", "Olympic", "Power", "Speed", "Core", "Conditioning"]

export default function ExercisesPage() {
  const [exercises, setExercises] = React.useState<Exercise[]>([])
  const [search, setSearch] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [loading, setLoading] = React.useState(true)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [form, setForm] = React.useState({ name: "", category: "", defaultUnit: "kg" })

  const fetchExercises = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/exercises")
      if (res.ok) setExercises(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchExercises()
  }, [fetchExercises])

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase()
    return exercises.filter(
      (e) =>
        e.name.toLowerCase().includes(q) &&
        (categoryFilter === "all" || e.category === categoryFilter)
    )
  }, [exercises, search, categoryFilter])

  const handleCreate = async () => {
    // organizationId would come from user's session in a real app
    await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, organizationId: "org-placeholder" }),
    })
    setCreateOpen(false)
    setForm({ name: "", category: "", defaultUnit: "kg" })
    fetchExercises()
  }

  return (
    <AppShell role="COACH">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Exercise Library</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Browse global exercises and create custom ones for your org
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Custom Exercise</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="e.g. Nordic Curl"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Unit</Label>
                  <Select
                    defaultValue="kg"
                    onValueChange={(v) => setForm({ ...form, defaultUnit: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["kg", "lbs", "reps", "seconds", "m", "cm"].map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!form.name || !form.category}>
                  Create Exercise
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((exercise) => {
              const primary = exercise.muscles.filter((m) => m.isPrimary).map((m) => m.muscle.name)
              const secondary = exercise.muscles.filter((m) => !m.isPrimary).map((m) => m.muscle.name)
              return (
                <Card key={exercise.id} className="border-border hover:border-primary/30 transition-all duration-200 group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Dumbbell className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-[10px]">
                          {exercise.category}
                        </Badge>
                        {!exercise.organizationId && (
                          <Badge variant="secondary" className="text-[10px]">Global</Badge>
                        )}
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold mt-2 mb-1">{exercise.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">Unit: {exercise.defaultUnit}</p>
                    {primary.length > 0 && (
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Primary</p>
                        <div className="flex flex-wrap gap-1">
                          {primary.map((m) => (
                            <span key={m} className="text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {secondary.length > 0 && (
                      <div className="mt-1.5">
                        <div className="flex flex-wrap gap-1">
                          {secondary.slice(0, 3).map((m) => (
                            <span key={m} className="text-[10px] bg-muted text-muted-foreground rounded px-1.5 py-0.5">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <Dumbbell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">No exercises found</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Try a different search or run the seed script to populate the library
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
