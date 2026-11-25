import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CyclePage from "@/app/(app)/cycles/[id]/page";
import { cycles } from "@/data/cycles";
import { cycleRoutePath } from "@/lib/cycleRoutes";
import { drawnPeriod, sineAtYear } from "@/lib/cycleMath";
import { chartLinePoints, judgedRecord } from "@/lib/seriesOverlay";
import { spectralVerdictForCycle } from "@/lib/spectral";
import { DEFAULT_YEAR_RANGE } from "@/lib/siteConfig";
import {
  curveRows,
  plottedHeight,
  recordWorking,
  scaleFormula,
  signed,
  workingValue,
} from "@/lib/workedExample";

// The page reads the year itself; these tests pin the same year the page uses at render.
const YEAR = new Date().getUTCFullYear();

async function render(slug: string): Promise<string> {
  const element = await CyclePage({ params: Promise.resolve({ id: slug }) });
  return renderToStaticMarkup(element as Parameters<typeof renderToStaticMarkup>[0])
    .replace(/<!-- -->/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");
}

function section(html: string): string {
  const start = html.indexOf('id="worked-example"');
  expect(start, "worked-example section present").toBeGreaterThan(-1);
  const end = html.indexOf("</section>", start);
  return html.slice(start, end);
}

describe("curveRows: only years inside the drawn period (I-061; manager review cond. 1)", () => {
  it.each(cycles.map((c) => [c.id, c] as const))("%s", (_id, cycle) => {
    const { from, to } = drawnPeriod(cycle, YEAR);
    const rows = curveRows(cycle, YEAR);
    expect(rows.length).toBeGreaterThanOrEqual(3);
    for (const r of rows) {
      expect(r.year, `${cycle.id} ${r.year} after the drawn period's end ${to}`).toBeLessThanOrEqual(to);
      expect(r.year).toBeGreaterThanOrEqual(from);
      // The formula the page prints is the code's (cond. 2): the cos-math audit's own expression.
      const audit =
        cycle.amplitude_normalized *
        Math.cos((2 * Math.PI * (r.year - cycle.reference_peak_year)) / cycle.period_years);
      expect(r.height).toBeCloseTo(audit, 12);
      expect(r.height).toBe(sineAtYear(cycle, r.year));
    }
  });

  it("drops the quarter points past today on the two cut cycles (Perez, Turchin in 2026)", () => {
    const perez = cycles.find((c) => c.id === "perez")!;
    const turchin = cycles.find((c) => c.id === "turchin")!;
    if (YEAR >= 2026 && YEAR < 2027) {
      expect(curveRows(perez, YEAR).map((r) => r.year)).toEqual([1972.5, 1986.25, 2000, 2013.75]);
      expect(curveRows(turchin, YEAR).map((r) => r.year)).toEqual([1945, 1982.5, 2020]);
    }
  });
});

describe("recordWorking: the page's hand formula equals the pipeline", () => {
  const paired = cycles.filter((c) => judgedRecord(c));

  it("covers the nine paired cycles", () => {
    expect(paired.length).toBe(9);
  });

  it.each(paired.map((c) => [c.id, c] as const))("%s", (_id, cycle) => {
    const judged = judgedRecord(cycle)!;
    const points = chartLinePoints(judged, DEFAULT_YEAR_RANGE.start, DEFAULT_YEAR_RANGE.end);
    const w = recordWorking(points, judged.transform)!;
    expect(w).not.toBeNull();
    // Every drawn point, worked by hand, lands where the pipeline put it.
    for (const p of points) {
      const byHand = plottedHeight(workingValue(p.raw, judged.transform), w.low.working, w.high.working);
      expect(byHand).toBeCloseTo(p.value, 9);
    }
    expect(w.rows.find((r) => r.year === w.low.year)!.plotted).toBeCloseTo(-1, 12);
    expect(w.rows.find((r) => r.year === w.high.year)!.plotted).toBeCloseTo(1, 12);
    // The span the page works is the span the verdict counts.
    const verdict = spectralVerdictForCycle(cycle.id)!;
    expect(w.span).toBe(verdict.span_years);
    expect(Number((w.span / cycle.period_years).toFixed(1))).toBe(Number(verdict.cycles_covered.toFixed(1)));
  });
});

describe("scaleFormula reads cleanly at every sign of the low", () => {
  it("positive low", () => {
    expect(scaleFormula("value", 10.557, 31.577, false)).toBe(
      "plotted height = 2 × (value − 10.557) ÷ (31.577 − 10.557) − 1",
    );
  });
  it("negative low: no double minus", () => {
    const f = scaleFormula("value", -2.4902, 4.787, false);
    expect(f).toBe("plotted height = 2 × (value + 2.4902) ÷ (4.787 + 2.4902) − 1");
    expect(f).not.toMatch(/−\s*−|-\s*-/);
  });
  it("zero low: its terms drop", () => {
    expect(scaleFormula("ln(1 + value)", 0, 5.233, true)).toBe(
      "plotted height ≈ 2 × ln(1 + value) ÷ 5.233 − 1",
    );
  });
  it("is the same arithmetic as plottedHeight", () => {
    // value + 2.4902 over 4.787 + 2.4902 is (value − low) over (high − low) with low = −2.4902.
    expect(plottedHeight(1, -2.4902, 4.787)).toBeCloseTo((2 * (1 + 2.4902)) / (4.787 + 2.4902) - 1, 12);
  });
});

describe("the rendered section", () => {
  it.each(cycles.map((c) => [c.id, c] as const))("%s carries its own numbers", async (_id, cycle) => {
    const html = await render(cycleRoutePath(cycle).split("/").pop()!);
    const s = section(html);
    expect(s).toContain(`cos(2π × (year − ${cycle.reference_peak_year}) ÷ ${cycle.period_years})`);
    // The curve block names no construction year (I-090, 2026-11-25: David's yes covers record
    // years only). Scoped to the curve block: the record table may share a year (Modelski 1945).
    const recordAt = s.indexOf("The record line");
    const curve = recordAt === -1 ? s : s.slice(0, recordAt);
    // The formula line above the table names the reference peak on purpose; the table may not.
    const table = curve.slice(curve.indexOf("<table"), curve.indexOf("</table>"));
    expect(table.length).toBeGreaterThan(0);
    const curveCells = [...table.matchAll(/<td[^>]*>([^<]*)<\/td>/g)].map((m) => m[1]);
    const rows = curveRows(cycle, YEAR);
    expect(curveCells).toEqual(rows.flatMap((r) => [signed(r.fraction, 2), signed(r.height, 2)]));
    for (const r of rows) {
      expect(table, `${cycle.id}: curve table names the year ${r.year}`).not.toContain(String(r.year));
    }
    expect(table).not.toMatch(/>Year</);
    expect(s).toContain(`>${signed(1, 2)}<`);
    const judged = judgedRecord(cycle);
    if (judged) {
      const w = recordWorking(
        chartLinePoints(judged, DEFAULT_YEAR_RANGE.start, DEFAULT_YEAR_RANGE.end),
        judged.transform,
      )!;
      expect(s).toContain(`${judged.fullName}, ${w.first}–${w.last}`);
      expect(s).toContain(`Years covered: ${w.last} − ${w.first} = ${w.span}.`);
    } else {
      expect(s).not.toContain("The record line");
    }
  });

  it("sits after the extrema section and before the paired series", async () => {
    const html = await render("dalio");
    const ex = html.indexOf("Where this curve plots its extrema");
    const we = html.indexOf('id="worked-example"');
    const ps = html.indexOf("Paired data series");
    expect(ex).toBeGreaterThan(-1);
    expect(we).toBeGreaterThan(ex);
    expect(ps).toBeGreaterThan(we);
  });
});
