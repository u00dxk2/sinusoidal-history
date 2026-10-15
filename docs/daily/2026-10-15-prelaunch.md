# Daily — sinusoidal-cycles — 2026-10-15 (Thursday, MT)

## Day round (2026-10-15): P1 selection packet

[P1 — Evidence and choice]

**Outcome (I-047, the expanded cycle card):** a reader who opens a cycle sees whether the record supports it before the chart tells them it does. **Item:** I-047.

**The user problem, in a reader's words (synthetic, N=1, the 10-14 I-045 walk, `docs/walks/2026-10-14-i045.md`):** "The word PEAKING (in gold capitals) next to a big gold wave, with its last crest on the dotted 'now' line, looks like confirmation … My friend's claim felt confirmed until I reached 'Not testable.'" It also said: "'Not testable on the record that exists': I knew it meant 'no verdict,' but not *why*." And: "The verdict line has a little arrow, so it reads like the answer is elsewhere."

### Evidence

- **OBSERVED (live frame, 390x664, production `a61c6f61`, `i047-frame.mjs` in the session scratchpad, 2026-10-15 ~16:55Z) [linter-report]:** on `/?tab=facets&focus=dalio` the card reads top-down as:
  - the phase word "PEAKING" at y 39-55, in the cycle's own gold (`CycleFacet.tsx:264-273`, `style={{ color: cycle.color }}`), the same colour as the theory curve;
  - the legend, then the 220px chart at y 96-316;
  - only then "DOES IT HOLD UP?" at y 322-366: an 11px grey label, then a 13px headline ending "→" (`HoldsUpLine`, `CycleFacet.tsx:287-321`).
  - The unpaired cycle is the same: "FALLING" at y 39 and the line at y 299.
  - The frame is saved as `i047-card-dalio.png`.
- **OBSERVED (source):** the "why" already exists, in pinned words. `holdsUpCard()` returns `{ headline, detail }` (`src/lib/holdsUp.ts:48-72`). The detail ("Its paired record covers 0.7 of the 3.0 full periods this site requires before testing.", or "Judged on …" for Kondratiev and Turchin, or `NO_SERIES_REASON`) is what the share card and its alt already print, and the I-028 guard already reads it there. The card renders only `card.headline` (`:303`).
- **OBSERVED (live, single-cycle embed):** `/embed?cycles=dalio` at 358 and 390 wide: document 540 in a 540 frame, the chart at y 96-280, the line at y 314-358. Re-ordering adds no height. Adding the detail line would, and the primer records ~0px headroom (check-embed-snippets "attribution visible" leg).
- **OBSERVED (regression baseline, today):** `check-holds-up-line https://sinusoidalhistory.com` → "RESULT: 40/40 PASS · 0 FAIL · 0 UNREAD" (2026-10-15 ~16:45Z).
- **HYPOTHESIS (synthetic, N=1):** the card's order and colour answer "is it peaking?" before the verdict answers "does it hold up?". Today's RED-arm walk, the same prompt verbatim on live, is running in prep. Its report is saved to `docs/walks/2026-10-15-i047.md` before any build.
- **MISSING:** any real reader of the card. The site has no client analytics, by standing choice (`docs/evangelism-bar.md:30`); the bar reads UNMEASURED.

### Section 0

- **Primer:** `docs/cold-starts/2026-10-14.md`, read whole. The banner names I-047 as the next P1.
- **First action:** `check-holds-up-line` 40/40 (above).
- **Listener:** 🟢 SSE alive (restart 16:51:27Z, hello 16:51:30Z, replay-complete). Waker ranks 1-3 are running. The pane had closed at 16:50Z (close-out 22461fc8) and re-opened on this kickoff; status 7db217c5 says so.
- **Waker ladder from 10-14 23:39Z (5a705361), per the lead's ask:** it died with the 10-14 evening session; that transcript shows the rungs killed at 23:49:21Z. This session's earlier ladder (PIDs 4744, 36832, 38072) and listener 41720 were stopped and read back "gone" at ~16:49Z.
- **Codex:** GREEN, by the `[codex-probe:]` line on this prompt (16:44:28Z).
- **CI:** the kickoff reads GREEN on `a61c6f61` (run 38681692308).
- **Drift:** `check-deployed-sha-drift --service sinusoidal-history` reads in-sync, live `a61c6f61` = head (exit 0). `a61c6f6` adds 3 lines to `vitest.config.ts` only.
- **Due gates:** `check-due-gates-dispositioned --snapshot` reads "2 gate(s) due on/before 2026-10-15": I-046 and I-047, both READ_NEVER_RUN.
- **Rotation:** `check-cycle-rotation --lane sinusoidal-cycles` reads "no product-love cycle due — picked evangelism-bar (7d since 2026-10-08, within its 30d cadence)" (exit 0).
- **Board:** the kickoff's `answered-cards` read shows none.
- **North Star:** retention and word-of-mouth. The bar reads UNMEASURED, so this ship is reported as unmeasured.
- **Recs yesterday:** the 10-14 evening close named I-047 (this choice) and I-046 (below).
- **Prior-retro finding that bears on the choice:** "I wish I had delegated the post-deploy read battery" (c6fba770 Q2; it recurred on both 10-14 rounds, db6ec405). Today the RED walk is already delegated. The post-deploy reads (holds-up 40, folds, embed snippets, multiset) go to one subagent after the deploy, named here so P3 cannot drop it.

### Permission

Lane-owned product copy and layout on its own surface. I-047 is open, with no park, wait or card. The fences come from the primer and the lead:
- The headline is never reworded; it is pinned in `holdsUp.ts` / `holdsUp.test.ts`.
- No sentence says a test ran (the I-028 guard).
- The "why" reuses `holdsUpCard().detail`, which is already pinned, published and guarded. No new claim sentence.
- I-042 and I-043 are untouched before their dates, and nothing under `public/data/spectral/` changes.
- No David decision is needed.

### Next action — improve

**Levers (order, prominence, a short why), as a HYPOTHESIS for P3. The walk decides, not this list:**
1. On the expanded card, the "Does it hold up?" line moves above the legend and chart, directly under the header. The reader then meets the verdict before the curve.
2. On the expanded card, the line gains `card.detail` as its "why", in the same words as the share card.
3. The "→" leaves the headline. The link to `#does-it-hold-up` stays, on the "why" or as a separate short link; P3 picks after measuring.
4. Possibly: the expanded card's phase word is drawn in ink instead of the curve's gold, so the gold reads as "the theory" only. Ship this only if the walk still names the colour after 1-3.
5. Embed: re-order only (no new height). The "why" stays off the embed unless the footer measures room.

First command (the RED arm already running is the walk; this is the regression baseline the build must keep):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-holds-up-line.mjs https://sinusoidalhistory.com
```

### Acceptance condition (observable, written before building)

- **Outcome (pre-registered).** The I-045 walk prompt is re-used verbatim, at 390x664 from `/` to the Dalio card, and the walker's report is saved whole.
  - **RED on live (`a61c6f61`):** the walker reports, under (5), that the phase word or the curve read as confirmation before it reached the verdict.
  - **GREEN after:** it does not. It also still answers correctly from the card, without leaving it (the I-045 bar, kept).
  - **If the RED arm comes back clean:** I-047 is not reproduced by this instrument. P3 then records that and does not build.
- **Pins (red arm before build):**
  - In the card's DOM order on every expanded card, the `[data-holds-up]` line comes before the chart `svg`.
  - The line carries the cycle's exact `holdsUpCard().detail`, computed by an independent oracle.
  - The headline is unchanged and no "→" follows it.
  - Embed: the line comes before the chart, and its frame height is unchanged.
- **Positive controls:**
  - `check-holds-up-line` stays 40/40. Its exact-headline rule may need its structure rule extended for the detail; if so, extend it deliberately and record the red arm.
  - `check-entry-folds` 320x568 stays 13/13.
  - `check-embed-snippets` stays 42/42.
  - The I-028 guard, `holdsUp.test.ts` and `bareCos` stay green.
  - The `main` innerText multiset on `/` (unfocused) is unchanged.

### Delivery and encounter checks

- **Delivery:** CI green → the deploy row reads live = head → the battery above re-runs on production, delegated to one subagent.
- **Encounter:** blind. No reader-arrival instrument exists, by standing choice (`docs/evangelism-bar.md:30`). The synthetic walk is the read (comprehension, N=1, not a real-user encounter). A real encounter is readable only through an unprompted share or mention, at N=1.

### USER-FACING: yes

Paths:
- `src/components/CycleFacet.tsx` (line order, the "why", the arrow, possibly the phase-word colour)
- `src/components/EmbedView.tsx` (only if the embed order needs a prop)
- tests under `src/lib/` / `src/components/`
- `scripts/check-holds-up-line.mjs` (only if its structure rule must admit the detail)
- `docs/walks/2026-10-15-i047.md` (internal)

No `public/*.md` mirror (the card has none). `public/llms.txt` has no count change.

### HYGIENE INPUTS

- **(a) Due rows not bearing on the choice:** 1, I-046 (dead tap on the glance-figure labels, due 2026-10-15). Read: `check-due-gates-dispositioned --snapshot`, 2 due, 53 swept.
- **(b) Owed child rows (skylark-site ledger):** none. Read: the kickoff's "rows owed to you" line (0 of 754).
- **(c) State reads marked CROSSED:** none. Read: the kickoff state block (dated gates 2, both listed above; rows owed 0; cards 0; stale-actionable 0 of 10; queued 0). missingLinkedCommits reads NOTHING SWEPT (0 of 0), which is not a clean read. Key metrics: "no list yet".

codexCalls: 0 (P1) — probed-declined

Posted as bus `b51e9d21`.

### P1 prep while the review is pending (nothing committed)

- **RED arm of the pre-registered walk: RED, so I-047 is reproduced on live `a61c6f61`.** The record is `docs/walks/2026-10-15-i047.md`, saved whole. Under (5) the walker said: "the big chart looks like a match … says 'it fits' before I reach the 'Not testable' line", and "'PEAKING' in the header is far more prominent than the verdict". It still answered correctly from the card (No) without leaving it.
- **Out of scope here, recorded for the close:** the walker also read the glance row "peaking in 2026" and the collapsed card's "PEAKING" as agreement *before* the card opens. That is input to I-046 (same figure) or a new row. The close decides which.

## Day round (2026-10-15): P3 product-work loop

[P3 — Product-work loop]

**Action: improve (I-047, verdict before the curve on the expanded cycle card), as manager review e5888aa2 APPROVED it.** The review's one sharpening was adopted: lever 4, the phase word in ink, shipped with levers 1-3 rather than gated last. This session is a NEW session in this lane: the pane closed the 10-14 evening round at 16:50Z (22461fc8) and re-opened on today's kickoff (7db217c5).

**What a reader sees now:**
- Opening a cycle on the home page (the Facets card) shows "DOES IT HOLD UP?" then the answer as plain text ("Not testable on the record that exists"), then its reason in the share card's own words ("Its paired record covers 2.0 of the 3.0 full periods this site requires before testing."), then one "Details →" link. All of this sits above the legend and the chart.
- The phase word ("PEAKING") is drawn in grey ink, not in the curve's colour, on every card.
- The single-cycle embed keeps its one-line form, moved above the chart, at the same height.

### 1. Implementation

- **Commits:**
  - `a282984`: the feature.
  - `3c70e16`: Codex r1 fixes.
  - `466d6c1`: Codex r2 fix.
  - `840a39f`: Codex r3 ceiling.
  - `8121f12`: the P1 packet and walk record.
- **Fences kept:** the headline is unchanged, the reason is `holdsUpCard().detail` verbatim, there is no new claim sentence, nothing under `public/data/spectral/` changed, and no sentence says a test ran (the I-028 guard is green).
- **Instrument:** `scripts/check-holds-up-line.mjs` now also requires, on every leg:
  - the line comes before the chart;
  - the headline is exact and is not a link;
  - the reason is exact, from a stated rule over verdicts.json and series.json, with the judged-record names written out by hand;
  - the WHOLE line's text is exact per form;
  - the phase word equals the ink token's painted bytes and is not the curve's RGB.
- **Red arms:**
  - Production `a61c6f61` before the change: 0/40.
  - Mutated build A (an arrow beside the headline, and the curve colour at 0.85 alpha): 0/40, with only the targeted legs false.
  - Mutated build B (the curve colour as `color(srgb … / 0.85)`): 0/40, with only the phase leg false.
  - Each clean build: 40/40.
- **Review:** Codex, read-only, 3 rounds, banner `workdir` = this repo every time.
  - r1 on a282984: 3 CONFIRMED (whole-line gap MED, colour-string gap MED, link name LOW), all fixed in 3c70e16. The whole-line gap was the second appearance of the 10-14 partial-match class, so the fix changed the shape.
  - r2 on 3c70e16: 1 CONFIRMED (colour serialization MED), fixed by a shape change in 466d6c1. 1 DELIBERATE (CSS `::after` text): the third round of matcher gaps, declared in NOT SEEN.
  - r3 on 466d6c1: the fix confirmed, and no right-page failure (all 10 cycle colours are 14 or more per channel from both ink tokens). 1 DELIBERATE (the site-wide ink token drifting to near-transparent), declared in NOT SEEN (840a39f).
- **Gates:** `verify-with-receipt -- npm test` TRUE exit 0, 35 files, 363 tests (receipt at 8121f12; the later commits are a checker script and its comments). Typecheck and lint are clean on the changed files. CI on 840a39f is GREEN (`check-ci-status --wait`, 59s).

### 2. Delivery

- `check-deployed-sha-drift --service sinusoidal-history` reads in-sync, live `840a39f2` = head.
- Production battery (delegated to a subagent, per this lane's recurring retro finding):
  - `check-holds-up-line` 40/40, 0 UNREAD (it was 0/40 at a61c6f61).
  - `check-embed-snippets` 42/42; the single-cycle snippet reads "content 540px in 540px, footer seen".
  - `check-entry-folds` 320x568 13/13. Perez has 5px spare and `/` has 12px, the same as before.

### 3. Encounter

Blind. The site has no reader-arrival instrument, by standing choice (`docs/evangelism-bar.md:30`). Search Console sees impressions, not card opens. There is no bug row: the absence is deliberate and recorded, as in the 10-14 receipts.

### 4. Outcome (synthetic, N=1, pre-registered): NOT HELD as the bar is written; partial movement

The walk record is `docs/walks/2026-10-15-i047.md`, with both arms saved verbatim. It used the same prompt on production 840a39f.

- **It fails the bar.** "PEAKING sits in the top-right of the card header … above the verdict … for a moment it read as 'Dalio's claim: confirmed, we're peaking.'" The colour change did not stop the badge reading as a verdict.
- **It moved:**
  - The chart misread now comes AFTER the answer, and the walker said the answer corrected it: "What corrected all this was the verdict line placed above the chart … I didn't stay misled."
  - It answered "No" from the card's first screen with no scrolling, and quoted the reason. The I-045 "why is it not testable?" residual is resolved.
- **(6), the reviewer's added question about the closed card:** "The closed card has no 'does it hold up' signal, so the verdict appears only once you tap." The home first screen likewise carries no verdict.
- **Next step for the close to disposition:**
  - (a) I-047 stays open with the phase word's POSITION and wording as its untried levers.
  - (b) The closed card's and the home figure's missing verdict signal, either with I-046 (same figure) or as a new row.
  - (c) The vocabulary goes to I-043 (10-20).
  - (d) A copy defect: `src/data/cycles.json:79`, Dalio's `short_description`, has no closing full stop. It is a one-character fix, and the walker read the sentence as cut off.

### Receipt

USER-VISIBLE: a reader who opens a cycle on the home page now meets "Does it hold up?", the answer and its one-sentence reason before the legend and chart, with the phase word in grey ink instead of the curve's colour (the single-cycle embed carries the answer above its chart too) — a282984 [proof: check-holds-up-line on production 0/40 at a61c6f61 → 40/40 at 840a39f, 0 UNREAD, check-deployed-sha-drift in-sync live 840a39f2 = head] [coverage: none — no client analytics by standing choice (docs/evangelism-bar.md:30), Search Console sees impressions not card opens · last good read n/a · founder+test excluded no] [exposure: blind — the site has no reader-arrival instrument by standing choice; no instrument row exists, none minted · bug row none]

codexCalls: 3 (P3): Codex r1 on a282984, r2 on 3c70e16, r3 on 466d6c1, each a foreground `codex exec --sandbox read-only` with the banner workdir checked
adversarialReviews: 3 — EXECUTED
hygiene helper: DISPATCHED ~18:12Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-15.md PRESENT. Its READ-MUTATED line was this lane's own checker edit made during its I-046 read (status posted); that partial I-046 read is void. Engineering-zero 0/0, and there are no expired waits.
[standing-rules-hash: 88cc2dc9]

### What remains

- I-047: NOT HELD on the phase word, so it stays open. Untried levers: the phase word's position and wording.
- The closed card and the home glance figure show no verdict (walk (6)), with I-046 or as a new row. I-046 needs a fresh read after this ship: the helper's partial read ran a half-edited checker.
- Dalio's `short_description` is missing its full stop (`src/data/cycles.json:79`).
- Waker rank 3's relaunch was refused at ~18:40Z: its pidfile names PID 35652, the rung that self-exited at max-life, and its identity read as UNREADABLE. That is benign by the skill's rule; ranks 1 and 2 are running.
