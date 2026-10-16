import { describe, it, expect } from "vitest";
import { cycles } from "@/data/cycles";
import { phasePositionLabel, type PhasePositionLabel } from "@/lib/cycleMath";
import {
  glanceVerdictFromHeadlines,
  glanceVerdictLine,
  overviewRowReading,
} from "@/lib/overviewReading";
import { holdsUpCard } from "@/lib/holdsUp";

// I-048: the glance figure's visible verdict, counted from the cards' headlines.
describe("glanceVerdictLine", () => {
  it("states today's ten in words, counted from the card headlines", () => {
    expect(glanceVerdictLine(cycles)).toBe(
      "None of these ten is confirmed: nine cannot be tested on the record that exists, and one has no record on this site.",
    );
  });

  it("drops a clause whose count is zero", () => {
    const paired = cycles.filter((c) => holdsUpCard(c)?.headline === "Not testable on the record that exists");
    expect(glanceVerdictLine(paired)).toBe(
      `None of these nine is confirmed: nine cannot be tested on the record that exists.`,
    );
  });

  it("says nothing once any headline is not one of the two untested forms", () => {
    const today = cycles.map((c) => holdsUpCard(c)?.headline);
    expect(glanceVerdictFromHeadlines(today)).toBe(glanceVerdictLine(cycles));
    // One tested verdict, whatever it says: "none is confirmed" is no longer this rule's to state.
    expect(glanceVerdictFromHeadlines([...today.slice(1), "Tested — consistent"])).toBeNull();
    // A cycle with no card at all.
    expect(glanceVerdictFromHeadlines([...today, undefined])).toBeNull();
    expect(glanceVerdictFromHeadlines([])).toBeNull();
  });

  it("agrees in number with a plural no-record clause", () => {
    expect(glanceVerdictFromHeadlines(["Not tested", "Not tested"])).toBe(
      "None of these two is confirmed: two have no record on this site.",
    );
  });
});

const PHASE_WORDS: PhasePositionLabel[] = [
  "rising",
  "peaking",
  "falling",
  "troughing",
  "crossing",
];

describe("overviewRowReading", () => {
  // I-048 (2026-10-16 evening): the row draws no mark at the current year, so
  // it speaks no position either: no phase word, no year.
  it("speaks the period and the verdict headline, and no position, for every cycle", () => {
    for (const cycle of cycles) {
      const reading = overviewRowReading(cycle);
      const card = holdsUpCard(cycle);
      expect(card).not.toBeNull();
      expect(reading).toBe(` (${cycle.period_years}-year cycle). ${card!.headline}.`);
      for (const word of PHASE_WORDS) expect(reading).not.toContain(word);
      expect(reading).not.toMatch(/\b(1[5-9]|2[0-9])\d\d\b/);
      // The phase the facet header still shows is not repeated here.
      expect(reading).not.toContain(phasePositionLabel(cycle, 2026));
    }
  });
});
