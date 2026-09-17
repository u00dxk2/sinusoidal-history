import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { cycles } from "@/data/cycles";
import { cycleSlug, cycleTheorist } from "@/lib/cycleRoutes";
import { spectralPrimary } from "@/lib/spectral";

// public/methods.md hand-mirrors the verdict table that /methods derives from verdicts.json.
// The page cannot drift; the mirror can. This pins every mirrored row to the frozen JSON.
describe("methods.md verdict table mirror", () => {
  const md = readFileSync(join(process.cwd(), "public/methods.md"), "utf8");

  it("carries one row per primary verdict, matching verdicts.json", () => {
    for (const v of spectralPrimary) {
      const cycle = cycles.find((c) => c.id === v.cycle_id)!;
      const short = Math.max(0, Math.ceil(3 * v.period_years - v.span_years));
      const row =
        `| [${cycleTheorist(cycle)}](https://sinusoidalhistory.com/cycles/${cycleSlug(cycle)}#does-it-hold-up)` +
        ` | ${v.period_years}y | ${v.span_years}y | ${v.cycles_covered.toFixed(1)}` +
        ` | ${short > 0 ? `+${short}` : "—"} | ${v.state} |`;
      expect(md).toContain(row);
    }
  });

  it("marks every cycle with no verdict as not tested", () => {
    const unpaired = cycles.filter((c) => !spectralPrimary.some((v) => v.cycle_id === c.id));
    expect(unpaired.length).toBeGreaterThan(0);
    for (const c of unpaired) {
      expect(md).toContain(`| [${cycleTheorist(c)}](https://sinusoidalhistory.com/cycles/${cycleSlug(c)}) | ${c.period_years}y | — | — | — | Not tested`);
    }
  });
});
