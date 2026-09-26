# Journey-walk — 2026-09-26 (phone, cold)

**Scope.** Flow 1 of `docs/key-user-flows.md` on production `https://sinusoidalhistory.com`,
as a cold logged-out first-timer on a phone: 390x844, touch-emulated, fresh browser context.
Walked: `/` → focus a cycle (facet title tap and `?focus=` deep link) → calibrate → **Full
page →** `/cycles/kondratiev` → exits `/state/2026`, `/methods` (also as a search ENTRY), `/cycles`.
Not re-walked: `/poster`, `/embed/docs` (both fixed and live-verified 08-24; no change since).
Screenshots live in the session scratchpad only, following the 08-24 walk's precedent.

## BLUF

Since 08-24 the journey has turned around: the phone's first screen now shows all ten cycles on
one axis with today's dot, a facet-title tap lands the reader on the focused chart (scrollY 0 →
490, chart in view), and every entry page answers its question above the fold. Every number the
site asserts that I traced recomputes exactly. The one thing that still broke the promised
interaction was mechanical: **the calibrate sliders rendered with no track** — shadcn colour
tokens this theme never defines came out transparent, so "calibrate" was a lone circle floating
under a label. Fixed and shipped today. **Pattern: the 08-24 "answer is one screen down"
gauntlet is gone; what remains is small component-library debris (undefined shadcn tokens) in
the one interactive surface a reader touches.**

## The walk, in order

| # | Screen | What a first-timer sees | Seam note |
|---|---|---|---|
| 01 | `/` first viewport | Masthead, "Ten cycles, *one axis.*", "Long-wave history, 1600–2050.", EVERY CYCLE AT A GLANCE — ten labelled curves with today's dot and a 1600–2026 axis, then "Each in detail below — tap one to focus and calibrate." | The 09-22 phone glance figure lands. The at-a-glance rows are a figure, not controls (map says so; tapping a row label does nothing — consistent with the caption, which points *below*). |
| 02 | Tabs + facets | Facets / Calibrate tabs (Overlay desktop-only, as mapped), ten facet cards with phase labels. | — |
| 03 | Tap facet title "Kondratiev wave" | URL → `/?focus=kondratiev`, page scrolls so the focused card sits in view; other facets dim to single-line thumbnails. Expanded chart (theory + TFP series), rationale, peak calibration, caveat, citation, **FULL PAGE →**, CALIBRATE. | J1 (08-24) held. |
| 04 | Calibrate on the focused card | Reference-peak-year and period sliders with min/max labels, live "PEARSON R · VS. US TFP GROWTH (5-YR ROLLING) −0.168", "Diagnostic, not a test statistic." | **The sliders had no visible track** (F1, fixed today). Moving the peak to 1990 works: phase flips PEAKING → RISING, "published 1973" appears beside the value, r → −0.232, "reset to published" becomes a link. |
| 05 | Axis under the focused card | 1600 · 1680 · 1760 · 1840 · 1920 · now · 2026 | "1920 now · 2026" reads as one cluster at 390px (F3). |
| 06 | `/cycles/kondratiev` | "CYCLE NO. 02 · EMPIRICAL · CONTESTED", H1, rationale, **DOES IT HOLD UP?** — "Not testable on the record that exists — and that is the finding, not a dodge." with the numbers, then period / reference peak / chart / extrema / paired series / verdict / reuse. | The 09-25 "answers on a phone's first screen" ship lands. |
| 07 | `/state/2026` | Headline "3 of the 10 constructions read at peak, and 8 of 10 sit above their midline", disclaimer, the table (horizontal scroller, sticky name column), citation block, DOI, CSV, API. | — |
| 08 | `/methods` (search entry) | "In brief" block with See the chart → and the 0-of-9 spectral headline, "On this page" jump list. | — |
| 09 | `/cycles` | Index by ascending period; spectral one-liner up top; each entry with tier and "The longer story" disclosure. | — |

Console: zero JS errors on every page walked (one host "Duplicate headers" warning on `/`,
benign, noted 08-24). Horizontal overflow: none (`scrollWidth = clientWidth = 390`) — the
state/methods/cycles tables overflow only inside their own scrollers, by design.

## Three-axis score (one journey)

- **Narrative coherence — strong.** One promise (ten cycles, one axis, honestly tested) carried
  from H1 through the focused card to the cycle page's "does it hold up?" and the methods page's
  0-of-9. No false finish lines, no asks at all (there is nothing to sign up for).
- **Design / brand compliance — strong, one defect.** Print-editorial type and palette hold
  across every page; the one off-system element was the shadcn slider, whose colour classes
  pointed at tokens this theme lacks (F1). The same class of undefined tokens sits in
  `ui/tabs.tsx`, `ui/toggle.tsx`, `ui/scroll-area.tsx` (F2) — they render acceptably today only
  because other classes override them.
- **Effectiveness — delivers.** A cold reader reaches the aha (see the ten curves peak near now,
  focus one, learn why that is a selection effect, drag the anchor and watch the phase change)
  within two taps. The calibrate step was the weak link; with a visible track it now reads as a
  control.

## Claims vs computed

Recomputed by hand from `cos(2π·(2026 − peak)/period)` and the stated ±3%-of-period (extremum)
/ ±1.5% (crossing) bands:

| Claim | Recomputed | Verdict |
|---|---|---|
| `/state/2026` table — all ten COS values, PHASE labels, NEXT PEAK, NEXT TROUGH | e.g. Kondratiev 54y/1973 → +0.993, 1y from peak (band ±1.62) PEAKING, 2027/2054; Huntington 60y/1968 → +0.98 but 2y from peak (band ±1.8) RISING; Perez 55y/2000 → −0.985, 1.5y from trough (±1.65) TROUGHING, 2028/2055; Modelski 110y/1945 → −0.085, 1.5y from crossing (±1.65) CROSSING | **10 of 10 rows TRUE** |
| "3 of the 10 constructions read at peak" | Kondratiev, Ray Dalio, Ibn Khaldun | TRUE |
| "8 of 10 sit above their midline" | all but Perez and Modelski have cos > 0 | TRUE |
| `/cycles/kondratiev`: "runs 77 years: 1.4 of the 3.0 full periods … Roughly 85 more years" | 77/54 = 1.43; 3·54 − 77 = 85 | TRUE |
| `/cycles/kondratiev` extrema list (peaks 1649 … 2027, troughs 1622 … 2000) | 1973 ± 54k; troughs +27 | TRUE |
| Home phase labels (e.g. Kondratiev PEAKING) and focused-card phase after calibration (1990 → RISING) | 2026 − 1990 = 36, 18y before the next peak → RISING | TRUE |

## Map vs territory

`docs/key-user-flows.md` flow 1 matches what I walked, screen for screen, including the 09-22
phone glance figure and the 09-25/26 first-screen answers. One addition made in this commit:
step 4 now says what the calibrate controls are (two sliders + live r + reset) rather than only
naming them, because that is the surface that carried today's defect.

## Shipped today

`4652e29` — `fix(calibrate): the slider track renders — it was transparent on production`.
`src/components/ui/slider.tsx`: track `bg-muted` → `bg-rule-soft`, range `bg-primary` →
`bg-ink-soft`, thumb `border-primary` → `border-ink`, `ring-ring/50` → `ring-ink/20`, and the
thumb now receives the `aria-label` that `CycleFacet`'s `SliderRow` passes (it stopped at the
Radix Root, so both sliders were unnamed to a screen reader). Pinned by
`src/lib/sliderTokens.test.ts` (every colour utility in the slider must resolve to a
`--color-*` in `globals.css`, with a positive control that `bg-muted` IS caught). Gate: that
vitest file 3/3, `npm run typecheck` (tsconfig.test.json) exit 0, eslint on both files exit 0;
CI runs the full battery. Live read: see the addendum.

## Remaining findings, ranked

| # | Finding | Canon | Sev | Effort | Kind |
|---|---|---|---|---|---|
| F2 | Same undefined-token class in `ui/tabs.tsx` (`bg-muted`, `text-muted-foreground`, `border-input`, `ring-ring`), `ui/toggle.tsx` (`bg-accent`, `border-destructive`…), `ui/scroll-area.tsx` (`ring-ring`). Harmless today only because other classes win; a future state (disabled, invalid, focus) will render transparent. Either define the shadcn tokens in `@theme` from the site palette or replace them per component. | R7, R30 | MED | S | reversible micro |
| F3 | Focused-card axis at 390px: "1920 now · 2026" reads as one cluster; the "now" label sits a few px from the 1920 tick. | R5 | LOW | S | reversible micro |
| F4 | Slider thumbs are 16px on a ~16px-high root — the whole track is draggable, but the grab target is under the 44px floor. | R28 | LOW | S | reversible micro |
| F5 | Cycle rationales end without a full stop (e.g. Kondratiev "…reaching back to the 1780s"), on `/`, `/cycles`, and the cycle page. Data-sourced prose (`cycles.json`), so it goes through the prose-mirror discipline. | R31 (sloppy look) | LOW | S | copy, mirror-gated |
| F6 | Calibrate TAB still shows no chart (08-24 D8/M12, carried). The focused card's calibrate is now the better surface; the tab may simply be redundant. | R20 | LOW | M | taste |

## The ONE for 09-27 P1

**sinusoidal-cycles: finish the component-token sweep (F2) — tabs/toggle/scroll-area carry the
same undefined shadcn tokens that made the calibrate track invisible; one `@theme` block mapping
them to the site palette closes the whole class.**

---

## Addendum — live read

Render `sinusoidal-history` (`srv-d7mcat7lk1mc73bidim0`) deploy row: **`4652e29` live, finished
2026-09-26T20:43:43Z**. Then read on production at 390x844 (`/?focus=kondratiev`):

- Slider track computed `rgb(216, 212, 197)` (rule-soft) and filled range `rgb(74, 74, 72)`
  (ink-soft) on both sliders — before the push both read `rgba(0, 0, 0, 0)`. The screenshot shows
  a visible bar with the thumb at 1973.
- Thumbs now expose `aria-label` "Reference peak year" and "Period (years)" (before: null).
- Arrowing the peak to 1990 still moves r −0.168 → −0.232 and the phase PEAKING → RISING.
