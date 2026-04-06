import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") ?? session.user.id

  const benchmarks = await prisma.benchmark.findMany({
    where: { userId },
    include: { benchmarkDefinition: true },
    orderBy: { recordedAt: "desc" },
  })

  // Group by definition and surface the most recent per definition
  const latestByDef = new Map<string, (typeof benchmarks)[0]>()
  for (const b of benchmarks) {
    if (!latestByDef.has(b.benchmarkDefinitionId)) {
      latestByDef.set(b.benchmarkDefinitionId, b)
    }
  }

  return NextResponse.json({ all: benchmarks, latest: Array.from(latestByDef.values()) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { benchmarkDefinitionId, value, unit, notes } = await req.json()

  if (!benchmarkDefinitionId || value === undefined) {
    return NextResponse.json({ error: "benchmarkDefinitionId and value are required" }, { status: 400 })
  }

  const benchmark = await prisma.benchmark.create({
    data: {
      userId: session.user.id,
      benchmarkDefinitionId,
      value,
      unit: unit ?? "kg",
      notes,
    },
    include: { benchmarkDefinition: true },
  })

  return NextResponse.json(benchmark, { status: 201 })
}
