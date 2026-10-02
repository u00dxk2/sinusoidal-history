# sinusoidal-cycles — 2026-10-02 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** a reader who opens a cycle from the /cycles verdict list can tell, without scrolling, which cycle's verdict they are reading. **Item:** I-015 (monitoring). Its onTrigger carries this as a held walk finding; a fix row of its own is minted through `continuity-edit` at P3.

**The user problem, in the reader's words:** "I tapped the third name in a list of ten identical verdicts. The page that opened says 'Does it hold up?' and 'a 54-year claim'. Which one did I open?"

### Section 0

- `git pull`: already up to date at `6bf8e65`. Working tree clean.
- Listener: 🟢 SSE alive (pid 60764, SESSION START 06:12:20Z, hello 06:12:26Z, slug sinusoidal-cycles, replayed 0). Waker ranks 1-3 armed. Loop armed by `ScheduleWakeup`.
- Codex: **GREEN** (the probe line on this prompt: machine-level exec 2026-10-01T22:18:38Z, 7.9h old). Not used at P1. A cross-family review of the P3 diff is planned.
- CI: **GREEN** for `6bf8e6544c` (`check-ci-status --workflow ci.yml`, 1 success, 0 failures, 0 pending).
- Deploy drift: none. Render deploys API (srv-d7mcat7lk1mc73bidim0) reads `live 6bf8e6544cedd55b71237198762d5cd6c246058c`, finished 2026-10-02 01:35Z, the same sha as HEAD. `check-deployed-sha-drift` is NOT-APPLICABLE-BY-REGISTRY for this commit-triggered service.
- Primer first action: `check-verdict-reach https://sinusoidalhistory.com` → **37/37 PASS** (Chromium, ~06:16Z). Yesterday's ship holds.
- Harness: running 2.1.287 · fleet UNIFORM (27 of 27 panes) · installed 2.1.287 (SAME).
- Recs yesterday: no `## Recommendation` block in `docs/daily/2026-10-01-prelaunch.md`, so the round-2 "What remains" list was used instead:
  - Confirm the Back fix on production: executed (37/37 above).
  - W-003 walk: carrying to its own date, 2026-10-03.
  - Walk findings 2 and 3, held yesterday: carrying today → P3. They are this selection.
- Cycle rotation: `check-cycle-rotation --lane sinusoidal-cycles` → exit 0, "no product-love cycle picks this lane today (4 cycle(s) rotate over 23 lanes); run the normal P3".
- Due gates: snapshot taken once, "0 gate(s) due on/before 2026-10-02" (19 ledger rows swept).
- Board: `answered-cards --project sinusoidal-cycles` → no waiting, answered or pending-verify cards.

### Evidence

- OBSERVED (cold walk, skylark-site `docs/walks/2026-10-02/sinusoidal-cycles.md`, findings 1-3; Chromium, iPhone 15 emulation and 1440x900; N = 1 walker, 2 cycles opened). Walk window 2026-10-02T02:33:42Z-02:36:07Z, to be excluded from every read.
- OBSERVED (my measurement on production, 06:21:34Z-06:22:42Z, `tmp/measure-verdict-landing.mjs`, Playwright Chromium, 1 run). Population: every link in the verdict list, 10 of 10, at three sizes. Each trip is /cycles → header link → tap the name.

  | Read after the tap | iPhone 15 390x664 | 320x568 | 1440x900 |
  |---|---|---|---|
  | Paired cycles where the box names the cycle | 0 of 9 | 0 of 9 | 0 of 9 |
  | Paired cycles where anything on screen names it | 0 of 9 | 0 of 9 | 4 of 9 |
  | h1 position (bottom edge, px from top) | −136 to −206 | −155 to −225 | −133 to −188 |
  | "The full verdict, the figure and the protocol →" box | 269x17px | 252x38px (wraps to two 17px lines) | 269x17px |

  - The 4 of 9 at 1440 are an accident: the name appears in text further down the same screen, not in the box.
  - The tenth cycle (fathers-and-sons, no paired series) lands at the top of its page with the h1 on screen, so it is not part of the problem. Its box link "Why there is none, in the caveat →" is also 17px tall (205x17).
  - The verdict-list links one tap earlier are 44px tall on both phone sizes.
- OBSERVED (same run, walk finding 2): after the header jump on /cycles, the phone list shows 9 verdict rows carrying **1 distinct label** ("Insufficient data — no test possible"). Neither the "0 of the 9 paired" sentence nor the word "none" is on that screen, at any of the three sizes.
- OBSERVED (source): the box label is a fixed string, `Does it hold up?`, at `src/app/(app)/cycles/[id]/page.tsx:214` and `:261`. The box text never uses the cycle's name.
- MISSING: real-user evidence. The site has no client analytics (a standing choice), and there is no `docs/evangelism-bar.md` or `docs/evangelism-evidence.md` in this repo. A synthetic walk is not a real-user encounter.
- MISSING: real iOS Safari. Both the walk and my run are Chromium.
- Not re-read: Search Console. W-001's read is dated 2026-10-07 and does not bear on this choice.
- One of my own 10-01 findings bears on this: "the Back bug was not one link" (7 siblings). So P3 sweeps both branches of the box (paired and unpaired) and both forward links, not the one the walker tapped.

### Permission, and the W-001 freeze question

- Lane-owned copy and layout on existing surfaces. No board card is open on it and no David decision is needed.
- **Does the box label fall under W-001's freeze?** By its letter, no. The freeze names titles, meta descriptions, H1s and URLs, and the label is an `<h2>` inside the page body. Body copy has shipped during the freeze before (the "where it sits this year" sentence on every cycle page, `07c96d3`, 2026-09-29). By its purpose there is a small exposure: the 2026-10-07 read is snippet- and rank-sensitive, and a heading that gains the cycle's name is on-page text Google can use. So the ship date and the changed strings go into W-001's notes, and the 10-07 read can attribute a move. No title, meta, H1 or URL changes.
- No spectral or manifest surface is touched. Every number in the new copy is derived from `verdicts.json` through `spectralHeadline`, never typed.
- I-013 is still David's decision and is not touched.

### Next action — improve

Three small edits on one trip, each its own commit, in this order:

1. **Selected:** the "Does it hold up?" box names its cycle, using the same short name the reader tapped in the list (`cycleTheorist`). Both branches of the box.
2. The /cycles verdict section states its result under the heading ("None can be tested yet", derived from `eligible_primary`), before the ten rows.
3. The box's forward link gets a 44px tap box on touch sizes (both branches).

First command, the red arm (it becomes a committed check leg at P3):

```
node C:/dev/skylark/sinusoidal-cycles/tmp/measure-verdict-landing.mjs https://sinusoidalhistory.com
```

Known constraint (HYPOTHESIS, estimated from the CSS, not measured): the label is 11px mono with wide tracking, and at 320 wide the box has room for about 29 characters on one line. "Does it hold up?" plus a name will not fit on one line for most cycles, and `/cycles/turchin` has 12px of first-screen spare at 320x568. So the name may have to go somewhere other than the label line. The fold check decides, not taste. If edit 1 cannot hold the fold, it ships in the form that does; edits 2 and 3 do not depend on it.

Not selected today: re-ordering the verdict rows to lead with the years short (the walker's second half of finding 2). The row order is I-012's design and its encounter read is W-003's eighth question on 2026-10-03. Also not selected: walk finding 4 (keyboard focus after Back), which the walker marks as not urgent.

### Acceptance

- At 390x664, 360x560, 320x568 and 1440x900, for all 9 paired cycles: after the tap from the verdict list, the box on screen contains the name on the link that was tapped. **Red on production today: 0 of 9 at each of the three sizes measured** (360x560 not yet measured).
- After the header jump on /cycles, a sentence stating the result is on the same screen as the heading, at the same four sizes. Red today: absent.
- The forward link's hit box is at least 44px tall at the three touch sizes, on both branches. Red today: 17px.
- `check-entry-folds` stays 13 of 13 at 390x664, 360x560 and 320x568, with every leg at 8px spare or more.
- `check-verdict-reach` stays 37/37. `check-verdict-phone` keeps its count (308/308 when last read, 2026-09-30; re-read before the change).
- The rendered-text diff of /cycles and the ten cycle pages shows only the intended lines.
- No title, meta description, H1 or URL changes.

### Delivery and encounter checks

- Delivery (planned for P3, nothing shipped yet): once Render reports the new deploy, run the new check leg against production and read the deploy sha from the Render deploys API.
- Encounter: W-003's cold walk on **2026-10-03**. It gains one question, asked right after the walker opens a cycle from the list: "without scrolling, which cycle is this page about?" There is no client analytics, so no event will appear at any traffic level. The walk (N = 1) is the only encounter read.

**USER-FACING: yes.** Paths: `src/app/(app)/cycles/[id]/page.tsx`, `src/app/(app)/cycles/page.tsx`, `scripts/check-verdict-reach.mjs` or a new check under `scripts/` (internal; root lint reaches it), `CHANGELOG.md`, `continuity/items.json` (internal, via `continuity-edit`), `docs/daily/2026-10-02-prelaunch.md`. The cycle pages and /cycles have no markdown mirror.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none** — read `check-due-gates-dispositioned --snapshot` ("0 gate(s) due on/before 2026-10-02", 19 rows swept).
- (b) Owed child rows: **none** — read the kickoff's "rows owed to you" (0 of 739).
- (c) Reads that crossed a threshold or could not be judged:
  - key numbers: no `docs/key-metrics.json` yet, so this is unjudged, not 0.
  - missingLinkedCommits: NOTHING SWEPT, 0 of 0 considered.
  - prior-day retro: 11 of 11 of my 10-01 findings are still on discipline, with no machine behind them.

Own probes to exclude from any request-log read: 2026-10-02T06:15Z-06:23Z (page loads only: /cycles and the ten cycle pages).

---

## P3 — Product-work loop

**Action (kind: improve):** I-016, new today (it was I-015's two held walk findings). A reader who opens a cycle from the /cycles verdict list now lands on a box that says which cycle it is. The verdict list states its result before its ten rows, and the box's one link forward is a full-size tap target. The manager review (4892cfd0) APPROVED this, with three things to check:

- **Its hypothesis 1 held and was taken:** the name sits beside the question ("Peter Turchin · Does it hold up?"), not inside it.
- **Its hypothesis 2 (land with the h1 on screen instead) was not needed.** The name fits in the box at all four sizes, so the list links still land on the verdict itself.
- **Its hypothesis 3 held:** the result sentence is in `cycles/page.tsx`, not `VerdictTable`.

1. **Implementation.**
   - Commits on main:
     - `e5bd417`: the box label reads "<short name> · Does it hold up?" on both branches of the box (paired and unpaired); /cycles gains "None of the 9 paired theories can be tested yet. Each record below is shorter than the three full periods a test needs; here is how far short.", derived from `verdicts.json`; both box links get a 44px tap box; new check `scripts/check-verdict-landing.mjs`.
     - `4fe0aef`: Codex r1's three check gaps closed (below). Check-only.
   - One commit for the three edits, not the three my P1 packet promised: the label and the tap box are in the same file and I could not split them without interactive staging.
   - **The fold was the real constraint.** The first build wrapped the label at 320 wide and cut `/cycles/turchin` 5px below a 320x568 screen (12 of 13). Tightening the label's letter-spacing below 380px restored 13 of 13 with Turchin back at 12px. At 320 two labels still wrap (Schlesinger Jr. 35 → 18px spare, Kondratiev 92 → 76px). My P1 estimate that the name "may have to go somewhere other than the label line" was wrong for 8 of 10 and survivable for the other 2.
   - **Gates:** `verify-with-receipt -- npm test` → 124/124, exit 0, first on `e5bd4174` and again at HEAD `66e8040e` after the check fix and the docs commit. lint clean (whole repo on `e5bd417`; the check file alone on `4fe0aef`). typecheck clean. **CI: GREEN** for `4fe0aef` (`check-ci-status --workflow ci.yml --wait`, 1 success, 0 failures).
   - **Review — cross-family, Codex, read-only, foreground pipe, banner workdir checked = `C:\dev\skylark\sinusoidal-cycles`:**
     - **r1** on `6bf8e65..e5bd417` (head confirmed by the reviewer). No defect found in the pages, in the copy against `verdicts.json` (both branches), or in titles, meta, H1s, URLs and ids. Three P2 findings in the new check, all STATIC, all CONFIRMED against source and fixed in `4fe0aef`:
       - (1) The naming leg passed on a name with `visibility:hidden`. It now needs `checkVisibility`, a rect wholly inside the viewport, and the name on top at its own centre.
       - (2) The result leg accepted any paragraph opening "N of the M paired". It now needs the exact sentence the origin's own `/data/spectral/verdicts.json` implies, between the heading and the first row, and visible.
       - (3) The tap leg read a rounded bounding box. It now reads the unrounded height, the link's destination, and hit-tests both edges.
     - Noted, not changed: the box's `aria-label` is still the generic "Does this cycle hold up" (the reviewer: no regression; the `<h2>` now carries the name).
     - `4fe0aef` is check-only and had **no second review round**. It is proven by mutation instead.
   - **Proof the instrument fails** (portable rule 1), all on the local build of `e5bd417`:
     - Unmutated: **112/112**.
     - `--mutate hide-name`: **72/112**, exactly the 40 naming legs ("the name is in the box but hidden").
     - `--mutate wrong-sentence`: **104/112**, exactly the 8 sentence legs.
     - `--mutate dead-link`: **82/112**, exactly the 30 tap legs ("top edge misses · bottom edge misses").
     - Production before the deploy: **34/112**.
     - The mutations live in the script behind a flag; the tree was clean after each run.
   - **Sibling sweep** (pattern: a link whose target is a cycle page's `#does-it-hold-up`; roots: `src/`, `public/`, `scripts/`): `VerdictTable` phone list and desktop table (both on /cycles and /methods), and the nine rows of `public/methods.md`. All land on the same box, so all get the name. The /methods entry is not walked by the new check; the check's header says so.

2. **Delivery.**
   - Render deploy `4fe0aef1969d6ec8a97dc3789f4a89014b76c2d5` is **live**, finished 2026-10-02 07:20:46Z UTC (Render deploys API, srv-d7mcat7lk1mc73bidim0; `check-deployed-sha-drift` is NOT-APPLICABLE-BY-REGISTRY for this commit-triggered service). The wait was bounded at 15 minutes and ended on "observed live".
   - Production reads after the deploy:
     - `check-verdict-landing https://sinusoidalhistory.com --fails-only`: **112/112** (34/112 before), 10 of 10 landings name the cycle at each of the four sizes.
     - `check-entry-folds`: **13 of 13** at 390x664, 360x560 and 320x568. Thinnest legs unchanged: `/` 4px at 360x560, `/cycles/turchin` 12px at 360x560 and 320x568.
     - `check-verdict-reach`: **37/37**. `check-verdict-phone`: **316/316** (the same count as production before the change; my packet's "308" was the 09-30 number).
     - Visible text, production before vs after (line multiset), 3 of the 11 changed pages compared: /cycles +1 line (the result sentence); /cycles/kondratiev and /cycles/turchin-fathers-sons swap "Does it hold up?" for "<name>" and "· Does it hold up?"; nothing else. The other eight cycle pages were not diffed; they render the same component.
     - The W-001 freeze holds: no title, meta description, H1 or URL changed. The changed strings are logged in W-001's notes.

3. **Encounter:** blind. The site has no client analytics (a standing choice), so a reader landing on the box leaves no trace. The read is W-003's cold walk on 2026-10-03, which gains two questions: after opening a cycle from the list, "which cycle is this page about, and where does it say so?", and back at the list, "what did the list as a whole find?".

4. **Outcome:** open. No read yet.

USER-VISIBLE: opening a cycle from the /cycles verdict list now lands on a box that names it ("Kondratiev wave · Does it hold up?"), where before nothing on a phone screen said which of the ten cycles was open; the list itself now states "None of the 9 paired theories can be tested yet" above its rows; and the box's link forward is a 44px tap target (was 17px) — e5bd417 [proof: check-verdict-landing 34/112 → 112/112 on production after Render deploy 4fe0aef live 2026-10-02 07:20:46Z UTC, 10 of 10 landings name the cycle at 390x664, 360x560, 320x568 and 1440x900; entry folds 13 of 13 at all three phone sizes; verdict-reach 37/37] [coverage: none — no client analytics by standing choice · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader landing on the box leaves no trace · bug row W-003]

[red-armed: node scripts/check-verdict-landing.mjs https://sinusoidalhistory.com (production before the deploy) -> 34/112 FAIL — "names "Kondratiev wave" in its box, readable on screen — no text node in the box equals the tapped text" on all ten cycles at all four sizes; "the verdict list states its result" at all four sizes; "box link is ≥44px tall" 17.00px]

mechanism-verified: `node scripts/check-verdict-landing.mjs https://sinusoidalhistory.com --fails-only` (production, after the deploy) → `112/112 PASS`

codexCalls: 1 (one foreground `codex exec --sandbox read-only` review run, r1)
adversarialReviews: 1 — EXECUTED (Codex r1 on 6bf8e65..e5bd417: 0 defects in the pages, 3 P2 in the new check, all fixed in 4fe0aef; 4fe0aef check-only, proven by three mutations, no r2)
hygiene helper: DISPATCHED ~06:32Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-02.md PRESENT (0 disposition lines; inputs none). wait-justification `RESULT: PASS — 10 of 19`. engineering-zero `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable`. READ-MUTATED: none.
Ledger (all through `continuity-edit`):
- I-016 minted (monitoring to 2026-10-03): the problem, the fix, the review, the delivery numbers, closeWhen = 112/112 on production (met) plus W-003's answer.
- W-003: onTrigger gains the two questions above.
- W-001: notes gain the changed body strings and the ship's Search Console day bucket.
- I-015: notes say its two held walk findings shipped as I-016.
[standing-rules-hash: 88cc2dc9]

**What remains:** W-003's walk on 2026-10-03 is the encounter read. Not done today, on purpose: re-ordering the verdict rows to lead with the years short (I-012's order, read by W-003 question 8); walk finding 4 (keyboard focus after Back); the box's generic `aria-label`. Real iOS Safari is still unwalked. Nothing else is owed on this outcome today.

<!-- findings:begin -->
**P3 findings, 2026-10-02.**
1. The P1 packet's width estimate was wrong in the useful direction: the name fits the label line on 8 of 10 cycles at 320 wide once the letter-spacing tightens, and the two that wrap keep 18px and 76px of first-screen spare.
2. A check written from a measurement script inherits its looseness. All three of the first version's legs could pass on a broken page (hidden name, wrong sentence, dead link); the cross-family review found all three by reading, and each now has a mutation arm in the script.
3. `elementFromPoint` returns null below the fold, so a hit-test on a link the landing screen does not reach reads as "misses". The check scrolls the link into view first.
<!-- findings:end -->

---

## Close

ACTION: COMPLETED · item I-016 · P3 2df7ee10

**What shipped, in plain words:** opening a cycle from the /cycles verdict list now lands on a box that names it ("Kondratiev wave · Does it hold up?"). The list states "None of the 9 paired theories can be tested yet" above its rows, and the box's link forward is a 44px tap target. Live on Render since 2026-10-02 07:20:46Z UTC (`4fe0aef`).

**Acceptance correction (manager review f14f2b7d, item 1).** My P1 acceptance said `check-entry-folds` stays 13 of 13 "with every leg at 8px spare or more". That line was wrong, not the page:
- `scripts/check-entry-folds.mjs` has no 8px floor. A leg is OK when it is not cut.
- The 8px figure is a design rule that I-007 applied to the one leg it changed (`/cycles`).
- `/` has read 4px spare at 360x560 since `be29b3a` (2026-09-24); `docs/daily-config.md` records it. It read 4px on production today before this change and 4px after.
- The legs this change can move are the ten cycle pages. Their minimum is 12px (`/cycles/turchin`, unchanged), so the floor holds for every leg the change touches.
- So the action is COMPLETED on the acceptance as corrected: 13 of 13 at all three phone sizes, no leg lost spare that cut it, and every changed leg has 12px or more. `/` at 4px is thin, was not caused by this change, and is not I-016's.

**Changed since the P3 post (2df7ee10):**
- The manager review read the action as COMPLETED. It confirmed the three commits are on origin/main, read the diff, and read the new label and sentence in production's HTML. It did not re-run the four-size check or the mutation arms.
- Its item 2 (does "Each record below…" read as covering the tenth, unpaired row?) is not changed tonight. It is now a question in W-003's walk.
- CI for `66e8040e` (the docs commit): GREEN (`check-ci-status --workflow ci.yml`, 1 success, 0 failures).
- Waker rank 1 exited twice to wake the pane for queued rows and was relaunched alone each time. Not product work.

**Hygiene draft:** 0 lines, so nothing to accept, amend or reject (inputs: none).
- READ-MUTATED: none (0 reads guarded).
- check-wait-justification at the helper: `RESULT: PASS — 10 of 19`. Re-run at close, after I minted I-016 with its wait: `RESULT: PASS — 11 of 20 row(s) carry waitJustification; 0 warn / 0 info (exit 0)`.
- check-engineering-zero: `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable`. No lockfile changed today.

**Due gates:** `check-due-gates-dispositioned` returned `verdict: CLEAR — every gate due at Phase 0 was dispositioned.` The snapshot is CURRENT (taken 2026-10-02; 0 rows were due).

**Ledger delta (all through `continuity-edit`):**
- **I-016 minted, monitoring, nextEvaluation 2026-10-03.** At P3: the problem, the fix, the review, the delivery numbers. At P5: notes gained the acceptance correction above and the line that W-003's walk is N = 1 and synthetic, never to be quoted as a user encounter.
- **W-003:** onTrigger gained three questions today (two at P3, one at P5), quoted under Pending reads.
- **W-001:** notes gained the changed body strings and the ship's Search Console day (the 2026-10-02 Pacific bucket), so the 2026-10-07 read can attribute a move.
- **I-015:** notes say its two held walk findings shipped as I-016. Still monitoring to 2026-10-03.
- **I-013 unchanged.** Still David's decision, carried to 10-03.

**Pending reads.** W-003's cold walk on **2026-10-03** is the only encounter read I-016 has, and I-016 closes only on it. It is N = 1 and synthetic. The questions as they stand in the row:
- After opening a cycle from the verdict list, before scrolling or pressing Back: "which cycle is this page about, and where on the screen does it say so?" Pass: named from the box's label. Fail: they scrolled up to the H1, or could not say.
- Back at the list: "before reading the rows, what did the list as a whole find?" Pass: "none can be tested yet", from the sentence under the heading.
- "How many rows are below that sentence, and does it describe all of them?" Pass: the walker reads the tenth row as outside the nine. Fail: they read the sentence as covering all ten rows; then the copy changes.

The same walk is still the encounter read for I-008 through I-015, and for I-013. Real iOS Safari is unwalked.

**Receipt:** P3's line (2df7ee10) still holds. Nothing new.

**Recorded as it stands:** `4fe0aef` (check-only) had no second cross-family round; three mutation arms are its proof. The box's `aria-label` is still the generic "Does this cycle hold up". 3 of the 11 changed pages were text-diffed on production.

**UNRESOLVED:** none.

codexCalls: 1 (one foreground read-only Codex review run at P3; none at P5)
[standing-rules-hash: 88cc2dc9]

---

[P1 — Evidence and choice]

## ROUND 2 — P1 — Evidence and choice

**Outcome:** a phone reader can read the full spectral-verdict figure, and the /cycles sentence counts nine records instead of "each record below" over ten rows. **Item:** I-016 (monitoring). These are two of round 1's cold-walk findings on the change I-016 shipped. A follow-up row is minted through `continuity-edit` at P3.

**The user problem, in the reader's words:** "The link said 'the full verdict, the figure'. I tapped it and got a picture whose labels I can't read, and tapping the picture did nothing." Second: "It says 'each record below'. There are ten rows below. Is the last one a record too?"

### Section 0

- `git pull`: already up to date at `b712295`. Working tree clean.
- Listener: 🟢 SSE alive. The SessionStart hook relaunched it: pid 32944, SESSION START 15:20:24Z, hello 15:20:37Z, slug sinusoidal-cycles, replayed 0. Waker ranks 1-3 armed. Loop armed by `ScheduleWakeup` (`/loop-tick 2m`).
- Codex: **GREEN** (the probe line on this prompt: machine-level exec 2026-10-02T06:16:15Z, 9.1h old). Not used at P1. A cross-family review of the P3 diff is planned.
- CI: **GREEN** for `b71229538d` (`check-ci-status --workflow ci.yml`, 1 success, 0 failures, 0 pending).
- Deploy drift: `check-deployed-sha-drift --service sinusoidal-history` is NOT-APPLICABLE-BY-REGISTRY: the service deploys on every commit, so the checker declines to judge it. That is neither a pass nor a stop. Liveness comes from the first-action read below. The commits since `4fe0aef` (`66e8040`, `dc4da1c`, `b712295`) are docs-only.
- Primer first action: `check-verdict-landing https://sinusoidalhistory.com --fails-only` → **112/112 PASS**, 10 of 10 landings name the cycle at 390x664, 360x560, 320x568 and 1440x900 (Chromium, ~15:23Z). Round 1's ship holds.
- Harness: running 2.1.287 · fleet UNIFORM (27 of 27 panes) · installed 2.1.287 (SAME).
- Recs from round 1: no `## Recommendation` block in this report. Round 1's "What remains" list:
  - W-003's walk: carrying to its own date, 2026-10-03.
  - Re-ordering the verdict rows (I-012's order, W-003 question 8): carrying to 10-03. Not today.
  - Walk finding 4 (keyboard focus after Back) and the box's generic `aria-label`: carrying. Not selected.
  - Real iOS Safari: still unwalked.
- Cycle rotation: `check-cycle-rotation --lane sinusoidal-cycles` → exit 0, "no product-love cycle picks this lane today; run the normal P3".
- Due gates: snapshot re-taken, "IDENTICAL to the existing one", "0 gate(s) due on/before 2026-10-02" (20 ledger rows swept). Nothing was dropped.
- Board: `answered-cards --project sinusoidal-cycles` → no waiting, answered or pending-verify cards.

### Evidence

- OBSERVED (cold walk of round 1, skylark-site `docs/walks/2026-10-02-r1/sinusoidal-cycles.md`, finding 1). Setup: Chromium emulating iPhone 15 at 393x659 with touch. N = 1 walker; 3 cycles opened, 1 of them via the figure path (Kondratiev). The figure renders 353px wide. Every label inside it is too small to read: the title, axis years, "INSUFFICIENT SPAN" and "target: 54y". A tap on the figure does nothing: URL and scroll were unchanged. Below it, "FIGURE SVG ↓" is capitals and "Figure PNG ↓" is mixed case.
- OBSERVED (source): this is how the figure is built in the code, which is why a tap does nothing.
  - The figure is a bare `<img>` inside a `<figure>` with no link, at `src/app/(app)/cycles/[id]/page.tsx:522-534`.
  - The SVG has a `viewBox="0 0 900 500"` and no width or height. Its smallest text is 12 units, which renders at about 4.7 CSS px at 353 wide.
  - The case mismatch: "Figure SVG ↓" is an `<a>` and "Figure PNG ↓" is a `<button>` in one `uppercase` list (`src/components/ReusePacket.tsx:75-84`). The button does not pick up the list's uppercase. HYPOTHESIS: Tailwind preflight's `text-transform: none` on buttons is the cause. P3 reads the computed style.
- OBSERVED (cold walk, finding 2, both viewports): the sentence "None of the 9 paired theories can be tested yet. Each record below is shorter than…" sits above ten rows. The tenth, Turchin 50y, reads "Not tested — no paired series" and has no record. The page also states the result twice in different words: the intro says "0 of the 9 paired theories have a record long enough to check" and the list says "None of the 9 paired theories can be tested yet". The source is `src/app/(app)/cycles/page.tsx:357`, mirrored by `scripts/check-verdict-landing.mjs:69`.
- HYPOTHESIS (not measured): a standalone SVG with only a viewBox opens at the phone's width. It would then be the same size as inline, though zoomable as a vector. Measuring what a tap actually opens is P3's first step. If it opens at 393px with nothing gained, the fallback is a phone-only horizontal scroller that shows the figure at its native 900px width inline. Either way the tap must do something.
- MISSING: real-user evidence. The site has no client analytics (a standing choice). This repo has no `docs/evangelism-bar.md` or `docs/evangelism-evidence.md`. A synthetic walk is not a real-user encounter.
- MISSING: real iOS Safari. The walk is Chromium emulation.
- Not re-read: Search Console. W-001's read is dated 2026-10-07 and does not bear on this choice.
- My own 10-01 finding "the Back bug was not one link" bears on this. So P3 changes the figure on all nine paired cycle pages, which share one component, and checks Back from the opened figure.

### Permission, and the freeze

- This is lane-owned layout and copy on existing surfaces. No board card is open on it and no David decision is needed.
- **Spectral freeze:** the figures, `verdicts.json` and the manifest are not touched. Only the page markup around the `<img>` changes. The SVG bytes stay byte-identical, and the `--selftest` manifest is unaffected.
- **W-001 freeze (titles, meta, H1s, URLs, to 2026-10-07):** none of these change.
  - The /cycles sentence is body copy under an h2. Its change is logged in W-001's notes like round 1's.
  - The /cycles intro sentence is the first paragraph, which is snippet-adjacent. It is **left alone**, so the two wordings stay different for now. P3 also confirms the /cycles meta description is not derived from either sentence.
- I-013 (rising vs peaking) is David's decision and is not touched.
- W-003's question "does it describe all of them?" (minted at round 1's close) was answered by the round-1 walker, who read the sentence as covering the tenth row. That is the Fail branch, and the row says "then the copy changes". P3 re-points that question to the new sentence.

### Next action — improve

Two small edits on one trip:

1. **Selected:** the spectral figure on each of the nine paired cycle pages becomes a link to its own SVG, so a tap opens it full size and zoomable. It gets a visible "Tap to open full size" affordance on touch sizes, and the two download controls get the same case. If the opened SVG proves no more readable than inline, the phone-only scroller replaces the tap-out. The P3 measurement decides, not taste.
2. The /cycles result sentence counts the records ("Each of the 9 records below…") and says the tenth row has no paired record. The text is derived from `verdicts.json`, and `check-verdict-landing.mjs` is updated in the same commit.

First command, the red arm (prep only; it becomes a committed check leg at P3):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-verdict-landing.mjs https://sinusoidalhistory.com
```

The new figure leg is written into this check during prep. On production today it must read red: the tap leaves the URL unchanged on 9 of 9 paired pages at the three phone sizes.

### Acceptance

- At 390x664, 360x560 and 320x568, on 9 of 9 paired cycle pages:
  - Tapping the figure changes something a reader can use: either it navigates to `/data/spectral/<id>.svg` (200, `image/svg+xml`), or the inline figure renders at 900 CSS px in a scroller.
  - The figure's 12-unit labels render at **≥ 11 CSS px** where the reader lands, measured from the `<text>` bounding box.
  - Back from the opened SVG returns to the same scroll position.
  - **Red today:** the tap does nothing and the labels render at ~4.7px.
- "Figure SVG ↓" and "Figure PNG ↓" have the same computed `text-transform`. **Red today:** they differ.
- /cycles at all four sizes: the result sentence names the count of records, and the tenth row is not covered by "each record". `check-verdict-landing` stays 112/112 with the updated sentence. Its `--mutate wrong-sentence` arm still goes red.
- `check-entry-folds` stays 13 of 13 at the three phone sizes. No leg that is OK today may be cut. Cycle-page legs are at 12px or more today: the figure sits far below the first screen and the sentence is not on an entry fold.
- `check-verdict-reach` stays 37/37, and `check-verdict-phone` keeps its count (316/316 at round 1).
- The visible text of /cycles and one paired cycle page (production before vs after, line multiset) shows only the intended lines.
- No title, meta description, H1 or URL changes. No byte of `public/data/spectral/` changes.

### Delivery and encounter checks

- **Delivery** (at P3): when Render reports the new deploy, read its sha from the Render deploys API and run the extended `check-verdict-landing` against production.
- **Encounter:** W-003's cold walk on **2026-10-03**. It gains one question, asked after the walker follows "The full verdict, the figure and the protocol →" on a phone: "what is the target period on the figure, and what does the band over the record say?" Pass: the walker reads both from the figure.
  - There is no client analytics, so no event will appear at any traffic level. The walk (N = 1, synthetic) is the only encounter read.
  - Render request logs could show `/data/spectral/<id>.svg` fetched with a `text/html` Accept header, which is a tap-open rather than the inline `<img>` load. At the current traffic that is readable only in aggregate at the monthly `crawl-read`. It is noted, not promised.

**USER-FACING: yes.** Paths:
- User-facing: `src/app/(app)/cycles/[id]/page.tsx`, `src/components/ReusePacket.tsx`, `src/app/(app)/cycles/page.tsx`.
- Internal: `scripts/check-verdict-landing.mjs` (the root lint reaches it), `CHANGELOG.md`, `continuity/items.json` (via `continuity-edit`), `docs/daily/2026-10-02-prelaunch.md`.
- None of these pages has a markdown mirror. `public/llms.txt` states no figure or sentence text, and P3 re-checks it with Grep.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none**. Read: `check-due-gates-dispositioned --snapshot` ("0 gate(s) due on/before 2026-10-02", 20 rows swept).
- (b) Owed child rows: **none**. Read: the kickoff's "rows owed to you" (0 of 739).
- (c) Reads that crossed a threshold or could not be judged:
  - key numbers: there is no `docs/key-metrics.json` yet, so this is unjudged, not 0.
  - missingLinkedCommits: NOTHING SWEPT, 0 of 0 considered.
  - prior-day retro: 11 of 11 of my 10-01 findings are still on discipline, with no machine behind them.
  - deployed-sha-drift: NOT-APPLICABLE-BY-REGISTRY (commit-triggered service).

Exclude from any request-log read:
- The round-1 walk window, 2026-10-02T08:17:21Z-08:22:46Z.
- My own probes, 2026-10-02T15:22Z-15:28Z: `check-verdict-landing`, which made page loads of /cycles and the ten cycle pages at four sizes.

codexCalls: 0 (probe green; Codex is planned for the P3 diff review)

**Prep after the P1 post (f451262e). Nothing committed.** `tmp/measure-figure-tap.mjs` ran on production at ~15:35Z UTC, Chromium with iPhone 15 emulation, on /cycles/kondratiev only.

| Size | Inline figure | Tap on figure | SVG opened as its own page |
|---|---|---|---|
| 390x664 | 350px wide, 12-unit label ~4.7px | did nothing | 980px layout viewport, label 13 CSS px |
| 360x560 | 320px, ~4.3px | did nothing | same |
| 320x568 | 288px, ~3.8px | did nothing | same |

- The red arm is confirmed: the tap does nothing at all three sizes.
- **The HYPOTHESIS changes.** The opened SVG gets the browser's default 980px layout viewport and is zoomed out to fit the screen. A label measuring 13 CSS px therefore shows at about 5px on screen until the reader pinches. A tap-out buys pinch-zoom; it does not buy readable on arrival.
- So **the phone-only inline scroller is the likelier shape**: the figure at its native 900px inside an `overflow-x-auto`, where 12-unit labels show at 12px with no zoom.
- **Acceptance correction:** the "≥ 11 px" leg is measured in on-screen px (CSS px × visual-viewport scale), not CSS px. Measured that way, the tap-out reads ~5px and fails.
- P3 still decides by measurement.

---

[P3 — Product-work loop]

## ROUND 2 — P3 — Product-work loop

**Action (kind: improve):** I-017, minted today and following on from I-016. On a phone, the spectral-verdict figure that the box's link promises can now be read where the reader lands, and tapping it opens it on its own page. The /cycles result sentence now counts its nine records. The manager review (ce35aca9) REDIRECTED this change's acceptance:
- **Its premise correction held.** The smallest text in the SVG is 10 units ("54y", the axis ticks) and "target: Ny" is 11, not 12. My P1 packet was wrong; finding 1 below.
- **Its HYPOTHESIS held.** Opening a viewBox-only SVG on its own page fits it to the phone's screen, so a tap that opens it gains nothing by itself. My prep measurement agreed: the opened SVG got a 980px layout viewport and was zoomed out to fit.
- **Its SUGGESTION was taken.** On phones the figure is drawn at its native 900px inside a sideways scroller, with a visible cue line. Tap-to-open stays as the extra.

1. **Implementation.**
   - **Commits on main:**
     - `fc1ef40`: below 768px, the figure keeps 900px inside an `overflow-x-auto` region under the line "Swipe sideways for the whole figure · tap it to open it on its own". The figure is now a link to its own `/data/spectral/<id>.svg`. "Figure PNG ↓" is set uppercase on the button. /cycles reads "Each of the 9 records below… One cycle has no paired series, so there is nothing to test." (both counts derived). `check-verdict-landing` gains the figure legs.
     - `4b7d2a1` (Codex r1): five check gaps closed. One real page defect, found by the tightened check: Back reset the scroller's sideways position. The new `FigureScroller` keeps it in sessionStorage. The has/have agreement in the eligible branch is fixed, and so is the button-case explanation.
     - `d341757` (Codex r2 #3): the case leg reads the computed `text-transform` again. The ceiling is declared in the check's header.
   - **The page defect the review exposed.** Back from the opened SVG kept `scrollY` exactly but reset the figure's `scrollLeft` from 200 to 0 on **27 of 27** phone landings (local build, measured). The browser restores the page's scroll, not an inner scroller's. Fixed and re-read: 283/283.
   - **Gates:**
     - `verify-with-receipt -- npm test`: 124/124, exit 0, on `d341757`.
     - lint: clean on every changed file.
     - typecheck: clean.
     - CI: **GREEN** for `d341757` (`check-ci-status --workflow ci.yml --wait`, 1 success, 0 failures).
   - **Review: cross-family, Codex, read-only, foreground pipe, banner workdir checked = `C:\dev\skylark\sinusoidal-cycles` on both rounds.**
     - **r1** on `b712295..fc1ef40` (head confirmed by the reviewer). 0 defects in the page markup. 8 STATIC findings:
       - #1-#5 (P2, check gaps): CONFIRMED, fixed in `4b7d2a1`.
         - Size was judged by width alone.
         - The tap leg proved only a pathname.
         - The Back leg ignored the sideways position. This one was REAL on the page.
         - The case leg read computed style, not drawn text.
         - `dead-link` threw.
       - #6 (P3): Preflight was wrongly blamed for the button case (it has no `text-transform`). CONFIRMED, fixed in `4b7d2a1`.
       - #7 (P3): the "12 units" error in this report. CONFIRMED, corrected in the findings below.
       - #8 (P3): "1 of the 9 … have". CONFIRMED, pre-existing, unreachable today, fixed in `4b7d2a1`.
     - **r2** on `fc1ef40..4b7d2a1` (fresh aim: `FigureScroller`, the tightened legs). 0 defects in the component: hydration, storage, clamping and cleanup were all read clean. Three STATIC P2 findings on the check:
       - #3 (I had dropped the acceptance's computed `text-transform`): CONFIRMED, fixed in `d341757`.
       - #1 (an inner overflow ancestor can hide an outer `overflow:hidden`) and #2 (padding inside a 900x500 img box): CONFIRMED as possible. **Not patched.** They are the same class as r1 #1, geometric proxies fooled by contrived CSS. By the stop-patching rule, the second appearance is declared as a CEILING in the check header and not patched a third time. "Can read it" is proven by a person, at W-003's walk.
     - `d341757` is check-only and had no r3. It is proven by a mutation instead: `literal-case` turns exactly the 36 case legs red.
   - **Proof the instrument fails** (portable rule 1). All runs are on the local build of `4b7d2a1`/`d341757`, and the tree was clean after each:

     | Run | Result | Legs that went red |
     |---|---|---|
     | Unmutated | **283/283** | none |
     | `flat-figure` | 139/283 | 144 figure legs: size ×54, tap ×27, Back ×27, case ×36 |
     | `clip-figure` | 256/283 | the 27 reachability legs |
     | `lose-place` | 256/283 | the 27 Back legs |
     | `literal-case` | 247/283 | the 36 case legs |
     | `dead-link` | 118/175 | completes now; 30 tap-box legs plus 27 "box link reaches the figure" legs |
     | `wrong-sentence` | 275/283 | the 8 sentence legs |
     | `hide-name` | 243/283 | the 40 naming legs |

     Production before the deploy: **112/256** on the first version of the check. Every figure leg was red: labels at 3.2-3.9px, a tap did nothing, PNG in mixed case.
   - **Sibling sweep.**
     - Pattern: the spectral figure `<img src="/data/spectral/…">`, and the `FigureDownloads` control pair.
     - Roots: `src/`.
     - Hits: 1 figure site (`cycles/[id]/page.tsx`, shared by all nine paired pages) and 1 `FigureDownloads` use. /methods carries no spectral figure image.

2. **Delivery.**
   - Render deploy `d341757b0bb762d6408a18b6da1ca68aff1d5b0e` is **live**, finished **2026-10-02 17:09:14Z UTC** (Render deploys API, srv-d7mcat7lk1mc73bidim0). The wait was bounded at 15 minutes and ended on "observed live".
   - `check-deployed-sha-drift` is NOT-APPLICABLE-BY-REGISTRY for this commit-triggered service.
   - Production reads after the deploy:
     - `check-verdict-landing https://sinusoidalhistory.com --fails-only`: **283/283** (112/256 before). 10 of 10 landings name the cycle at all four sizes. On 9 of 9 paired pages at 390x664, 360x560 and 320x568: labels at 10px, "target:" at 11px, the figure reachable by swipe, a tap opens `image/svg+xml`, and Back keeps scrollY and scrollLeft.
     - `check-entry-folds`: **13 of 13** at 390x664, 360x560 and 320x568. `/` is 4px at 360x560 (unchanged since 09-24). `/cycles/turchin` is 12px at 360x560 and 320x568 (unchanged).
     - `check-verdict-reach`: **37/37**. `check-verdict-phone`: **316/316**.
     - Visible text, production before vs after (line multiset): /cycles swaps the one sentence; /cycles/kondratiev gains the one cue line; /cycles/turchin-fathers-sons is identical. Nothing else.
     - The W-001 freeze holds: no title, meta description, H1 or URL changed, and no byte under `public/data/spectral/` changed. The changed strings are logged in W-001's notes.

3. **Encounter:** blind. The site has no client analytics (a standing choice), so a reader swiping the figure leaves no trace. The read is W-003's cold walk on 2026-10-03, which gains the I-017 questions:
   - The figure: target period and band, read without pinch-zoom, then swipe, tap and Back.
   - The re-pointed "how many rows" question, now on the new copy.

4. **Outcome:** open. No read yet.

USER-VISIBLE: on a phone, the spectral-verdict figure on all nine paired cycle pages is now drawn at full size in a sideways scroller (its smallest labels at 10px, were 3.2-3.9px), a tap opens it on its own and Back returns to the same place, "Figure PNG" matches "FIGURE SVG", and /cycles says "Each of the 9 records below… One cycle has no paired series" instead of "each record below" over ten rows — fc1ef40 [proof: check-verdict-landing 112/256 → 283/283 on production after Render deploy d341757 live 2026-10-02 17:09:14Z UTC; entry folds 13 of 13 at all three phone sizes; verdict-reach 37/37; verdict-phone 316/316] [coverage: none — no client analytics by standing choice · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader on the figure leaves no trace · bug row W-003]

[red-armed: node scripts/check-verdict-landing.mjs https://sinusoidalhistory.com (production before the deploy) -> 112/256 FAIL — "figure's smallest labels render at ≥10px — 10-unit text at 3.9px (figure 350px wide)", "a tap on the figure opens it on its own — the tap did nothing", "download controls share one case — uppercase / none" on 9 of 9 paired pages at every touch size]

mechanism-verified: `node scripts/check-verdict-landing.mjs https://sinusoidalhistory.com --fails-only` (production, after the deploy) → `283/283 PASS`

codexCalls: 2 (two foreground `codex exec --sandbox read-only` review runs, r1 and r2)
adversarialReviews: 2 — EXECUTED (Codex r1 on b712295..fc1ef40: 0 page defects, 8 findings, 8 confirmed and acted on; r2 on fc1ef40..4b7d2a1: 0 component defects, 3 findings, #3 fixed in d341757, #1-#2 declared a ceiling under the stop-patching rule; d341757 check-only, proven by literal-case mutation, no r3)
hygiene helper: DISPATCHED ~15:40Z UTC · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-02-r2.md PRESENT (0 disposition lines; inputs none). wait-justification `RESULT: PASS — 11 of 20`. engineering-zero `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable`. READ-MUTATED: none. No production-shaped finding, so no status was posted.

**Ledger** (all through `continuity-edit`):
- **I-017** minted, monitoring to 2026-10-03, with the problem, the fix, both reviews, the mutation table and closeWhen = 283/283 on production (met) plus W-003's answers.
- **W-003:** onTrigger gains the I-017 figure question and the re-pointed rows question.
- **W-001:** notes gain the changed body strings and the ship's Search Console day (the 2026-10-02 Pacific bucket).

**What remains:**
- W-003's walk on 2026-10-03 is the encounter read for I-016 and I-017.
- Not done, on purpose:
  - The two check ceilings (r2 #1-#2).
  - The desktop figure: it still draws at the column's width, with 10-unit labels below 10px. Not measured today and not in this acceptance.
  - The /cycles intro sentence still words the result differently from the list ("0 of the 9 … have a record long enough to check"). It is the first paragraph, which Google can use as the search snippet, so it is left alone under the W-001 freeze to 10-07.
- Real iOS Safari is still unwalked.

<!-- findings:begin -->
**P3 findings, 2026-10-02 round 2.**
1. My P1 packet and the prep note said the figure's smallest text was 12 units. It is 10 (the axis ticks), with "target: Ny" at 11. The manager review caught it (ce35aca9), and so did Codex r1 #7. The "~4.7px" in the packet should read 3.9px for the 10-unit labels at 390 wide.
2. A tightened check found a page defect the first version could not see: the browser restores a page's scroll on Back but not an inner scroller's (scrollLeft 200 → 0, 27 of 27). Any sideways scroller this site adds needs its own restore.
3. Two review rounds found the same class in the figure check: geometric proxies that contrived CSS can fool. By the stop-patching rule I declared it a ceiling in the header rather than patching a third time. A check can show the figure is drawn at 900px; only a person can show it is readable.
<!-- findings:end -->

[standing-rules-hash: 88cc2dc9]

---

[P5 — Delta-only close]

## ROUND 2 — Close

ACTION: COMPLETED · item I-017 · P3 851e9c28

The manager review (fc7f695b) found the work COMPLETED against the redirected acceptance:
- **Acceptance:** `check-verdict-landing` reads 283/283 on production after Render deploy `d341757` (live 17:09:14Z UTC), up from 112/256.
- **What that covers:** on 9 of 9 paired pages at 390x664, 360x560 and 320x568, the 10-unit labels draw at 10px and "target:" at 11px; a tap opens the SVG; Back keeps scrollY and scrollLeft; the download pair shares one computed text-transform and one drawn case; and the /cycles sentence counts its records.

**Changed since the P3 post (851e9c28):**
- **The manager's restore HYPOTHESIS is now OBSERVED.** On production (~17:35Z UTC, Chromium, iPhone 15 390x664, /cycles/kondratiev; the script is in the untracked `tmp/`):
  - after swiping to 200, a fresh visit through the /cycles list reopens the figure at scrollLeft 200;
  - a typed URL in the same tab also reopens at 200;
  - a new tab opens at 0 (positive control).
  Rowed as **I-018**.
- **The desktop figure is now measured.** On production (~17:37Z UTC) it renders 704px wide at 768, 1024 and 1440, so the 10-unit labels draw at 7.8px and "target:" at 8.6px. Rowed as **I-019**.

**Hygiene draft:** 0 lines (0 accepted, 0 amended, 0 rejected; no inputs). READ-MUTATED: none (0 reads guarded).

| Check | When | Result |
|---|---|---|
| check-wait-justification | at the helper | `RESULT: PASS — 11 of 20` |
| check-wait-justification | re-run at close, after I minted I-017, I-018, I-019 | `RESULT: PASS — 12 of 23 row(s) carry waitJustification; 0 warn / 2 info (exit 0)` |
| check-engineering-zero | at the helper | `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable` |
| check-engineering-zero | re-run at close | same |

No lockfile changed today.

**Due gates:** `check-due-gates-dispositioned` → `verdict: CLEAR — every gate due at Phase 0 was dispositioned.` The snapshot is CURRENT (taken 2026-10-02; 0 rows due).

**Ledger delta** (all through `continuity-edit`):
- **I-017** was minted at P3, monitoring to 2026-10-03. At close its notes gained the review verdict and the two follow-ups.
- **I-018 minted, open, nextEvaluation 2026-10-03.** FigureScroller restores the sideways place on a fresh visit too (OBSERVED above). The fix and its check leg are in its onTrigger.
- **I-019 minted, open, nextEvaluation 2026-10-03.** The desktop figure's labels draw at 7.8px (OBSERVED above). The options and the check extension are in its onTrigger.
- **W-003**'s onTrigger gained the I-017 questions at P3. **W-001**'s notes gained round 2's changed strings at P3.

**Pending reads:**
- **2026-10-03: W-003's cold walk.** It is the encounter read for I-016 and I-017. It is N = 1 and synthetic, never to be quoted as a user. Its I-017 questions are:
  - on a phone, the figure's target period and band are read without pinch-zoom, then swipe, tap and Back;
  - the rows question, now on the new copy.
- **2026-10-07: W-001's Search Console read.** The freeze holds until then.

**Receipt:** P3's line (851e9c28) still holds. Nothing new.

**Recorded as it stands:**
- The two Codex r2 check ceilings are declared in the check's header, not fixed.
- Real iOS Safari is unwalked.
- The /cycles intro sentence is left alone under the freeze.

**UNRESOLVED:** none.

codexCalls: 2 (two foreground read-only Codex review runs at P3; none at P5)
[standing-rules-hash: 88cc2dc9]
