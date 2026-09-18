import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { it, expect } from "vitest";

// Spawned, not imported: the script runs on load. Its --selftest carries the red arms
// (a page missing protected text, a changed table cell) and exits non-zero if any fails.
it("check-rendered-text selftest passes, red arms included", () => {
  const out = execFileSync(process.execPath, [join(process.cwd(), "scripts/check-rendered-text.mjs"), "--selftest"], {
    encoding: "utf8",
  });
  expect(out).toContain("a page missing the heading is RED");
  expect(out).toMatch(/selftest: \d+ passed/);
});
