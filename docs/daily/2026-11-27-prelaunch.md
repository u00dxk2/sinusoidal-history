# Daily report — sinusoidal-cycles — 2026-11-27 (Friday, MT)

## BLUF

**Shipped: the arrows on the home chart and the cycle pages are drawn in the site's own type now (I-092, live at c10a5e6b).** Before the fix every probed arrow was in Arial or Times New Roman; now Plex draws 66 of 66 on the live pages the fix covers, and no word or fold changed. `/cycles` and `/methods` still set their body text in Geist, so their arrows still fall back. That is a separate gap, recorded below. Nothing measures a reader, so encounter is blind.

**P1 picked I-092 for P3, which is today's evangelism pass (the rotation names this lane: `check-cycle-rotation` exit 3, 20 days since the fleet stamp).** The arrows on flag-on pages (← drag to zoom →, Details →, calibrate this cycle →, and the rest) are drawn in a system face beside Plex letters, because the three pinned Plex latin subsets carry no U+2190 or U+2192. Since 11-26 that includes the first screen of `/`, the only page that drew clicks in the last 30 days (2 of 2). P3 puts the two arrows into the pass faces (a re-subset that keeps every character as it is; inline SVG only if the upstream faces lack them) and measures the glyph source on a built copy, with the folds unchanged at 320, 360 and 390. The packet is under Recommendation and waits for the manager review.

## What changed

- **Shipped (P3, live at c10a5e6b): every arrow in an element set in Plex is now drawn in Plex (I-092).** That covers ← → and five siblings the same sweep found (≈ ≥ ↗ ✓ π). No word changed. Commits: 2180e42 (the three rebuilt font files plus `scripts/build_plex_subsets.py`, `scripts/check-glyph-source.mjs` and the batch runner), then 0152d3f and c10a5e6 (the instruments, after Codex r1 and r2). CI ci.yml green on c10a5e6bd6; `check-deployed-sha-drift --service sinusoidal-history` in-sync, live c10a5e6b.
  - **Glyph source, before → after, live:** `scripts/check-glyph-source.mjs https://sinusoidalhistory.com` at 1280x900 and 390x664. Before: every probed character on `/`, `/cycles/dalio`, `/cycles` and `/methods` was drawn in Arial, Arial Narrow or Times New Roman (76 of 76; later 18 of 18 on `/` and `/?focus=dalio`, "Details →" included). After: 66 of 66 on `/`, `/?focus=dalio`, `/cycles/dalio` and `/cycles/turchin` drawn by an "IBM Plex" web font, exit 0.
  - **The fonts:** `python -P scripts/build_plex_subsets.py --check --source-dir <the Google Fonts TTFs>` PASS on the committed files against the originals at 943805111c. Every original glyph keeps its outline, hmtx record and hinting program. fpgm/prep/cvt/gasp are byte-identical, and so are the line and design metrics, the feature tags and the name table. Each added code point draws the source font's own glyph. About 54,400 strings per face shape identically through HarfBuzz under the default features and under each of frac, numr and dnom. Growth is 460 / 372 / 272 bytes.
  - **Red-armed:** the glyph checker read red on production before the deploy. The verify FAILs on each of six planted mutations: a kerning value, `fi`'s advance, a numr mapping, a frac-reached mapping, → drawn with ←'s glyph, and liga renamed tnum. A wrong-weight source FAILs, and a baseline that already carries the additions is refused.
  - **Text and folds:** on the built copy, `run-home-chart.mjs --compare live-before arrows` PASS with 0 problems: textContent identical in 12 of 12 keys, 0 elements off the pass faces, nothing newly clipped, budget lines unchanged, tabular digits 23.77px. Live `check-entry-folds`: 13 of 13 at 320x568 (and exit 0 at 360x560 and 390x664), with `/` at 49 / 41 / 113px spare, unchanged.
  - **Signed-out GET of `/`:** 200, `data-design-variant="a"` ×1, `data-dp-chart` present.
  - **Codex:** 2 rounds (gpt-6.2-sol, high, read-only, banner workdir checked). Both REPRODUCED the font change as sound, and every finding was about the instruments. Dispositions: `docs/claims/2026-11-27-codex-i092.md`.
  - **Not fixed by this, and why:** `/cycles` and `/methods` still draw their arrows in Arial, because their body prose and inline links are set in Geist (see the correction below). Δ, φ and ▾ are absent from upstream Plex.
- Live at the start of the day was 94380511 (`check-deployed-sha-drift --service sinusoidal-history`: in-sync, live = head). CI ci.yml GREEN on 943805111c (`check-ci-status --workflow ci.yml`, exit 0).
- Section 0: primer 2026-11-26 read (no 2026-11-27 primer, which is normal after a clean close). Listener: 🟢 SSE alive (restart marker 2026-11-27T15:31:15Z, hello, replay 0) + loop armed by `ScheduleWakeup`. Codex GREEN (the kickoff's probe line, 15:37Z). Harness 2.1.332, fleet UNIFORM (28 of 28), installed SAME. Due gates: 0 due on/before 2026-11-27 (snapshot `tmp/due-gates-snapshot.json`, taken once this session). Product-love rotation: **evangelism-pass DUE** (exit 3), so P3 is the pass. Cards: 0 for this lane, 0 new; the portfolio rider 312499ee (machine memory) does not touch this lane's choice.
- Recs yesterday: one, the I-087 home-chart batch. Executed (live at 4c19f12, P3 d5f79864, manager review d6f73114 COMPLETED). Its carry, I-092, is today's choice.

## Recommendation

### P1 selection packet

- **Outcome + item:** the arrows render in the site's own type (I-092). The user problem is HYPOTHESIS: a reader on the home chart or a cycle page sees "Details →" or "← drag to zoom →" with the arrow in a different, heavier or narrower system face than the letters next to it. It is a small seam, but it sits on the controls the reader uses to get from the chart to the verdict.
- **Core-experience link:** the would-tell-a-friend moment is "someone actually checked", and that depends on the instrument looking made with care. The arrows are on the path from the chart (`/`, where the clicks land) to the verdict on each cycle page.
- **Evidence:**
  - OBSERVED · `node C:/dev/skylark/sinusoidal-cycles/scripts/gsc-read.mjs --start 2026-10-28` (read 2026-11-27) · Search Console, page-only, sc-domain:sinusoidalhistory.com · 2026-10-28..2026-11-27 · TOTAL 77 impressions, 2 clicks; `/` 11 impressions and both clicks (position 2.3); `/cycles` 37 impressions, 0 clicks; the cycle pages 1 to 7 impressions each, 0 clicks. Limits: about 2-3 days of lag, the page list was truncated at the row limit (the TOTAL is whole), and it cannot see a share.
  - OBSERVED · `git -C C:/dev/skylark/sinusoidal-cycles grep -n -e "←" -e "→" -- src/components src/app` (2026-11-27) · user-visible arrows on flag-on surfaces: `TimeRangeBrush.tsx:341` (← drag to zoom →), `CycleFacet.tsx:342, 365, 743`, `cycles/[id]/page.tsx:352, 399, 409, 419, 495, 729, 821`, `cycles/page.tsx:420`, `methods/page.tsx:92, 98`, `FigureScroller.tsx:222, 233`. The other matches are comments, a prose "→" in a sentence (`cycles/page.tsx:89`, `methods/page.tsx:418`), `og/route.tsx` (the share image, which is decided alone) and `Poster.tsx:76` (the poster, still in the old faces).
  - OBSERVED · `src/lib/designPassFonts.ts:1-27` · three self-hosted fontsource latin subsets (`src/fonts/*.woff2`), fallbacks "Arial Narrow", "Arial" (display) and "Georgia" (text). Codex r1 on d76467e read the cmaps statically: no U+2190/U+2192 (`docs/claims/2026-11-26-codex-home-chart.md`). This is STATIC, not yet a rendered read.
  - OBSERVED (reproduced at P1 prep, 2026-11-27) · the cmap read below (fontTools 4.68.0; `brotli` installed with `pip install --user` for it) · all three pinned files carry U+2191 and U+2193 and lack U+2190 and U+2192 (229, 228 and 228 mapped code points). This matches fontsource's latin range, which lists ↑ and ↓ but not ← and →. Codex's static finding holds.
  - OBSERVED (prep, after the post) · the name tables · Plex Sans Condensed SemiBold "Version 1.3", Plex Serif Regular and SemiBold "Version 2.6". So the re-subset source has to be those versions, or acceptance 4 (no other advance width changes) will catch the difference.
  - HYPOTHESIS · upstream IBM Plex Sans Condensed and Plex Serif carry U+2190/U+2192 (they carry ↑ and ↓, so the left and right arrows are likely), so a re-subset can add them. Unverified until the upstream files are read; if they don't, the fallback is inline SVG.
  - MISSING · any real-user reading of the arrows, or of the site at all beyond 2 clicks. No client analytics by standing choice; the bar reads UNMEASURED (`docs/evangelism-bar.md:30`).
- **Permission:** lane-owned design work inside the design pass David's rollout put live behind `NEXT_PUBLIC_DESIGN_PASS_VARIANT=a` (rollback tested 2026-11-17). No David card names I-092. No word changes. If the SVG route changes any accessible name, that is a copy change and gets a Codex claims pass at `-c model_reasoning_effort=high`, with the banner workdir checked.
- **Why I-092 over the embed's faces:** it is the only open defect on the arrival path (`/`), and the fix touches the fonts, not the layout. The embed has no recorded readers. The embed stays the next SCREENS.md batch.
- **Revenue (the kickoff's question):** what would make a stranger pay is something they keep or reuse, such as a printed poster or a licensed dataset, and neither exists. This session takes no step toward it: there is no payment package in the repo, no spend is allowed today, and the room is 77 impressions and 2 clicks a month. A payment surface would be David's call, and nothing puts it to him today.
- **Next action (improve):** prove the gap on a rendered page, then fix it. First, read which font actually draws each arrow: the computed family still says Plex, which is why `run-home-chart.mjs` cannot see this. Then fetch the upstream Plex faces into their own empty directory, confirm the two code points in their cmaps, and re-subset each to exactly its current code points plus U+2190 and U+2192. The first command is the cmap read; it was run at prep and reads ↑ ↓ present, ← → absent in all three files:

  ```
  python -c "from fontTools.ttLib import TTFont; [print(p, [hex(c) for c in (0x2190, 0x2192) if c in TTFont(p).getBestCmap()]) for p in ('C:/dev/skylark/sinusoidal-cycles/src/fonts/ibm-plex-sans-condensed-latin-600.woff2', 'C:/dev/skylark/sinusoidal-cycles/src/fonts/ibm-plex-serif-latin-400.woff2', 'C:/dev/skylark/sinusoidal-cycles/src/fonts/ibm-plex-serif-latin-600.woff2')]"
  ```

- **Acceptance (observable):**
  1. On a built copy with the flag on, a glyph-source read (CDP `CSS.getPlatformFontsForNode` on the arrow's text node) names the Plex face, not Arial, Arial Narrow or Georgia. Checked on `/` (← drag to zoom →, Details →) and on one cycle page (calibrate this cycle →, Open in the chart →). Before the fix the same read names a system face; this is the read shown failing first.
  2. `textContent` is unchanged: `run-home-chart.mjs --batch --base <sha>` PASS with 12 of 12 keys identical, in ONE heavy-gate admission.
  3. `check-entry-folds.mjs` 13 of 13 at 320x568, 360x560 and 390x664, built then live; `/` keeps its 49 / 41 / 113px spare, give or take what the arrow's width changes.
  4. The woff2 files grow by no more than a few hundred bytes each, and every other code point's advance width is unchanged (a cmap and hmtx diff against the current files).
  5. CI green, the deploy row live and in sync, and a signed-out GET of `/` carries `data-design-variant="a"`.
- **Delivery and encounter checks:** delivery is the in-sync drift read plus the glyph-source read on production. Encounter: no instrument sees a reader. The next Search Console page-only read on `/` is the only signal, and at about 11 impressions a month a click-through reading is months away. Reported as unmeasured. Pre-registered move: none measurable; the next pass reads whether `/` still draws the clicks.
- **USER-FACING: yes.** Expected paths: `src/fonts/ibm-plex-sans-condensed-latin-600.woff2`, `src/fonts/ibm-plex-serif-latin-400.woff2`, `src/fonts/ibm-plex-serif-latin-600.woff2` (replaced), and possibly `src/lib/designPassFonts.ts`. On the SVG route instead: `src/components/TimeRangeBrush.tsx`, `CycleFacet.tsx`, `FigureScroller.tsx`, `src/app/(app)/cycles/[id]/page.tsx`, `cycles/page.tsx`, `methods/page.tsx`. Also `docs/DESIGN.md` and the font provenance note (internal). A re-subset changes no prose page, so no markdown mirror moves.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: none. Read: `dated gates due today` (0 due on/before 2026-11-27; snapshot taken 2026-11-27). I-086, I-087 and I-071 are dated 2026-12-02, I-091 2026-12-16.
  - (b) owed child rows: none. Read: "rows owed to you in skylark-site's ledger" (0 of 855).
  - (c) CROSSED state reads: none. Read: every state read in the kickoff header. Stale-actionable 0 of 9 (7d). missingLinkedCommits swept nothing (0 of 0), which is not a clean read and printed no threshold.

<!-- findings:begin -->
**Correction to the packet (P3, 2026-11-27).** The packet said the arrows fall back "on every flag-on page" because of the Plex subsets. That holds for every element set in Plex. But on `/cycles` and `/methods`, the cycle descriptions, the "How the test works →" and "See the chart →" links, and the `/methods` body paragraphs are still set in **Geist**, the old face, even though `docs/SCREENS.md` marks both pages DONE. Geist's subset lacks → too, so those arrows stay in Arial after the re-subset. Measured on the flag-on build: `scripts/check-glyph-source.mjs` found 52 of 52 probed characters on `/`, `/cycles/dalio` and `/cycles/turchin` drawn by Plex, and 60 of 60 on `/cycles` and `/methods` drawn by Arial under an element whose own face is Geist. That makes it a separate gap: batch 2's `[data-dp]` rules move headings, mono and header text, not body prose and inline links. It is not part of I-092 and gets its own row at the close.
<!-- findings:end -->

## State Appendix

- Prior-day retro findings (5ca8c0ad): 2 tagged "still on discipline". The one that bears on today is Q0's carried lesson from 11-26: measure a chart change in ONE heavy-gate admission (`run-home-chart.mjs --batch`), not four. Acceptance 2 is written that way. The batch runner cannot see a missing glyph (its header says so), so acceptance 1 is its own frame.

### Close

ACTION: COMPLETED · item I-092 · P3 d75b43b7. Manager review 44bbe418 read it COMPLETED against the P1 acceptance as approved.

- **Two acceptance items were met by a different command than the packet named:**
  - Acceptance 2 named `run-home-chart.mjs --batch --base <sha>`. That command restores `page.tsx` and `globals.css`, so it cannot model a font-file change. The text was proven instead by `run-arrow-glyphs.mjs` (production as the before tree) in ONE heavy-gate admission, with `run-home-chart.mjs --compare live-before arrows` PASS, 12 of 12 keys.
  - Acceptance 3 named folds "built then live". The built folds ran inside that batch: the measure of the local build ran `check-entry-folds` at all three sizes, 13 of 13, the same spare as live. The live folds ran after the deploy, 13 of 13.
- **Changed since the P3 post:** the receipt's exposure bracket. P3 cited "bug row I-087", but I-087 is the design-pass rollout row, not a row about the missing visitor instrument. No row tracks that, because it is not a defect: the site has no client analytics by standing choice (card 1e069bb4). The corrected receipt is in the close post.
- **Ledger delta** (`continuity/items.json`, via continuity-edit):
  - I-092 closed: live c10a5e6b, 66 of 66 drawn by IBM Plex, `--check` PASS. The note records that the /cycles and /methods arrows sit in Geist elements.
  - I-093 minted (P3, owner sinusoidal-cycles, nextEvaluation 2026-12-04): the body prose and inline links on /cycles and /methods are still in Geist under the flag, so their arrows fall back. The fix is a face move in `globals.css` plus a correction to SCREENS.md's two DONE rows.
- **Hygiene draft:** 0 drafted lines (all inputs none). Checks: wait-justification PASS (35 of 100 rows), engineering-zero PASS (0 findings, 0 unreadable), READ-MUTATED none.
- **Due gates:** `check-due-gates-dispositioned` reads CLEAR, snapshot CURRENT (taken 2026-11-27), 0 due at Phase 0.
- **Pending reads:** 2026-12-02 I-086, I-087, I-071 · 2026-12-04 I-093 · 2026-12-16 I-091 · about 2027-01-20 the 60-day baseline.
- **Codex:** 2 calls (r1 on 2180e42, r2 on 0152d3f), both gpt-6.2-sol at effort high, read-only, banner checked. Dispositions: `docs/claims/2026-11-27-codex-i092.md`.
- **Day's record (close-session):**
  - Shipped live: c10a5e6. The arrows on the home chart and the cycle pages read in the site's Plex type. Proved live by `check-glyph-source.mjs`, 66 of 66 drawn by IBM Plex, deploy in sync. Held commits: none.
  - Codex r1 reviewed 2180e42. Verdict line: "Confirmed HEAD `2180e42…`. The checked-in font diff preserves the existing glyphs. The findings concern what the verification commands can certify." Tokens used: 94,450.
  - Codex r2 reviewed 0152d3f. Verdict line: "Confirmed HEAD `0152d3f` … REPRODUCED — `--check` exited 0." Tokens used: 103,230.
  - Both ran gpt-6.2-sol at reasoning effort high.
  - David cards answered today for this lane: none.
  - Engineering zero: 0 findings, 0 unreadable (`check-engineering-zero --project sinusoidal-cycles`, after the last push).
- **Machine changes outside the repo:** `pip install --user brotli uharfbuzz` (for the font reads). The Google Fonts TTFs live in the session scratchpad only.
