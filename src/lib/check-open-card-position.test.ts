import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { it, expect } from "vitest";

// Spawned, not imported: the script runs on load. Its --selftest carries the red arms
// (each leg alone, the 10-17 production page, a card that did not open, an empty panel)
// and exits non-zero if any fails.
it("check-open-card-position selftest passes, red arms included", () => {
  const out = execFileSync(process.execPath, [join(process.cwd(), "scripts/check-open-card-position.mjs"), "--selftest"], {
    encoding: "utf8",
  });
  expect(out).toContain("the 10-17 page is MARKED 34");
  expect(out).toContain("a phase in a row's accessible name alone is MARKED");
  expect(out).toContain("a row with no verdict alone is MARKED");
  expect(out).toContain("an empty panel is MISSING, never CLEAN");
  expect(out).toMatch(/selftest: \d+ passed/);
});
