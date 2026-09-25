---
product: sinusoidal-cycles
date: 2026-09-24
lifecycle_stage: pre-launch
north_star_metric: organic search clicks to sinusoidalhistory.com — the first signal that a human, not a crawler, arrived (retention and word-of-mouth are structurally unmeasurable here; the site carries no analytics by design)
north_star_value: 0
north_star_status: measured-zero
north_star_classification: expected-zero
last_deploy: be29b3a
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "The change a reader should see today: on a small phone (320 or 360 wide), the home page's first screen now shows all ten cycles, where yesterday it showed five or six."
---

# Daily — sinusoidal-cycles — 2026-09-24

## BLUF

**FIRST ACTION.** Nothing product-side is owed before `W-002`, `I-004`, `I-005` and `I-006` come due on 2026-09-27; the next session's first move is `I-005`'s wrapper (one command that reads every entry page's first screen), because its first run is the receipt `I-004` needs. Start by reading what it must replace:

```
node scripts/measure-fold.mjs https://sinusoidalhistory.com/ 320 568 "[data-overview-id=\"turchin_fathers_sons\"] svg"
```

**Today's ship, and what a reader sees.** On a 320- or 360-wide phone the home page now opens on **all ten cycles**, where production showed **5 of 10 at 320x568 and 6 of 10 at 360x560** this morning. The cause was not the figure: below 390px the site nav wrapped to a second 44px line, the "Vol. I · An editorial chart-room" kicker wrapped to two lines, and the phone intro restated the H1 over two lines — 85px of wrapping at 320 that 390 did not have. `be29b3a` sets the nav and kicker tighter under 390 (width < 390), keeps every nav link at least 44x44, tightens the top spacing by 32px there, and replaces the phone intro with one line that says what the H1 does not: "Long-wave history, 1600–2050." 390 and up are unchanged.

**The narrow-phone question, decided in one line:** a 320px reader is a reader this site serves; all ten now fit there, with 12px to spare at 320x568 and 4px at 360x560.

**DON'T-TOUCH.** `src/lib/overviewReading.ts` and its test — the single predicate behind a row's drawn and spoken readings. Also still frozen: titles, meta descriptions, H1s and URLs on every page until `W-001`'s 2026-10-07 read.

## What changed

- **`be29b3a` — every cycle on a 320- and 360-wide phone's first screen.** `src/app/(app)/layout.tsx` (nav: 11px, 0.1em tracking, 8px gaps, `min-w-11` on each link, header padding −8px, all under `max-[390px]`) and `src/app/(app)/page.tsx` (kicker tracking 0.16em, page top −12px, masthead margin −12px and row gap −4px, the phone intro line). CI GREEN (`check-ci-status --workflow ci.yml --wait`, 74s), Render live 2026-09-25T02:19Z (8:19 PM MT) on `be29b3aef6ec7f44e50dde856fee236660e8ca9c`.
- **Frames committed:** `docs/frames/2026-09-24-home-320.png` (production BEFORE), `docs/frames/2026-09-24-home-320-after-prod.png` and `docs/frames/2026-09-24-home-360-after-prod.png` (production AFTER).

## Inputs (controllable)

- **The pass bar was written before the CSS, per row.** `node scripts/measure-fold.mjs <url> <w> <h> '[data-overview-id="<id>"] svg'` for each of the ten ids at 320x568, 360x560 and 390x664 — the question-scoped selector, never the container's.

  | viewport | production before | production after (`be29b3a`) |
  |---|---|---|
  | 320x568 | 5 of 10 (row 10 cut 109px) | **10 of 10** (12px spare) |
  | 360x560 | 6 of 10 (row 10 cut 93px) | **10 of 10** (4px spare) |
  | 390x664 | 10 of 10 (72px spare) | 10 of 10 (72px spare, unchanged) |

- **The extremes, swept across the whole site, not just `/`.** Nine pages at eight widths (320–640) for horizontal overflow, nav line count and console errors: production 22 red cases before, **2 after** — the nav wrap is gone on every page from 320 to 389. The two that remain are on production today and untouched: `/state/2026` overflows 4px at 320, and the kicker wraps at 640 (the `sm` two-column layout).
- **Words proof.** `node scripts/check-rendered-text.mjs diff` production-before vs the local build → RED at exactly one line, the intended one (`Ten cycles of long-wave history on one axis.` → `Long-wave history, 1600–2050.`); a sorted comparison of both snapshots shows no other line moved (25 lines each). The chart itself is client-rendered and was not touched.
- **Adversarial review (Codex, working tree, before commit) found two real defects, both fixed before the commit:** at 11px "Chart" and "About" measured ~41px wide, under the 44px tap floor (fixed with `min-w-11`; re-measured 44.0x44.0); and `max-[389px]` compiles to width < 389, leaving a 389px screen out of the fix (switched to `max-[390px]`; 389 re-measured one-line nav, first row at 316px).
- **Gates at `be29b3a`:** `verify-with-receipt -- npm test` → `Test Files 12 passed (12) · Tests 90 passed (90)`, TRUE exit 0; `npm run typecheck` exit 0; `npm run lint` 0 errors.

## Outputs (lagging)

- **North star: 0 organic clicks, no read today on purpose** — the standing figure is the 2026-09-19 read (`gsc-read.mjs --start 2026-09-10` → clicks 0, impressions 19, position 21.0). Search Console lags ~3 days and `W-001`'s 2026-10-07 date exists to stop same-day re-reads. Nothing observable from today's ship at this traffic (N≈0 phone arrivals measurable; the site has no analytics); shipped on judgment.
- **Ledger:** 0 gates due (`check-due-gates-dispositioned --print` → `0 gate(s) due on/before 2026-09-24`, 9 rows swept). Four rows dated 2026-09-27, unchanged.

## Recommendation

**`I-005` then `I-004`, on their date.** The wrapper's first run is the only honest source for the "entry pages whose answer clears a first screen" count; today's home-page read (10 of 10 at three sizes) is its first leg.

**The 4px at 360x560 is thin.** Any future line added above the overview on a phone costs rows at that size first; re-run the 360x560 last-row read after any masthead edit.

**Found, not fixed:** `/state/2026` overflows 4px at 320 wide. Small and pre-existing; worth one look next session.

**Nothing is blocked on David**, and no board card is open for this lane.

<!-- findings:begin -->
**P4 (2026-09-24, 8:47 PM MT) — the `/state/2026` overflow above is FIXED, not carried.** The cause was the suggested citation: its closing URL is one unbreakable 12px monospace string that ran 24px past its box at 320 wide and scrolled the page 4px sideways. `130d8d3` lets it wrap (`break-words`); CI GREEN, Render live 2026-09-25T02:47:07Z on `130d8d350b`, and `be29b3a` is an ancestor of it (`git merge-base --is-ancestor` exit 0), so the P3 ship is still served. Production sweep, 9 pages x 8 widths: **22 red this morning → 2 after `be29b3a` → 1 after `130d8d3`**. The one left is the home kicker wrapping to two lines at 640 (the `sm` two-column masthead): cosmetic, desktop-width, no fold consequence, left as is.
<!-- findings:end -->

## State Appendix

### Section 0 (pre-flight, run at P1)

- **Primer:** today's (`docs/cold-starts/2026-09-24.md`) ABSENT; the brief was `docs/cold-starts/2026-09-25.md`, written 09-24 evening by the resumed 09-22 close.
- **Listener:** 🟢 pid 32692, SLUG MATCH, hello 2026-09-25T01:03:31Z; waker ladder up (rank 1 relaunched twice on benign exits).
- **Codex:** GREEN from the kickoff stamp (`2026-09-25T00:08:22Z`). `codexCalls: 0 (probed-declined)`; one adversarial review EXECUTED.
- **CI + drift:** GREEN at `f6353c758e` and at `be29b3aef6`. Drift NOT-APPLICABLE-BY-REGISTRY (commit-trigger service); the Render deploy read stands in.
- **Harness:** fleet SKEW (2.1.282 ×22, 2.1.280 ×2), installed 2.1.282.
- **Recs from 2026-09-22:** primer heading → executed (I-002 closed, `f6353c7`); declare numbers + wrapper → carried, I-004/I-005 dated 2026-09-27; narrow-phone extremes → executed today (`be29b3a`).
