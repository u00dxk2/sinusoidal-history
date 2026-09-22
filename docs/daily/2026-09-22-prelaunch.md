---
product: sinusoidal-cycles
date: 2026-09-22
lifecycle_stage: pre-launch
north_star_metric: organic search clicks to sinusoidalhistory.com — the first signal that a human, not a crawler, arrived (retention and word-of-mouth are structurally unmeasurable here; the site carries no analytics by design)
north_star_value: 0
north_star_status: measured-zero
north_star_classification: expected-zero
last_deploy: 258c538
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "The change a reader should see today: on a phone, the home page's first screen shows all ten cycles at once — ten curves on one shared axis, each with a dot at 2026 — where yesterday it showed one."
---

# Daily — sinusoidal-cycles — 2026-09-22

## BLUF

**FIRST ACTION.** Make tomorrow's first action machine-readable, which is the fix `I-002` has been waiting for since 2026-09-20. Tonight's primer writes its first action under a `### First action` heading inside the `hand:begin banner` region, closed by a second `###`; the SessionStart hook reads exactly that — rule 2 in its own header, the first ATX heading matching `/first[\s-]+action/i` (`~/.claude/hooks/sessionstart-mt-date-and-primer.mjs`). The read is tomorrow morning's banner:

```
node C:/Users/david/.claude/hooks/sessionstart-mt-date-and-primer.mjs
```

**Today's ship, and what a reader sees.** On a phone the home page now opens on **all ten cycles at once** — "Every cycle, at a glance", ten 24px rows on the facets' shared time axis, each with a dot on a dashed line at 2026. Yesterday's ship put the FIRST curve on the first screen; the other nine still began about a screen and a half down, and the Overlay tab that draws all ten together is desktop-only, so a phone never reached the H1's promise. Curves fully inside a 390x664 first screen went **1 → 10**. Baseline 1: production read 2026-09-22 before the deploy, counting `[data-facet-id] svg[role="img"]` boxes fully inside the viewport in a browser at 390x664. After, 10: `node scripts/measure-fold.mjs https://sinusoidalhistory.com/ 390 664 '[data-overview-id="<id>"] svg'` for each of the ten ids, all exit 0 on production, the last with `72px of room to spare`. The same command for the last row returned `FAIL no [data-overview-id="turchin_fathers_sons"] svg` (exit 2) before the deploy.

**DON'T-TOUCH.** `src/lib/overviewReading.ts` and its test. It exists because the drawn reading and the spoken reading of a row drifted apart today, and it is now the single predicate both use; splitting that comparison back into two copies re-opens the defect the test pins. Also still frozen: titles, meta descriptions, H1s and URLs on every page until `W-001`'s 2026-10-07 read.

## What changed

- **`57ca745` — every cycle on a phone's first screen.** A new `src/components/CycleOverview.tsx`, rendered as the first block inside `Viz` under a `sm:hidden` wrapper: ten rows, one curve each, following the brush range and any calibration, with year labels and a dot at the current year. The rows are a FIGURE, not controls — a 24px row cannot meet the 44px tap floor (canon R28) — so the phone dek dropped "Tap a row to focus and calibrate." and that instruction moved to the caption under the figure, where it renders only on the Facets tab.
- **`386ddd7` — the production frame** the reached-claim rests on, `docs/frames/2026-09-22-home-390-after-prod.png`, captured after the deploy.
- **`258c538` — a row's spoken reading now moves with its drawn one.** The screen-reader text asserted a phase at 2026 unconditionally while the now-line and dot were gated on 2026 being inside the brushed range; brushed away from today, a row drew nothing and still said "peaking in 2026". Both now come from one predicate in `src/lib/overviewReading.ts`, pinned by `src/lib/overviewReading.test.ts`.
- **The sibling sweep of that fix found the same shape on two more surfaces, and both are fixed in the same pass.** A non-visual string asserting what the drawing does not: `CycleOverlay`'s chart told every screen reader "from 1600 to 2050" while the chart followed the brush (it interpolates the visible span now), and its `now · 2026` marker drew outside the plot area when the brush excluded today (gated now, like the identical marker in `FacetTimeAxis`). On `/cycles/<slug>` the figure's label named a reference-peak marker that only draws when the peak is inside the window; that clause is gated on the same condition — latent today, because every peak year is. Read back in a browser: `?tab=overlay&range=2027-2050` labels itself "from 2027 to 2050" and draws no now marker.
- **`f8a914b` — `I-003` closed** on this lane's own re-run of its readCommand, and the `/methods` phone frame committed.
- **`ac42fcf` — `I-002` re-scoped** to the SessionStart banner leg and re-dated 2026-09-27 → 2026-09-23, on the orchestrator's ruling.

## Inputs (controllable)

- **The pass bar was written before the build, and it is a per-row exit code.** "10 of 10 curves fully inside a 390x664 first screen, each row read by its own selector, never the container's" — the lesson `/methods` taught this morning, where `section[aria-label="In brief"]` read RED because the section also holds the jump list while the answer itself was fully visible. On production all ten rows exit 0.
- **The extremes are reported, not gated.** 6 of 10 rows at 360x560 and 5 of 10 at 320x568, both from 0. No horizontal overflow and no console errors at 320, 360, 390, 430, 639, 640 or 1440. Desktop is untouched: at 640x800 and 1440x900 the built page renders what production rendered before the ship.
- **The words proof, because `check-rendered-text` is blind to this page.** The chart is client-rendered, so that gate compares none of it. What was read instead is the rendered `main` innerText line multiset at 390x664, both sides loaded in Playwright and compared as sorted multisets (read 2026-09-22, production before the deploy vs the local production build): 123 → 150 lines, differing ONLY by the shortened dek and the figure's own 28 lines; built vs production after the deploy, **150 lines, 98 distinct, 0 lines only-in-either**.
- **Adversarial review found four defects before the commit; the manager's review found a fifth after it.** The four: axis labels collided at ≤340px (the tick filter compared raw positions while the renderer clamped edge labels inward); the caption claimed "each in detail below" on the Calibrate tab; "All ten" was hard-coded against a derived count; every visible part of a row was `aria-hidden`. The fifth is `258c538` above. Re-measured after the label fix across 11 width/range cases: no overlap anywhere, smallest gap 7.2px, nothing off-page.
- **The new test is armed red, not just green.** Making the reading unconditional (`return true ? …`) fails the suite: `expected ' (120-year cycle): peaking in 2026.' not to contain 'peaking'`, `Tests 2 failed | 2 passed (4)`, exit 1.

## Outputs (lagging)

- **North star: 0 organic clicks, and no read was run today on purpose.** The standing figure is the 2026-09-19 15:09Z read, `node scripts/gsc-read.mjs --start 2026-09-10` → `TOTAL clicks=0 impressions=19 position=21.0`. Search Console lags about three days, so a same-day re-read returns byte-identical totals; `W-001`'s 2026-10-07 date exists to stop exactly that waste. Nothing in today's ship bears on it yet.
- **`I-003` closed** (`check-next-primer-exists` resolves this lane under its roster slug now; exit 3 ABSENT for tomorrow's not-yet-written primer, which its onTrigger reads as fixed). `I-002` re-scoped and re-dated to 2026-09-23. `W-001` (2026-10-07) and `W-002` (2026-09-27) both unchanged and untouched by today's work.
- **Three rows were minted at the close, so today's deferrals are dated rather than carried as prose.** `I-004` (the two leading product numbers are undeclared in `docs/daily-config.md`) and `I-005` (no single command reads every entry page's first screen, so a layout ship can only be proven on the page it edited) come from the approved P1 proposal; `I-006` (cycle counts written as literals on surfaces that already import the data) comes from the sibling sweep's second half. All three are dated 2026-09-27, joining `W-002`, so this lane carries one gate date rather than four.
- **Engineering zero holds.** `gh api "repos/u00dxk2/sinusoidal-history/dependabot/alerts?state=open&per_page=100" --paginate --jq "length"` → `0`, and `node ../skylark-site/scripts/check-engineering-zero.mjs --project sinusoidal-cycles` → `lane sinusoidal-cycles: 0 finding(s), 0 unreadable, nothing to waive`, exit 0. The same run reports 2 findings across the 25 lanes it swept; those belong to other lanes, not this verdict.

## Recommendation

**Tomorrow's first action is the primer heading itself** — it is both the fix for `I-002` and the thing that makes tomorrow's banner carry a real action. The read is one command, and it is tomorrow morning's banner rather than a checker's opinion.

**The two leading product numbers should be declared, and the roster wrapper built, in that order.** Entry pages whose answer clears a phone's first screen, and home-page curves inside it (1 before today's deploy → 10 after, both read on production 2026-09-22 with the commands in the BLUF). The manager's caution is right: only the `/methods` leg of "4 of 4" has a receipt from today, and the other three are carried from 09-19 to 09-21, so the wrapper's first run is what earns that count. Both are rowed with a date rather than carried as prose.

**The extremes are the honest next product question.** "All ten" is a 390-wide promise: at 360x560 it is 6 of 10 and at 320x568 it is 5 of 10. Whether that matters depends on whether anyone arrives on a 320px screen — which is exactly the kind of question this lane cannot answer, and should not pretend to.

**Nothing is blocked on David**, and no board card is open for this lane.

## State Appendix

### Section 0 (pre-flight, run at P1)

- **Primer:** PRESENT (`docs/cold-starts/2026-09-22.md`), banner read first and quoted whole in the kickoff.
- **Listener:** 🟢 `node ../skylark-site/scripts/read-listener-strand.mjs --project sinusoidal-cycles` at 2026-09-22T12:54:23Z → `SLUG MATCH … last SSE hello WAS 2026-09-22T12:53:41.655Z … 0 consecutive no-loop warnings`, exit 0. The SessionStart hook had relaunched the listener before `/listen` ran, so `/listen` verified it rather than reaping a healthy one; the waker ladder came up on all three rungs and rank 1 fired once (WAKE-SHORTEN) and was relaunched.
- **Codex:** RED, quoted from the kickoff stamp and not re-run: `[codex-probe: RED, machine-level real exec at 2026-09-22T12:34:55.582Z]`. `codexCalls: 0 (probe-red)` on every post today; the adversarial review went to a Claude subagent instead.
- **CI + drift (P0 gate):** GREEN at every commit — `de05e21eeb`, `f8a914b2d1`, `ac42fcf7c9`, `57ca7458b6`, `386ddd7645`, `258c53807b`, each via `check-ci-status --workflow ci.yml` (three of them with `--wait`). Drift is `NOT-APPLICABLE-BY-REGISTRY` for `sinusoidal-history` (commit-trigger service) — a decline, not a pass; the production reads under Inputs stand in.
- **Tests:** `node ../skylark-site/scripts/verify-with-receipt.mjs -- npm test` at HEAD → `Test Files 12 passed (12) · Tests 90 passed (90)`, `[verify] TRUE exit 0`.
- **Harness:** running 2.1.278 · fleet UNIFORM (27 of 27 panes) · installed 2.1.278 (SAME).
- **Due gates:** `node ../skylark-site/scripts/check-due-gates-dispositioned.mjs --print` → `0 gate(s) due on/before 2026-09-22`, `RESULT: PASS`, 6 ledger rows swept (9 after the close's three mints).
- **Dead references:** `node ../skylark-site/scripts/check-doc-references.mjs` → `PASS — 0 dead references · 1 forward-ref (not yet due) · 33 unique paths across 6 doc(s)`, exit 0. The forward reference is `continuity/items.json:115` naming `docs/frames/2026-09-27-cycles-390.png`, which `W-002` will capture on its own date.
- **Stale-actionable:** `node ../skylark-site/scripts/cc-endpoint-probe.mjs --project sinusoidal-cycles --endpoints items-stale-actionable` → `"items":[]`, `"consideredCount":3`, `"ledgerState":"READABLE"`, exit 0.
- **Recs from 2026-09-21:** all four disposed — the `/methods` walk executed (below); the ten-curve build shipped as `57ca745`; no Search Console read was run; `I-003` closed rather than merely relayed.

### The `/methods` walk (yesterday's first action, done)

The three-day fold-defect streak breaks here. `docs/frames/2026-09-22-methods-390.png` (viewport, 390x664) shows the whole **In brief** answer — what the site is, "See the chart →", and the 0-of-9 spectral headline with "How the test works →". `measure-fold … 'section[aria-label="In brief"] > p:nth-of-type(2)'` → `OK … 57px of room to spare` (exit 0). The whole-section selector reads `RED … cut 98px below the fold` (exit 1) because that section also contains the "On this page" jump list, whose links start at the fold. What is cut is the jump list, not the answer; no fix shipped for it today.
