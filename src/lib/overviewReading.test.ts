import { describe, it, expect } from "vitest";
import { cycles } from "@/data/cycles";
import { countWord } from "@/lib/countWords";
import {
  CLUSTER_FROM,
  CLUSTER_TO,
  GLANCE_CAPTION_MAX_CHARS,
  GLANCE_HEIGHT_LABEL,
  GLANCE_HEIGHT_LABEL_MAX_CHARS,
  GLANCE_HEIGHT_READING,
  GLANCE_VERDICT_MAX_CHARS,
  glanceCaption,
  glanceClusterLine,
  glanceVerdictFromHeadlines,
  glanceVerdictLine,
  GLANCE_VERDICT_CALIBRATED,
  overviewRowReading,
  peaksMoved,
} from "@/lib/overviewReading";
import {
  holdsUpCard,
  NO_SERIES_HEADLINE,
  NOT_TESTABLE_HEADLINE,
  periodChanged,
  shownHeadline,
} from "@/lib/holdsUp";
import { cycleTheorist } from "@/lib/cycleRoutes";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CycleOverview from "@/components/CycleOverview";

// I-063 (2026-11-03): the caption is the figure's one first-screen line on every phone. It says
// the peaks were chosen beside I-048's verdict, and it must stay one line at 320px: 33 characters,
// measured on production (288px box, 8.58px per character). Ceiling: a character count, not a
// rendered width; a font or tracking change voids the budget (re-measure, see overviewReading.ts).
describe("glanceCaption", () => {
  // I-075 (2026-11-13): the 11-03 walker asked "Peaks chosen: chosen by whom?"
  // (docs/walks/2026-11-03-i063.md). Each stored rationale in cycles.json describes how this site
  // adopted the peak it draws, so the stored caption names the site (the peaks it uses, not that it
  // invented every date). While a drawn peak differs from its stored year, the caption says "chosen".
  it("says the stored peaks are the site's and no cycle is confirmed while the verdict line holds", () => {
    expect(glanceCaption(glanceVerdictLine(cycles), false)).toBe("Site's peaks · no cycle confirmed");
  });

  it("says only that the peaks were chosen while a drawn peak differs from its stored year", () => {
    expect(glanceCaption(glanceVerdictLine(cycles), true)).toBe("Peaks chosen · no cycle confirmed");
  });

  it("falls back to the claim-free caption when the verdict line has nothing to state", () => {
    expect(glanceCaption(null, false)).toBe("Theory shapes, not findings");
    expect(glanceCaption(null, true)).toBe("Theory shapes, not findings");
  });

  it("fits the measured one-line budget at 320px in every state", () => {
    for (const v of [glanceVerdictLine(cycles), null]) {
      for (const moved of [false, true]) {
        expect(glanceCaption(v, moved).length).toBeLessThanOrEqual(GLANCE_CAPTION_MAX_CHARS);
      }
    }
  });

  it("is what the figure renders, told by the chart whether a peak was moved", () => {
    // Resolved from this file, not the cwd (Codex r1: run from src/ it read src/src/...).
    const src = readFileSync(new URL("../components/CycleOverview.tsx", import.meta.url), "utf8");
    expect(src).toMatch(/\{glanceCaption\(verdictLine, peaksMoved\)\}/);
    const viz = readFileSync(new URL("../components/Viz.tsx", import.meta.url), "utf8");
    expect(viz).toMatch(/peaksMoved=\{peaksMoved\(cycles, effectiveCycles\)\}/);
  });
});

describe("peaksMoved", () => {
  it("is false for the stored peaks, and for a changed period alone", () => {
    expect(peaksMoved(cycles, cycles)).toBe(false);
    const stretched = cycles.map((c) => ({ ...c, period_years: c.period_years + 5 }));
    expect(peaksMoved(cycles, stretched)).toBe(false);
  });

  it("is true when any one peak year differs, and false again when it is moved back", () => {
    for (let i = 0; i < cycles.length; i++) {
      const moved = cycles.map((c, j) => (j === i ? { ...c, reference_peak_year: c.reference_peak_year + 1 } : c));
      expect(peaksMoved(cycles, moved), cycles[i].id).toBe(true);
      const back = moved.map((c, j) => (j === i ? { ...c, reference_peak_year: cycles[i].reference_peak_year } : c));
      expect(peaksMoved(cycles, back), cycles[i].id).toBe(false);
    }
  });

  it("is true when the drawn list does not line up with the stored one", () => {
    expect(peaksMoved(cycles, cycles.slice(1))).toBe(true);
    // Two cycles share 1970, so a swap keeps every year in place and only the id check sees it.
    const a = cycles.findIndex((c) => c.id === "schlesinger_jr");
    const b = cycles.findIndex((c) => c.id === "turchin_fathers_sons");
    const swapped = [...cycles];
    [swapped[a], swapped[b]] = [swapped[b], swapped[a]];
    expect(peaksMoved(cycles, swapped)).toBe(true);
  });
});

// I-077 (2026-11-12): the figure says what a hump's height means. The 11-03 cold walker read
// height as strength ("I assume height means strength, but that is a guess", the row's words).
// The label is only true while every cycle draws at unit amplitude, so that is pinned here too.
describe("glance height label", () => {
  it("is true of the data: every cycle draws at unit amplitude", () => {
    expect(cycles.length).toBeGreaterThan(0);
    for (const c of cycles) expect([c.id, c.amplitude_normalized]).toEqual([c.id, 1]);
  });

  it("says height is shape, not size, in the visible label and the screen-reader sentence", () => {
    expect(GLANCE_HEIGHT_LABEL).toBe("height: shape, not size");
    // Pinned whole (Codex r1): round 0 refuted "each hump … the same on every row" for a wave cut
    // by the window or by today, so the "full wave" qualifier must not drift off.
    expect(GLANCE_HEIGHT_READING).toBe(
      "A full wave reaches the same height on every row: the height is the curve's shape, not a measured size.",
    );
  });

  it("fits the measured budget beside the year ticks", () => {
    expect(GLANCE_HEIGHT_LABEL.length).toBeLessThanOrEqual(GLANCE_HEIGHT_LABEL_MAX_CHARS);
  });

  // CEILING (Codex r2, 2026-11-12): this is a SOURCE pin, not an accessibility or layout check.
  // Two rounds found the same class: a text match on CycleOverview.tsx can be dodged (an extra
  // aria-hidden wrapper, display:none, a per-row y scale) while every assertion passes. So it is
  // not patched further. What proves the label is visible and read is the rendered DOM on the
  // served page: the post-deploy in-page read (box > 0, no aria-hidden ancestor, clear of the
  // first tick), recorded on I-077. A harmless reorder of the pinned classes fails here loudly;
  // update the pin with it.
  it("is what the figure renders: label visible, sentence outside any aria-hidden wrapper", () => {
    const src = readFileSync(new URL("../components/CycleOverview.tsx", import.meta.url), "utf8");
    const label = src.match(/<span\s+data-glance-height-label[\s\S]*?\{GLANCE_HEIGHT_READING\}<\/span>/);
    expect(label).not.toBeNull();
    // The outer label span carries no aria-hidden; only the terse visible words do.
    expect(label![0].split(">")[0]).not.toMatch(/aria-hidden/);
    expect(label![0]).toMatch(/<span aria-hidden>\{GLANCE_HEIGHT_LABEL\}<\/span>/);
    expect(label![0]).toMatch(/<span className="sr-only">\{GLANCE_HEIGHT_READING\}<\/span>/);
    // No hidden ancestor (Codex r1): the label is the first child of the tick row's un-hidden flex
    // wrapper, BEFORE the aria-hidden tick container opens, and the figure itself is not hidden.
    expect(src).toMatch(
      /<div className="flex h-4 mt-1">\s*\{\/\*[\s\S]*?\*\/\}\s*<span\s+data-glance-height-label/,
    );
    expect(src.indexOf("data-glance-height-label")).toBeLessThan(
      src.indexOf('<div aria-hidden className="relative h-4 flex-1'),
    );
    expect(src.match(/<figure[^>]*>/)![0]).not.toMatch(/aria-hidden/);
  });
});

// I-048: the glance figure's visible verdict, counted from the cards' headlines.
// I-076 (2026-11-10): it names the one cycle with no data series, by the name its row shows.
// I-078 (2026-11-19): it counts PAIRINGS against this site's three-period rule. The old clause,
// "nine cannot be tested on the record that exists", was refuted by Codex as broader than the
// data: five of these periods cleared the gate on other cycles' records (the cross-grid panel).
describe("glanceVerdictLine", () => {
  it("states today's ten in words, counted from the card headlines, naming the one with no series", () => {
    expect(glanceVerdictLine(cycles)).toBe(
      "None is confirmed: nine pairings fall short of this site's three-period rule, and Turchin (50y) has no paired series.",
    );
  });

  it("names exactly the cycle whose card has no paired series, by its row name", () => {
    const noRecord = cycles.filter((c) => holdsUpCard(c)?.headline === NO_SERIES_HEADLINE);
    expect(noRecord).toHaveLength(1);
    expect(glanceVerdictLine(cycles)).toContain(`, and ${cycleTheorist(noRecord[0])} has no paired series.`);
    // Two Turchin cycles share the surname ("Peter Turchin" is the other), so the name must be
    // the row's own, qualifier included.
    expect(cycleTheorist(noRecord[0])).toBe("Turchin (50y)");
  });

  // Measured on production 2026-11-10 by setting candidate wordings in place: at 390x664 (the
  // first-screen size the line sits on) 118 characters held two lines with 33px to spare and 125
  // broke to a third ending at y=674, past the fold. Ceiling: a character count, not a rendered
  // width; a font change voids it (re-measure, see overviewReading.ts).
  it("fits the measured two-line budget at 390x664, stored or calibrated", () => {
    expect(glanceVerdictLine(cycles)!.length).toBeLessThanOrEqual(GLANCE_VERDICT_MAX_CHARS);
    expect(GLANCE_VERDICT_CALIBRATED.length).toBeLessThanOrEqual(GLANCE_VERDICT_MAX_CHARS);
  });

  // Codex r1 on 91fa65e: the assertions above call the function, so a figure that rendered other
  // text would still pass. Pin that the figure computes this line and paints it in its verdict
  // paragraph. Ceiling: a source pin; the rendered cases are in "the rendered figure" below.
  it("is what the figure renders", () => {
    const src = readFileSync(new URL("../components/CycleOverview.tsx", import.meta.url), "utf8");
    expect(src).toMatch(/const verdictLine = useMemo\(\(\) => glanceVerdictLine\(cycles\), \[cycles\]\);/);
    expect(src).toMatch(/data-glance-verdict[\s\S]{0,200}?>\s*\{verdictLine\}\s*<\/p>/);
  });

  it("drops a clause whose count is zero", () => {
    const paired = cycles.filter((c) => holdsUpCard(c)?.headline === NOT_TESTABLE_HEADLINE);
    expect(paired).toHaveLength(9);
    expect(glanceVerdictLine(paired)).toBe(
      "None is confirmed: nine pairings fall short of this site's three-period rule.",
    );
  });

  it("says nothing once any headline is not one of the two untested forms", () => {
    const today = cycles.map((c) => holdsUpCard(c)?.headline);
    expect(glanceVerdictFromHeadlines(today, cycles.map(cycleTheorist))).toBe(glanceVerdictLine(cycles));
    // One tested verdict, whatever it says: "none is confirmed" is no longer this rule's to state.
    expect(glanceVerdictFromHeadlines([...today.slice(1), "Tested — consistent"])).toBeNull();
    // A cycle with no card at all.
    expect(glanceVerdictFromHeadlines([...today, undefined])).toBeNull();
    expect(glanceVerdictFromHeadlines([])).toBeNull();
  });

  it("agrees in number in both clauses, and counts rather than names two or more", () => {
    expect(glanceVerdictFromHeadlines([NO_SERIES_HEADLINE, NO_SERIES_HEADLINE], ["A", "B"])).toBe(
      "None is confirmed: two have no paired series.",
    );
    expect(glanceVerdictFromHeadlines([NOT_TESTABLE_HEADLINE])).toBe(
      "None is confirmed: one pairing falls short of this site's three-period rule.",
    );
  });

  it("names one no-series cycle only when its name is given, else counts it", () => {
    expect(glanceVerdictFromHeadlines([NO_SERIES_HEADLINE], ["Somebody (9y)"])).toBe(
      "None is confirmed: Somebody (9y) has no paired series.",
    );
    expect(glanceVerdictFromHeadlines([NO_SERIES_HEADLINE])).toBe("None is confirmed: one has no paired series.");
    // The name is the no-series cycle's own, never a neighbour's.
    expect(glanceVerdictFromHeadlines([NOT_TESTABLE_HEADLINE, NO_SERIES_HEADLINE], ["X", "Y"])).toBe(
      "None is confirmed: one pairing falls short of this site's three-period rule, and Y has no paired series.",
    );
  });
});

// I-078 closeWhen: "On a calibrated chart the caption/verdict either says it speaks for the stored
// cycles (or drops the verdict), pinned by a test". The test fits sine and cosine at 1/P and uses
// no peak year, so only a changed PERIOD scopes; a moved peak leaves the stored reading right.
describe("a calibrated chart (I-078)", () => {
  const perez = cycles.find((c) => c.id === "perez")!;
  const at = (id: string, patch: Partial<(typeof cycles)[number]>) =>
    cycles.map((c) => (c.id === id ? { ...c, ...patch } : c));
  const periodOnly = at("perez", { period_years: 52 });
  const peakOnly = at("perez", { reference_peak_year: perez.reference_peak_year + 4 });
  const both = at("perez", { period_years: 52, reference_peak_year: perez.reference_peak_year + 4 });
  const reset = at("perez", { period_years: perez.period_years });

  it("Codex's case is real: at 52 years Perez's paired record clears the 3.0-period gate", () => {
    const row = JSON.parse(
      readFileSync(new URL("../../public/data/spectral/verdicts.json", import.meta.url), "utf8"),
    ).primary.find((r: { cycle_id: string }) => r.cycle_id === "perez");
    expect(row.span_years / perez.period_years).toBeLessThan(3);
    expect(row.span_years / 52).toBeGreaterThanOrEqual(3);
  });

  it("the line scopes the stored verdicts on a changed period, and only then", () => {
    expect(glanceVerdictLine(periodOnly)).toBe(
      "None is confirmed. These verdicts are for this site's own periods, not the periods you set.",
    );
    expect(glanceVerdictLine(both)).toBe(GLANCE_VERDICT_CALIBRATED);
    expect(glanceVerdictLine(peakOnly)).toBe(glanceVerdictLine(cycles));
    expect(glanceVerdictLine(reset)).toBe(glanceVerdictLine(cycles));
  });

  it("the caption drops its verdict on a changed period, and keeps it for a moved peak", () => {
    expect(glanceCaption(glanceVerdictLine(periodOnly), peaksMoved(cycles, periodOnly))).toBe("Theory shapes, not findings");
    expect(glanceCaption(glanceVerdictLine(both), peaksMoved(cycles, both))).toBe("Theory shapes, not findings");
    expect(glanceCaption(glanceVerdictLine(peakOnly), peaksMoved(cycles, peakOnly))).toBe("Peaks chosen · no cycle confirmed");
    expect(glanceCaption(glanceVerdictLine(reset), peaksMoved(cycles, reset))).toBe("Site's peaks · no cycle confirmed");
  });

  it("a drawn headline names the stored period on a changed period, and only on a paired cycle", () => {
    const drawn = periodOnly.find((c) => c.id === "perez")!;
    expect(periodChanged(drawn)).toBe(true);
    expect(shownHeadline(drawn)).toBe("Not testable on its paired record at this site's 55-year period");
    expect(shownHeadline(peakOnly.find((c) => c.id === "perez")!)).toBe(NOT_TESTABLE_HEADLINE);
    const unpaired = cycles.find((c) => holdsUpCard(c)?.headline === NO_SERIES_HEADLINE)!;
    expect(shownHeadline({ ...unpaired, period_years: unpaired.period_years + 7 })).toBe(NO_SERIES_HEADLINE);
  });

  it("a spoken row says whose period its verdict is for", () => {
    expect(overviewRowReading(periodOnly.find((c) => c.id === "perez")!)).toBe(
      " (52-year cycle). Not testable on its paired record at this site's 55-year period.",
    );
    expect(overviewRowReading(perez)).toBe(` (55-year cycle). ${NOT_TESTABLE_HEADLINE}.`);
  });

  // The rendered figure, not the helpers: what a reader sees and hears from CycleOverview itself
  // for each state (Codex r2: the helper assertions passed with the wiring broken).
  it("the rendered figure", () => {
    const render = (drawn: typeof cycles, moved: boolean) =>
      renderToStaticMarkup(
        createElement(CycleOverview, {
          cycles: drawn,
          startYear: 1600,
          endYear: 2050,
          detailBelow: false,
          onSelect: () => {},
          peaksMoved: moved,
        }),
      ).replace(/&#x27;/g, "'");
    const stored = render(cycles, false);
    expect(stored).toContain(">Site's peaks · no cycle confirmed<");
    expect(stored).toContain(`>${glanceVerdictLine(cycles)}<`);
    const changed = render(periodOnly, false);
    expect(changed).toContain(">Theory shapes, not findings<");
    expect(changed).toContain(`>${GLANCE_VERDICT_CALIBRATED}<`);
    expect(changed).toContain("Not testable on its paired record at this site's 55-year period.");
    const moved = render(peakOnly, true);
    expect(moved).toContain(">Peaks chosen · no cycle confirmed<");
    expect(moved).toContain(`>${glanceVerdictLine(cycles)}<`);
    expect(moved).not.toContain("at this site's");
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
