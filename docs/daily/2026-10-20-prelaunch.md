# sinusoidal-cycles — 2026-10-20 (Tuesday, MT) — day round 1

## P1 — Evidence and choice

[P1 — Evidence and choice]

### Section 0

- Primer: read `docs/cold-starts/2026-10-20.md` whole. First action run: `git grep -n -e "peak again at" -e "label: \"Now\"" -- src` → **2 matches** (`src/data/cycles.json:83`, `src/lib/siteConfig.ts:44`), unchanged since the walks.
- Listener: 🟢 SSE alive (hello 15:11:32Z, replay 0) + loop armed by `ScheduleWakeup` (Stop hook owns the cadence); waker ladder ranks 1-3 running (rank 1 relaunched after its wake-shorten FIRE delivered this kickoff).
- Codex: GREEN per the kickoff's `[codex-probe: …]` line (machine-level exec+write, 04:14Z). 0 calls at P1.
- CI: `check-ci-status --repo-dir C:/dev/skylark/sinusoidal-cycles --workflow ci.yml` → GREEN, 6737adc6 (1 success, 0 failures, 0 pending).
- Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 6737adc6 = head. (`--service sinusoidal-cycles` matches no Render service; the service name is `sinusoidal-history`.)
- Harness: running 2.1.304 · fleet UNIFORM (28/28) · installed 2.1.304 (SAME).
- Recs from the last close: one, "I-060 or I-061 as a shape change with its own walk" (primer banner, close 832fa547). **Carrying today → P3**; this packet picks I-060.
- North Star: retention + word-of-mouth. This bar reads UNMEASURED (`docs/evangelism-bar.md` `metricReady: false`, no client analytics by standing choice); the ship is reported as unmeasured.

### Selection packet

**Outcome:** I-060. Tapping the "Now 2000–" range preset no longer shows the opened Dalio card (and the facet rows) as a single crest at ~2025.

**The user problem, in the user's words:** "one big gold dome whose top sits about mid-axis, roughly 2025 … It looks exactly like 'peaking right now'" (walk F2); "for a moment that looked like 'they all crest around now'" (walk F1).

**Evidence:**
- OBSERVED: walks F1/F2, `docs/walks/2026-10-20-i055-i059.md:68-72`, production 99af9505, synthetic N=1 each, independent. Both tapped "Now 2000–" while answering question (8). Limits: synthetic, recorded not scored (no pre-registered bar for this surface).
- OBSERVED (source): `src/lib/siteConfig.ts:43-48`, the preset is `start: 2000, end: 2050`. Dalio's curve (period 75, reference peak 1950) crests at 2025, the window's midpoint, so a 50-year window draws exactly one centred dome. Buttons render from `RANGE_PRESET_OPTIONS` in `src/components/TimeRangeBrush.tsx:173-196`; the brush has no minimum span.
- HYPOTHESIS: removing only the "Now" button moves the problem one button over. "Living memory 1950–2050" puts Dalio's crests at 1950 (left edge) and 2025 (three-quarters across). Whether that reads as "now" is unmeasured. The lever has to be judged on the shortest window a reader can still reach by tapping, not only on "Now".
- OBSERVED (source): `?range=now` is a documented embed parameter (`src/app/embed/docs/page.tsx:89-92`); `parseRange` falls back to the default on an unknown name (`src/lib/urlState.ts:24-42`), so dropping it from URLs degrades without breaking.
- MISSING: any real-user read of the preset (no client analytics, W-003 standing choice; do not add tracking). Render logs cannot see a client-side tap.
- Retro (10-19) finding that bears on this: Q4 "the strongest 'peaking now' picture on the home page is a curve the site itself draws", carried to I-059 and closed 10-20 by removal. Same family here.

**Permission:** I-060 status open, P3, owner sinusoidal-cycles; no card, no park, no freeze. Changing a reader-facing control is a lane product call (no David class); "nothing waits on David" (primer).

**Next action — improve.** Prep only until P3 is queued: render the opened Dalio card under each preset (All, Industrial, Modern, Living memory, Now) at 390x664 on production, and record which windows draw a single crest at or near 2026. That decides the lever: remove the short preset(s) whose window draws one crest, and (if dragging can still reach that window) put a minimum span on the brush. Claim less, not reword (every close on this surface has come from removal: I-047, I-048, I-054, I-055, I-059). First command:

```
node C:/dev/skylark/sinusoidal-cycles/tmp/shot-shape.mjs
```

(The existing gitignored screenshot reader; P3 extends it to tap each preset with the Dalio card open.)

**Acceptance (observable):** on production, after the deploy row reads live for the change, no tap a reader can make on the range presets from the opened Dalio card draws a window whose picture is one crest at the present. Then a pre-registered cold walk (question and pass bar written before walking; 390x664, production, default + schoolteacher seed, ONE walker at a time) taps the range presets from the opened Dalio card and reports nothing read as "peaking now", convergence or the site agreeing, even briefly (I-060 closeWhen). The note's instruction "Drag the time-range below …" must still be true, or gets a matching edit (primer, Non-obvious).

**Delivery and encounter:** delivery = CI green + `check-deployed-sha-drift --service sinusoidal-history` in-sync on the ship sha, plus a live screenshot of the presets row. Encounter: blind (no client analytics); the readable event is the walk, N=2 synthetic, plus I-060's 10-22 dated read.

**USER-FACING: yes.** Paths: `src/lib/siteConfig.ts`, `src/components/TimeRangeBrush.tsx`, possibly `src/lib/urlState.ts` + `src/lib/urlState.test.ts`, `src/app/embed/docs/page.tsx` (if a preset name leaves; `public/llms.txt` names no preset, 0 matches), plus a new walk doc under `docs/walks/`.

**Prep read after the post (P1 → P3, no change made).** Arithmetic only, from `cycles.json` (`period_years`, `reference_peak_year`), by the gitignored `tmp/preset-crests.mjs`. It counts the cycles whose ONLY crest inside each preset window falls within 15 years of 2026:

| Preset | Window | One crest, at now | Rows |
|---|---|---|---|
| All | 1600–2050 | 0 of 10 | — |
| Industrial | 1750–2050 | 0 of 10 | — |
| Modern | 1900–2050 | 1 of 10 | Turchin (150y) |
| Living memory | 1950–2050 | 2 of 10 | Khaldun, Turchin |
| Now | 2000–2050 | **7 of 10** | Khaldun, Kondratiev, Huntington, Turchin, Dalio, Strauss-Howe, Turchin (50y) |

This matches the walkers' lists (F1 and F2 named 6 of these 7 between them). "Now" is the problem window by a wide margin. "Living memory" is the next one down, and the lever has to answer for it too. Turchin's single crest on Modern comes from its 150-year period, not from the zoom, so it is out of I-060's scope. It is arithmetic, not a read of what the screen draws. P3 confirms it on a screenshot before choosing.

<!-- findings:begin -->
**Correction to this packet's premise (P3, after walk G1).** The packet's arithmetic counted the windows where a cycle draws a LONE crest near now, and called Modern "1 of 10". Walk G1 (`docs/walks/2026-10-20-i060.md`) read **Modern** as "the strongest 'Dalio peaks now' picture", with the ~2025 crest as the right-hand dome of two. A reader picks out the crest nearest the right-hand edge, not the only one. So the shipped change (no window under 150 years; "Now" and "Living memory" gone) removed the F1/F2 picture, and did not remove the problem. The crest is in the model (1950 + 75 = 2025), not in the zoom.
<!-- findings:end -->

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice: none. Read: `dated gates due today: 0`, and `check-due-gates-dispositioned --snapshot` → "0 gate(s) due on/before 2026-10-20" (67 ledger rows swept).
- (b) owed child rows: none. Read: "rows owed to you in skylark-site's ledger: 0 of 754".
- (c) CROSSED state reads: none. Read: every kickoff state read (stale-actionable 0 of 16, queued rows 0, cards 0, missingLinkedCommits nothing swept, HEAD CI GREEN, report PENDING as expected).

## P3 — Product-work loop (posted 3d2c21fb)

- Shipped, live: 0ed4feb (064e930 + bc42129). The chart draws no window under 150 years. "Now" and "Living memory" are removed. A short drag or `?range` is widened about its centre.
- Reviews: Codex r1 found 1 LOW (fixed in bc42129); r2 found nothing.
- Tests: full suite 386/386 (receipt deaad40); CI GREEN on 0ed4feb.
- Walk G1: NOT HELD on Modern. G2 was not run.
- Shape (c) was prototyped and measured worse. Consults 0bdd1dab and f06fd8a4; answered with (e).
- Detail: the P3 post and `docs/walks/2026-10-20-i060.md`.

## Close

ACTION: DEFERRED — acceptance not met: walk G1 NOT HELD on Modern; the remaining crest is the model's own 2025 peak, handed to I-061 (orchestrator consult-2, option e) · trigger next round's I-061 shape (d) draft, I-061 nextEvaluation 2026-10-22 · item I-060 · P3 3d2c21fb

- **State changed since P3:** none on the product. P3 review APPROVE/REDIRECT not yet received at close.
- **Ledger delta:**
  - I-060 CLOSED NOT HELD (deaad40; note carries 0ed4feb live, walk G1, prototype (c) not built).
  - I-061 notes appended: the residual, the 5th walker, and shape (d) with its review, walk and David-card requirements.
  - Nothing else changed.
- **Hygiene draft:** 0 lines (no inputs). Checks: wait-justification PASS (32 of 67, 0 warn); engineering-zero PASS (0 findings, 0 unreadable). READ-MUTATED none.
- **Due gates:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-20).
- **Receipt:** P3's line stands (064e930, exposure blind, outcome not held).
- **I-061's next-round order** (items.json, I-061 notes): first draft (d) with its own Codex review and a pre-registered walk that names the Turchin 2020 case. THEN one David board card (before/after per card type at phone width, a recommendation, and what happens with no answer) BEFORE any site-wide ship. **No card is owed today.** The draft and review come first, so a missing card is not a dropped step (P3 review bba67b2c).
- **Pending reads:**
  - 10-21: I-043, I-046, I-049.
  - 10-22: I-061.
  - 10-23: I-034, I-056.
  - 10-27: I-057, I-058.
  - 10-30: I-051.
  - 11-03: I-027.
- **Processes:**
  - `next start` PID 61252 stopped by verified command line; re-read shows 0 lane `next start` survivors.
  - Codex runs were foreground pipes that exited (CODEX_EXIT=0 both).
  - Waker rungs and the listener stay up for the evening.
