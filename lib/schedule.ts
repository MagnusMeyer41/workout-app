import { PrismaClient } from "@/app/generated/prisma/client"

/**
 * Generates ScheduledWorkout rows for a ProgramAssignment.
 * Week and day numbers are 1-based.
 */
export async function generateSchedule(
  prisma: PrismaClient,
  assignmentId: string,
  programId: string,
  startDate: Date
): Promise<number> {
  const weeks = await prisma.programWeek.findMany({
    where: { programId },
    include: { days: true },
    orderBy: { weekNumber: "asc" },
  })

  const rows = weeks.flatMap((week) =>
    week.days.map((day) => {
      const offsetDays = (week.weekNumber - 1) * 7 + (day.dayNumber - 1)
      const scheduledDate = new Date(startDate)
      scheduledDate.setDate(scheduledDate.getDate() + offsetDays)
      return {
        workoutDayId: day.id,
        programAssignmentId: assignmentId,
        scheduledDate,
        status: "SCHEDULED" as const,
      }
    })
  )

  await prisma.scheduledWorkout.createMany({ data: rows })
  return rows.length
}

/**
 * Re-syncs future SCHEDULED workouts for an existing assignment.
 * Leaves COMPLETED and SKIPPED rows untouched.
 * Sets isSynced = true on the assignment when done.
 */
export async function resyncSchedule(
  prisma: PrismaClient,
  assignmentId: string
): Promise<{ regenerated: number }> {
  const assignment = await prisma.programAssignment.findUnique({
    where: { id: assignmentId },
  })
  if (!assignment) throw new Error(`Assignment ${assignmentId} not found`)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Delete only future SCHEDULED workouts — preserve COMPLETED and SKIPPED
  await prisma.scheduledWorkout.deleteMany({
    where: {
      programAssignmentId: assignmentId,
      status: "SCHEDULED",
      scheduledDate: { gte: today },
    },
  })

  // Rebuild full schedule grid, filter to future only
  const weeks = await prisma.programWeek.findMany({
    where: { programId: assignment.programId },
    include: { days: true },
    orderBy: { weekNumber: "asc" },
  })

  const allRows = weeks.flatMap((week) =>
    week.days.map((day) => {
      const offsetDays = (week.weekNumber - 1) * 7 + (day.dayNumber - 1)
      const scheduledDate = new Date(assignment.startDate)
      scheduledDate.setDate(scheduledDate.getDate() + offsetDays)
      return { workoutDayId: day.id, programAssignmentId: assignmentId, scheduledDate }
    })
  )

  const futureRows = allRows.filter((r) => r.scheduledDate >= today)

  // Avoid duplicating any rows that still exist (e.g. IN_PROGRESS)
  const existing = await prisma.scheduledWorkout.findMany({
    where: { programAssignmentId: assignmentId },
    select: { workoutDayId: true },
  })
  const existingIds = new Set(existing.map((e) => e.workoutDayId))
  const newRows = futureRows.filter((r) => !existingIds.has(r.workoutDayId))

  if (newRows.length > 0) {
    await prisma.scheduledWorkout.createMany({
      data: newRows.map((r) => ({ ...r, status: "SCHEDULED" as const })),
    })
  }

  await prisma.programAssignment.update({
    where: { id: assignmentId },
    data: { isSynced: true },
  })

  return { regenerated: newRows.length }
}

/**
 * Marks all assignments for a program as isSynced = false.
 * Called when a WorkoutDay is added to a program.
 */
export async function markAssignmentsOutOfSync(
  prisma: PrismaClient,
  programId: string
): Promise<number> {
  const result = await prisma.programAssignment.updateMany({
    where: { programId },
    data: { isSynced: false },
  })
  return result.count
}
