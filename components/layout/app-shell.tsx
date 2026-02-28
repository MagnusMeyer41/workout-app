import * as React from "react"
import { Sidebar } from "./sidebar"

type Role = "SUPER_ADMIN" | "COACH" | "PLAYER"

interface AppShellProps {
  children: React.ReactNode
  role: Role
  userName?: string
  userEmail?: string
  userImage?: string
}

export function AppShell({ children, role, userName, userEmail, userImage }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        role={role}
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
      />
      <main className="lg:pl-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
