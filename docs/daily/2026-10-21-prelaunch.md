# sinusoidal-cycles — 2026-10-21 (Wednesday, MT) — day round 1

## P1 — Evidence and choice

[P1 — Evidence and choice]

### Section 0

- Primer: read `docs/cold-starts/2026-10-20.md` whole (no 10-21 primer; the 10-20 file is the newest). First action: `git grep -n -e "label: \"Now\"" -e "label: \"Living memory\"" -e "MIN_VISIBLE_SPAN = 150" -- src/lib/siteConfig.ts` returned **1 match** (`src/lib/siteConfig.ts:26`) and 0 for the removed presets. The 10-20 change is in the tree.
- Listener: 🟢 SSE alive (hello 19:14:55Z, replay 0) + loop armed by `ScheduleWakeup` (the Stop hook owns the cadence); waker ladder ranks 1-3 running.
- Codex: GREEN per the kickoff's `[codex-probe: …]` line (machine-level exec+write, 19:17:50Z). 0 calls at P1.
- CI: `check-ci-status --workflow ci.yml` → GREEN on 59b810a3 (1 success, 0 failures, 0 pending).
- Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 59b810a3 = head.
- Harness: running build for this pane not separated out (the read lists the fleet, not pane by pane) · fleet SKEW (26 panes on 2.1.306, 1 on 2.1.305; 27 of 27 read) · installed 2.1.306 (fleet-wide AHEAD of the 9-18 record). The skew is one pane on the previous build. This is a read, not a stop.
- Recs from the last close: one, "I-061: draft shape (d), Codex review, pre-registered walk naming the Turchin 2020 case, then ONE David card before any site-wide ship" (primer banner). **Carrying today → P3**; this packet picks it.
- North Star: retention + word-of-mouth. This bar reads UNMEASURED (`docs/evangelism-bar.md` `metricReady: false`, no client analytics by standing choice). Any ship is reported as unmeasured.
- Product-love rotation: `check-cycle-rotation --lane sinusoidal-cycles` → exit 0, "no product-love cycle picks this lane today". The normal P3 runs.
- David's word: `answered-cards --project sinusoidal-cycles` → none waiting, answered or pending-verify.

### Selection packet

**Outcome:** I-061. A cold reader who opens the Dalio card no longer reads "Dalio peaks now" off the curve or off its Peak calibration sentence.

**The user problem, in the user's words:** "the strongest 'Dalio peaks now' picture" (walk G1, 10-20, Modern view, the ~2025 crest as the right-hand dome); "My friend could quote that half-sentence as 'the site says it peaks around now'" (walk F2, 10-20, on "forces our sinusoid to peak again at ~2025").

**Evidence:**
- OBSERVED: walk G1, `docs/walks/2026-10-20-i060.md`, production 0ed4feb, synthetic N=1, pre-registered, NOT HELD on Modern. Limits: synthetic, one walker (G2 was not run).
- OBSERVED: the phrase was lifted by five walkers across three days (D2 10-18, E1 10-19, F1/F2 10-20, G1 10-20), per I-061's description and notes. All synthetic.
- OBSERVED (source): the 2025 crest is in the model, not the zoom: Dalio's period is 75 and its reference peak 1950, so every window that reaches past 2025 draws a crest there. The 150-year floor (`src/lib/siteConfig.ts:26`) cannot remove it.
- OBSERVED (prototype, 10-20): shape (c), stopping the theory at its record's end, read WORSE because it ends rising at its peak. Not built.
- HYPOTHESIS: shape (d) holds. Each card draws only the anchored cycle, one period centred on the writer's own reference peak, and projects nothing. For Dalio that is the dome 1912–1987 around 1950. Nothing is drawn at 2025, so there is no right-hand crest to read as now.
- HYPOTHESIS, the known hard case: Turchin's reference peak is 2020, so (d) draws its dome at the present. That is Turchin's own claim, and it sits under the verdict box. The draft must say how the walk scores it: a walker who reads "Turchin says it peaks now" is reading the writer's claim correctly. A walker who reads "the site says it peaks now" or "the cycles agree" is a fail.
- MISSING: any real-user read of the card (no client analytics, W-003; do not add tracking). Search Console cannot see an expanded card.
- Prior-day retro finding that bears on this: Q4 was carried to I-061 "after (d)'s draft + Codex review". This packet is that work.

**Permission:** I-061 status open, P3, owner sinusoidal-cycles, no park or freeze. Its notes approve (d) **for drafting only**. (d) changes what "theory" means on every card, so it is David's call before any site-wide ship. **No commit to production of (d) before his reply.** The draft, prototype, Codex review, preview walk and board card are all inside the lane's class.

**Next action — improve (draft + prototype, no ship).** The P3 sequence:
1. Prototype (d) on a local branch and render every card type at 390x664 before and after: the opened facet card (`src/components/CycleFacet.tsx`), the closed card, the glance figure (`src/components/CycleOverview.tsx`), the /cycles/<slug> curve (`src/components/CycleOverlay.tsx`). Keep the frames for the card.
2. Write the draft (scope, what each card type draws, the Turchin scoring rule, how the Peak calibration sentence changes if at all) and get its own Codex read-only review (foreground pipe, banner workdir checked).
3. A pre-registered cold walk on a local production build (`next build` + `next start`, stopped by PID after), 390x664: I-060's question (9) plus I-061's phrase question, two walkers, one at a time, question and pass bar written before walking.
4. ONE David board card: before/after frames per card type at phone width, a recommendation, and what happens with no answer, asking one plain question.

First command (the existing gitignored screenshot reader, against production for the "before" frames):

```
node C:/dev/skylark/sinusoidal-cycles/tmp/shot-shape.mjs
```

**Acceptance (observable):** a filed David card carrying before/after frames of the Dalio card (and each other card type) at 390x664 from the preview build, plus the pre-registered two-walker walk quoted in it. Nothing ships to production before David replies. I-061 itself closes only on a production walk after the ship, per its closeWhen.

**Second item, while the card waits — I-046 (ship).** The home page "Every cycle, at a glance" figure's labels do nothing when tapped. Source: `src/components/CycleOverview.tsx:17-24` says the rows are deliberately "a FIGURE, not controls", because 24px rows cannot meet the 44px tap floor (canon R28). The row allows either a real tap target or a visibly non-interactive figure with the cue pointing at the list. Lane class, no David call. Acceptance: a Playwright tap read at 390x664 and 320x568 that lands on that cycle's expanded card (or shows the figure is plainly non-interactive), live by deploy row; regression read `check-holds-up-line` stays green.

**Delivery and encounter:** I-061: delivery is the board card (filing receipt), not production. I-046: CI green + `check-deployed-sha-drift --service sinusoidal-history` in-sync on the ship sha, plus the tap read on production. Encounter for both: blind (no client analytics). The readable events are the synthetic walks and I-061's 10-22 dated read.

**USER-FACING: yes.** Paths: I-061 prototype only (not shipped today): `src/components/CycleFacet.tsx`, `src/components/CycleOverview.tsx`, `src/components/CycleOverlay.tsx`, possibly `src/lib/hooks.ts` and `src/data/cycles.json` (`dalio.reference_peak_rationale`, which needs the cos-math audit and the `public/about.md` / `public/llms.txt` mirrors if it changes), plus a walk doc under `docs/walks/`. I-046: `src/components/CycleOverview.tsx` and a test or probe for the tap.

**Prep after the post (P1 → P3, no change made).** "Before" frames taken on production 59b810a3 by the gitignored `tmp/i061-shot.mjs` (390x664 and 320x568, deviceScaleFactor 2) into `tmp/i061-before/`: glance figure, closed Dalio card, opened Dalio and Turchin cards (`?tab=facets&focus=<id>`), and `/cycles/dalio` + `/cycles/turchin`. The opened Dalio card at 390 draws six theory periods across the default window, and the rightmost crest sits at ~2025 near the right edge. The Peak calibration paragraph sits directly below the curve, and its "forces our sinusoid to peak again at ~2025" is about two-thirds of the way down it. Both of the readers' "now" sources are on that one card.

**HYGIENE INPUTS (as posted at P1):**
- (a) due rows not bearing on the choice: 2 — I-043, I-049 (copy work on /methods' row label and the cycle descriptions' full stops). Read: `check-due-gates-dispositioned --snapshot` → "3 gate(s) due on/before 2026-10-21" (I-043, I-046, I-049; 67 ledger rows swept). I-046 is selected above and leaves this list.
- (b) owed child rows: none. Read: "rows owed to you in skylark-site's ledger: 0 of 754".
- (c) CROSSED state reads: none. Read: every kickoff state read (stale-actionable 0 of 15, queued rows 0, cards 0, missingLinkedCommits nothing swept, HEAD CI GREEN, report PENDING as expected).

## P3 — Product-work loop

Manager review: REDIRECT (msg 6ce97495). Three parts: ship the Dalio sentence today; draft (d) with both holes closed and file the card; then I-046.

### 1. Dalio Peak calibration, SHIPPED

- Commits 895305e, 83683c1, 0d73847 (`src/data/cycles.json` dalio.reference_peak_rationale + `public/about.md:109`). The paragraph now opens "Dalio's empire-score chart shows US decline after 1950, not a second peak. Every crest this curve draws after 1950 comes from how this site built it, not from his forecast." The year 2025 is no longer named. "Joining them into one repeating sine wave is this site's choice, not Dalio's" replaces "forces our sinusoid to peak again at ~2025, which Dalio does not assert".
- Cos-math audit (`python scripts/audit_cycle_rationales.py`): dalio 1950 PEAK (+1.000), 1945 near peak (+0.914, a claim about the data). No other year/phase claim in the paragraph.
- Codex r1 (read-only, workdir checked, head 83683c1): no defects. Its MED claims concern on two sentences was fixed in 0d73847 using the round-4 fact-check's own words (`docs/fact-check-2026-04-26-round-4.md:92`). Its LOW (the pre-existing "war-production effects" causal clause) was left as is, DELIBERATE: this change does not touch it. Codex r2 (head 0d73847): both rewritten sentences HOLD, mirrors identical.
- Tests 386/386 local. CI GREEN on 0d738473 (`check-ci-status --sha 0d73847`). Deploy: `check-deployed-sha-drift --service sinusoidal-history` in-sync, live 0d738473 = head.
- Live read (Invoke-WebRequest, production): /cycles/dalio new opening ×2 (HTML + payload), "site's choice" ×2, "peak again at ~2025" ×0; /about.md new ×1, old ×0. The nonzero new-phrase count is the positive control for the zero.

### 2. I-046 glance tap, SHIPPED (b50df27 + 36b01c1)

- Codex r3 (head b50df27): no application defects; LOW (pre-open guard) fixed in 36b01c1, proven by its selftest arm only.
- Delivery: CI GREEN on 36b01c14; drift in-sync, live 36b01c14 = head. Live: `check-glance-tap.mjs https://sinusoidalhistory.com` → "OK: 20 of 20" (production before: 0 of 10).

- Each glance row is a full-width button calling the existing `handleSelectCycleFromSummary` (`Viz.tsx:114`). Rows stay 24px: below R28's 44px, at WCAG 2.2 AA's 24x24. The reasoning is in the component comment.
- New gate `scripts/check-glance-tap.mjs` + `src/lib/check-glance-tap.test.ts` (selftest 10 passed). Red arm: production 0d738473 at 390x664 → "RED: 0 of 10 glance-row taps opened their own card in view" (all DEAD). Green: local build of b50df27 → "OK: 20 of 20" at 390x664 + 320x568.
- Regression on the same local build: check-glance-now-mark 2/2 CLEAN; check-entry-folds 13/13; check-holds-up-line 46/46 PASS. Glance figure screenshot unchanged in appearance (`tmp/i046-after/glance-390.png`).

### 3. Shape (d) draft

- Draft + pre-registered walk: `docs/walks/2026-10-21-i061-shape-d.md`. Hole 1: rule (d') = [peak − P/2, min(peak + P/2, current year)]; only Perez (1.5y) and Turchin (69y) reach past 2026. Hole 2: cycle and claim pages drop the present-day position; /state and /api/v1/state stay, labelled as extrapolation. Codex r4 (design review) in flight.
- Codex r4 on r1: 5 HIGH + 2 MED, all CONFIRMED; r2 carries each disposition (the /state label was withdrawn as false; /state goes to David as retire-or-keep, retire recommended).
- Prototype on the local branch `proto/i061-shape-d` (10f8613, not pushed). Frames at 390: `docs/walks/frames/2026-10-21-i061/`.
- Pre-registered walk, W1 then W2, local production build: **HELD (both)**. Turchin's 150-year row is the one "peaking now" picture; both walkers credited it to Turchin and said the site does not endorse it.
- **David card filed: 777f3084** (needs-decision 72ac4315). No build of (d) on main without his word.

### 4. David said yes; shape (d') SHIPPED site-wide

- **David, 2:47 PM MT, verbatim:** "Yes: one wave per cycle, stop at today, retire the yearly state pages." Banked in `docs/answers/2026-10-21.md`.
- **Inventory:** a read-only helper mapped every surface, about 60 touchpoints. They were built on `feat/i061-one-wave` and fast-forwarded to main as a3a9389 (9849b93, a327700, 53d83e2, a3a9389).
- **Drawing:** every drawing path samples through `sampleDrawnPeriod` (one period around the stored peak, cut at today). This covers the cards, glance figure, overlay, cycle-page figure, both OG cards and the poster.
- **Removed:**
  - phase tag, now-line, axis "now · year";
  - overlay now-line, pin-a-year panel and "currently <phase>";
  - cycle-page now dot and the #where-now sentence;
  - the claim answer's position;
  - the phase classifier.
- **Retired:** /state/* redirects permanently (308) to /cycles, and /api/v1/state answers 410 with a pointer. `state-2026.csv` stays as an archived file, marked retired.
- **Prose:** rewritten across the editor's note, /about, /methods and /colophon (with their mirrors), llms.txt, README and AGENTS.md, the /cycles index, six rationales and two provenance files. The cos-math audit was re-run and is consistent.
- **Codex reviews** (read-only, workdir checked each time):
  - r5 on a327700: no HIGH; 5 findings plus claims, all fixed in 53d83e2. Selection-effect causal wording DELIBERATE (the site's standing editorial argument).
  - r6 on 53d83e2: 2 MED narrowings plus 1 LOW checker tightening, fixed in a3a9389.
- **Gates:** tests 362/362 local, CI GREEN on a3a9389, `check-deployed-sha-drift` in-sync (live a3a9389).
- **Live reads on production after deploy:**
  - check-holds-up-line: 46/46. The red arm on the previous production was 20/46.
  - check-glance-tap 20/20, check-glance-now-mark 2/2, check-entry-folds 13/13, check-open-card-position 2/2, check-closed-card-header 2/2, check-embed-snippets 42/42.
  - /state/2026 → 308 /cycles; /api/v1/state → 410.
  - /cycles/dalio: "sits at a peak" ×0, "one period of a wave" ×4.
  - sitemap: /state ×0.
- **Encounter:** blind (no client analytics, W-003). The pre-registered production walk is I-061's 10-22 read: two walkers, one at a time, the same questions as the prototype walk.

## Close

ACTION: COMPLETED · item I-061 · P3 f9ceeb4d. All three parts of the acceptance the REDIRECT set were met: the Dalio sentence is live, a David card was filed with frames and a walk, and I-046 is live. David's yes on that card was built and shipped site-wide. Live reads are quoted above; the review approved it (8b00c864).

- **State changed since the P3 post (f9ceeb4d):**
  - Dependabot cleared. vite 8.3.0 → 8.3.5 (ce9d766) fixed #57–#59. Mid-close, #60/#61 opened on @vitest/mocker; vitest + @vitest/ui 4.1.11 → 4.1.12 (27ff51a) fixed them. CI GREEN on both. Live `gh api …/dependabot/alerts?state=open` → `[]` (the same query had returned #60, #61 minutes earlier). `check-engineering-zero` still printed RED [#60, #61] from its panel cache after the fix landed: a cache lag, not an open alert.
  - Branches: `feat/i061-one-wave` deleted (merged as a3a9389). `proto/i061-shape-d` deleted (superseded by the shipped build, never pushed; its frames and walk are committed under docs/walks/).
- **Ledger delta:**
  - I-046 CLOSED on its closeWhen (the tap read on production went from 0/10 to 20/20).
  - I-061 → monitoring. Its readCommand is now check-holds-up-line; its closeWhen is re-pointed at a production walk of the LIVE one-wave page; the note carries David's words verbatim.
  - I-043 and I-049 re-dated to 2026-10-22 (hygiene draft ACCEPTED).
  - I-062 MINTED: the zoom strip snaps back with no message (both walkers named it), dated 2026-10-23.
- **Hygiene draft:** 2 lines — 2 accepted · 0 amended · 0 rejected.
  - READ-MUTATED ×2 (I-049: src/data/cycles.json, public/about.md) = this lane's own concurrent I-061 edit.
  - wait-justification: PASS (32 of 67, 0 warn).
  - engineering-zero at helper time: RED, 3 Dependabot (#57–#59), now fixed (above).
- **Due gates:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-21).
- **Receipt:** P3's line stands (a3a9389, exposure blind · W-003). Outcome open until the 10-22 walk.
- **Pending reads:**
  - 10-22: I-061 production walk, I-043, I-049.
  - 10-23: I-034, I-056, I-062.
  - 10-27: I-057, I-058.
  - 10-30: I-051.
  - 11-03: I-027.
- **Processes:**
  - `next start` on 3461/3462/3463 each stopped by verified PID (0 listening).
  - Codex runs were foreground pipes that exited.
  - Waker rungs and the listener stay up for the evening.
