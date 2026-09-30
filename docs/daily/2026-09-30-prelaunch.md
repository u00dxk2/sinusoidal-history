# sinusoidal-cycles — 2026-09-30 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** a reader on a phone sees each cycle's spectral verdict without a sideways swipe. **Item: I-012** (VerdictTable on /cycles and /methods).

**The user problem, in the reader's words:** "Does this cycle actually hold up?" On a phone, the table that answers it shows the name, period and record length, and the answer itself is off-screen behind a swipe that nothing announces.

### Section 0

- Primer: `docs/cold-starts/2026-09-30.md` read whole. Its first action ran: `check-state-phone.mjs https://sinusoidalhistory.com --year 2026` → **100/100 PASS** (round 3 holds on production).
- Listener: 🟢 SSE alive (hello 15:34:14Z, session start 15:20:09Z, slug sinusoidal-cycles) + loop armed by `ScheduleWakeup` (the Stop hook owns the interval).
- Codex: GREEN (the probe line on this prompt, 15:24:45Z).
- CI: `check-ci-status --workflow ci.yml` → **GREEN** for `33db2a0ccc8edd81275210d098e38a6c1eab33d0`.
- Deploy drift: `check-deployed-sha-drift --service sinusoidal-cycles` matches no service. That was my wrong name: daily-config line 81 already says so, and the service is `sinusoidal-history`, NOT-APPLICABLE-BY-REGISTRY. So I read the Render deploys API for `srv-d7mcat7lk1mc73bidim0` directly: the live deploy is `33db2a0ccc8edd81275210d098e38a6c1eab33d0`, finished 2026-09-29 23:41:22Z, and it **equals HEAD. There is no drift.**
- Harness: running 2.1.285 · fleet UNIFORM (27/27) · installed 2.1.285 (SAME).
- Recs yesterday (2026-09-29 round-3 close): mint I-012 → **executed** (row exists, due today, selected here); mint I-013 → **executed**, carried to 2026-10-03 (David decides, W-003 reads it first); W-003 walk → **carrying** to 2026-10-03.

### Evidence

- OBSERVED: I measured production with a scratchpad Playwright script, a mobile context with touch, on 2026-09-30 at ~15:50Z. It reads the column header rectangles against the scroller box.

  | Page | Viewport | Full | Partly cut | Hidden |
  |---|---|---|---|---|
  | /cycles | 393x659 | Cycle, Period, Record, Periods of 3.0 | Years short | **Verdict** |
  | /cycles | 320x568 | Cycle, Period, Record | Periods of 3.0 | Years short, **Verdict** |
  | /methods | 393x659 | Cycle, Period, Record, Periods of 3.0 | Years short | **Verdict** |
  | /methods | 320x568 | Cycle, Period, Record | Periods of 3.0 | Years short, **Verdict** |

  - The scroller is 353px wide client-side against 576px of scroll width at 393, and 280 or 288 against 576 at 320. The page itself does not scroll sideways (393 vs 393, 320 vs 320), so the only hint is the cut column. All 10 rows are present.
  - Population: the 2 pages at 2 phone sizes, 1 run. Limits: layout only; it does not read contrast or occlusion.
- OBSERVED: this is the third appearance of this table shape (J10 2026-08-24; I-011 2026-09-29, fixed by the stacked list in `50fe22f`, which reads 100/100 on production today).
- MISSING: any real-user evidence. The site has no client analytics (a standing choice). `docs/evangelism-bar.md` and `docs/evangelism-evidence.md` do not exist in this repo. `check-cycle-rotation --lane sinusoidal-cycles` → exit 0, "no product-love cycle picks this lane today".
- MISSING: page-level Search Console impressions for /cycles and /methods. I did not re-read them today, and the choice does not rest on a count, because the defect is on every phone view.
- HYPOTHESIS: a phone reader who reaches the table reads "Cycle · Period · Record · Periods" and never learns the verdict (PASS / insufficient record), which is the one thing the table exists to say.

### Permission

- I-012 is `open`, P2, and owned by this lane, with no card on it and no freeze covering it.
- W-001's freeze (to 2026-10-07) covers titles, meta, H1s and URLs, and this change touches none of them.
- It is display only: the rows read the frozen `verdicts.json`, so there is no spectral re-run and no manifest change (AGENTS.md's manifest rule is not engaged).
- Decision class: a lane-owned layout fix on an existing surface.

### Next action — improve

Write the check first, in `check-state-phone.mjs`'s shape (it reads every verdict row's decisive fields as visible, inside the viewport, with no sideways scroller, at 393x659 and 320x568, and the desktop table unchanged at 1440). Red-arm it against production:

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-verdict-phone.mjs https://sinusoidalhistory.com
```

Then build the I-011 pattern in `src/components/VerdictTable.tsx`: an `sm:hidden` stacked list and a `hidden sm:block` table over the same `VERDICT_ROWS` / `UNPAIRED` arrays. The table markup is unchanged.

### Acceptance

- `check-verdict-phone.mjs` is red on production before the deploy and green on production after it, at 393x659 (coarse pointer) and 320x568 on both /cycles and /methods: all 10 rows show the verdict state, period, record, periods of 3.0 and years short, visible and unclipped, with no sideways scroller. Links are ≥44px.
- At 1440 the table shows its 6 headers and 10 rows unchanged.
- I-012's `readCommand` is set to that check.
- `src/lib/spectral.test.ts` stays green, since it guards the `public/methods.md` mirror.

### Delivery and encounter checks

- **Delivery (planned, not yet run):** after the push, read the Render deploys API until the pushed sha shows, then run the check on production. I will also run a rendered-text line multiset built against production: VerdictTable is server-rendered, so the gate sees it, and the added lines should be the phone list only.
- **Encounter:** blind. There is no client analytics, so a reader leaves no trace. The encounter read is W-003's cold walk on 2026-10-03, which should gain a question: at 390 wide on /cycles, say without swiping which cycles have enough record to pass the test.

USER-FACING: yes. The paths: `src/components/VerdictTable.tsx` (served on /cycles and /methods), `scripts/check-verdict-phone.mjs` (new, internal), and `continuity/items.json` (I-012 readCommand, internal). `public/methods.md` needs no change (the rows are already a list in markdown).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none. Read: `dated gates due today` (1 of 1 due, I-012, which is selected). The morning snapshot `check-due-gates-dispositioned --snapshot` → "1 gate(s) due on/before 2026-09-30", exit 3 on I-012's missing readCommand, which this work sets.
- (b) Owed child rows (the orchestrator's ledger): none. Read: `rows owed to you in skylark-site's ledger`, 0 of 734.
- (c) State reads marked CROSSED: none. Read: the kickoff state block, where the stale-actionable read was 0 of 9, queued rows 0, and David's-word cards 0. The dated-gates threshold line is the owed-today notice for I-012 and is covered by (a).

mechanism-verified: `node scripts/check-state-phone.mjs https://sinusoidalhistory.com --year 2026` (production, 2026-09-30) → `100/100 PASS`; Render deploys API for srv-d7mcat7lk1mc73bidim0 → `live: live 33db2a0ccc8edd81275210d098e38a6c1eab33d0 finished 09/29/2026 23:41:22` = HEAD.

**Prep while holding for review (uncommitted):** `scripts/check-verdict-phone.mjs` is written. It holds the page against the served `/data/spectral/verdicts.json` and `/api/v1/cycles`.

[red-armed: node scripts/check-verdict-phone.mjs https://sinusoidalhistory.com (production, before any change) -> 18/62 FAIL — "no visible [data-verdict-id]" for all 9 verdicts plus the unpaired cycle, at both phone sizes, on both pages; "div.overflow-x-auto border-t border-rule/30" is the only sideways scroller on each page; the 1440 legs PASS]

Note: all 9 primary verdicts read INSUFFICIENT_DATA, so the check's "long enough" branch (an eligible row) has no live case today.

Prior-day retro finding that recurred and bears on the choice: "asserting a fact I had not measured". I passed `--service sinusoidal-cycles` to the drift check, a name I remembered, although daily-config line 81 records that it matches nothing. The read was redone against the Render API.

## P3 — Product-work loop

[P3 — Product-work loop]

**Action (kind: improve):** I-012. On a phone, /cycles and /methods now answer "does this cycle hold up?" in a stacked list, with no sideways swipe. Each entry leads with the verdict in words ("Insufficient data — no test possible · needs 18 more years"), then shows period, record and periods of 3.0. From 640px up, the table is unchanged. The manager review (b03aa5ea) APPROVED this. I took its suggestion to use `SPECTRAL_STATE_LABELS` rather than the raw code, and its two corrections stand: no state is called "PASS", and the /state list shipped in `b216a6c`.

1. **Implementation.**
   - Commits on main:
     - `2426658`: the list, the check, I-012's readCommand.
     - `da776d2`: Codex round-1 fixes.
     - `2784e10`: Codex round-2 fixes.
   - `npm test` 124/124 via verify-with-receipt at `2784e10`. Lint on both files is clean, and `npm run typecheck` is clean.
   - Review, two rounds, each a foreground `codex exec --sandbox read-only` with the banner workdir `C:\dev\skylark\sinusoidal-cycles` checked:
     - **Round 1 (HEAD 2426658):** 4 findings, all STATIC and all CONFIRMED.
       - (1) The check did not verify each entry's visible link name or href. Fixed in `da776d2`.
       - (2) The unpaired entry was checked only by a "Not tested" prefix. Fixed in `da776d2`.
       - (3) The 1440 legs read only the state column. Fixed in `da776d2`.
       - (4) The `<ol>` lacked `role="list"` (Safari). Fixed in `da776d2`.
     - **Round 2 (HEAD da776d2):** 2 findings, STATIC and CONFIRMED.
       - (1) A phone link clipped inside its own box kept its full textContent. Fixed in `2784e10`.
       - (2) A hidden desktop link sat in a visible td. Fixed in `2784e10`.
     - The `2784e10` delta (11 lines, check only) was not given a third round. It was proven against the reviewer's own two failure scenarios instead (see below).
   - Proof that the check fails (targeted mutations on a local build, restored after each):
     - Round-1 legs: every phone link named for the first cycle, the unpaired period +1, and every desktop record +1 → **254/308**. Exactly those 54 legs failed. Restored → 308/308.
     - Round-2 legs: phone links `w-px overflow-hidden whitespace-nowrap` and desktop links `invisible` → **254/308** (36 phone link legs + 18 desktop row legs, nothing else). Clean build → 308/308.
   - Visual check at the extremes: 320x568 in light and dark, and 393x659. No clipping, and the verdict leads.
   - Sibling sweep:
     - Search: `overflow-x-auto|min-w-\[` over `src`. It finds 5 `overflow-x-auto` roots:
       - Poster and the embed-docs `<pre>` scroll on purpose.
       - /state and VerdictTable are now `hidden sm:block` on phones.
     - The two `min-w-[12rem]` hits (cycles/[id] `<dd>`) are flex-wrap, not scrollers.
     - Remaining hits: **0**.
2. **Delivery.**
   - Render deploy `2784e109eddae6333a68e0dbec6eb8ad766288b2` is **live**, finished 2026-09-30 16:35:49Z (read from the Render deploys API for srv-d7mcat7lk1mc73bidim0). `check-deployed-sha-drift` is NOT-APPLICABLE-BY-REGISTRY for this service, per daily-config.
   - CI: `check-ci-status --workflow ci.yml` → **GREEN** for `2784e109ed`.
   - Production reads after the deploy:
     - `check-verdict-phone.mjs https://sinusoidalhistory.com`: **308/308 PASS** (36/80 before).
     - Line multiset, production before vs after: /cycles 226 → 311 lines and /methods 223 → 308, **0 lost** on each. The +85 on each page is the phone list only.
     - `check-state-phone --year 2026` still reads **100/100**.
     - The W-001 freeze holds: no title, meta, H1 or URL was touched.
3. **Encounter:** blind. The site has no client analytics (a standing choice), so a reader leaves no trace. The encounter read is W-003's cold walk on 2026-10-03, which now carries an **eighth question** (I-012): at 390 wide on /cycles, say without a sideways swipe whether any cycle's record passes the test, and how many more years Kondratiev's needs.
4. **Outcome:** open. No read yet.

USER-VISIBLE: on a phone, /cycles and /methods now list each cycle's spectral verdict in words ("Insufficient data — no test possible · needs 18 more years") with period, record and periods beneath — no sideways swipe; before, the table's Verdict column sat wholly off-screen at 393 and 320 and "Years short" was cut — 2784e10 [proof: check-verdict-phone 36/80 → 308/308 on production after Render deploy 2784e10 live 2026-09-30 16:35:49Z; every verdict, period, record, periods and shortfall equal to the served verdicts.json at 393x659 (coarse pointer) and 320x568 on both pages; rendered-text multiset production before vs after 0 lines lost on /cycles and /methods] [coverage: none — no client analytics by standing choice · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader who views /cycles or /methods leaves no trace · bug row W-003]

[red-armed: node scripts/check-verdict-phone.mjs https://sinusoidalhistory.com (production, before the deploy) -> 36/80 FAIL — "no visible [data-verdict-id]" for all 10 cycles at both phone widths on both pages, "div.overflow-x-auto border-t border-rule/30" sideways scroller]

mechanism-verified: `node scripts/check-verdict-phone.mjs https://sinusoidalhistory.com` (production, after the deploy) → `308/308 PASS`

codexCalls: 2 (two read-only review rounds; probe GREEN 15:24:45Z)
adversarialReviews: 2 — EXECUTED (foreground codex exec --sandbox read-only; round 1 HEAD 2426658, 4 findings fixed in da776d2; round 2 HEAD da776d2, 2 findings fixed in 2784e10, whose 11-line delta was proven by mutation rather than a third round)
hygiene helper: DISPATCHED ~16:05Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-09-30.md PRESENT. Inputs: none. wait-justification `RESULT: PASS — 7 of 17`. engineering-zero `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable`. READ-MUTATED: none.
Ledger (all through `continuity-edit`):
- I-012 → **monitoring**, nextEvaluation 2026-10-03, with a waitJustification until then. Its closeWhen is now the W-003 encounter; the first condition (the production phone check) was met today. readCommand = check-verdict-phone. linkedCommits: 2426658, da776d2, 2784e10.
- W-003's onTrigger gained its eighth question.
[standing-rules-hash: 88cc2dc9]

**What remains:** W-003's walk on 2026-10-03 is I-012's encounter read (as it is for I-007 through I-011). I-013 (phase-band wording) is still David's decision and still carried to 10-03. Nothing else is owed on this outcome today.

<!-- findings:begin -->
**P3 findings, 2026-09-30.**
1. The review's HYPOTHESIS held: the raw codes read badly. The phone list prints `SPECTRAL_STATE_LABELS`. The desktop table still prints the raw code (`INSUFFICIENT_DATA`), as the acceptance required. Making that match would be a separate, desktop-visible change.
2. Two Codex rounds each found blind spots in the new check, not in the page. The classes differed: identity and coverage in round 1, visibility in round 2. Both were fixed and mutation-proven. If a third round finds another blind spot, the stop-patching rule says the check should name it rather than grow a leg.
3. This was the third appearance of the wide-table-in-a-scroller shape (J10, I-011, I-012). After it, the sibling sweep reads 0 unintended scrollers in `src`.
<!-- findings:end -->

## Close

[P5 — Delta-only close]

ACTION: COMPLETED · item I-012 · P3 d142d858

**What shipped, in plain words:** on a phone, /cycles and /methods show each cycle's spectral verdict in words ("Insufficient data — no test possible · needs 18 more years"), with period, record and periods of 3.0 beneath it and no sideways swipe. From 640px up, the table is unchanged.

**Changed since the P3 post:**
- The manager review (a876efff) read the action as COMPLETED with 0 defects. It also OBSERVED 10 `data-verdict-id` entries served on each page.
- The review's one HYPOTHESIS was that the `hidden sm:block` table might still scroll sideways between 640 and 768 with Verdict last. It is **REFUTED on production**: at 640x800 the scroller is client 576 / scroll 576 and all six columns, Verdict included, are FULL. 700x800 and 768x1024 are the same, on both /cycles and /methods (scratchpad `measure-verdict.mjs`, 2026-09-30 ~16:55Z). Nothing is owed.

**Hygiene draft:** 0 lines, with nothing to accept, amend or reject (inputs: none).
- READ-MUTATED: none (0 reads guarded).
- check-wait-justification: `RESULT: PASS — 7 of 17` at the helper. Re-run after I-012's new wait: `RESULT: PASS — 8 of 17 row(s) carry waitJustification; 0 warn / 0 info (exit 0)`.
- check-engineering-zero: `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable` (covers Sentry and Dependabot). No lockfile changed today.

**Due gates:** `check-due-gates-dispositioned` → `verdict: CLEAR — every gate due at Phase 0 was dispositioned.` The snapshot is CURRENT (taken 2026-09-30). The one row, I-012, was re-dated to 2026-10-03.

**Ledger delta (all through `continuity-edit`):**
- **I-012 → monitoring** (at P3): nextEvaluation 2026-10-03, with a waitJustification until then.
  - Its closeWhen is now W-003's encounter; the first condition was met on production today.
  - readCommand is check-verdict-phone. linkedCommits: 2426658, da776d2, 2784e10.
  - Its notes gained the 640-768 read and the delivery read (at P5).
- **W-003**: its onTrigger gained an eighth question (at P3).
- **I-013 unchanged**, and no board card filed on purpose. Its own closeWhen says the card goes up only if W-003's walk shows a reader tripping on rising vs peaking. Until then nothing is waiting on David, and the lane's recommendation (no band change for 2026) stays in the row's notes.

**Pending reads:** W-003's cold walk on **2026-10-03** is the encounter read for I-012 (eighth question: at 390 wide on /cycles, does any record pass, and how many more years does Kondratiev's need), and also for I-007 through I-011 and I-013.

**Receipt:** P3's line (d142d858) still holds. Nothing new.

codexCalls: 2 (the two P3 review rounds; none at P5)

## Round 2 — P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** a reader on a tablet or desktop sees each cycle's spectral verdict in words, the same words a phone shows. **Item:** no row yet. I-014 is minted at P3 through `continuity-edit` (the source is the cold walk, skylark-site `e57fa3eff`).

**The user problem, in the reader's words:** "Does this cycle hold up?" From 640px up, the table's Verdict column answers `INSUFFICIENT_DATA`, a code. A phone reader of the same page gets "Insufficient data — no test possible · needs 18 more years".

### Section 0 (delta from round 1)

- Primer banner unchanged, and round 1's P1 already ran its first action.
- Listener: 🟢 relaunched by the SessionStart hook, pid 44224. SESSION START is 20:34:56Z, hello 20:35:01Z, slug sinusoidal-cycles, replayed 0. The waker ladder has ranks 1-3 armed, and the loop is armed by `ScheduleWakeup`.
- Codex: GREEN (the probe line on this prompt, 15:24:45Z).
- CI: GREEN for `22cebe1d` (kickoff read). `git pull` found it already up to date.
- Deploy: `2784e10` has been live since 16:35:49Z (round 1). Everything after it is docs-only, so production serves today's code.

### Evidence

- OBSERVED: the cold walk (skylark-site `docs/walks/2026-09-30/sinusoidal-cycles.md`, finding 1), at 700px and 1440, 2026-09-30 ~20:10Z. The Verdict column shows the raw code on /cycles and /methods, and the phone list shows the label. Population: 2 pages, 1 walker, 1 window. Limits: desktop Chrome only, with no touch tablet emulated.
- OBSERVED (reproduced here): `src/components/VerdictTable.tsx:136` prints `{v.state}` in the table, while `:41` prints `SPECTRAL_STATE_LABELS[v.state]` in the list. All 9 primary rows are `INSUFFICIENT_DATA`, so every desktop Verdict cell carries the code.
- OBSERVED: `public/methods.md:148-156` mirrors the table with the raw code, and `src/lib/spectral.test.ts:20` pins the mirror to `v.state`. The mirror has to move with the table, per AGENTS.md's prose-mirror rule.
- OBSERVED: /methods prose (`page.tsx:301-310`, `methods.md:163`) names the four states by code. After the change the table says the words and the prose still names the codes. HYPOTHESIS: that is acceptable (the prose defines the states for a technical reader), but P3 checks whether one sentence should join a code to its words.
- MISSING: real-user evidence. There is no client analytics (a standing choice), and `docs/evangelism-bar.md` and `docs/evangelism-evidence.md` do not exist. `check-cycle-rotation --lane sinusoidal-cycles` → exit 0, "no product-love cycle picks this lane today".
- NOT SELECTED: walk finding 2 (on a phone the verdict list is ~3,170px down /cycles) and finding 3 (phone names don't look like links). Both are HYPOTHESIS fixes. Finding 2 touches the page's top, and W-003's eighth question on 10-03 is the read that tells whether a reader misses the list. I am holding it for that read rather than guessing.

### Permission

- No row, no card, and no freeze covers it. W-001's freeze (to 2026-10-07) covers titles, meta, H1s and URLs, none of which this touches.
- It is display only: it reads the frozen `verdicts.json`, so there is no spectral re-run and no manifest change.
- Decision class: a lane-owned copy and consistency fix on an existing surface.

### Next action — improve

The check is already red-armed (below). The build: in `VerdictTable.tsx`'s table, print `SPECTRAL_STATE_LABELS[v.state]` in the Verdict cell, in body type instead of mono uppercase. Then move `public/methods.md`'s Verdict column and `spectral.test.ts`'s mirror expectation to the label in the same commit. The first command after review:

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-verdict-phone.mjs http://localhost:3000
```

### Acceptance

- `check-verdict-phone.mjs` goes from 290/308 on production (the 18 desktop row legs failing on the Verdict cell) to 308/308 on production after the deploy.
- The rendered-text line multiset, production before vs after, on /cycles and /methods: exactly the 9 `INSUFFICIENT_DATA` table lines per page become the label, and nothing else moves. VerdictTable is server-rendered, so the gate sees it.
- The table does not grow a sideways scroller at 640, 700 or 768 (the label is longer than the code). The check reads 640 only indirectly, so I measure it with the round-1 scratchpad `measure-verdict.mjs` shape.
- `npm test` green, including `spectral.test.ts` on the updated mirror.

### Delivery and encounter checks

- **Delivery:** once the push lands, read the Render deploys API for srv-d7mcat7lk1mc73bidim0 until the sha is live, then run the check and the multiset on production.
- **Encounter:** blind (no client analytics). W-003's cold walk on 2026-10-03 is the read. Its eighth question covers /cycles at 390, and P3 adds a clause for a ≥640 read of the same answer.

USER-FACING: yes. The paths: `src/components/VerdictTable.tsx` (served on /cycles and /methods), `public/methods.md` (served to crawlers and agents), `src/lib/spectral.test.ts` (internal), `scripts/check-verdict-phone.mjs` (internal), and `continuity/items.json` (I-014 mint, internal).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none. Read: `dated gates due today`. `check-due-gates-dispositioned --print` → "0 gate(s) due on/before 2026-09-30". The morning snapshot is round 1's and was not retaken.
- (b) Owed child rows (the orchestrator's ledger): none. Read: `rows owed to you in skylark-site's ledger`, 0 of 739.
- (c) State reads marked CROSSED: none. Read: the kickoff state block. Stale-actionable was 0 of 9, queued rows 0, and David's-word cards 0 (`answered-cards --project sinusoidal-cycles` → none).

**Prep while holding for review (uncommitted):** `scripts/check-verdict-phone.mjs` now expects the label in each desktop Verdict cell (the comment and the `cells` array).

[red-armed: node scripts/check-verdict-phone.mjs https://sinusoidalhistory.com (production, before any change) -> 290/308 FAIL — exactly the 18 "1440: row N" legs (9 verdict rows × /cycles, /methods), each showing "| INSUFFICIENT_DATA" where the label is expected; every phone leg and both unpaired rows PASS]

mechanism-verified: `node scripts/check-verdict-phone.mjs https://sinusoidalhistory.com` (production, 2026-09-30 ~21:05Z, check edited to expect the label) → `290/308 FAIL`, and the 18 failing legs are the desktop Verdict cells reading `INSUFFICIENT_DATA`. The delivery line above is a plan, not a claim that anything new is live.

Prior-day retro finding that bears on the choice: "asserting a fact I had not measured". Every count above is from a command run this round (the red-arm, the greps). The 640-768 fit of the longer label is written as unmeasured until P3.

## Round 2 — P3 — Product-work loop

[P3 — Product-work loop]

**Action (kind: improve):** I-014. From 640px up, the verdict table on /cycles and /methods says each verdict in words ("Insufficient data — no test possible"), the same words a phone shows, instead of the raw code `INSUFFICIENT_DATA`. The manager review (072df77b) APPROVED this, and I took both of its SUGGESTIONS: the /methods prose now joins each of the four state codes to its words, and the label wraps inside its cell. Its HYPOTHESIS was that a nowrap label would bring the scroller back. I did not test nowrap. The label as shipped wraps, and I measured the result directly.

1. **Implementation.**
   - Commits on main:
     - `033c1c4`: the table cell, the `methods.md` mirror and prose, the mirror test, the check's desktop legs, and the I-014 mint.
     - `b1bfd0e`: Codex round-3 fix to the check, plus the sibling fix.
   - Gates at `b1bfd0e`: `npm test` 124/124 via verify-with-receipt, typecheck clean, lint clean on every touched file.
   - Review: two foreground `codex exec --sandbox read-only` runs, each with the banner workdir `C:\dev\skylark\sinusoidal-cycles` checked.
     - **Round 1 (HEAD 033c1c4):** 2 findings, both STATIC and CONFIRMED. Both are check blind spots, not page defects.
       - (1) The 640-768 band was never read.
       - (2) A cell clipped behind the table's own scroller still passed at 1440.
       - Fixed in `b1bfd0e` by ONE stated rule rather than more per-cell legs: at 640, 700, 768 and 1440 the table is shown and neither its scroller nor the page scrolls sideways. This was the third round to find a blind spot in this check, and the stop-patching rule applies.
       - REPRODUCED by Codex: the /methods paragraph matches its mirror word for word (247 words).
     - **Round 2 (HEAD b1bfd0e):** no actionable findings. It confirmed the rule closes both findings for this DOM.
       - Its scope note: the rule proves no horizontal overflow, not every cell's visibility at tablet widths. That limit is now named in the check's NOT-seen header and in I-014's notes.
   - Proof that the checks fail:
     - Mirror test, with `methods.md` put back to the codes: 1 of 2 fails. Restored: 2/2.
     - Check, with the table forced to `min-w-[60rem]`: **308/316**, exactly the 8 new legs. Every old 1440 row leg still PASSED, which confirms round-1 finding 2 was real. Clean build: 316/316.
   - Visual check at the extremes: 640 light (the label wraps to two lines, 64px rows) and 1440 dark (one line).
   - Sibling sweep:
     - Pattern `\.state\b|SPECTRAL_STATE_LABELS` over `src/**/*.{ts,tsx}`.
     - Every reader-facing render already uses the label, except `cycles/[id]/page.tsx:514`. Its note opened "INSUFFICIENT_DATA is an eligibility outcome" directly under a verdict line in words. Fixed in `b1bfd0e` to "“Insufficient data” is…" (9 cycle pages; production /cycles/kondratiev now has 0 raw codes).
     - Left on purpose: `llms.txt:24` (machine readers), `spectral.source.md` (provenance), and the /methods prose, which now defines each code with its words.
2. **Delivery.**
   - Render deploy `b1bfd0e6c6ad4a3953be76c0a140a3f827458e68` is **live**, finished 2026-09-30 21:38:36Z (Render deploys API for srv-d7mcat7lk1mc73bidim0). `check-deployed-sha-drift` is NOT-APPLICABLE-BY-REGISTRY for this service, per daily-config.
   - CI: `check-ci-status --workflow ci.yml` → `RESULT: PASS — GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending`.
   - Production reads after the deploy:
     - `check-verdict-phone.mjs https://sinusoidalhistory.com` → **316/316 PASS**. Before: 290/308, with the 18 desktop Verdict legs reading `INSUFFICIENT_DATA`.
     - Line multiset, production before vs after: /cycles 311 → 311, 9 lines changed (code → words); /methods 308 → 308, 10 changed (the 9 cells plus the states paragraph). **0 other lines moved.**
     - The W-001 freeze holds: no title, meta, H1 or URL was touched.
3. **Encounter:** blind. There is no client analytics (a standing choice), so a reader leaves no trace. The encounter read is W-003's cold walk on 2026-10-03, whose onTrigger now carries an I-014 question: at 640 or wider, is the verdict in words, and does anything need a sideways scroll?
4. **Outcome:** open. No read yet.

USER-VISIBLE: on tablets and desktops (640px and up), the spectral verdict table on /cycles and /methods now says each verdict in words ("Insufficient data — no test possible"), the same words phones show, instead of the raw code INSUFFICIENT_DATA; each cycle page's note under its verdict says "Insufficient data" too — b1bfd0e [proof: check-verdict-phone 290/308 → 316/316 on production after Render deploy b1bfd0e live 2026-09-30 21:38:36Z, every desktop Verdict cell equal to the reader label and no sideways scroll at 640/700/768/1440 on both pages; rendered-text multiset production before vs after: 9 lines on /cycles and 10 on /methods changed from code to words, 0 other lines moved] [coverage: none — no client analytics by standing choice · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader who views /cycles or /methods leaves no trace · bug row W-003]

[red-armed: node scripts/check-verdict-phone.mjs http://localhost:3100 (local build with the verdict table forced to min-w-[60rem]) -> 308/316 FAIL — the 8 "<page> <width>: table shown, no sideways scroll" legs, e.g. "scroller 576/960" at 640, while every 1440 row leg passed]

mechanism-verified: `node scripts/check-verdict-phone.mjs https://sinusoidalhistory.com` (production, after the deploy) → `316/316 PASS`

codexCalls: 2 (two read-only review rounds, 033c1c4 and b1bfd0e; probe GREEN 15:24:45Z)
adversarialReviews: 2 — EXECUTED (foreground codex exec --sandbox read-only; round 1 HEAD 033c1c4, 2 findings fixed in b1bfd0e by one stated rule; round 2 HEAD b1bfd0e, no actionable findings, scope note named in the check header)
hygiene helper: DISPATCHED ~21:17Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-09-30.md PRESENT (round-2 section, 0 lines). Inputs: none. wait-justification `RESULT: PASS — 8 of 17` at the helper (now `9 of 18` after I-014's wait). engineering-zero `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable`. READ-MUTATED: none.
Ledger (all through `continuity-edit`):
- I-014 minted, then → **monitoring**: nextEvaluation 2026-10-03, with a waitJustification until then. readCommand = check-verdict-phone. linkedCommits: 033c1c4, b1bfd0e. Its closeWhen's first half (316/316 on production) is met; the second half is W-003's walk.
- W-003's onTrigger gained the I-014 question.
[standing-rules-hash: 88cc2dc9]

**What remains:** W-003's walk on 2026-10-03 is I-014's encounter read (and I-007 through I-013's). The cold walk's findings 2 (on a phone the verdict list sits ~3,170px down /cycles) and 3 (phone names don't look like links) are NOT worked. Both are HYPOTHESIS fixes that W-003's eighth question tests first. Nothing else is owed on this outcome today.

<!-- findings:begin -->
**Round-2 P3 findings, 2026-09-30.**
1. The check's third blind spot in three review rounds (identity, then visibility, then width band) was answered by a stated rule, not a new leg. The rule's own limit (per-cell visibility at tablet widths) is named, not closed.
2. The sibling sweep found one reader-facing raw code the walk had not reported (the cycle-page note), on 9 pages.
<!-- findings:end -->