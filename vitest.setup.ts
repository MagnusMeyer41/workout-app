import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"

const TEST_DB_PATH = path.resolve(process.cwd(), "test.db")

export async function setup() {
  // Remove any leftover test DB
  for (const f of [TEST_DB_PATH, TEST_DB_PATH + "-wal", TEST_DB_PATH + "-shm"]) {
    if (fs.existsSync(f)) fs.unlinkSync(f)
  }

  // Push the schema to the freshly-created test DB.
  // No --force-reset needed because the file was just deleted above.
  // DATABASE_URL is set so prisma.config.ts picks it up.
  execSync(`npx prisma db push --url "file:${TEST_DB_PATH}"`, {
    stdio: "pipe",
    env: {
      ...process.env,
      DATABASE_URL: `file:${TEST_DB_PATH}`,
    },
  })

  // Make the path available to test files
  process.env.TEST_DATABASE_URL = `file:${TEST_DB_PATH}`
}

export async function teardown() {
  for (const f of [TEST_DB_PATH, TEST_DB_PATH + "-wal", TEST_DB_PATH + "-shm"]) {
    if (fs.existsSync(f)) {
      try {
        fs.unlinkSync(f)
      } catch {
        // ignore — Windows may lock the file briefly
      }
    }
  }
}
