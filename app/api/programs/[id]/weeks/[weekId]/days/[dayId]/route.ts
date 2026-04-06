import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; weekId: string; dayId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: programId, dayId } = await params
  const { name, notes, dayNumber } = await req.json()

  const day = await prisma.workoutDay.update({
    where: { id: dayId },
    data: {
      ...(name !== undefined && { name }),
      ...(notes !== undefined && { notes }),
      ...(dayNumber !== undefined && { dayNumber }),
    },
    include: { exerciseTemplates: { include: { exercise: true, setTemplates: true } } },
  })

  await prisma.programAssignment.updateMany({
    where: { programId },
    data: { isSynced: false },
  })

  return NextResponse.json(day)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; weekId: string; dayId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: programId, dayId } = await params

  await prisma.workoutDay.delete({ where: { id: dayId } })

  await prisma.programAssignment.updateMany({
    where: { programId },
    data: { isSynced: false },
  })

  return NextResponse.json({ ok: true })
}
