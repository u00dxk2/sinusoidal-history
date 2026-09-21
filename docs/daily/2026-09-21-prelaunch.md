---
product: sinusoidal-cycles
date: 2026-09-21
lifecycle_stage: pre-launch
north_star_metric: organic search clicks to sinusoidalhistory.com — the first signal that a human, not a crawler, arrived (retention and word-of-mouth are structurally unmeasurable here; the site carries no analytics by design)
north_star_value: 0
north_star_status: measured-zero
north_star_classification: expected-zero
last_deploy: adca2e9
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "The change a reader should see today: on a phone, the home page opens on the chart. The first cycle curve is inside the first screen now; it used to start 777px below the fold, behind the hero, the whole state panel and the editor's note."
---

# Daily — sinusoidal-cycles — 2026-09-21

## BLUF

**FIRST ACTION.** Walk `/methods` at 390x664 as a cold arrival. It is the one entry page that has never had this read, and `docs/key-user-flows.md` step 1 records it as an entry page on Search Console evidence rather than on assumption. Capture what a phone shows without scrolling, then ask the same question as an exit code:

```
node scripts/capture-frame.mjs https://sinusoidalhistory.com/methods docs/frames/2026-09-22-methods-390.png 390 664
node scripts/measure-fold.mjs https://sinusoidalhistory.com/methods 390 664 'section[aria-label="In brief"]'
```

Open the PNG before writing a word about it. `fullPage` is false on purpose: a full-page screenshot cannot show a fold, which is where this week's three fold defects each hid. The narrow question is whether a searcher who lands here reaches the **In brief** answer — what the site is and the "See the chart →" link in `src/app/(app)/methods/page.tsx` — without scrolling.

**Today's ship, and what a reader sees.** On a phone the home page now opens on the chart. Commit `adca2e9` re-orders the blocks inside `Viz.tsx` so the tabs and facet charts come first, and it is deployed and serving: `node scripts/measure-fold.mjs https://sinusoidalhistory.com/ 390 664 '[data-facet-id] svg[role="img"]'` printed `is cut — 777px below the fold` at exit 1 before the deploy and `is fully visible, 104px of room to spare` at exit 0 after it. Not one reader-facing word changed — the same command family's text instrument is under Inputs, because the obvious one is blind here.

**DON'T-TOUCH.** The frozen snippet surface — titles, meta descriptions, H1s and URLs, on every page — until W-001's 2026-10-07 read, whose whole value is that what searchers were shown did not move underneath them. Layout and body copy are in scope, which is all today's ship used. Also leave `scripts/measure-fold.mjs`'s 390x664 default, its no-selector code path, and its deliberately-red 360x560 case alone: `node scripts/measure-fold.mjs https://sinusoidalhistory.com/cycles/dalio 360 560` is left failing on purpose, because a 560px visible viewport is shorter than that page's title plus description can clear. And leave the `Viz` block order and the comment above it: a tidy that moves the summary panel back to the top re-opens a defect measured on two form factors.

## What changed

- **`adca2e9` — the home page opens on the chart.** The DOM order inside `Viz.tsx` went from panel → note → charts → brush to charts → note → brush → panel, moved in the DOM rather than with CSS `order`, so reading and focus order match what is seen. The editor's convergence note now sits between the curves it comments on and the brush its own text points at ("Drag the time-range below"), so the move cost no prose. Before it, the hero plus the 616px "State of the cycles" panel plus the 225px note pushed the first cycle curve to 1381px on a 390x664 phone — 2.1 screens down — and to 1113px on a 1440x900 desktop, below the fold on both. The H1 is still "Ten cycles, one axis." The same commit gives `scripts/measure-fold.mjs` an optional 4th argument, a CSS selector; fixes a keyboard-focus regression the move created; and updates `docs/key-user-flows.md` steps 2-3 to the new order.
- **`21a136c` — the production 390x664 frame** the reached-claim rests on, captured after the deploy landed, because a claim resting on a frame nobody can re-open is not checkable evidence.
- **`4841246` — `I-001` closed on its own closeWhen, and `I-003` opened for its twin.** Detail under Outputs.

## Inputs (controllable)

- **The fold instrument now takes a selector, and the old call path was regression-checked rather than assumed.** With no selector `measure-fold.mjs` measures the cycle-page verdict block exactly as before: `node scripts/measure-fold.mjs https://sinusoidalhistory.com/cycles/dalio` printed `OK: the verdict is fully visible, 44px of room to spare`, the same string as on 2026-09-20. With a selector it answers any surface, which is what made today's before/after an exit code instead of a judgment: the after-read printed `top 500px`, `bottom 560px (fold 664px)` and `OK: … 104px of room to spare`.
- **The obvious text gate is blind to this change, and that was proven rather than assumed.** `node scripts/check-rendered-text.mjs diff` reads GREEN at 25 lines, but the chart is client-rendered, so the static HTML it compares contains none of it. The positive control: a word change made inside `Viz` and then reverted did not register either. The instrument that can see the chart is the rendered `main` innerText line multiset — snapped from production and from the built page, sorted and compared, it is 123 lines and 82 distinct on both sides, with 0 lines only-in-either across the two snapshots.
- **Curve counts, not impressions, are what the ship moved.** Counted in the browser across all ten `[data-facet-id] svg[role="img"]` boxes against the fold — the same selector `measure-fold.mjs` reads, applied to every facet rather than the first — curves fully inside the first screen went from 0 of 10 to 1 of 10 at 390x664, and from 0 of 10 to 2 of 10 at 1440x900. Baseline: `node scripts/measure-fold.mjs https://sinusoidalhistory.com/ 390 664 '[data-facet-id] svg[role="img"]'` run against production before the deploy, read 2026-09-21, widened to all ten boxes at each of the two viewports — the same page state, not a remembered one. The honest extreme is stated and not gated: at 360x560 the first facet's header clears the fold and its curve does not.
- **Four frames are committed, so every claim above can be re-opened.** `docs/frames/2026-09-21-home-390.png` is the before; `-390-after.png`, `-1440-after.png` and `-360-after.png` are the built page in `adca2e9`; `-390-after-prod.png` is production, in `21a136c`.
- **A keyboard bug was found inside the ship by adversarial review, in two rounds.** With the summary panel below the chart, activating one of its rows scrolled to the facet but left keyboard focus in the panel below it; `Viz.tsx` now moves focus to that facet's header button. Three Codex adversarial reviews ran on the working tree: pass 1 needs-attention on the focus regression, pass 2 needs-attention because re-picking the already-open cycle focused an off-screen header (`preventScroll` was set, and `FacetView`'s scroll effect keys only on the focused id), pass 3 approve. A browser keyboard test covers entry from the Facets tab, entry from the Calibrate tab, and re-picking the open cycle; it reads RED on the pre-ship build and OK on production for each of those.
- **The pre-POST gate refused two posts today, both correctly, and nothing was sent either time.** It refused the first P3 post because the test receipt was stale, and the first P4 post because a "the ship is live" sentence carried no quoted production read. Both were caught by `--validate` and fixed in one pass — which is the cheap outcome, and also the evidence that running the receipt and quoting the read in the right order costs less than discovering them at the gate.
- **Delivery evidence on this lane is a content read, because the sha reader declines it.** `node ../skylark-site/scripts/check-deployed-sha-drift.mjs --service sinusoidal-history` returns `NOT-APPLICABLE-BY-REGISTRY` (commit-trigger service) — a decline, not a pass. What stands in is the production `measure-fold` read quoted in the BLUF plus the committed production frame.

## Outputs (lagging)

- **North star: 0 organic clicks, and no read was run today on purpose.** The standing figure is the 2026-09-19 15:09Z read, `node scripts/gsc-read.mjs --start 2026-09-10`, which returned `TOTAL clicks=0 impressions=19 position=21.0` over the property's pages for that window. Search Console lags about three days, so a same-day re-read returns byte-identical totals; W-001's 2026-10-07 date exists to stop exactly that waste.
- **`I-001` closed six days early, on its own closeWhen rather than on its date.** The roster slug `sinusoidal-cycles` resolved to no workspace entry, which silently skipped five kickoff state reads and `agent-status`'s verify-receipt gate. skylark-site's `3b23160c4` landed the alias: `node ../skylark-site/scripts/read-listener-strand.mjs` now exits 0 with `SLUG MATCH … 0 consecutive no-loop warnings`, where it exited 2 `NO_LANE_ROOT` yesterday, and today's posts print a verify-receipt verdict.
- **Its twin is not fixed, and is rowed as `I-003`, dated 2026-09-27, owner skylark-site.** `node ../skylark-site/scripts/check-next-primer-exists.mjs` exits 2 with `sinusoidal UNRESOLVABLE … no REPORT_CONFIGS (or off-roster) row for sinusoidal` — the same class in a different registry, failing under the id `sinusoidal` where `I-001` failed under `sinusoidal-cycles`.
- **`I-002` stays open, dated 2026-09-27, and it is this lane's own.** This repo's `docs/daily-config.md` declares no `primer:handoff` record, so the SessionStart banner reports the primer as having no first action. Its `onTrigger` says to read the validator in `../skylark-site/src/lib/cc-primer-first-action-blocks.mjs` first, because a declared-but-invalid record is worse than none.
- **`W-001` and `W-002` both stay monitoring, and today's ship touched neither.** `W-001` is dated 2026-10-07 and asks whether the query set grew past the five Dalio-dominated rows and whether average position moved off ~21; the freeze it protects held, since the ship changed layout only. `W-002` is dated 2026-09-27 and asks whether a phone reader understands a cycle's confidence tag now the glossary follows the roster on `/cycles`; today's work was on `/` and does not bear on it. **Its notes were corrected today:** they claimed the index tag "now carries `title={confidenceGloss(...)}`", which was false when written — that tooltip was tried and reverted inside 2026-09-20's P4, and `grep -rn "confidenceGloss" src/` finds no `title` attribute anywhere, while `src/app/(app)/cycles/page.tsx:238-249` records the revert. So nothing shipped with that row and the read is of a bare tag; the `onTrigger` clause that told a future reader not to answer from "the desktop hover state" was corrected in the same pass, since there is no hover state. Found by reading the row against the code rather than trusting it. Sibling sweep, same turn: grep of `continuity/items.json` for `WHAT SHIPPED` / `now carries` / `title={confidenceGloss` returns this row only.
- **Engineering zero holds.** `gh api "repos/u00dxk2/sinusoidal-history/dependabot/alerts?state=open&per_page=100" --paginate --jq "length"` returned `0` at 2026-09-21 10:24 MT — that is every open Dependabot alert on the repo, not a filtered subset. `node ../skylark-site/scripts/check-engineering-zero.mjs --project sinusoidal-cycles` returned `lane sinusoidal-cycles: 0 finding(s), 0 unreadable, nothing to waive`, exit 0, at 2026-09-21 10:25 MT. No waiver is in force. The same run reports 2 findings across the 25 lanes it swept, which is a note about other lanes and not this lane's verdict.

## Recommendation

**Tomorrow's first action is `/methods` at 390x664**, per the BLUF. Three consecutive cold reads at that viewport have each found a real fold defect — `/cycles/<slug>` on 09-19, `/cycles` on 09-20, `/` today — every one on a surface that looked fine on every desktop, and `/methods` is the remaining entry page that has never had the read.

**The next piece of today's work is fitting all ten curves onto a phone's first screen, and it is not a quick edit.** Today put one curve there; the great version of this page's first screen is a compact ten-row overview a phone reader can take in at once. The Overlay tab cannot be that: it is desktop-only (`hidden sm:inline-flex` in `Viz.tsx`), so a phone shows one or two facets at most. This needs its own design pass — it is the carried mobile-overlay decision from the 2026-08-24 journey walk, not a follow-up commit to `adca2e9`.

**Do not re-read Search Console before 2026-10-07.** The instrument lags about three days, so a read before then returns the same totals the 2026-09-19 read already gave, and W-001's question is not click-through any more: it asks whether the query set grew and whether average position moved. Running it early costs a phase and answers nothing.

**Nothing is blocked on David**, and no board card is open for this lane. `I-003` needs an edit in skylark-site's report registry; it is relayed to the orchestrator and is not David's.

## State Appendix

### Section 0 (pre-flight, run at P1)

- **Primer:** PRESENT (`docs/cold-starts/2026-09-21.md`), banner read first. Tomorrow's is written and committed at `docs/cold-starts/2026-09-22.md`.
- **Listener:** alive and its own strand is readable again. `node ../skylark-site/scripts/read-listener-strand.mjs` at 2026-09-21T16:32:47Z: `SLUG MATCH`, last SSE hello `2026-09-21T16:22:18.137Z`, last SESSION START `2026-09-21T15:14:07.652Z`, `0 consecutive no-loop warnings` in the 512 KB tail window it read — exit 0, where the same command exited 2 `NO_LANE_ROOT` yesterday. That change is `I-001`'s closeWhen, met.
- **Codex:** GREEN at the P1 probe, quoted from the kickoff stamp rather than re-run in this pass; the stamp records `codexCalls: 0 (probed-declined)` across every phase today. Three adversarial reviews executed on the working tree, detailed under Inputs.
- **CI + drift (P0 gate):** PASSED. `node ../skylark-site/scripts/check-ci-status.mjs --wait --workflow ci.yml --sha adca2e9ce4c3fed41c5bdb86352577b042a9b7c6` returned `GREEN after 3 poll(s), 56s`. Drift is `NOT-APPLICABLE-BY-REGISTRY` — a decline, not a pass; the production read that stands in is under Inputs.
- **Tests:** `node ../skylark-site/scripts/verify-with-receipt.mjs -- npm test` at HEAD returned `Test Files 11 passed (11) · Tests 86 passed (86)`. Lint clean on the changed files.
- **Due gates:** `node ../skylark-site/scripts/check-due-gates-dispositioned.mjs --print` returned `0 gate(s) due on/before 2026-09-21`, PASS, 6 ledger rows swept — nothing due before 2026-09-27.
- **Recs from 2026-09-20:** both disposed. The home-page cold-arrival walk at 390x664 **executed and shipped** as `adca2e9`; "nothing left to decide on W-001 before its date" **held** — no Search Console read was run today.

### Commits

`adca2e9` (the ship: DOM re-order, the selector argument, the keyboard fix, the flow-doc update) · `21a136c` (the production evidence frame) · `4841246` (`I-001` closed, `I-003` opened) · `b6203dc` (changelog, tomorrow's primer, and the AGENTS.md paragraph recording that the text gate cannot see `Viz`).

### Hygiene reads at close

- Dead references: `node ../skylark-site/scripts/check-doc-references.mjs` opened this pass at FAIL with one dead reference — `continuity/items.json` cited `scripts/sky.mjs`, a file whose *absence* is the finding that line records, so no edit could make it resolve. Cleared with the checker's own by-design-absence marker (`dead-ref-ok:`) rather than by rewording a true sentence. Re-run at close: `PASS — 0 dead references · 2 forward-ref (not yet due) · 33 unique paths across 6 doc(s)` — run with this report staged, because the checker resolves against HEAD plus the index and reads an untracked file as dead, which is what it did on the run before the `git add`. Both forward-refs are frames not yet owed: `docs/frames/2026-09-22-methods-390.png`, cited by tomorrow's primer as the first action's output, and `docs/frames/2026-09-27-cycles-390.png`, cited by `W-002`.
- Primer path: `node ../skylark-site/scripts/check-next-primer-exists.mjs` exits 2 UNRESOLVABLE. This is `I-003`, not a pass — so the primer path named above is asserted from this lane's own convention and is not confirmed by the checker.
