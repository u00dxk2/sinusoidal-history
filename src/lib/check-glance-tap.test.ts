import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { it, expect } from "vitest";

// Spawned, not imported: the script runs on load. Its --selftest carries the red arms
// (the dead tap I-046 shipped with, a wrong card, a card left off-screen, a missing row)
// and exits non-zero if any fails.
it("check-glance-tap selftest passes, red arms included", () => {
  const out = execFileSync(process.execPath, [join(process.cwd(), "scripts/check-glance-tap.mjs"), "--selftest"], {
    encoding: "utf8",
  });
  expect(out).toContain("the 10-14 dead tap (nothing opened) is DEAD");
  expect(out).toContain("a tap that also opens another card is WRONG");
  expect(out).toContain("a missing row is MISSING, never OPENS");
  expect(out).toMatch(/selftest: \d+ passed/);
});
