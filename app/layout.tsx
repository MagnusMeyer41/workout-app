import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "AthleteOS - Admin Platform",
  description: "Premium coaching and workout administration platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  )
}
