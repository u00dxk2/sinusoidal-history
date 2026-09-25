import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { it, expect } from "vitest";

// Spawned, not imported: the script runs on load. Its --selftest carries the red arms
// (a cut answer, a missing element) and exits non-zero if any fails.
it("check-entry-folds selftest passes, red arms included", () => {
  const out = execFileSync(process.execPath, [join(process.cwd(), "scripts/check-entry-folds.mjs"), "--selftest"], {
    encoding: "utf8",
  });
  expect(out).toContain("an answer below the fold is CUT by its overflow");
  expect(out).toMatch(/selftest: \d+ passed/);
});
