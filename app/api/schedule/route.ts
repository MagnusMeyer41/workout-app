import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") ?? session.user.id
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const workouts = await prisma.scheduledWorkout.findMany({
    where: {
      programAssignment: { playerId: userId },
      ...(from || to
        ? {
            scheduledDate: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    include: {
      workoutDay: {
        include: {
          exerciseTemplates: {
            orderBy: { order: "asc" },
            include: {
              exercise: true,
              setTemplates: { include: { benchmarkDef: true } },
            },
          },
          week: { include: { program: { select: { id: true, name: true, type: true } } } },
        },
      },
      programAssignment: { select: { id: true, programId: true, startDate: true } },
    },
    orderBy: { scheduledDate: "asc" },
  })

  return NextResponse.json(workouts)
}
