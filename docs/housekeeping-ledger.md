# Housekeeping Ledger: sinusoidal-cycles

Itches noticed but not done. The housekeeping pass reads this first, then adds and subtracts: deletion counts as improvement. Add a dated line when you notice something; move it to Done when handled.

**Format:** `- [ ] YYYY-MM-DD: <the itch, one line> (noticed during <context>)`

Findings live in review docs, not here. This is for the stuff too small to rank.

## Open

- [ ] 2026-10-10: `AGENTS.md` (the CI paragraph) still lists CI as lint, typecheck, test and build; it does not name the dependency audit step added today. Left alone because that paragraph sits in a mirrored block (noticed during the 2026-10-10 repo-health wave)
- [ ] 2026-10-10: nothing stops a new page from writing inline JSON-LD with a raw `JSON.stringify` instead of `jsonLdHtml`. Two source-text guards were tried and both were defeated in review, so none shipped; the shape that would hold is a test that renders each page with a hostile payload (noticed during the 2026-10-10 repo-health wave)

## Done

- [x] 2026-10-10: repo-health wave. Added `SECURITY.md`, this ledger, a CI dependency audit step (runtime packages, critical severity), and one escaping helper for the three inline JSON-LD sites (`src/lib/jsonLdHtml.ts`, unit-tested).
