import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSchedule } from "@/lib/schedule"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: programId } = await params
  const { playerIds, startDate } = await req.json()

  if (!playerIds?.length || !startDate) {
    return NextResponse.json({ error: "playerIds and startDate are required" }, { status: 400 })
  }

  const start = new Date(startDate)
  const assignments = []

  for (const playerId of playerIds as string[]) {
    // Upsert the assignment (allow re-assigning)
    const assignment = await prisma.programAssignment.upsert({
      where: { programId_playerId: { programId, playerId } },
      update: { startDate: start, isSynced: true },
      create: { programId, playerId, startDate: start, isSynced: true },
    })

    // Delete existing SCHEDULED workouts before regenerating
    await prisma.scheduledWorkout.deleteMany({
      where: { programAssignmentId: assignment.id, status: "SCHEDULED" },
    })

    await generateSchedule(prisma, assignment.id, programId, start)

    // Notify athlete
    await prisma.notification.create({
      data: {
        userId: playerId,
        type: "PROGRAM_ASSIGNED",
        payload: JSON.stringify({ programId, assignmentId: assignment.id }),
      },
    })

    assignments.push(assignment)
  }

  return NextResponse.json(assignments, { status: 201 })
}
