import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

// An ES module has no __dirname; Vite's current config loader injects one, the native loader
// its warning names would not.
const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.ts"],
    // Local runs cap forked workers at 8 (vitest's default is cores - 1 = 15 on the dev box,
    // which peaks the shared machine's memory). CI keeps the default. Measured 2026-10-15.
    maxWorkers: process.env.CI ? undefined : 8,
  },
  resolve: {
    alias: {
      "@": path.resolve(here, "./src"),
    },
  },
});
