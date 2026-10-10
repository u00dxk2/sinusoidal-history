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
