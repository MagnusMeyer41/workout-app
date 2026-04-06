import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; weekId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: programId, weekId } = await params

  await prisma.programWeek.delete({ where: { id: weekId } })

  await prisma.programAssignment.updateMany({
    where: { programId },
    data: { isSynced: false },
  })

  return NextResponse.json({ ok: true })
}
