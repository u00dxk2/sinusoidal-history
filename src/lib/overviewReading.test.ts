import { describe, it, expect } from "vitest";
import { cycles } from "@/data/cycles";
import { countWord } from "@/lib/countWords";
import {
  CLUSTER_FROM,
  CLUSTER_TO,
  glanceClusterLine,
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

// I-063: why the humps bunch, on the figure's screen.
describe("glanceClusterLine", () => {
  it("states today's ten, counted from the stored peaks", () => {
    expect(glanceClusterLine(cycles, cycles)).toBe(
      "Nine of the ten peaks fall between 1945 and 2020 because we read the theorists whose climaxes land in our era: a selection effect, not agreement.",
    );
  });

  it("is true of the data it counts: exactly that many stored peaks sit in the window", () => {
    const inside = cycles.filter(
      (c) => c.reference_peak_year >= CLUSTER_FROM && c.reference_peak_year <= CLUSTER_TO,
    );
    expect(inside).toHaveLength(9);
    expect(glanceClusterLine(cycles, cycles)!.startsWith(`${countWord(inside.length)} of the `)).toBe(true);
  });

  it("says nothing once a calibration moves a peak, and nothing when the peaks do not bunch", () => {
    const moved = cycles.map((c, i) => (i === 0 ? { ...c, reference_peak_year: c.reference_peak_year + 1 } : c));
    expect(glanceClusterLine(cycles, moved)).toBeNull();
    // A changed period alone moves no peak, so the sentence stays.
    const stretched = cycles.map((c) => ({ ...c, period_years: c.period_years + 5 }));
    expect(glanceClusterLine(cycles, stretched)).not.toBeNull();
    const spread = cycles.map((c, i) => ({ ...c, reference_peak_year: 1500 + i * 60 }));
    expect(glanceClusterLine(spread, spread)).toBeNull();
    expect(glanceClusterLine([], [])).toBeNull();
  });

  // I-061: names where the peaks are, never where the present sits on a curve.
  it("speaks no position and no phase", () => {
    const line = glanceClusterLine(cycles, cycles)!;
    for (const word of PHASE_WORDS) expect(line).not.toContain(word);
    expect(line).not.toMatch(/\b(today|now|present|currently|2026)\b/i);
    expect(line).not.toMatch(/\bconverg/i);
  });
});

// The five words the retired phase classifier printed (I-061 deleted it).
const PHASE_WORDS = [
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
    }
  });
});
