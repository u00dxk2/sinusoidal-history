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