import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") ?? session.user.id

  const sessions = await prisma.trainingSession.findMany({
    where: { userId },
    include: {
      scheduledWorkout: {
        include: {
          workoutDay: {
            include: {
              week: { include: { program: { select: { id: true, name: true } } } },
            },
          },
        },
      },
      exerciseLogs: {
        orderBy: { order: "asc" },
        include: {
          exercise: true,
          setLogs: { orderBy: { setNumber: "asc" } },
        },
      },
    },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { scheduledWorkoutId, date, notes } = await req.json()

  const trainingSession = await prisma.trainingSession.create({
    data: {
      userId: session.user.id,
      scheduledWorkoutId: scheduledWorkoutId ?? null,
      date: date ? new Date(date) : new Date(),
      notes,
      status: "IN_PROGRESS",
    },
  })

  // Sync ScheduledWorkout status
  if (scheduledWorkoutId) {
    await prisma.scheduledWorkout.update({
      where: { id: scheduledWorkoutId },
      data: { status: "IN_PROGRESS" },
    })
  }

  return NextResponse.json(trainingSession, { status: 201 })
}
