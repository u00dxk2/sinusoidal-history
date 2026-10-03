# sinusoidal-cycles — 2026-10-03 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** a reader on a small phone who opens the spectral figure and presses Back is returned to where they were on the page, every time. **Item:** I-017 (monitoring; its "Back from the opened figure keeps the reader's place" leg). W-003's cold walk, due today, runs beside it and asks the same return question of a walker.

**The user problem, in the reader's words:** "I tapped the chart to see it bigger, pressed Back, and the page had jumped up. I had to scroll to find the chart again." This sentence is written by the lane from a check reading. No reader has said it.

**What a user will see differently today:** not known yet, and I say so plainly. If the Back loss is real, the change is that Back from the opened figure returns to the figure on a 320-wide phone. If it is the check's own timing, no user sees a change from this item, and the day's change comes from the first failing half W-003's walk names, or the receipt reads `USER-VISIBLE: none`.

### Section 0

- `git pull --ff-only`: already up to date at `8389f97`. Working tree: one uncommitted file, `continuity/continuity-disposition-events.jsonl` (+7 lines, carried from the 10-02 close).
- Listener: 🟢 SSE alive. `/listen` ran at 15:35Z UTC: pid 28836, SESSION START 15:35:28Z, hello 15:35:31Z, slug sinusoidal-cycles, 0 replayed. It reaped the SessionStart hook's own relaunch (pid 24636), so one listener is running. `read-listener-strand` re-read at 15:44:48Z: SLUG MATCH, 0 consecutive no-loop warnings. Waker ranks 1-3 are armed, and the loop is armed by `ScheduleWakeup` (`/loop-tick 2m`).
- Codex: **GREEN**, from the probe line on this prompt (machine-level exec 2026-10-03T15:40:32Z). Not used at P1.
- CI: **GREEN** for `8389f973c0` (`check-ci-status --workflow ci.yml`: 1 success, 0 failures, 0 pending).
- Deploy drift: the Render deploys API for `srv-d7mcat7lk1mc73bidim0` reads `live 8389f973c09c9dfd72bfa0bccfd14a53ec569c29`, and that equals HEAD. No drift. `check-deployed-sha-drift --service sinusoidal-history` reads NOT-APPLICABLE-BY-REGISTRY (a commit-triggered service), so the API was read directly, as `docs/daily-config.md` says to.
  - **Correction to the primer banner and the lead:** both name the live sha as `e726f5e`. It is `8389f97`. `e726f5e..8389f97` is the two 10-02 close commits (`d6ffbb0`, `8389f97`), docs only, so the code measured at 391/391 last night is still the code serving.
- Harness: running 2.1.288 · fleet UNIFORM (26 of 26 panes) · installed 2.1.288 (SAME).
- Recs yesterday: no `## Recommendation` block in `docs/daily/2026-10-02-prelaunch.md`. Round 3's "What remains" and "Carried" lists were used instead:
  - W-003's walk on 10-03: **carrying today**, beside the selection.
  - I-019 (desktop labels at 7.8px): carrying to a later round.
  - Real iOS Safari unwalked: carrying, no date. It bears on today's selection (see MISSING).
- Cycle rotation: exit 0, "no product-love cycle picks this lane today (4 cycle(s) rotate over 23 lanes); run the normal P3".
- Due gates: `--snapshot` taken once, at ~15:45Z: "snapshot written — 14 gate(s) due on/before 2026-10-03" (23 rows swept; exit 3, which is the unread count, 13 never-run).
- Board: `answered-cards` found no waiting, answered or pending-verify cards.
- Retro: one of my 10-02 findings recurred and bears on this choice: "a check written from a measurement inherits its looseness". Last night's 391/391 was one run. One run cannot see a leg that fails some of the time.

### Evidence

- **OBSERVED (production, the primer's first action, today ~15:38Z UTC).** `check-verdict-landing https://sinusoidalhistory.com --fails-only`, Chromium: **390/391**. The failing leg: "320x568: /cycles/modelski Back from the opened figure keeps the reader's place — scrollY 4582 → 4221 · figure scrollLeft 200 → 200". The page came back 361px above where the reader left it. The sideways place held.
- **OBSERVED (same command, ~15:42Z UTC).** **391/391.** Same build, no deploy between the two runs.
- **NOT A SAMPLE (same command through `check-due-gates-dispositioned --run I-018`, ~15:47Z UTC).** The gate runner killed it at its default 60-second cap with 54 bytes of output and stamped nothing. A full run takes about three minutes. So the four rows that share this readCommand (I-016 to I-019) cannot be read through the gate until each carries `readCommandTimeoutMs`. That is a ledger fix for P3's hygiene, and it left a timeout marker on I-018.
- **So the leg is intermittent on production: 1 failure in 2 complete runs.** Population: 391 legs per run, of which 27 are this Back-from-the-SVG leg (9 paired pages at three phone sizes). Window: today only. Limit: every sample is Chromium emulation from this machine, and the sample is too small to state a rate.
- **OBSERVED (10-02, round 3).** One run after the deploy read 391/391. That run is the whole basis of "the ship holds".
- **OBSERVED (source, `scripts/check-verdict-landing.mjs:272-295`).** The leg waits for the path and the `#spectral-verdict` element, then for scrollY to hold across two frames, then 600ms more, and compares scrollY to the value before the tap within 2px. The failing run passed the settle wait, so the page was sitting still at the wrong place. It did not drift there late.
- **OBSERVED (source, `src/app/(app)/cycles/[id]/page.tsx:542-549`).** The figure `<img>` carries `width={900} height={500}`, so its box is reserved before the file loads. The lazy image is not the 361px.
- **HYPOTHESIS A (a real loss).** Back from the SVG is a full document load. The browser restores the page's vertical scroll itself, and it clamps to the document's height at that moment. If something above the figure reaches its final height late, the restore lands short and nothing corrects it. A reader on a slow connection would meet this more often than this machine does. Not measured.
- **HYPOTHESIS B (the check).** The 4582 it compares against was read before the tap, and something moved the page between that read and the navigation (the tap itself, or the scroller's own write). Then the page restored correctly to a place the check did not record. Not measured.
- **MISSING:** which of A and B it is. Nothing read today separates them.
- **MISSING:** real-user evidence. The site has no client analytics (a standing choice), and there is no `docs/evangelism-bar.md` or `docs/evangelism-evidence.md` in this lane, so there is no bar metric to read.
- **MISSING:** real iOS Safari. Its back-forward cache would keep the page alive across this Back, so a real iPhone may never see a loss that Chromium's full reload shows.
- **MISSING:** W-003's walk. It is due today and has not run. It is N = 1 and synthetic, and is never quoted as a user.

### Permission, and the freezes

- Lane-owned behaviour on an existing surface. No board card is open on it and no David decision is needed. I-017 and W-003 both wait on nothing but this lane's own dated read.
- **Spectral freeze:** no byte of `public/data/spectral/` changes.
- **W-001 freeze (titles, meta, H1s, URLs, to 2026-10-07):** none change.
- **Don't-touch from rounds 2-3:** the `figureScroll` history key, `HashLink.tsx`, and the two declared check ceilings. A fix for hypothesis A would sit beside the `figureScroll` state, so the P3 packet states exactly what it touches before any edit, and the diff gets a Codex review.
- **Stop-patching rule:** two Codex rounds already found ways this check could pass on a broken page. If the cause is B, the leg is not patched a third time by adding a wait. It is restated so that it records the place at the moment of the tap, or its limit is declared.

### Next action — investigate

Kind: **investigate a failure seen by the check on production** (not by a user), with W-003's walk as the due read beside it.

1. Repeat the one failing leg in isolation (`/cycles/modelski`, 320x568, swipe, tap, Back) enough times to state a rate. At each Back record: scrollY and the document height at the tap, and scrollY and the document height at the first frame after Back and again once settled. A short document at the first frame is A. A changed scrollY at the tap is B.
2. Run the same loop on one other paired page at 320x568 and on modelski at 390x664, as the comparison: is it this page, this size, or any page.
3. Dispatch W-003's cold walk to a fresh-context walker with the questions in its `onTrigger`, after running its `readCommand` to regenerate the landed frame.

First command (the read that showed it; prep writes the isolated loop as `tmp/measure-back-place.mjs`):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-verdict-landing.mjs https://sinusoidalhistory.com --fails-only
```

### Acceptance

- The cause is named A or B from a measurement, with the isolated loop's count stated as failures of N and the two document heights beside it.
- If A: after the fix, the isolated loop reads 0 failures of the same N on production at 320x568, 360x560 and 390x664, and `check-verdict-landing` reads 391/391 on **five consecutive** production runs. A red arm is recorded first: the loop's failures of N on production before the deploy.
- If B: the leg is restated or its limit declared, the mutation arm `lose-place` still goes red at its expected count, and the report says no user-visible change came from this item.
- Either way: `check-entry-folds`, `check-verdict-reach` and `check-verdict-phone` keep their counts, and no title, meta, H1, URL or `public/data/spectral/` byte changes.
- W-003: every question in its `onTrigger` has a recorded answer, and each failing half has a fix row.

### Delivery and encounter checks

- **Delivery (P3, only if A):** when Render reports the new deploy, read its sha from the deploys API, then run the isolated loop and the five `check-verdict-landing` runs against production.
- **Encounter:** W-003's walk today. Its round-2 question already has the walker swipe, tap the figure and press Back once. N = 1 and synthetic, so one clean Back from a walker does not show the loss is gone. The isolated loop's count is the read that can.
- There is no client analytics, so no event appears at any traffic level.

**USER-FACING: yes** (unsure until the cause is named, so yes). Paths, if A: `src/components/FigureScroller.tsx` or `src/app/(app)/cycles/[id]/page.tsx`. Internal either way: `scripts/check-verdict-landing.mjs` (the root lint reaches it), `tmp/measure-back-place.mjs`, `CHANGELOG.md`, `continuity/items.json` (via `continuity-edit`), `docs/daily/2026-10-03-prelaunch.md`.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **12** of the 14 due — I-006, I-008, I-009, I-010, I-011, I-012, I-013, I-014, I-015, I-016, I-018, I-019. I-017 and W-003 bear on the choice and are read in P3. I-016, I-018 and I-019 share I-017's readCommand, so today's runs of it are their read too, and each still needs its own disposition.
  - The snapshot also flags two broken read paths: I-006's onTrigger names `og/route.tsx`, which does not exist, and I-008's names `tmp/check-calibrate-tab.mjs`, which is gitignored.
- (b) Owed child rows: **none**. Read: the kickoff's "rows owed to you" (0 of 744).
- (c) Reads that crossed a threshold or could not be judged:
  - key numbers: there is no `docs/key-metrics.json`, so this is unjudged, not 0.
  - missingLinkedCommits: NOTHING SWEPT, 0 of 0 considered.
  - prior-day retro: 9 of my 10 tagged 10-02 findings are still on discipline; 1 is carried to W-003.
  - deployed-sha-drift: NOT-APPLICABLE-BY-REGISTRY (live sha read from the API instead: equals HEAD).
  - due gates: 13 of 14 due rows have never had their readCommand run through the gate, and I-016 to I-019 time out at the gate's 60-second default (I-018 measured today).

Exclude from any request-log read: my own probes today, from 15:38Z UTC onward.

codexCalls: 0 (probe green; Codex is planned for the P3 diff review if the cause is A)

**Prep after the P1 post (b4812ec0). Nothing committed.** `tmp/measure-back-place.mjs` repeats the one leg on production, Chromium, `/cycles/modelski` at 320x568, a fresh browser context per trial. It records scrollY and document height before the tap, at `pagehide`, at the first read after Back, and once settled.

| Arrival | Trials | Failures | Every trial read |
|---|---|---|---|
| Typed address (~15:52Z UTC) | 30 | 0 | before y4582 · pagehide y4582 · after Back y4582 · height 6431 throughout |
| Through the /cycles list, as the check arrives (~15:56Z UTC) | 30 | 0 | the same |

- **The loss did not reproduce: 0 failures of 60.** With the check's two complete runs (27 of these legs each), it is 1 failure in 114 Backs, all Chromium from this machine. That is too few failures to state a rate.
- **OBSERVED: a jump to the URL's own fragment, `#spectral-verdict`, lands this page at y4221.** That is exactly where the failing run came back to (4582 → 4221). So in the failing run the page was not left short by a late layout. It went to the top of the section the address names, in place of the reader's place 361px further down.
- **This rules hypothesis B down and reshapes A.** In all 60 trials the place at `pagehide` equalled the place the check recorded, so the check's starting read is sound in every trial observed. The failing run itself was not observed by the probe, so B is not excluded for that one run. The document height never changed, so A's "something above reaches its height late" is not what happened.
- **HYPOTHESIS A2:** on a Back that reloads the document, the scroll to the address's fragment sometimes wins over the restore of the saved position. Nothing in `src/` scrolls to the hash on load (`HashLink.tsx` does so only on a click, `FacetView.tsx` on its own toggle), so the jump would come from the browser or the router. Which one is not measured.
- **MISSING:** a reproduction. Without one, a fix cannot be shown to work, and a change beside the `figureScroll` history state on a 1-in-114 reading would be untested polishing.
- **What this does to the selection:** the outcome stands, but the honest size is smaller than the packet implied. A reader who meets it lands at the section heading, 361px above the figure, with the sideways place kept. The P3 options are (1) keep trying to reproduce under load (the check ran this leg as one of 391 in a long-lived context; the probe ran it alone), or (2) declare it in the check's header as an observed 1-in-114 fragment jump and spend the day's change on what W-003's walk finds. I lean to (2) unless one more attempt under load reproduces it.

---

[P3 — Product-work loop]

## P3 — Product-work loop

**The manager review (d483bf88) redirected the P1 selection.** It stopped the Back investigation and made the desktop figure labels (I-019) today's ship, with W-003's walk started first. Its last line: "If W-003's walk names something worse for a reader, ship that instead and say why." The walk did name something worse, and it was a small fix, so both shipped. Kind: improve the product (two fixes to things already built).

**Why the second change shipped.** The walker's single worst thing was the Calibrate tab: arriving at `/?focus=schlesinger_jr` from a cycle page and tapping Calibrate opened Ibn Khaldun. In the walker's words it was "the only place where the site put me on the wrong thing without telling me". I confirmed it on production before touching code (30/36 on the extended check, facet `khaldun` for both focus ids at all three sizes). The walker ranked the desktop labels third. The fix was one initial value, so it did not displace I-019; it rode with it.

### 1. Implementation

Three commits on `main`. CI is green for `9c958e4` (`check-ci-status --workflow ci.yml`: 1 success, 0 failures, 0 pending).

- **`6330855` (I-019).** `src/app/(app)/cycles/[id]/page.tsx`: the figure `<img>` is 900px at every width. From `lg` (1024px) up, the scroller breaks out of the 704px text column by 98px a side. Below `lg` it is the sideways scroller, under the cue. The SVGs, `FigureScroller.tsx`, the `figureScroll` key and `HashLink.tsx` are untouched.
  - What changed for a reader between 768px and 1023px: the figure used to be 704px with 7.8px labels and no cue. It is now 900px in the scroller under "Swipe sideways for the whole figure". With a mouse, "swipe" is the wrong verb at those widths. I chose that over leaving the labels at 7.8px there.
- **`25c90b2`.** `src/components/Viz.tsx`: the Calibrate picker starts on the focused cycle when it has a paired series, and on the first calibratable cycle otherwise. Radix unmounts the inactive tab, so the value is read each time the tab opens.
- **`9c958e4`.** The two Codex r2 findings: the picker's chips carry `data-chip-id`, and the new legs require exactly one pressed chip whose id is the focused cycle.
- **Checks.**
  - `scripts/check-verdict-landing.mjs`: nine desktop legs per paired page (sizes and on-screen at 1440 and 1024; sizes and swipeable at 1023; no sideways page scroll at any), and a `column-figure` mutation arm. 391 legs became 472.
  - The Back leg: the header declares the one observed miss, and the failure line now prints the first-settled scrollY and the address's fragment. Its pass condition and its waits are unchanged. No wait was added.
  - `scripts/check-calibrate-tab.mjs`: two legs per size, 30 became 36.
  - `scripts/check-confidence-tag-taps.mjs` (W-003's readCommand): waits for `load`, not `networkidle`. It timed out at 30 seconds on 2 of 2 production runs today. The router's prefetches of the cycle pages stay open on /cycles; the server answered each of those requests in 216 to 448ms, so this was the check and not the site.
- **Local gates on the pushed tree:** typecheck exit 0, lint exit 0 (0 errors), tests 124 passed of 124 in 16 files, build exit 0.

Red and green readings:

| Reading | check-verdict-landing | check-calibrate-tab |
|---|---|---|
| Production before | 418/472 (the 54 desktop size legs: "10-unit text at 7.8px (figure 704x391px)", "11-unit text at 8.6px") | 30/36 (the six new legs: `facet=khaldun`) |
| Local build after | 472/472 | 36/36 |
| `--mutate column-figure` (local) | 418/472, the same 54 legs | — |
| `--mutate lose-place` (local) | 391/472, the 81 Back legs | — |
| Production after the deploy | 472/472 | 36/36 |

The first version of `column-figure` was wrong and its run showed it: it removed only the breakout margins, the 900px figure overflowed the page, and 463/472 failed on the nine on-screen legs at 1024 with no size leg red. The arm now shrinks the figure to the column, as the old build did.

**The review's HYPOTHESIS, checked.** "The address carried #spectral-verdict on the failing run, and a late hash scroll overrode the restore." The first half holds by construction: that leg reaches the figure by the box's `#spectral-verdict` link, and a jump to that fragment lands `/cycles/modelski` at y4221 at 320x568, exactly where the failing run came back to. "Late" is not supported and not refuted. The failing run passed the leg's settle wait (two equal frames, then 600ms), and it printed no first-settled value, so whether the page went to 4221 at once or moved there later is unknown. The new failure line will say which, next time. Today's count for that leg on production: 1 miss in 5 complete runs (27 of these Backs each: the two this morning, the helper's, the red reading and the post-deploy run) plus 0 of 60 isolated repeats, so 1 in 195. The check's header says 1 in 114, which was the count when it was written.

### 2. Delivery

- The Render deploys API for `srv-d7mcat7lk1mc73bidim0` reads `live 9c958e49ea26df42a2e52deb71bdc725e01bf99e`, finished 2026-10-03 16:33:30Z UTC. That equals HEAD. `check-deployed-sha-drift --service sinusoidal-history` is NOT-APPLICABLE-BY-REGISTRY for this commit-triggered service, so the API was read directly.
- The surface was read, not just the sha:
  - `check-verdict-landing https://sinusoidalhistory.com --fails-only` → **472/472 PASS**. On 9 of 9 paired pages at 1440x900 the 10-unit labels draw at 10px or more.
  - `check-calibrate-tab https://sinusoidalhistory.com` → **36/36 PASS**.
  - Phone counts hold: `check-verdict-phone` **316/316**; `check-entry-folds` at 320x568 **13 of 13** (smallest spare 12px, on `/` and `/cycles/turchin`); the phone legs inside the 472.
- No byte of `public/data/spectral/` changed, and no title, meta, H1 or URL changed (Codex r1 read the diff for this and agreed).

### 3. Encounter

**Blind.** The site has no client analytics, a standing choice, so a reader on either surface leaves no trace. W-003's walk today read the OLD build (it ran before the deploy), so it is the evidence for the problem, not a read of the fix. The next read is a cold walk of these two surfaces; W-003's date is set at the close.

### 4. Outcome

Open. No read yet.

USER-VISIBLE (debt-paydown): on a desktop the spectral figure on each paired cycle page is drawn at full size, so its axis and target labels can be read (10px, up from 7.8px), and the chart's Calibrate tab opens on the cycle the reader came from instead of always on Ibn Khaldun — 6330855 [proof: check-verdict-landing 418/472 → 472/472 and check-calibrate-tab 30/36 → 36/36 on production after Render deploy 9c958e4 live 2026-10-03 16:33:30Z UTC; 9 of 9 paired pages at 1440x900 draw 10-unit labels at 10px; phone reads hold at 316/316 and 13 of 13] [coverage: none — no client analytics by standing choice · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader on the figure or the tab leaves no trace · bug row W-003]

[red-armed: node scripts/check-verdict-landing.mjs https://sinusoidalhistory.com --fails-only (production before the deploy) -> 418/472 FAIL — "1440x900: /cycles/kondratiev figure's smallest labels render at ≥10px — 10-unit text at 7.8px (figure 704x391px)" on 9 of 9 paired pages at 1440, 1024 and 1023 wide]
[red-armed: node scripts/check-calibrate-tab.mjs https://sinusoidalhistory.com (production before the deploy) -> 30/36 — "Calibrate opens on the focused cycle (schlesinger_jr) — facet=khaldun" at 390x664, 1440x900 and 320x568]

mechanism-verified: `node scripts/check-verdict-landing.mjs https://sinusoidalhistory.com --fails-only` (production, after the deploy) → `472/472 PASS`; `node scripts/check-calibrate-tab.mjs https://sinusoidalhistory.com` → `36/36 PASS`; `node scripts/check-confidence-tag-taps.mjs https://sinusoidalhistory.com <frame>` → 7 of 7 PASS (timed out before the change, 2 of 2 runs)

### W-003's cold walk (ran today, before the deploy)

One synthetic walker, N = 1, Chromium, live site only. It is a cold walk and never a user. Record: `docs/walks/2026-10-03-w003.md`. Real iOS Safari is still unwalked.

- **The row's own question (closeWhen a):** the tag "looks only mildly tappable", and the dotted underline read as "there is a definition here". After the tap the walker said the paired data is "a real historical measurement … that the site, not the theorist, chose to set beside the theory's curve as a comparison". Both halves answered. The landing has a flaw: an unrelated, larger paragraph fills the top 40% of the screen and nothing is highlighted.
- **Descriptions (I-007's follow-on):** all ten readable at 15px. Kondratiev and Perez read as near-twins.
- **Calibrate (I-008):** the drag's effect was said in one sentence (the wave slid, r went 0.123 → −0.549). Getting there was the worst thing in the walk; the wrong-cycle part is fixed today. Still open: the way in is one link about seven screens down the cycle page, it lands below the tabs, and the curve and r do not fit one phone screen together.
- **Where is it now (I-009):** found after 281px, 0.42 of a screen. The walker was surprised that Dalio "sits at a peak", with the reason a screen further down.
- **The two marks (I-010):** both read correctly; the ring needed its legend.
- **/state list (I-011):** rising cycles and Dalio's next turning point answered without a sideways swipe. **I-013's question fired:** "Huntington is 'Rising' with cos +0.98 … while Kondratiev is 'Peaking' with cos +0.99 … those look like the same situation with different labels." That is the reader tripping that the row waits on, so I-013 goes to David at the close.
- **Verdict list (I-012, I-014, I-015, I-016):** "none" answered with 0 taps and 0 scrolls; the nine-and-one sentence read as intended; Kondratiev's 85 years read from the landing screen; the opened page named from the box label; Back returned to the list. Desktop verdict column in words, no sideways scroll at 1440 or 700.
- **Phone figure (I-017):** target and band read without pinch-zoom, but only after swiping; on arrival both are cut ("target pe", "INSUFFI"). The tap opens the bare SVG, smaller than inline, on a page with no way back but Back. Back kept both places.
- **Return (I-018):** a link return started at the left edge; Back kept 205px. Both pass.
- **Desktop figure (I-019):** "too small; I leaned in", smallest text about 7px, no hint to enlarge. Fixed today.
- Also met: /cycles and the citation say "US TFP growth (5-yr rolling)" where the verdict and figure say "annual, unsmoothed". Both are true of two different series (10-02 round 3), and the walker could not tell which was tested.

codexCalls: 2 (two foreground `codex exec --sandbox read-only` review runs; probe GREEN at 2026-10-03T15:40:32Z)
adversarialReviews: 2 — EXECUTED
- r1 on `8389f97..6330855`: no actionable defect. It worked the tightest case itself: at 1024px with a 17px scrollbar the figure keeps 53.5px a side.
- r2 on `6330855..25c90b2`: 2 findings, both CONFIRMED against source and fixed in `9c958e4`. P2: the new Calibrate legs read the chip for the detail line only, so a wrong chip could not fail them. P3: the changelog said "with nothing saying so"; the pressed chip said so and the walker missed it.
- `9c958e4` is **not reviewed**: a check predicate, a `data-chip-id` attribute and two sentences.
- Both banners read `workdir: C:\dev\skylark\sinusoidal-cycles`. Both reviews were STATIC; the browser readings above are this lane's.

hygiene helper: DISPATCHED ~16:02Z UTC · draft `tmp/hygiene-draft-sinusoidal-cycles-2026-10-03.md` PRESENT (12 lines: 11 keep-monitoring with a re-date, I-013 undecided).
- engineering-zero: 0 findings, 0 unreadable. wait-justification: pass, 1 info (I-019).
- READ-MUTATED: 2 lines on I-016's read, both this lane's own P3 edits made during its 211-second run (status 5b48a22d). The read writes no file.
- Before the dispatch I set `readCommandTimeoutMs` 420000 on I-016 to I-019, because the gate's 60-second default killed the three-minute read this morning.

What remains:
- The close applies the hygiene draft and the walk's answers to the ledger: ten rows wait on this walk, I-013 goes to David, I-019 closes on its production read, and W-003 is answered on its own question.
- Not selected today, from the walk: the phone figure's tap makes it smaller on a dead-end page (ranked 2); the phone figure arrives with its target and band cut off (ranked 4); the way into Calibrate from a cycle page; the confidence-tag landing; the TFP series wording. Each needs a row at the close.
- The Back miss: declared, 1 in 195 Backs today, cause unknown.
- The cue says "Swipe" to a mouse reader between 768px and 1023px.
- Real iOS Safari is unwalked.
- In-flight statuses 5b48a22d and eabe547d are superseded by this post.

[standing-rules-hash: 88cc2dc9]

---

[P5 — Delta-only close]

ACTION: COMPLETED · item I-019 · P3 1ba9f75b

## Close

**The acceptance in force** was the manager review's REDIRECT (d483bf88); the review of the work (b4b27df0) read it COMPLETED.

**State changed since the P3 post:**
- The live sha is now `9a85de0` (Render, finished 16:43:47Z UTC). That commit is docs and ledger only, so the code measured at 472/472 and 36/36 (read at live `9c958e4`) is the code serving.
- The review's HYPOTHESIS, checked: the Calibrate picker reads `?focus=` only as its initial value, and no path changes the focus while the tab stays open. Every in-app path that sets the focus also switches to Facets (`Viz.tsx:91-94`). Radix unmounts the inactive tab. nuqs writes `focus` with history `replace` (`urlState.ts:66`, no `history` option), so Back cannot change it underneath.

**Hygiene draft** (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-03.md`): 12 lines — 2 accepted · 10 amended · 0 rejected.
- Accepted: I-006 and I-009, both re-dated to 2026-10-07. I-009's Search Console half is due then. The optional I-006 onTrigger path fix was not applied.
- Amended to close, because W-003's walk answered their questions after the draft was written: I-008, I-010, I-011, I-012, I-014, I-015, I-016 and I-018. Each closing note quotes the walk.
- Amended, I-013 (UNDECIDED in the draft): the walker tripped on Rising vs Peaking, which is the row's trigger. It was re-dated to 2026-10-07 and David's card was filed (67b4a9dc, board card c55395fc).
- Amended, I-017: re-dated to 2026-10-07, with a note carrying today's Back count (1 in 195) and the walk's two passes.
- READ-MUTATED, quoted: "READ-MUTATED I-016 scripts/check-verdict-landing.mjs — path named in the readCommand — BUT the lane told the helper beforehand that it would edit this file during P3 …" and "READ-MUTATED I-016 src/app/(app)/cycles/[id]/page.tsx — NOT named in the readCommand: may be the lane's own concurrent P3 edit; lane checks". Both are this lane's own P3 edits (status 5b48a22d).
- wait-justification (draft): PASS, 13 of 23, 1 info. engineering-zero: PASS, 0 findings, 0 unreadable.

**Ledger delta (beyond the draft):**
- **I-019 CLOSED** on its production read: 418/472 → 472/472, 9 of 9 paired pages at 1440x900 with 10-unit labels at 10px, read at live `9c958e4`.
- **W-003 CLOSED** as (a), confirmed on its own question. The tag read as a definition marker, and after the tap the walker said the paired series is the site's comparison.
- **Minted, from the walk's unselected findings:**
  - I-020: on a phone, the figure tap opens a smaller dead end.
  - I-021: the figure's first view and its cue; this includes "Swipe" said to a mouse at 768-1023.
  - I-022: the way into Calibrate from a cycle page.
  - I-023: the confidence-tag landing.
  - I-024: the TFP series wording.
  All five are open and dated 2026-10-07.
- **Minted W-004**, THE ONE THING: a cold walk on 2026-10-07 of the desktop figure (1440 and about 900 wide, with a mouse) and of Calibrate reached from a cycle page. Its readCommand is check-verdict-landing, with a 420000ms cap.
- `readCommandTimeoutMs` 420000 was set on I-016 to I-019 at P3.

**Verify:**
- `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-03).
- `check-wait-justification` after my edits → "RESULT: PASS — 19 of 29 row(s) carry `waitJustification`; 0 warn / 1 info". The info is WAIT_SHARED_CAUSE_CLUSTER on I-020 to I-024: the five new rows share one wait sentence. They are separate problems on one date, so this is not one upstream cause.
- Sentry and Dependabot: engineering-zero read 0 findings for this lane.

**Receipt:** P3's receipt (1ba9f75b) still holds and is not restated. The exposure is still blind, and the read is W-004.

**Pending reads:**
- 2026-10-07: W-004's cold walk of the two fixes.
- 2026-10-07: W-001's Search Console read.
- 2026-10-07: I-006, I-009, I-013 (David's card), I-017 (re-run the check), and I-020 to I-024.
- Real iOS Safari: unwalked, no date.

**Primer:** `docs/cold-starts/2026-10-03.md`, banner 1,224 chars.

codexCalls: 2 today, both at P3. None at this close (probed-declined: no code diff).

---

## Round 2 — P1 — Evidence and choice

[P1 — Evidence and choice]

**Round 2 (afternoon).** **Outcome:** a reader of /state/2026 can see why two curves that look alike carry different words. **Item:** I-013 (open, P3), answered by David on board card c55395fc.

**The user problem, in the reader's words:** "Huntington is 'Rising' with cos +0.98 … while Kondratiev is 'Peaking' with cos +0.99 … those look like the same situation with different labels." This is a quote from the W-003 cold walk (10-03, synthetic walker, N = 1), not from a real user.

**David's ruling, verbatim (card c55395fc, replied 2026-10-03T17:10:23Z):** "Wording only for 2026. Keep the band; make the line say why. Revisit the band for the 2027 edition."

**What a user will see differently:** on /state/2026, every row near a peak or trough gets one plain sentence under its phase word. That is six of the ten rows in 2026, on phones and on the desktop table. For example:
- Huntington: "2 years before its peak; peaking means within ±1.8 years for a 60-year cycle."
- Khaldun: "3 years before its peak; peaking means within ±3.6 years for a 120-year cycle."

### Section 0 (round 2)

- **git:** `fetch` done, `main...origin/main` level at `98a2007`. The working tree holds only this prep (4 modified files plus one new fixture), uncommitted.
- **Listener:** the SessionStart hook relaunched it at 18:45:57Z UTC (pid 36332): slug sinusoidal-cycles, hello 18:45:59Z, 2 replayed. Waker ranks 1-3 are re-armed, and the loop is armed by a `ScheduleWakeup` call.
- **CI:** GREEN for `98a2007f` (the kickoff's read: 1 success, 0 failures).
- **Deploy drift:** the Render deploys API for `srv-d7mcat7lk1mc73bidim0` reads `live 98a2007f…` (finished 17:08:58Z UTC), which equals HEAD. No drift.
- **Codex:** GREEN, from the probe line on this prompt. One review is running now on the prep diff (read-only, foreground pipe).
- **Cycle rotation:** exit 0, "no product-love cycle picks this lane today (4 cycle(s) rotate over 23 lanes); run the normal P3".
- **Due gates:** the kickoff reads 0 due on or before 2026-10-03. This morning's snapshot stands, and no re-snapshot was taken.
- **Board:** 1 answered card, c55395fc (above). It is this selection.
- **Retro (10-02):** one finding bears on this: "a check written from a measurement inherits its looseness". So the new check legs recompute the expected sentence from the API's period and reference peak, independently. They do not read the page's own text back.

### Evidence

- **OBSERVED, W-003 cold walk (10-03, report above):** the walker tripped on exactly the row's trigger. Synthetic, N = 1.
- **OBSERVED, arithmetic (cos(2π·(2026 − ref)/period), all ten cycles):** the peaking band is 3% of the period, so its width in years differs by cycle.
  - Huntington: 2 years from its peak, band ±1.8 years, so it reads "rising".
  - Khaldun: 3 years from its peak, band ±3.6 years, so it reads "peaking".
  - Turchin: 6 years past its peak at cos +0.97, band ±4.5 years, so it reads "falling".
  The labels are correct by the stated band. What a reader cannot see is that the band scales with the period.
- **MISSING:** real-user evidence. The site has no client analytics, and there is no evangelism-bar file in this lane.

### Permission

David decided this himself, on the card. Scope, from the ruling:
- No change to the band (`PEAK_BAND`/`TROUGH_BAND` in `src/lib/cycleMath.ts`).
- No change to `/methods`, to `/api/v1/state`, or to the frozen `public/data/state-2026.csv`.
- The W-001 freeze (titles, meta, H1s, URLs, to 2026-10-07) is untouched: the change adds body text only.

### Next action — improve (prep is done, held for review)

The prep is built and verified locally. Nothing is committed, pushed or deployed. P3's first command is the commit, then the production read:

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-state-phone.mjs https://sinusoidalhistory.com
```

What the prep holds:
- **`src/lib/stateOfCycles.ts`:** a new `phaseReason(cycle, year)` and `phaseReasons(year)`. They are derived from the period and the reference peak, and kept off `CycleStateEntry` so the API body is unchanged.
- **`src/app/(app)/state/[year]/page.tsx`:** the reason renders under the phase word, in the phone list and in the desktop phase cell.

The tests:
- **4 new tests in `stateOfCycles.test.ts`:**
  - The four 2026 sentences, pinned.
  - Silence away from a turning point.
  - A sweep over 1900-2100 showing the sentence's "inside the band" always agrees with the label.
  - The two ruling pins: `stateOfCycles(2026)` deep-equals production's `/api/v1/state?year=2026` body, saved before the change (`src/lib/__fixtures__/api-v1-state-2026.json`), and `state-2026.csv` has a pinned sha256 (LF-normalised).
- **Red arms run:** each new pin was broken on purpose, then restored, and the tree is clean.
  - Band changed from 0.03 to 0.04 in the reason → 2 failures.
  - A `phase_reason` field added to the API entry → the API pin fails.
  - One byte appended to the CSV → the CSV pin fails; the file was restored with `git checkout`.
  - All 16 state tests pass. The full suite passed 127/127 before the pins were added; it is not yet re-run with them. Typecheck is clean.
- **`scripts/check-state-phone.mjs`:** gains a reason leg per cycle at three widths, plus a "no reason away from a turning point" leg.
  - On production (before the change): 102/130, failing exactly the 18 reason legs and the 10 desktop phase legs. Those 10 now read the word from its own `data-field="phase"` span, which production does not have yet.
  - On the local build: 130/130.
- **API bytes:** `/api/v1/state?year=2026` has the same sha256 on production and on the local build (C728127D…).
- **Rendered text:** `/state/2026` gains exactly 12 lines (6 reasons × phone list and table) and loses none (244 → 256).

**Acceptance:**
- `check-state-phone` reads 130/130 on production after the deploy.
- The API sha256 on production is unchanged (C728127D…).
- The state tests pass in CI.
- The Codex review is dispositioned before the commit.

**Encounter check:** N = 1 synthetic. The W-004 walk (2026-10-07) is the next cold read. I will ask the orchestrator to add one question to it: "Do Rising and Peaking near the top now read as one rule?"

**USER-FACING: yes** — `src/app/(app)/state/[year]/page.tsx`, `src/lib/stateOfCycles.ts`. Internal: `src/lib/stateOfCycles.test.ts`, `src/lib/__fixtures__/api-v1-state-2026.json`, `scripts/check-state-phone.mjs`.

**Owed at P3 or the close:**
- I-013 closes on the production read.
- A new dated row revisits the band for the 2027 edition. Date: before the 2027 page appears, i.e. 2026-12-15.
- Card c55395fc is dismissed with a reason.
- Carried from round 1, not selected: the "Swipe" cue said to mouse readers at 768-1023 (I-021, dated 2026-10-07).

### HYGIENE INPUTS
- (a) Due rows not bearing on the choice: **none** — read: kickoff "dated gates due today: 0".
- (b) Owed child rows: **none** — read: kickoff "rows owed to you" (0 of 744).
- (c) CROSSED state reads: **none** — read: the kickoff's state block. "board cards carrying David's word: 1" is this selection, so it is not hygiene.

### Round 2 — Codex review of the prep (r1), dispositioned before any commit

**Run:** foreground pipe, `--sandbox read-only`. Banner `workdir: C:\dev\skylark\sinusoidal-cycles`. Prompt quoted David's ruling verbatim.

**Claims pass: all six 2026 sentences HOLD**, checked against `cycles.json`, the cosine and `0.03 × period`. Codex REPRODUCED that the ruling is honoured: `stateOfCycles` output identical to HEAD for every integer year 1-9999, CSV hash matches, and `expectedReason` imports no app code.

**Findings, each held against the source:**
1. **P2, REPRODUCED — PLAUSIBLE.** At a rounded band edge, two different labels print the same distance (Huntington 1969.799 vs 1969.801). No instance at integer years with today's data.
   **Fixed:** the sentence now says "inside"/"outside", taken from the label, so it cannot disagree with the word. A test pins both edge cases.
2. **P2, STATIC — CONFIRMED.** Perez says "1.5 years" while its row prints "next trough 2028".
   **Fixed:** "1.5 years before its trough at 2027.5 (shown as 2028)". This appears only when the turning point falls between years.
3. **P3, REPRODUCED — CONFIRMED.** For a near-zero distance the app printed "0 years after" while the check expected "At its peak". Fractional data only.
   **Fixed:** the app now decides from the rounded string, the same way the check does. A test pins it.
4. **P3, STATIC — CONFIRMED.** The phone reason leg ignored a duplicate reason line.
   **Fixed:** a new "one reason line" leg per cycle per phone width (+12 legs).
5. **P3, STATIC — CONFIRMED.** "peaking means…" under the word Falling read like a competing label.
   **Fixed, together with 1:** e.g. "6 years after its peak, outside the ±4.5-year peaking band for a 150-year cycle."

**After the fixes (local build, uncommitted):**
- `check-state-phone`: 142/142.
- Full suite: 131/131. Typecheck clean; lint clean on the changed files.
- Red arm: inside/outside computed from the rounded numbers again → the edge test fails. Restored.
- `/api/v1/state?year=2026`: same sha256 as production.
- `/state/2026`: +12 lines, none removed.

**Not re-reviewed:** the r1 fixes themselves. Before the commit, I'll ask Codex for a narrow r2 on the new sentence shape, unless the P1 review says otherwise.