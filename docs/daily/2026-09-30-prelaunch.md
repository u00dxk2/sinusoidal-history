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
