// I-024 (2026-10-06): /cycles/kondratiev carried "US TFP growth (5-yr rolling)" on the curve,
// the paired-data note and the citation, and "annual, unsmoothed" in the verdict, and nowhere
// said which was judged or why. A cold reader "could not tell from the page which series was
// tested" (W-003 D2). These assertions run on the SERVER-RENDERED page, so they read what a
// reader gets, not the source.
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CyclePage from "@/app/(app)/cycles/[id]/page";
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
const TEST_RAN = /\b(test (was )?ran|tests? (was|were) run on|was tested|is tested|tested on)\b/i;

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

  it("the added copy never says a test ran on Kondratiev", () => {
    expect(verdict!.eligible).toBe(false);
    // Positive control: the pattern catches the sentence the review flagged.
    expect("The test uses the annual figures, and a test ran on them.").toMatch(TEST_RAN);
    expect(note!.whyTwoLabels).not.toMatch(TEST_RAN);
    expect(note!.whyTwoLabels).toContain("would run any test");
  });

  it("a cut with no note keeps the generic sentence (Turchin)", async () => {
    const html = await pageText("turchin");
    expect(html).toContain("named in the verdict below");
    expect(html).not.toContain("Why two labels:");
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
