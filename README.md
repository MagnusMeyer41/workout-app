# AthleteOS — Coaching & Player Progression Platform

A dark-themed, gold-accented admin platform for coaches, players, and super-admins. Built with Next.js 16 App Router, Tailwind CSS v4, shadcn/ui-style components, Prisma 7, and NextAuth v5.

---

## Features

| Role | Access |
|---|---|
| **Coach** | Create programs, manage players, invite team members, view team analytics |
| **Player** | Log training sessions, track benchmarks (max lifts, sprint, vertical), view assigned programs |
| **Super Admin** | View all organizations, compare cross-org data, manage admin users |

**Core pages:** `/login` · `/signup` · `/dashboard` (role picker) · `/home` (role hub) · `/programs` · `/players` · `/team-management` · `/sessions` · `/progress` · `/admin`

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui component patterns |
| Auth | NextAuth v5 (beta) with Credentials provider |
| Database | Prisma 7 + SQLite (via `@prisma/adapter-libsql`) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| State | Zustand |
| Icons | Lucide React |

---

## Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9 (or pnpm/yarn)
- No external database required — SQLite runs locally as a file

---

## Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd workout-app
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# SQLite database file path (relative to project root)
DATABASE_URL="file:./dev.db"
```

> **Generate a secret:** `openssl rand -base64 32`

The `.env` file (also at the root) is used by the Prisma CLI. It already contains `DATABASE_URL="file:./dev.db"` and should be left as-is for local development.

### 3. Set up the database

Generate the Prisma client and push the schema to SQLite:

```bash
npx prisma generate
npx prisma db push
```

This creates `dev.db` at the project root.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login`.

> **Demo mode:** In the current MVP, the login and signup forms use simulated auth (1.2s delay then redirect). Any email/password works. Real NextAuth credential checking is wired via `lib/auth.ts` and `app/api/auth/[...nextauth]/route.ts` for when you're ready to connect real users.

---

## Project Structure

```
workout-app/
├── app/
│   ├── (auth)/              # Public routes (no sidebar)
│   │   ├── layout.tsx       # Auth layout with gradient orbs + logo
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/               # Protected routes (with sidebar)
│   │   ├── admin/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── home/page.tsx
│   │   ├── players/page.tsx
│   │   ├── programs/page.tsx
│   │   ├── progress/page.tsx
│   │   ├── sessions/page.tsx
│   │   └── team-management/page.tsx
│   ├── api/auth/[...nextauth]/route.ts   # NextAuth API handler
│   ├── generated/prisma/    # Auto-generated Prisma client (gitignored)
│   ├── globals.css          # Tailwind v4 theme tokens (dark + gold)
│   └── layout.tsx           # Root layout
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx    # Page wrapper that includes Sidebar
│   │   └── sidebar.tsx      # Role-aware responsive sidebar
│   └── ui/                  # shadcn/ui-style primitives
│       ├── avatar.tsx · badge.tsx · button.tsx · card.tsx
│       ├── dialog.tsx · dropdown-menu.tsx · input.tsx
│       ├── label.tsx · progress.tsx · scroll-area.tsx
│       ├── select.tsx · separator.tsx · tabs.tsx · tooltip.tsx
├── lib/
│   ├── auth.ts              # NextAuth config + Prisma adapter
│   └── utils.ts             # cn() helper (clsx + tailwind-merge)
├── prisma/
│   └── schema.prisma        # DB schema (User, Program, Team, Benchmark…)
├── prisma.config.ts         # Prisma 7 config (datasource URL, migrations path)
├── .mcp.json                # MCP server config (Next.js DevTools + shadcn)
└── .env.local               # Local environment variables (gitignored)
```

---

## Database Schema

Key models:

- **User** — email, passwordHash, roles, team memberships
- **Organization** — top-level container for teams and programs
- **Team** + **TeamMembership** — users linked to teams with `COACH | PLAYER | SUPER_ADMIN` roles
- **Program** — `STRENGTH` or `SPORT_SPECIFIC`, assigned to players via `ProgramAssignment`
- **TrainingSession** + **ExerciseLog** — player-logged sessions with sets/reps/weight
- **Benchmark** — `MAX_SQUAT | MAX_DEADLIFT | MAX_BENCH | MAX_CLEAN | VERTICAL_JUMP | SPRINT_40 | OTHER`

Full schema: [`prisma/schema.prisma`](./prisma/schema.prisma)

---

## Design System

The theme is configured entirely in [`app/globals.css`](./app/globals.css) using Tailwind v4's `@theme inline` block:

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#C9A84C` (gold) | CTAs, active nav, highlights |
| `--background` | `#09090b` | Page background |
| `--card` | `#18181f` | Card surfaces |
| `--border` | `#27272a` | All borders |
| `--muted-foreground` | `#a1a1aa` | Secondary text |

All components use `className` merging via `cn()` (clsx + tailwind-merge) and follow the CVA (class-variance-authority) pattern from shadcn/ui.

---

## MCP Servers (Claude Code)

This project ships with a `.mcp.json` that configures two MCP servers for AI-assisted development in Claude Code:

```json
{
  "mcpServers": {
    "next-devtools": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    },
    "shadcn": {
      "type": "http",
      "url": "https://www.shadcn.io/api/mcp"
    }
  }
}
```

- **next-devtools** — Query Next.js errors, server actions, page metadata, and build logs
- **shadcn** — Browse and install shadcn/ui components, blocks, and templates by name

When you open this project in Claude Code, these will be available automatically (you may need to approve them on first use).

---

## Available Scripts

```bash
npm run dev       # Start development server (Turbopack)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
npx prisma studio # Open Prisma Studio (visual DB browser)
npx prisma db push        # Sync schema changes to dev.db
npx prisma generate       # Re-generate Prisma client after schema changes
```

---

## Connecting Real Auth (Next Steps)

The auth scaffolding is complete. To activate real credential auth:

1. **Hash passwords** — install `bcryptjs` and replace the plaintext comparison in `lib/auth.ts`:
   ```ts
   import bcrypt from "bcryptjs"
   const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
   ```

2. **Create a real user** — use Prisma Studio or a seed script:
   ```ts
   // prisma/seed.ts
   import bcrypt from "bcryptjs"
   const hash = await bcrypt.hash("your-password", 12)
   await prisma.user.create({ data: { email: "coach@team.com", passwordHash: hash } })
   ```

3. **Wire login form to NextAuth** — replace the simulated delay in `app/(auth)/login/page.tsx`:
   ```ts
   import { signIn } from "next-auth/react"
   const result = await signIn("credentials", { email, password, redirect: false })
   if (result?.ok) router.push("/dashboard")
   ```

---

## Deployment

The app is ready to deploy to any Node.js host. For SQLite, you'll want to replace it with a hosted database (PostgreSQL, PlanetScale, Neon, etc.) before deploying to production:

1. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
2. Update `DATABASE_URL` in your host's environment variables
3. Install the appropriate Prisma adapter (e.g., `@prisma/adapter-pg`)
4. Run `npx prisma db push` or `npx prisma migrate deploy`
