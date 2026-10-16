import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { claimAnswer, NOT_FORECAST } from "@/lib/claimQuestion";
import { cycleJsonLd, cycleMetaTitle } from "@/lib/cycleRoutes";
import { holdsUpCard } from "@/lib/holdsUp";

const dalio = cycles.find((c) => c.id === "dalio")!;

describe("claim pages (cycles.json `question`)", () => {
  it("is Dalio and Strauss-Howe today, so the other eight pages are untouched", () => {
    expect(cycles.filter((c) => c.question).map((c) => c.id)).toEqual(["dalio", "strauss_howe"]);
    for (const c of cycles.filter((x) => !x.question)) expect(claimAnswer(c, 2026)).toBeNull();
  });

  it("titles the page by the question plus the searchers' own words", () => {
    expect(cycleMetaTitle(dalio)).toBe("Is Ray Dalio's Big Cycle peaking? The theory against the record");
  });

  it("leads every lifted string with the verdict, in the share card's exact words", () => {
    const card = holdsUpCard(dalio)!;
    const a = claimAnswer(dalio, 2026)!;
    expect(a.description).toBe(`${dalio.question} ${card.headline}. ${card.detail}`);
    // Whole text: verdict, then the not-a-forecast lead, THEN the position (I-052). The old
    // trailing caveat is gone from the claim form.
    expect(a.text).toBe(
      `${card.headline}. ${card.detail} Where this site's drawn wave puts 2026 is not evidence for or against Ray Dalio's cycle. This page draws a wave, not Ray Dalio's forecast: on that wave, 2026 sits at a peak (the curve tops out in 2025; curve height +1.00, from −1 at a low to +1 at a peak). The next low falls around 2063.`,
    );
    expect(a.text.indexOf("not Ray Dalio's forecast")).toBeLessThan(a.text.indexOf("sits at a peak"));
    expect(a.text).not.toContain(NOT_FORECAST);
    // The snippet stays inside the cap the other descriptions keep (cycleRoutes.test.ts).
    expect(a.description.length).toBeLessThanOrEqual(165);
    // No position in the snippet: a cut there could keep "sits at a peak" without its clause.
    expect(a.description).not.toContain("sits");
  });

  it("gives Strauss-Howe the same shape, in its searchers' words, inside the snippet cap", () => {
    const sh = cycles.find((c) => c.id === "strauss_howe")!;
    const card = holdsUpCard(sh)!;
    const a = claimAnswer(sh, 2026)!;
    expect(cycleMetaTitle(sh)).toBe("Are we in the Fourth Turning? The theory against the record");
    expect(a.description).toBe(`Are we in the Fourth Turning? ${card.headline}. ${card.detail}`);
    expect(a.description.length).toBeLessThanOrEqual(165);
    expect(a.text.startsWith(
      `${card.headline}. ${card.detail} Where this site's drawn wave puts 2026 is not evidence for or against Strauss-Howe's cycle. This page draws a wave, not Strauss-Howe's forecast: on that wave, 2026 sits `,
    )).toBe(true);
  });

  it("serves the FAQ question and answer in exactly those words (Codex r1, MED)", () => {
    const a = claimAnswer(dalio, 2026)!;
    const faq = (cycleJsonLd(dalio, a) as { "@graph": Record<string, unknown>[] })["@graph"].filter(
      (n) => n["@type"] === "FAQPage",
    );
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity).toEqual({
      "@type": "Question",
      name: "Is Ray Dalio's Big Cycle peaking?",
      acceptedAnswer: { "@type": "Answer", text: a.text },
    });
  });

  it("adds a FAQPage node only on a claim page", () => {
    const types = (c: (typeof cycles)[number]) =>
      (cycleJsonLd(c, claimAnswer(c, 2026)) as { "@graph": { "@type": string }[] })["@graph"].map(
        (n) => n["@type"],
      );
    expect(types(dalio)).toContain("FAQPage");
    for (const c of cycles.filter((x) => !x.question)) expect(types(c)).not.toContain("FAQPage");
  });
});
