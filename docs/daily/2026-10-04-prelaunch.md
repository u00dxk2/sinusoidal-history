# sinusoidal-cycles — 2026-10-04 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** from a cycle page, a phone reader reaches that cycle's Calibrate view in one tap, and the curve and r are on screen together. **Item:** I-022 (open, P3, lane-owned).

**The user problem, in the walker's words** (W-003 cold walk, 2026-10-03, synthetic, N = 1, `docs/walks/2026-10-03-w003.md`, "The single worst thing"): "Getting to 'Calibrate' for the cycle I was reading, on the phone. The cycle page has no Calibrate control; the way in is one link ('OPEN IN THE CHART →') seven screens down. That link drops you on the chart page below the Facets/Calibrate tabs, so the control you came for is off-screen above you." It is a synthetic walker's quote, not a real user's.

**What a user will see differently:** each of the nine paired cycle pages gets a "Calibrate this cycle" link in its "Peak calibration" section, next to the prose about the reference peak. One tap opens the chart with the Calibrate tab open on that cycle, scrolled so that the curve, the peak slider and r share one screen.

### Section 0

- **Primer:** `docs/cold-starts/2026-10-03.md` (written yesterday, round 2). No `2026-10-04.md` exists.
- **First action:** `check-state-phone.mjs https://sinusoidalhistory.com` reads **142/142 PASS**, so round 2's /state reason lines hold on production.
- **git:** `pull --ff-only` → "Already up to date". HEAD `618feea` = origin.
- **Listener:** 🟢 SSE alive (the SessionStart hook relaunched it, pid 36484, hello 15:50:48Z, 0 replayed). The loop is armed by a `ScheduleWakeup` call, and waker ranks 1-3 are running.
- **Codex:** GREEN, from the `[codex-probe]` line on this prompt (15:48:36Z). Not used at P1, because there is no diff yet.
- **CI:** `check-ci-status --workflow ci.yml` → GREEN for `618feeade2` (1 success, 0 failures).
- **Deploy drift:** `check-deployed-sha-drift --service sinusoidal-history` → NOT-APPLICABLE-BY-REGISTRY: the service is on the `commit` autoDeploy trigger, so this checker declines to judge it. It is not a pass. The lane's own delivery read is the production check above, 142/142, served by the round-2 build. (`--service sinusoidal-cycles` matched no service; the Render name is `sinusoidal-history`.)
- **Harness:** running 2.1.289 · fleet UNIFORM (26 of 26) · installed 2.1.289 (SAME).
- **Cycle rotation:** exit 0, "no product-love cycle picks this lane today (4 cycle(s) rotate over 23 lanes); run the normal P3".
- **Due gates:** `--snapshot` → "0 gate(s) due on/before 2026-10-04" (taken once, `tmp/due-gates-snapshot.json`).
- **Board:** `answered-cards` → no waiting, answered or pending-verify cards.
- **Recs yesterday:** no `## Recommendation` block in `docs/daily/2026-10-03-prelaunch.md`. Its round-2 "What remains" lines, each with a disposition:
  - Card c55395fc dismissal: ruled, it is the orchestrator's.
  - I-021 (the "Swipe" cue for mouse readers): carrying, still dated 2026-10-07, not selected.
  - `next start` outliving TaskStop: standing local note (memory `feedback_next_start_orphan`), applied today whenever the build is served.
  - The `render-put-secret.mjs` cancel leg: the orchestrator's, not a lane row.
- **Retro (10-03 r2), one finding that bears on this:** "a check written from a measurement inherits its looseness" (still on discipline). The new check legs below assert the landing against the viewport height and the r box, both measured independently of the link's own markup. They do not read back a value the page computes for itself.

### Evidence

- **OBSERVED, W-003 cold walk P3 and its single worst thing** (2026-10-03, synthetic, N = 1, iPhone 15 390x664): 4 taps, 1 drag and 3 scrolls from the cycle page to a drag. Curve and r were "never on screen together". The wrong-cycle part shipped 10-03 (`25c90b2`); this row is the rest.
- **OBSERVED, measured on production today** (`tmp/measure-calibrate-entry.mjs`, Playwright, /cycles/schlesinger-jr, touch emulated at the phone sizes):

  | size | page height | "Open in the chart" at | `?tab=calibrate&focus=` lands at | curve top / r bottom on arrival | curve top → r bottom |
  |---|---|---|---|---|---|
  | 390x664 | 5,452px | 5,021px (7.6 screens) | scrollY 0, Calibrate on schlesinger_jr | 1,096 / 1,643 (both below the screen) | 547px |
  | 320x568 | 6,313px | 5,845px (10.3 screens) | scrollY 0, same | 1,158 / 1,705 | 547px |
  | 1440x900 | 4,300px | 3,918px | scrollY 0, same | 667 / 1,201 | 534px |

  The present link (`/?focus=<id>`) lands on the Facets tab, at scrollY 936 (390) or 900 (320), with the tab strip 278px above the top of the screen. That matches the walk.
- **What the numbers say:** the URL state already opens Calibrate on the right cycle (`?tab=calibrate&focus=<id>`, nuqs). What is missing is a link that asks for it, placed where the page talks about calibration, and a landing scrolled to the curve. Curve top to r bottom is 547px, which fits a 664px screen and a 568px one (21px spare). So no layout change is needed for the fit, only for the landing.
- **MISSING:** real-user evidence. The site has no client analytics (a standing choice), and the lane has no evangelism-bar or evangelism-evidence file, so there is no bar metric to read.

### Permission, and the freezes

- **Decision class:** lane-owned product work (I-022 owner sinusoidal-cycles, "Nothing and nobody" in waitingFor). No card is open on it.
- **Its `waitJustification` dates it 2026-10-07**, but its own `loadBearing` reads "nothing outside the lane blocks it", and the unWait is "pick it up in a product round on or after 2026-10-07". It is a lane-chosen date with nothing funded behind it, so it yields: picking it up today re-dates it by doing it.
- **W-001 freeze (titles, meta, H1s, URLs, to 2026-10-07):** untouched. This adds one body link and one client-side scroll; no title, meta, H1 or URL changes. The new link points at `/?tab=calibrate&focus=<id>`, a query state of an existing URL. It is logged in W-001's notes so the 10-07 read can attribute a move.
- **W-004 (the 2026-10-07 cold walk)** already asks: "open /cycles/schlesinger-jr, reach its Calibrate view from that page, drag the peak". Shipping today means that walk reads the new path. That is the encounter check, not a conflict.
- **Not touched:** `public/data/spectral/`, `FigureScroller.tsx`, `HashLink.tsx`, the /state bands, `state-2026.csv`.

### Next action — improve

Prep only until the review. No commit, push or deploy.

1. In `src/lib/cycleRoutes.ts`, add `cycleCalibratePath(cycle)` → `/?tab=calibrate&focus=<id>`, with a unit test beside the existing `cycleChartPath` tests.
2. In `src/app/(app)/cycles/[id]/page.tsx`, add a "Calibrate this cycle →" link at the end of the "Peak calibration" section, for cycles with a paired series only (one cycle has none, so it has no Calibrate chip). The bottom "Open in the chart" link stays as the compare-all-ten route.
3. In `src/components/Viz.tsx` (`CalibrationPanelWithPicker`), on first mount with `tab=calibrate` and a `focus` that matches a chip, scroll the facet's chart to the top of the screen, once per arrival. A reader who opens the tab by hand is not moved.
4. Add three legs per size to `scripts/check-calibrate-tab.mjs`:
   - On `/cycles/schlesinger-jr`, the Calibrate link sits within the first 3 screens.
   - Following it lands with the pressed chip = that cycle.
   - The chart top is ≥ 0 and the r box's bottom is ≤ the viewport height.

   The red arm is production today: there is no such link, and the landing is at curve-top 1,096.

First command (the baseline these legs must flip):

```
node C:/dev/skylark/sinusoidal-cycles/tmp/measure-calibrate-entry.mjs https://sinusoidalhistory.com schlesinger-jr
```

### Acceptance

- On production at 390x664 and 320x568, `check-calibrate-tab.mjs` reads all legs PASS, including the three new ones:
  - The link is within 3 screens, against 7.6 and 10.3 today.
  - The landing is on the right chip.
  - Curve top ≥ 0 and r bottom ≤ viewport.
- The same legs fail on today's production (the red arm, recorded before the deploy).
- The existing legs stay green: 30/30 + the 10-03 focus legs.
- The rendered-text gate on the cycle pages shows exactly one added line per paired cycle page ("Calibrate this cycle →"), and none removed.

### Delivery and encounter checks

- **Delivery:** `check-calibrate-tab.mjs https://sinusoidalhistory.com` after Render shows the commit live, plus the measure script's table re-read.
- **Encounter:** W-004's cold walk on 2026-10-07 already walks this exact path (390x664, /cycles/schlesinger-jr → Calibrate → drag → "did curve and r change together?"). The site has no analytics, so no real-user event can appear. Exposure will be `blind`, with W-004 as the read.

**USER-FACING: yes**
- User-facing paths: `src/app/(app)/cycles/[id]/page.tsx`, `src/components/Viz.tsx`, `src/lib/cycleRoutes.ts`.
- Internal paths: `src/lib/cycleRoutes.test.ts`, `scripts/check-calibrate-tab.mjs` (the root lint reaches it), `continuity/items.json` (via continuity-edit), this report.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none** — read: kickoff "dated gates due today: 0", and this morning's snapshot "0 gate(s) due on/before 2026-10-04".
- (b) Owed child rows: **none** — read: kickoff "rows owed to you in skylark-site's ledger: 0 of 744".
- (c) CROSSED state reads: **none** — read: the kickoff's state block (no threshold clause printed as crossed). Noted, not crossed: "key numbers (yours): no list yet — write docs/key-metrics.json". It is a standing absence, and no threshold fired.
