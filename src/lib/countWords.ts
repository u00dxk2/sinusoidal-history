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

/** The main share card's standfirst under "State of the cycles". */
export function ogMainStandfirst(cycleCount: number): string {
  return `${countWord(cycleCount)} long-wave cycles of history, on one shared axis.`;
}
