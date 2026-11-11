# sinusoidal-cycles — 2026-11-11 (Wednesday, MT)

## BLUF

P1 picks **I-068**: on any recent window the zoom strip says "showing 1900–2050" and "Chart now shows 1900–2050", though since I-061 no curve is drawn after today. The 10-24 cold walker asked "what is being drawn for 2026–2050". This is the row's sixth look and the banner says decide, so P3 makes the wording change the row's closeWhen allows: the readout and status line say nothing is drawn past today, pinned by a red-armed source test. The axis stays at 2050; the reason is recorded on the row. Section 0 is clean: CI green on b057ec71, deploy in sync, harness uniform. I-080's crawl read is done: 10 crawler fetches of the reworded text files after the 11-07 deploy, all classed "other bot". The row's own rule closes it at the close.

## What changed

**P3 shipped I-068 (live 854c8825, CI ci.yml green on 854c8825c0, deploy in sync).** The range readout used to read "showing 1600–2050". It now reads **"1600–2050 · nothing drawn after 2026"**, and **"1600–2050 · none drawn after 2026"** under 345px. It says this on every load, every preset and every URL window that ends after the current UTC year. After a gesture the line under the strip adds "Nothing is drawn after 2026." The axis stays at 2050.

- The manager review (22f7531a) REDIRECTED the packet. The note goes in the readout, which a no-drag first visit sees; the status line was not enough. The words are "nothing drawn after 2026", not "curves stop at today", which is false for 8 of 10 cycles.
- Commits:
  - 0042ee4: the note (`src/lib/brushStatus.ts`, `src/components/TimeRangeBrush.tsx`, `src/components/Viz.tsx`) and its tests.
  - a9452f5: Codex r1 fixes, the production checker and the data-date pins.
  - 854c882: Codex r2 fixes, one breakpoint and every Modern readout asserted.
- **Wording, measured before choosing.** Candidates were set in place on production at 320 to 414px. "showing 1600–2050 · nothing drawn after 2026" pushed the readout off the "Range" label's line at every phone width (+24px). Dropping "showing" keeps it on the line from 339px up (it wraps at 338px). The "none" form fits at 320px. The switch sits at 345px for slack, and Tailwind 4 compiles `max-[345px]` to `width < 345px`.
- **Round 0** (Sonnet helper, about 30 lines). Every curve goes through `sampleDrawnPeriod`, calibrated ones included. No series the chart loads has a row after 2025. The latest event marker is 2020. Only axis ticks and labels run to 2050. Positive control for the CSV grep: 50 rows dated 2020–2026 matched, 0 dated 2027 or later.
- **Tests, red-armed.** The wording and helper legs went 8 of 21 red on the old code and green after. The Viz-year pin first passed on the old code, because its lazy regex crossed into a later element. It was tightened and then went red. The two data-date legs went red with one event and one CSV row set to 2099, then the files were restored. The breakpoint pin went red with the checker set to 340. 24 of 24 now pass.
- **Codex, 3 read-only rounds (gpt-6-astra).** The banner `workdir` matched each time.
  - r1 on 0042ee4: `check-brush-widened.mjs` read the readout by "showing", so it would go RED after the deploy. CONFIRMED, fixed in a9452f5. r1 also noted that the claim rests on the data files' contents, so the data-date pins were added.
  - r2 on a9452f5, two findings, both CONFIRMED and fixed in 854c882. First, the checker's 340 against Tailwind's `width < 339` would give a false RED at 339px. Second, the Modern readouts were recorded but never asserted.
  - r3 on 854c882: no findings.
- **Production after deploy** (`check-deployed-sha-drift --service sinusoidal-history --wait`: live 854c8825 = head):
  - `check-brush-widened` at 390x664 and at 320x568: PASS. On both, 2 of 2 first loads (no tap) read the note, and 0 of 3 Modern readouts are wrong. Red arm on b057ec71 this morning: "0 of 2 first loads".
  - In-page read at 320, 344, 345, 360, 390 and 1440px: one form per width ("none" at 344, "nothing" at 345), on the label's line. Row heights and caption positions are unchanged from before the deploy.
  - `check-entry-folds` at 320x568: 13 of 13, `/` with 12px spare. That is the same before (re-measured this morning on b057ec71) and after.
  - `check-strip-near-chart`: 131px at 390x664 and 9px at 360x560, both unchanged.
  - `check-holds-up-line` 46/46 PASS with 0 UNREAD. `check-embed-snippets` 42/42 PASS.
- **Encounter:** blind. The site has no client analytics, by standing choice (card 1e069bb4). Search Console for 11-04 to 11-11 shows 13 impressions and 1 click site-wide, with 4 impressions and 1 click on `/`. It lags, so none of it can be dated after this deploy. The outcome stays open.

<!-- findings:begin -->
- **The manager review's redirect held up when measured.** A no-drag first visit never sees the status line. The readout is the surface that every load renders.
- **Tailwind 4 arbitrary `max-[Npx]` is `width < N`, not `≤ N`.** Codex r2 read this in the installed source. Any checker that mirrors a breakpoint must use the same strict inequality, and `brushStatus.test.ts` now pins the two numbers together.
- **The note's truth depends on the data files.** Neither `parseCsvSeries` nor the event layer caps at the current year. The data-date legs make a row or event dated after it fail CI, before the readout can say something false.
<!-- findings:end -->

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-068: a recent zoom window says it shows "…–2050" but does not say that nothing is drawn after today. Kind: improve.
- **User problem, in a reader's words:** "Any recent window runs to 2050, past today. A reader may wonder what is being drawn for 2026–2050." That is the I-064 cold walker on production 98e9b557 (`docs/walks/2026-10-24-i064.md`, synthetic N=1), quoted on I-068's description. Behind it is the bar's problem: "I can't tell whether any of it holds up or is just a good story" (`docs/evangelism-bar.md:14`, HYPOTHESIS). An axis that seems to promise 24 years of future reads as a forecast on a site that says "not prophecy".
- **Evidence:**
  - OBSERVED · source, read today. `src/lib/siteConfig.ts:13-16` gives `DEFAULT_YEAR_RANGE.end = 2050`. Every preset ends there (`siteConfig.ts:28-50`: All 1600–, Industrial 1750–, Modern 1900–).
  - OBSERVED · source, read today. The zoom readout is `showing {visibleStartYear}–{visibleEndYear}` (`src/components/TimeRangeBrush.tsx:189,209`). The post-gesture line is "Chart now shows {start}–{end}" or "Chart now shows every year, {start}–{end}." (`src/lib/brushStatus.ts:83-86`). Neither one says the curves stop at today. `brushStatus.test.ts:85,96-97` pins the current strings.
  - OBSERVED · I-061 ("one wave per cycle, stop at today", David 2026-10-21, quoted in AGENTS.md): every curve goes through `sampleDrawnPeriod` and is cut at the current year. The OG card already says "cut at today · {start}–{currentYear}" (`src/app/og/route.tsx:215`). So the strip is the one surface that names the 2050 end without the cut.
  - OBSERVED · I-068's readCommand, `src/lib/siteConfig.ts:15 end: 2050`. The last stamp, 11-10, has the same sha 8b15d49306bdd611 as 11-03 and 11-06. That is five re-dates with nothing moved.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles`: "no product-love cycle picks this lane today", exit 0.
  - MISSING · `docs/evangelism-evidence.md` does not exist. The bar's metric reads UNMEASURED (`docs/evangelism-bar.md:30`). There are no client analytics, by standing choice.
  - MISSING · any real reader on this strip. The only source is one synthetic walker.
- **Why the wording route and not the axis end:** closeWhen allows "the readout or axis says so, or the axis ends at today … or a recorded decision to keep the 2050 axis". Moving the axis end is a broad change: `DEFAULT_YEAR_RANGE.end` feeds the chart, embed (`/embed/docs` documents `1900-2050`), OG route, URL range parsing and clamping (`urlState.ts`), `/methods` prose ("The chart's axis runs 1600–2050", `methods/page.tsx:357`) and its `public/methods.md` mirror, `countWords.ts:48`, and about 15 test files. Keeping the axis while saying where the drawing stops answers the walker's question with a one-file copy change. The recorded keep-2050 reason: the space to the right of today keeps the newest crests (Dalio's 2025 repeat, the 2029 high crest, `TimeRangeBrush.tsx:12`) off the right edge, and embed URLs carry `1900-2050` ranges.
- **Why this over the other due and near-due rows:** I-080 is due today but is a delivery read on text that has already shipped, not a reader change (hygiene, below). I-077 and I-078 are due 11-12. I-075 is a wording decision for a caption at its 33-character ceiling. I-068 is the row the banner names for decision today.
- **Prior-retro finding that bears on this** (11-10 Q0, still on discipline): "round 0 before the first commit for reader-facing text". This change adds reader-facing text, so P3 runs round 0 (the claims pass) on the new words before the first commit.
- **Permission:** I-068 is `open`, P3, owner sinusoidal-cycles. Lane copy in a lane-owned component and lib, inside the row's own closeWhen. No open card names it (`answered-cards --project sinusoidal-cycles`: none). I-061 binds the words: they may say the curves stop at today, but may not give a position on any cycle.
- **Next action:** kind = improve. First command, the existing status-line test as the baseline before the new legs:

  ```
  npm --prefix C:/dev/skylark/sinusoidal-cycles test -- src/lib/brushStatus.test.ts
  ```

- **Acceptance condition:**
  1. After a gesture to a window ending in 2050, the status line says that no curve is drawn after today. It does that either by naming the cut year from the current year, never hard-coded, or by saying "today". `brushStatus.test.ts` pins it, red on today's strings and green after.
  2. The `showing` readout, or the line under it, makes the same point for a window that was set without a gesture (a preset tap or a URL range). P3 measures the phone fit before choosing between changing the readout and leaving it alone. If the readout is left alone, the reason is written down.
  3. `check-entry-folds https://sinusoidalhistory.com --width 320 --height 568` still reads 13 of 13 OK, and `/` keeps its 12px spare, on production after deploy. The readout shares the "Range" label's line on a phone (`TimeRangeBrush.tsx:205-209`), so a longer readout must not wrap it onto a new line.
  4. The claims hold: the words name no position on any cycle (I-061), and round 0 has run on them before commit.
  5. I-068's ledger row records the keep-2050 reason and is closed on the wording pin.
  6. No regression: `check-holds-up-line` and `check-embed-snippets` pass on production after the deploy.
- **Delivery and encounter checks:** delivery means `check-deployed-sha-drift --service sinusoidal-history --wait` reads in sync on the fix sha, followed by an in-page read of the strip on production: tap Modern, read the status line and readout text, and measure the readout's line count at 320x568. The strip renders client-side, so `check-rendered-text` cannot see it (`docs/rendered-text-gate.md`). Encounter: blind. The site has no client analytics, so no event would appear at any N. Outcome stays open.
- **Key number:** the `/` first-screen spare at 320x568 measures whether any first-screen word wraps. It was last measured 11-10 (12px, I-075's stamp) and has not been re-measured this round. P3 measures it before and after.
- **USER-FACING: yes.** Paths: `src/lib/brushStatus.ts` (the status line), and possibly `src/components/TimeRangeBrush.tsx` (the readout). Internal: `src/lib/brushStatus.test.ts`, `continuity/items.json`, `docs/daily/`. If P3 touches the `/methods` axis sentence, `public/methods.md` changes in the same commit (the prose-mirror rule).
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice, 1: **I-080** (crawler fetches of /llms.txt, /about.md or /methods.md after the 2026-11-07 18:17Z deploy). Its onTrigger read, `crawl-read.mjs --days 7`, finished at about 08:40 MT. It read 14,967 log lines, 1,437 from known crawlers, in a window from 2026-11-04T15:30Z to 2026-11-11T14:48Z. After the 2026-11-07 18:17Z deploy there were **10 fetches with status 2xx**, all classed "other bot":
    - /llms.txt ×7: 11-07 22:58Z, 11-08 20:47Z, 11-09 02:41Z, 08:26Z and 21:50Z ×2 (one more was a 308), and 11-10 03:44Z.
    - /about.md ×2: 11-08 22:07Z and 11-09 08:26Z.
    - /methods.md ×1: 11-09 02:34Z.

    The onTrigger rule is "at least one fetch: close the row as delivered to a crawler", so the hygiene draft closes I-080. Two limits apply. No named AI crawler (GPTBot, ClaudeBot, PerplexityBot) fetched these three files in the window. And a fetch shows delivery to a crawler, not that any reader saw the text. Its readCommand stamp from 11-07 came back empty (exit 1, the `[READ-OUTPUT] WARN` in the snapshot). Source: `check-due-gates-dispositioned --snapshot` → "1 gate(s) due on/before 2026-11-11" (88 rows swept).
  - (b) owed child rows: none. Read: the kickoff's skylark-site ledger read, "0 of 810 considered".
  - (c) state reads marked CROSSED: none. Read: every kickoff state read. The non-zero ones: dated gates 1 of 1 unread at compose (above); answered cards 0; prior-day retro 1 Q0, 9 still-on-discipline and 1 carried (I-068, the selection itself); report artifact PENDING (this file); key metrics "no list yet" (not measured, not 0); queued rows 0; stale-actionable 0 of 13; listener 0 no-loop warnings since today's session start.

## State Appendix

### Section 0 (2026-11-11, ~08:20 MT)

- **Primer:** `docs/cold-starts/2026-11-10.md` (no 11-11 file). Its first action, the snapshot, is done: 1 gate due (I-080).
- **Listener:** SSE alive (hello 15:08:17Z, pid 32848, slug sinusoidal-cycles), loop armed by `ScheduleWakeup`, waker ladder ranks 1–3 running.
- **Codex:** GREEN per the kickoff's `[codex-probe:]` line (15:09Z, execute and write). No dispatch at P1.
- **CI / drift (P0 hard stop):** `check-ci-status --workflow ci.yml` → GREEN on b057ec714f. `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live b057ec71 = head. Passed.
- **Harness:** running 2.1.322 · fleet UNIFORM (28 of 28) · installed 2.1.322 (SAME).
- **Recs yesterday:** one, the I-076 selection. Executed: I-076 closed, live eeab357d (11-10 report, Close).
- **North star:** retention and word of mouth. Today's ship moves no measured metric, so it will be reported as unmeasured.

### Close

ACTION: COMPLETED · item I-068 · P3 5cabbd2d

- **Since the P3 post:** the manager review (9497a73c) read COMPLETED and found no defects. Production is unchanged, live 854c8825, so the P3 receipt still holds and no new receipt is written.
- **Ledger delta** (`continuity/items.json`, via `continuity-edit`):
  - **I-068 closed** on the closeWhen's source-pinned-test leg, with the 2050 axis kept. The keep reason is recorded: the newest crests stay off the right edge, and embed URLs carry 1900–2050.
  - Its readCommand was re-pointed from the `siteConfig.ts` grep to `npm test -- src/lib/brushStatus.test.ts`, and `--run I-068` passed (exit 0, 24 of 24, stamped).
  - linkedCommits: 0042ee4, a9452f5, 854c882.
  - The red arm is recorded as counts only. The raw red outputs were not saved to files.
  - **I-080 closed** as delivered to a crawler, per its onTrigger. Its note holds the crawl read: `crawl-read --days 7`, window 11-04T15:30Z to 11-11T14:48Z, 10 fetches with status 2xx after the 11-07 18:17Z deploy, all "other bot", with no named AI crawler. The raw output is committed as `continuity/read-outputs/I-080-crawl-2026-11-11.txt` (0 IPv4-shaped strings).
- **Hygiene draft:** 1 line — 0 accepted · 1 amended · 0 rejected. The I-080 close was AMENDED: the note now comes from a file, and the raw output is committed beside the row.
  - READ-MUTATED: "none — 1 read guarded (I-080). HEAD b057ec7 before and after."
  - check-wait-justification: "RESULT: PASS — 32 of 88 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". No wait was touched after the helper ran.
  - check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable (exit 0)".
- **Verify:** `check-due-gates-dispositioned` reads "verdict: CLEAR — every gate due at Phase 0 was dispositioned." The snapshot is CURRENT (taken 2026-11-11), 1 of 1.
- **Pending reads:** 11-12 I-077, I-078. 11-13 I-075. 11-15 I-049. 11-16 I-051. 11-17 I-081. 11-18 I-071. 12-01 I-025, I-042, I-073. 2027-01-04 W-005.
