import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const orgId = searchParams.get("orgId")
  const category = searchParams.get("category")
  const muscleId = searchParams.get("muscleId")

  const exercises = await prisma.exercise.findMany({
    where: {
      AND: [
        // Global exercises OR exercises belonging to the specified org
        orgId
          ? { OR: [{ organizationId: null }, { organizationId: orgId }] }
          : { organizationId: null },
        category ? { category } : {},
        muscleId ? { muscles: { some: { muscleId } } } : {},
      ],
    },
    include: {
      muscles: {
        include: { muscle: true },
      },
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })

  return NextResponse.json(exercises)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, category, defaultUnit, organizationId } = body

  if (!name || !category) {
    return NextResponse.json({ error: "name and category are required" }, { status: 400 })
  }

  // Only allow creating org-scoped exercises (not global)
  if (!organizationId) {
    return NextResponse.json({ error: "organizationId is required" }, { status: 400 })
  }

  const exercise = await prisma.exercise.create({
    data: { name, category, defaultUnit: defaultUnit ?? "kg", organizationId },
    include: { muscles: { include: { muscle: true } } },
  })

  return NextResponse.json(exercise, { status: 201 })
}
