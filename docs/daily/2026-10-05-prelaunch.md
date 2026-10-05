# sinusoidal-cycles — 2026-10-05 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** on a phone, tapping the spectral figure no longer sends the reader to a smaller copy of it on a page with no way back. **Item:** I-020 (open, P3, lane-owned).

**The user problem, in the walker's words** (W-003 cold walk, 2026-10-03, synthetic, N = 1, `docs/walks/2026-10-03-w003.md`, ranked 2nd of 5 after the Calibrate path that I-022 fixed on 10-04): "Tapping the spectral figure on the phone makes it smaller, on a dead-end page. It opens the bare SVG shrunk to the screen width, with labels around 4–6 px, no site header and no way back except the browser's Back. The tap looks like 'enlarge' and does the opposite." This is a synthetic walker's quote, not a real user's.

**What a user will see differently:** on a touch phone the figure on each of the nine paired cycle pages stays where it is. A tap no longer navigates, the sideways swipe works as before, and the SVG and PNG download links under the figure stay. With a mouse, a click still opens the full-size SVG, which at 1440 wide is an enlargement (1.6x).

### Section 0

- **Primer:** `docs/cold-starts/2026-10-04.md` (written yesterday). There is no `2026-10-05.md`.
- **First action:** `check-calibrate-tab.mjs https://sinusoidalhistory.com` reads **93/93 PASS**, so I-022 and the Next 16.3.6 bump hold on production.
- **git:** `pull --ff-only` printed "Already up to date". HEAD `7eb39bf` = origin.
- **Listener:** 🟢 SSE alive. The SessionStart hook relaunched it (pid 12140, hello 14:41:15Z, 0 replayed). The loop is armed by a `ScheduleWakeup` call, and waker ranks 1-3 are running.
- **Codex:** GREEN, from the `[codex-probe]` line on this prompt (14:41:44Z). Not used at P1, because there is no diff yet.
- **CI:** `check-ci-status --workflow ci.yml` → GREEN for `7eb39bff72` (1 success, 0 failures, 0 pending).
- **Deploy drift:** `check-deployed-sha-drift` declines this commit-trigger service (docs/daily-config.md), so the live sha came from the Render deploys API. The live deploy is `7eb39bff72a507abaa57bd153e2a7cab35fb82ea` (finished 18:57:10Z 10-04), which equals HEAD. No drift.
- **Harness:** running 2.1.289 · fleet UNIFORM (26 of 26) · installed 2.1.289 (SAME).
- **Cycle rotation:** exit 0, "no product-love cycle picks this lane today (4 cycle(s) rotate over 23 lanes); run the normal P3".
- **Due gates:** `--snapshot` → "0 gate(s) due on/before 2026-10-05" (taken once, `tmp/due-gates-snapshot.json`).
- **Board:** `answered-cards` → no waiting, answered or pending-verify cards.
- **Lead 1, I-026 (Render deploys before CI):** `read-render-deploy-trigger.mjs` → `autoDeployTrigger commit`, exit 3. A grep of `render-put-secret.mjs` for `autoDeployTrigger`, `checksPass` and `--trigger` found nothing, so no ruled script can make the change. ONE card was filed for David with the exact dashboard path: bus `9b944320`, board item `9bda09ac`. Until he flips it, the lane reads CI before calling any push safe.
- **Recs yesterday:** `docs/daily/2026-10-04-prelaunch.md` has no `## Recommendation` block (`Recs yesterday: none`). Its primer's candidates (I-020, I-021, I-023, I-024) are handled below.
- **Retro (10-04), one finding that bears on this:** "Playwright `click()` scrolls its target into view itself" (primer non-obvious note). The new legs read the figure's position after `scrollIntoViewIfNeeded()`, never from the tap.

### Evidence

- **OBSERVED, W-003 P12** (2026-10-03, synthetic, N = 1, iPhone 15 390x664): swiped 185px, tapped, and landed on `/data/spectral/perez.svg`, "a bare white page… no close or back control… drawn smaller than it was on the page". Back kept the reader's place.
- **OBSERVED, measured on production today** (`tmp/measure-figure-tap.mjs`, Playwright Chromium, /cycles/perez; "on-screen scale" = the figure's CSS width / 900 × the visual-viewport scale):

  | size | pointer | figure inside a link | a tap/click goes to | page there | on-screen scale there | inline (in the scroller) |
  |---|---|---|---|---|---|---|
  | 390x664 | touch | yes | `/data/spectral/perez.svg` | no header, 0 links | **0.43** (10px labels → ~4.3px) | 1.00 |
  | 320x568 | touch | yes | same | no header, 0 links | **0.36** (~3.6px) | 1.00 |
  | 900x900 | mouse | yes | same | no header, 0 links | 1.00 | 1.00 |
  | 1440x900 | mouse | yes | same | no header, 0 links | 1.60 | 1.00 |

- **What the numbers say:** a tap shrinks the figure only on a phone. The mobile browser lays the bare SVG out in a 980px viewport and zooms out to fit, so the readable copy is the inline one, which `check-verdict-landing` already holds at ≥10px. With a mouse the open view is the same size or larger, so it does no harm there.
- **Cost, OBSERVED in the tree:** `scripts/check-verdict-landing.mjs` (round 2, 2026-10-02) asserts at the three touch sizes that "a tap opens an image/svg+xml document at the figure's address", and that Back from it keeps scrollY and scrollLeft (I-017/I-018). Option (a) inverts the first leg at touch sizes and makes the Back-from-figure legs moot there. FigureScroller still restores the place on any other Back, and `--mutate lose-place` keeps a reachable path through another link.
- **MISSING:** real-user evidence. The site has no client analytics (a standing choice), and the lane has no evangelism-bar or evangelism-evidence file, so there is no bar metric to read.

### Permission, and the freezes

- **Decision class:** lane-owned product work. I-020's owner is sinusoidal-cycles, its waitingFor reads "Nothing and nobody", and no card is open on it. Its `onTrigger` names option (a) itself: "on phones the figure is not a link (the SVG and PNG downloads stay)".
- **Its `waitJustification` dates it 2026-10-07**, but its own `loadBearing` reads "nothing outside the lane blocks it". That date is lane-chosen with nothing funded behind it, so it yields, as I-022's did yesterday.
- **Why (a) and not (b):** (b) adds a site page for the figure, which means a new URL and a new title during the W-001 freeze (titles, meta, H1s, URLs, to 2026-10-07). (a) changes no URL, title, meta or H1, so the freeze is untouched.
- **W-004 (the 10-07 cold walk)** reads the figure at 1440 and ~900 with a mouse, and the mouse path does not change. Its phone step (3) is Calibrate, so it does not touch this.
- **Not touched:** `public/data/spectral/` (frozen), `FigureScroller.tsx`, `HashLink.tsx`, the /state bands, `state-2026.csv`.

### Next action — improve

Prep only until the review. No commit, push or deploy.

1. In `src/app/(app)/cycles/[id]/page.tsx` (lines 542-573), render the figure as a link only for a fine pointer. A fine pointer gets `<a href=svg>` with the img, shown with `pointer-fine:` and hidden otherwise. Any other pointer gets the same img with no link. The lazy img that is `display:none` is not fetched, and on touch the link is gone from the accessibility tree too, not just made inert. Rewrite the comment at lines 548-550 to match.
2. In `scripts/check-verdict-landing.mjs`, at the three touch sizes, replace "a tap opens an image/svg+xml document" with "the figure is not inside a link, and a tap leaves the URL unchanged". Keep the swipe legs, and keep "the visible download controls are drawn". Retarget the Back-place legs (I-017/I-018) to leave through another link on the page, so `lose-place` still has a red arm. Add a mouse leg at 1440 and 1024: "a click opens the SVG". Add a mutation `touch-link` that puts the link back on touch, which must turn the new leg red.
3. Red arm: production today fails the new touch leg at every one of the nine pages (inLink=true).

First command (the baseline these legs must flip):

```
node C:/dev/skylark/sinusoidal-cycles/tmp/measure-figure-tap.mjs https://sinusoidalhistory.com perez
```

### Acceptance

- On production, `check-verdict-landing.mjs` passes every leg. At 390x664, 360x560 and 320x568 (touch), on all nine paired pages: the figure is not in a link, a tap does not navigate, the figure swipes, and both downloads are drawn. At 1440 and 1024 with a mouse, a click opens the SVG.
- `--mutate touch-link` turns the touch leg red, and restoring it turns it green with a clean tree. Both outputs go in the P3 report.
- `tmp/measure-figure-tap.mjs` on production reads `inLink=false … (no navigation)` at both touch sizes and `inLink=true` at both mouse sizes.
- The rendered-text gate is GREEN on a cycle page (no prose moved). The comment edit is not visible text.

### Delivery and encounter checks

- **Delivery:** the production run of `check-verdict-landing` after the Render deploy, with the deploy row's commit read back from the API (the trigger is still `commit`, so CI is read first).
- **Encounter:** none is scheduled for this specific path. W-004 (10-07) can add one line to its phone leg: "on /cycles/perez, tap the figure: what happened?" That line goes to W-004's notes at P3, not as a new walk. There is no client analytics, so there is no event that would show a real tap. Exposure will be `blind — no client analytics`, with the bug row named at P3.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx` (what users get), `scripts/check-verdict-landing.mjs` (internal), `continuity/items.json` (internal), this report (internal).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none**. `dated gates due today` read 0 at compose and this morning's `--snapshot` read 0.
- (b) Owed child rows in the orchestrator's ledger: **none**. 0 of 744 considered at compose.
- (c) State reads marked CROSSED: **none**. Of the kickoff's reads, none printed a crossed threshold. The prior-day retro carries 9 still-on-discipline findings and 1 carried finding (I-022, 2026-10-07). Those are listed for the close and not dispositioned here.
- Noted for the close: `tmp/measure-figure-tap.mjs` already existed (gitignored, from an earlier session) and was overwritten unread before today's baseline. It was untracked scratch, and its previous contents are not recoverable.
