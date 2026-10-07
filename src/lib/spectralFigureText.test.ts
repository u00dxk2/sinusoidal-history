import { describe, it, expect } from "vitest";
import { spectralDraws, spectralPrimary, type SpectralVerdictRow } from "@/lib/spectral";
import { figureTargetBandLine, protocolCaptionLead } from "@/lib/spectralFigureText";

const kondratiev = spectralPrimary.find((v) => v.cycle_id === "kondratiev")!;

describe("spectral figure text", () => {
  it("names the target period and the band from the verdict row", () => {
    expect(figureTargetBandLine(kondratiev)).toBe(
      "Target period 54 years · Insufficient data — no test possible · 1.4 of 3.0 required periods",
    );
  });

  it("never describes a test as run on a record too short to test", () => {
    for (const v of spectralPrimary.filter((r) => !r.eligible)) {
      const lead = protocolCaptionLead(v, spectralDraws);
      expect(lead.startsWith("No test was run: this record covers")).toBe(true);
      expect(lead).toContain(`${v.cycles_covered.toFixed(1)} of the 3.0 full periods`);
      expect(lead).not.toMatch(/^Pre-registered/);
    }
  });

  it("keeps the protocol sentence on an eligible record", () => {
    // No primary record is eligible in this freeze, so the eligible arm is a
    // constructed row; it must read exactly as the caption did before I-021.
    const eligible: SpectralVerdictRow = { ...kondratiev, eligible: true, state: "NO_SIGNIFICANT_TARGET_POWER" };
    expect(protocolCaptionLead(eligible, 99999)).toBe(
      "Pre-registered harmonic-regression test at the exact stated period against an AR(1) red-noise null (99,999 bootstrap draws), gated on the record covering at least 3.0 full periods.",
    );
    expect(figureTargetBandLine(eligible)).toBe("Target period 54 years · No significant target power");
  });
});
