import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; etId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: programId, etId } = await params
  const { setNumber, targetReps, targetWeight, targetWeightPercent, benchmarkDefinitionId, restSeconds, notes } =
    await req.json()

  const set = await prisma.setTemplate.create({
    data: {
      exerciseTemplateId: etId,
      setNumber,
      targetReps,
      targetWeight: targetWeight ?? null,
      targetWeightPercent: targetWeightPercent ?? null,
      benchmarkDefinitionId: benchmarkDefinitionId ?? null,
      restSeconds: restSeconds ?? 60,
      notes: notes ?? null,
    },
    include: { benchmarkDef: true },
  })

  await prisma.programAssignment.updateMany({
    where: { programId },
    data: { isSynced: false },
  })

  return NextResponse.json(set, { status: 201 })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; etId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: programId, etId } = await params
  const { setId } = await req.json()

  await prisma.setTemplate.delete({ where: { id: setId, exerciseTemplateId: etId } })

  await prisma.programAssignment.updateMany({
    where: { programId },
    data: { isSynced: false },
  })

  return NextResponse.json({ ok: true })
}
