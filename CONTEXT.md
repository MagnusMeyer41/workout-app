# AthleteOS — Project Context

Load this file at the start of a new chat to resume work with full context.

---

## What this is

**AthleteOS** — a Next.js 16 coaching platform. Coaches build structured training programs; athletes receive generated schedules and log sessions. The schema was fully redesigned in a single PR implementing GitHub issues #3–#13 from the PRD in issue #2 on MagnusMeyer41/workout-app.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.1.6, App Router, React 19 |
| Language | TypeScript 5 |
| Database | SQLite via `@prisma/adapter-libsql` (dev), Neon Postgres planned for prod |
| ORM | Prisma 7.4.1 — client output at `app/generated/prisma` |
| Auth | NextAuth v5 (beta) — Google OAuth only, no passwords |
| UI | shadcn/ui + Tailwind v4 + Radix UI |
| Testing | Vitest — real SQLite `test.db`, no mocked Prisma |

---

## Database schema (25 models)

### Auth (NextAuth)
- `User` — `isSuperAdmin: Boolean` (platform admin flag), no `passwordHash`
- `Account`, `Session`, `VerificationToken` — standard NextAuth tables

### Org & team (three-tier role system)
- `Organization` — `id, name, slug (unique), description, logoUrl`
- `OrgMembership` — `userId, organizationId, role: OrgRole (CLUB_ADMIN)` — org-level staff
- `Team` — `id, name, slug, organizationId` — composite unique `(organizationId, slug)`
- `TeamMembership` — `userId, teamId, role: TeamRole (COACH | PLAYER)`

### Exercise library
- `Exercise` — `id, name, category, defaultUnit, organizationId (null = global)`
- `Muscle` — `id, name (unique)`
- `ExerciseMuscle` — join table `(exerciseId, muscleId, isPrimary)`
- `BenchmarkDefinition` — `id, name, unit, organizationId (null = global)`

### Programs
- `Program` — `coachId, organizationId (required), isTemplate, isPublished, type: ProgramType (STRENGTH | SPORT_SPECIFIC)`
- `ProgramWeek` — `programId, weekNumber`
- `WorkoutDay` — `weekId, dayNumber, name, notes`
- `ExerciseTemplate` — `workoutDayId, exerciseId, order, notes`
- `SetTemplate` — `exerciseTemplateId, setNumber, targetReps, targetWeight?, targetWeightPercent?, benchmarkDefinitionId?, restSeconds`

### Assignment & schedule
- `ProgramAssignment` — `programId, playerId, startDate, isSynced` — composite unique `(programId, playerId)`
- `ScheduledWorkout` — `workoutDayId, programAssignmentId, scheduledDate, status: WorkoutStatus`

### Training log
- `TrainingSession` — `userId, scheduledWorkoutId?, date, status: WorkoutStatus` (replaces old `completed` bool + `programId`)
- `ExerciseLog` — `trainingSessionId, exerciseId, order, notes`
- `SetLog` — `exerciseLogId, setNumber, reps?, weight?, unit?, rpe?, completed`

### Other
- `Benchmark` — `userId, benchmarkDefinitionId, value, unit, recordedAt` (replaces old `BenchmarkType` enum)
- `Notification` — `userId, type: NotificationType (PROGRAM_ASSIGNED | WORKOUT_DUE | SESSION_REVIEWED), read, payload (JSON string), createdAt`

### Enums
```
OrgRole:        CLUB_ADMIN
TeamRole:       COACH | PLAYER
ProgramType:    STRENGTH | SPORT_SPECIFIC
WorkoutStatus:  SCHEDULED | IN_PROGRESS | COMPLETED | SKIPPED
NotificationType: PROGRAM_ASSIGNED | WORKOUT_DUE | SESSION_REVIEWED
```

---

## Key business logic — `lib/schedule.ts`

All schedule logic is extracted here (route handlers are thin wrappers):

```ts
generateSchedule(prisma, assignmentId, programId, startDate)
// Creates ScheduledWorkout rows: offset = (weekNumber-1)*7 + (dayNumber-1) days from startDate

resyncSchedule(prisma, assignmentId)
// Deletes future SCHEDULED workouts, regenerates from today onwards
// Preserves COMPLETED and SKIPPED rows
// Sets isSynced = true on the assignment
// Returns { regenerated: number }

markAssignmentsOutOfSync(prisma, programId)
// Sets isSynced = false on all assignments for a program
// Called whenever a ProgramWeek/WorkoutDay/ExerciseTemplate/SetTemplate is mutated
```

**isSynced rule**: Any mutation to program structure (adding/removing weeks, days, exercises, sets) calls `markAssignmentsOutOfSync`. Coaches see a warning banner. Re-sync is explicit via `POST /api/assignments/[id]/sync`.

**Status sync rule**: `TrainingSession.status` and its linked `ScheduledWorkout.status` must always be kept in sync (both updated atomically in the same request).

---

## API routes

```
POST   /api/programs/[id]/assign          — assign to players, generate schedule, notify
POST   /api/assignments/[id]/sync         — re-sync out-of-date schedule
GET    /api/schedule                      — athlete calendar (all programs merged)
GET    /api/exercises?orgId&category&muscleId
POST   /api/exercises
GET    /api/exercises/muscles
GET    /api/programs?orgId&templates=true
POST   /api/programs
GET/PUT/DELETE /api/programs/[id]
POST   /api/programs/[id]/copy            — deep-clone full hierarchy
POST   /api/programs/[id]/weeks
DELETE /api/programs/[id]/weeks/[weekId]
POST   /api/programs/[id]/weeks/[weekId]/days
PUT/DELETE /api/programs/[id]/weeks/[weekId]/days/[dayId]
POST   /api/programs/[id]/weeks/[weekId]/days/[dayId]/exercises
POST/DELETE /api/programs/[id]/weeks/[weekId]/days/[dayId]/exercises/[etId]/sets
GET    /api/benchmark-definitions?orgId
POST   /api/benchmark-definitions
GET    /api/benchmarks?userId
POST   /api/benchmarks
GET    /api/training-sessions?userId
POST   /api/training-sessions             — creates session, transitions to IN_PROGRESS
PUT    /api/training-sessions/[id]        — status transitions (COMPLETED, SKIPPED)
POST   /api/training-sessions/[id]/exercises
POST/PUT /api/training-sessions/[id]/exercises/[logId]/sets
GET    /api/notifications                 — returns { notifications, unreadCount }
PUT    /api/notifications/[id]/read
```

---

## Pages

```
/login                         — Google OAuth only (no password form)
/dashboard                     — role picker (Coach / Player / Super Admin)
/home                          — placeholder
/exercises                     — exercise library, filter by category/muscle, create org-scoped
/programs                      — list with Templates tab, create, copy, assign dialog
/programs/[id]/builder         — week/day/exercise/set builder with out-of-sync warning
/schedule                      — monthly calendar, day panel, start/continue session links
/training/[id]                 — live session logging (reps/weight/RPE per set), complete/skip
/benchmarks                    — log PRs against BenchmarkDefinitions, history table
/players                       — placeholder
/team-management               — placeholder
/admin                         — placeholder
/sessions                      — placeholder (superseded by /training/[id])
/progress                      — placeholder
```

---

## Auth

- NextAuth v5, Google provider only
- Session strategy: `"database"` (stored in `Session` table)
- `lib/auth.ts` exports `{ auth, signIn, signOut, handlers }`
- `lib/prisma.ts` exports a singleton `prisma` (global-for-dev pattern)
- Google credentials: `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` in `.env`
- Callback URL: `http://localhost:3000/api/auth/callback/google`

---

## Testing

**Runner**: Vitest with `fileParallelism: false` (prevents SQLite lock contention)

**Strategy**: Real SQLite `test.db` — no mocked Prisma. Business logic imported directly from `lib/`.

```bash
npm test              # run all tests once
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

**Test infrastructure**:
- `vitest.config.ts` — `@` alias points to project root
- `vitest.setup.ts` — global setup: deletes stale `test.db`, runs `prisma db push`, sets `TEST_DATABASE_URL`, teardown deletes db
- `lib/test-utils.ts` — `getTestPrisma()` singleton, `truncateAll()`, `seedMinimum()`, `seedProgram()`

**Tests written (10 passing)**:

`tests/schedule.test.ts`:
1. 2-week×2-day program → 4 `ScheduledWorkout` rows
2. Date offsets correct (W1D1=start, W1D2=start+1, W2D1=start+7)
3. `markAssignmentsOutOfSync` flips `isSynced=false`
4. Re-sync deletes future SCHEDULED, preserves COMPLETED
5. Re-sync sets `isSynced=true`
6. Session start → both records → `IN_PROGRESS`
7. Session complete → both records → `COMPLETED`

`tests/schema.test.ts`:
8. Duplicate `(organizationId, slug)` on Team throws
8b. Same slug in different org is allowed
9. Deleting Organization cascades to Team + TeamMembership

---

## npm scripts

```bash
npm run dev          # Next.js dev server
npm run build        # production build
npm test             # vitest run
npm run test:watch   # vitest watch
npm run db:seed      # run prisma/seed.ts (seeds global exercises + benchmarks)
npm run db:push      # prisma db push (apply schema to dev.db)
```

---

## Seed data (global, always present after `npm run db:seed`)

**Exercises (14)**: Squat, Bench Press, Deadlift, Clean, Broad Jump, Vertical Jump, Overhead Press, Pull-Up, Barbell Row, Romanian Deadlift, Lunge, Hip Thrust, Plank, Sprint 40m

**Benchmark definitions (7)**: Max Squat, Max Bench Press, Max Deadlift, Max Clean, Vertical Jump, Broad Jump, Sprint 40m

---

## What's not done yet (known gaps)

- Most pages are placeholders: `/players`, `/team-management`, `/admin`, `/progress`, `/sessions`
- `AppShell` still receives a hardcoded `role="COACH"` prop — needs wiring to the real session
- `organizationId` in the programs page is hardcoded as `"demo-org"` — needs session-based org lookup
- No route-level auth guards (proxy.ts / middleware) — unauthenticated users can hit API routes
- No WORKOUT_DUE notification trigger (needs a cron job or on-demand check)
- Weight auto-calculation from `targetWeightPercent` + most recent `Benchmark` not yet shown in training UI
- Neon Postgres migration deferred

---

## GitHub

Repo: `MagnusMeyer41/workout-app`
Issues #3–#13 closed. Parent PRD: issue #2 (open).
