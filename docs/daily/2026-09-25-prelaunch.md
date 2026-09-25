---
product: sinusoidal-cycles
date: 2026-09-25
lifecycle_stage: pre-launch
north_star_metric: organic search clicks to sinusoidalhistory.com — the first signal that a human, not a crawler, arrived (retention and word-of-mouth are structurally unmeasurable here; the site carries no analytics by design)
north_star_value: 0
north_star_status: measured-zero
north_star_classification: expected-zero
last_deploy: 27ec7df
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "The change a reader should see today: on a phone, every entry page — the home page, the index, methods and all ten cycle pages — shows its answer on the first screen, and the one cycle page that never answered 'does it hold up?' now does."
---

# Daily — sinusoidal-cycles — 2026-09-25

## BLUF

**FIRST ACTION.** Nothing is owed before `W-002` (does a phone reader understand a cycle's confidence tag) and `I-006` (cycle counts written as literals on surfaces that already import the data) come due on 2026-09-27. The next open product gap is the three entry pages still cut at 320x568. Start by reading it:

```
node scripts/check-entry-folds.mjs --width 320 --height 568
```

**Today's ship, and what a reader sees.** A phone reader now gets each entry page's answer without scrolling: the home page's ten cycles, the index's first cycle, the methods page's in-brief answer, and every cycle page's "Does it hold up?". On production, measured by `node scripts/check-entry-folds.mjs` (new today) at each size, before the day's first ship and after the last:

| phone first screen | before | after |
|---|---|---|
| 390x664 (a standard iPhone in Safari) | 11 of 13 | **13 of 13** (min 72px spare) |
| 360x560 | 2 of 13 | **13 of 13** (thinnest: `/` 4px, `/cycles/turchin` 12px, `/methods` 13px) |
| 320x568 | 1 of 13 | 10 of 13 |

The one cycle with no paired data series, Turchin's fathers-and-sons cycle, used to skip the question entirely. Its page now opens with "Not tested — this cycle has no paired data series on this site, so there is no record to test it against", plus a link to the caveat that says why: the violence database it would use carries no reuse license.

**DON'T-TOUCH.** `src/lib/overviewReading.ts` and its test, the single predicate behind a home row's drawn and spoken readings. The `sm:` twin on every phone-only class in `/cycles/<slug>`, `/cycles` and `/methods`: each one is what keeps desktop identical. Titles, meta descriptions, H1 text and URLs stay frozen on every page until `W-001`'s 2026-10-07 read.

## What changed

- **`45abf72` — `scripts/check-entry-folds.mjs`.** It reads 13 entry-page legs in one browser from one `{question, path, selector}` table: `/`, `/cycles`, `/methods`, and one `/cycles/<slug>` per cycle in `src/data/cycles.json`. It prints `N of 13 entry-page legs answer on the first screen` and exits 1 when a leg is cut, 2 when one is missing or hidden. `--width`/`--height` pick the phone. `--selftest` (13 checks, red arms included) is spawned by `src/lib/check-entry-folds.test.ts`. Blind to an answer clipped by an `overflow:hidden` ancestor, and so is `measure-fold.mjs`.
- **`5838ca8` — every cycle page answers on a 390x664 phone.** It adds the no-verdict "Does it hold up?" box, and tightens the space above the verdict by 40px below 640px wide.
- **`27ec7df` — every entry page answers on a 360x560 phone.** Below 640px only, on the three page templates: tighter spacing above the answer, a 30–34px H1, a 15px description and lede, a 16px verdict answer, and the breadcrumb's current-page crumb hidden (it repeated the H1 and wrapped the breadcrumb onto a second line). No words changed.
- **`412d2ba`, `f8fac09` — the two leading product numbers are declared** in `docs/daily-config.md`, each with its command. `I-004` (declare them) and `I-005` (one command for every entry page) closed on one production run; `f71bd60` corrected both rows at P2 first.
- **Frames, production after the deploys:** `docs/frames/2026-09-25-fathers-sons-390-after-prod.png`, `…-turchin-360-after-prod.png`, `…-cycles-360-after-prod.png`, `…-methods-360-after-prod.png`.

## Inputs (controllable)

- **The pass bar was the script's own first run, written down before any CSS.** Production at 390x664, ~7:37 AM MT: `RED: 11 of 13` (exit 2). `/cycles/turchin` was cut 37px, `/cycles/turchin-fathers-sons` had no answer element, and three pages had 1px to spare. It was the first measurement ever of nine of the ten cycle pages. It reproduced the older reads exactly: `/` 72px and `/methods` 57px, as on 09-24 and 09-22.
- **Desktop was checked, not assumed.** The built site at 1024x768 and at 640x800 (the exact `sm` boundary) read leg-for-leg identical to production (`check-entry-folds.mjs --width 1024 --height 768`, and `--width 640 --height 800`, run on both).
- **Words proof.** `check-rendered-text.mjs diff` production-vs-build is GREEN-identical on `/cycles` (216 lines), `/methods` (223) and `/cycles/turchin` (86). On `/cycles/turchin-fathers-sons` the line multiset is production's 61 lines plus exactly the 3 new ones, 0 removed.
- **Adversarial review, 3 runs (Codex, working tree, before each commit).** Run 1 found a hidden zero-size answer counted as visible; fixed. Run 2 found `visibility:hidden` and opacity 0 still passing; fixed with `checkVisibility`, and a positive control showed both now read hidden. Run 3 (the small-phone ship) approved after compiling the classes and comparing parsed source.
- **Gates at `27ec7df`:** `verify-with-receipt -- npm test` → `Test Files 13 passed (13) · Tests 91 passed (91)`, TRUE exit 0; `npm run typecheck` exit 0; `npm run lint` 0 errors; CI GREEN on `5838ca8` and `27ec7df` (`check-ci-status --workflow ci.yml --wait`).
- **Sibling sweeps.**
  - The skipped question: Grep `spectralVerdictForCycle|verdictForCycle` over `src/` → 5 hits, and the only other reader is `cycleRoutes.ts:141`, the meta description, which already says "with no paired data series" for that cycle.
  - The spacing: Grep `fontSize: "clamp\(` over `src/` → 3 hits, `/about`, `/colophon` and `/state/[year]`, which are not entry pages and were left unfitted.

## Outputs (lagging)

- **North star: 0 organic clicks, with no read today on purpose.** The standing figure is the 2026-09-19 read (`gsc-read.mjs --start 2026-09-10` → clicks 0, impressions 19, position 21.0). Search Console lags ~3 days, and `W-001`'s 2026-10-07 date exists to stop same-day re-reads. Nothing is observable from today's ship at this traffic: N≈0 phone arrivals are measurable, and the site has no analytics. I shipped on judgment.
- **The two leading product numbers** (secondary to the north star, declared today): entry-page legs answering on a 390x664 first screen = 13 of 13, and home curves in that screen = 10 of 10, both as of 2026-09-25 ~8:20 AM MT, from `node scripts/check-entry-folds.mjs`.
- **Ledger:** `check-due-gates-dispositioned --print` → `0 gate(s) due on/before 2026-09-25` (9 rows swept). `cc-endpoint-probe --endpoints items-stale-actionable` → `"items":[]` of 3 considered.

## Recommendation

**The 320x568 gap (a 320-wide phone), if it earns a day:** `/cycles` is 2px short, `/cycles/turchin` 28px and `/methods` 40px. Closing it takes either one more type step below 390px or the 103px site header. That header is shared with the home page, which has only 4px left at 360x560, so any header edit must re-read `/` at 360x560 first.

**`W-002` on its date (2026-09-27).** The confidence tag still shows in each cycle page's kicker on a phone; today's ship did not touch it.

**Nothing is blocked on David**, and no board card is open for this lane.

**One file for David's call:** starting `next dev` rewrote `AGENTS.md` (it inserts its own agent-rules block and dropped the JSX-whitespace section). It is uncommitted and unreverted; restoring it is `git checkout -- AGENTS.md`, and `agentRules: false` in `next.config` stops the rewrite.

<!-- findings:begin -->
<!-- findings:end -->

## State Appendix

### Section 0 (pre-flight, run at P1)

- **Primer:** `docs/cold-starts/2026-09-25.md` PRESENT, dated for today.
- **Listener:** 🟢 pid 41992, SLUG MATCH, hello 2026-09-25T12:50:35Z; waker ladder up (rank 1 relaunched twice on benign exits).
- **Codex:** GREEN from the kickoff stamp (`2026-09-25T12:51:10Z`). `codexCalls: 0 (probed-declined)`; three adversarial reviews EXECUTED.
- **CI + drift:** GREEN at `d792f11`, `5838ca8` and `27ec7df`. Drift is NOT-APPLICABLE-BY-REGISTRY (commit-trigger service); a production content read stands in for it.
- **Harness:** fleet SKEW (2.1.282 ×25, 2.1.280 ×1), installed 2.1.282.
- **Recs from 2026-09-24:** `I-005` then `I-004` → executed (both closed, `412d2ba`). The 360x560 thin margin → executed and widened (every entry page fits there now, `27ec7df`). `/state/2026` overflow → already executed on 09-24 (`130d8d3`).
