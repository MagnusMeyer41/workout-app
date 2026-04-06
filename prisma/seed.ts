import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding global muscles...")
  const muscles = await Promise.all([
    prisma.muscle.upsert({ where: { name: "Quadriceps" }, update: {}, create: { name: "Quadriceps" } }),
    prisma.muscle.upsert({ where: { name: "Hamstrings" }, update: {}, create: { name: "Hamstrings" } }),
    prisma.muscle.upsert({ where: { name: "Glutes" }, update: {}, create: { name: "Glutes" } }),
    prisma.muscle.upsert({ where: { name: "Lower Back" }, update: {}, create: { name: "Lower Back" } }),
    prisma.muscle.upsert({ where: { name: "Upper Back" }, update: {}, create: { name: "Upper Back" } }),
    prisma.muscle.upsert({ where: { name: "Chest" }, update: {}, create: { name: "Chest" } }),
    prisma.muscle.upsert({ where: { name: "Shoulders" }, update: {}, create: { name: "Shoulders" } }),
    prisma.muscle.upsert({ where: { name: "Triceps" }, update: {}, create: { name: "Triceps" } }),
    prisma.muscle.upsert({ where: { name: "Biceps" }, update: {}, create: { name: "Biceps" } }),
    prisma.muscle.upsert({ where: { name: "Calves" }, update: {}, create: { name: "Calves" } }),
    prisma.muscle.upsert({ where: { name: "Core" }, update: {}, create: { name: "Core" } }),
    prisma.muscle.upsert({ where: { name: "Hip Flexors" }, update: {}, create: { name: "Hip Flexors" } }),
    prisma.muscle.upsert({ where: { name: "Traps" }, update: {}, create: { name: "Traps" } }),
    prisma.muscle.upsert({ where: { name: "Forearms" }, update: {}, create: { name: "Forearms" } }),
  ])

  const muscleMap = Object.fromEntries(muscles.map((m) => [m.name, m.id]))

  console.log("Seeding global exercises...")

  const exerciseDefs: {
    name: string
    category: string
    defaultUnit: string
    primaryMuscles: string[]
    secondaryMuscles: string[]
  }[] = [
    {
      name: "Squat",
      category: "Strength",
      defaultUnit: "kg",
      primaryMuscles: ["Quadriceps", "Glutes"],
      secondaryMuscles: ["Hamstrings", "Lower Back", "Core"],
    },
    {
      name: "Bench Press",
      category: "Strength",
      defaultUnit: "kg",
      primaryMuscles: ["Chest"],
      secondaryMuscles: ["Triceps", "Shoulders"],
    },
    {
      name: "Deadlift",
      category: "Strength",
      defaultUnit: "kg",
      primaryMuscles: ["Lower Back", "Hamstrings"],
      secondaryMuscles: ["Glutes", "Traps", "Forearms"],
    },
    {
      name: "Clean",
      category: "Olympic",
      defaultUnit: "kg",
      primaryMuscles: ["Hamstrings", "Glutes"],
      secondaryMuscles: ["Traps", "Shoulders", "Core"],
    },
    {
      name: "Broad Jump",
      category: "Power",
      defaultUnit: "m",
      primaryMuscles: ["Quadriceps", "Glutes"],
      secondaryMuscles: ["Hamstrings", "Calves"],
    },
    {
      name: "Vertical Jump",
      category: "Power",
      defaultUnit: "cm",
      primaryMuscles: ["Quadriceps", "Glutes"],
      secondaryMuscles: ["Calves", "Hamstrings"],
    },
    {
      name: "Overhead Press",
      category: "Strength",
      defaultUnit: "kg",
      primaryMuscles: ["Shoulders"],
      secondaryMuscles: ["Triceps", "Traps"],
    },
    {
      name: "Pull-Up",
      category: "Strength",
      defaultUnit: "reps",
      primaryMuscles: ["Upper Back"],
      secondaryMuscles: ["Biceps", "Forearms"],
    },
    {
      name: "Barbell Row",
      category: "Strength",
      defaultUnit: "kg",
      primaryMuscles: ["Upper Back"],
      secondaryMuscles: ["Biceps", "Lower Back", "Forearms"],
    },
    {
      name: "Romanian Deadlift",
      category: "Strength",
      defaultUnit: "kg",
      primaryMuscles: ["Hamstrings"],
      secondaryMuscles: ["Glutes", "Lower Back"],
    },
    {
      name: "Lunge",
      category: "Strength",
      defaultUnit: "kg",
      primaryMuscles: ["Quadriceps", "Glutes"],
      secondaryMuscles: ["Hamstrings", "Calves"],
    },
    {
      name: "Hip Thrust",
      category: "Strength",
      defaultUnit: "kg",
      primaryMuscles: ["Glutes"],
      secondaryMuscles: ["Hamstrings", "Core"],
    },
    {
      name: "Plank",
      category: "Core",
      defaultUnit: "seconds",
      primaryMuscles: ["Core"],
      secondaryMuscles: ["Shoulders"],
    },
    {
      name: "Sprint 40m",
      category: "Speed",
      defaultUnit: "seconds",
      primaryMuscles: ["Quadriceps", "Hamstrings"],
      secondaryMuscles: ["Glutes", "Calves"],
    },
  ]

  for (const def of exerciseDefs) {
    const exercise = await prisma.exercise.upsert({
      where: {
        // Use name+null org as unique key — workaround for composite unique with null
        id: `global-${def.name.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: {},
      create: {
        id: `global-${def.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: def.name,
        category: def.category,
        defaultUnit: def.defaultUnit,
        organizationId: null,
      },
    })

    // Upsert primary muscles
    for (const muscleName of def.primaryMuscles) {
      const muscleId = muscleMap[muscleName]
      if (muscleId) {
        await prisma.exerciseMuscle.upsert({
          where: { exerciseId_muscleId: { exerciseId: exercise.id, muscleId } },
          update: { isPrimary: true },
          create: { exerciseId: exercise.id, muscleId, isPrimary: true },
        })
      }
    }
    // Upsert secondary muscles
    for (const muscleName of def.secondaryMuscles) {
      const muscleId = muscleMap[muscleName]
      if (muscleId) {
        await prisma.exerciseMuscle.upsert({
          where: { exerciseId_muscleId: { exerciseId: exercise.id, muscleId } },
          update: { isPrimary: false },
          create: { exerciseId: exercise.id, muscleId, isPrimary: false },
        })
      }
    }
  }

  console.log("Seeding global benchmark definitions...")

  const benchmarkDefs = [
    { id: "bdef-squat", name: "Max Squat", unit: "kg" },
    { id: "bdef-bench", name: "Max Bench Press", unit: "kg" },
    { id: "bdef-deadlift", name: "Max Deadlift", unit: "kg" },
    { id: "bdef-clean", name: "Max Clean", unit: "kg" },
    { id: "bdef-vertical", name: "Vertical Jump", unit: "cm" },
    { id: "bdef-broad", name: "Broad Jump", unit: "m" },
    { id: "bdef-sprint40", name: "Sprint 40m", unit: "seconds" },
  ]

  for (const def of benchmarkDefs) {
    await prisma.benchmarkDefinition.upsert({
      where: { id: def.id },
      update: {},
      create: {
        id: def.id,
        name: def.name,
        unit: def.unit,
        organizationId: null,
      },
    })
  }

  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
