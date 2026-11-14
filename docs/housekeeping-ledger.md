# Housekeeping Ledger: sinusoidal-cycles

Itches noticed but not done. The housekeeping pass reads this first, then adds and subtracts: deletion counts as improvement. Add a dated line when you notice something; move it to Done when handled.

**Format:** `- [ ] YYYY-MM-DD: <the itch, one line> (noticed during <context>)`

Findings live in review docs, not here. This is for the stuff too small to rank.

## Open

- [ ] 2026-10-10: nothing stops a new page from writing inline JSON-LD with a raw `JSON.stringify` instead of `jsonLdHtml`. Two source-text guards were tried and both were defeated in review, so none shipped; the shape that would hold is a test that renders each page with a hostile payload (noticed during the 2026-10-10 repo-health wave)
- [ ] 2026-11-07: `lucide-react` is a dependency with 0 imports (knip 6.44.2 + `git grep`). Its one mention is `components.json` `iconLibrary`, which the shadcn CLI reads, so the 2026-11-13 refactor left it: a config reference fails that night's removal rule. Decide whether the shadcn icon setting stays; if not, drop both together (noticed during the 2026-11-07 refactor; re-filed 2026-11-13)
- [ ] 2026-11-07: `scripts/check-brush-widened.mjs:8` imports playwright by an absolute `file:///C:/dev/skylark/sinusoidal-cycles/node_modules/playwright/index.mjs` URL, so it runs only from that one checkout path, and knip reports it as an unlisted package "file". Every other script imports `"playwright"`. Left on 2026-11-13 because I-071's read names this script (next read 2026-11-18); change it after that row moves (noticed during the 2026-11-07 refactor, configured knip run)
- [ ] 2026-11-07: knip still flags exports that were deliberately left: `CARD_HEADERS` (ogCardCache.ts, serves /og), `PERIOD_PROVENANCE_BANNED` (periodProvenanceBan.ts, the I-080 instrument while that row monitors), and the shadcn API exports `tabsListVariants`, `Tooltip`, `TooltipTrigger`, `TooltipContent`. The first two can drop `export` once I-080 closes (noticed during the 2026-11-07 refactor)
- [ ] 2026-11-13: configured knip runs only by hand. Adding it to `.github/workflows/ci.yml` is CI workflow logic, out of scope for a refactor night; it is the instrument that would have caught the d3 phantom pair and the two dead shadcn files months earlier (noticed during the 2026-11-13 refactor)
- [ ] 2026-11-13: `src/lib/buildTsconfigScope.test.ts` checks tsconfig's root file list, not the transitive program, so an app file importing an excluded test would pass it; `src/lib/listedImports.test.ts` proves a package is listed, not that it resolves in a production install (Codex r1 on 3a8435d named both) (noticed during the 2026-11-13 refactor)
- [ ] 2026-11-13: `src/app/(app)/cycles/[id]/page.tsx` is still about 880 lines after `CurveFigure` moved out; the rest is the `CyclePage` body, one JSX tree, which cannot be split without logic edits (noticed during the 2026-11-13 refactor)

## Done

- [x] 2026-11-13: refactor session. Characterization tests for `clampCycleOverride`, the URL-param trust boundary (52b27ee); a test of the resolved build tsconfig scope (e2f4ac2); the d3 subpackages the code imports are now listed and the unused `d3` umbrella is gone, with `src/lib/listedImports.test.ts` guarding the class (65bd748, struck the 2026-11-07 d3 itch); `CurveFigure` moved from `cycles/[id]/page.tsx` to `src/components/CycleCurveFigure.tsx` (3a8435d).

- [x] 2026-11-07: refactor session. `vitest.config.ts` became `vitest.config.mts`, clearing Vite's "ESM syntax in a file loaded as CommonJS" warning (11664cf). Six internal-only exports lost `export` (fcc7e72). The unused shadcn `ui/toggle.tsx` and `ui/scroll-area.tsx` were deleted (5ddaa5c). `knip.json` now names `scripts/*.mjs` as entry points, so knip stops listing the 24 hand-run scripts as unused files and `playwright` as an unused devDependency (unused files 26 -> 0 between the unconfigured and configured runs).

- [x] 2026-11-07: struck the 2026-10-10 itch saying `AGENTS.md`'s CI paragraph omits the dependency audit. It no longer applies: the paragraph opens with "runs a dependency audit (`npm audit --omit=dev --audit-level=critical`, before `npm ci`)", and `README.md` § Start here item 7 names it too (refactor census, 2026-11-07).

- [x] 2026-10-10: repo-health wave. Added `SECURITY.md`, this ledger, a CI dependency audit step (runtime packages, critical severity), and one escaping helper for the three inline JSON-LD sites (`src/lib/jsonLdHtml.ts`, unit-tested).
