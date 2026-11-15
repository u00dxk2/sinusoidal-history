// 2026-11-15: each /cycles entry states its own verdict. Before this, an entry named only its
// paired series, and the per-cycle answer ("needs 73 more years") sat in the verdict table below
// all ten entries, about 3,000px down on a phone. A reader who came for one cycle met no answer
// in that cycle's entry.
//
// The oracle here shares no code with the page: it reads verdicts.json and series.json raw,
// computes the shortfall itself, and takes the judged record's name from the frozen lay_text.
// Two pairings are judged on a different cut from the series the entry names (Kondratiev's
// annual TFP, Turchin's 1913-onward wealth share; I-030, I-035), so their verdict words must
// name the judged record, never pair the shortfall with the drawn series alone.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CyclesIndex from "@/app/(app)/cycles/page";
import cyclesRaw from "@/data/cycles.json";
import seriesRaw from "@/data/series.json";
import verdictsRaw from "../../public/data/spectral/verdicts.json";

type RawVerdict = {
  cycle_id: string;
  series_id: string;
  period_years: number;
  span_years: number;
  eligible: boolean;
  lay_text: string;
};
type RawSeries = { id: string; name: string; associated_cycle_id?: string };
type RawCycle = { id: string };

const verdicts = (verdictsRaw as unknown as { primary: RawVerdict[] }).primary;
const seriesList = seriesRaw as unknown as RawSeries[];
const cycleList = cyclesRaw as unknown as RawCycle[];

const html = renderToStaticMarkup(createElement(CyclesIndex));

function decode(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&apos;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

// One entry's visible text: from its cycle-page link to the end of its <li>.
function entryText(cycleId: string): string {
  const href = `href="/cycles/${cycleId.replace(/_/g, "-")}"`;
  const start = html.indexOf(href);
  expect(start, `no entry link for ${cycleId}`).toBeGreaterThan(-1);
  const end = html.indexOf("</li>", start);
  return decode(html.slice(start, end));
}

describe("/cycles: each entry states its own verdict", () => {
  it("covers all ten cycles: nine verdicts plus the unpaired one", () => {
    expect(cycleList).toHaveLength(10);
    expect(verdicts).toHaveLength(9);
  });

  for (const v of verdicts) {
    it(`${v.cycle_id}: says how many years too short its record is`, () => {
      expect(v.eligible).toBe(false); // every primary pairing today; the copy below assumes it
      const short = Math.ceil(3 * v.period_years - v.span_years);
      const text = entryText(v.cycle_id);
      expect(text).toContain(`Can't be tested yet:`);
      expect(text).toContain(`is ${short} years too short.`);
    });

    it(`${v.cycle_id}: names the record the verdict is judged on`, () => {
      const paired = seriesList.find((s) => s.associated_cycle_id === v.cycle_id);
      const text = entryText(v.cycle_id);
      if (paired && paired.id === v.series_id) {
        // Same series: "its record" points at the "Paired data" line just above.
        expect(text).toContain(`Paired data - ${paired.name}`);
        expect(text).toContain("its record is");
      } else {
        const judgedName = v.lay_text.match(/^The (.+) record spans/)?.[1];
        expect(judgedName, `lay_text shape changed for ${v.cycle_id}`).toBeTruthy();
        expect(text).toContain(`the record it is judged on, ${judgedName}, is`);
        expect(text).not.toContain("its record is");
      }
    });
  }

  it("the two different cuts are exactly Kondratiev and Turchin", () => {
    const differ = verdicts
      .filter((v) => seriesList.find((s) => s.associated_cycle_id === v.cycle_id)?.id !== v.series_id)
      .map((v) => v.cycle_id)
      .sort();
    expect(differ).toEqual(["kondratiev", "turchin"]);
  });

  it("the unpaired cycle says it is not tested, and claims no shortfall", () => {
    const unpaired = cycleList.filter((c) => !verdicts.some((v) => v.cycle_id === c.id));
    expect(unpaired.map((c) => c.id)).toEqual(["turchin_fathers_sons"]);
    const text = entryText("turchin_fathers_sons");
    expect(text).toContain("Not tested: there is no paired record to test it against.");
    expect(text).not.toMatch(/too short|Can't be tested/);
  });

  it("positive control: the entry slicer does not reach into the next entry", () => {
    expect(entryText("schlesinger_jr")).not.toContain("Turchin");
  });
});
