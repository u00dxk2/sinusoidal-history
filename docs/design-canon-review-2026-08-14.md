# Design & usability canon review — 2026-08-14

**Scope.** Full site cold-walk: `/`, `/cycles`, `/cycles/kondratiev`, `/methods`,
plus the shared header/footer. Viewports 1440×1000 and 390×844. Instruments:
`/design-detectors` (8 mechanical floors, both viewports) + `/usability-audit`
(35-rule Norman × Krug canon, `skylark-site/docs/design-usability-canon.md`).
Live production for the audit; local production build for fix verification.

## BLUF

The site's *editorial* design is strong and deliberate — hierarchy, typography,
and restraint are all doing real work, and none of that needed changing. What it
had was an **accessibility and mobile-mechanics** gap underneath a good-looking
surface: a phone-width layout that scrolled sideways, a nav link that had been
invisible at every width for months, tap targets at 40% of the required size, and
a type scale whose smallest tier sat below the legibility floor in 43 places.

All of that is fixed. Detector findings **161 → 64**, and every one of the 64
survivors is either a confirmed false positive (19) or a low-severity measure
nit (45). Nothing here required touching the fact-checked prose or the chart.

## Findings

| # | Rule(s) | Sev | Finding | Effort | Status |
|---|---|---|---|---|---|
| F1 | R29, R14 | **HIGH** | Horizontal page overflow at 390px — `<nav>` forced `scrollWidth` 399 > 375, so the whole page scrolled sideways and "About" was clipped off the right edge | minor-eng | **fixed** |
| F2 | R28 | **HIGH** | 32 tap targets under the 44×44 floor: nav + footer links at 18px tall, range presets at 28px, tab triggers at 29px, cycle rows at 43px | minor-eng | **fixed** |
| F3 | R29, R30 | **HIGH** | 43 uses of `text-[10px]` and 6 of `text-[9px]` — below the 11px functional-text floor. 75 detector hits across all four surfaces | minor-eng | **fixed** |
| F4 | R30 | **HIGH** | `/methods` primary nav link was `hidden xs:inline`, but `xs` is not a configured breakpoint in this project — the variant never applied, so the link was hidden at **every** width. Latent since the class was written | copy-only | **fixed** |
| F5 | R30 | MED | Focus invisible: zero `:focus-visible` rules site-wide; two components used `focus:outline-none` with a 30%-opacity ring as replacement | minor-eng | **fixed** |
| F6 | R5 | MED | Reading measure ~94 chars on cycle-detail prose (704px @ 15px), ~128 on the mono source citation | config-only | **fixed** |
| F7 | R30 | LOW | `/methods` source lines at 11px used as body copy | config-only | **fixed** |
| F8 | R30 | LOW | Chart annotations measured **4.48:1** against paper — under AA by a rounding margin, at 9px | minor-eng | **fixed** (now 5.84:1 at 11px) |

### Withdrawn during verification

- **"10 of 19 SVGs unlabelled."** My first pass checked the `<svg>` elements
  themselves. Re-checked walking ancestors, **zero** are genuinely unlabelled —
  decorative glyphs inherit `aria-hidden` from wrapper spans and the cycle-page
  curve already carries `role="img"` with a descriptive `aria-label`. The
  codebase is more careful about ARIA than the naive check suggested.

### Confirmed false positive — for the allowlist owner (skylark-site)

`low-contrast` reports **19 findings that do not move when the contrast is
actually fixed.** The detector's pixel-sampling path samples through the chart
gridlines and curves sitting *behind* the annotation text, so it reports
"1.1:1 pixel / median 1.7:1" for text whose real composited ratio is 4.48:1.
After raising opacity 0.6 → 0.68 the true ratio is **5.84:1** (measured in-page:
`#1a1a1a` at 0.68 over `#fafaf6`) — a comfortable AA pass — while the detector's
number moved only 1.7 → 2.0 and still "fails".

This is the documented gradient/backdrop-sampling FP shape. Recommend the
allowlist owner either exempt SVG `<text>` over chart content, or have the rule
fall back to composited-color math when the element is inside an `<svg>`.

## What was deliberately not changed

- **The editorial design.** Typography, palette, the chart-room framing, the
  "No. 08 · A Reckoning" masthead. It is the project's strongest asset.
- **Any fact-checked prose.** Nothing in `cycles.json` / `series.json` was
  touched; no year-claims were altered, so no cos-math audit was required.
- **`ui/tabs.tsx`.** The 44px floor is set at the call site in `Viz.tsx`; the
  vendored shadcn primitive is shared and stays stock.
- **Remaining `line-length` (42) and `tiny-text` (3).** The survivors are
  88–96 chars against an 80 target, on non-`<p>` elements. Real but marginal;
  chasing them means restructuring layout containers for a few characters.

## Verification

| Check | Before | After |
|---|---|---|
| Detector findings (4 surfaces × 2 viewports) | 161 | **64** |
| ↳ `undersized-ui-text` | 75 | **0** |
| ↳ `tiny-text` | 17 | 3 |
| ↳ `line-length` | 50 | 42 |
| ↳ `low-contrast` | 19 | 19 *(confirmed FP)* |
| Horizontal overflow @390px | yes (399 > 375) | **no** (375 = 375) |
| Tap targets under 44px @390px | 32 | **1** *(inline prose link — floor applies to controls)* |
| Annotation contrast vs paper | 4.48:1 @ 9px | **5.84:1 @ 11px** |
| Nav links reachable @390px | 4 of 5 (one clipped, one dead) | **5 of 5** |

Gates: `npm run build` + `typecheck` + `lint` + 77 tests, all green.

## Re-audit

Re-walk F1/F2/F3 only, at 390px, after any header or type-scale change. The
mechanical floors are cheap to re-run:

```
node C:\dev\skylark\skylark-site\scripts\check-design-detectors.mjs \
  --url https://sinusoidal-history.skylarkcreations.com/ \
  --url https://sinusoidal-history.skylarkcreations.com/cycles/kondratiev
```
