# Daily report — 2026-10-17 (Saturday, MT)

## Round 1 (2026-10-17): P1 selection packet

[P1 — Evidence and choice]

**Outcome (I-048 closed-card half + I-050):** a first-time reader who scrolls to Ray Dalio's closed card on `/` sees a theory nobody has confirmed, not a curve saying it is peaking now, and the cycle's name reads whole at 320px. The user problem, in the 10-16 walkers' words (B2/B3, `docs/walks/2026-10-16-i052-i048.md`): after scrolling to the closed Dalio card, both read its "CURVE · PEAKING" tag and its chart (a gold crest at the unlabelled dashed line) as leaning toward "peaking now". They only corrected on the verdict line under the name.

### Section 0
- **Session state:** fresh pane after a clean close (e743fb3). Primer `docs/cold-starts/2026-10-16.md` read (no 10-17 primer exists). Listener: SESSION START 14:18:34Z, hello received, slug sinusoidal-cycles. Waker ranks 1-3 running. Rank 1 exited on purpose at 14:40Z to wake this pane and was relaunched. Loop armed by ScheduleWakeup. `git pull`: already up to date.
- **Codex:** GREEN per the kickoff's `[codex-probe:]` line (14:16Z, execute and write proved).
- **CI and drift (Step 0.7):** `check-ci-status --workflow ci.yml`: GREEN for e743fb3f4d (exit 0). `check-deployed-sha-drift --service sinusoidal-history`: in-sync, live e743fb3f = head (exit 0). No stop.
- **Harness (Step 0.11):** `check-claude-build --panes`: fleet SKEW (27 panes on 2.1.302, 1 on 2.1.301) · installed 2.1.302 (AHEAD of the 09-18 record, 2.1.277). This pane's own build is not separated out by that read. It is a read only, not a stop.
- **Rotation:** `check-cycle-rotation --lane sinusoidal-cycles` exit 0: "no product-love cycle picks this lane today … run the normal P3".
- **Dated gates:** `check-due-gates-dispositioned --snapshot` (taken once, 14:4xZ): "2 gate(s) due on/before 2026-10-17": I-048 and I-050. Both are today's choice.
- **Recs yesterday (Step 0.10):** `docs/daily/2026-10-16-prelaunch.md` has no Recommendations block (the 3-stage day writes none). The evening close's dated reads: I-048 + I-050 → carrying today → P3 (this choice). I-043, I-046, I-027, I-034, I-049 are dated 10-20 and are not due.
- **Recurring retro finding that bears on this:** 10-16 Q6, "most tokens for the least return: Codex r12 plus the second checker rework". Applied here: the new sweep claims only geometry (truncation by scrollWidth, presence of a phase tag and a now-line in the closed card). It does not judge paint. If a second review finds the same defect class, I narrow it rather than add a matcher.

### Evidence
- **OBSERVED, regression read (production, today):** `check-glance-now-mark https://sinusoidalhistory.com`: "OK: 2 of 2 viewports show no now-mark on the glance figure's first screen" (390x664 and 320x568, rings 0 · now-lines 0 · current-year labels 0). The glance half is still done.
- **OBSERVED, synthetic N=1 per walk (not users):** walks B2/B3 (10-16, production 1b6d3c0) HELD on the home first screen. After scrolling, both leaned toward "peaking now" on the CLOSED Dalio card, reading the header tag and the chart together. The same pattern held on walks A4/A5/B: whenever a drawn 2026 position or a phase word is in view without the verdict ahead of it, readers take it as agreement.
- **OBSERVED, source:** the tag is `FacetHeader` in `src/components/CycleFacet.tsx:298-308`, `curve · {phaseLabel}` with `data-phase-position`, rendered whenever `mode !== "expanded"`. It is `whitespace-nowrap flex-shrink-0`, so the name span (`truncate`, :248) is what gives way at 320px. That is I-050's truncation, and it lives in the same element. The card chart draws a dashed current-year line at `CycleFacet.tsx:547-556`. The expanded card already carries the phase BELOW the answer (:158-162, I-047), so this change takes nothing from the opened card.
- **OBSERVED, dependency:** `scripts/check-holds-up-line.mjs:205` reads `[data-phase-position]` inside each facet for its ink-colour leg. If the closed card loses the tag, P3 must check that the leg reads the expanded card's element or refuses openly. It must not pass vacuously. This is a positive control (46/46), so how it behaves on a missing element is part of the change.
- **HYPOTHESIS:** with no phase word and no drawn current year on the closed card, the card shows a name, a verdict and a theory shape on a time axis. The "peaking now" reading then has nothing to land on, and the freed width lets the name fit at 320px.
- **MISSING:** any real-user read of `/`. There is no client analytics by standing choice, and the evangelism bar reads UNMEASURED (`docs/evangelism-bar.md`, `metricReady: false`). Search Console has 0 clicks to date. Its next read is 10-30 (I-051).
- **OBSERVED, RED before (production e743fb3, taken in prep after the P1 post 5f9daa62):** `scripts/check-closed-card-header.mjs` (new, uncommitted). `--selftest` 12/12.
  ```
  MARKED  https://sinusoidalhistory.com/ @ 390x664  tags 10 · now-lines 10 · cut names 0 · of 10 cards
  MARKED  https://sinusoidalhistory.com/ @ 320x568  tags 10 · now-lines 10 · cut names 1 (dalio) · of 10 cards
  RED: 0 of 2 viewports show no phase tag, now-line or cut name on a closed card
  ```

### Permission
- I-048 and I-050 are open lane rows with no park and no board card (`answered-cards` at kickoff: 0 for this lane). The orchestrator lead (e818a684 round-3 close, carried into this kickoff) names this ONE job and the rule: "claim less (drop the drawn position or the phase word), never reword it."
- Fences: never a forecast; never "a test ran" (I-028 guard); the holdsUp.ts headlines and the verdict line are not reworded; the expanded card's below-the-answer phase line (I-047) stays.

### Next action — improve
- **Change:** on the CLOSED (and collapsed) card only, claim less. (1) Remove the `curve · {phase}` header tag. (2) Remove the dashed current-year line from the closed card's chart. The expanded card keeps both, where the phase already sits under the answer.
- **Name at 320px:** the freed width should end the truncation. If the sweep still finds one, the fix is layout only (no wording change to names).
- **Untouched:** the verdict line under the name, the glance figure, the claim pages, `/state`, the embed snippets' promised text (check-embed-snippets is a control).

First command (the RED read: an inline Playwright sweep in prep that becomes `scripts/check-closed-card-header.mjs`, run against production before any change):
```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-closed-card-header.mjs https://sinusoidalhistory.com
```

### Pass bar (written before building)
- **RED before:** across the 10 closed cards on production at 320x568 and 390x664, the sweep counts truncated names (`scrollWidth > clientWidth` on the name span), closed-card header tags giving the curve a phase (`[data-phase-position]` outside an expanded card), and current-year lines in closed-card charts. Expected: phase tags 10 per viewport, now-lines 10 per viewport, at least one truncated name at 320 (Dalio, per I-050).
- **GREEN after, on production:** 0 truncated, 0 phase tags and 0 now-lines at both viewports. A pre-registered cold walker (added to `docs/walks/` before the build) who scrolls to the closed Dalio card without tapping does not read "peaking now" or the site agreeing.
- **Positive controls, on production:** `check-glance-now-mark` 2 of 2 CLEAN, `check-entry-folds` 320x568 13/13, `check-holds-up-line` 46/46 (or a stated change in its denominator if the closed-card phase leg is retired, never a silent pass), `check-embed-snippets` 42/42.
- **Red-proof:** put the tag back on the local build and the sweep goes RED. Restore it, and the tree is clean.
- **Delivery:** full `npm test` before push, then a Codex read-only round before push (codexCalls and adversarialReviews reported as separate lines); CI green on the pushed sha; drift in sync; then the sweep and controls on production.
- **Encounter:** at this traffic, no arrival is the expected reading, and there is no instrument that would see one. Exposure will be `blind`, naming the bar's UNMEASURED state.

USER-FACING: yes. Paths: `src/components/CycleFacet.tsx` (FacetHeader tag, closed-card chart now-line), `scripts/check-closed-card-header.mjs` (new), `scripts/check-holds-up-line.mjs` (phase leg, if it moves), any test pinning the closed-card tag, `docs/walks/2026-10-17-*.md`.

### HYGIENE INPUTS
- (a) Due rows not bearing on the choice: none. Both due rows (I-048, I-050) ARE the choice. Source: the `--snapshot` read above, "2 gate(s) due". I-048's readCommand has never been stamped (READ_NEVER_RUN WARN). Today's clean `check-glance-now-mark` run is that read, and it gets stamped through `--run I-048` at close.
- (b) Owed child rows: none. Source: the kickoff's "rows owed to you in skylark-site's ledger: 0 of 754".
- (c) CROSSED state reads: none. stale-actionable 0 of 13; missingLinkedCommits NOTHING SWEPT (0 of 0); queued rows 0; board cards 0. The harness read is SKEW (a read, not a gate) and is noted under Section 0.
