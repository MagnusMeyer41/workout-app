import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; weekId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: programId, weekId } = await params
  const { dayNumber, name, notes } = await req.json()

  const day = await prisma.workoutDay.create({
    data: { weekId, dayNumber, name, notes },
    include: { exerciseTemplates: true },
  })

  await prisma.programAssignment.updateMany({
    where: { programId },
    data: { isSynced: false },
  })

  return NextResponse.json(day, { status: 201 })
}
