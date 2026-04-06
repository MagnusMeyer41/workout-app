import { describe, it, expect, beforeEach, afterAll } from "vitest"
import {
  getTestPrisma,
  disconnectTestPrisma,
  truncateAll,
  seedMinimum,
} from "@/lib/test-utils"

const prisma = getTestPrisma()

beforeEach(async () => {
  await truncateAll(prisma)
})

afterAll(async () => {
  await disconnectTestPrisma()
})

// ─────────────────────────────────────────────────────────────────────────────
// Cycle 8 — Composite unique constraint on Team
// ─────────────────────────────────────────────────────────────────────────────

describe("Schema integrity", () => {
  it("cycle 8 — composite unique (organizationId, slug) on Team rejects a duplicate slug in the same org", async () => {
    const { org } = await seedMinimum(prisma)

    await prisma.team.create({
      data: { name: "Alpha", slug: "alpha", organizationId: org.id },
    })

    await expect(
      prisma.team.create({
        data: { name: "Alpha Duplicate", slug: "alpha", organizationId: org.id },
      })
    ).rejects.toThrow()
  })

  it("cycle 8b — same slug in a different org is allowed", async () => {
    const org1 = await prisma.organization.create({ data: { name: "Org 1", slug: "org-1" } })
    const org2 = await prisma.organization.create({ data: { name: "Org 2", slug: "org-2" } })

    await prisma.team.create({ data: { name: "Alpha", slug: "alpha", organizationId: org1.id } })

    // Should not throw
    const team2 = await prisma.team.create({
      data: { name: "Alpha", slug: "alpha", organizationId: org2.id },
    })
    expect(team2.id).toBeTruthy()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Cycle 9 — Cascading deletes: Organization → Team → TeamMembership
  // ─────────────────────────────────────────────────────────────────────────

  it("cycle 9 — deleting an Organization cascades to Team and TeamMembership", async () => {
    const { org, player } = await seedMinimum(prisma)

    const team = await prisma.team.create({
      data: { name: "Test Team", slug: "test-team", organizationId: org.id },
    })
    await prisma.teamMembership.create({
      data: { userId: player.id, teamId: team.id, role: "PLAYER" },
    })

    const membersBefore = await prisma.teamMembership.findMany({ where: { teamId: team.id } })
    expect(membersBefore).toHaveLength(1)

    // Delete the org — should cascade to Team and TeamMembership
    await prisma.organization.delete({ where: { id: org.id } })

    const teamsAfter = await prisma.team.findMany({ where: { id: team.id } })
    const membersAfter = await prisma.teamMembership.findMany({ where: { teamId: team.id } })

    expect(teamsAfter).toHaveLength(0)
    expect(membersAfter).toHaveLength(0)
  })
})
