import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    globals: true,
    environment: "node",
    globalSetup: "./vitest.setup.ts",
    testTimeout: 30000,
    // Disable parallel file execution so test files run sequentially.
    // This prevents SQLITE_BUSY errors from concurrent connections to the
    // single test.db file.
    fileParallelism: false,
  },
})
