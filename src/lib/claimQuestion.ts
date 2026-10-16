// A claim page answers one searched question about a theory (cycles.json `question`), first
// screen and lifted text alike. The first is /cycles/dalio, "Is Ray Dalio's Big Cycle peaking?"
// (2026-10-15 night round): Search Console showed every Dalio query landing there, ranked 49-60,
// and nothing on the page answered in the searcher's words.
//
// No new claim sentence is written here. The answer is assembled from strings the page already
// shows: the verdict (holdsUpCard, the share card's words) FIRST, then the curve's position
// (yearPositionSentence) with the page's own "not the theorist's forecast" clause. Verdict first
// on every lifted surface, because an answer engine quoting the first sentence must never quote
// "2026 sits at a peak" alone (manager review 638840f1), and two cold walks read the curve's
// peak as confirmation when it came before the verdict (I-047, I-048).

import type { Cycle } from "@/data/types";
import type { ClaimAnswer } from "@/lib/cycleRoutes";
import { holdsUpCard } from "@/lib/holdsUp";
import { yearPositionSentence } from "@/lib/stateOfCycles";

/** The clause the cycle page puts after its position sentence, verbatim. */
export const NOT_FORECAST = "That is a position of this construction, not the theorist's forecast.";

/**
 * The question, the meta description and the answer text, or null for a cycle that is not a
 * claim page (or has no verdict card to lead with). The description is the verdict alone: with the
 * position sentence it runs past the snippet's ~155 characters, and a cut there would keep "sits at
 * a peak" while losing the clause that says it is not a forecast.
 */
export function claimAnswer(cycle: Cycle, year: number): ClaimAnswer | null {
  if (!cycle.question) return null;
  const card = holdsUpCard(cycle);
  if (!card) return null;
  const verdict = `${card.headline}. ${card.detail}`;
  return {
    question: cycle.question,
    description: verdict,
    text: `${verdict} ${yearPositionSentence(cycle, year)} ${NOT_FORECAST}`,
  };
}
