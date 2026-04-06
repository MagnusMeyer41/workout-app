import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const source = await prisma.program.findUnique({
    where: { id },
    include: {
      weeks: {
        include: {
          days: {
            include: {
              exerciseTemplates: {
                include: { setTemplates: true },
              },
            },
          },
        },
      },
    },
  })

  if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Deep-clone the program hierarchy
  const copy = await prisma.program.create({
    data: {
      name: `${source.name} (copy)`,
      description: source.description,
      type: source.type,
      coachId: session.user.id,
      organizationId: source.organizationId,
      teamId: source.teamId,
      isTemplate: false,
      weeks: {
        create: source.weeks.map((week) => ({
          weekNumber: week.weekNumber,
          days: {
            create: week.days.map((day) => ({
              dayNumber: day.dayNumber,
              name: day.name,
              notes: day.notes,
              exerciseTemplates: {
                create: day.exerciseTemplates.map((et) => ({
                  exerciseId: et.exerciseId,
                  order: et.order,
                  notes: et.notes,
                  setTemplates: {
                    create: et.setTemplates.map((st) => ({
                      setNumber: st.setNumber,
                      targetReps: st.targetReps,
                      targetWeight: st.targetWeight,
                      targetWeightPercent: st.targetWeightPercent,
                      benchmarkDefinitionId: st.benchmarkDefinitionId,
                      restSeconds: st.restSeconds,
                      notes: st.notes,
                    })),
                  },
                })),
              },
            })),
          },
        })),
      },
    },
  })

  return NextResponse.json(copy, { status: 201 })
}
