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
   - **Gates:** `verify-with-receipt -- npm test` → 124/124, exit 0, receipt on `e5bd4174` (later paths are the check script, the changelog and docs). lint clean (whole repo on `e5bd417`; the check file alone on `4fe0aef`). typecheck clean. **CI: GREEN** for `4fe0aef` (`check-ci-status --workflow ci.yml --wait`, 1 success, 0 failures).
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
