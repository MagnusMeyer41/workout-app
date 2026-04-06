import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; logId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { logId: exerciseLogId } = await params
  const { setNumber, reps, weight, unit, rpe, completed } = await req.json()

  const setLog = await prisma.setLog.create({
    data: {
      exerciseLogId,
      setNumber,
      reps: reps ?? null,
      weight: weight ?? null,
      unit: unit ?? "kg",
      rpe: rpe ?? null,
      completed: completed ?? false,
    },
  })

  return NextResponse.json(setLog, { status: 201 })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; logId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { logId: exerciseLogId } = await params
  const { setId, reps, weight, unit, rpe, completed } = await req.json()

  const setLog = await prisma.setLog.update({
    where: { id: setId, exerciseLogId },
    data: {
      ...(reps !== undefined && { reps }),
      ...(weight !== undefined && { weight }),
      ...(unit !== undefined && { unit }),
      ...(rpe !== undefined && { rpe }),
      ...(completed !== undefined && { completed }),
    },
  })

  return NextResponse.json(setLog)
}
