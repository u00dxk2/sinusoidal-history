// I-024 (2026-10-06): /cycles/kondratiev carried "US TFP growth (5-yr rolling)" on the curve,
// the paired-data note and the citation, and "annual, unsmoothed" in the verdict, and nowhere
// said which was judged or why. A cold reader "could not tell from the page which series was
// tested" (W-003 D2). These assertions run on the SERVER-RENDERED page, so they read what a
// reader gets, not the source.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CyclePage from "@/app/(app)/cycles/[id]/page";
import CyclesIndex from "@/app/(app)/cycles/page";
import Methods from "@/app/(app)/methods/page";
import { cycles } from "@/data/cycles";
import { cycleSlug } from "@/lib/cycleRoutes";
import { spectralVerdictForCycle } from "@/lib/spectral";
import { testedSeriesNote } from "@/lib/testedSeries";

async function pageText(slug: string): Promise<string> {
  const element = await CyclePage({ params: Promise.resolve({ id: slug }) });
  return renderToStaticMarkup(element as Parameters<typeof renderToStaticMarkup>[0])
    .replace(/<!-- -->/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

// A sentence claiming a test RAN. Kondratiev's verdict says "No test was run", so nothing this
// note adds may say otherwise (manager review a4da274a, 2026-10-06).
// I-028 (2026-10-08): "verdict tests", "pairing tests" and "ran a … test" added. Turchin's live
// box read "The record this verdict tests — …" and Schlesinger's page "the pairing tests his
// data" while this guard passed, because it was written from Kondratiev's wording and only ever
// read Kondratiev's page. It now reads every cycle page (below).
const TEST_RAN =
  /\b(test\s+(was\s+)?ran|test\s+uses|tests?\s+(was|were)\s+run\s+on|was\s+tested|is\s+tested|tested\s+on|(verdicts?|pairing)\s+(\w+\s+)?tests|ran\s+an?\s+(\w+\s+)?test|spectral\s+test\s+finds)\b/i;

// Production /cycles/turchin, 2026-10-08, before I-028: the sentence the guard must catch.
const TURCHIN_LIVE_BEFORE =
  "The record this verdict tests — a different cut of the paired series from the one drawn on the chart, named in the verdict below — runs 111 years";

// What a reader (or a screen reader) gets: visible text plus the reader-facing attributes,
// tags dropped, whitespace collapsed. Codex r2: a bare tag strip left "test  uses" (two
// spaces) when a word was wrapped in <em>, and dropped alt/aria-label/title entirely.
function readerText(html: string): string {
  const attrs = [...html.matchAll(/\s(?:alt|aria-label|title)="([^"]*)"/g)].map((m) => m[1]);
  return [html.replace(/<[^>]+>/g, " "), ...attrs].join(" ").replace(/\s+/g, " ");
}

describe("I-024: the Kondratiev page names the series its verdict is judged on", () => {
  const verdict = spectralVerdictForCycle("kondratiev");
  const note = testedSeriesNote(verdict!.series_id);

  it("has a note for Kondratiev's judged series, spelled as the verdict spells it", () => {
    expect(verdict!.series_id).toBe("us_tfp_growth_annual");
    expect(note).toBeDefined();
    expect(verdict!.lay_text).toContain(note!.name);
  });

  it("the box names the judged series instead of pointing below", async () => {
    const html = await pageText("kondratiev");
    expect(html).toContain(
      `The record this verdict is judged on, US TFP growth (annual, unsmoothed), runs ${verdict!.span_years} years:`,
    );
    expect(html).not.toContain("named in the verdict below");
  });

  it("the verdict section says why there are two labels, once", async () => {
    const html = await pageText("kondratiev");
    expect(html.split("Why two labels:").length - 1).toBe(1);
    expect(html).toContain("5-year rolling average of this series");
  });

  it("no sentence on the Kondratiev page says a test ran", async () => {
    expect(verdict!.eligible).toBe(false);
    // Positive control: the exact sentence the manager review rejected (a4da274a).
    expect("The test uses the annual figures.").toMatch(TEST_RAN);
    // Positive controls for the two escapes Codex r2 named: a word wrapped in an element,
    // and a claim carried only in an attribute.
    expect(readerText("<p>The <em>test</em> uses the annual figures.</p>")).toMatch(TEST_RAN);
    expect(readerText('<img alt="A test ran on the annual figures">')).toMatch(TEST_RAN);
    // The whole rendered page, not only the note, so copy added anywhere is caught.
    expect(readerText(await pageText("kondratiev"))).not.toMatch(TEST_RAN);
    expect(note!.whyTwoLabels).toContain("would run any test");
  });

  it("the note names the page's own labels, not a curve the page does not draw", () => {
    // Codex r1 (2026-10-06): this page's curve is the theoretical sine (sineAtYear); the
    // rolling average is named under "Paired data" and in the citation, and drawn only on
    // the interactive chart.
    expect(note!.whyTwoLabels).toContain("“Paired data” line and section");
    expect(note!.whyTwoLabels).toContain("the interactive chart draws");
    expect(note!.whyTwoLabels).not.toMatch(/curve earlier/);
  });

  it("a page whose judged and drawn series match is unchanged (Perez)", async () => {
    const html = await pageText("perez");
    expect(html).toContain("The paired record (");
    expect(html).not.toContain("Why two labels:");
  });

  it("an unknown or inherited key returns no note", () => {
    expect(testedSeriesNote("constructor")).toBeUndefined();
    expect(testedSeriesNote("nope")).toBeUndefined();
  });
});

describe("I-028: the Turchin page names the series its verdict is judged on", () => {
  const verdict = spectralVerdictForCycle("turchin");
  const note = testedSeriesNote(verdict!.series_id);

  it("has a note for Turchin's judged series, spelled as the verdict spells it", () => {
    expect(verdict!.series_id).toBe("wid_top1_wealth_1913");
    expect(note).toBeDefined();
    expect(verdict!.lay_text).toContain(note!.name);
  });

  it("the box names the judged series instead of pointing below", async () => {
    const html = await pageText("turchin");
    expect(html).toContain(
      `The record this verdict is judged on, US top 1% wealth share (1913 onward), runs ${verdict!.span_years} years:`,
    );
    expect(html).not.toContain("named in the verdict below");
    expect(html.split("Why two labels:").length - 1).toBe(1);
  });

  it("no sentence on the Turchin page says a test ran", async () => {
    expect(verdict!.eligible).toBe(false);
    // Positive control: the sentence production served before this change.
    expect(TURCHIN_LIVE_BEFORE).toMatch(TEST_RAN);
    expect(readerText(await pageText("turchin"))).not.toMatch(TEST_RAN);
  });

  it("the reason is Turchin's own, not Kondratiev's smoothing one", () => {
    expect(note!.whyTwoLabels).toContain("1913");
    expect(note!.whyTwoLabels).not.toMatch(/rolling average|smooth/i);
    // Manager review 77265f70: name the chart's own label so the two are visibly matched.
    expect(note!.whyTwoLabels).toContain("US Top 1% Wealth Share");
    expect(note!.whyTwoLabels).toContain("“Paired data” line and section");
  });
});

describe("I-028: no cycle page whose verdict is ineligible says a test ran", () => {
  it("the guard catches the shapes Codex r1 (2026-10-08) named as escapes", () => {
    expect("the pairing tests his data against Schlesinger's period").toMatch(TEST_RAN);
    expect("We ran a spectral test on the 1913–2024 record.").toMatch(TEST_RAN);
    // Negations the site writes on purpose stay clear of it.
    expect("No test was run: this record covers 0.7 of the 3.0 full periods").not.toMatch(TEST_RAN);
    expect("No test was run and no p-value exists").not.toMatch(TEST_RAN);
  });

  const ineligible = cycles.filter((c) => spectralVerdictForCycle(c.id)?.eligible === false);

  it("covers more than the two pages the guard was written from", () => {
    expect(ineligible.length).toBeGreaterThan(2);
  });

  it.each(ineligible.map((c) => cycleSlug(c)))("%s", async (slug) => {
    expect(readerText(await pageText(slug))).not.toMatch(TEST_RAN);
  });
});

// Codex r2 (2026-10-08) found the same claim on two surfaces no cycle page renders: the
// verdict table's footnote ("each verdict actually tests", /cycles and /methods) and the
// /methods headline ("a pre-registered spectral test finds"). So the guard reads those pages
// and every published Markdown file too. While no primary verdict is eligible, none of these
// may say a test ran.
const PUBLIC = join(process.cwd(), "public");
// True sentences the pattern also matches, by exact text (never a looser rule):
// llms.txt's API field description is conditional; spectral.source.md:47 is a negation in the
// frozen spectral directory (AGENTS.md: that directory is written by the script).
const ALLOWED = ["p-values where a test ran", "so no test ran"];

function staticText(element: unknown): string {
  return readerText(
    renderToStaticMarkup(element as Parameters<typeof renderToStaticMarkup>[0])
      .replace(/<!-- -->/g, "")
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&"),
  );
}

describe("I-028: the shared surfaces do not say a test ran", () => {
  it("the guard catches the two r2 shapes", () => {
    expect("the series each verdict actually tests").toMatch(TEST_RAN);
    expect("a pre-registered spectral test finds that 0 of the 9 pairings").toMatch(TEST_RAN);
  });

  it("/cycles", () => {
    expect(staticText(CyclesIndex())).not.toMatch(TEST_RAN);
  });

  it("/methods", () => {
    expect(staticText(Methods())).not.toMatch(TEST_RAN);
  });

  const published = [
    ...readdirSync(PUBLIC).filter((f) => f.endsWith(".md") || f === "llms.txt"),
    ...readdirSync(join(PUBLIC, "data")).filter((f) => f.endsWith(".md")).map((f) => join("data", f)),
    ...readdirSync(join(PUBLIC, "data", "spectral")).filter((f) => f.endsWith(".md")).map((f) => join("data", "spectral", f)),
  ];

  it("reads more than the three prose mirrors", () => {
    expect(published.length).toBeGreaterThan(3);
  });

  it.each(published)("public/%s", (file) => {
    let text = readFileSync(join(PUBLIC, file), "utf8");
    for (const ok of ALLOWED) text = text.split(ok).join("");
    expect(text).not.toMatch(TEST_RAN);
  });
});
