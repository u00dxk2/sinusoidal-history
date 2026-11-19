// I-078 (2026-11-19), Codex r3 on 811be28: the facet paths (expanded, closed, compact embed line)
// drew the reader's period but rendered the stored verdict without saying so, because CycleFacet
// handed its verdict renderers the stored cycle. Rendered here through CycleFacet itself, the
// entry point every home facet, the Calibrate tab and both facet embeds use, at Codex's case:
// Perez at 52 years, where HATCH (158 years) covers 3.04 periods and clears the gate.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CycleFacet, { type FacetMode } from "@/components/CycleFacet";
import { cycles } from "@/data/cycles";
import { seriesForCycle } from "@/lib/cycleRoutes";

const perez = cycles.find((c) => c.id === "perez")!;
const unpaired = cycles.find((c) => c.id === "turchin_fathers_sons")!;

function facet(cycle: typeof perez, mode: FacetMode, override: { period_years?: number; reference_peak_year?: number }, verdictLine = false) {
  const noop = () => {};
  return renderToStaticMarkup(
    createElement(CycleFacet, {
      cycle,
      series: seriesForCycle(cycle),
      mode,
      startYear: 1600,
      endYear: 2050,
      currentYear: 2026,
      override,
      onChangeOverride: noop,
      onResetOverride: noop,
      onFocus: noop,
      onBlur: noop,
      readOnly: verdictLine,
      verdictLine,
    }),
  )
    .replace(/<!-- -->/g, "")
    .replace(/&#x27;/g, "'");
}

const SCOPED = "Not testable on its paired record at this site's 55-year period";
const STORED_DETAIL = "Its paired record covers 2.9 of the 3.0 full periods this site requires before testing.";

describe("calibrated facet verdicts (I-078)", () => {
  it("the record really clears the gate at 52 years and not at 55 (Codex's case)", () => {
    const row = JSON.parse(
      readFileSync(join(process.cwd(), "public", "data", "spectral", "verdicts.json"), "utf8"),
    ).primary.find((r: { cycle_id: string }) => r.cycle_id === "perez");
    expect(row.period_years).toBe(55);
    expect(row.span_years / 55).toBeLessThan(3);
    expect(row.span_years / 52).toBeGreaterThanOrEqual(3);
  });

  it("expanded facet at a changed period: the headline and the detail name the stored period", () => {
    const html = facet(perez, "expanded", { period_years: 52 });
    expect(html).toContain(`>${SCOPED}<`);
    expect(html).toContain(`>Its paired record covers 2.9 of the 3.0 full periods this site requires before testing, at this site's 55-year period.<`);
    expect(html).not.toContain(`>${STORED_DETAIL}<`);
  });

  it("closed card and compact embed line at a changed period name the stored period", () => {
    expect(facet(perez, "normal", { period_years: 52 })).toContain(`>${SCOPED}<`);
    expect(facet(perez, "normal", { period_years: 52 }, true)).toContain(`>${SCOPED}</span> →`);
  });

  it("a moved peak, or no override, leaves the stored words exactly", () => {
    for (const override of [{}, { reference_peak_year: perez.reference_peak_year + 4 }, { period_years: perez.period_years }]) {
      const html = facet(perez, "expanded", override);
      expect(html).not.toContain("at this site's");
      expect(html).toContain(`>${STORED_DETAIL}<`);
    }
  });

  it("the unpaired cycle's words hold at any period, unchanged", () => {
    const html = facet(unpaired, "expanded", { period_years: 57 });
    expect(html).toContain(">No paired data series<");
    expect(html).not.toContain("at this site's");
  });
});
