"use client"

import * as React from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  BookOpen,
  Users,
  Dumbbell,
  Target,
  Copy,
  AlertTriangle,
  UserPlus,
  Loader2,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Program {
  id: string
  name: string
  type: "STRENGTH" | "SPORT_SPECIFIC"
  description: string | null
  isTemplate: boolean
  isPublished: boolean
  createdAt: string
  coach: { id: string; name: string | null; image: string | null }
  _count: { weeks: number; assignments: number }
}

// For demo purposes — in production, derive from session/orgMembership
const DEMO_ORG_ID = ""

function ProgramCard({
  program,
  onCopy,
  onDelete,
}: {
  program: Program
  onCopy: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card className="bg-card border-border hover:border-border/80 transition-all duration-200 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                program.type === "STRENGTH" ? "bg-primary/10" : "bg-blue-500/10"
              )}
            >
              {program.type === "STRENGTH" ? (
                <Dumbbell className="h-4 w-4 text-primary" />
              ) : (
                <Target className="h-4 w-4 text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                {program.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Badge
                  variant={program.type === "STRENGTH" ? "default" : "outline"}
                  className="text-[10px]"
                >
                  {program.type === "STRENGTH" ? "Strength" : "Sport-Specific"}
                </Badge>
                {program.isTemplate && (
                  <Badge variant="secondary" className="text-[10px]">Template</Badge>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/programs/${program.id}/builder`}>
                  <Pencil className="h-4 w-4" /> Open Builder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCopy(program.id)}>
                <Copy className="h-4 w-4" /> Copy Program
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(program.id)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {program.description && (
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">
            {program.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{program._count.weeks} week{program._count.weeks !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{program._count.assignments} assigned</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 text-xs h-7" asChild>
            <Link href={`/programs/${program.id}/builder`}>
              <Pencil className="h-3 w-3" />
              Edit
            </Link>
          </Button>
          {!program.isTemplate && (
            <AssignDialog programId={program.id} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function AssignDialog({ programId }: { programId: string }) {
  const [open, setOpen] = React.useState(false)
  const [playerIds, setPlayerIds] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  const handleAssign = async () => {
    if (!playerIds || !startDate) return
    setSaving(true)
    await fetch(`/api/programs/${programId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerIds: playerIds.split(",").map((s) => s.trim()).filter(Boolean),
        startDate,
      }),
    })
    setSaving(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex-1 text-xs h-7">
          <UserPlus className="h-3 w-3" />
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Program</DialogTitle>
          <DialogDescription>
            Assign this program to athletes and set a start date. A schedule will be generated automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Player IDs (comma-separated)</Label>
            <Input
              placeholder="cuid1, cuid2, ..."
              value={playerIds}
              onChange={(e) => setPlayerIds(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Enter the user IDs of the players to assign</p>
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAssign} disabled={!playerIds || !startDate || saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Assign & Generate Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreateProgramDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    type: "",
    description: "",
    isTemplate: false,
  })

  const handleCreate = async () => {
    if (!form.name || !form.type) return
    setSaving(true)
    await fetch("/api/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, organizationId: DEMO_ORG_ID || "demo-org" }),
    })
    setSaving(false)
    setOpen(false)
    setForm({ name: "", type: "", description: "", isTemplate: false })
    onCreated()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Create Program
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Program</DialogTitle>
          <DialogDescription>Set up a new training program for your athletes.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Program Name</Label>
            <Input
              placeholder="e.g. Elite Strength Block II"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Program Type</Label>
            <Select onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STRENGTH">Strength</SelectItem>
                <SelectItem value="SPORT_SPECIFIC">Sport-Specific</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              rows={3}
              placeholder="Describe the program goals..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="flex w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isTemplate"
              checked={form.isTemplate}
              onChange={(e) => setForm({ ...form, isTemplate: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isTemplate" className="cursor-pointer">Save as reusable template</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!form.name || !form.type || saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            <BookOpen className="h-4 w-4" />
            Create Program
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ProgramsPage() {
  const [programs, setPrograms] = React.useState<Program[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")

  const fetchPrograms = React.useCallback(async () => {
    setLoading(true)
    try {
      const orgId = DEMO_ORG_ID || "demo-org"
      const res = await fetch(`/api/programs?orgId=${orgId}`)
      if (res.ok) setPrograms(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  const handleCopy = async (id: string) => {
    await fetch(`/api/programs/${id}/copy`, { method: "POST" })
    fetchPrograms()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/programs/${id}`, { method: "DELETE" })
    fetchPrograms()
  }

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase()
    return programs.filter((p) => p.name.toLowerCase().includes(q))
  }, [programs, search])

  const categories = {
    all: filtered,
    strength: filtered.filter((p) => p.type === "STRENGTH" && !p.isTemplate),
    sport: filtered.filter((p) => p.type === "SPORT_SPECIFIC" && !p.isTemplate),
    templates: filtered.filter((p) => p.isTemplate),
  }

  const tabs = [
    { value: "all", label: `All (${categories.all.length})`, items: categories.all },
    { value: "strength", label: `Strength (${categories.strength.length})`, items: categories.strength },
    { value: "sport", label: `Sport-Specific (${categories.sport.length})`, items: categories.sport },
    { value: "templates", label: `Templates (${categories.templates.length})`, items: categories.templates },
  ]

  return (
    <AppShell role="COACH">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Programs</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage and create training programs for your athletes
            </p>
          </div>
          <CreateProgramDialog onCreated={fetchPrograms} />
        </div>

        {/* Out-of-sync banner */}
        {programs.some((p) => p._count.assignments > 0) && (
          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-6 text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0" />
            <span className="text-yellow-300 text-xs">
              Some programs may have out-of-sync assignments. Open the builder to review.
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(({ value, items }) => (
            <TabsContent key={value} value={value}>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      onCopy={handleCopy}
                      onDelete={handleDelete}
                    />
                  ))}
                  {items.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground font-medium">No programs found</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">
                        {search ? "Try adjusting your search" : "Create your first program to get started"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppShell>
  )
}
