"use client"

import * as React from "react"
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  BookOpen,
  Users,
  Calendar,
  Dumbbell,
  Target,
  Filter,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const programs = [
  {
    id: "1",
    name: "Elite Strength Block I",
    type: "STRENGTH",
    description: "12-week progressive overload program focused on the big three lifts.",
    startDate: "Jan 15, 2026",
    endDate: "Apr 10, 2026",
    players: 8,
    status: "Active",
    progress: 65,
  },
  {
    id: "2",
    name: "Speed & Agility Protocol",
    type: "SPORT_SPECIFIC",
    description: "8-week sport-specific conditioning program targeting explosiveness.",
    startDate: "Feb 1, 2026",
    endDate: "Mar 28, 2026",
    players: 12,
    status: "Active",
    progress: 32,
  },
  {
    id: "3",
    name: "Off-Season Base Building",
    type: "STRENGTH",
    description: "Foundation strength program for athletes entering off-season.",
    startDate: "Dec 1, 2025",
    endDate: "Feb 28, 2026",
    players: 6,
    status: "Active",
    progress: 88,
  },
  {
    id: "4",
    name: "Pre-Season Conditioning",
    type: "SPORT_SPECIFIC",
    description: "Pre-season prep integrating sport patterns with conditioning.",
    startDate: "Mar 15, 2026",
    endDate: "May 1, 2026",
    players: 10,
    status: "Draft",
    progress: 0,
  },
  {
    id: "5",
    name: "Hypertrophy & Power",
    type: "STRENGTH",
    description: "6-week block focusing on hypertrophy adaptation and power output.",
    startDate: "Nov 1, 2025",
    endDate: "Dec 15, 2025",
    players: 4,
    status: "Completed",
    progress: 100,
  },
  {
    id: "6",
    name: "Olympic Lifting Intro",
    type: "SPORT_SPECIFIC",
    description: "Introductory olympic weightlifting program for athletes.",
    startDate: "Mar 1, 2026",
    endDate: "Apr 30, 2026",
    players: 0,
    status: "Draft",
    progress: 0,
  },
]

function getStatusVariant(status: string): "default" | "secondary" | "success" | "warning" | "outline" {
  if (status === "Active") return "success"
  if (status === "Draft") return "warning"
  if (status === "Completed") return "secondary"
  return "outline"
}

function ProgramCard({ program }: { program: typeof programs[0] }) {
  return (
    <Card className="bg-card border-border hover:border-border/80 transition-all duration-200 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
              program.type === "STRENGTH" ? "bg-primary/10" : "bg-blue-500/10"
            )}>
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
              <Badge
                variant={program.type === "STRENGTH" ? "default" : "outline"}
                className="text-[10px] mt-1"
              >
                {program.type === "STRENGTH" ? "Strength" : "Sport-Specific"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={getStatusVariant(program.status)} className="text-[10px]">
              {program.status}
            </Badge>
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
                  <Pencil className="h-4 w-4" /> Edit Program
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">
          {program.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{program.players} players</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{program.startDate}</span>
          </div>
        </div>

        {program.status !== "Draft" && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Progress</span>
              <span className={cn("font-semibold", program.progress === 100 ? "text-green-400" : "text-primary")}>
                {program.progress}%
              </span>
            </div>
            <Progress value={program.progress} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CreateProgramDialog() {
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    type: "",
    startDate: "",
    endDate: "",
    description: "",
  })

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
          <DialogDescription>
            Set up a new training program for your athletes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="prog-name">Program Name</Label>
            <Input
              id="prog-name"
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Describe the program goals and structure..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="flex w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>
            <BookOpen className="h-4 w-4" />
            Create Program
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ProgramsPage() {
  const [search, setSearch] = React.useState("")

  const filterPrograms = (tab: string) => {
    return programs.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      if (tab === "all") return matchesSearch
      if (tab === "strength") return matchesSearch && p.type === "STRENGTH"
      if (tab === "sport") return matchesSearch && p.type === "SPORT_SPECIFIC"
      if (tab === "drafts") return matchesSearch && p.status === "Draft"
      return matchesSearch
    })
  }

  return (
    <AppShell role="COACH" userName="Alex Johnson" userEmail="alex@athleteos.com">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Programs</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage and create training programs for your athletes
            </p>
          </div>
          <CreateProgramDialog />
        </div>

        {/* Search & Filter */}
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
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({programs.length})</TabsTrigger>
            <TabsTrigger value="strength">Strength ({programs.filter((p) => p.type === "STRENGTH").length})</TabsTrigger>
            <TabsTrigger value="sport">Sport-Specific ({programs.filter((p) => p.type === "SPORT_SPECIFIC").length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({programs.filter((p) => p.status === "Draft").length})</TabsTrigger>
          </TabsList>

          {["all", "strength", "sport", "drafts"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filterPrograms(tab).map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
                {filterPrograms(tab).length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">No programs found</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search or create a new program</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppShell>
  )
}
