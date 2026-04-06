import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

// Module-level singleton so every test file that imports this module
// shares the same connection to the SQLite file.
let _prisma: PrismaClient | undefined

/**
 * Returns (or lazily creates) the single PrismaClient for the test suite.
 * Because vitest runs all test files in the same Node process when
 * singleThread:true, this module is evaluated once and _prisma is shared.
 */
export function getTestPrisma(): PrismaClient {
  if (_prisma) return _prisma
  const url = process.env.TEST_DATABASE_URL
  if (!url) throw new Error("TEST_DATABASE_URL is not set — did globalSetup run?")
  const adapter = new PrismaLibSql({ url })
  _prisma = new PrismaClient({ adapter })
  return _prisma
}

/** Call once in a global afterAll to cleanly close the connection. */
export async function disconnectTestPrisma(): Promise<void> {
  if (_prisma) {
    await _prisma.$disconnect()
    _prisma = undefined
  }
}

/**
 * Truncates all tables in FK-safe order using a single raw SQL batch.
 */
export async function truncateAll(prisma: PrismaClient): Promise<void> {
  const tables = [
    "SetLog",
    "ExerciseLog",
    "TrainingSession",
    "ScheduledWorkout",
    "ProgramAssignment",
    "SetTemplate",
    "ExerciseTemplate",
    "WorkoutDay",
    "ProgramWeek",
    "Program",
    "TeamMembership",
    "Team",
    "OrgMembership",
    "Notification",
    "Benchmark",
    "BenchmarkDefinition",
    "ExerciseMuscle",
    "Exercise",
    "Muscle",
    "Account",
    "Session",
    "VerificationToken",
    "User",
    "Organization",
  ]
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`)
  }
}

// ─────────────────────────────────────────────
// Seed helpers — build the minimum graph needed
// ─────────────────────────────────────────────

export async function seedMinimum(prisma: PrismaClient) {
  const org = await prisma.organization.create({
    data: { name: "Test Org", slug: "test-org" },
  })

  const coach = await prisma.user.create({
    data: { email: "coach@test.com", name: "Coach" },
  })

  const player = await prisma.user.create({
    data: { email: "player@test.com", name: "Player" },
  })

  return { org, coach, player }
}

export async function seedProgram(
  prisma: PrismaClient,
  orgId: string,
  coachId: string,
  opts: { weeks: number; daysPerWeek: number } = { weeks: 2, daysPerWeek: 2 }
) {
  const program = await prisma.program.create({
    data: {
      name: "Test Program",
      type: "STRENGTH",
      coachId,
      organizationId: orgId,
    },
  })

  for (let w = 1; w <= opts.weeks; w++) {
    const week = await prisma.programWeek.create({
      data: { programId: program.id, weekNumber: w },
    })
    for (let d = 1; d <= opts.daysPerWeek; d++) {
      await prisma.workoutDay.create({
        data: { weekId: week.id, dayNumber: d, name: `Week ${w} Day ${d}` },
      })
    }
  }

  return program
}
