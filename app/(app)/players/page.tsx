"use client"

import * as React from "react"
import {
  Search,
  UserPlus,
  MoreHorizontal,
  User,
  BookOpen,
  UserMinus,
  TrendingUp,
  Mail,
  Calendar,
  Activity,
  ChevronRight,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const players = [
  {
    id: "1",
    name: "Marcus Thompson",
    email: "marcus@email.com",
    avatar: "MT",
    role: "PLAYER",
    lastActive: "2h ago",
    programs: 2,
    sessions: 24,
    streak: 12,
    status: "Active",
    benchmarks: { squat: 285, deadlift: 315, bench: 225 },
  },
  {
    id: "2",
    name: "Sarah Kowalski",
    email: "sarah@email.com",
    avatar: "SK",
    role: "PLAYER",
    lastActive: "1d ago",
    programs: 1,
    sessions: 18,
    streak: 5,
    status: "Active",
    benchmarks: { squat: 165, deadlift: 195, bench: 115 },
  },
  {
    id: "3",
    name: "Devon Richards",
    email: "devon@email.com",
    avatar: "DR",
    role: "PLAYER",
    lastActive: "3d ago",
    programs: 3,
    sessions: 31,
    streak: 0,
    status: "Active",
    benchmarks: { squat: 305, deadlift: 385, bench: 245 },
  },
  {
    id: "4",
    name: "Jenna Lee",
    email: "jenna@email.com",
    avatar: "JL",
    role: "PLAYER",
    lastActive: "5h ago",
    programs: 2,
    sessions: 14,
    streak: 8,
    status: "Active",
    benchmarks: { squat: 145, deadlift: 175, bench: 95 },
  },
  {
    id: "5",
    name: "Brendan Cole",
    email: "brendan@email.com",
    avatar: "BC",
    role: "PLAYER",
    lastActive: "1w ago",
    programs: 1,
    sessions: 8,
    streak: 0,
    status: "Inactive",
    benchmarks: { squat: 225, deadlift: 275, bench: 185 },
  },
  {
    id: "6",
    name: "Aaliyah Torres",
    email: "aaliyah@email.com",
    avatar: "AT",
    role: "PLAYER",
    lastActive: "1d ago",
    programs: 2,
    sessions: 22,
    streak: 6,
    status: "Active",
    benchmarks: { squat: 175, deadlift: 205, bench: 125 },
  },
]

function PlayerProfileDialog({ player }: { player: typeof players[0] }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setOpen(true) }}>
          <User className="h-4 w-4" /> View Profile
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Player Profile</DialogTitle>
          <DialogDescription>Detailed performance overview</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {/* Player info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/20 text-primary text-lg font-bold">
                {player.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold text-foreground">{player.name}</h3>
              <p className="text-sm text-muted-foreground">{player.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={player.status === "Active" ? "success" : "secondary"} className="text-[10px]">
                  {player.status}
                </Badge>
                <span className="text-xs text-muted-foreground">Last active {player.lastActive}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Sessions", value: player.sessions, icon: Calendar },
              { label: "Programs", value: player.programs, icon: BookOpen },
              { label: "Streak", value: `${player.streak}d`, icon: Activity },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                  <Icon className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              )
            })}
          </div>

          {/* Benchmarks */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Key Benchmarks</p>
            <div className="space-y-2.5">
              {[
                { name: "Max Squat", value: player.benchmarks.squat, max: 400, unit: "lbs" },
                { name: "Max Deadlift", value: player.benchmarks.deadlift, max: 500, unit: "lbs" },
                { name: "Max Bench", value: player.benchmarks.bench, max: 350, unit: "lbs" },
              ].map((b) => (
                <div key={b.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{b.name}</span>
                    <span className="font-semibold text-primary">{b.value} {b.unit}</span>
                  </div>
                  <Progress value={(b.value / b.max) * 100} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button>
            <BookOpen className="h-4 w-4" /> Assign Program
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InvitePlayerDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4" />
          Invite Player
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Player</DialogTitle>
          <DialogDescription>
            Send an invitation to a player to join your team.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Player Email</Label>
            <Input id="invite-email" type="email" placeholder="player@team.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-name">Player Name (Optional)</Label>
            <Input id="invite-name" placeholder="Full name" />
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              An email invitation will be sent to the player. They&apos;ll need to create an account to join your team.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>
            <Mail className="h-4 w-4" /> Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function PlayersPage() {
  const [search, setSearch] = React.useState("")

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppShell role="COACH" userName="Alex Johnson" userEmail="alex@athleteos.com">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Players</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {players.length} athletes on your roster
            </p>
          </div>
          <InvitePlayerDialog />
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Players Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Player</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-4">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-4">Last Active</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-4">Programs</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-4">Sessions</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-4">Streak</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                              {player.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{player.name}</p>
                            <p className="text-xs text-muted-foreground">{player.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant={player.status === "Active" ? "success" : "secondary"}
                          className="text-[10px]"
                        >
                          {player.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{player.lastActive}</td>
                      <td className="px-4 py-4 text-sm text-right text-foreground font-medium">{player.programs}</td>
                      <td className="px-4 py-4 text-sm text-right text-foreground font-medium">{player.sessions}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={cn(
                          "text-sm font-semibold",
                          player.streak > 0 ? "text-primary" : "text-muted-foreground"
                        )}>
                          {player.streak > 0 ? `${player.streak}d` : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <PlayerProfileDialog player={player} />
                            <DropdownMenuItem>
                              <BookOpen className="h-4 w-4" /> Assign Program
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <TrendingUp className="h-4 w-4" /> View Progress
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <UserMinus className="h-4 w-4" /> Remove from Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPlayers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <User className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">No players found</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
