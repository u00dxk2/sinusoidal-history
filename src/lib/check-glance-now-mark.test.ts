import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { it, expect } from "vitest";

// Spawned, not imported: the script runs on load. Its --selftest carries the red arms
// (each kind of now-mark alone, a missing figure, a dropped verdict line) and exits
// non-zero if any fails.
it("check-glance-now-mark selftest passes, red arms included", () => {
  const out = execFileSync(process.execPath, [join(process.cwd(), "scripts/check-glance-now-mark.mjs"), "--selftest"], {
    encoding: "utf8",
  });
  expect(out).toContain("a ring alone is MARKED");
  expect(out).toContain("a missing figure is MISSING, never CLEAN");
  expect(out).toContain("empty rows are MISSING, never CLEAN");
  expect(out).toMatch(/selftest: \d+ passed/);
});
