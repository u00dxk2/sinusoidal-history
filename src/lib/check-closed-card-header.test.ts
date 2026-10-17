import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { it, expect } from "vitest";

// Spawned, not imported: the script runs on load. Its --selftest carries the red arms
// (each leg alone, a missing card, a card with no curve, an axis with no ticks) and
// exits non-zero if any fails.
it("check-closed-card-header selftest passes, red arms included", () => {
  const out = execFileSync(process.execPath, [join(process.cwd(), "scripts/check-closed-card-header.mjs"), "--selftest"], {
    encoding: "utf8",
  });
  expect(out).toContain("a tag alone is MARKED");
  expect(out).toContain("a cut name alone is MARKED");
  expect(out).toContain("a current-year label alone is MARKED");
  expect(out).toContain("a card with no curve is MISSING, never CLEAN");
  expect(out).toMatch(/selftest: \d+ passed/);
});
