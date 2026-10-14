// Journey-walk 2026-10-14, finding 2: "Copy attribution" on /cycles/dalio gave
// "(Maddison Project Database 2023 (Bolt & van Zanden, 2024, J), CC BY 4.0." The credit was
// `source.split(". ")[0]`, which cuts at the first abbreviation; 4 of the 9 series broke.
// The oracle here is each series' own `source` text in series.json, never SERIES_CREDIT's shape.
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CyclePage from "@/app/(app)/cycles/[id]/page";
import seriesJson from "../data/series.json";
import cyclesJson from "../data/cycles.json";
import { SERIES_CREDIT } from "@/lib/seriesCredit";

type Series = { id: string; source: string; license: string; associated_cycle_id: string };
const series = seriesJson as Series[];

// A credit that ends on a lone capital initial ("J", "James A", "U") was cut mid-name.
const CUT_AT_INITIAL = /(^|[\s(,])[A-Z]\)?$/;

// Codex r1 (2026-10-14): the three shape checks pass a credit cut to "James A. Stim" or
// "James". Completeness cannot be inferred from shape, so it is pinned here: each credit
// written out by hand from its series' source (claims pass: Codex r1, all HOLDS).
// CEILING: this pins what a reader copies; it does not judge whether a credit is the
// right length. A new series needs a line here and in SERIES_CREDIT.
const EXPECTED_CREDIT: Record<string, string> = {
  dw_nominate_polarization: "Voteview / Lewis, Poole, Rosenthal, Boche, Rudkin, Sonnet (2026)",
  us_tfp_growth: "Fernald (2014), FRBSF Working Paper 2012-19",
  wid_top1_wealth: "WID · World Inequality Database, retrieved via Our World in Data",
  us_world_gdp_share: "Maddison Project Database 2023 (Bolt & van Zanden, 2024, J. Econ. Surveys)",
  vdem_libdem: "V-Dem Institute, Country-Year Dataset v16, March 2026 (retrieved via Our World in Data)",
  conflict_deaths: "Our World in Data · Project Mars v1.1 (Lyall 2020)",
  stimson_policy_mood: "James A. Stimson, Policy Mood data series (UNC)",
  leading_power_gdp_share: "Maddison Project Database 2023 (Bolt & van Zanden, 2024, J. Econ. Surveys)",
  perez_tech_diffusion:
    "HATCH - Extended Historical Adoption of Technology Dataset 2.0 (Greene & Nemet, U. Wisconsin–Madison)",
};

function decode(s: string): string {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

describe("each paired series' credit line is whole", () => {
  it("every series has exactly one credit, and no credit names a series that does not exist", () => {
    expect(Object.keys(SERIES_CREDIT).sort()).toEqual(series.map((s) => s.id).sort());
  });

  for (const s of series) {
    it(`${s.id}: the credit is the start of its own source text, cut at a whole clause`, () => {
      const credit = SERIES_CREDIT[s.id];
      // Verbatim from the source (a closing parenthesis may close a clause the source continues).
      expect(s.source.startsWith(credit.replace(/\)$/, ""))).toBe(true);
      expect(credit.split("(").length).toBe(credit.split(")").length);
      expect(credit).not.toMatch(CUT_AT_INITIAL);
    });
  }

  // The page, not the list: what a reader copies.
  for (const s of series) {
    const cycle = (cyclesJson as { id: string }[]).find((c) => c.id === s.associated_cycle_id)!;
    const slug = cycle.id.replace(/_/g, "-");
    it(`/cycles/${slug} copies "(${EXPECTED_CREDIT[s.id]}), ${s.license}."`, async () => {
      const el = await CyclePage({ params: Promise.resolve({ id: slug }) });
      const html = decode(
        renderToStaticMarkup(el as Parameters<typeof renderToStaticMarkup>[0]).replace(/<!-- -->/g, ""),
      );
      expect(EXPECTED_CREDIT[s.id]).toBeDefined();
      expect(html).toContain(`(${EXPECTED_CREDIT[s.id]}), ${s.license}.`);
    });
  }
});
