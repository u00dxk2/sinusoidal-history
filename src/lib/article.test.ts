import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CyclePage from "@/app/(app)/cycles/[id]/page";
import { cycles } from "@/data/cycles";
import { aYear, indefiniteArticle } from "@/lib/article";
import { cycleMetaDescription } from "@/lib/cycleRoutes";
import { spectralVerdictForCycle } from "@/lib/spectral";

const modelski = cycles.find((c) => c.id === "modelski")!;

describe("the article on the surfaces that print a period (2026-10-13 close)", () => {
  it("/cycles/strauss-howe: the box says 'an 84-year'; only the frozen lay_text keeps 'a 84-year'", async () => {
    const el = await CyclePage({ params: Promise.resolve({ id: "strauss-howe" }) });
    const html = renderToStaticMarkup(el as Parameters<typeof renderToStaticMarkup>[0]).replace(/<!-- -->/g, "");
    expect(html).toContain("before it will run a test on an 84-year claim.");
    // The figure label says "one 84-year period" since I-061, so no article to get wrong.
    expect(html).toMatch(/aria-label="Strauss[^"]*: one 84-year period of a sinusoid/);
    // verdicts.json is manifest-frozen; its lay_text carries the one remaining slip until a re-freeze.
    const frozen = spectralVerdictForCycle("strauss_howe")!.lay_text;
    expect(frozen).toContain("a 84-year");
    expect(html.split(frozen).join("")).not.toMatch(/\ba 84-year/);
  });

  it("Modelski's search snippet: 'A 110-year', not 'An 110-year'", () => {
    expect(cycleMetaDescription(modelski)).toMatch(/^A 110-year sinusoid/);
  });
});

describe("indefiniteArticle (2026-10-13: 'An 110-year' live on Modelski, 'a 84-year' on Strauss-Howe)", () => {
  it.each([
    [8, "an"],
    [11, "an"],
    [18, "an"],
    [80, "an"],
    [84, "an"],
    [800, "an"],
    [11000, "an"],
    [30, "a"],
    [54, "a"],
    [110, "a"],
    [120, "a"],
    [150, "a"],
    [180, "a"],
    [1, "a"],
  ] as const)("%i takes %s", (n, art) => {
    expect(indefiniteArticle(n)).toBe(art);
  });

  it("every cycle period on the site, spelled out", () => {
    expect(Object.fromEntries(cycles.map((c) => [c.id, aYear(c.period_years)]))).toEqual({
      khaldun: "a 120-year",
      kondratiev: "a 54-year",
      huntington: "a 60-year",
      schlesinger_jr: "a 30-year",
      perez: "a 55-year",
      turchin: "a 150-year",
      dalio: "a 75-year",
      strauss_howe: "an 84-year",
      modelski: "a 110-year",
      turchin_fathers_sons: "a 50-year",
    });
  });
});
