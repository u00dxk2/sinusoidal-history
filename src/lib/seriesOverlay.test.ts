// I-033 (2026-10-10): each cycle page draws its paired series on its curve, above the verdict.
// The expected line is rebuilt here from the CSV on disk with its own parser and arithmetic, in
// the home chart's order (CycleFacet.tsx: the series' transform, then the year window, then
// min-max to [-1, 1]), and compared with what the SERVER-RENDERED page actually draws.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CyclePage from "@/app/(app)/cycles/[id]/page";
import { cycles } from "@/data/cycles";
import type { DataSeries } from "@/data/types";
import { cycleSlug, seriesForCycle } from "@/lib/cycleRoutes";
import { chartLineFromCsv, chartLinePoints, seriesKeyName } from "@/lib/seriesOverlay";
import { DEFAULT_YEAR_RANGE } from "@/lib/siteConfig";

const { start, end } = DEFAULT_YEAR_RANGE;
// CurveFigure's own geometry (page.tsx): a 900x150 viewBox with 14 units of vertical padding.
const W = 900;
const H = 150;
const PAD = 14;

/** The oracle: no parseCsvSeries, no normalizeSeries. */
function oracle(series: DataSeries): { year: number; value: number }[] {
  const [head, ...rows] = readFileSync(join(process.cwd(), "public", series.data_file), "utf8")
    .trim()
    .split(/\r?\n/);
  const cols = head.split(",");
  const yi = cols.indexOf(series.year_column);
  const vi = cols.indexOf(series.value_column);
  expect(yi, `${series.id}: year column`).toBeGreaterThanOrEqual(0);
  expect(vi, `${series.id}: value column`).toBeGreaterThanOrEqual(0);
  const pts = rows
    .map((r) => r.split(","))
    .filter((c) => c[yi] !== "" && c[vi] !== "" && c[vi] !== undefined)
    .map((c) => ({ year: Number(c[yi]), raw: Number(c[vi]) }))
    .filter((p) => Number.isFinite(p.year) && Number.isFinite(p.raw))
    .map((p) => ({
      year: p.year,
      value: series.transform === "log1p" ? Math.log1p(Math.max(0, p.raw)) : p.raw,
    }))
    .filter((p) => p.year >= start && p.year <= end)
    .sort((a, b) => a.year - b.year);
  const min = Math.min(...pts.map((p) => p.value));
  const max = Math.max(...pts.map((p) => p.value));
  return pts.map((p) => ({ year: p.year, value: ((p.value - min) / (max - min)) * 2 - 1 }));
}

async function pageHtml(slug: string): Promise<string> {
  const element = await CyclePage({ params: Promise.resolve({ id: slug }) });
  return renderToStaticMarkup(element as Parameters<typeof renderToStaticMarkup>[0])
    .replace(/<!-- -->/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");
}

const paired = cycles.filter((c) => seriesForCycle(c));
const unpaired = cycles.filter((c) => !seriesForCycle(c));

describe("I-033: the cycle page draws the paired series as the home chart does", () => {
  it("covers nine paired cycles and one without a series", () => {
    expect(paired.length).toBe(9);
    expect(unpaired.length).toBe(1);
  });

  it("at least one series carries a transform, so that leg of the pipeline is exercised", () => {
    expect(paired.some((c) => seriesForCycle(c)!.transform === "log1p")).toBe(true);
  });

  // No real series has a point outside 1600–2050 today, so on the real CSVs "window, then
  // normalise" and "normalise, then window" draw the same line (measured by mutation,
  // 2026-10-10: the swap passed all nine). This fixture has an extreme outside the window.
  it("normalises AFTER the year window, as the chart does", () => {
    const csv = "year,v\n1500,1000\n1700,0\n1800,5\n1900,10\n";
    const got = chartLineFromCsv(csv, { year_column: "year", value_column: "v" }, start, end);
    expect(got.map((p) => [p.year, p.value])).toEqual([
      [1700, -1],
      [1800, 0],
      [1900, 1],
    ]);
  });

  it.each(paired.map((c) => [cycleSlug(c), c] as const))("%s", async (slug, cycle) => {
    const series = seriesForCycle(cycle)!;
    const want = oracle(series);
    expect(want.length).toBeGreaterThan(1);

    // The helper is the chart's pipeline.
    const got = chartLinePoints(series, start, end);
    expect(got.map((p) => p.year)).toEqual(want.map((p) => p.year));
    got.forEach((p, i) => expect(p.value).toBeCloseTo(want[i].value, 9));

    // The page draws exactly those points, once, on the curve's axes.
    const html = await pageHtml(slug);
    const lines = [...html.matchAll(/<polyline data-mark="paired-series" points="([^"]*)"/g)];
    expect(lines.length).toBe(1);
    const drawn = lines[0][1].split(" ").map((xy) => xy.split(",").map(Number));
    expect(drawn.length).toBe(want.length);
    drawn.forEach(([x, y], i) => {
      expect(x).toBeCloseTo(((want[i].year - start) / (end - start)) * W, 1);
      expect(y).toBeCloseTo(H / 2 - want[i].value * (H / 2 - PAD), 1);
    });

    // The key names this series by the page's own "Paired data" label, and says the line is
    // rescaled; the figure's accessible name carries the series' full name.
    const key = html.match(/<p data-key="paired-series"[^>]*>([\s\S]*?)<\/p>/);
    expect(key, `${slug}: no key`).not.toBeNull();
    const keyText = key![1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    expect(keyText).toBe(
      `${cycle.period_years}-year sinusoid ${seriesKeyName(series)}, rescaled to the curve's height`,
    );
    expect(seriesKeyName(series)).toBe(series.legend_short ?? series.name);
    expect(html).toContain(`Drawn over it: ${series.name}, rescaled to the curve's height.`);

    // Curve first, then the verdict, then the description.
    const figureAt = html.indexOf('data-mark="paired-series"');
    const verdictAt = html.indexOf('id="does-it-hold-up"');
    // The visible paragraph, not the JSON-LD copy of the description in the page's head.
    const descriptionAt = html.indexOf(`>${cycle.short_description}</p>`);
    expect(descriptionAt, `${slug}: no description paragraph`).toBeGreaterThan(-1);
    expect(figureAt).toBeGreaterThan(-1);
    expect(verdictAt).toBeGreaterThan(figureAt);
    expect(descriptionAt).toBeGreaterThan(verdictAt);
  });

  it.each(unpaired.map((c) => [cycleSlug(c), c] as const))(
    "%s draws no series line and no key",
    async (slug, cycle) => {
      const html = await pageHtml(slug);
      expect(html).not.toContain('data-mark="paired-series"');
      expect(html).not.toContain('data-key="paired-series"');
      expect(html).not.toContain("Drawn over it:");
      // Its curve still comes before its verdict box.
      expect(html.indexOf('role="img"')).toBeGreaterThan(-1);
      expect(html.indexOf('id="does-it-hold-up"')).toBeGreaterThan(html.indexOf('role="img"'));
      expect(html.indexOf(`>${cycle.short_description}</p>`)).toBeGreaterThan(
        html.indexOf('id="does-it-hold-up"'),
      );
    },
  );
});
