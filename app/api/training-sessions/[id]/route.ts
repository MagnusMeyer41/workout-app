import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { status, notes } = await req.json()

  const trainingSession = await prisma.trainingSession.findUnique({
    where: { id },
    select: { scheduledWorkoutId: true },
  })
  if (!trainingSession) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updated = await prisma.trainingSession.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
    },
  })

  // Keep ScheduledWorkout in sync
  if (status && trainingSession.scheduledWorkoutId) {
    await prisma.scheduledWorkout.update({
      where: { id: trainingSession.scheduledWorkoutId },
      data: { status },
    })
  }

  return NextResponse.json(updated)
}
