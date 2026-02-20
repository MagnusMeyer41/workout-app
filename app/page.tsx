import { redirect } from "next/navigation"

export default function RootPage() {
  // In production this would check session and redirect accordingly
  // For now, redirect unauthenticated users to login
  redirect("/login")
}
