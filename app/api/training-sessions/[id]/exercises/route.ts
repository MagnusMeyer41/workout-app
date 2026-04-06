import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: trainingSessionId } = await params
  const { exerciseId, order, notes } = await req.json()

  const log = await prisma.exerciseLog.create({
    data: { trainingSessionId, exerciseId, order, notes },
    include: { exercise: true, setLogs: true },
  })

  return NextResponse.json(log, { status: 201 })
}
