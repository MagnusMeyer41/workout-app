import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      coach: { select: { id: true, name: true, image: true } },
      weeks: {
        orderBy: { weekNumber: "asc" },
        include: {
          days: {
            orderBy: { dayNumber: "asc" },
            include: {
              exerciseTemplates: {
                orderBy: { order: "asc" },
                include: {
                  exercise: { include: { muscles: { include: { muscle: true } } } },
                  setTemplates: {
                    orderBy: { setNumber: "asc" },
                    include: { benchmarkDef: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(program)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { name, description, type, isTemplate, isPublished } = body

  const program = await prisma.program.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(type !== undefined && { type }),
      ...(isTemplate !== undefined && { isTemplate }),
      ...(isPublished !== undefined && { isPublished }),
    },
  })

  // Mark all active assignments as out-of-sync when program content changes
  if (name !== undefined || description !== undefined || type !== undefined) {
    await prisma.programAssignment.updateMany({
      where: { programId: id },
      data: { isSynced: false },
    })
  }

  return NextResponse.json(program)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.program.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
