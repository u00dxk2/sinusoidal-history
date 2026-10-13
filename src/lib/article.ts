/**
 * The indefinite article for a number as it is spoken: "an 84-year", "an 11-year",
 * "an 18-year", but "a 110-year" ("a hundred and ten") and "a 54-year".
 * Only the leading group of digits is spoken first, so 110 and 180 take "a".
 * Moved here from cycleRoutes.ts on 2026-10-13, which said "An 110-year" on Modelski's
 * search snippet; the cycle page and /state wrote "a 84-year" with no helper at all.
 */
export function indefiniteArticle(n: number): "a" | "an" {
  const digits = String(Math.abs(Math.trunc(n)));
  const lead = digits.slice(0, digits.length % 3 || 3);
  if (lead.startsWith("8") || lead === "11" || lead === "18") return "an";
  return "a";
}

/** "an 84-year", "a 54-year". */
export function aYear(n: number): string {
  return `${indefiniteArticle(n)} ${n}-year`;
}
