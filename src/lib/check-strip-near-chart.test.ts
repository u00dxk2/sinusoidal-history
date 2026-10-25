import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { it, expect } from "vitest";

// Spawned, not imported: the script runs on load. Its --selftest carries the red arms
// (the strip ~2,500px under the rows, a screen too short for all ten) and exits non-zero if any fails.
it("check-strip-near-chart selftest passes, red arms included", () => {
  const out = execFileSync(process.execPath, [join(process.cwd(), "scripts/check-strip-near-chart.mjs"), "--selftest"], {
    encoding: "utf8",
  });
  expect(out).toContain("the strip ~2,500px under the rows is APART, 0 rows");
  expect(out).toMatch(/selftest: \d+ passed/);
  // A spawned node under a parallel run took 8.7s on 2026-10-25, past vitest's 5s default.
}, 60000);
