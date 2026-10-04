# sinusoidal-cycles — 2026-10-04 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** from a cycle page, a phone reader reaches that cycle's Calibrate view in one tap, and the curve and r are on screen together. **Item:** I-022 (open, P3, lane-owned).

**The user problem, in the walker's words** (W-003 cold walk, 2026-10-03, synthetic, N = 1, `docs/walks/2026-10-03-w003.md`, "The single worst thing"): "Getting to 'Calibrate' for the cycle I was reading, on the phone. The cycle page has no Calibrate control; the way in is one link ('OPEN IN THE CHART →') seven screens down. That link drops you on the chart page below the Facets/Calibrate tabs, so the control you came for is off-screen above you." It is a synthetic walker's quote, not a real user's.

**What a user will see differently:** each of the nine paired cycle pages gets a "Calibrate this cycle" link in its "Peak calibration" section, next to the prose about the reference peak. One tap opens the chart with the Calibrate tab open on that cycle, scrolled so that the curve, the peak slider and r share one screen.

### Section 0

- **Primer:** `docs/cold-starts/2026-10-03.md` (written yesterday, round 2). No `2026-10-04.md` exists.
- **First action:** `check-state-phone.mjs https://sinusoidalhistory.com` reads **142/142 PASS**, so round 2's /state reason lines hold on production.
- **git:** `pull --ff-only` → "Already up to date". HEAD `618feea` = origin.
- **Listener:** 🟢 SSE alive (the SessionStart hook relaunched it, pid 36484, hello 15:50:48Z, 0 replayed). The loop is armed by a `ScheduleWakeup` call, and waker ranks 1-3 are running.
- **Codex:** GREEN, from the `[codex-probe]` line on this prompt (15:48:36Z). Not used at P1, because there is no diff yet.
- **CI:** `check-ci-status --workflow ci.yml` → GREEN for `618feeade2` (1 success, 0 failures).
- **Deploy drift:** `check-deployed-sha-drift --service sinusoidal-history` → NOT-APPLICABLE-BY-REGISTRY: the service is on the `commit` autoDeploy trigger, so this checker declines to judge it. It is not a pass. The lane's own delivery read is the production check above, 142/142, served by the round-2 build. (`--service sinusoidal-cycles` matched no service; the Render name is `sinusoidal-history`.)
- **Harness:** running 2.1.289 · fleet UNIFORM (26 of 26) · installed 2.1.289 (SAME).
- **Cycle rotation:** exit 0, "no product-love cycle picks this lane today (4 cycle(s) rotate over 23 lanes); run the normal P3".
- **Due gates:** `--snapshot` → "0 gate(s) due on/before 2026-10-04" (taken once, `tmp/due-gates-snapshot.json`).
- **Board:** `answered-cards` → no waiting, answered or pending-verify cards.
- **Recs yesterday:** no `## Recommendation` block in `docs/daily/2026-10-03-prelaunch.md`. Its round-2 "What remains" lines, each with a disposition:
  - Card c55395fc dismissal: ruled, it is the orchestrator's.
  - I-021 (the "Swipe" cue for mouse readers): carrying, still dated 2026-10-07, not selected.
  - `next start` outliving TaskStop: standing local note (memory `feedback_next_start_orphan`), applied today whenever the build is served.
  - The `render-put-secret.mjs` cancel leg: the orchestrator's, not a lane row.
- **Retro (10-03 r2), one finding that bears on this:** "a check written from a measurement inherits its looseness" (still on discipline). The new check legs below assert the landing against the viewport height and the r box, both measured independently of the link's own markup. They do not read back a value the page computes for itself.

### Evidence

- **OBSERVED, W-003 cold walk P3 and its single worst thing** (2026-10-03, synthetic, N = 1, iPhone 15 390x664): 4 taps, 1 drag and 3 scrolls from the cycle page to a drag. Curve and r were "never on screen together". The wrong-cycle part shipped 10-03 (`25c90b2`); this row is the rest.
- **OBSERVED, measured on production today** (`tmp/measure-calibrate-entry.mjs`, Playwright, /cycles/schlesinger-jr, touch emulated at the phone sizes):

  | size | page height | "Open in the chart" at | `?tab=calibrate&focus=` lands at | curve top / r bottom on arrival | curve top → r bottom |
  |---|---|---|---|---|---|
  | 390x664 | 5,452px | 5,021px (7.6 screens) | scrollY 0, Calibrate on schlesinger_jr | 1,096 / 1,643 (both below the screen) | 547px |
  | 320x568 | 6,313px | 5,845px (10.3 screens) | scrollY 0, same | 1,158 / 1,705 | 547px |
  | 1440x900 | 4,300px | 3,918px | scrollY 0, same | 667 / 1,201 | 534px |

  The present link (`/?focus=<id>`) lands on the Facets tab, at scrollY 936 (390) or 900 (320), with the tab strip 278px above the top of the screen. That matches the walk.
- **What the numbers say:** the URL state already opens Calibrate on the right cycle (`?tab=calibrate&focus=<id>`, nuqs). What is missing is a link that asks for it, placed where the page talks about calibration, and a landing scrolled to the curve. Curve top to r bottom is 547px, which fits a 664px screen and a 568px one (21px spare). So no layout change is needed for the fit, only for the landing.
- **MISSING:** real-user evidence. The site has no client analytics (a standing choice), and the lane has no evangelism-bar or evangelism-evidence file, so there is no bar metric to read.

### Permission, and the freezes

- **Decision class:** lane-owned product work (I-022 owner sinusoidal-cycles, "Nothing and nobody" in waitingFor). No card is open on it.
- **Its `waitJustification` dates it 2026-10-07**, but its own `loadBearing` reads "nothing outside the lane blocks it", and the unWait is "pick it up in a product round on or after 2026-10-07". It is a lane-chosen date with nothing funded behind it, so it yields: picking it up today re-dates it by doing it.
- **W-001 freeze (titles, meta, H1s, URLs, to 2026-10-07):** untouched. This adds one body link and one client-side scroll; no title, meta, H1 or URL changes. The new link points at `/?tab=calibrate&focus=<id>`, a query state of an existing URL. It is logged in W-001's notes so the 10-07 read can attribute a move.
- **W-004 (the 2026-10-07 cold walk)** already asks: "open /cycles/schlesinger-jr, reach its Calibrate view from that page, drag the peak". Shipping today means that walk reads the new path. That is the encounter check, not a conflict.
- **Not touched:** `public/data/spectral/`, `FigureScroller.tsx`, `HashLink.tsx`, the /state bands, `state-2026.csv`.

### Next action — improve

Prep only until the review. No commit, push or deploy.

1. In `src/lib/cycleRoutes.ts`, add `cycleCalibratePath(cycle)` → `/?tab=calibrate&focus=<id>`, with a unit test beside the existing `cycleChartPath` tests.
2. In `src/app/(app)/cycles/[id]/page.tsx`, add a "Calibrate this cycle →" link at the end of the "Peak calibration" section, for cycles with a paired series only (one cycle has none, so it has no Calibrate chip). The bottom "Open in the chart" link stays as the compare-all-ten route.
3. In `src/components/Viz.tsx` (`CalibrationPanelWithPicker`), on first mount with `tab=calibrate` and a `focus` that matches a chip, scroll the facet's chart to the top of the screen, once per arrival. A reader who opens the tab by hand is not moved.
4. Add three legs per size to `scripts/check-calibrate-tab.mjs`:
   - On `/cycles/schlesinger-jr`, the Calibrate link sits within the first 3 screens.
   - Following it lands with the pressed chip = that cycle.
   - The chart top is ≥ 0 and the r box's bottom is ≤ the viewport height.

   The red arm is production today: there is no such link, and the landing is at curve-top 1,096.

First command (the baseline these legs must flip):

```
node C:/dev/skylark/sinusoidal-cycles/tmp/measure-calibrate-entry.mjs https://sinusoidalhistory.com schlesinger-jr
```

### Acceptance

- On production at 390x664 and 320x568, `check-calibrate-tab.mjs` reads all legs PASS, including the three new ones:
  - The link is within 3 screens, against 7.6 and 10.3 today.
  - The landing is on the right chip.
  - Curve top ≥ 0 and r bottom ≤ viewport.
- The same legs fail on today's production (the red arm, recorded before the deploy).
- The existing legs stay green: 30/30 + the 10-03 focus legs.
- The rendered-text gate on the cycle pages shows exactly one added line per paired cycle page ("Calibrate this cycle →"), and none removed.

### Delivery and encounter checks

- **Delivery:** `check-calibrate-tab.mjs https://sinusoidalhistory.com` after Render shows the commit live, plus the measure script's table re-read.
- **Encounter:** W-004's cold walk on 2026-10-07 already walks this exact path (390x664, /cycles/schlesinger-jr → Calibrate → drag → "did curve and r change together?"). The site has no analytics, so no real-user event can appear. Exposure will be `blind`, with W-004 as the read.

**USER-FACING: yes**
- User-facing paths: `src/app/(app)/cycles/[id]/page.tsx`, `src/components/Viz.tsx`, `src/lib/cycleRoutes.ts`.
- Internal paths: `src/lib/cycleRoutes.test.ts`, `scripts/check-calibrate-tab.mjs` (the root lint reaches it), `continuity/items.json` (via continuity-edit), this report.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none** — read: kickoff "dated gates due today: 0", and this morning's snapshot "0 gate(s) due on/before 2026-10-04".
- (b) Owed child rows: **none** — read: kickoff "rows owed to you in skylark-site's ledger: 0 of 744".
- (c) CROSSED state reads: **none** — read: the kickoff's state block (no threshold clause printed as crossed). Noted, not crossed: "key numbers (yours): no list yet — write docs/key-metrics.json". It is a standing absence, and no threshold fired.

---

## P3 — Product-work loop

[P3 — Product-work loop]

**Action: improve the product.** Item I-022: one tap from a cycle page into that cycle's Calibrate view. The manager review (299336fe) approved it as packeted. Its two HYPOTHESIS items were measured:
- **Where the link goes.** The end of "Peak calibration" sat at 3.3-4.95 screens at 320x568, past the 3-screen bar, so the link went under the heading instead. The heading sits at most 2.6 screens down.
- **"Once per arrival"** was defined as a rule, and the check pins it.

### 1. Implementation (main, pushed `618feea..7b0b0bf`)

- `117b2df`: the link plus the arrival scroll.
- `b125ed7`: Codex r1 fix.
- `12120d8`: Codex r2 fix.
- `0d22a91`: the rule and the ceiling, comments only.
- `7b0b0bf`: P1 report.

Files:
- `src/app/(app)/cycles/[id]/page.tsx`: the link, only for the 9 cycles with a paired series.
- `src/lib/cycleRoutes.ts`: `cycleCalibratePath` returns `/?tab=calibrate&focus=<id>&arrive=1`, with a unit test.
- `src/lib/urlState.ts`: `useArrivalState`.
- `src/components/Viz.tsx`: `arrive` is consumed at mount, and the panel scrolls the curve, the slider and r onto one screen.
- `scripts/check-calibrate-tab.mjs`: 30 legs became 93.

**The rule, stated in `Viz.tsx`:** a page load carrying `arrive` lands on the curve once, and nothing else ever scrolls.

**Gates:**
- Typecheck clean. Lint has 0 errors; its one warning is an old `tmp/` file.
- Unit tests 132/132, receipt run at `7b0b0bf`.
- **CI GREEN for `7b0b0bf`** (`check-ci-status --wait`: 1 success, 0 failures).

**Red arms**, each recorded before the fix it tests:
- Production before the change: 36/42. The 6 link legs fail ("no link").
- Mutation A (the guard removed, scroll on hand-open): 48/66. The reload and by-hand legs go red.
- Mutation B (no arrival scroll): 60/66. The on-one-screen legs go red, with curve top 1,096.
- Codex r1 reproduced on `117b2df`: 66/78. A reload after a slider move went 200 → 1,012, and a reopen by hand went 348 → 936.
- Codex r2 reproduced on `b125ed7`: 87/93. A race harness cancelled the arrival before its frames, then a hand-opened Calibrate went 348 → 1,012. A stray `arrive=1` on Facets did the same.

**Independent review:** three Codex rounds. All were read-only, run as a foreground pipe, with the banner `workdir` = `C:\dev\skylark\sinusoidal-cycles` on all three.

- **r1 on `117b2df`, one medium finding, STATIC → CONFIRMED.** nuqs's `replaceState(null)` wiped the `history.state` marker. REPRODUCED, then fixed in `b125ed7` with a one-shot URL param.
- **r2 on `b125ed7`, one P2 finding, STATIC → CONFIRMED.** A cancelled arrival left the param armed. REPRODUCED, then fixed in `12120d8`: the arrival is consumed at mount. Two rounds had now found the same class, so the shape changed.
- **r3 on `12120d8`, a cold round asked to break six invariants.** I1, I2, I5 and I6 HOLD. Two findings:
  - I4: a shared `arrive` URL lands its opener on the curve. **DELIBERATE**: the restated rule says exactly that, and the invariant I had written was too strict.
  - I3: a Back inside nuqs's deferred URL write leaves `arrive` for Forward. **PLAUSIBLE, declared as a ceiling in `Viz.tsx` (`0d22a91`), not patched**: the third round in one mechanism, so the recipe's stop-patching rule applied.

  The legs' blind spots, as r3 enumerated them, are written into the check's header.

**Sibling sweep:** `arrive` appears only in the link builder, its test, `Viz.tsx` and `urlState.ts`. Search space: `src/**` and `public/**` (Grep for `arrive`). The canonical tag, the sitemap, JSON-LD, `llms.txt` and the `.md` mirrors do not carry it.

### 2. Delivery

- The Render deploys API for `srv-d7mcat7lk1mc73bidim0` reads `7b0b0bf6 live`, created 17:06:38Z UTC and finished 17:07:53Z UTC. The deploy-drift checker declines this service (`commit` trigger, NOT-APPLICABLE-BY-REGISTRY), so the delivery read is the surface itself.
- `check-calibrate-tab.mjs https://sinusoidalhistory.com`: first run **91/93**, then **93/93**.
  - The 2 misses were the first run, minutes after the deploy, both at 320x568. The page landed at scrollY 0 with the curve at 1,158.
  - Follow-up: 10/10 cold taps and 20/20 on a warm page at 320x568.
  - Total: **2 misses in 48 production landings** (Wilson 80% CI about 1.7%-9.5%). Cause NOT established.
  - A miss lands where the old path landed: the top of the chart, with Calibrate open on the right cycle. It is not worse than before.
- `check-state-phone.mjs` (round 2 of 10-03): **142/142** on production after the deploy.
- Rendered text: `/cycles/kondratiev` gained exactly one line, "Move the peak yourself: calibrate this cycle →" (94 → 95, none removed). `/cycles/turchin-fathers-sons` is GREEN (identical, 69 lines).

### 3. Encounter

blind — the site has no client analytics, so a reader who taps the link leaves no trace. Bug row: W-004. Its 2026-10-07 cold walk, step 3, walks exactly this path, and its notes now say the path changed and what to ask.

### 4. Outcome

Open. There is no direct read yet. W-004 on 10-07 is the next one.

### Receipt

USER-VISIBLE: a phone reader on any of the 9 paired cycle pages taps "Move the peak yourself: calibrate this cycle →" about 2 screens down and lands in Calibrate on that cycle with the curve and r on one screen — 117b2df [proof: before, the only way in was "Open in the chart" 7.6 screens down at 390x664, landing on Facets with the curve 1,096px below the screen; after, check-calibrate-tab on production after Render deploy 7b0b0bf (live 17:07:53Z UTC) reads 93/93, link at 1.8-2.5 screens, curve top 84 / r bottom 631 of 664 with r loaded; 2 misses in 48 production landings, cause open] [coverage: none — the site has no client analytics · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader who taps the link leaves no trace · bug row W-004]

[red-armed: node scripts/check-calibrate-tab.mjs https://sinusoidalhistory.com (production before 117b2df) -> 36/42 PASS, "FAIL 390x664 schlesinger-jr: a Calibrate link within 3 screens — no link"]
mechanism-verified: node scripts/check-calibrate-tab.mjs http://localhost:3477 on b125ed7 -> 87/93, "FAIL 390x664 a cancelled arrival never scrolls a hand-opened Calibrate later — scrollY 348 -> 1012"; on 12120d8 -> 93/93

codexCalls: 3 (r1, r2, r3, all review)
adversarialReviews: 3 — EXECUTED (head shas 117b2df, b125ed7, 12120d8; findings dispositioned above)
hygiene helper: DISPATCHED ~16:06Z UTC · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-04.md PRESENT (26 lines). Its one nonzero finding (3 expired waits: I-006, I-009, I-017) was posted at once as status dfc8fb72.

### Ledger, done in this phase

- **I-022 → monitoring.** It carries the ship note, `linkedCommits` and a `waitJustification` naming W-004.
- **W-004:** a note says step 3's path changed and what to ask cold.
- **W-001:** a freeze note records the one body line added (no title, meta, H1 or URL change).

### What remains

- **2026-10-07 W-004:** the cold walk is the encounter and outcome read for I-022. The close condition is a cold phone walker reaching Calibrate in one tap and seeing curve and r move together.
- **The 2-in-48 miss:** carried in I-022's notes, cause open. If W-004's walker or a later check run sees a miss, it gets its own row.
- **At the close:** re-justify or un-wait I-006, I-009 and I-017 (expired 10-03), from the hygiene draft.
- **Not done, named:**
  - The manager's bolder suggestion, an inline "drag the peak" preview on the cycle page itself, is "not today", per the review.
  - Codex r3's I3 ceiling is declared, not fixed.

[standing-rules-hash: 88cc2dc9]

---

## Close

[P5 — Delta-only close]

ACTION: COMPLETED · item I-022 · P3 5152673c

**Acceptance met, per the manager review e328865f (COMPLETED):**
- Production `check-calibrate-tab` reads 93/93 after Render deploy `7b0b0bf`, live 17:07:53Z UTC.
- The manager's own touch-emulated production read: 4 of 4 taps landed, and reload, Back and Forward stayed put.

**Changed since the P3 post (5152673c):** no code. Ledger only: the three expired waits were re-justified, and I-022's unWait now names W-004.

**hygiene draft: 0 lines — 0 accepted · 0 amended · 0 rejected.**
- `tmp/hygiene-draft-sinusoidal-cycles-2026-10-04.md`, 26 lines in all. Its Drafts section reads "none", because every input was none.
- READ-MUTATED: none (0 reads guarded).
- check-wait-justification, at helper time: "RESULT: FAIL — 3 warn finding(s)" (I-006, I-009, I-017 expired 10-03). Posted at once as dfc8fb72.
- check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable".

**The three step-5 findings, dispositioned by hand with continuity-edit.** Each row's own `nextEvaluation` already read 2026-10-07; only `waitJustification.until` was left at 10-03.
- **I-006:** until → 2026-10-07. unWait carries the reason. It is a robustness row; every count is still correct against 10 cycles and 9 series.
- **I-009:** until → 2026-10-07. loadBearing and unWait now name W-001's 10-07 Search Console read as the remaining read; the walk half was read 10-03.
- **I-017:** until → 2026-10-07. unWait names the readCommand re-run for the Back intermittent; the walk half was read 10-03.
- **Re-run after the edits:** check-wait-justification "RESULT: PASS — 20 of 30 row(s) carry `waitJustification`; 0 warn / 1 info". The info is the shared-cause cluster.

**Due gates:** check-due-gates-dispositioned "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-04).

**Ledger delta today:**
- **I-022:** open → monitoring. It carries a ship note, linkedCommits `117b2df`, `b125ed7`, `12120d8` and `0d22a91`, and a waitJustification that names W-004.
- **W-004:** a note that step 3's path changed, and what to ask cold.
- **W-001:** a freeze note recording one body line added (no title, meta, H1 or URL change).
- **I-006, I-009, I-017:** re-justified, as above.

**Receipt:** P3's line (5152673c) still holds; no bracket has changed. Exposure is blind, with W-004 as the read; the outcome stays open.

**Pending reads:**
- **2026-10-07, W-004 cold walk.** Step 3 is I-022's encounter and outcome read. Close condition: a cold phone walker reaches Calibrate in one tap and sees curve and r move together.
- **2026-10-07, W-001 Search Console.** This read also covers I-009.
- **2026-10-07, re-runs:** I-006, I-017 and I-020 to I-024.
- **2026-12-01, I-025:** the band question goes to David.

**UNRESOLVED:**
- The 2-in-48 landing miss on I-022: page left at scrollY 0, cause not established. A miss seen by W-004 or a later check run gets its own row.

**Primer:** `docs/cold-starts/2026-10-04.md`. Banner 1,206 chars; first action is `check-calibrate-tab` on production.

codexCalls: 0 — probed-declined (the close has no code diff; today's 3 review runs are counted on P3 5152673c)

[standing-rules-hash: 88cc2dc9]
