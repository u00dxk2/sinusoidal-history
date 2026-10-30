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
  const DEFAULT = { start: 1600, end: 2050 };

  it("states today's ten, counted from the stored peaks", () => {
    expect(glanceClusterLine(cycles, cycles, DEFAULT)).toBe(
      "Nine of the ten peak years fall between 1945 and 2020. They are anchors, set by the theorists or by this site, not evidence that the cycles agree.",
    );
  });

  it("is true of the data it counts: exactly that many stored peaks sit in the window", () => {
    const inside = cycles.filter(
      (c) => c.reference_peak_year >= CLUSTER_FROM && c.reference_peak_year <= CLUSTER_TO,
    );
    expect(inside).toHaveLength(9);
    expect(glanceClusterLine(cycles, cycles, DEFAULT)!.startsWith(`${countWord(inside.length)} of the `)).toBe(true);
  });

  // Codex r1 + r2 refuted a causal clause twice ("theorists whose climaxes…", "because … a
  // selection effect"), so the shape changed: the line states provenance and denies evidence,
  // and claims no cause. Among the nine in-window anchors, at least one is this site's own
  // construction, which is why it says "or by this site".
  it("claims provenance, not a cause, and names the site as a source of anchors", () => {
    const inWindow = cycles.filter(
      (c) => c.reference_peak_year >= CLUSTER_FROM && c.reference_peak_year <= CLUSTER_TO,
    );
    const constructed = inWindow.filter((c) =>
      /this project's construction|interval midpoint|mathematical convenience|we use/i.test(
        c.reference_peak_rationale,
      ),
    );
    expect(constructed.map((c) => c.id)).toEqual(
      expect.arrayContaining(["kondratiev", "huntington", "schlesinger_jr", "perez"]),
    );
    const line = glanceClusterLine(cycles, cycles, DEFAULT)!;
    expect(line).toMatch(/set by the theorists or by this site/);
    expect(line).toMatch(/not evidence that the cycles agree/);
    expect(line).not.toMatch(/\bbecause\b|\bso\b|selection|caus|climax|theorists whose/i);
  });

  it("says nothing once a calibration moves a peak, and nothing when the peaks do not bunch", () => {
    for (let i = 0; i < cycles.length; i++) {
      const moved = cycles.map((c, j) => (j === i ? { ...c, reference_peak_year: c.reference_peak_year + 1 } : c));
      expect(glanceClusterLine(cycles, moved, DEFAULT), cycles[i].id).toBeNull();
    }
    // A changed period alone moves no peak, so the sentence stays.
    const stretched = cycles.map((c) => ({ ...c, period_years: c.period_years + 5 }));
    expect(glanceClusterLine(cycles, stretched, DEFAULT)).not.toBeNull();
    const spread = cycles.map((c, i) => ({ ...c, reference_peak_year: 1500 + i * 60 }));
    expect(glanceClusterLine(spread, spread, DEFAULT)).toBeNull();
    expect(glanceClusterLine([], [], DEFAULT)).toBeNull();
    // Not aligned with the stored list: a different length, or the same peaks in another order.
    expect(glanceClusterLine(cycles, cycles.slice(1), DEFAULT)).toBeNull();
    expect(glanceClusterLine(cycles, [...cycles].reverse(), DEFAULT)).toBeNull();
    // Codex r2: two cycles share 1970, so swapping them leaves every peak year in place and only
    // the id check can refuse it.
    const a = cycles.findIndex((c) => c.id === "schlesinger_jr");
    const b = cycles.findIndex((c) => c.id === "turchin_fathers_sons");
    expect(cycles[a].reference_peak_year).toBe(cycles[b].reference_peak_year);
    const swapped = [...cycles];
    [swapped[a], swapped[b]] = [swapped[b], swapped[a]];
    expect(glanceClusterLine(cycles, swapped, DEFAULT)).toBeNull();
  });

  it("needs a strict majority inside the window: an exact half says nothing", () => {
    const half = cycles.slice(0, 4).map((c, i) => ({ ...c, reference_peak_year: i < 2 ? 1960 : 1700 }));
    expect(glanceClusterLine(half, half, DEFAULT)).toBeNull();
    const most = half.map((c, i) => (i === 2 ? { ...c, reference_peak_year: 1960 } : c));
    expect(glanceClusterLine(most, most, DEFAULT)).toMatch(/^Three of the four /);
  });

  // Codex r1: at a brushed range that does not draw 1945-2020 there is no bunching on screen.
  it("says nothing when the brushed range does not draw the whole window", () => {
    expect(glanceClusterLine(cycles, cycles, { start: 1600, end: 1750 })).toBeNull();
    expect(glanceClusterLine(cycles, cycles, { start: 1800, end: 1950 })).toBeNull();
    expect(glanceClusterLine(cycles, cycles, { start: 1950, end: 2100 })).toBeNull();
    expect(glanceClusterLine(cycles, cycles, { start: 1900, end: 2050 })).not.toBeNull();
    // Inclusive at both ends of the window.
    expect(glanceClusterLine(cycles, cycles, { start: 1945, end: 2020 })).not.toBeNull();
    expect(glanceClusterLine(cycles, cycles, { start: 1946, end: 2020 })).toBeNull();
    expect(glanceClusterLine(cycles, cycles, { start: 1945, end: 2019 })).toBeNull();
  });

  // I-061: names where the peaks are, never where the present sits on a curve.
  it("speaks no position and no phase", () => {
    const line = glanceClusterLine(cycles, cycles, DEFAULT)!;
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
