# Housekeeping Ledger: sinusoidal-cycles

Itches noticed but not done. The housekeeping pass reads this first, then adds and subtracts: deletion counts as improvement. Add a dated line when you notice something; move it to Done when handled.

**Format:** `- [ ] YYYY-MM-DD: <the itch, one line> (noticed during <context>)`

Findings live in review docs, not here. This is for the stuff too small to rank.

## Open

- [ ] 2026-10-10: nothing stops a new page from writing inline JSON-LD with a raw `JSON.stringify` instead of `jsonLdHtml`. Two source-text guards were tried and both were defeated in review, so none shipped; the shape that would hold is a test that renders each page with a hostile payload (noticed during the 2026-10-10 repo-health wave)
- [ ] 2026-11-07: `lucide-react` is a dependency with 0 imports (knip 6.44.2 + `git grep`; its only mention is `components.json` `iconLibrary`, which the shadcn CLI reads). Not removed: the incident guard refused `npm uninstall --package-lock-only` in the refactor worktree because its node_modules is a junction to the main checkout. Remove it from the main checkout, where the install lives (noticed during the 2026-11-07 refactor)
- [ ] 2026-11-07: `d3` is listed as a dependency and imported nowhere, while `d3-scale`, `d3-shape` and `d3-selection` are imported (TimeRangeBrush, CycleOverview, CycleOverlay, CycleFacet, hooks) without being listed. They resolve only because `d3` pulls them in. The fix is to list the three and drop `d3` + `@types/d3` (adding `@types/d3-scale`/`-shape`/`-selection`). That is a dependency change, so it was out of scope that night (knip "unlisted" + "dependencies") (noticed during the 2026-11-07 refactor)
- [ ] 2026-11-07: `scripts/check-brush-widened.mjs:6` imports playwright by an absolute `file:///C:/dev/skylark/sinusoidal-cycles/node_modules/playwright/index.mjs` URL, so it runs only from that one checkout path, and knip reports it as an unlisted package "file". Every other script imports `"playwright"` (noticed during the 2026-11-07 refactor, configured knip run)
- [ ] 2026-11-07: knip still flags exports that were deliberately left: `CARD_HEADERS` (ogCardCache.ts, serves /og), `PERIOD_PROVENANCE_BANNED` (periodProvenanceBan.ts, the I-080 instrument while that row monitors), and the shadcn API exports `tabsListVariants`, `Tooltip`, `TooltipTrigger`, `TooltipContent`. The first two can drop `export` once I-080 closes (noticed during the 2026-11-07 refactor)

## Done

- [x] 2026-11-07: refactor session. `vitest.config.ts` became `vitest.config.mts`, clearing Vite's "ESM syntax in a file loaded as CommonJS" warning (11664cf). Six internal-only exports lost `export` (fcc7e72). The unused shadcn `ui/toggle.tsx` and `ui/scroll-area.tsx` were deleted (5ddaa5c). `knip.json` now names `scripts/*.mjs` as entry points, so knip stops listing the 24 hand-run scripts as unused files and `playwright` as an unused devDependency (unused files 26 -> 0 between the unconfigured and configured runs).

- [x] 2026-11-07: struck the 2026-10-10 itch saying `AGENTS.md`'s CI paragraph omits the dependency audit. It no longer applies: the paragraph opens with "runs a dependency audit (`npm audit --omit=dev --audit-level=critical`, before `npm ci`)", and `README.md` § Start here item 7 names it too (refactor census, 2026-11-07).

- [x] 2026-10-10: repo-health wave. Added `SECURITY.md`, this ledger, a CI dependency audit step (runtime packages, critical severity), and one escaping helper for the three inline JSON-LD sites (`src/lib/jsonLdHtml.ts`, unit-tested).
