# Daily report — sinusoidal-cycles — 2026-11-26 (Thursday, MT)

## BLUF

**P1 picks I-087's home-chart batch for P3.** The home page is the only page that drew clicks in the last four weeks (2 of 2, Search Console page-only). Its masthead is in the design pass, but the chart under it (`Viz`: the Facets and Calibrate tabs, glance figure, caption, height label and verdict line) still uses the faces from before the pass. So one screen carries two type systems. P3 moves the chart's faces into the system under the existing flag, changes no words, and re-measures the phone folds at 320, 360 and 390 on a built copy before any deploy. The packet is under Recommendation and waits for the manager review.

## What changed

- Nothing has shipped today. Live is 026fbc1d (in sync), CI on ci.yml is GREEN at HEAD.
- Section 0: primer 2026-11-25 read. Listener up (restart marker 2026-11-26T15:52:05Z, hello, replay 0). Codex GREEN (the kickoff's probe line, 15:55Z). Harness 2.1.332, fleet UNIFORM (28 of 28), installed SAME. Due gates: 0 due on/before 2026-11-26 (snapshot `tmp/due-gates-snapshot.json`). Product-love rotation: no cycle picks this lane today (exit 0). Cards: 0 for this lane, 0 new; the portfolio rider 312499ee is about machine memory and does not touch this lane's choice.
- Recs yesterday: one. I-089 (narrow the "August 2026" database date) was executed, live at b9ccb23a, row closed (close 265d75f7).

## Recommendation

### P1 selection packet

- **Outcome + item:** the home chart moves into the design system (I-087, the SCREENS.md NEXT batch, "home chart faces first"). The user problem is HYPOTHESIS: a reader who arrives at the home page sees a polished masthead over a chart in a different type system, and the instrument looks like two sites stuck together. The chart is the thing the reader came to check.
- **Evidence:**
  - OBSERVED · `node C:/dev/skylark/sinusoidal-cycles/scripts/gsc-read.mjs --start 2026-10-29` (read 2026-11-26) · Search Console, page-only grouping, sc-domain:sinusoidalhistory.com · window 2026-10-29..2026-11-26 · TOTAL 71 impressions, 2 clicks; `/` has 11 impressions and both clicks (position 2.3); `/cycles` 35 impressions, 0 clicks. Limits: Search Console lags about 2-3 days, the page list was truncated at the route's row limit (the TOTAL line is whole), and it cannot see a share.
  - OBSERVED · `docs/SCREENS.md:21` · the home chart row reads NEXT 2026-11-24: "the words are settled… The chart itself is still in the pre-pass faces". `docs/DESIGN.md:92`: the flag does not touch `Viz`.
  - OBSERVED · `--run I-087` (2026-11-26, exit 0, sidecar `continuity/read-outputs/I-087.txt`) · live, 320x568 · 13 of 13 entry pages answer on the first screen; `/` 49px spare, `/cycles/perez` 0px. This is the baseline the batch must keep.
  - OBSERVED · `docs/DESIGN.md:63` · a font change voids the measured character budgets (phone glance caption 33 characters at 320, height label 23, verdict line 118). They are re-measured on a real build.
  - MISSING · any real-user reading of the home chart. No client analytics by standing choice; the bar reads UNMEASURED (`docs/evangelism-bar.md:30`). No reader has written to the site.
  - HYPOTHESIS · a consistent instrument face makes the "someone checked" moment more credible. Untested.
- **Permission:** lane-owned design work inside a pass David's rollout already put live behind `NEXT_PUBLIC_DESIGN_PASS_VARIANT=a`, rollback tested 2026-11-17. No David card names this row. Faces only, no words, so there is no claims pass. If any sentence moves, it gets a Codex claims pass at `-c model_reasoning_effort=high`, with the banner workdir checked.
- **Why not I-086 instead:** I-087 is buildable today. The surface, the flag scope and the fold instrument already exist. I-086 (the slider-label wrap) lives inside the same `Viz` and is folded into this batch if `SliderRow` is touched, with its own before/after leg at 320x568. I-071 (two zoom decisions) stays on 12-02.
- **Next action (improve):** scope the chart's own faces under the flag. List every font family, size and uppercase-tracked class inside `Viz` and its children, then map each to DESIGN.md's type rules (display face for labels and figures with tabular figures, no monospace furniture, no tracked uppercase, body text 16px or larger where it is prose). First command:

  ```
  git -C C:/dev/skylark/sinusoidal-cycles grep -n -E "font-mono|font-display|uppercase|tracking-|text-\[1[0-5]px\]|text-xs|text-sm" -- src/components/Viz.tsx src/components/CycleFacet.tsx src/components/FacetView.tsx src/components/FacetTimeAxis.tsx src/components/CycleOverlay.tsx src/components/CycleOverview.tsx src/components/NowSummaryPanel.tsx src/components/TimeRangeBrush.tsx src/components/ui/slider.tsx src/components/ui/tabs.tsx
  ```

- **Acceptance (observable):**
  1. With the flag on, the chart's text renders in the pass's two families (Plex Sans Condensed 600 and Plex Serif), read from computed styles in a browser on a built copy. With the flag off, the chart is unchanged.
  2. Rendered chart text is byte-identical before and after, as a sorted multiset of lines read in the browser. The rendered-text gate is blind to `Viz`, so this read replaces it.
  3. `scripts/check-entry-folds.mjs` reports 13 of 13 at 320x568, 360x560 and 390x664 on the built copy, then live. `/` keeps 0px or more spare (49px today).
  4. The glance caption, height label and verdict line are re-measured against their 33, 23 and 118 budgets in the new faces and fit at 320.
  5. CI is green, the deploy row reads live and in sync, and a signed-out GET of `/` carries `data-design-variant="a"`.
- **Delivery and encounter checks:** delivery is the check-deployed-sha-drift in-sync read, plus the live fold read at three sizes and a live computed-style read of one chart label. Encounter: no instrument sees a reader. The only signal is the next Search Console page-only read on `/`, readable as click-through at about 100 impressions, and `/` is at 11 a month today, so that is months away. Reported as unmeasured.
- **USER-FACING: yes.** Expected paths: `src/app/globals.css` (new flag-scoped rules) and `src/app/(app)/page.tsx` or `src/components/Viz.tsx` (the flag-scoped attribute on the chart wrapper). Possibly `src/components/CycleFacet.tsx`, `FacetTimeAxis.tsx`, `TimeRangeBrush.tsx` and `ui/slider.tsx` if a class must change rather than be overridden. Also `docs/SCREENS.md` and `docs/DESIGN.md` (internal). No markdown mirror changes, because no prose page moves.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: none. Read: `dated gates due today` (0 due on/before 2026-11-26; snapshot taken 2026-11-26). I-086, I-087 and I-071 are dated 2026-12-02. I-087 is the choice; I-086 rides with it only if `SliderRow` is touched.
  - (b) owed child rows: none. Read: "rows owed to you in skylark-site's ledger" (0 of 855).
  - (c) CROSSED state reads: none. Read: every state read in the kickoff header. Stale-actionable 0 of 8 (7d). missingLinkedCommits swept nothing (0 of 0), which is not a clean read and printed no threshold.

## State Appendix

- Prior-day retro findings (569b6955): 4 tagged "still on discipline". The one that bears on today is "a check that passes for the wrong reason". The fold read and the rendered-text gate are both blind to parts of `Viz`. So acceptance 1 and 2 are browser reads on the built copy, and each new check is shown failing once before it is trusted.
- Kickoff correction noted: W-007 is closed (05ba5297, 2026-11-25). It was not re-run.
