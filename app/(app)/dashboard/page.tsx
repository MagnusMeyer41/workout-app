"use client"

import * as React from "react"
import Link from "next/link"
import { Dumbbell, Users, Shield, ArrowRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const roles = [
  {
    key: "COACH",
    label: "Coach",
    description: "Create and manage training programs, track player performance, and build your team.",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    href: "/home",
    features: ["Program creation", "Player management", "Team analytics"],
  },
  {
    key: "PLAYER",
    label: "Player",
    description: "View your assigned programs, log training sessions, and track your progress over time.",
    icon: Dumbbell,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    href: "/home",
    features: ["Training sessions", "Progress tracking", "Benchmarks"],
  },
  {
    key: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full platform oversight — manage organizations, users, and system-wide settings.",
    icon: Shield,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    href: "/home",
    features: ["Organization management", "User administration", "System stats"],
  },
]

export default function DashboardPage() {
  const userName = "Alex"

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Background */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/30">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">AthleteOS</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Welcome back, <span className="text-primary">{userName}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your role to continue to your dashboard
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <Link
                key={role.key}
                href={role.href}
                className={cn(
                  "group relative flex flex-col rounded-xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 bg-card",
                  role.border,
                  "hover:border-opacity-60"
                )}
              >
                {/* Icon */}
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-all duration-200 group-hover:scale-110", role.bg)}>
                  <Icon className={cn("h-6 w-6", role.color)} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">{role.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {role.description}
                </p>

                {/* Features */}
                <ul className="space-y-1.5 mb-5">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={cn("h-1.5 w-1.5 rounded-full", role.color.replace("text-", "bg-"))} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors duration-200",
                  role.color
                )}>
                  Enter as {role.label}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
