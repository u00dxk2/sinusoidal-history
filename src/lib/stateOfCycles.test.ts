import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { NextRequest } from "next/server";
import { GET } from "@/app/api/v1/state/route";
import api2026 from "./__fixtures__/api-v1-state-2026.json";
import { cycles } from "@/data/cycles";
import { dataSeries as series } from "@/data/series";
import { sineAtYear } from "@/lib/cycleMath";
import { peakYearsInRange, troughYearsInRange } from "@/lib/cycleRoutes";
import {
  STATE_FIRST_YEAR,
  cycleStateAtYear,
  formatCos,
  nextPeakYear,
  nextTroughYear,
  phaseReason,
  phaseReasons,
  stateOfCycles,
  stateYears,
  yearPosition,
  yearPositionSentence,
} from "./stateOfCycles";

describe("nextPeakYear / nextTroughYear", () => {
  it("is strictly after the asked year and at most one period away", () => {
    for (const cycle of cycles) {
      for (const year of [1600, 1900, 2026, cycle.reference_peak_year]) {
        const peak = nextPeakYear(cycle, year);
        const trough = nextTroughYear(cycle, year);
        expect(peak).toBeGreaterThan(year);
        expect(trough).toBeGreaterThan(year);
        // +1 tolerance for the integer-year rounding of fractional extrema.
        expect(peak - year).toBeLessThanOrEqual(cycle.period_years + 1);
        expect(trough - year).toBeLessThanOrEqual(cycle.period_years + 1);
      }
    }
  });

  it("lands on cosine extrema (within the integer-year grid)", () => {
    // Rounding an extremum to a whole year moves it at most 0.5y off-phase;
    // the worst case across the roster (period 30) is cos ≈ ±0.9945.
    for (const cycle of cycles) {
      expect(sineAtYear(cycle, nextPeakYear(cycle, 2026))).toBeGreaterThan(0.99);
      expect(sineAtYear(cycle, nextTroughYear(cycle, 2026))).toBeLessThan(-0.99);
    }
  });

  it("agrees with the extrema the cycle pages already derive", () => {
    for (const cycle of cycles) {
      const year = 2026;
      const horizon = year + cycle.period_years + 1;
      expect(peakYearsInRange(cycle, year + 1, horizon)).toContain(
        nextPeakYear(cycle, year)
      );
      expect(troughYearsInRange(cycle, year + 1, horizon)).toContain(
        nextTroughYear(cycle, year)
      );
    }
  });
});

describe("stateOfCycles", () => {
  it("returns every cycle, ascending by period, cos matching sineAtYear", () => {
    const state = stateOfCycles(2026);
    expect(state).toHaveLength(cycles.length);
    for (let i = 1; i < state.length; i += 1) {
      expect(state[i].period_years).toBeGreaterThanOrEqual(
        state[i - 1].period_years
      );
    }
    for (const entry of state) {
      const cycle = cycles.find((c) => c.id === entry.id)!;
      expect(entry.cos).toBeCloseTo(sineAtYear(cycle, 2026), 2);
      expect(entry.cos).toBeGreaterThanOrEqual(-1);
      expect(entry.cos).toBeLessThanOrEqual(1);
    }
  });
});

describe("yearPosition", () => {
  it("says what /state and /api/v1/state say, for every cycle", () => {
    for (const cycle of cycles) {
      for (const year of [2026, 2031, 2050]) {
        const entry = cycleStateAtYear(cycle, year);
        const pos = yearPosition(cycle, year);
        expect(pos.cos).toBe(formatCos(entry.cos));
        // The sentence names the next extremum the state entry names.
        const nextFirst =
          entry.phase === "peaking"
            ? entry.next_trough_year
            : entry.phase === "troughing"
              ? entry.next_peak_year
              : Math.min(entry.next_peak_year, entry.next_trough_year);
        expect(pos.next).toContain(String(nextFirst));
      }
    }
  });

  it("reads Dalio 2026 as the page's worked example", () => {
    const dalio = cycles.find((c) => c.id === "dalio")!;
    expect(yearPositionSentence(dalio, 2026)).toBe(
      "By this page's curve, 2026 sits at a peak (the curve tops out in 2025; cos +1.00). The next low falls around 2063."
    );
  });

  it("prints exactly one bracket per sentence, for every cycle and year", () => {
    for (const cycle of cycles) {
      for (let year = 2000; year < 2100; year += 1) {
        const s = yearPositionSentence(cycle, year);
        expect(s.match(/\(/g)).toHaveLength(1);
        expect(s).toMatch(/cos [+−]?\d\.\d\d\)/);
      }
    }
  });

  it("reaches every phase wording somewhere in a century", () => {
    const seen = new Set<string>();
    for (const cycle of cycles) {
      for (let year = 2000; year < 2100; year += 1) {
        seen.add(yearPosition(cycle, year).where.split(",")[0]!);
      }
    }
    expect([...seen].sort()).toEqual(
      ["at a low", "at a peak", "at the midline", "on the falling arm", "on the rising arm"]
    );
  });
});

describe("formatCos", () => {
  it("signs with a true minus and prints zero unsigned", () => {
    expect(formatCos(0.5)).toBe("+0.50");
    expect(formatCos(-0.09)).toBe("−0.09");
    expect(formatCos(0)).toBe("0.00");
  });
});

describe("series.json reader-facing text", () => {
  it("carries no backslash (a JSON `\\\\$` renders as a literal `\\$`)", () => {
    for (const s of series) {
      expect(s.short_description).not.toContain("\\");
      expect(s.name).not.toContain("\\");
    }
  });
});

describe("stateYears", () => {
  it("runs from the first year through the given current year", () => {
    expect(stateYears(2026)).toEqual([2026]);
    expect(stateYears(2028)).toEqual([2026, 2027, 2028]);
    // A clock earlier than first publication still yields the first year.
    expect(stateYears(2020)).toEqual([STATE_FIRST_YEAR]);
  });
});

describe("I-013 is wording only: the API and the frozen 2026 edition do not move", () => {
  // David, 2026-10-03: "Wording only for 2026. Keep the band; make the line say why."
  // The fixture is production's /api/v1/state?year=2026 body, saved before the change.
  it("GET /api/v1/state?year=2026 returns the whole body production served before the change", async () => {
    // The route handler itself, so the envelope (site, year, formula, note) is
    // pinned too, not only the cycles array (Codex r3-1).
    const req = { nextUrl: new URL("https://sinusoidalhistory.com/api/v1/state?year=2026") } as NextRequest;
    const body = await (await GET(req)).json();
    expect(body).toEqual(api2026);
  });

  it("public/data/state-2026.csv is the edition as frozen (sha256, LF-normalised)", () => {
    const csv = readFileSync(join(process.cwd(), "public", "data", "state-2026.csv"), "utf8");
    const sha = createHash("sha256").update(csv.replace(/\r\n/g, "\n")).digest("hex");
    expect(sha).toBe("092db81290a44f4dfadcee2024cc89dee6d6d7f37ad4786c6ab326562cdb6e92");
  });
});

describe("phaseReason (I-013: the word near a turning point says why)", () => {
  const byId = (id: string) => {
    const c = cycles.find((x) => x.id === id);
    if (!c) throw new Error(id);
    return c;
  };

  it("explains the 2026 rows the cold walker tripped on, from the period", () => {
    expect(phaseReason(byId("huntington"), 2026)).toBe(
      "2 years before its peak, outside the peaking band: 1.8 years either side, 3% of a 60-year cycle."
    );
    expect(phaseReason(byId("khaldun"), 2026)).toBe(
      "3 years before its peak, inside the peaking band: 3.6 years either side, 3% of a 120-year cycle."
    );
    expect(phaseReason(byId("turchin"), 2026)).toBe(
      "6 years after its peak, outside the peaking band: 4.5 years either side, 3% of a 150-year cycle."
    );
    // The trough falls at 2027.5; the row's "next trough" prints it rounded (Codex r1-2).
    expect(phaseReason(byId("perez"), 2026)).toBe(
      "1.5 years before its trough at 2027.5 (shown as 2028), inside the troughing band: 1.65 years either side, 3% of a 55-year cycle."
    );
  });

  it("decides inside/outside from the label at a rounded band edge (Codex r1-1)", () => {
    // Huntington's peak band is ±1.8y around 1968. At 1969.799 the label is
    // peaking, at 1969.801 falling; both distances print as 1.8.
    const h = byId("huntington");
    expect(phaseReason(h, 1969.799)).toMatch(/^1\.8 years after its peak, inside /);
    expect(phaseReason(h, 1969.801)).toMatch(/^1\.8 years after its peak, outside /);
  });

  it("calls a distance that prints as 0 'At its' (Codex r1-3)", () => {
    expect(phaseReason(byId("huntington"), 1968.001)).toMatch(/^At its peak, inside /);
  });

  it("is silent away from a turning point", () => {
    expect(phaseReason(byId("strauss_howe"), 2026)).toBeNull();
    expect(phaseReason(byId("modelski"), 2026)).toBeNull();
  });

  it("never contradicts the label: inside the band exactly when the word is peaking/troughing", () => {
    for (let year = 1900; year <= 2100; year += 1) {
      const reasons = phaseReasons(year);
      for (const entry of stateOfCycles(year)) {
        const text = reasons[entry.id];
        const turning = entry.phase === "peaking" || entry.phase === "troughing";
        if (turning) expect(text, `${entry.id} ${year}`).not.toBeNull();
        if (!text) continue;
        const m = text.match(
          /^(?:At its \w+|([\d.]+) years? \w+ its \w+(?: at [\d.]+(?: \(shown as \d+\))?)?), (inside|outside) the \w+ band: ([\d.]+) years? either side, 3% of a \d+-year cycle\.$/
        );
        expect(m, text).not.toBeNull();
        const tag = `${entry.id} ${year}: ${text} / ${entry.phase}`;
        expect(m![2] === "inside", tag).toBe(turning);
        // The printed numbers agree with the word (equal only at a rounded edge).
        const dist = m![1] === undefined ? 0 : Number(m![1]);
        const band = Number(m![3]);
        if (turning) expect(dist <= band, tag).toBe(true);
        else expect(dist >= band, tag).toBe(true);
      }
    }
  });
});
