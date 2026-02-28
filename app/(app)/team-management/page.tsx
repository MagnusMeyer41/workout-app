"use client"

import * as React from "react"
import {
  Users,
  Mail,
  Clock,
  Shield,
  ChevronDown,
  Check,
  Trash2,
  Send,
  UserPlus,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const members = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@athleteos.com",
    avatar: "AJ",
    roles: ["COACH"],
    joinedDate: "Jan 1, 2025",
    status: "Active",
    isYou: true,
  },
  {
    id: "2",
    name: "Marcus Thompson",
    email: "marcus@email.com",
    avatar: "MT",
    roles: ["PLAYER"],
    joinedDate: "Feb 15, 2025",
    status: "Active",
    isYou: false,
  },
  {
    id: "3",
    name: "Sarah Kowalski",
    email: "sarah@email.com",
    avatar: "SK",
    roles: ["PLAYER"],
    joinedDate: "Mar 1, 2025",
    status: "Active",
    isYou: false,
  },
  {
    id: "4",
    name: "Devon Richards",
    email: "devon@email.com",
    avatar: "DR",
    roles: ["PLAYER", "COACH"],
    joinedDate: "Jan 20, 2025",
    status: "Active",
    isYou: false,
  },
  {
    id: "5",
    name: "Brendan Cole",
    email: "brendan@email.com",
    avatar: "BC",
    roles: ["PLAYER"],
    joinedDate: "Apr 10, 2025",
    status: "Inactive",
    isYou: false,
  },
]

const pendingInvites = [
  { email: "newplayer@email.com", role: "PLAYER", sentAt: "2 hours ago", status: "Pending" },
  { email: "athlete2@gmail.com", role: "PLAYER", sentAt: "1 day ago", status: "Pending" },
  { email: "assist.coach@team.com", role: "COACH", sentAt: "3 days ago", status: "Expired" },
]

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge
      variant={role === "COACH" ? "default" : role === "SUPER_ADMIN" ? "destructive" : "secondary"}
      className="text-[10px]"
    >
      {role === "SUPER_ADMIN" ? "Admin" : role === "COACH" ? "Coach" : "Player"}
    </Badge>
  )
}

export default function TeamManagementPage() {
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState("")

  return (
    <AppShell role="COACH" userName="Alex Johnson" userEmail="alex@athleteos.com">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage team members, roles, and invitations
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{members.length} members</span>
          </div>
        </div>

        {/* Members Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Member</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Roles</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Joined</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className={cn(
                              "text-xs font-semibold",
                              member.isYou ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"
                            )}>
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground">{member.name}</p>
                              {member.isYou && (
                                <Badge variant="outline" className="text-[10px]">You</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {member.roles.map((role) => (
                            <RoleBadge key={role} role={role} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {member.joinedDate}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant={member.status === "Active" ? "success" : "secondary"}
                          className="text-[10px]"
                        >
                          {member.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!member.isYou && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs gap-1"
                              >
                                Manage <ChevronDown className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Shield className="h-4 w-4" /> Assign as Coach
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Check className="h-4 w-4" /> Set as Player
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="h-4 w-4" /> Remove from Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Invites */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Pending Invites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingInvites.map((invite, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{invite.email}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <RoleBadge role={invite.role} />
                        <span className="text-xs text-muted-foreground">Sent {invite.sentAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={invite.status === "Pending" ? "warning" : "secondary"}
                      className="text-[10px]"
                    >
                      {invite.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              {pendingInvites.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No pending invites</p>
              )}
            </CardContent>
          </Card>

          {/* Invite Form */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Invite New Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-invite-email">Email Address</Label>
                <Input
                  id="team-invite-email"
                  type="email"
                  placeholder="member@team.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLAYER">Player</SelectItem>
                    <SelectItem value="COACH">Coach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  They will receive an email with instructions to join your team. Super Admin roles can only be assigned by system admins.
                </p>
              </div>
              <Button className="w-full" disabled={!inviteEmail || !inviteRole}>
                <Send className="h-4 w-4" />
                Send Invitation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
