import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { claimAnswer, NOT_FORECAST } from "@/lib/claimQuestion";
import { cycleJsonLd, cycleMetaTitle } from "@/lib/cycleRoutes";
import { holdsUpCard } from "@/lib/holdsUp";

const dalio = cycles.find((c) => c.id === "dalio")!;

describe("claim pages (cycles.json `question`)", () => {
  it("is Dalio alone today, so the other nine pages are untouched", () => {
    expect(cycles.filter((c) => c.question).map((c) => c.id)).toEqual(["dalio"]);
    for (const c of cycles.filter((x) => !x.question)) expect(claimAnswer(c, 2026)).toBeNull();
  });

  it("titles the page by the question plus the searchers' own words", () => {
    expect(cycleMetaTitle(dalio)).toBe("Is Ray Dalio's Big Cycle peaking? The theory against the record");
  });

  it("leads every lifted string with the verdict, in the share card's exact words", () => {
    const card = holdsUpCard(dalio)!;
    const a = claimAnswer(dalio, 2026)!;
    expect(a.description).toBe(`${dalio.question} ${card.headline}. ${card.detail}`);
    expect(a.text.startsWith(`${card.headline}. ${card.detail} `)).toBe(true);
    // The position comes after the verdict and is never lifted without its clause.
    expect(a.text).toContain("2026 sits at a peak");
    expect(a.text.indexOf("sits at a peak")).toBeGreaterThan(a.text.indexOf(card.headline));
    expect(a.text.endsWith(NOT_FORECAST)).toBe(true);
    // The snippet stays inside the cap the other descriptions keep (cycleRoutes.test.ts).
    expect(a.description.length).toBeLessThanOrEqual(165);
    // No position in the snippet: a cut there could keep "sits at a peak" without its clause.
    expect(a.description).not.toContain("sits");
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
