import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: programId } = await params
  const body = await req.json()
  const { weekNumber } = body

  const week = await prisma.programWeek.create({
    data: { programId, weekNumber },
    include: { days: true },
  })

  // Mark assignments out of sync
  await prisma.programAssignment.updateMany({
    where: { programId },
    data: { isSynced: false },
  })

  return NextResponse.json(week, { status: 201 })
}
