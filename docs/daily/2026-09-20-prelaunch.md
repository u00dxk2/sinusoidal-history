---
product: sinusoidal-cycles
date: 2026-09-20
lifecycle_stage: pre-launch
north_star_metric: organic search clicks to sinusoidalhistory.com — the first signal that a human, not a crawler, arrived (retention and word-of-mouth are structurally unmeasurable here; the site carries no analytics by design)
north_star_value: 0
north_star_status: measured-zero
north_star_classification: expected-zero
last_deploy: 2d693ac
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "The change a reader should see today: on a phone, the page that lists the ten cycles now shows the cycles. It used to open with a heading and two paragraphs about them, and not one entry was visible without scrolling."
---

# Daily — sinusoidal-cycles — 2026-09-20

## BLUF

**FIRST ACTION.** Walk the home page `/` at 390x664 as a cold arrival — the same read that has now found a fold defect on two consecutive days, pointed at the site's front door and its one interactive surface. Capture what a phone shows without scrolling:

```
node scripts/capture-frame.mjs https://sinusoidalhistory.com/ docs/frames/2026-09-21-home-390.png 390 664
```

Open the PNG before writing a word about it. `fullPage` is false on purpose: a full-page screenshot cannot show a fold, which is the trap both of this week's defects hid in. The question to answer is narrow — does a phone reader reach the chart, the thing this site exists to show, or does the fold cut before it?

**Today's ship, and what a reader sees.** `/cycles` now opens with the one-line verdict — none of the ten theories has a record long enough to check — and then the entries themselves (`2d693ac`, CI green, serving). Measured this morning at 390x664 from production: header, eyebrow, H1, a nine-line paragraph on how the curves are drawn, six lines of tag glossary, and **zero of the ten cycles**. An index whose index was entirely below the fold.

**DON'T-TOUCH.** The frozen snippet surface — titles, meta descriptions, H1s and URLs, on every page — until W-001's 2026-10-07 read. Its whole value is a comparison: position and query set only mean something if what searchers are shown has not changed underneath them. Layout and body copy are in scope, which is what today's ship used; the snippet and the URL are not. Also do not loosen `scripts/measure-fold.mjs`'s 390x664 default or its deliberately-red small case: `node scripts/measure-fold.mjs https://sinusoidalhistory.com/cycles/dalio 360 560` printed `RED: the verdict is cut — 177px below the fold` at exit 1 when it was armed on 2026-09-19, and it is left red on purpose — a 560px visible viewport is shorter than that page's title plus description can clear. The 390x664 default is a measured device viewport, not a guess, and the gap between it and the 844px a phone reports is the entire defect class this week.

## What changed

- **`2d693ac` — the ten cycles reach a phone's first screen.** Re-ordered `/cycles` under the H1: the spectral verdict sentence with "How the test works →", the ten entries, then "Does any of them hold up?" with its table, then the how-they-are-drawn paragraph and the confidence-tag glossary. The verdict table moved *below* the roster rather than above it because its Verdict column is off-screen at 390 (min-width 36rem) — leading with it would have refilled the fold with a horizontally-clipped table instead of with cycles. No reader-facing words changed.
- **`2fb6785` — the production frame the reached-claim rests on**, captured after the deploy landed, because a claim resting on a frame nobody can re-open is not checkable evidence.
- **`cc1dfda` — `I-001` opened**, the workspace-slug gap that blinds five of this lane's kickoff state reads and silently skips `agent-status`'s receipt gate. Carried unrowed for three days; the fix is skylark-site's and is relayed.
- **`f4a72ba` — `W-001` converted and `W-002` opened.** Detail under Outputs.

## Inputs (controllable)

- **The fold is now an instrument, not an impression, and it has found two defects in two days.** `scripts/measure-fold.mjs` answers the per-cycle-page question; `scripts/capture-frame.mjs` plus a human read answers the per-page one. Today's sequence — capture production, read the frame, re-order, rebuild, re-capture, compare — took one phase and produced evidence anyone can re-open. The fold instrument's red arm, for the record it is cited against in the BLUF: `measure-fold.mjs` at 360 560 prints `RED: the verdict is cut — 177px below the fold` and exits 1, while 390 664 prints `OK: the verdict is fully visible, 44px of room to spare` and exits 0. Both arms were exercised on the same surface on 2026-09-19, which is why the check is trusted rather than merely green.
- **Frames at both extremes on today's ship, not just the median.** 1440x900: the verdict leads, three entries visible, spacing did not collapse at `sm` and above. 360x560, the honest minimum: the verdict sentence and the first entry's name clear the fold, its description does not — better than the zero entries it replaces, and stated rather than hidden. All four frames are committed under `docs/frames/`.
- **Two adversarial reviews ran before the commit, and both earned their place.** `/code-review medium` found that a code comment claimed `check-rendered-text` proves a re-order safe; it does not, it is an *order* gate and reports RED on exactly this change. It also found the new section had no accessible name. Both fixed pre-commit. `codex-companion adversarial-review --scope working-tree` returned `approve` and independently reproduced the 216-line multiset identity.
- **The "same words" proof needed a different instrument than the obvious one.** `check-rendered-text diff` went RED at line 11, correctly. What proves a re-order is the line MULTISET: `snap` production and the built page, sort, compare — 216 lines and 166 distinct on both sides, identical.
- **A tooltip was tried and reverted inside P4, on measurement.** `title={confidenceGloss(...)}` on the index tag is hover-only, so it does nothing for the phone reader the open question is about, and the extra element split the line in `check-rendered-text`'s extraction (`30y · peak 1970 ·` / `Narrative`), perturbing this page's text baseline permanently. Reverted; the reason is recorded in the component so nobody re-tries it blind.

## Outputs (lagging)

- **North star: 0 organic clicks, and that number is expected rather than disappointing.** The last read (`node scripts/gsc-read.mjs --start 2026-09-10`, run 2026-09-19 15:09Z) returned `TOTAL clicks=0 impressions=19 position=21.0`. No new read today: Search Console lags ~3 days, so a same-day re-read returns byte-identical totals, which is the waste W-001's date exists to prevent.
- **`W-001` converted today rather than left to expire.** The waits gate asks whether a data-wait's denominator can fill by its own read date. At the measured ~2.7 impressions/day it projects to ~68 by 2026-10-07 against the row's floor of 100, so it cannot. The gate's remedy is re-point or convert, never re-date. Click-through stops being the row's question as of today; the 10-07 read is re-pointed to the two questions answerable at n≈68 — did the query set grow beyond the five Dalio-dominated rows, and did average position move off ~21 — and the date itself is unchanged. CTR reopens as a fresh row only if average position moves under 20.
- **`W-002` opened, dated 2026-09-27.** Today's re-order moved the confidence-tag glossary below the roster, so a reader now meets a tag up to ten times before its written definition on that page. The row records what the cost actually is: `src/app/(app)/cycles/[id]/page.tsx:247-253` renders the full gloss on **every** per-cycle page, which is the destination each index entry already links to — so the tag is defined one click away, not nowhere. The genuinely open question is touch-only comprehension, and it is a judgment rather than an exit code; the row says so.
- **Engineering zero holds.** `gh api "repos/u00dxk2/sinusoidal-history/dependabot/alerts?state=open&per_page=100" --paginate --jq "length"` → `0`, read after the last push. `node ../skylark-site/scripts/check-engineering-zero.mjs --project sinusoidal-cycles` → `lane sinusoidal-cycles: 0 finding(s), 0 unreadable, nothing to waive`. No waiver in force.

## Recommendation

**Tomorrow's first action is the home page at 390x664**, per the BLUF. Two consecutive cold reads at that viewport have each found a real defect on a surface that looked fine on every desktop and in every full-page screenshot; the front door has not had that read, and it carries the chart this site exists for.

**Do not extend W-001 again.** If the 2026-10-07 read lands under 100 impressions — and at the measured rate it will, around 68 — the row converts to the questions answerable at that sample size. That is written into the row rather than left to be decided under pressure on the day, and as of today the conversion is already applied rather than merely pre-registered.

**Nothing is blocked on David**, and no board card is open for this lane. `I-001` needs an edit in skylark-site's workspace registry; it is relayed to the orchestrator and is not David's.

## State Appendix

### Section 0 (pre-flight, run at P1)

- **Primer:** PRESENT (`docs/cold-starts/2026-09-20.md`), banner read first. The kickoff's own primer read was UNREADABLE for the `I-001` slug reason, so PRESENT here is this lane's read, not the composer's.
- **Listener:** SSE alive. Own file `tmp/.bus-listen.err`, newest restart marker `2026-09-20T14:29:33.082Z pid 22184`, `SESSION START … project=sinusoidal-cycles`, `hello` 14:29:32Z, `replay-complete … replayed 0`. `read-listener-strand.mjs` exits 2 NO_LANE_ROOT — the absence of a read, not a dead listener.
- **Codex:** GREEN, quoted from the kickoff stamp (machine-level exec 2026-09-20T14:32:35.860Z, SPAWN PROVEN fd-backed), not re-run. `codexCalls: 0 (probed-declined)` across every phase today.
- **CI + drift (P0 gate):** PASSED. `check-ci-status --repo .` → `GREEN — 1 completed non-scheduled success(es) for HEAD 534f2776d3` at P1, and again `GREEN … for HEAD 2d693aceab` on the ship. Drift: `NOT-APPLICABLE-BY-REGISTRY` — a decline, not a pass; the liveness read that stands in is `check-rendered-text diff` of the built page against production → `GREEN: identical visible text (216 lines)`.
- **Due gates:** `0 gate(s) due on/before 2026-09-20`, PASS, 4 ledger rows swept at close.
- **Harness:** running 2.1.278 · fleet UNIFORM (26 of 26 panes) · installed 2.1.278 (SAME).
- **Recs from 2026-09-19:** both disposed — the `/cycles` cold-arrival walk **executed and shipped** as `2d693ac`; "do not extend W-001 again" **applied early**, as the conversion above.

### Commits

`cc1dfda` (I-001 opened) · `2d693ac` (the ship) · `2fb6785` (the production evidence frame) · `f4a72ba` (W-001 converted, W-002 opened, the reverted tooltip's reason recorded).

### Hygiene reads at close

- Dead references: `node ../skylark-site/scripts/check-doc-references.mjs` → `PASS — 0 dead references · 33 unique paths across 6 doc(s)`, after fixing one: `continuity/items.json` cited `src/data/cc-workspace.json` as though it lived in this repo. Sibling sweep, same turn: Grep for `src/data/cc-workspace\.json` across `continuity/` found 3 occurrences, all three re-pointed to `../skylark-site/src/data/cc-workspace.json`, re-run clean.
- Primer path: `node ../skylark-site/scripts/check-next-primer-exists.mjs` → exit 2 **UNRESOLVABLE**, `no REPORT_CONFIGS (or off-roster) row for sinusoidal`. This is a second instance of `I-001`'s class in a different registry — the cc-workspace lookup fails under `sinusoidal-cycles`, this one fails under `sinusoidal` — and it is recorded on that row. So P5 step 6 is not machine-verifiable on this lane today; the primer path below is asserted from this lane's own convention, not confirmed by the checker.
