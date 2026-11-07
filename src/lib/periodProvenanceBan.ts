// I-080 claims-pass row 1 (2026-11-07). The site's stored periods mix theorists' own figures,
// midpoints of stated ranges and values this site derived: round 5 item 8
// (docs/fact-check-2026-08-24-round-5.md:18) found that Modelski (a range), Schlesinger (derived),
// Khaldun, Strauss-Howe and Dalio give no explicit period in years in the primary text. So no
// served sentence may call a period "the theory's own / stated / exact stated / declared" period.
// One list, shared by i080Claims.test.ts (source surfaces) and cutPeriodCopy.test.ts (rendered
// cycle pages), so the two bans cannot drift apart.
//
// Ceiling: a phrase ban. A new overclaim in other words passes; "the period this site uses for
// the theory" is the wording the surfaces now carry, and the tests pin it on each one.
export const PERIOD_PROVENANCE_BANNED: readonly RegExp[] = [
  /theory'?s (own|exact|declared)( stated)? period/i,
  /\b(its own|their|his|her|the exact) stated period/i,
  /theory'?s stated (cycle|period)/i,
  /\bdeclared period/i,
  /rhythm the theory names/i,
];

/** Every banned phrase found in `text`, after JSX wraps and HTML entities are flattened. */
export function periodProvenanceHits(text: string): string[] {
  const flat = text
    .replace(/\{" "\}/g, " ")
    .replace(/&apos;|&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
  return PERIOD_PROVENANCE_BANNED.flatMap((re) => flat.match(re)?.[0] ?? []);
}
