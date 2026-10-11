# Daily — sinusoidal-cycles — 2026-10-10 (Saturday, MT)

## P1 — Selection packet

[P1 — Evidence and choice]

**Outcome:** on the two cycle pages whose verdict is judged on a different cut of the paired series (Turchin, Kondratiev), the "Paired data" line says what the verdict was judged on, right where the question comes up, and links to the reason.
**Item:** the W-004 cold walk's ranked finding 2 (`docs/walks/2026-10-09-w004.md` § "Up to three more", item 2), carried in the closed I-028 row's notes and the 10-09 primer's "Carried from the walk". No ledger row exists yet. **I-030 is minted at build time** (yesterday's P1/P3 pattern).

**The user problem, in the walker's words:** "The question arises at the Paired data line (y 919). The reason is 1,593 px below it, about 1.8 screens… Nothing at y 919 points down to it." On a phone: "the reason is almost five screens from the top and more than three screens past the line that raises the question."

### Evidence

- OBSERVED (synthetic): W-004 cold walk · one headless agent · 2026-10-09 · /cycles/turchin: desktop 1440x900, "Paired data" at y 919, "Why two labels" at y 2512 (Δ 1,593 px). Phone 390x664: y 1049 → y 3253 (Δ 2,204 px). Limit: N=1, synthetic. The walker also said "as a cold reader I would probably not have asked the question", so this is a reach fix, not a misread fix.
- OBSERVED (source read, today): `src/app/(app)/cycles/[id]/page.tsx:330-335` renders `Paired data` as `series.legend_short ?? series.name`, with no reference to the judged cut. The reason paragraph renders at `:545-549` inside `#spectral-verdict` with no id of its own. `src/lib/testedSeries.ts` carries the judged-series name for exactly two verdicts (`us_tfp_growth_annual` for Kondratiev, `wid_top1_wealth_1913` for Turchin).
- HYPOTHESIS: Kondratiev has the same gap (the chart draws the 5-year rolling average, the verdict uses the annual figures). The walk did not measure the distance on that page. The build measures both.
- MISSING: any real-user read. The site has no client analytics, by standing choice. The last whole GSC read (2026-09-09) was 59 impressions and 0 clicks. The bar (`docs/evangelism-bar.md`) reads UNMEASURED.
- Prior-retro finding that bears on this: "a check written from a measurement inherits its looseness" (10-09, still on discipline). So acceptance is judged on rendered positions read live, not on a matcher written from today's numbers.

### Permission

Copy and layout on two cycle pages. This is lane-owned product work. No row is parked, waiting or frozen, and no card is open (answered-cards: none, 2026-10-10). It touches nothing on the primer's don't-touch list (`public/data/spectral/`, `FigureScroller.tsx`, `HashLink.tsx` itself, the /state bands). /methods is held for the 10-13 walk and is not touched.

### Next action

**Kind:** improve. Add a fourth entry to the stats `<dl>` (`page.tsx:321`), "Judged on", shown only when `tested` is set. It names `tested.name` and links with `<HashLink>` (in-page jumps must use it, and lint enforces that) to a new `id="why-two-labels"` on the reason paragraph. The entry is wording only and states no result: the guard from I-028 (no "test ran") applies.

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/turchin C:/dev/skylark/sinusoidal-cycles/tmp/turchin-before.txt
```

(Baseline snap of both pages before the edit. Kondratiev follows the same way.)

### Acceptance condition (observable, live)

1. On live /cycles/turchin and /cycles/kondratiev, at 1440x900 and at 390x664, an element reading "Judged on" plus the judged-series name sits within one line of "Paired data". The page y difference is ≤ 40 px desktop and ≤ 80 px phone (the dl wraps on a phone), read with Playwright `getBoundingClientRect().top + scrollY`.
2. Activating it moves the "Why two labels" paragraph into the viewport, and Back returns to the stats line. This is the HashLink contract, read in the same Playwright run.
3. The other eight cycle pages render no "Judged on" entry. The rendered-text diff for them is GREEN against production.
4. The first-screen fold does not move: `scripts/check-entry-folds.mjs` reads the same result as before (the dl sits below the first screen on both viewports, at y 919 and y 1049).
5. The I-028 no-test-ran guard and `npm run typecheck`, lint and test pass. CI is green and the deploy row reads live on the pushed sha.

### Delivery and encounter checks

- Delivery: the Playwright read above, run against production after the deploy row reads live. The result goes in the P3 receipt.
- Encounter: the 10-13 W-004 walk (already scheduled for I-029) gets one added step on /cycles/turchin: "what was this verdict judged on, and why does it differ from the Paired data line?" Read on 10-13, N=1 synthetic. A real-user encounter is unreadable at current traffic (GSC 0 clicks), so exposure will read `no-arrival` or `blind`, never met.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx` (the stats dl plus an id on the reason paragraph), possibly `src/lib/testedSeries.ts` (only if the entry needs a short form of the name), and a new or extended test (`src/lib/testedSeries.test.ts`). No `public/*.md` mirror carries per-cycle pages (`about.md` lists cycles but not the stats line), so no mirror edit is expected. The build confirms this with a Grep before it ships.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none. Read: `check-due-gates-dispositioned --snapshot` at 2026-10-10 ~09:25 MT, "0 gate(s) due on/before 2026-10-10" (35 ledger items swept).
- (b) Owed child rows in the orchestrator's ledger: none. Read: kickoff "rows owed to you", 0 of 748.
- (c) State reads marked CROSSED: none. Read: the kickoff state block (no threshold clause printed as crossed). Two reads came back with nothing to judge: missingLinkedCommits swept 0 of 0 items, and key-metrics has no `docs/key-metrics.json` yet, so both are "not measured", not clean.

### Section 0

- Primer: `docs/cold-starts/2026-10-09.md` read. First action run: live /methods snapshot is 350 lines (10-09 was also 350). Only the line count was compared.
- Listener: 🟢 SSE alive (hello 15:13:37Z) + loop armed by tool call.
- Codex: GREEN per the kickoff's `[codex-probe:]` line (15:08Z). Not used in P1.
- CI: GREEN, `check-ci-status --workflow ci.yml` on `2db901fd` (exit 0). Drift: `sinusoidal-history` in-sync, live `2db901fd` = head (exit 0).
- Rotation: `check-cycle-rotation` exit 0, so no product-love pass is due on this lane today.
- Yesterday's recs: the 10-09 primer carries no Recommendations block, only first action and dated reads. Both are dispositioned above (first action executed; dated reads not yet due).

## P3 — Product-work loop

[P3 — Product-work loop]

**Action (kind: improve).** On /cycles/turchin and /cycles/kondratiev, the stats line now carries "Judged on: 1913 onward · why? ↓" and "Judged on: Annual figures · why? ↓" right after Paired data. Each links (HashLink) to `#why-two-labels`, the reason paragraph, which has `scroll-mt-6`. Manager review: APPROVE. All three suggestions were taken:
- Measured, the review's wrap worry was right: "Yearly record from 1913" and "Annual figures, unsmoothed" each wrapped to two lines at 390, so both labels were shortened.
- `scroll-mt-6` added to the reason paragraph.
- The Kondratiev phone gap was read (25 px).

**1. Implementation.**
- Commits: `cd8d788` (the entry, tests, rows I-030 and I-031, the P1 packet) and `5828786` (the Codex r1 fixes).
- Tests: the full suite is GREEN at `5828786` under `verify-with-receipt` (`tmp/.verify-receipt.json`). At `cd8d788`, one receipted run went RED on `check-year-position.test.ts:41`, a spawned `--selftest` in a file this change does not touch. That run took 92 s, against ~30 s for each of the next runs; three re-runs were GREEN, 224/224 each. The RED receipt is kept at `tmp/.verify-receipt.prev.json`.
- Typecheck and lint: green. Lint has 0 errors; its 3 warnings are all in gitignored `tmp/` scripts.
- Red-armed:
  - With the page change stashed, the two positive cases failed (2 of 54).
  - Mutation (a): a spacer item between Paired data and Judged on failed the Kondratiev and Turchin cases (2 of 54).
  - Mutation (b): removing the aria-label failed the same 2 of 54.
  - Restored: 54/54.
  - Not red-armed: the eight "no entry" negative cases.

**2. Delivery.**
- CI: GREEN on `5828786` (`check-ci-status --workflow ci.yml --wait`).
- Deploy: `check-deployed-sha-drift --service sinusoidal-history` reads in-sync, live `5828786a` = head.
- Live Playwright read on sinusoidalhistory.com at 1440x900, 900x900, 390x664 and 320x568:
  - Judged on sits 24–25 px below Paired data.
  - The entry is one line at every width (tap box 44 px).
  - The jump lands the reason paragraph 24 px from the top, with focus.
  - Back restores the same scrollY with the entry in view.
  - Perez has no entry.
  - Nothing scrolls sideways.
- Live rendered text of the other eight cycle pages is identical to this morning's production snapshots (`tmp/rt-prod-*.txt`).
- Live folds: 13 of 13 at 390x664 and at 320x568.

**3. Encounter.** Blind. The site has no client analytics by standing choice, so a reader who uses the link leaves no trace. Bug row W-004: its 10-13 cold walk now asks the Turchin question (note added to W-004).

**4. Outcome.** Open. I-030 is `monitoring` until the 10-13 walk.

**Review.**
- Codex r1, read-only, on `cd8d788`; banner workdir matched; tags STATIC:
  - (1) LOW: the link's accessible name "1913 onward · why?" lacked context. CONFIRMED; fixed in `5828786` with an aria-label that opens with the visible text and names the judged series.
  - (2) The tests matched anywhere on the page, so a moved or doubled entry would pass. CONFIRMED; fixed in `5828786` (exactly one entry, the item right after Paired data).
- Codex r2, on `5828786`: no findings. It checked both rendered accessible names against `TEST_RAN` and label-in-name, and the adjacency regex against the installed renderer.
- Sibling sweep for the r1 defect class (in-page HashLinks with a context-free name), searching `<HashLink` in `src/**/*.tsx` (Grep): 8 call sites in all, 7 besides this one.
  - 5 read whole on their own: "How the test works →" and the "On this page" section names on /methods; "See which ones, and how short ↓" on /cycles; "The full verdict, the figure and the protocol →" and "Why there is none, in the caveat →" on cycle pages.
  - The 2 confidence-tag links already carry an aria-label.
  - 0 further hits.

**Ledger.** I-030 is minted and set to `monitoring` (commits linked; waitJustification until 2026-10-13). I-031 is minted: walk finding 1, the 900 px figure clip, `open`, next evaluation 2026-10-16. W-004 note: the Turchin step added for 10-13.

USER-VISIBLE: On /cycles/turchin and /cycles/kondratiev a "Judged on" entry beside Paired data now says what the verdict counts ("1913 onward" / "Annual figures · why? ↓") and jumps to the reason — 5828786 [proof: before the reason sat 1,593px (desktop) / 2,204px (phone) below Paired data with nothing pointing to it → after the entry sits 25px below Paired data at 1440/900/390/320, one line, and its jump lands the reason 24px from the top with Back restoring; Playwright read on sinusoidalhistory.com after Render live 5828786a] [coverage: Search Console (who is shown a page; cannot see on-page use) · last good read 2026-09-16 · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader who uses the link leaves no trace · bug row W-004]
## Close

ACTION: COMPLETED · item I-030 · P3 15a8c309

- **Acceptance record vs what shipped.** Acceptance item 1 said "Judged on" plus the judged-series name. What shipped shows the short form ("1913 onward", "Annual figures"), with the full series name in the link's aria-label only. The P1 review allowed this ("Use the short form in testedSeries.ts if the full name wraps"), and the full names wrapped to two lines at 390 (measured 2026-10-10).
- **State since P3.** The manager review (P5 prompt, 16:50Z) reads COMPLETED, with no defects found. It names one open gap, already in P3: the eight "no entry" negative cases were not red-armed. Live: `check-deployed-sha-drift` reads sinusoidal-history in-sync at `cc24c089`. That commit touches only continuity/ and docs/daily/, so the live build still carries `5828786`.
- **Ledger delta today:**
  - I-030 minted and set to `monitoring` (linkedCommits cd8d788, 5828786; waitJustification until 2026-10-13).
  - I-031 minted, `open`, nextEvaluation 2026-10-16.
  - W-004 note: the Turchin step was added to the 10-13 walk.
  - No row closed, re-dated or held.
- **Hygiene draft:** 0 lines, so 0 accepted, 0 amended, 0 rejected. Its checks:
  - READ-MUTATED: none.
  - check-wait-justification: PASS, 24 of 35 rows carry it, 0 warn, no expired `until`.
  - check-engineering-zero: PASS, 0 findings, 0 unreadable.
- **Due-gate verification:** `check-due-gates-dispositioned` (no flag) reads "verdict: CLEAR — every gate due at Phase 0 was dispositioned", with the snapshot CURRENT (taken 2026-10-10, 0 rows).
- **Receipt:** P3's receipt (15a8c309) still holds. Nothing new is written.
- **Pending reads:**
  - 2026-10-13: W-004 cold walk. Step 5 on /methods (I-029), plus the Turchin step ("what was this verdict judged on, and why does it differ from the Paired data line?"). I-030 closes or reopens on that answer.
  - 2026-10-16: I-031 (headed scrollbar read first) and I-006.
  - 2026-10-20: I-027.
  - 2026-11-04: W-005.
  - 2026-12-01: I-025.
- **UNRESOLVED:** none.

## Cycle 4 — P1 selection packet

[P1 — Evidence and choice]

**Outcome:** a cycle page's share card says what the site found. Today it shows the curve, period, peak and paired series, and nothing about whether the cycle holds up.
**Item:** the evangelism pass (rotation exit 3, below). No ledger row exists for this; **I-032 is minted at build time** (the I-029/I-030 pattern).

**The user problem, in the bar's words (HYPOTHESIS, `docs/evangelism-bar.md`):** "I can't tell whether any of it holds up or is just a good story." The would-tell-a-friend moment ends with the reader sending the page to a friend: "look, someone actually checked." The friend's first sight of that is the link preview. On iMessage, WhatsApp and Slack that preview is mostly the og:image, and the image carries no verdict.

### Evidence

- OBSERVED (source read, now): `src/app/og/route.tsx:298-313`. `cycleCard()` renders its stats as Period, Reference peak and Paired data, plus the confidence label and `short_description`. There is no verdict anywhere on the card. The og:image alt (`cycles/[id]/page.tsx:84`) names only the period and peak.
- OBSERVED (source read, now): the text meta description already carries the verdict tail (`cycleRoutes.ts:135-163`, `spectralMetaClause`). So the SERP snippet says "too short to test" and the share image does not. The two surfaces disagree about what a page is for.
- OBSERVED (frozen data, now): `public/data/spectral/verdicts.json` primary has 9 rows, all `INSUFFICIENT_DATA`, with `cycles_covered` from 0.74 (Turchin) to 2.87 (Perez) against a 3.0 floor. The tenth cycle has no paired series and so no row. So every card's line will be a "not testable yet" sentence with its own number. That is the honest-verdict mechanic the bar names, and it is the one thing no other result for these queries says.
- MISSING: any share, mention or real reader. The bar reads UNMEASURED: there are no client analytics by standing choice, and the last whole GSC read is 2026-09-09 (59 impressions, 0 clicks). No user has been observed failing at this; the change is best-judgment craft, grounded in the bar and not in user evidence (evangelism-pass step 4).
- MISSING: a shareability playbook in `docs/research-library/playbooks/` was not read in this P1. P3 reads it, or names it absent, before it builds.
- Disagreement, recorded as a finding: `check-cycle-rotation --lane sinusoidal-cycles` exited **3** now ("evangelism-pass DUE — P3 IS the pass; fleet cycle 20d since 2026-09-20 (lastRun 2026-09-20)"). This morning's packet recorded exit **0**, and the 10-08 pass (I-028 plus the bar) evidently did not move `lastRun` off 09-20. That is a stamping gap in the orchestrator's rotation store, not this lane's to fix; it goes to the P1 post.
- Prior-retro finding that bears on this: "a check written from a measurement inherits its looseness" (10-09, still on discipline). The card test derives its expected sentences from `verdicts.json` with an independent oracle; it does not match the strings the card happens to print.

### Permission

This is lane-owned product work: share-card copy and layout derived from frozen data. No row is parked, waiting or frozen, and answered-cards is none (kickoff, 02:24Z). It reads `public/data/spectral/verdicts.json` and does not write it (the primer's don't-touch list). It does not touch `HashLink.tsx`, the /state bands or `FigureScroller.tsx`. The main (non-cycle) card in the same file belongs to I-006 (due 10-16) and is left alone.

The sentence is published text, a factual claim about each cycle. So P3 runs a cross-family Codex claims pass (read-only, foreground pipe, banner workdir checked), per global rule 6, alongside the code review.

### Next action

**Kind:** improve. Add a "Does it hold up?" line to `cycleCard()`, derived from the cycle's primary verdict row. The reading is "Not testable yet — the record covers 0.74 of the 3 periods a test needs". The no-series cycle gets its own line saying there is no paired record to judge. The sentence comes from one helper shared with `spectralMetaClause`, so card and snippet cannot drift. The I-028 no-test-ran guard applies to the new sentence. The og:image alt gains the same clause. Baseline first: fetch the live cards before any edit.

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/perez C:/dev/skylark/sinusoidal-cycles/tmp/perez-before.txt
```

(Also: save the live `/og?cycle=<id>` PNGs for all ten cycles into `tmp/og-before/` and view them, so before → after is a picture rather than a description.)

### Acceptance condition (observable, live)

1. For each of the ten cycles, live `https://sinusoidalhistory.com/og?cycle=<id>` returns 200 `image/png`, 1200x630. The image, viewed, shows a verdict line whose number equals that row's `cycles_covered` in `verdicts.json` (with the 3.0 floor). The no-series cycle shows its no-record line.
2. Nothing on any card clips or overflows: the longest theorist name, the longest series label and the new line all sit inside the frame. Read on the PNGs.
3. Each page's `og:image:alt` (live HTML) carries the same verdict clause. The card sentence and the meta-description tail come from one helper (tests pin it). The I-028 guard passes over the new text.
4. The main `/og` card (no `?cycle=`) is byte-identical to production. The rendered text of all ten cycle pages is identical to production except the alt attribute, which the text gate does not read.
5. Typecheck, lint and test are green; CI is green; the deploy row reads live on the pushed sha.

### Delivery and encounter checks

- Delivery: the live PNG fetch plus a view of all ten cards after the deploy row reads live. The result goes in the P3 receipt.
- Encounter: blind. A share leaves no trace on this site: no client analytics, and preview scrapers are not readers. The readable event would be a non-crawler referral from a messaging or social host in the Render request logs (`scripts/crawl-read.mjs`). It is readable at N ≥ 1, and the next monthly crawl read is the date. Exposure will read `blind`.

### USER-FACING: yes

Paths: `src/app/og/route.tsx` (`cycleCard` only), `src/lib/cycleRoutes.ts` (the shared verdict sentence), `src/app/(app)/cycles/[id]/page.tsx` (og:image alt only), and tests (a new `src/lib/` test file, plus an extended no-test-ran guard if it does not already reach the og route). No `public/*.md` mirror carries the share card. `public/llms.txt` describes pages, not cards; P3 confirms that with a Grep.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none. Read: `check-due-gates-dispositioned --snapshot` at 2026-10-10 ~20:45 MT, "0 gate(s) due on/before 2026-10-10" (37 swept). The re-snapshot was identical to the morning file, and nothing was dropped.
- (b) Owed child rows in the orchestrator's ledger: none. Read: kickoff "rows owed to you", 0 of 749.
- (c) State reads marked CROSSED: none. Read: the kickoff state block, which printed no crossed threshold. Not measured, not clean: missingLinkedCommits swept 0 of 0, and key-metrics has no `docs/key-metrics.json`.

### Section 0 (cycle 4)

- Primer: `docs/cold-starts/2026-10-10.md`. First action run: live /cycles/turchin snap read 99 lines (10-10: 99), and "Judged on · 1913 onward · why?" is present.
- Listener: SSE alive (hello 02:16:24Z). Waker ladder: three rungs armed; rank 1 relaunched after a wake-shorten fire. Loop armed by tool call.
- Codex: GREEN per this prompt's `[codex-probe:]` line (15:08Z). Not used in P1.
- CI: GREEN on `3aede241` (kickoff read, run 38095865503). HEAD `3aede24` (`8988b30` JSON-LD helper, `3aede24` CI audit step) came from another session at 17:40 MT. Its deploy row is unread by this pane, so P3 reads drift before building.
- Rotation: exit 3, an evangelism pass DUE (above). P3 is that pass.
- Yesterday's recs: the 10-10 primer carries a first action (run) and dated reads (none due yet).

## Cycle 4 — P3 product-work loop

[P3 — Product-work loop]

**Action (kind: improve; this is the evangelism pass the rotation named).** Each cycle's share card (`/og?cycle=<id>`) now carries a "Does it hold up?" block in place of the truncated description. It uses the page box's own headline and the page's one-decimal number. Link to the core experience: the reader's "someone actually checked" is now the first thing the friend sees in the link preview, before they open the page.

**The manager review's four corrections (91c502f9), each checked:**
1. Number matches the page: done. The card prints `cycles_covered.toFixed(1)` through the same helper the page box uses. Turchin reads 0.7 on the card and 0.7 in the live page box.
2. Headline echoes the page: done. "Not testable on the record that exists", pinned by a test against the server-rendered box.
3. Helper shared with the page box: done. `src/lib/holdsUp.ts` (`NOT_TESTABLE_HEADLINE`, `periodsCovered`, the no-series sentence) feeds both `page.tsx` and the card. `spectralMetaClause` is left alone: it is SERP-tuned and test-pinned.
4. HYPOTHESIS, measured and RIGHT: Kondratiev's card shows "Paired data: TFP growth · 5-yr" and Turchin's "Top 1% wealth share", while both verdicts count a different cut. The line on those two cards therefore names the judged record ("Judged on US TFP growth (annual, unsmoothed): 1.4 …", "Judged on US top 1% wealth share (1913 onward): 0.7 …"). The other seven say "Its paired record covers …".

**1. Implementation.**
- Commits `1974846` (the block, helper, tests, I-032, the P1 packet) and `6014bb1` (Codex r1 fixes).
- Full suite GREEN, 260/260 at `6014bb1` under `verify-with-receipt`. Typecheck green. Lint: 0 errors; its 3 warnings are in gitignored `tmp/` scripts.
- Red-armed by three mutations, each restored afterwards:
  - (a) Crediting the number to the drawn series failed Kondratiev and Turchin, 2 of 22.
  - (b) The raw two-decimal number failed 7 of 22.
  - (c) "A test ran on its paired record" failed the extended no-test-ran guard on 7 of 10 (the mutated branch).
- Declared ceilings:
  - The tests do not render the PNG. Frames are read by eye, below.
  - No fixtures exist for the eligible, unnamed-cut or series-without-verdict branches (none in the frozen data).
  - Huntington and Schlesinger cannot tell raw from one-decimal (2.4 exactly), which is why (b) is 7, not 9.

**2. Delivery.**
- CI: GREEN on `6014bb1` (`check-ci-status --workflow ci.yml --wait`: "1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending").
- Deploy: `check-deployed-sha-drift --service sinusoidal-history`: "in-sync · live 6014bb12 → head 6014bb12".
- Live cards: all ten `https://sinusoidalhistory.com/og?cycle=<id>` return 200 `image/png`. Each is byte-identical (SHA-256) to the local build, whose ten frames I viewed, and different from the pre-change production card.
- Frames read live, next to the page text (the manager's added acceptance):
  - Turchin card: "DOES IT HOLD UP? / Not testable on the record that exists. / Judged on US top 1% wealth share (1913 onward): 0.7 of the 3.0 full periods this site requires before testing." Page box, live: "Not testable on the record that exists — and that is the finding, not a dodge. The record this verdict is judged on, US top 1% wealth share (1913 onward), runs 111 years: 0.7 of the 3.0 full periods this site requires before it will run a test on a 150-year claim."
  - No-series card (Turchin 50y): "Not tested. / This cycle has no paired data series on this site, so there is no record to test it against." Page box, live: "Not tested — this cycle has no paired data series on this site, so there is no record to test it against."
- Nothing clips. The longest line (Turchin's) is one line ending near x 950 of 1144, with about 16 px above the footer rule on subtitle cards.
- Each live page's `og:image:alt` carries the clause (read from the live HTML, ten of ten).
- The visible text of all ten live cycle pages is identical to the production snapshots taken before the change (`check-rendered-text diff`, GREEN ×10).
- The main `/og` card is byte-identical to before.
- One limit: a preview a messaging app or shared cache already holds can show the old card for up to a day (existing cache headers, `ogCardCache`; Codex r2 noted it). New shares get the new card.

**3. Encounter.** Blind. The site has no client analytics by standing choice, and a link-preview fetch is a scraper, not a reader. The readable event would be a non-crawler referral from a messaging or social host in the Render request logs. Bug row I-032 carries it to 2026-11-04 (W-005 plus that month's crawl read).

**4. Outcome.** Open. No user evidence grounds this change (bar UNMEASURED); it ships as best-judgment craft and is not claimed to have closed the gap.

**Review.**
- Codex r1, read-only, on `1974846`; banner workdir matched; all tags STATIC.
  - (1) MED: "a test requires" read as a general requirement, where the page and /methods scope the 3.0 floor to this site. CONFIRMED against page.tsx and methods; fixed in `6014bb1` ("this site requires before testing").
  - (2) The unreached unnamed-cut fallback asserted a cut relationship. CONFIRMED; fixed in `6014bb1`.
  - (3) The judged-cut test did not assert the exact record name. CONFIRMED; fixed in `6014bb1`.
  - (4) The headline assertion assumed ineligibility. CONFIRMED (dormant); fixed in `6014bb1`.
  - Claims pass: headline, judged-cut and no-series sentences HOLD; the eligible sentence HOLDS conditionally (none exists today).
- Codex r2, read-only, on `6014bb1`; banner workdir matched: no findings. It read the Satori JSX (every added div is flex), the cache (process-local, does not survive a deploy), `?cycle=` handling (only repository-defined cycles reach the helper) and the page strings character by character.
- Sibling sweep for the r1 defect class (the 3.0 floor stated without "this site"): Grep `3\.0 full periods` in `src/` non-test files (run before the change), 4 hits besides the new helper. The page box says "this site requires"; methods:265 "testable only when its record spans at least 3.0 full periods" sits under the section that calls it a site rule; spectralFigureText.ts:33/:37 say "the pre-registered test requires" (the protocol's own gate, named as such). 0 further fixes.

**Findings outside the change.**
- Rotation stamp gap (orchestrator's): `check-cycle-rotation` read exit 3 tonight with lastRun 2026-09-20, though a pass ran 10-08, and this morning's read was exit 0. This pass should move lastRun; if it does not, the store is not being stamped.
- No shareability playbook exists (`skylark-site/docs/research-library/playbooks/*share*`: 0 files). A `deep-research` candidate, not built here.
- Port incident while rendering locally: after I stopped my dev server on 3123, another lane's server (bank-see) took the port before my restart. I left it alone and moved to 3917. All three of my own orphaned `next` processes were stopped by PID, after a command-line read that named this checkout.

USER-VISIBLE: Each cycle page's share card now says whether the cycle holds up ("Does it hold up? Not testable on the record that exists. … 0.7 of the 3.0 full periods this site requires before testing.") where it showed only a cut-off description — 6014bb1 [proof: before the ten /og?cycle=<id> cards carried period, peak, paired data and a truncated description with no verdict → after each carries the page's headline and one-decimal number, Kondratiev and Turchin naming the judged record; ten live PNGs 200 and byte-identical to the viewed build, Turchin and no-series frames read live against the page text, after Render live 6014bb12] [coverage: Search Console (who is shown a page; cannot see a share or a preview) · last good read 2026-09-16 · founder+test excluded no] [exposure: blind — no client analytics on this site and a link preview is fetched by a scraper, so a share leaves no trace · bug row I-032]

codexCalls: 2
adversarialReviews: 2 — EXECUTED
hygiene helper: DISPATCHED 2026-10-10 ~21:00 MT · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-10.md PRESENT (0 draft lines; check-wait-justification PASS with one info line on I-031; check-engineering-zero PASS for this lane)

**Ledger.** I-032 minted, `monitoring`, linkedCommits 1974846 + 6014bb1, waitJustification until 2026-11-04.

**What remains.** Nothing eligible on this outcome today: the encounter read needs a real share, which nobody on this lane can produce (never David as the channel). Next read: 2026-11-04. Carries unchanged: 10-13 W-004 walk (I-029, I-030); 10-16 I-031, I-006; 10-20 I-027.

[standing-rules-hash: 88cc2dc9]

## Close (cycle 4)

[P5 — Delta-only close]

ACTION: COMPLETED · item I-032 · P3 c8470349

- **State since P3.** Manager review dd90ef3f reads COMPLETED, defects none. The manager read the live Turchin and no-series cards as frames independently; both match their pages. Live: Render sinusoidal-history in-sync at `69e6f953`, a doc-only descendant of `6014bb1` (manager's read, 04:11Z). Nothing else changed.
- **Ledger delta (cycle 4):**
  - I-032 minted and set to `monitoring` (linkedCommits 1974846, 6014bb1; waitJustification until 2026-11-04; nextEvaluation 2026-11-04).
  - W-005: note appended. Its 2026-11-04 read also carries I-032's encounter read: a non-crawler referral to a /cycles page from a messaging or social host in the Render request logs (`scripts/crawl-read.mjs`).
  - No row closed, re-dated or held.
- hygiene draft: 0 lines — 0 accepted · 0 amended · 0 rejected (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-10.md`, inputs all `none`).
  - READ-MUTATED: none, 0 reads guarded.
  - check-wait-justification, re-run after the I-032 wait was written: "RESULT: PASS — 26 of 38 row(s) carry `waitJustification`; 0 warn / 1 info". The info line is I-031's structural `waitingFor` with no waitJustification (shadow arm, not a finding).
  - check-engineering-zero (helper's run, ~21:00 MT): "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable". No lockfile changed since.
- **Due-gate verification:** `check-due-gates-dispositioned` (no flag): "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-10, 0 rows).
- **Receipt:** P3's receipt (c8470349) still holds. Nothing new is written.
- **Orchestrator-side item, not this lane's to fix:** `check-cycle-rotation --lane sinusoidal-cycles` exited 3 at ~20:42 MT with "lastRun 2026-09-20", though an evangelism pass ran on 2026-10-08, and this morning's read was exit 0. The rotation store looks unstamped. Cycle 4 was itself a pass, so a DUE reading straight after it would confirm the gap.
- **Pending reads:**
  - 2026-10-13: W-004 cold walk (closes I-029, I-030).
  - 2026-10-16: I-031 (headed scrollbar read first) and I-006.
  - 2026-10-20: I-027.
  - 2026-11-04: W-005, and I-032's encounter read with it.
  - 2026-12-01: I-025 (David).
- **Today panel:** written for 2026-10-10 (`update-daily-brief`, commit 752fa499 in skylark-site).
- **Primer:** `docs/cold-starts/2026-10-10.md`, banner rewritten in place for cycle 4.
- **UNRESOLVED:** none.

codexCalls: 0 (this phase; cycle 4's two review runs are counted on the P3 post)

[standing-rules-hash: 88cc2dc9]

## Cycle 5 — P1 selection packet

[P1 — Evidence and choice]

**Outcome:** on a phone's first screen, every cycle page shows its curve, the measured series it is paired with, and the plain verdict. Today nine of ten show the verdict and no curve, and no cycle page draws the measured series at all.
**Item:** the cycle-5 lead (20b140e7). No ledger row exists; **I-033 is minted at build time**.

**The user problem, in the bar's words (HYPOTHESIS, `docs/evangelism-bar.md`):** "On one screen they see its curve drawn against a real measured series, and they get a plain verdict on whether the record can even test it."

### Evidence

- OBSERVED (live, Playwright, tonight): ten first screens of `https://sinusoidalhistory.com/cycles/<slug>` at 390x844, saved as frames (`tmp/c5-frames/*-390x844.png`) with page positions (`tmp/c5-first-screens.mjs`). Population: all ten cycle pages.
  - Verdict headline: on the first screen on 10 of 10 (bottoms y 434 to 504).
  - Curve: below the fold on 9 of 10 (top y 1012 to 1106 on the nine). Only fathers-and-sons fits (781-840).
  - "Paired data" line: below the fold on the same 9 (y 979 to 1049).
  - Two frames read by eye: Turchin's first screen is header, title, a five-line description and the verdict box; it ends inside the box, with no curve. Fathers-and-sons shows the verdict, the position sentence, the stats line and the top of its curve.
- OBSERVED (same script at 390x664, the real visible area of an iPhone 14 in Safari): the curve is below the fold on 10 of 10; the verdict headline is still visible on 10 of 10. **The lead names 390x844. That is the CSS viewport; this repo's fold gate uses 390x664 because 844 "cleared it and hid the problem" on 2026-09-19 (`page.tsx:327-333`, `scripts/check-entry-folds.mjs:15-16`). I propose to accept on 390x664, which is stricter, and to read 390x844 as well.**
- OBSERVED (source read): the lead's "measured series beside the curve" is a larger gap than a fold. `CurveFigure` (`cycles/[id]/page.tsx:791`) draws the sinusoid, the reference peak and "now" only. No cycle page draws its paired series anywhere; a reader meets it only as the name on the "Paired data" line, or by leaving for the chart. So the bar's "drawn against a real measured series" is unmet on every cycle page at every width, not only on phones.
- OBSERVED (source read): the pieces to draw it exist and are what the home chart uses: `parseCsvSeries` (`src/lib/csvSeries.ts`) and `normalizeSeries` (`src/lib/seriesMath.ts`, min-max to [-1, 1]). A server-rendered overlay can reuse them, so the page and the chart cannot disagree about the line's shape.
- OBSERVED (source read): the first screen spends about 130 px at 390 on `short_description` (five lines on Turchin) before the verdict. The stats line and curve were moved below the verdict on 2026-09-19 because under the H1 they pushed the verdict 17 px below the 664 fold. So the room has to come from the description, not from the verdict.
- HYPOTHESIS: moving the description below the verdict box frees more height than a compact stats line plus curve costs, at 390x664 and at 320x568 (where Turchin had 12 px spare). P3 measures both before it ships; if 320x568 cannot hold all three, the packet's order of sacrifice is description first, then the curve's height, never the verdict headline.
- MISSING: any real reader. Bar UNMEASURED, no client analytics by standing choice, GSC last whole read 2026-09-09 (59 impressions, 0 clicks). This is craft grounded in the bar.
- Rotation: `check-cycle-rotation --lane sinusoidal-cycles` exit **3** again at ~22:35 MT, "lastRun 2026-09-20", straight after cycle 4's pass. That confirms the stamping gap named in cycle 4's close (orchestrator-side). This cycle is bar-anchored product work either way.
- Prior-retro finding that bears: "a check written from a measurement inherits its looseness." Acceptance is read from frames and live positions, and the fold gate's own selector, not from numbers typed in tonight.

### Permission

Lane-owned layout and a derived figure on the ten cycle pages. No row parked, waiting or frozen; answered-cards none (kickoff 02:24Z). It reads `public/data/*.csv` (not `public/data/spectral/`) and writes none. It does not touch `HashLink.tsx`, the /state bands, `FigureScroller.tsx`, or `judgedOn` (not lengthened). The verdict box's words stay exactly as the share card quotes them (`src/lib/holdsUp.ts`, untouched).

One judgement to flag for the review: Turchin and Kondratiev are judged on a different cut from the series the chart draws. The overlay draws the series the chart draws, and is labelled with the "Paired data" name; the "Judged on … why?" entry stays right beside it (I-030). I will not draw the judged cut as a second line.

### Next action

**Kind:** improve. In `cycles/[id]/page.tsx`:
1. Draw the paired series over the sinusoid in `CurveFigure`, min-max normalised with the chart's own `normalizeSeries`, with a two-item key under the figure ("curve: <period>-year sinusoid" and "line: <Paired data name>"). The no-series cycle draws the sinusoid alone, as now.
2. Re-order the first screen: title, then the stats line and figure, then the verdict box; the description and the position sentence follow the box.

```
node C:/dev/skylark/sinusoidal-cycles/tmp/c5-first-screens.mjs http://localhost:3917 C:/dev/skylark/sinusoidal-cycles/tmp/c5-frames-after 390 664
```

(Run against a local build after the edit; the same script already produced tonight's "before" numbers against production.)

### Acceptance condition (observable, live)

1. After deploy, ten frames at 390x664 and ten at 390x844, read as frames: on each, the curve, the measured series drawn on it (nine pages) with its name, and the verdict headline are all visible without scrolling.
2. `scripts/check-entry-folds.mjs` still reads 13 of 13 at 390x664 and at 320x568 on production (the verdict must not lose its place to make room).
3. The verdict box's text is unchanged: the line MULTISET of each page's rendered text is identical to production before the change (this is a re-order, so the ordered diff goes RED by design; AGENTS.md).
4. The drawn line is the chart's: a test pins the overlay's points to `normalizeSeries(parseCsvSeries(...))` for every paired cycle, read from the CSV on disk. One page's overlay is compared by eye with the same cycle's facet on the home chart.
5. I-030's "Judged on" entry still sits right after "Paired data" (its tests stay green); `judgedOn` strings unchanged.
6. Typecheck, lint, test green; CI green; deploy row live on the pushed sha.

### Delivery and encounter checks

- Delivery: the frames and the fold gate against production after the deploy row reads live.
- Encounter: blind (no client analytics). The 10-13 W-004 cold walk already opens /cycles/turchin on a phone; its first-screen answer is the nearest read, N=1 synthetic. Real-reader read: W-005 on 2026-11-04.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx` (order and `CurveFigure`), possibly a small `src/lib/` helper for the overlay points, tests (new file; `testedSeries.test.ts` and `holdsUp.test.ts` must stay green untouched), `scripts/check-entry-folds.mjs` only if a leg is added for the curve. No `public/*.md` mirror carries cycle-page layout.

**Second item, if time:** I-006 (the og route's hard-coded "Ten long-wave cycles of history"), same file family, effort S, due 10-16. Not started unless the first is live.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none — read: `check-due-gates-dispositioned` (no flag) at ~22:15 MT, "0 gate(s) were due at Phase 0", snapshot CURRENT (taken 2026-10-10). Not re-snapshotted.
- (b) Owed child rows in the orchestrator's ledger: none — read: kickoff "rows owed to you", 0 of 749 (02:24Z; not re-read).
- (c) State reads marked CROSSED: none — read: the kickoff state block. Not measured, not clean: missingLinkedCommits 0 of 0; key-metrics has no list.

[standing-rules-hash: 88cc2dc9]

## Cycle 5 — P3 product-work loop

[P3 — Product-work loop]

**Action (kind: improve).** Each of the nine paired cycle pages now draws its measured series over the curve, and the curve moved to the top of the page, right under the title and above the verdict box. A key under the figure names the line by the page's own "Paired data" label and says it is "rescaled to the curve's height". The description moved below the verdict box. The verdict box's words, the stats line and `judgedOn` are unchanged. Link to the core experience: this is the bar's own sentence. A reader now sees the curve drawn against a real measured series and the plain verdict together, on the first phone screen.

**The manager review's points (b20802e2), each checked:**
- Check 4, tightened: done. `src/lib/seriesOverlay.ts` runs the chart's pipeline in its order: the series' transform, then the 1600–2050 window, then min-max. `src/lib/seriesOverlay.test.ts` rebuilds the line from each CSV with its own parser and arithmetic, and compares it with the points the server-rendered page draws, for all nine paired cycles. The key text is pinned to the series' label.
- Check 3, tightened: done. Each page's rendered-text line multiset equals the pre-change one plus exactly two added lines (the key's), with none removed; this was checked live, below.
- SUGGESTION taken: "rescaled to the curve's height" is in the key.
- HYPOTHESIS, measured and right: the SVG aria-label now ends "Drawn over it: <series name>, rescaled to the curve's height."
- 320x568: nothing had to be sacrificed. The description move alone fits all three; the fold gate reads 23–67 px spare there.

**1. Implementation.**
- Commits `bf57b1c` (the overlay, the re-order, tests, I-033) and `dd48de4` (Codex r1 fix).
- Gates:
  - Full suite 273/273 GREEN at `bf57b1c` under `verify-with-receipt`.
  - At `dd48de4` the local full suite FAILED twice, both times on spawned selftests of scripts this change does not touch: `check-entry-folds.test.ts` (5 s timeout), then `checkStagedSecrets.test.ts` (60 s timeout). Those runs took 82 s and 143 s against 27 s; machine read then: CPU 100%, 136 node processes, ~6 GB free. The entry-folds selftest passes 13/13 alone, and the three touched test files pass 99/99 at `dd48de4`.
  - **CI ran the full suite on `dd48de4` and is GREEN**, including both of those tests.
  - Typecheck green. Lint: 0 errors (3 warnings in gitignored `tmp/` scripts).
- Red-armed, each restored afterwards:
  - Dropping the series' transform failed Khaldun (the log1p series), 1 of 12.
  - Normalising before the window passed all nine real series: no series has a point outside 1600–2050, so real data cannot tell the two apart. A fixture with an out-of-window extreme now pins the order, and fails under that mutation (1 of 13).
- Declared ceilings:
  - The fold gate measures the verdict headline, not the curve or key; frames cover those.
  - The tests do not see reader interpretation (whether the line reads as a fit).
  - The oracle does not cover empty cells or quoted CSV (none exist in today's files).

**2. Delivery.**
- CI: GREEN on `dd48de4` (`check-ci-status --workflow ci.yml --wait`: "1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending").
- Deploy: Render's own deploy row has `dd48de4a` live, finished 05:43:03Z. `check-deployed-sha-drift --service sinusoidal-history` then read "in-sync · live dd48de4a → head dd48de4a". Its read a minute earlier said red-drift: the 30-minute grace is anchored on the commit date, and `bf57b1c` was committed 31 minutes before CI finished.
- Live, 390x664 (Playwright, positions, sinusoidalhistory.com):
  - The curve is on the first screen on 10 of 10 pages (y 243–331); before, it was below the fold on 10 of 10.
  - The key is on the first screen on 9 of 9 paired pages (y 352–416).
  - The verdict headline is on the first screen on 10 of 10 (bottom y 489–518).
- Live, 390x844: the same, 10 of 10.
- Fold gate on production: "OK: 13 of 13 entry-page legs answer on the first screen" at 390x664 (146–175 px spare on cycle pages) and at 320x568 (23–67 px spare).
- Frames read live:
  - Perez 390x664: title on two lines, curve with the purple diffusion line, key "Tech diffusion · site-derived, rescaled to the curve's height", then "Not testable on the record that exists — and that is the finding, not a dodge."
  - Fathers-and-sons 390x664: curve alone with no key, then "Not tested — this cycle has no paired data series on this site…"
  - Kondratiev 390x844: curve with the TFP line, key, and the whole verdict box including "The full verdict, the figure and the protocol →".
  - Read locally: Turchin, Khaldun and Modelski (320x568).
- Live text: each of the nine paired pages equals the pre-change production line multiset plus exactly the two key lines ("<N>-year sinusoid" and "<label>, rescaled to the curve's height"), with 0 removed. Fathers-and-sons is identical (69 = 69 lines).
- The page's line is the chart's: the Khaldun overlay and the home chart's Khaldun facet compared as images show the same span and the same spikes in the same places. The interpolation differs on purpose: straight segments, so nothing is invented between Turchin's five sparse pre-1913 points.

**3. Encounter.** Blind: the site has no client analytics by standing choice. The nearest read is the 2026-10-13 W-004 cold walk (N=1, synthetic). Its Turchin phone step now also asks "What is the grey line on the curve, and does this cycle hold up?", including whether the line was read as evidence of fit. Bug row I-033.

**4. Outcome.** Open. No real reader observed; best-judgment craft grounded in the bar.

**Review.**
- Codex r1, read-only, on `bf57b1c`; banner workdir matched.
  - No functional defect.
  - CONFIRMED and fixed in `dd48de4`: the page caught a failed CSV read and drew the figure without its line, so an ISR revalidation could silently replace the last good page. It now throws, which fails the build and keeps the last good page on revalidation.
  - Also fixed: two stale comments about the old order.
  - Claims: the key HOLDS, the aria-label HOLDS. Whether the visual pairing reads as a fit is UNVERIFIABLE-HERE; that is the W-004 question above.
  - Fidelity: identical normalised samples to the chart, with a deliberately different interpolation. HOLDS as narrowed; "exactly what the chart draws" would be REFUTED-AS-WRITTEN.
  - Shared parser behaviour, not this change: both parsers read an empty cell as 0. No current CSV has one. Not fixed here.
- Codex r2, read-only, on `dd48de4`; banner workdir matched. No findings. It read the installed Next 16.3.8 docs: a thrown read fails the build, and ISR keeps the previous page. Reach is confined to /cycles/[id].
- Sibling sweep for the r1 class (a silent catch in a server render path): Grep `catch\s*(\(\w*\))?\s*\{` over `src/app/`: 0 hits after the fix.

USER-VISIBLE: Every cycle page now opens with its curve and, on the nine paired pages, the measured series drawn on it (keyed "rescaled to the curve's height"), above the plain verdict, all on the first phone screen — dd48de4 [proof: before the curve sat below the fold on 10 of 10 pages at 390x664 and no page drew its series at any width → after curve, key and verdict headline are on the first screen on 10 of 10 at 390x664 and 390x844, live positions and frames read on sinusoidalhistory.com after Render live dd48de4a; fold gate 13/13 at 390x664 and 320x568] [coverage: Search Console (who is shown a page; cannot see on-page reading) · last good read 2026-09-16 · founder+test excluded no] [exposure: blind — no client analytics on this site, so a reader's first screen leaves no trace · bug row I-033]

codexCalls: 2
adversarialReviews: 2 — EXECUTED
hygiene helper: DISPATCHED 2026-10-10 ~22:45 MT · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-10.md PRESENT (cycle 5; 0 draft lines; check-wait-justification PASS with one info line on I-031; check-engineering-zero PASS for this lane)

**Ledger.** I-033 minted through `continuity-edit --mint`, set to `monitoring` with linkedCommits bf57b1c and dd48de4 and waitJustification until 2026-10-13. W-004 has the I-033 question added for 10-13.

**What remains.** On this outcome, nothing eligible today: the encounter read is the 10-13 walk. The second item in the lead, I-006 (the og route's hard-coded "Ten long-wave cycles of history"), was not started. It is due 10-16, and I hold it for the next cycle rather than start it past midnight with the machine saturated.

**Finding outside the change:** the local full suite is no longer a reliable gate under fleet load. Two spawned-selftest tests with fixed timeouts (5 s and 60 s) failed at 2–5x normal runtime, then passed in CI. This is the same class as `check-year-position.test.ts:41` on 10-10 morning; not fixed here.

[standing-rules-hash: 88cc2dc9]
