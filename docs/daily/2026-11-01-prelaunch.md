# sinusoidal-cycles — 2026-11-01 (Sunday, MT) — full day

## BLUF

Full day (the orchestrator's kickoff: "FULL day across the portfolio"). **I-070 shipped and met its close condition, live c13b646a, CI green.** On a phone, the line under the H1 read "Long-wave history, 1600–2050." That called 24 years that have not happened "history", on a site whose standing rule (I-061) is that no curve is drawn past today, and it kept naming 1600–2050 after the reader zoomed the chart to a narrower window. It now reads "Long-wave theories of history.". Live reads: only that line changed (24 → 24 lines), and the entry pages still fit the first screen, 13 of 13 at 320x568 and 360x560. Codex: r1 REJECT (3 overclaims in comments and the test, fixed), r2 APPROVE. Encounter blind (no analytics). The due read, I-037, was decided this morning: Render request logs carry no Referer (0 of 1,500 lines), so an embed encounter is blind by construction and the row closes as delivered. Section 0 is clean: CI GREEN, deploy in sync, Codex probe GREEN. Nothing waits on David.

## What changed

[P3 — Product-work loop]

**I-070 shipped and met its close condition.** Kind: improve. Manager review: APPROVE (336a9911), with one wording suggestion that was taken: no year at all instead of "since 1600".

- **Commits:** e064df6 (the line + `src/lib/phoneDek.test.ts`), c13b646 (Codex r1 fixes). CI ci.yml green on c13b646. Delivery: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live c13b646a = head.
- **Before → after, live:** the phone line under the H1 changed from "Long-wave history, 1600–2050." to "Long-wave theories of history.". `check-rendered-text diff` of this morning's production snapshot against production after the deploy: RED at line 13 only, a: "Long-wave history, 1600–2050." b: "Long-wave theories of history.". Line multiset: 24 lines, 21 distinct on both sides; `Compare-Object` lists exactly that one line out and that one line in.
- **Fold:** `check-entry-folds` on production after the deploy: 13 of 13 at 320x568 (home 12px spare) and 13 of 13 at 360x560 (home 4px spare, the margin already on record before this change). Before the push, the new text was swapped into the live page by Playwright at 320, 360 and 390: the dek paragraph stayed 24.375px and the span one row at all three.
- **Instrument:** `src/lib/phoneDek.test.ts`, 3 legs: one phone-only span in the checked source shape, its literal text carries no four-digit number, and a positive control on the old line. Red-armed twice: the old line restored → "its literal text carries no four-digit number" FAILED (`expected 'Long-wave history, 1600–2050.' not to match /\d{4}/`); restored → 3/3. Ceiling declared in its header: a source check, blind to other class orders, expression-supplied text and anything the browser renders.
- **Codex, read-only, banner `workdir` C:\dev\skylark\sinusoidal-cycles checked both rounds:**
  - r1 on e064df6: REJECT, 3 findings, all CONFIRMED, fixed in c13b646. MED: "every curve stops at today" REFUTED-AS-WRITTEN (a curve ends at min(reference peak + half a period, today), so 8 of 10 end before 2026); now "no curve is drawn past today". MED: the test claimed to pin "no year" but matched 1000–2099 in one source shape; now any four digits, and it names itself a source check. LOW: the header put the one-row fit on `check-entry-folds`, which measures the tenth overview row; now says the fit was measured once on production. The visible line HELD (all ten cycles are long-wave theories of history).
  - r2 on c13b646: APPROVE, all three FIXED, every added sentence HOLDS. Two UNVERIFIABLE-HERE items were the lane's own runs the sandbox could not repeat (vitest 3/3, the 24.375px measurement); both are recorded above.
- **Sibling sweep:** `Grep "1600[–-]2050|1900[–-]2050|to 2050|through 2050"` over `src/**/*.tsx`, `src/lib/*.ts`, `public/*.md`, `public/*.txt`. Reader-facing hits besides the dek: the desktop dek (`countWords.ts:48`, "on one 1600–2050 axis … cut at today"), `llms.txt:3` ("… cut at today"), `/methods:358` and `methods.md` ("cut at the present"), `/about:71` and `about.md:17` (past tense, "Until October 2026"). None repeats the defect. The zoom readout ("every year, 1600–2050", `brushStatus.ts`) and the `/embed/docs` range example belong to I-068 (11-03).
- **Not done:** the cos-math audit was not run, because no year-position claim was added or moved.
- **Encounter:** blind (no client analytics, by standing choice). The readable event is a Search Console impression on `/` after 11-01 (13 in October), readable about 3 days later.

<!-- findings:begin -->
- A curve's drawn period ends at min(reference peak + half a period, today), so most curves end decades before today. "Every curve stops at today" is a tempting shorthand for I-061 and is false; "no curve is drawn past today" is the true one.
<!-- findings:end -->

USER-VISIBLE: A phone reader's first line under the home H1 now reads "Long-wave theories of history." instead of "Long-wave history, 1600–2050.", so it no longer calls 2027–2050 history or names a span a zoomed chart contradicts — e064df6 [proof: check-rendered-text diff of the morning production snapshot vs production after deploy RED at line 13 only, "Long-wave history, 1600–2050." → "Long-wave theories of history.", live c13b646a in-sync per check-deployed-sha-drift] [coverage: Search Console page impressions (gsc-read.mjs) · last good read 2026-10-31 · founder+test excluded no] [exposure: blind — no client analytics by standing choice, a phone reader of the line leaves no trace · bug row I-070]

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-070. The phone header stops saying "1600–2050": no span past today, and nothing that reads as the chart's window after a zoom.
- **User problem, in a reader's words:** the first line a phone reader gets under "Ten cycles, one axis." is "Long-wave history, 1600–2050." The site says every curve stops at today (I-061, David 2026-10-21: "one wave per cycle, stop at today"), yet its own header calls 2027–2050 history. After a zoom, the header still says 1600–2050 while the chart shows another span, so the reader is shown two different spans as "the chart's years". The bar names what breaks the moment: "any sentence that overclaims" (`docs/evangelism-bar.md`).
- **Evidence:**
  - OBSERVED · source, this morning's tree (HEAD = live): `src/app/(app)/page.tsx:63` `<span className="sm:hidden">Long-wave history, 1600–2050.</span>`. The span comes from `DEFAULT_YEAR_RANGE.end = 2050` (`src/lib/siteConfig.ts:15`). The I-070 row's 10-29 readCommand stamp says the same.
  - OBSERVED · I-070 origin: the I-066 cold walk (synthetic, N=1, 2026-10-25), residual named in manager review f845a41f ("the phone header still says 1600–2050 after a zoom"). A synthetic walker, not a real reader.
  - OBSERVED · sibling I-068 (same walk family): the zoom readout says "…–2050" though every curve stops at today. Same root (`end: 2050`), but the readout is client-side and a fix there runs into I-061's no-present-position rule. **Not in today's scope**; it keeps its 11-03 date.
  - OBSERVED · `end: 2050` reaches URL ranges (`urlState.ts:71`), presets, embeds (`EmbedView.tsx:32`), the OG card (`og/route.tsx:565`), `/about:71`, `/methods:358` and the desktop dek (`countWords.ts:48`, which already says "cut at today"). Moving the axis end is a multi-surface change with URL consequences, so **today changes the phone line only**, not the axis.
  - OBSERVED · Search Console, last whole read 2026-10-31 (`gsc-read.mjs --start 2026-10-01`, page-grouped): `/` 13 impressions in October. The home page is reached from search, and the phone line is its first sentence after the H1.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` exit 0: "no product-love cycle picks this lane today; run the normal P3". `answered-cards`: no David-word cards.
  - MISSING · real-user evidence. The bar reads UNMEASURED (no client analytics, by standing choice). The evidence here is a synthetic walk plus source.
- **Prior-retro finding that bears on this:** 10-31 retro Q0 (still on discipline): "prose that describes an interaction needs its own source check". The replacement line must make no claim about what the chart does on zoom unless the source shows it.
- **Permission:** I-070 is an open P3 issue owned by this lane, not parked, frozen or waiting, with no card. It's copy on the lane's own home page, so the lane decides it. It's published under the site's name, so portable rules 3 and 6 require a Codex claims pass before push. The line's one-line-at-320 budget came from the 9/24 fold work (`check-entry-folds`), so the replacement must keep it.
- **Next action:** kind = improve. First command, the pre-change snapshot of the server-rendered home text (the dek is server-rendered, so this gate sees it):

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/ C:/dev/skylark/sinusoidal-cycles/tmp/i070-home-before.txt
  ```

  Then: write a replacement that names the subject with no end year past today and no span a zoom can contradict (the candidate shape is "Long-wave history since 1600.", to be checked by Codex and against the fold), and add a source-pinned test that refuses a year after the current one, or "2050", in the phone dek. Red-arm the test by restoring the old line. Then run `check-entry-folds` at 320x568 and 360x560, then the Codex claims pass (read-only, foreground pipe, banner workdir checked).
- **Acceptance condition:** I-070's `closeWhen`: "A reader who zooms on a phone is not shown two different spans as the chart's years (the dek no longer reads as the chart's current window, or it follows the window), proved by one pre-registered cold walker or a source-pinned test". Observable: production `/` at 390 shows the new line, with no "2050" in the phone dek; the rendered-text diff shows only that line changed; the pinned test goes red on the old line and green on the new one; `check-entry-folds` keeps 13 of 13 legs at 320x568 and 360x560.
- **Delivery and encounter checks:** delivery: `check-deployed-sha-drift --service sinusoidal-history` in sync on the fix sha, then `check-rendered-text diff` built vs production on `/`. Encounter: blind (no analytics). The readable event is a Search Console impression on `/` after the deploy date, readable about 3 days later; `/` ran at 13 per month, so N≈1 by 11-04. Exposure will read blind.
- **USER-FACING: yes.** Paths: `src/app/(app)/page.tsx`. Internal: a new or extended test (a sibling of the existing page tests), `continuity/items.json`.
- **HYGIENE INPUTS:**
  - (a) Due rows that don't bear on the choice: 1, from this morning's snapshot ("snapshot written — 1 gate(s) due on/before 2026-11-01"): **I-037**. Its readCommand ran this morning: `check-embed-snippets.mjs https://sinusoidalhistory.com` → **42/42 PASS**. Its closeWhen's encounter leg was also read this morning: a scratchpad probe over the Render logs API, the last 30 days backward, 1,500 request lines with 21 on `/embed*`. Field names only: labels `resource, method, statusCode, host, path, level, type`; message keys `clientIP, requestID, responseTimeMS, responseBytes, userAgent` (+`step` on 23). Lines mentioning referer/referrer: **0 of 1,500**. Per its closeWhen ("if they do not, close this row as delivered with the encounter blind by construction"), the proposed disposition is **close as delivered**, with the read output stamped into `continuity/read-outputs/I-037.txt` (the snapshot warned the row records no read output).
  - (b) Owed child rows in the orchestrator's ledger: none (kickoff read "rows owed to you": 0 of 781).
  - (c) State reads marked CROSSED: none. Read: dated gates (1 owed, in (a)), rows owed 0, board cards 0, queued rows 0, stale-actionable 1 of 18 (no CROSSED marker), missingLinkedCommits swept nothing.

## Close

[P5 — Delta-only close]

ACTION: COMPLETED · item I-070 · P3 541268c7

- **State since the P3 post:** live moved c13b646a → b76ea61c (docs-only; `check-deployed-sha-drift` in-sync, manager-verified c13b646 is an ancestor). The receipt is unchanged.
- **Hygiene draft:** 1 line — 1 accepted · 0 amended · 0 rejected. I-037 closed as drafted. READ-MUTATED, quoted: "READ-MUTATED I-037 src/lib/phoneDek.test.ts — NOT named in the readCommand: may be the lane's own concurrent P3 edit; lane checks". It was: this lane's own new test file. check-wait-justification: PASS (32 of 80 carry it, 0 warn). check-engineering-zero: PASS (0 findings, 0 unreadable).
- **Ledger delta:** I-037 closed (delivered; encounter blind by construction). I-070 closed (source-pinned-test arm met; linkedCommits e064df6, c13b646). W-006 notes: now also carries I-070's encounter leg, / impressions dated 2026-11-02 or later, read 11-03, re-check 11-05 if no 11-02 row yet.
- **Due gates:** `check-due-gates-dispositioned.mjs` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-01).
- **Pending reads:** W-006 2026-11-03 (I-072 + I-070 legs). I-068 2026-11-03 (zoom readout).

## State Appendix

### Section 0

- Step 0 primer: `docs/cold-starts/2026-10-31.md` (written yesterday; no 2026-11-01 file). First action taken (the snapshot).
- Step 0.5 listener: 🟢 SSE alive (restart 2026-11-01T15:34:44Z, slug sinusoidal-cycles, hello + replay-complete 0) + `/loop-tick 2m` armed by ScheduleWakeup; waker ladder ranks 1-3 running.
- Step 0.6 Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line is the probe).
- Step 0.7 CI: `check-ci-status --repo-dir C:/dev/skylark/sinusoidal-cycles --workflow ci.yml` → GREEN on b9d73a79b2. Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live b9d73a79 = head.
- Step 0.8 context: primer, bar and the selected rows only.
- Step 0.9 North Star: retention + word of mouth; today's ship is unmeasured (bar reads UNMEASURED).
- Step 0.10 recs yesterday: one, the I-072 P1 packet → **executed** (I-072 closed 10-31, live 1b0681e6).
- Step 0.11 harness: running 2.1.316 · fleet UNIFORM (27 of 27) · installed 2.1.316 (SAME).
