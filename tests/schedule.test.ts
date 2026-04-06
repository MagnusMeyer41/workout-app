import { describe, it, expect, beforeEach, afterAll } from "vitest"
import {
  getTestPrisma,
  disconnectTestPrisma,
  truncateAll,
  seedMinimum,
  seedProgram,
} from "@/lib/test-utils"
import { generateSchedule, resyncSchedule, markAssignmentsOutOfSync } from "@/lib/schedule"

const prisma = getTestPrisma()

beforeEach(async () => {
  await truncateAll(prisma)
})

afterAll(async () => {
  await disconnectTestPrisma()
})

// ─────────────────────────────────────────────────────────────────────────────
// Cycle 1 — Row count
// ─────────────────────────────────────────────────────────────────────────────

describe("generateSchedule", () => {
  it("cycle 1 — 2-week program with 2 days/week generates exactly 4 ScheduledWorkout rows", async () => {
    const { org, coach, player } = await seedMinimum(prisma)
    const program = await seedProgram(prisma, org.id, coach.id, { weeks: 2, daysPerWeek: 2 })

    const startDate = new Date("2025-01-06") // Monday
    const assignment = await prisma.programAssignment.create({
      data: { programId: program.id, playerId: player.id, startDate },
    })

    await generateSchedule(prisma, assignment.id, program.id, startDate)

    const rows = await prisma.scheduledWorkout.findMany({
      where: { programAssignmentId: assignment.id },
    })
    expect(rows).toHaveLength(4)
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Cycle 2 — Date offsets
  // ─────────────────────────────────────────────────────────────────────────

  it("cycle 2 — scheduled dates: W1D1=startDate, W1D2=startDate+1, W2D1=startDate+7", async () => {
    const { org, coach, player } = await seedMinimum(prisma)
    const program = await seedProgram(prisma, org.id, coach.id, { weeks: 2, daysPerWeek: 2 })

    const startDate = new Date("2025-01-06")
    const assignment = await prisma.programAssignment.create({
      data: { programId: program.id, playerId: player.id, startDate },
    })

    await generateSchedule(prisma, assignment.id, program.id, startDate)

    const rows = await prisma.scheduledWorkout.findMany({
      where: { programAssignmentId: assignment.id },
      include: { workoutDay: { include: { week: true } } },
      orderBy: [
        { workoutDay: { week: { weekNumber: "asc" } } },
        { workoutDay: { dayNumber: "asc" } },
      ],
    })

    const toDateStr = (d: Date) => d.toISOString().slice(0, 10)

    expect(toDateStr(rows[0].scheduledDate)).toBe("2025-01-06") // W1D1
    expect(toDateStr(rows[1].scheduledDate)).toBe("2025-01-07") // W1D2
    expect(toDateStr(rows[2].scheduledDate)).toBe("2025-01-13") // W2D1
    expect(toDateStr(rows[3].scheduledDate)).toBe("2025-01-14") // W2D2
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Cycle 3 — isSynced flip
// ─────────────────────────────────────────────────────────────────────────────

describe("markAssignmentsOutOfSync", () => {
  it("cycle 3 — adding a WorkoutDay (via markAssignmentsOutOfSync) flips isSynced to false on all assignments", async () => {
    const { org, coach, player } = await seedMinimum(prisma)
    const program = await seedProgram(prisma, org.id, coach.id, { weeks: 1, daysPerWeek: 1 })

    const player2 = await prisma.user.create({ data: { email: "player2@test.com" } })

    const startDate = new Date("2025-01-06")
    const a1 = await prisma.programAssignment.create({
      data: { programId: program.id, playerId: player.id, startDate, isSynced: true },
    })
    const a2 = await prisma.programAssignment.create({
      data: { programId: program.id, playerId: player2.id, startDate, isSynced: true },
    })

    // Simulate adding a workout day by marking all assignments out of sync
    await markAssignmentsOutOfSync(prisma, program.id)

    const updated = await prisma.programAssignment.findMany({
      where: { id: { in: [a1.id, a2.id] } },
    })

    expect(updated.every((a) => a.isSynced === false)).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Cycle 4 — re-sync preserves COMPLETED/SKIPPED
// ─────────────────────────────────────────────────────────────────────────────

describe("resyncSchedule", () => {
  it("cycle 4 — re-sync deletes future SCHEDULED rows but leaves COMPLETED and SKIPPED untouched", async () => {
    const { org, coach, player } = await seedMinimum(prisma)
    const program = await seedProgram(prisma, org.id, coach.id, { weeks: 2, daysPerWeek: 1 })

    // Use a far-past start date so all calculated dates are also in the past
    const past = new Date("2020-01-01")
    const assignment = await prisma.programAssignment.create({
      data: { programId: program.id, playerId: player.id, startDate: past, isSynced: false },
    })

    const weeks = await prisma.programWeek.findMany({
      where: { programId: program.id },
      include: { days: true },
      orderBy: { weekNumber: "asc" },
    })
    const day1 = weeks[0].days[0]
    const day2 = weeks[1].days[0]

    // Create a COMPLETED past row — must not be touched by resync
    await prisma.scheduledWorkout.create({
      data: {
        workoutDayId: day1.id,
        programAssignmentId: assignment.id,
        scheduledDate: new Date("2020-01-01"),
        status: "COMPLETED",
      },
    })

    // Create a future SCHEDULED row — must be deleted by resync
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    await prisma.scheduledWorkout.create({
      data: {
        workoutDayId: day2.id,
        programAssignmentId: assignment.id,
        scheduledDate: futureDate,
        status: "SCHEDULED",
      },
    })

    await resyncSchedule(prisma, assignment.id)

    const remaining = await prisma.scheduledWorkout.findMany({
      where: { programAssignmentId: assignment.id },
    })

    // COMPLETED row must still be there
    const completedRows = remaining.filter((r) => r.status === "COMPLETED")
    expect(completedRows).toHaveLength(1)

    // The future SCHEDULED row was deleted; no new future rows because
    // startDate is 2020 so all calculated dates are in the past
    const scheduledRows = remaining.filter((r) => r.status === "SCHEDULED")
    expect(scheduledRows).toHaveLength(0)
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Cycle 5 — re-sync sets isSynced = true
  // ─────────────────────────────────────────────────────────────────────────

  it("cycle 5 — re-sync sets isSynced back to true", async () => {
    const { org, coach, player } = await seedMinimum(prisma)
    const program = await seedProgram(prisma, org.id, coach.id, { weeks: 1, daysPerWeek: 1 })

    const startDate = new Date("2020-01-01")
    const assignment = await prisma.programAssignment.create({
      data: { programId: program.id, playerId: player.id, startDate, isSynced: false },
    })

    await resyncSchedule(prisma, assignment.id)

    const updated = await prisma.programAssignment.findUnique({ where: { id: assignment.id } })
    expect(updated?.isSynced).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Cycles 6 & 7 — TrainingSession status transitions
// ─────────────────────────────────────────────────────────────────────────────

describe("TrainingSession status transitions", () => {
  async function setupSessionFixture() {
    const { org, coach, player } = await seedMinimum(prisma)
    const program = await seedProgram(prisma, org.id, coach.id, { weeks: 1, daysPerWeek: 1 })
    const startDate = new Date("2025-01-06")
    const assignment = await prisma.programAssignment.create({
      data: { programId: program.id, playerId: player.id, startDate },
    })
    await generateSchedule(prisma, assignment.id, program.id, startDate)

    const scheduledWorkout = await prisma.scheduledWorkout.findFirst({
      where: { programAssignmentId: assignment.id },
    })
    if (!scheduledWorkout) throw new Error("No scheduled workout found")

    const session = await prisma.trainingSession.create({
      data: {
        userId: player.id,
        scheduledWorkoutId: scheduledWorkout.id,
        date: startDate,
        status: "SCHEDULED",
      },
    })

    return { player, scheduledWorkout, session }
  }

  it("cycle 6 — starting a TrainingSession transitions both TrainingSession and ScheduledWorkout to IN_PROGRESS", async () => {
    const { scheduledWorkout, session } = await setupSessionFixture()

    await prisma.trainingSession.update({
      where: { id: session.id },
      data: { status: "IN_PROGRESS" },
    })
    await prisma.scheduledWorkout.update({
      where: { id: scheduledWorkout.id },
      data: { status: "IN_PROGRESS" },
    })

    const updatedSession = await prisma.trainingSession.findUnique({ where: { id: session.id } })
    const updatedWorkout = await prisma.scheduledWorkout.findUnique({
      where: { id: scheduledWorkout.id },
    })

    expect(updatedSession?.status).toBe("IN_PROGRESS")
    expect(updatedWorkout?.status).toBe("IN_PROGRESS")
  })

  it("cycle 7 — completing a TrainingSession transitions both to COMPLETED", async () => {
    const { scheduledWorkout, session } = await setupSessionFixture()

    await prisma.trainingSession.update({
      where: { id: session.id },
      data: { status: "COMPLETED" },
    })
    await prisma.scheduledWorkout.update({
      where: { id: scheduledWorkout.id },
      data: { status: "COMPLETED" },
    })

    const updatedSession = await prisma.trainingSession.findUnique({ where: { id: session.id } })
    const updatedWorkout = await prisma.scheduledWorkout.findUnique({
      where: { id: scheduledWorkout.id },
    })

    expect(updatedSession?.status).toBe("COMPLETED")
    expect(updatedWorkout?.status).toBe("COMPLETED")
  })
})
