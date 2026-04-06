import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; weekId: string; dayId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: programId, dayId } = await params
  const { exerciseId, order, notes } = await req.json()

  const et = await prisma.exerciseTemplate.create({
    data: { workoutDayId: dayId, exerciseId, order, notes },
    include: {
      exercise: { include: { muscles: { include: { muscle: true } } } },
      setTemplates: true,
    },
  })

  await prisma.programAssignment.updateMany({
    where: { programId },
    data: { isSynced: false },
  })

  return NextResponse.json(et, { status: 201 })
}
