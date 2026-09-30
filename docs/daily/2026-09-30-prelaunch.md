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
