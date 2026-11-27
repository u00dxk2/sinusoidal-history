# DESIGN.md — Sinusoidal History

Written 2026-11-17 (MT) for the design and copy pass, round 2 (brief: `skylark-site/docs/specs/design-pass-brief-2026-11-17.md`). This is the P1 direction. No CSS exists for it yet. Nothing here is live, and nothing goes live without David's pick on the review page.

Product facts are in `docs/PRODUCT.md`. This file makes design decisions only; where it describes today's site it cites the file it read.

## Scope of this pass

- The first screen of `/` (home).
- One core flow state: a cycle's claim page, `/cycles/dalio`, with its empty state (`/cycles/turchin-fathers-sons`, a cycle with no paired record) and the error state (`not-found.tsx`, `error.tsx`).

Unchanged: the product name, the wave mark, the paper-and-ink identity, the ten cycle colours (`src/data/cycles.json`), the navigation, every route, and all chart behaviour. The site has no sign-in, payment or account code to touch.

## Art direction: from the subject

Five worlds native to this subject (theories that claim history moves in waves, set beside measured records):

1. **The chart-recorder strip.** A multi-pen recorder writes several channels on one ruled paper strip, all sharing one time axis. Each channel has a header block (station, units, span), and an inspector marks the sheet.
2. **The tide table.** Predicted sinusoids printed beside gauge readings.
3. **The astronomical almanac (ephemeris).** Tables of periods and epochs.
4. **The museum specimen label.** Each theory a specimen with a provenance card.
5. **The referee's report.** A claim, the evidence offered, and a verdict sheet.

**Picked: the chart-recorder strip.** Reasons:

- It is what the product already is. "Ten cycles, one axis" is a ten-channel record on one time base, and the phone home page already draws ten stacked rows that way. That is the existing quirk this pass keeps and builds on.
- Its vocabulary carries the product's honesty without adding a claim. A record sheet has a stated span, and "the record is too short" is a statement about a sheet, never about a theory.
- It carries no forecast. The tide table and the almanac were rejected for that reason: both are tables of predictions, and this site states no present position on any cycle (I-061, David, 2026-10-21, `docs/answers/2026-10-21.md`).
- The specimen label and the referee's report stay available as composition ideas inside this world (a header block is a label; a verdict is an inspector's mark).

**Registry.** Read live on 2026-11-17 at about 15:45 MT (`git fetch`, then `git show origin/main:docs/design-pass-registry-2026-11-17.md`). The first draft of this file picked Archivo and Literata from a checkout that had no registry file; both were already claimed (Archivo by decomposer, Literata by frame-dial), so both faces were re-picked before any CSS existed. No claimed row uses IBM Plex. One neighbour to stay clear of: sound-shapes claimed "the phonautograph's smoked paper", a single stylus line on soot black with a left-to-right trace. This lane's sheet is the opposite ground and grammar: pale ruled paper, ten channels at once, header blocks, and no travelling trace. This lane's row, posted on the bus:

| Field | Value |
|---|---|
| Lane | sinusoidal-cycles |
| World | The ten-channel chart-recorder strip (a multi-pen instrument record on ruled paper, with a header block per channel and an inspector's mark) |
| Display face | IBM Plex Sans Condensed, weight 600 |
| Text face | IBM Plex Serif, weights 400 and 600 |
| Neutral temperature | Warm: buff paper and brown-black ink, tinted toward the amber accent (hue about 45°) |
| Radius | 2px |
| Density | Dense: record-sheet rows, tabular figures, hairline rules |
| Motion signature | "Ruling first, ink second": the grid appears, then every trace fades in together |
| Image vocabulary | Ruled grid, pen traces, registration ticks, header blocks of label and value, one inspector's mark per verdict. No photographs, no illustration, no icon set |

The registry is re-read the same way before any CSS is written at P3.

## Colour

- **Accent: amber `#e9b942`** (`--highlight`, `src/app/globals.css:22`), the one saturated interface colour. Today it appears in one place only, the text-selection background (`globals.css:126-129`). From this pass on it marks at most one primary action per view. It is never text on paper (it fails contrast there); it is a fill or an underline behind ink.
- **The ten cycle colours are data ink, not interface colour.** They come from `src/data/cycles.json` and identify a trace and its header. They are never used for a button, a link or a decoration.
- **Neutrals, tinted toward the accent hue.** Today's tokens stay as the starting point: paper `#fafaf6`, deeper paper `#f1ede1`, ink `#1a1a1a`, soft ink `#4a4a48`, rule `#2a2a2a`, soft rule `#d8d4c5` (`src/app/globals.css:16-21`), with the dark set at `:48-53`. P3 may shift paper toward buff by a few points of chroma, and must re-read AA contrast for all ten cycle colours on it if it does.
- No gradient anywhere. The two faint radial gradients on `body` (`src/app/globals.css:79-81`) go.

## Type

Two families, three weights in all. Both are open-licence (SIL OFL) and will be **self-hosted and subset** through `next/font/local`. Today three families (Geist, Geist Mono, Fraunces) are imported from `next/font/google` (`src/app/layout.tsx:2`); the brief rules out a build-time font fetch, so that import goes.

- **Display: IBM Plex Sans Condensed, weight 600.** Reason: the lettering on chart paper and instrument plates is condensed grotesque, set tight, and Plex was drawn from the lettering of engineered machines. A narrow face also buys characters where this site counts them: several first-screen lines are budgeted per character at 320px (`src/lib/overviewReading.ts`).
- **Text: IBM Plex Serif, weights 400 and 600** (italic 400 only for the titles of cited works). Reason: the site is long rationale prose, and the serif of the same superfamily reads as a technical report, which is what a cycle page is. One superfamily keeps header blocks and prose on the same skeleton.
- **Geist Mono goes.** Monospace labels on a product that is not about code are a tell (below). Columns of years and periods are set in the display face with tabular figures; P3 confirms the subset carries them before relying on it.
- Body text stays 16px or larger. The 15px and 14px prose on the home page and cycle page rises to 16px inside this pass's scope.

**The subsets are rebuilt, not downloaded (I-092, 2026-11-27).** The three files in `src/fonts` started as the fontsource latin subsets, which carry ↑ and ↓ but not ← or →, so every flag-on arrow was drawn in Arial, Arial Narrow or Times New Roman (`scripts/check-glyph-source.mjs` on production: 76 of 76 visible arrows on a system face). `scripts/build_plex_subsets.py` rebuilds them from the Google Fonts TTFs fontsource builds from, at the same versions (Sans Condensed 1.3, Serif 2.6). It keeps each file's own code points and adds ← → ≈ ≥ ↗ ✓ π (≤ comes with ≥), and it verifies that every existing character keeps its outline, advance and kerning, along with the line metrics and names. Still not in the faces: Δ and φ (inside a `font-mono` code span on /methods) and ▾ (the /cycles disclosure triangle). Upstream Plex lacks all three. Before a new character goes on a flag-on surface, run `python -P scripts/build_plex_subsets.py --sweep`, then `check-glyph-source.mjs` on a build.

**A font change voids measured budgets.** The phone glance caption (33 characters at 320), the height label (23) and the verdict line (118) are character counts measured in today's faces. Any variant that restyles them re-measures on a real build and re-runs `scripts/check-entry-folds.mjs` at 320x568, 360x560 and 390x664 before it is offered.

## Space, shape, depth, motion

- **Spacing scale (px):** 4, 6, 8, 12, 16, 24, 32, 48, 64, 96. Every adjacent step differs by at least 33%.
- **One radius: 2px** (the value the focus ring already uses, `src/app/globals.css:64`). Paper and plates have square corners; 2px only softens the pixel.
- **One shadow: none as elevation.** The single permitted depth cue is a 1px ink hairline under a sheet edge (`0 1px 0` at 12% ink). Nothing floats.
- **One motion signature: ruling first, ink second.** On first paint the grid lines appear, then all traces fade in together, about 200ms, once. There is deliberately no pen that travels left to right: a moving tip is a "now" mark in motion, and walkers read every drawn "now" as a claim about the present (I-048, I-061). Under `prefers-reduced-motion` everything is drawn at once.
- **Focus styles stay:** the 2px ink outline at 2px offset (`src/app/globals.css:61-65`).

## The tells, audited against today's site

The brief lists two generations of tells. Today's home page carries five of the 2026 set:

| Tell | Today | Decision |
|---|---|---|
| Cream background with Fraunces | Yes (`globals.css:16`, `layout.tsx:21`) | Fraunces goes. Paper stays, with a reason: the ten cycle colours were chosen against it, and ruled paper is this world's ground |
| One italic accent word in the headline | Yes: "one axis." (`page.tsx:47-49`) | Goes |
| Badge or kicker above the H1 | Yes: "Vol. I · An editorial chart-room" (`page.tsx:27-44`) | Goes. It says nothing about the product |
| Uppercase tracked micro-labels | Yes, on most labels | Go. The one place they were kept (variant b's header block) went with variant b at the rollout (2026-11-17, round 3). Never as an eyebrow over a headline |
| Monospace furniture on a non-code product | Yes (Geist Mono on labels, breadcrumbs, the 404) | Goes |
| Stat banner, gradients, gradient text, three icon cards, emoji icons | No | Stay out |

## What shipped

Round 2 built three first-screen variants from different composition families behind one flag. **A** (the instrument is the hero: the ten-channel strip fills the first screen under a slim header line) was picked: first blind (`docs/design-pass-2026-11-17/blind-pick.md`), then on the review page. **B** (one dominant object) and **C** (the editorial column) were removed at the rollout (2026-11-17, round 3), along with their CSS, copy and preview routes.

**Flag:** build-time environment variable `NEXT_PUBLIC_DESIGN_PASS_VARIANT=a` (`src/lib/designPass.ts`; any other value, including `b` or `c`, reads as unset). The `NEXT_PUBLIC_` prefix is there because the error screen is a client component and reads the same switch. It is inlined at build time, so changing it needs a redeploy. **Rollback:** unset it on Render and redeploy. No data, route or stored state depends on it. The `DESIGN_PASS_PREVIEW` switch and the `/design-pass/*` routes no longer exist, so `docs/design-pass-2026-11-17/run-variants.mjs` is a record of round 2 and no longer runs.

**What the flag does not touch:** the chart itself (`Viz` and everything inside it). The new faces apply only to the home masthead, the cycle page's header and verdict box, the 404 and the error screen, so the phone glance caption, height label and verdict line keep today's face, size and words. **Superseded 2026-11-26 (I-087 batch 4):** the home chart now takes the faces through `[data-dp-chart]` (`src/app/globals.css`), which wraps `Viz` on the home page only. Its words did not change, and the caption, height label and verdict line were re-measured on a flag-on build: no line gained a line, and the height label went to 10px to fit its column. The embed and the poster are separate screens and keep the old faces (docs/SCREENS.md, NEXT).

## Constraints every variant keeps

- No surface says where the present sits on a cycle. One period per cycle, no curve drawn past today (`sampleDrawnPeriod`, `src/lib/cycleMath.ts`; AGENTS.md).
- The verdict words come from `src/lib/holdsUp.ts` and are not restyled into a stronger claim. No sentence says a test ran.
- On a claim page the verdict box stays whole on the first phone screen and comes before the curve (I-053, I-047).
- The phone home first screen keeps its caption, its height label and its verdict line as they are until I-077 and I-078 are read (due 2026-11-19: round 0, then a Codex claims pass on the fact list, then the words). The home page's second-screen line "set by the theorists or by this site" does not move or shrink without re-reading I-075's close note.
- I-077 and I-078 change the phone home first screen's words AFTER the variant, in their own order. The variant goes live without them because it leaves those words exactly as they were (round 3 P1, manager review a2f23ea8).
- Prose pages keep their markdown mirrors in step (`public/about.md`, `methods.md`, `colophon.md`); this pass's scope touches none of them.
