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

## P3 — Product-work loop

[P3 — Product-work loop]

**Action, kind improve:** I-020. On a touch screen the spectral figure is no longer a link, so a phone tap no longer opens a shrunken copy on a dead-end page. Mouse readers keep click-to-open. Approved at P1 review (bus `397a08e9`), as packeted.

### 1. Implementation

Commits on `main`, pushed `7eb39bf..2e00ce7`:
- `693b4cc` is the change.
  - `page.tsx` draws the figure twice: inside a link with `pointer-coarse:hidden`, and plain with `hidden pointer-coarse:block`.
  - `check-verdict-landing.mjs` round 5. At the touch sizes: "the figure is not a link" and "a tap leaves the reader where they were". With a mouse at 1440 and 1024: "a click opens the SVG". Every figure read takes the `:visible` img, and there is a new mutation `swap-link`.
  - The same commit carries the I-026 notes, the AGENTS.md and daily-config corrections, and the W-004 encounter line.
- `53cdfac` responds to Codex r1: a tap's navigation is caught by its request, and there is a new mutation `slow-link`.
- `577eb14` responds to Codex r2: the tap leg's contract was cut to direct evidence only, and any other failure refuses.
- `2e00ce7` declares Codex r3's ceiling (comment only).

**Gates:**
- Typecheck clean. Lint clean on both touched files.
- Unit tests 132/132, receipt run at `2e00ce7`.
- **CI GREEN for `2e00ce7`** (`check-ci-status --sha <full> --wait`: 1 success, 0 failures, 0 pending; created 16:30:57Z, completed 16:31:55Z UTC).

**Measured before building** (the manager review's tablet hypothesis): in Chromium emulation every touch context matches `(pointer: coarse)`. That covers the iPhone 15 preset, 360x560 touch, both iPad presets and a 1024x768 touch screen. Only the mouse context matches `fine`. So a tablet gets the no-link branch. A real iPad with a trackpad is NOT measured.

The hidden copy is not fetched. On the local build, `tmp/measure-figure-fetches.mjs` saw 1 SVG request per pointer, and the hidden img read `not-loaded`.

**Red arms:**
- Production before the change: **429/482**. All 52 new touch legs that ran are red ("inside a link to /data/spectral/…", "the tap went to /data/spectral/…"). One page skipped its figure legs at 360x560 (`/cycles/dalio`, "the box link could not be tapped", an older leg). That did not recur on any later run.
- Local build: **490/490**.
- `--mutate swap-link`: **418/490**, exactly the 72 new legs red (54 touch, 18 mouse click) and nothing else.
- `--mutate slow-link` (the link back, its navigation response held 4s): **436/490**, all 27 tap legs red, each naming the `/data/spectral` request it caught.

**Independent review:** three Codex rounds. All were read-only, run as a foreground pipe with the prompt on stdin, and the banner `workdir` was `C:\dev\skylark\sinusoidal-cycles` on all three.
- **r1 on `693b4cc`.** No page defect. One MED finding, STATIC: the tap leg read the address 1500ms after the tap, which a slow navigation has not yet changed.
  - My disposition went from CONFIRMED to **PLAUSIBLE, not reproduced**. With the fix removed, `slow-link` still showed 27 red, because the old read threw "Execution context was destroyed". At `693b4cc` that throw crashed the run (exit 1) rather than passing it.
  - Kept anyway, in `53cdfac`: the request-based read does not depend on that race.
- **r2 on `53cdfac`.** Both findings are false-red only, and both CONFIRMED:
  - MED: a blanket catch read any failed read as "navigated".
  - LOW: recovery after a navigation that never landed.
  - This was the second round on one mechanism, so I did not patch. **The contract was cut** in `577eb14`: the leg is red only on a navigation request, a changed address or a moved place. Anything else throws.
- **r3 on `577eb14`, a cold round asked to break the seven stated invariants.** Six HOLD.
  - The seventh, recovery's "landed" wait, reads a pathname, which a `pushState` also satisfies. CONFIRMED in mechanism and unreachable at HEAD: the only `pushState` in `src/` is `HashLink.tsx:32`, a same-path fragment on a HashLink click.
  - **Declared as a ceiling** in `2e00ce7`, not patched, because it was the third round on one mechanism.

**Sibling sweep:** the spectral SVG is referenced in `src/**` only at `page.tsx` :565 (the gated link), :576 (the downloads, kept on purpose) and :709 (the img). `public/*.{md,txt}` has 0 matches for `spectral/<id>.svg`.

**Rendered text:** production `/cycles/perez` against the built page is GREEN, 93 lines identical. No prose moved.

### 2. Delivery

- The Render deploy of `2e00ce7` was created **16:31:57Z UTC, 2 seconds after its CI run completed**, and went live 16:33:03Z. There was no row for it at 16:31:04Z, just after the push.
- `check-deployed-sha-drift --service sinusoidal-history` now judges this service (the trigger is checksPass): **in-sync, live `2e00ce79` = head**.
- `check-verdict-landing.mjs https://sinusoidalhistory.com`: **490/490 PASS** (this morning 429/482).
- `tmp/measure-figure-tap.mjs` on production, /cycles/perez:
  - Touch 390x664 and 320x568: `inLink=false`, a tap does not navigate. This morning it was `inLink=true`, and a tap went to the SVG at on-screen 0.43 / 0.36.
  - Mouse 900 and 1440: still open the SVG, at 1.0x and 1.6x.
- Regression on yesterday's ship: `check-calibrate-tab.mjs` on production reads **93/93**.

### 3. Encounter

blind — the site has no client analytics, so a reader who taps the figure leaves no trace. Bug row: W-004. Its 2026-10-07 cold walk now asks, in the phone leg: "on /cycles/perez, swipe the spectral figure partway, and ask: tap the figure: what happened?". The mouse leg now asks the walker to click the figure once. This was added today on the manager review's suggestion.

### 4. Outcome

Open. There is no direct read yet. I-020 is now `monitoring`, and its closeWhen is a cold walk: W-004 on 2026-10-07.

### Also today

- **I-026 CLOSED:** Render now deploys only after CI passes.
  - The orchestrator set `checksPass` on David's approval. The lane re-read it with its own tool and got exit 0.
  - The second half of closeWhen was read on this push: the deploy row was created 2s after CI completed.
  - AGENTS.md and docs/daily-config.md are corrected. The lane's card ask `9b944320` is superseded by bus `6f02739f`. The board card `9bda09ac` was already marked done by the orchestrator.
- **Hygiene helper:** dispatched at P3 start. It reported nothing production-shaped: engineering-zero PASS, wait-justification PASS with 0 warn, and no READ-MUTATED lines. Draft: `tmp/hygiene-draft-sinusoidal-cycles-2026-10-05.md`, 0 lines. Its one info line clustered I-020, I-021, I-023 and I-024 on the same "on or after 2026-10-07" cause. I-020 has left that cluster today.
- **Process slips, recorded:**
  1. A second gitignored scratch file, `tmp/sinusoidal-cycles-codex-r1.md`, from an earlier day's review, was overwritten unread. Later prompt files are dated.
  2. The r3 prompt was launched without the read-back the recipe requires. It was short and written in the same step, but the read-back still did not happen.
  3. I typed a full 40-character sha for `2e00ce7` instead of reading it. Its tail was invented. `check-ci-status` refused it as "DOES NOT RESOLVE IN THIS REPO" before any query, and the run was redone on the real sha from `git rev-parse HEAD`.

### Receipt

USER-VISIBLE: on a phone, tapping the spectral figure on any of the 9 paired cycle pages no longer opens a shrunken copy on a dead-end page; the figure stays put and swipes, and mouse readers can still click to open it full size — 693b4cc [proof: before, production at 390x664 and 320x568 had the figure inside a link and a tap went to /data/spectral/perez.svg drawn at 0.43x and 0.36x with no header and 0 links; after, Render deploy 2e00ce7 (live 16:33:03Z UTC, created 2s after CI went green) and check-verdict-landing on production reads 490/490, touch inLink=false with no navigation, mouse click still opens the SVG] [coverage: none — the site has no client analytics · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader who taps the figure leaves no trace · bug row W-004]

[red-armed: node scripts/check-verdict-landing.mjs https://sinusoidalhistory.com --fails-only (production before 693b4cc) -> 429/482 FAIL, "FAIL iPhone 15 390x664: /cycles/perez the figure is not a link on a touch screen — inside a link to /data/spectral/perez.svg"]
mechanism-verified: node scripts/check-verdict-landing.mjs http://localhost:3477 --fails-only --mutate swap-link -> 418/490 FAIL (exactly the 72 new legs); --mutate slow-link -> 436/490 FAIL, "FAIL … a tap on the figure leaves the reader where they were — the tap navigated to /data/spectral/schlesinger_jr.svg"; unmutated -> 490/490 PASS

codexCalls: 3 (r1, r2, r3, all review)
adversarialReviews: 3 — EXECUTED (head shas 693b4cc, 53cdfac, 577eb14; findings dispositioned above)
hygiene helper: DISPATCHED 2026-10-05 ~15:05Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-05.md PRESENT
[standing-rules-hash: 88cc2dc9]

### What remains

- W-004's cold walk on 2026-10-07 is I-020's encounter and closeWhen read, and I-022's.
- I-021, I-023 and I-024 stay on their 2026-10-07 lane date.

## Close

ACTION: COMPLETED · item I-020 · P3 131bc1c7

The acceptance in force was the P1 packet as approved (manager review `397a08e9`), and every leg of it was met on production:
- `check-verdict-landing.mjs` reads 490/490 against 429/482 before the change.
- `swap-link` goes red on exactly the 72 new legs, and `slow-link` on the 27 tap legs.
- Touch `inLink=false` with no navigation; the mouse click still opens the SVG.

The manager's P3 review (`8a76370b`) read it COMPLETED with no defects.

**Changed since the P3 post:**
- The doc-only commit `59c1217` deployed too. The orchestrator's drift read says in-sync, live `59c1217c` = head.
- Nothing user-facing has changed since.

**Ledger delta:** committed in `693b4cc` and `59c1217`, edited in `items.json` directly during P3 rather than through `continuity-edit.mjs`. Both ledger checks below pass on the result.
- **I-020:** open → `monitoring`. readCommand `check-verdict-landing.mjs https://sinusoidalhistory.com --fails-only`. linkedCommits 693b4cc, 53cdfac, 577eb14, 2e00ce7. The wait was re-pointed to W-004's walk.
- **I-026:** CLOSED. Both halves of closeWhen were read: the trigger is `checksPass` (lane re-read, exit 0), and the deploy row for `2e00ce7` was created 2s after its CI run completed.
- **W-004:** onTrigger gains I-020's encounter question, and closeWhen names I-020.

**I-020's encounter read, named for the walker. 2026-10-07, W-004:**
- In the 390x664 phone leg: open `/cycles/perez`, swipe the spectral figure partway, and ask cold, "tap the figure: what happened?" Record whether anything opened or moved, and whether the walker expected a tap to do something.
- In the 1440x900 mouse leg: click the figure once and record what opened.
- A walker who taps and stays put closes I-020. Anything else goes to I-020's notes.

**Hygiene draft:** 0 lines, 0 accepted · 0 amended · 0 rejected. READ-MUTATED: none, because no `--run` was executed.

**Checks at close:**
- `check-due-gates-dispositioned`: "verdict: CLEAR", with the snapshot CURRENT (taken 2026-10-05) and 0 gates due at Phase 0.
- `check-wait-justification`, re-run because I-020's wait was touched after the helper: PASS, 21 of 31 rows carry `waitJustification`, 0 warn. The 1 info line clusters I-021, I-023 and I-024 on one cause, and I-020 has left the cluster.
- `check-engineering-zero --project sinusoidal-cycles`: PASS, 0 findings, 0 unreadable (no Sentry, no Dependabot).

**Receipt:** unchanged from P3, still true. No bracket has moved.

**Pending reads:**
- 2026-10-07: W-004 cold walk, covering I-020 and I-022.
- 2026-10-07: W-001 Search Console read; the freeze on titles, meta, H1s and URLs holds till then.
- 2026-10-07: I-021, I-023 and I-024 product candidates.
- 2026-12-01: I-025, the band question for David.

**UNRESOLVED:** none.

codexCalls: 3 (r1, r2, r3, all review)
