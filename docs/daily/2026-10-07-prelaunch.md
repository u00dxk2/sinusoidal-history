# sinusoidal-cycles — 2026-10-07 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** a reader of a cycle page's spectral figure is told how to see all of it in words that fit their pointer, and can read the target period and the band without hunting. **Item:** I-021 (open, P3, lane-owned).

**The user problem, in the walker's words** (W-004 cold walk, today, synthetic, N = 1, `docs/walks/2026-10-07-w004.md:86-88`, step 2, 900x900 with a mouse): "It told me to swipe sideways, which is a touch instruction given to a mouse user. I could not see the whole figure without scrolling the box sideways (shift+wheel or a trackpad) or clicking through to the SVG." and "The instruction does not match the device, and the cut-off parts include the end year and half of the band text." (Corrected at P3, manager review f3d1c14a: the P1 version quoted my paraphrase, not the file.) The walker ranked it the single worst thing today. It is a synthetic walker's quote, not a real user's.

**What a user will see differently:** under 1024 px wide, the line above the figure fits the pointer. A touch reader is told to swipe, and a mouse reader to scroll sideways or click the figure to open it full size. A short HTML line carrying the figure's target period and band also sits above the scroller, so a phone reader gets both on arrival without swiping. The spectral SVGs stay frozen.

### Section 0

- **Primer:** `docs/cold-starts/2026-10-06.md` (written yesterday; there is no `2026-10-07.md`). It names W-001's Search Console read and the W-004 cold walk as first actions. Both ran.
- **git:** `pull --ff-only` printed "Already up to date". HEAD `97a2e89` = origin.
- **Listener:** 🟢 SSE alive. /listen launched it this session (pid 37476, hello 14:34:38Z, 0 replayed). The loop is armed by `ScheduleWakeup` call, and waker ranks 1-3 are running. The kickoff body reported one missed event, recovered by the fallback poll.
- **Codex:** GREEN, from the `[codex-probe]` line on this prompt (04:12Z). Not used at P1, because there is no diff yet.
- **CI:** `check-ci-status --workflow ci.yml` → GREEN for `97a2e89e5e` (1 success, 0 failures, 0 pending).
- **Deploy drift:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live `97a2e89e` = head (checksPass service, judged). The first try with `--service sinusoidal-cycles` matched no service; the Render name is `sinusoidal-history`.
- **Harness:** running 2.1.292 · fleet UNIFORM (28 of 28) · installed 2.1.292 (SAME). The record moved from 2.1.277.
- **Cycle rotation:** exit 0, "no product-love cycle picks this lane today (4 cycle(s) rotate over 23 lanes); run the normal P3".
- **Due gates:** `--snapshot`, taken once → "8 gate(s) due on/before 2026-10-07" (`tmp/due-gates-snapshot.json`).
- **Board:** `answered-cards` → no waiting, answered or pending-verify cards.
- **Recs yesterday:** `docs/daily/2026-10-06-prelaunch.md` has no `## Recommendation` block, so `Recs yesterday: none`. Its primer named I-021 as waiting on today's W-004 read of the current cue. That read is now in.
- **Retro (10-05, the newest; no 10-06 reply):** none of the quoted still-on-discipline findings bears on this choice.

### Evidence

- **OBSERVED, W-004 step 2** (today, synthetic, N = 1, Chromium, 900x900, mouse): the quote above. 704 of 900 px visible; no scrollbar showed in headless. Ranked the worst thing of the walk.
- **OBSERVED, W-004 step 5** (390x664, iPhone 15 profile): only 39% of the figure is visible at once. The only cue says swipe. A tap does nothing; that's correct since I-020, `2e00ce7`.
- **OBSERVED, W-003 P11** (2026-10-03, 390x664): on arrival the subtitle reads "target pe" and the band "INSUFFI". The band was never seen whole in one swipe position.
- **OBSERVED, in the tree:** the cue is one unconditional string, `src/app/(app)/cycles/[id]/page.tsx:571-573`, `lg:hidden`, shown from 0 to 1023 px for every pointer. The figure is a 900 px image in `FigureScroller` below lg.
- **OBSERVED, the HTML verdict line** above the figure already says in words that the record falls short (the walker answered Kondratiev's verdict from it on the first screen, step 1a). But it doesn't carry the figure's own "target period N years" or the band phrase as one readable line next to the figure.
- **MISSING:** real-user evidence. There's no client analytics (a standing choice), and the lane has no evangelism-bar or evangelism-evidence file, so there is no bar metric to read.

### Permission, and the freezes

- **Decision class:** lane-owned product UI. I-021's owner is sinusoidal-cycles, waitingFor reads "Nothing and nobody. Lane work for a later round.", its `waitJustification.until` is 2026-10-07 (today), and no card is open on it.
- **W-001 freeze (titles, meta, H1s, URLs) ended today** (`nextEvaluation` 2026-10-07). This change is body copy and CSS in any case. I'll log the added body string in W-001's notes so the next read can attribute a move.
- **Frozen, not touched:** `public/data/spectral/` (the SVGs, verdicts.json, manifest), the /state bands and `state-2026.csv` (I-025). The primer lists `FigureScroller.tsx` as don't-touch. The plan keeps the change in `page.tsx` (the cue line, a caption line, the className passed to the scroller). If an edge fade needs `FigureScroller`, that comes back to the review before I touch it.
- **Mirrors:** no /methods, /about or /colophon prose changes, so there are no `.md` mirror edits. `llms.txt` is untouched.

### Next action — improve

Prep only until the review. No commit, push or deploy.

1. Split the cue by pointer, using the `pointer-coarse:` variant the figure link already uses. Coarse: "Swipe sideways for the whole figure". Fine: "Scroll sideways for the whole figure, or click it to open it full size". Both stay `lg:hidden`.
2. Above the scroller, below lg, add one HTML line built from the verdict data: "Target period {period} years · {band phrase}". The band phrase comes from the same verdict fields the SVG label was built from, never retyped. If I can't derive it from those fields, I'll name the field before committing.
3. A visible right-edge cue on the scroller (fade or always-on scrollbar), only if it fits in page.tsx's className. Otherwise it's dropped from this round and noted.
4. A Playwright check (`scripts/check-figure-cue.mjs`, added to CI the way the existing check-* scripts are) asserts: at 900x900 with a fine pointer, the cue doesn't say "Swipe"; at 390x664 with touch, it does; the target/band line is on screen when the figure's top is. Red arm: revert the cue split and show the 900 leg failing.

First command (the baseline the change must move):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/kondratiev C:/Users/david/AppData/Local/Temp/claude/C--dev-skylark-sinusoidal-cycles/5f34bd08-8652-461e-bee2-9035a1b6c6ef/scratchpad/kondratiev-before-2026-10-07.txt
```

### Acceptance

- At about 900 wide with a mouse, the line above the figure doesn't say "Swipe". It says scroll sideways or click to open full size. At 390x664 with touch it still says swipe.
- At 390x664, on arrival at the figure, the target period and the band are readable in one line without swiping.
- The new check passes on production after deploy and fails with the cue split reverted. Both outputs go in the P3 report.
- Rendered-text multiset: on /cycles/kondratiev, /cycles/perez and /cycles/turchin, the only changes are the cue line(s) and the added target/band line. No title, meta, H1 or URL change.
- I-021's closeWhen (a cold walk at 390 and about 900 with a mouse reads the target and the band, and says the cue told it what to do) is answered by the next cold walk, not by me.

### Delivery and encounter checks

- **Delivery:** CI green on the push, then the deploy row reads live (checksPass), then `check-figure-cue.mjs https://sinusoidalhistory.com` and the rendered-text snap on production.
- **Encounter:** the next cold walk asks I-021's closeWhen at 390 and at about 900. That walk is synthetic, not a real-user read. With no client analytics there's no event to watch, so exposure will be `blind — no client analytics · bug row W-004`.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx` (what users get); `scripts/check-figure-cue.mjs` + `.github/workflows/ci.yml` or a vitest spawn test (internal); `continuity/items.json` (internal: I-021, W-001 and W-004 notes); this report (internal).

### HYGIENE INPUTS

- **(a) Due rows not bearing on the choice:** 7 of the 8 due (I-021 is the choice). Each row's read, as run today:
  - **I-009:** `check-year-position.mjs` → 81/81 PASS (stamped).
  - **I-017, I-020, W-004:** one shared read, `check-verdict-landing.mjs --fails-only` → 490/490 PASS (stamped on all three). The first attempt timed out at 420 s, run alongside the walk's browser; the re-run alone took 323 s.
  - **I-020 encounter:** W-004 step 5. The tap does nothing, adds no history entry, and the walker only "half-expected" it to open.
  - **I-022:** `check-calibrate-tab.mjs` timed out at the 60 s default and again at 300 s, with every captured line PASS. `readCommandTimeoutMs` was raised to 600000, and the third run finished alone in 192 s → **93/93 PASS** (stamped). The run time varies from 192 s to over 300 s on this host. W-004 step 3: 1 scroll and 1 tap from /cycles/schlesinger-jr to Calibrate on Schlesinger Jr.; the curve and r moved together on one screen.
  - **I-024:** W-004 step 1a. The walker named the annual unsmoothed series from the box sentence (y 524) and the "why 5-yr" from the "Why two labels" paragraph (y 2380). Two residual findings come with it:
    - That paragraph sits 1,490 px below the "TFP GROWTH · 5-YR" label that raises the question.
    - The "99,999 bootstrap draws" caption and the drawn spectrum "could still read as a test that ran". "No test was run" is 860 px above them.
  - **I-024, manager's hypothesis on the /cycles list label** (W-004 step 1d): REFUTED for this walker. After reading the page, "US TFP growth (5-yr rolling)" "no longer misleads".
  - **W-001:** `gsc-read.mjs --start 2026-09-10` → 57 impressions, 0 clicks, position 10.4, 13 pages. Since 09-20: 31 impressions, 0 clicks, position 5.5. A query-grouped read shows 4 named rows ("cycle of ten" is new; the three Dalio rows sit at 50-60). Dalio's page left the post-09-20 page list. Average position moved under 20, which the row's onTrigger names as the condition to reopen click-through as a fresh row. At 31 impressions a zero is not a verdict.
- **(b) Owed child rows in the orchestrator's ledger:** **none**. 0 of 747 considered at compose.
- **(c) State reads marked CROSSED:** 2.
  - Dated gates due today: 8 of 8 UNREAD at compose. Read today as above, except I-022 (in flight) and the waived I-021/I-024.
  - Prior-day retro (10-05): 10 still-on-discipline findings. Listed for the close, not dispositioned here.
