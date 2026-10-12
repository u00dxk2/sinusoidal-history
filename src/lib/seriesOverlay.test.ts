// I-033 (2026-10-10) drew each cycle page's paired series on its curve. I-035 (2026-10-11): the
// line drawn is the record the verdict is JUDGED on. The oracle here is the frozen analysis
// manifest itself (scripts/spectral/analysis-manifest.yaml): for every primary pairing it names
// the csv, column, transform and first year the verdict counts. The expected line is rebuilt
// from that with its own parser and arithmetic, in the chart's order (transform, then the year
// window, then min-max to [-1, 1]), and compared with the points the SERVER-RENDERED page draws.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CyclePage from "@/app/(app)/cycles/[id]/page";
import { cycles } from "@/data/cycles";
import { cycleSlug, seriesForCycle } from "@/lib/cycleRoutes";
import { chartLineFromCsv, judgedRecord, missingYears } from "@/lib/seriesOverlay";
import { spectralVerdictForCycle } from "@/lib/spectral";
import { DEFAULT_YEAR_RANGE } from "@/lib/siteConfig";
import { testedSeriesNote } from "@/lib/testedSeries";

const { start, end } = DEFAULT_YEAR_RANGE;
// CurveFigure's own geometry (page.tsx): a 900x150 viewBox with 14 units of vertical padding.
const W = 900;
const H = 150;
const PAD = 14;

type ManifestSeries = {
  id: string;
  csv: string;
  year_column: string;
  value_column: string;
  transform: string;
  truncate_min_year: number | null;
};

/** The manifest's series block and primary pairings, read as text (no YAML library here). */
function readManifest(): { series: Map<string, ManifestSeries>; primary: Map<string, string> } {
  const text = readFileSync(
    join(process.cwd(), "scripts", "spectral", "analysis-manifest.yaml"),
    "utf8",
  );
  const series = new Map<string, ManifestSeries>();
  const block = text.split(/^series:\s*$/m)[1].split(/^primary:/m)[0];
  for (const chunk of block.split(/^\s*-\s+id:\s*/m).slice(1)) {
    const field = (k: string) => chunk.match(new RegExp(`^\\s*${k}:\\s*(.+?)\\s*$`, "m"))?.[1];
    const id = chunk.split(/\r?\n/)[0].trim();
    const trunc = field("truncate_min_year");
    series.set(id, {
      id,
      csv: field("csv")!,
      year_column: field("year_column")!,
      value_column: field("value_column")!,
      transform: field("transform")!,
      truncate_min_year: trunc === "null" ? null : Number(trunc),
    });
  }
  const primary = new Map<string, string>();
  const primaryBlock = text.split(/^primary:.*$/m)[1].split(/^\w/m)[0];
  for (const m of primaryBlock.matchAll(/cycle_id:\s*(\w+),\s*period_years:\s*\d+,\s*series_id:\s*(\w+)/g)) {
    primary.set(m[1], m[2]);
  }
  return { series, primary };
}

/** The oracle: no parseCsvSeries, no normalizeSeries. */
function oracle(m: ManifestSeries): { year: number; value: number }[] {
  const [head, ...rows] = readFileSync(join(process.cwd(), m.csv), "utf8").trim().split(/\r?\n/);
  const cols = head.split(",");
  const yi = cols.indexOf(m.year_column);
  const vi = cols.indexOf(m.value_column);
  expect(yi, `${m.id}: year column`).toBeGreaterThanOrEqual(0);
  expect(vi, `${m.id}: value column`).toBeGreaterThanOrEqual(0);
  const from = Math.max(start, m.truncate_min_year ?? start);
  const pts = rows
    .map((r) => r.split(","))
    .filter((c) => c[yi] !== "" && c[vi] !== "" && c[vi] !== undefined)
    .map((c) => ({ year: Number(c[yi]), raw: Number(c[vi]) }))
    .filter((p) => Number.isFinite(p.year) && Number.isFinite(p.raw))
    .map((p) => ({
      year: p.year,
      value: m.transform === "log1p" ? Math.log1p(Math.max(0, p.raw)) : p.raw,
    }))
    .filter((p) => p.year >= from && p.year <= end)
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

const manifest = readManifest();
const paired = cycles.filter((c) => seriesForCycle(c));
const unpaired = cycles.filter((c) => !seriesForCycle(c));

describe("I-035: the cycle page draws the record its verdict is judged on", () => {
  it("the manifest parse found nine series and nine primary pairings", () => {
    expect(manifest.series.size).toBe(9);
    expect(manifest.primary.size).toBe(9);
  });

  it("covers nine paired cycles and one without a series, each paired one in the manifest", () => {
    expect(paired.length).toBe(9);
    expect(unpaired.length).toBe(1);
    for (const c of paired) expect(manifest.primary.has(c.id), c.id).toBe(true);
  });

  it("the pipeline legs the real data exercise: a transform, and a start-year cut", () => {
    expect([...manifest.series.values()].some((s) => s.transform === "log1p")).toBe(true);
    expect([...manifest.series.values()].some((s) => s.truncate_min_year !== null)).toBe(true);
  });

  // No real series has a point outside 1600–2050, so on the real CSVs "window, then
  // normalise" and "normalise, then window" draw the same line (measured by mutation,
  // 2026-10-10). This fixture has an extreme outside the window.
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
    const m = manifest.series.get(manifest.primary.get(cycle.id)!)!;
    const want = oracle(m);
    expect(want.length).toBeGreaterThan(1);

    // The record the page picks is the manifest's: same file, column, transform, start year.
    const record = judgedRecord(cycle)!;
    expect(record, `${slug}: no judged record`).not.toBeNull();
    expect(`public${record.data_file}`).toBe(m.csv);
    expect(record.value_column).toBe(m.value_column);
    expect(record.transform ?? "none").toBe(m.transform);
    expect(record.min_year ?? null).toBe(m.truncate_min_year);

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

    // The key names that record and says what it is. Where the verdict counts the paired
    // series unchanged, the name is the page's "Paired data" label; where it counts a cut,
    // the name is the cut's own (the same one the verdict box uses).
    const series = seriesForCycle(cycle)!;
    const note = testedSeriesNote(m.id);
    const keyName =
      series.id === m.id ? (series.legend_short ?? series.name) : note!.name;
    const key = html.match(/<p data-key="paired-series"[^>]*>([\s\S]*?)<\/p>/);
    expect(key, `${slug}: no key`).not.toBeNull();
    const keyText = key![1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    // Every primary verdict is "not testable" today (verdicts.json), so every key also carries
    // the clause that the resemblance is not a test (I-033, cold walk 2026-10-12).
    const verdict = spectralVerdictForCycle(cycle.id)!;
    expect(verdict.eligible).toBe(false);
    expect(keyText).toBe(
      `${cycle.period_years}-year sinusoid ${keyName}: the record the verdict counts, rescaled to the curve's height. A shape that looks alike is not a test.`,
    );

    // The hatch: the years a test would still need, just before the record. Its oracle is the
    // record rebuilt from the manifest above and the cycle's own period, not missingYears():
    // it ends where the record's first point is, and starts 3 periods before the record's
    // last point, clipped to the window.
    const hatch = html.match(
      /<rect data-mark="missing-years" data-from="(-?\d+)" data-to="(-?\d+)" x="([^"]+)" y="0" width="([^"]+)"/,
    );
    expect(hatch, `${slug}: no hatch`).not.toBeNull();
    const [, from, to, hx, hw] = hatch!.map(Number);
    const first = want[0].year;
    const last = want[want.length - 1].year;
    expect(to).toBe(first);
    expect(from).toBe(last - 3 * cycle.period_years);
    expect(hx).toBeCloseTo(((Math.max(start, from) - start) / (end - start)) * W, 1);
    expect(hx + hw).toBeCloseTo(((first - start) / (end - start)) * W, 1);
    expect(hw).toBeGreaterThan(0);
    expect(html).toContain('<span data-key="missing-years"');
    expect(html).toContain("Hatched before it: the years a test still needs. A shape that looks alike is not a test.");
    expect(html).toContain(
      `Drawn over it: ${series.id === m.id ? series.name : note!.name}, the record the verdict counts, rescaled to the curve's height.`,
    );

    // Curve first, then the verdict, then the description.
    const figureAt = html.indexOf('data-mark="paired-series"');
    const verdictAt = html.indexOf('id="does-it-hold-up"');
    const descriptionAt = html.indexOf(`>${cycle.short_description}</p>`);
    expect(descriptionAt, `${slug}: no description paragraph`).toBeGreaterThan(-1);
    expect(verdictAt).toBeGreaterThan(figureAt);
    expect(descriptionAt).toBeGreaterThan(verdictAt);
  });

  // No real verdict is eligible, so these arms are fixtures.
  it("hatches nothing on an eligible verdict, or when the record already spans 3 periods", () => {
    expect(missingYears({ eligible: true, period_years: 50, span_years: 100 }, 2020)).toBeNull();
    expect(missingYears({ eligible: false, period_years: 50, span_years: 150 }, 2020)).toBeNull();
    expect(missingYears({ eligible: false, period_years: 50, span_years: 100 }, 2020)).toEqual({
      from: 1870,
      to: 1920,
    });
  });

  it("the two cuts draw their own record, not the chart's series", () => {
    const k = judgedRecord(cycles.find((c) => c.id === "kondratiev")!)!;
    expect(k.data_file).toBe("/data/us_tfp_growth_annual.csv");
    const t = judgedRecord(cycles.find((c) => c.id === "turchin")!)!;
    expect(t.min_year).toBe(1913);
  });

  it.each(unpaired.map((c) => [cycleSlug(c), c] as const))(
    "%s draws no series line and no key",
    async (slug, cycle) => {
      expect(judgedRecord(cycle)).toBeNull();
      const html = await pageHtml(slug);
      expect(html).not.toContain('data-mark="paired-series"');
      expect(html).not.toContain('data-key="paired-series"');
      expect(html).not.toContain("Drawn over it:");
      expect(html).not.toContain('data-mark="missing-years"');
      expect(html).not.toContain('data-key="missing-years"');
      expect(html.indexOf('id="does-it-hold-up"')).toBeGreaterThan(html.indexOf('role="img"'));
      expect(html.indexOf(`>${cycle.short_description}</p>`)).toBeGreaterThan(
        html.indexOf('id="does-it-hold-up"'),
      );
    },
  );
});
