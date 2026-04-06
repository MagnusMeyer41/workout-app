import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const orgId = searchParams.get("orgId")
  const templatesOnly = searchParams.get("templates") === "true"

  if (!orgId) return NextResponse.json({ error: "orgId is required" }, { status: 400 })

  const programs = await prisma.program.findMany({
    where: {
      organizationId: orgId,
      ...(templatesOnly ? { isTemplate: true } : {}),
    },
    include: {
      coach: { select: { id: true, name: true, image: true } },
      _count: { select: { weeks: true, assignments: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(programs)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, description, type, organizationId, teamId, isTemplate } = body

  if (!name || !type || !organizationId) {
    return NextResponse.json({ error: "name, type, and organizationId are required" }, { status: 400 })
  }

  const program = await prisma.program.create({
    data: {
      name,
      description,
      type,
      coachId: session.user.id,
      organizationId,
      teamId: teamId ?? null,
      isTemplate: isTemplate ?? false,
    },
  })

  return NextResponse.json(program, { status: 201 })
}
