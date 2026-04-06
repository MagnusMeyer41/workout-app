import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { resyncSchedule } from "@/lib/schedule"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: assignmentId } = await params

  const assignment = await prisma.programAssignment.findUnique({
    where: { id: assignmentId },
  })
  if (!assignment) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { regenerated } = await resyncSchedule(prisma, assignmentId)

  return NextResponse.json({ ok: true, regenerated })
}
