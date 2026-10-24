// A count spelled as a sentence opens with it ("Ten long-wave cycles…"), derived from the data so
// it cannot go stale when a cycle is added (I-006: the og card shipped "Eight" once, the same
// class as SITE_DESCRIPTION, which siteConfig.test.ts pins). Twelve and under are spelled; past
// that the digits read better than "Thirteen" on a card and are always right.

const WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
];

/** "Ten" for 10; "13" for 13. Capitalised, for the start of a sentence. */
export function countWord(n: number): string {
  return Number.isInteger(n) && n >= 0 && n < WORDS.length ? WORDS[n] : String(n);
}

/** "ten" for 10, for the middle of a sentence. */
export function countWordLower(n: number): string {
  return countWord(n).toLowerCase();
}

/** The main share card's standfirst under "Do the cycles hold up?". */
export function ogMainStandfirst(cycleCount: number): string {
  return `${countWord(cycleCount)} long-wave cycles of history, on one shared axis.`;
}

// The rest of I-006 (2026-10-11 day session): every surface where the count is a claim. The cycle
// NAMES in the two lists below stay hand-written (they are prose, and "Turchin (twice)" is not a
// rule); countWords.test.ts fails when a cycle id has no name in either list.

/** The poster's editorial standfirst. */
export function posterStandfirst(cycleCount: number): string {
  return `${countWord(cycleCount)} long-wave cycles of history, each calibrated to a single documented peak. Drawn together to ask whose curve fits whose century — and where every cycle's reach exceeds its grasp.`;
}

/** The home page's desktop dek. */
export function homeDek(cycleCount: number, pairedCount: number): string {
  return `Khaldun, Kondratiev, Huntington, Schlesinger Jr., Perez, Turchin (twice), Dalio, Strauss-Howe, Modelski — on one 1600–2050 axis, each drawn as at most one period of a pure sinusoid around one documented peak, cut at today; ${countWordLower(pairedCount)} of the ${countWordLower(cycleCount)} carry a paired empirical series for stress-testing.`;
}

/**
 * The home page's spectral sentence, up to "The protocol lives under". The clause after the
 * dash is the finding only while NO pairing reaches the gate; once one does, it would contradict
 * the count beside it, so it is dropped rather than left standing (manager review 6edfdb02).
 */
export function homeGateLine(eligible: number, total: number): string {
  const verb = eligible === 1 ? "reaches" : "reach";
  const count = `Each pairing also faces a pre-registered spectral test: ${eligible} of the ${total} ${verb} its 3.0-period evidence gate`;
  return eligible === 0
    ? `${count} — none of these records is long enough to test, which is itself the finding.`
    : `${count}.`;
}

/** The /cycles index title. */
export function cyclesIndexTitle(cycleCount: number): string {
  return `The ${countWordLower(cycleCount)} cycles`;
}

/** The /cycles index meta description (the search snippet). */
export function cyclesIndexDescription(cycleCount: number): string {
  return `${countWord(cycleCount)} long-wave cycles of history - Schlesinger Jr., Turchin's fathers-and-sons, Kondratiev, Perez, Huntington, Dalio, Strauss-Howe, Modelski, Khaldun, Turchin's secular cycle - each with its period, reference peak, sourcing, and paired data series.`;
}
