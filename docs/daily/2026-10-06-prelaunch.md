# sinusoidal-cycles — 2026-10-06 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** a reader of /cycles/kondratiev can tell which TFP series the verdict tested and why the chart is labelled differently. **Item:** I-024 (open, P3, lane-owned).

**The user problem, in the walker's words** (W-003 cold walk, 2026-10-03, synthetic, N = 1, `docs/walks/2026-10-03-w003.md:191`, D2): "The list on /cycles calls this pairing 'US TFP growth (5-yr rolling)' while the verdict text and figure say 'US TFP growth (annual, unsmoothed)', and the citation under the figure says '5-yr rolling' again; I could not tell from the page which series was tested without reading on." This is a synthetic walker's quote, not a real user's.

**What a user will see differently:** on /cycles/kondratiev the "Does it hold up?" box names the tested series ("annual, unsmoothed") instead of "a different cut… named in the verdict below". One sentence under the verdict's plain-English paragraph says why there are two labels: the test runs on the annual series, and the chart and citation show its 5-year rolling average for display only.

### Section 0

- **Primer:** `docs/cold-starts/2026-10-05.md` (written yesterday). There is no `2026-10-06.md`.
- **First action:** `check-confidence-tag-taps.mjs https://sinusoidalhistory.com` reads **8/8 PASS** (definition top=16, curves paragraph bottom=0), so I-023 holds on production.
- **git:** `pull --ff-only` printed "Already up to date". HEAD `0636623` = origin.
- **Listener:** 🟢 SSE alive. Launched by /listen this session (pid 41308, hello 14:55:52Z, 4 replayed). The loop is armed by a `ScheduleWakeup` call. Waker ranks 1-3 are running; rank 1 was relaunched after a deliberate `wake-shorten` exit.
- **Codex:** GREEN, from the `[codex-probe]` line on this prompt (14:53:10Z). Not used at P1, because there is no diff yet.
- **CI:** `check-ci-status --workflow ci.yml` → GREEN for `06366238da` (1 success, 0 failures, 0 pending).
- **Deploy drift:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live `06366238` = head (checksPass service, judged).
- **Harness:** running 2.1.291 · fleet UNIFORM (27 of 27) · installed 2.1.291 (SAME). The record moved from 2.1.277.
- **Cycle rotation:** exit 0, "no product-love cycle picks this lane today (4 cycle(s) rotate over 23 lanes); run the normal P3".
- **Due gates:** `--snapshot` → "0 gate(s) due on/before 2026-10-06" (taken once, `tmp/due-gates-snapshot.json`). It also flagged that I-021, I-024 and I-025 carry `readCommandWaived`. I-024's waiver is that it's lane work, not a measurement, which fits.
- **Board:** `answered-cards` → no waiting, answered or pending-verify cards.
- **Recs yesterday:** `docs/daily/2026-10-05-prelaunch.md` has no `## Recommendation` block (`Recs yesterday: none`). The primer's candidates are I-024 (selected here) and I-021 (waits on W-004's 10-07 read of the current cue).
- **Retro (10-05):** none of the quoted still-on-discipline findings bears on a body-copy change. The reply was not read whole at P1.

### Evidence

- **OBSERVED, W-003 D2** (2026-10-03, synthetic, N = 1, 1440x900): the quote above.
- **OBSERVED, production text today** (`check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/kondratiev`, 95 lines, server-rendered text only). "5-yr rolling" appears three times: the chart legend "TFP growth · 5-yr" (line 31), the paired-data block "US TFP growth (5-yr rolling)" (55), and the citation (81). "annual, unsmoothed" appears once, in the verdict paragraph (69), which comes from the frozen `verdicts.json` `lay_text`. The box (21) says the tested record is "a different cut… named in the verdict below" but never says which label is which, or why.
- **OBSERVED, in the tree:** the mismatch is deliberate. `verdicts.json` tests `us_tfp_growth_annual`; `series.json` draws `us_tfp_growth` (rolled). `us_tfp_growth.source.md:22` says "The rolled CSV remains the display series on the chart", and AGENTS.md bans the rolled CSV from inference. So the fix is copy, not data.
- **OBSERVED, adjacent but not selected:** Turchin's page has the same shape (`wid_top1_wealth_1913` tested, a different series drawn). I-024 names Kondratiev only, so Turchin stays as it is today and is carried as a candidate.
- **MISSING:** real-user evidence. There's no client analytics (a standing choice), and the lane has no evangelism-bar or evangelism-evidence file, so there is no bar metric to read.

### Permission, and the freezes

- **Decision class:** lane-owned product copy. I-024's owner is sinusoidal-cycles, its waitingFor reads "Nothing and nobody", and no card is open on it.
- **Its `waitJustification` dates it 2026-10-07**, but its own `loadBearing` reads "lane product work for a later round; nothing outside the lane blocks it". That date was lane-chosen with nothing funded behind it, so it yields, as I-020's and I-022's did. The primer names I-024 as today's pickup.
- **W-001 freeze (titles, meta, H1s, URLs, to 2026-10-07):** untouched. This is body copy only. I'll log the added body string in W-001's notes, as I-022 did on 10-04, so tomorrow's read can attribute any move.
- **W-004 (10-07 cold walk)** reads /cycles/kondratiev at 1440 and ~900. Shipping today makes that walk the first cold read of I-024's closeWhen. I'll add one line to W-004's notes at P3 and won't start a new walk.
- **Frozen, not touched:** `verdicts.json` and `public/data/spectral/` (the `lay_text` and the figure label stay), `FigureScroller.tsx`, `HashLink.tsx`, the /state bands, `state-2026.csv`.
- **Mirrors:** no /methods change is planned, so `public/methods.md` needs nothing (methods already says inference runs on unsmoothed series, `methods/page.tsx:291`). `public/about.md` and `llms.txt` aren't touched.

### Next action — improve

Prep only until the review. No commit, push or deploy.

1. In `src/app/(app)/cycles/[id]/page.tsx`, add a small map keyed by the TESTED series id (`verdict.series_id`) that holds the tested series' plain name and one "why two labels" sentence. It has one entry, `us_tfp_growth_annual`. With an entry, the box sentence at line 231 names the series ("The record this verdict tests, US TFP growth (annual, unsmoothed), runs 77 years: …"). Without one (Turchin today), the current generic sentence stays.
2. Under `verdict.lay_text` (line 532), when that entry exists, render one sentence along the lines of: "The chart above and the citation below show the 5-year rolling average of this series, which is easier to read. The test uses the annual figures, because a rolling average would make neighbouring years look related and flatter the noise model." The wording gets checked against `us_tfp_growth.source.md`/`_annual.source.md` before the commit, and it must make no claim that the source files don't support.
   - **Prep note (09:19 MT):** `us_tfp_growth_annual.source.md:10-13` supports "a rolling average makes neighbouring years move together (it 'reddens the spectrum') and would corrupt the noise model the test compares against". It also says the smoothing "barely attenuates the 54–55-year band". So "flatter the noise model" in the draft above is unsupported and is dropped. The sentence must not imply that smoothing hides or creates the 54-year cycle.
3. Add a test that renders the Kondratiev page data path and asserts both strings. The red arm: remove the map entry and show the test failing.

First command (the baseline the change must move):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/kondratiev C:/Users/david/AppData/Local/Temp/claude/C--dev-skylark-sinusoidal-cycles/d3ba0810-d504-472e-affe-da57558d9515/scratchpad/kondratiev-before-2026-10-06.txt
```

(Already run: 95 lines.)

### Acceptance

- On production /cycles/kondratiev, the box names "US TFP growth (annual, unsmoothed)" as the tested record, and one sentence says the chart and citation show the 5-year rolling average and why. The phrase "named in the verdict below" is gone from that page.
- Rendered-text line multiset, before → after: Kondratiev changes only on the box line plus one added line, and no other line moves. /cycles/turchin and /cycles/perez (a page whose tested and drawn series match) are unchanged.
- The new test passes, fails with the map entry removed, and passes again on a clean tree. Both outputs go in the P3 report.
- No title, meta, H1 or URL changes (the rendered-text diff of `<title>`/H1 is unchanged).
- `python scripts/audit_cycle_rationales.py` isn't needed: the new prose names no year position. If the wording ends up naming one, it runs.

### Delivery and encounter checks

- **Delivery:** CI green on the push, then the deploy row reads live (checksPass), then the production rendered-text snap of /cycles/kondratiev shows both strings.
- **Encounter:** W-004, 2026-10-07, step (1) on /cycles/kondratiev at 1440. I add the question "which series did the verdict test, and why does the chart say 5-yr?" to W-004's notes at P3. That walk is synthetic and is not a real-user read. With no client analytics there's no event to watch, so exposure will be `blind — no client analytics`, with the bug row named at P3.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx` (what users get), a new or extended test under `src/` (internal), `continuity/items.json` (internal: I-024, W-001 and W-004 notes), this report (internal).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none**. `dated gates due today` read 0 at compose and this morning's `--snapshot` read 0.
- (b) Owed child rows in the orchestrator's ledger: **none**. 0 of 747 considered at compose.
- (c) State reads marked CROSSED: **none**. None of the kickoff's reads printed a crossed threshold. The prior-day retro carries 10 still-on-discipline findings, listed for the close and not dispositioned here.
