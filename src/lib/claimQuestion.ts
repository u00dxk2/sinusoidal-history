// A claim page answers one searched question about a theory (cycles.json `question`), first
// screen and lifted text alike. The first is /cycles/dalio, "Is Ray Dalio's Big Cycle peaking?"
// (2026-10-15 night round): Search Console showed every Dalio query landing there, ranked 49-60,
// and nothing on the page answered in the searcher's words.
//
// No new claim sentence is written here. The answer is assembled from strings the page already
// shows: the verdict (holdsUpCard, the share card's words) FIRST, then the curve's position
// led by "not <theorist>'s forecast" (claimPositionSentence, I-052). Verdict first
// on every lifted surface, because an answer engine quoting the first sentence must never quote
// "2026 sits at a peak" alone (manager review 638840f1), and two cold walks read the curve's
// peak as confirmation when it came before the verdict (I-047, I-048).

import type { Cycle } from "@/data/types";
import { cycleTheorist, type ClaimAnswer } from "@/lib/cycleRoutes";
import { holdsUpCard } from "@/lib/holdsUp";
import { yearPositionBody } from "@/lib/stateOfCycles";

/** The clause a non-claim cycle page puts after its position sentence, verbatim. */
export const NOT_FORECAST = "That is a position of this construction, not the theorist's forecast.";

/**
 * A claim page's position sentence: the not-a-forecast clause FIRST, in plain words, then the
 * position. The I-051 walk read "2026 sits at a peak" as "yes, it's peaking right now" with the
 * clause last (I-052), and it did not understand "this construction"; NOT_FORECAST cannot simply
 * move to the front, because its "That" would point at nothing (manager review 2af4adc6).
 */
export function claimPositionSentence(cycle: Cycle, year: number): string {
  return `This page draws a wave, not ${cycleTheorist(cycle)}'s forecast: on that wave, ${yearPositionBody(cycle, year)}`;
}

/**
 * The question, the meta description and the answer text, or null for a cycle that is not a
 * claim page (or has no verdict card to lead with). The description is the question, then the
 * verdict, and no position: with the position sentence it runs past the snippet's ~155 characters,
 * and a cut there would keep "sits at a peak" while losing the clause that says it is not a
 * forecast. The question rides in it so a consumer lifting the description alone knows what the
 * verdict answers (Codex r1 on 5dd93d2, LOW).
 */
export function claimAnswer(cycle: Cycle, year: number): ClaimAnswer | null {
  if (!cycle.question) return null;
  const card = holdsUpCard(cycle);
  if (!card) return null;
  const verdict = `${card.headline}. ${card.detail}`;
  return {
    question: cycle.question,
    description: `${cycle.question} ${verdict}`,
    text: `${verdict} ${claimPositionSentence(cycle, year)}`,
  };
}
