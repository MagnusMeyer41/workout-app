import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const orgId = searchParams.get("orgId")

  const defs = await prisma.benchmarkDefinition.findMany({
    where: orgId
      ? { OR: [{ organizationId: null }, { organizationId: orgId }] }
      : { organizationId: null },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(defs)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name, unit, organizationId } = await req.json()
  if (!name || !organizationId) {
    return NextResponse.json({ error: "name and organizationId are required" }, { status: 400 })
  }

  const def = await prisma.benchmarkDefinition.create({
    data: { name, unit: unit ?? "kg", organizationId },
  })

  return NextResponse.json(def, { status: 201 })
}
