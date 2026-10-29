// A claim page answers one searched question about a theory (cycles.json `question`), first
// screen and lifted text alike. The first is /cycles/dalio, "Is Ray Dalio's Big Cycle peaking?"
// (2026-10-15 night round): Search Console showed every Dalio query landing there, ranked 49-60,
// and nothing on the page answered in the searcher's words.
//
// The answer is assembled from strings the page shows: the verdict (holdsUpCard, the share
// card's words) FIRST, then what the drawing is (claimNotEvidence). Verdict first on every
// lifted surface, because two cold walks read the curve's peak as confirmation when it came
// before the verdict (I-047, I-048).
//
// No year's position is stated (I-061, David 2026-10-21: "one wave per cycle, stop at today").
// Until then the answer went on to say where 2026 sat on the drawn wave, under a not-a-forecast
// clause, and walks read that position as agreement wherever the clause stood (I-052).

import type { Cycle } from "@/data/types";
import { cycleTheorist, type ClaimAnswer } from "@/lib/cycleRoutes";
import { periodCutAtToday } from "@/lib/cycleMath";
import { holdsUpCard } from "@/lib/holdsUp";

/**
 * What a claim page's drawing is, in the verdict box and the answer text. A period that has
 * not ended is cut at today, so "one period" would be false for it (Turchin in 2026, I-065):
 * that branch says "a wave … up to today" instead. It is no longer than the whole-period
 * sentence on purpose: the whole verdict box must fit the 320x568 first screen
 * (check-holds-up-line), and a 70-character-longer first version pushed Turchin's box to
 * 605px on 10-29. It gives no count of years drawn, because with the peak at the period's
 * midpoint a count says where the present sits on the wave, which no page states (I-061).
 */
export function claimNotEvidence(cycle: Cycle, currentYear = new Date().getUTCFullYear()): string {
  const drawing = periodCutAtToday(cycle, currentYear)
    ? `This page draws a wave around the peak year this site uses for ${cycleTheorist(cycle)}'s cycle, up to today.`
    : `This page draws one period of a wave around the peak year this site uses for ${cycleTheorist(cycle)}'s cycle.`;
  return `${drawing} It is not a forecast, and not evidence for or against the cycle.`;
}

/**
 * The question, the meta description and the answer text, or null for a cycle that is not a
 * claim page (or has no verdict card to lead with). The question rides in the description so a
 * consumer lifting the description alone knows what the verdict answers (Codex r1 on 5dd93d2, LOW).
 */
export function claimAnswer(
  cycle: Cycle,
  currentYear = new Date().getUTCFullYear()
): ClaimAnswer | null {
  if (!cycle.question) return null;
  const card = holdsUpCard(cycle);
  if (!card) return null;
  const verdict = `${card.headline}. ${card.detail}`;
  return {
    question: cycle.question,
    description: `${cycle.question} ${verdict}`,
    text: `${verdict} ${claimNotEvidence(cycle, currentYear)}`,
  };
}
