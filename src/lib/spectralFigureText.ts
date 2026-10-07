import { SPECTRAL_STATE_LABELS, type SpectralVerdictRow } from "@/lib/spectral";

/**
 * Words that sit beside the spectral-verdict figure on /cycles/<slug>.
 *
 * Both are built from the frozen verdict row, never retyped, because the figure
 * itself (public/data/spectral/<id>.svg) is frozen with the manifest and cannot
 * be edited to say them.
 */

/**
 * The figure's target period and band, in the words the verdict header above
 * the figure already uses. Shown with the figure below lg, where the sideways
 * scroller cuts the drawn subtitle and band off on arrival ("target pe",
 * "INSUFFI"; cold walk 2026-10-03 P11, I-021).
 */
export function figureTargetBandLine(v: SpectralVerdictRow): string {
  const band = v.eligible
    ? SPECTRAL_STATE_LABELS[v.state]
    : `${SPECTRAL_STATE_LABELS[v.state]} · ${v.cycles_covered.toFixed(1)} of 3.0 required periods`;
  return `Target period ${v.period_years} years · ${band}`;
}

/**
 * The first sentence(s) of the protocol caption under the figure. On a record
 * too short to test it says outright that no test was run: the old caption
 * described the test and its bootstrap draws on every page, which a cold reader
 * took for a test that had run on this record (cold walk 2026-10-07, step 1a).
 */
export function protocolCaptionLead(v: SpectralVerdictRow, draws: number): string {
  const drawsText = draws.toLocaleString("en-US");
  if (v.eligible) {
    return `Pre-registered harmonic-regression test at the exact stated period against an AR(1) red-noise null (${drawsText} bootstrap draws), gated on the record covering at least 3.0 full periods.`;
  }
  return `No test was run on this record: it covers ${v.cycles_covered.toFixed(1)} of the 3.0 full periods the pre-registered test requires, so the spectrum in the figure is descriptive only. Had the record qualified, the test would be a harmonic regression at the exact stated period against an AR(1) red-noise null (${drawsText} bootstrap draws).`;
}
