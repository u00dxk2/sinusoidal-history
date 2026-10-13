// I-041 (2026-10-13): every cycle page with a spectral verdict says what the cross-grid panel
// did with its theory's PERIOD and its RECORD, so "No test was run" on the page and the p-values
// on /methods stop reading as a contradiction (walk 2026-10-12; manager review d854b486).
// The oracle is verdicts.json read straight off disk plus a count table measured on 2026-10-13,
// never the helper under test.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CyclePage from "@/app/(app)/cycles/[id]/page";
import Methods from "@/app/(app)/methods/page";

type Cell = {
  period_source_cycle_id: string;
  period_years: number;
  series_id: string;
  p: number;
  p_ar2: number;
};
type Primary = { cycle_id: string; period_years: number; series_id: string };

const verdicts = JSON.parse(
  readFileSync(join(process.cwd(), "public", "data", "spectral", "verdicts.json"), "utf8"),
) as { primary: Primary[]; cross_grid: Cell[] };

// [period cells, record cells], measured 2026-10-13 from the frozen verdicts.json.
const MEASURED: Record<string, [number, number]> = {
  schlesinger_jr: [7, 0],
  kondratiev: [2, 0],
  perez: [2, 2],
  huntington: [2, 1],
  dalio: [1, 2],
  strauss_howe: [0, 6],
  modelski: [0, 2],
  khaldun: [0, 5],
  turchin: [0, 1],
};

async function html(slug: string): Promise<string> {
  const element = await CyclePage({ params: Promise.resolve({ id: slug }) });
  return renderToStaticMarkup(element as Parameters<typeof renderToStaticMarkup>[0])
    .replace(/<!-- -->/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

function paragraph(page: string): string | null {
  const m = page.match(/<p data-cross-grid="[^"]*"[^>]*>([\s\S]*?)<\/p>/);
  return m
    ? m[1].replace(/<[^>]+>/g, " ").replace(/&lt;/g, "<").replace(/\s+/g, " ").trim()
    : null;
}

const low = (cells: Cell[]) => Math.min(...cells.flatMap((c) => [c.p, c.p_ar2])).toFixed(3);

describe("I-041: cycle pages say what the cross-grid did with their period and record", () => {
  it("the measured table still matches the frozen file (a re-freeze must revisit this copy)", () => {
    for (const v of verdicts.primary) {
      const period = verdicts.cross_grid.filter((c) => c.period_source_cycle_id === v.cycle_id);
      const record = verdicts.cross_grid.filter((c) => c.series_id === v.series_id);
      expect([period.length, record.length], v.cycle_id).toEqual(MEASURED[v.cycle_id]);
    }
    expect(Object.keys(MEASURED).sort()).toEqual(verdicts.primary.map((v) => v.cycle_id).sort());
  });

  it.each(verdicts.primary.map((v) => [v.cycle_id.replace(/_/g, "-"), v] as const))(
    "%s",
    async (slug, v) => {
      const page = await html(slug);
      const text = paragraph(page);
      expect(text, "paragraph present").not.toBeNull();

      // Inside the Spectral verdict section, after the frozen lay_text.
      const section = page.indexOf('id="spectral-verdict"');
      const at = page.indexOf("data-cross-grid");
      expect(section).toBeGreaterThan(-1);
      expect(at).toBeGreaterThan(section);

      const period = verdicts.cross_grid.filter((c) => c.period_source_cycle_id === v.cycle_id);
      const record = verdicts.cross_grid.filter((c) => c.series_id === v.series_id);

      if (period.length > 0) {
        expect(text).toContain(
          `Its ${v.period_years}-year period was set against ${period.length} other ${period.length === 1 ? "record" : "records"}`,
        );
        expect(text).toContain(`lowest p ${low(period)}`);
      } else {
        expect(text).not.toContain("-year period was set against");
      }
      if (record.length > 0) {
        expect(text).toContain("This page's record,");
        expect(text).toContain(
          `against ${record.length} other ${record.length === 1 ? "theory's period" : "theories' periods"}`,
        );
        expect(text).toContain(`lowest p ${low(record)}`);
        for (const c of record) expect(text).toContain(`${c.period_years} years`);
      } else {
        expect(text).not.toContain("This page's record");
      }
      // Every cell's p is above 0.05 under both nulls, which is what the sentence claims.
      for (const c of [...period, ...record]) {
        expect(c.p).toBeGreaterThanOrEqual(0.05);
        expect(c.p_ar2).toBeGreaterThanOrEqual(0.05);
      }
      expect(text).toContain("p < 0.05 under either noise model");
      expect(text).toContain("this theory's own claim");
      const link = page.match(/<a [^>]*href="\/methods#cross-grid"[^>]*>([\s\S]*?)<\/a>/);
      expect(link, "link to the /methods cells").not.toBeNull();
      expect(link![1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()).toBe(
        `The ${verdicts.cross_grid.length} re-pairings, cell by cell →`,
      );
    },
  );

  it("a page with no spectral verdict carries no paragraph", async () => {
    expect(paragraph(await html("turchin-fathers-sons"))).toBeNull();
  });

  it("/methods has the anchor the pages link to, on the cells", () => {
    const methods = renderToStaticMarkup(Methods());
    expect(methods).toMatch(/<details id="cross-grid"[^>]*><summary[^>]*>The 19 re-pairings, cell by cell<\/summary>/);
  });
});
