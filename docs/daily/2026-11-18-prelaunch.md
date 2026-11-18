# sinusoidal-cycles — 2026-11-18 (Wednesday, MT)

## BLUF

**P3 shipped it, live at b66d8a5 (CI ci.yml green on b66d8a5ed4, deploy in sync).** With the flag on, the ten cycle pages below the verdict box now draw in the redesign's faces: headings in Plex Sans Condensed, prose and provenance in Plex Serif, emphasis upright at weight 600. Production check (`run-below-box.mjs --live`) after the deploy: 552 elements on 10 pages, 0 off the expected loaded face. The same check failed on production before the deploy (khaldun: 29 of 56 elements still in Geist or Fraunces). Rendered text is identical on /cycles/dalio and /cycles/turchin-fathers-sons, and the phone folds read 13 of 13 at all three sizes. SCREENS.md: DONE 8 · NEXT 5 · HOLD 1 · N/A 7. I-085 is closed (the probe on 16.4.5 is recorded in AGENTS.md). `/methods` (the stretch) was not reached.

**P1: today's change is the lower part of the ten cycle pages, everything below the verdict box, moved into the redesign's faces (I-087, the most-seen NEXT row).** Nothing a visitor sees has changed yet. On production today, with the flag on, those pages are half-converted. The small mono labels below the box already draw in IBM Plex Sans Condensed, because `[data-dp] .font-mono` matches the whole article. But the section headings ("Peak calibration", "Spectral verdict", "Paired data series") still use the old display face, and the prose still uses the old body face. The change is CSS only, scoped under `[data-dp]` to what follows the verdict box, and no word changes. Section 0 is clean: CI is green on a0f8bcb8d1, and the deploy is in sync. Target by close: 1 NEXT row DONE and confirmed live (the cycle pages); `/methods` is a stretch that needs its own claims pass. The packet is under Recommendation and waits for the manager review.

## What changed

**P3 (I-087 batch 3, manager review APPROVE 0e252f07).**
- **The change:** `src/app/globals.css`, CSS only, under `[data-dp]` and scoped to siblings after `#does-it-hold-up`. The commits are aff41df (faces), f3be340 (provenance dd and footer source into the text face), and b66d8a5 (the runner reshaped).
- **Condition 7, what each kind resolves to** (production, all ten pages): h2/h3 → Plex Sans Condensed 600 ×58 · prose p → Plex Serif 400 ×154 · strong → Plex Serif 600 ×10 · em → Plex Serif 600 upright ×10 · the caveat span → Plex Serif 400 upright ×5 · provenance dd → Plex Serif 400 ×18 · labels, stats terms and values, buttons, link rows → Plex Sans Condensed 600. There is no `<i>` below the box, and the claim FAQ is JSON-LD only (Codex r1/r2 trace).
- **Codex:** r1 on aff41df and r2 on f3be340, read-only, banner workdir `C:\dev\skylark\sinusoidal-cycles` matched both times, model gpt-6.2-sol.
  - CSS reach: no defects in either round (traced on a paired page, a claim page and the no-series page; it does not reach above or inside the box, the curve figure, or the 404/error routes).
  - r1 MEDIUM, provenance in the display face: CONFIRMED, fixed in f3be340.
  - r1 MEDIUM ×2 and r2 MEDIUM ×2, runner defects: CONFIRMED. After the second round of the same class, the runner was reshaped to one stated rule rather than patched again (b66d8a5).
  - r2 LOW, `--live` without an origin: CONFIRMED, fixed in b66d8a5.
  - r1 LOW, dispositioned:
    - Scroll-arrow buttons take the text face: PLAUSIBLE, cosmetic.
    - Body under 16px and tracked labels: DELIBERATE, a later batch, NEXT 11-24 on the row.
    - Fold check's first-paragraph scope: pre-existing, and no selector reaches the box.
    - A tag-boundary space in check-rendered-text: REFUTED for this diff, since CSS cannot change DOM text.
    - Port reuse: fixed in f3be340.
  - r2 MEDIUM, opacity-hidden emphasis passing: PLAUSIBLE. It is out of the runner's stated scope, and its header says so.
- **Red-armed:**
  - `node docs/design-pass-2026-11-17/run-below-box.mjs --live https://sinusoidalhistory.com` before the deploy → `BAD /cycles/khaldun: 56 element(s) below the box, 29 not on the expected loaded face`, and BAD on every page.
  - After the deploy → `RESULT: PASS — 0 problem(s)`.
- **I-085 closed.** `npm ls next` → 16.4.5. The throwaway route was never committed. The same-line spaces were kept; the line-break space was dropped, which is JSX semantics. Written into AGENTS.md.

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** the ten `/cycles/<slug>` pages below the verdict box use the design pass's faces and marks, the same system as the header and box above them. Item **I-087** (the SCREENS.md row "Cycle page, below the verdict box", NEXT 2026-11-24, pulled forward under today's direction). Kind: improve.
- **The user problem, in a reader's words:** no real reader has said it. In plain terms, a visitor who scrolls past the verdict box now meets a different site: the box is set in Plex Serif on the recorder-sheet mark, and the section under it has old display headings with Plex labels mixed in. HYPOTHESIS: a page that changes typeface halfway down reads as unfinished, which undercuts the bar's "someone actually checked" (`docs/evangelism-bar.md:20`).
- **David's direction for today** (lead, chat 08:52 MT, verbatim): "Let's open all 24 windows with today's run-day and keep pushing through the screens that haven't been updated yet."
- **Evidence:**
  - OBSERVED · source on main a0f8bcb: `globals.css:214-241` restyles only `h1`, `.font-mono`, the breadcrumb, `header > p`, and `#does-it-hold-up` / `#why-not-tested` (with their `p`). Below the box, `page.tsx:460,519,554,652,666` set `h2` in `font-display`, `:564` sets `h3` in `font-display`, and `:490` sets the caveat in `font-display-italic`. None of these is matched. `.font-mono` IS matched site-wide inside the article (`globals.css:221`), so the labels below the box are already Plex. The lower page is half-converted today. [linter-report]
  - OBSERVED · `docs/SCREENS.md:24`: "NEXT 2026-11-24: still in the pre-pass faces". `:42`: DONE 7 · NEXT 6 · HOLD 1 · N/A 7.
  - OBSERVED · Search Console, page-only, `gsc-read.mjs --start 2026-11-04` (window 11-04..11-18, GSC lags about 2 days): total 35 impressions, 1 click. Cycle pages: at least 5 (dalio 1, khaldun 1, schlesinger-jr 2, strauss-howe 1). The page list was TRUNCATED at the route's row limit, so 5 is a floor. `/methods` 2, `/cycles` 19, `/` 7, `/about` 7. The cycle pages are the most-seen of the six NEXT rows (embed, embed docs, poster and the share image have no page rows here). These are impressions, not reads.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` exited 0: "no product-love cycle picks this lane today … run the normal P3".
  - OBSERVED · `docs/DESIGN.md:59`: Plex Serif's italic is for the titles of cited works only. `src/lib/designPassFonts.ts:11,20-21` loads Plex Sans Condensed 600 and Plex Serif 400/600, with no italic. So the caveat cannot simply switch to the new face in italic: that would be a synthesised italic. P3 sets it roman, keeping its "Caveat" label and left rule.
  - HYPOTHESIS · that the half-converted lower page is noticed. No reader is on record.
  - MISSING · `docs/evangelism-evidence.md` and `docs/key-metrics.json` do not exist. The bar reads UNMEASURED (`docs/evangelism-bar.md:30`). There are no client analytics and no visitor error instrument, by standing choice, so any regression line reads UNREAD, never zero.
- **Why not the others:** `/methods` (2 impressions) needs its kicker and lede re-budgeted, so words change. That means a claims pass and a `public/methods.md` mirror; it is the stretch, after the cycle pages. Embed and the share image change other sites' pages and every shared link's preview, so each ships on its own, not today. The home chart is HOLD (I-077, I-078 on 11-19, in their order). I-071 is a decision row, and I-085 is a read; both are on the hygiene list.
- **Prior-retro finding that bears on this** (11-17 Q0, "round 0 before the sentence exists", still on discipline): it binds only if a word changes. This batch changes none, so no round 0 is owed for the cycle pages. `/methods`, if reached, gets round 0 before its words.
- **Permission:** a lane-owned page, styling only. David's go (rollout brief, 11-17) covers carrying the system to the other screens. The site has no sign-in, payment, account or data screens. No open card names this (`answered-cards --project sinusoidal-cycles`: 0 lane cards, 8 portfolio riders, all skylark-site's personal-site and deploy-guard cards, 0 new). Rule: no word changes, so the rendered text must be identical before and after.
- **Next action:** kind = improve. Prep now: a before-snapshot of the live text on one paired page and the empty-state page. At P3: CSS under `[data-dp]`, scoped to what follows `#does-it-hold-up` / `#why-not-tested`, so nothing on the first screen moves. Then one flag-on local build through heavy-gate, from the main checkout (not a worktree). The I-085 throwaway route rides in that same build and is never committed. Then folds, rendered-text diff, Codex read-only diff review (banner workdir checked), CI green, deploy, and a signed-out GET. First command:

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/dalio C:/dev/skylark/sinusoidal-cycles/tmp/i087-dalio-before.txt
  ```

- **Acceptance condition:**
  1. On production with the flag on, every `h2`/`h3` below the verdict box on all ten pages computes to the Plex Sans Condensed family, and the prose to Plex Serif. Read in the served CSS plus one signed-out GET of a paired page and of `/cycles/turchin-fathers-sons`.
  2. Rendered text is unchanged: `check-rendered-text diff` reads the same line multiset before and after on `/cycles/dalio` and `/cycles/turchin-fathers-sons`.
  3. `check-entry-folds --width 320 --height 568` still reads 13 of 13, with `/cycles/perez` at 0px spare or more (it is at 0 today). The same at 360x560.
  4. With the flag off, nothing changes: every new selector is under `[data-dp]`.
  5. Codex's read-only diff review has each finding dispositioned. CI is green on HEAD, and the drift read is in sync.
  6. SCREENS.md row 24 moves to DONE with the commit, and the counts are updated.
- **Delivery and encounter checks:** delivery is `check-deployed-sha-drift --wait --service sinusoidal-history --sha <full sha>` reading in sync, then the signed-out GETs above. Encounter: Search Console page-only impressions on `/cycles/*`, `gsc-read.mjs --start 2026-11-18`, read 11-24 with I-087. That shows readers were shown a page, never that they scrolled below the box. At this traffic, a reader's reaction is not readable at any N we will reach this month.
- **Key number:** sections below the verdict box still in pre-pass faces, across the ten cycle pages. Today: 5 section-heading kinds plus the series `h3` and the caveat, on 10 of 10 pages (source read above). Target: 0 of 10.
- **USER-FACING: yes.** Paths: `src/app/globals.css` (new `[data-dp]` rules). Possibly `src/app/(app)/cycles/[id]/page.tsx`, a class hook or id only, with no text change. Internal: `docs/SCREENS.md`, `continuity/items.json`, `docs/daily/2026-11-18-prelaunch.md`. Stretch (only if reached, separate commit and claims pass): `src/app/(app)/methods/page.tsx` + `public/methods.md`.
- **Section 0:**
  - Listener 🟢, posted 52059b69 (SSE hello 16:04:24Z, replay 0). The loop is armed by ScheduleWakeup, and waker rungs 1-3 are running.
  - CI: `check-ci-status --workflow ci.yml` → "GREEN — 1 completed non-scheduled success(es) for HEAD" on a0f8bcb8d1.
  - Drift: `--service sinusoidal-history` → "in-sync live a0f8bcb8 → head a0f8bcb8".
  - Codex: GREEN, from the kickoff probe (machine-level exec and write, 04:40Z).
  - Harness: running 2.1.327 · fleet UNIFORM (28 of 28) · installed 2.1.327 (SAME).
  - Morning snapshot taken: "2 gate(s) due on/before 2026-11-18" (I-071, I-085).
  - Free memory 19.6 GB at 16:3xZ.
- **Recs yesterday** (11-17 round 3 close):
  - The SCREENS.md NEXT batch: carrying today → P3 (this packet).
  - I-077 / I-078: carrying → 11-19, in their order.
  - Dark-mode contrast of the cycle colours (NEXT 11-24): carrying, not today.
  - `holdsUp.test.ts:54` with I-078's words: carrying → 11-19.
- **HYGIENE INPUTS:**
  - (a) Due rows not bearing on the choice: 2.
    1. **I-071** (due 11-18): a decision row. Snap drag ends to round years? Label the zoomed axis's left edge? Its readCommand is to be stamped at P3 via `--run I-071`. It sits on the home chart, which is HOLD for I-077/I-078's words. A decision on it touches no words, but it does touch that surface.
    2. **I-085** (due 11-18, READ_NEVER_RUN): the JSX-whitespace probe on Next 16.4.5. It runs inside P3's one flag-on local build (a throwaway route, never committed), then `--run I-085` stamps it.
  - (b) Owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger: 0 of 850 considered".
  - (c) State reads marked CROSSED: 2.
    1. "dated gates due today: 2": I-071 and I-085, above.
    2. "board cards carrying David's word: 7": c4a242ab, e24ff2bf, e6d1b0f5, 5d126063, d1748b4e, 9b5b8076, 21ece8d9. `answered-cards` also lists c15a6e21, so 8 riders in all. All are skylark-site cards (David's personal site, the project list, Billionaire Army, the "Live" labels, the deploy guard), "governs: unlinked". 9b5b8076 names this site only to keep its "Live" label on skylarkcreations.com, which is not this lane's surface. Disposition: read.

## State Appendix

- Kickoff 5747cff4 (body file sha256 1fb8612d…, VERIFIED).
- Retro carry from 11-17 (Q4, CARRIED → I-087, 11-19): the error screen's false cause. It was already fixed live in 202d75a (I-087 notes). That carry is spent.
