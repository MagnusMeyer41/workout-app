import * as React from "react"
import { Zap } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fafafa 1px, transparent 1px), linear-gradient(90deg, #fafafa 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-center pt-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/30">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-foreground">AthleteOS</span>
            <div className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Admin Platform</div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 py-12">
        {children}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-muted-foreground pb-6">
        <p>&copy; 2026 AthleteOS. All rights reserved.</p>
      </footer>
    </div>
  )
}
