"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, Loader2, Dumbbell, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Role = "COACH" | "PLAYER"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState<Role>("PLAYER")
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) return
    setIsLoading(true)
    // Simulate signup delay — replace with real API call when wiring backend
    await new Promise((r) => setTimeout(r, 1200))
    setIsLoading(false)
    router.push("/dashboard")
  }

  const roles = [
    {
      value: "PLAYER" as const,
      label: "Player",
      description: "Track workouts, view programs, log progress",
      icon: Dumbbell,
    },
    {
      value: "COACH" as const,
      label: "Coach",
      description: "Create programs, manage players, track team progress",
      icon: Users,
    },
  ]

  return (
    <div className="w-full max-w-md">
      <Card className="border-border bg-card shadow-2xl shadow-black/40">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Join AthleteOS and start training smarter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex@team.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  aria-pressed={showConfirm}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>

            {/* Role selection */}
            <div className="space-y-2">
              <Label>I am a...</Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.value
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={cn(
                        "relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all duration-200",
                        isSelected
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "border-border bg-muted hover:border-border/80 hover:bg-accent"
                      )}
                    >
                      <div className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-md",
                        isSelected ? "bg-primary/20" : "bg-secondary"
                      )}>
                        <Icon className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div>
                        <p className={cn("text-sm font-semibold", isSelected ? "text-primary" : "text-foreground")}>
                          {role.label}
                        </p>
                        <p className="text-xs text-muted-foreground leading-tight mt-0.5">{role.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 mt-2 font-semibold"
              disabled={isLoading || (form.confirm !== "" && form.password !== form.confirm)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-[#E8C870] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
