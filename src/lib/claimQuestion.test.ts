import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { claimAnswer } from "@/lib/claimQuestion";
import { cycleJsonLd, cycleMetaTitle } from "@/lib/cycleRoutes";
import { holdsUpCard } from "@/lib/holdsUp";

const dalio = cycles.find((c) => c.id === "dalio")!;

// The answer states no year's position (I-061, David 2026-10-21). Until then it went on
// "… on that wave, 2026 sits at a peak (the curve tops out in 2025 …)".
const NO_POSITION = /\b20[0-9]{2}\b|sits at|peaking|rising|falling|tops out/;

describe("claim pages (cycles.json `question`)", () => {
  it("is Turchin, Dalio and Strauss-Howe today, so the other seven pages are untouched", () => {
    expect(cycles.filter((c) => c.question).map((c) => c.id)).toEqual(["turchin", "dalio", "strauss_howe"]);
    for (const c of cycles.filter((x) => !x.question)) expect(claimAnswer(c)).toBeNull();
  });

  it("titles the page by the question plus the searchers' own words", () => {
    expect(cycleMetaTitle(dalio)).toBe("Is Ray Dalio's Big Cycle peaking? The theory against the record");
  });

  it("leads every lifted string with the verdict, then says what the drawing is, and states no position", () => {
    const card = holdsUpCard(dalio)!;
    const a = claimAnswer(dalio)!;
    expect(a.description).toBe(`${dalio.question} ${card.headline}. ${card.detail}`);
    expect(a.text).toBe(
      `${card.headline}. ${card.detail} This page draws one period of a wave around the peak year this site uses for Ray Dalio's cycle. It is not a forecast, and not evidence for or against the cycle.`,
    );
    // The snippet stays inside the cap the other descriptions keep (cycleRoutes.test.ts).
    expect(a.description.length).toBeLessThanOrEqual(165);
    for (const c of cycles.filter((x) => x.question)) {
      const ans = claimAnswer(c)!;
      expect(ans.text.slice(`${holdsUpCard(c)!.headline}. ${holdsUpCard(c)!.detail}`.length)).not.toMatch(NO_POSITION);
    }
  });

  it("gives Strauss-Howe the same shape, in its searchers' words, inside the snippet cap", () => {
    const sh = cycles.find((c) => c.id === "strauss_howe")!;
    const card = holdsUpCard(sh)!;
    const a = claimAnswer(sh)!;
    expect(cycleMetaTitle(sh)).toBe("Are we in the Fourth Turning? The theory against the record");
    expect(a.description).toBe(`Are we in the Fourth Turning? ${card.headline}. ${card.detail}`);
    expect(a.description.length).toBeLessThanOrEqual(165);
    expect(a.text).toBe(
      `${card.headline}. ${card.detail} This page draws one period of a wave around the peak year this site uses for Strauss-Howe's cycle. It is not a forecast, and not evidence for or against the cycle.`,
    );
  });

  // I-065: Turchin's period runs 1945-2095, so in 2026 it is cut at today, and "draws one
  // period" would be false. The cut form names the start and the stop and no count of years.
  it("tells a Turchin reader the drawing stops at today, and says one period only once it is whole", () => {
    const turchin = cycles.find((c) => c.id === "turchin")!;
    const card = holdsUpCard(turchin)!;
    expect(claimAnswer(turchin, 2026)!.text).toBe(
      `${card.headline}. ${card.detail} This page draws a wave around the peak year this site uses for Peter Turchin's cycle, from its 1945 trough up to today; the rest of that period has not happened yet. It is not a forecast, and not evidence for or against the cycle.`,
    );
    expect(claimAnswer(turchin, 2095)!.text).toContain("This page draws one period of a wave");
    for (const c of cycles.filter((x) => x.question)) {
      expect(claimAnswer(c, 2026)!.text).not.toMatch(/\b\d+(\.\d+)? of its \d+ years\b/);
    }
  });

  it("serves the FAQ question and answer in exactly those words (Codex r1, MED)", () => {
    const a = claimAnswer(dalio)!;
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
      (cycleJsonLd(c, claimAnswer(c)) as { "@graph": { "@type": string }[] })["@graph"].map(
        (n) => n["@type"],
      );
    expect(types(dalio)).toContain("FAQPage");
    for (const c of cycles.filter((x) => !x.question)) expect(types(c)).not.toContain("FAQPage");
  });
});
