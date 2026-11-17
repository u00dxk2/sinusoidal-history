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
import { readFileSync } from "node:fs";
import { join } from "node:path";
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

const ROOT = process.cwd();
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

  // Codex r1 on 2f533e3 named these two as what the substring checks above cannot see.
  it("each verdict line sits in the entry itself, before the closed 'longer story' panel", () => {
    for (const c of cycleList) {
      const start = html.indexOf(`href="/cycles/${c.id.replace(/_/g, "-")}"`);
      const li = html.slice(start, html.indexOf("</li>", start));
      const verdictAt = li.indexOf(`data-entry-verdict="${c.id}"`);
      expect(verdictAt, c.id).toBeGreaterThan(-1);
      const detailsAt = li.indexOf("<details");
      if (detailsAt > -1) expect(verdictAt, c.id).toBeLessThan(detailsAt);
      // The line's own opening tag, whole (attributes render in prop order, so class follows).
      const tag = li.slice(li.lastIndexOf("<", verdictAt), li.indexOf(">", verdictAt) + 1);
      expect(tag, c.id).toMatch(/^<p /);
      expect(tag, c.id).not.toMatch(/\b(hidden|sr-only|invisible)\b/);
    }
  });

  it("each entry's shortfall equals the verdict table's row for the same cycle", () => {
    for (const v of verdicts) {
      const rowStart = html.indexOf(`data-verdict-id="${v.cycle_id}"`);
      expect(rowStart, v.cycle_id).toBeGreaterThan(-1);
      const row = decode(html.slice(rowStart, html.indexOf("</li>", rowStart)));
      const tableShort = row.match(/needs (\d+) more years/)?.[1];
      expect(entryText(v.cycle_id)).toContain(`is ${tableShort} years too short.`);
    }
  });

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

  // I-083 (2026-11-17): the two different-cut entries named one series on "Paired data" and
  // another on the verdict line, with the reason ~4,000px lower. The reason now sits in the
  // verdict line itself. The facts each pin checks are the round-0 list's: Kondratiev's drawn
  // file is a 5-year centred rolling mean of the judged annual file (build_us_tfp_growth.py,
  // manifest note on TFP); Turchin's drawn file runs from 1820 and the manifest cuts the judged
  // record at 1913 (analysis-manifest.yaml truncate_min_year), with five earlier points.
  function verdictLine(cycleId: string): string {
    const at = html.indexOf(`data-entry-verdict="${cycleId}"`);
    expect(at, cycleId).toBeGreaterThan(-1);
    return decode(html.slice(html.indexOf(">", at) + 1, html.indexOf("</p>", at)));
  }

  // Source pins (Codex r1 on the uncommitted I-083 change: the wording pins alone could not see
  // the sources move). Each NUMBER the sentences state is read here from the file that fixes it,
  // never from the page's own strings: the build script's window, the manifest's primary pairing,
  // cut and TFP note, and the wealth CSV's dated values.
  // What this does NOT see, on purpose (Codex r2 found the same class twice, so the test claims
  // less rather than growing): (a) whether us_tfp_growth.csv's values really are the rolling mean
  // of the annual file; build_us_tfp_growth.py writes both in one run, and that script is the
  // check; (b) the provenance words "rougher estimates from earlier historical sources", which
  // are prose. Round 0 and the r1 claims pass checked them against wid_top1_wealth.source.md:6
  // and series.json:38-39. Edit the sentence if that provenance changes.
  const manifestText = readFileSync(join(ROOT, "scripts", "spectral", "analysis-manifest.yaml"), "utf8");
  const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

  function manifestBlock(seriesId: string): string {
    const m = new RegExp(`^  - id: ${seriesId}\\r?$`, "m").exec(manifestText);
    expect(m, `manifest has no series ${seriesId}`).toBeTruthy();
    const at = m!.index;
    const next = manifestText.slice(at + 1).search(/^(  - id: |primary:)/m);
    return manifestText.slice(at, next === -1 ? undefined : at + 1 + next);
  }

  it("Kondratiev's verdict line says why, and each fact matches its source", () => {
    const window = readFileSync(join(ROOT, "scripts", "build_us_tfp_growth.py"), "utf8").match(
      /^WINDOW = (\d+)/m,
    )?.[1];
    expect(window, "build_us_tfp_growth.py WINDOW").toBeTruthy();
    const drawn = seriesList.find((s) => s.associated_cycle_id === "kondratiev") as RawSeries & { data_file: string };
    expect(drawn.data_file).toBe("/data/us_tfp_growth.csv"); // the smoothed file the chart loads
    const v = verdicts.find((x) => x.cycle_id === "kondratiev")!;
    expect(manifestText).toMatch(new RegExp(`cycle_id: kondratiev, period_years: \\d+, series_id: ${v.series_id}\\}`));
    expect(manifestBlock(v.series_id)).toMatch(/transform: none/); // judged on the unsmoothed figures
    // The reason the sentence gives is the manifest's own TFP note.
    expect(manifestText).toMatch(/smoothed display CSV \(us_tfp_growth\.csv\) is banned from inference/);
    expect(manifestText).toMatch(/corrupts the AR fit/);

    const line = verdictLine("kondratiev");
    expect(line).toContain(`The site's interactive chart draws the ${window}-year average named above`);
    expect(line).toContain("the verdict counts the yearly figures, because an average makes neighbouring years move together");
    expect(line).toContain("would distort the background-noise model a test compares against.");
  });

  it("Turchin's verdict line says why, and each fact matches its source", () => {
    const drawn = seriesList.find((s) => s.associated_cycle_id === "turchin") as RawSeries & { data_file: string };
    const years = readFileSync(join(ROOT, "public", drawn.data_file), "utf8")
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .map((row) => row.split(","))
      // A point counts only if it carries a value (Codex r2: an "NA" row is not a drawn point).
      .filter((cells) => cells[1] !== undefined && cells[1].trim() !== "" && Number.isFinite(Number(cells[1])))
      .map((cells) => Number(cells[0]));
    const v = verdicts.find((x) => x.cycle_id === "turchin")!;
    const cut = Number(manifestBlock(v.series_id).match(/truncate_min_year: (\d+)/)?.[1]);
    expect(cut, "manifest truncate_min_year").toBeGreaterThan(0);
    const before = years.filter((y) => y < cut);
    const after = years.filter((y) => y >= cut);
    // "the yearly record, which starts in <cut>": every year from the cut on is present, and it starts there.
    expect(after[0]).toBe(cut);
    expect(after.every((y, i) => i === 0 || y === after[i - 1] + 1)).toBe(true);
    // The points before the cut are not yearly (that is what the sentence leaves out).
    expect(before.length).toBeGreaterThan(0);
    expect(before.some((y, i) => i > 0 && y !== before[i - 1] + 1)).toBe(true);

    const line = verdictLine("turchin");
    expect(line).toContain(`The site's interactive chart draws the whole series named above, from ${years[0]};`);
    expect(line).toContain(`the verdict counts only the yearly record, which starts in ${cut}.`);
    expect(line).toContain(`The ${NUMBER_WORDS[before.length]} points before it are rougher estimates`);
  });

  it("only the different-cut entries carry a drawn-vs-judged reason", () => {
    for (const v of verdicts) {
      const paired = seriesList.find((s) => s.associated_cycle_id === v.cycle_id);
      const line = verdictLine(v.cycle_id);
      if (paired && paired.id === v.series_id) expect(line, v.cycle_id).not.toContain("interactive chart draws");
      else expect(line, v.cycle_id).toContain("interactive chart draws");
    }
  });

  it("positive control: the entry slicer does not reach into the next entry", () => {
    expect(entryText("schlesinger_jr")).not.toContain("Turchin");
  });
});
