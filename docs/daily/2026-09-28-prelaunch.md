# sinusoidal-cycles — 2026-09-28

## P1 — Evidence and choice

**Outcome:** raise the `/cycles` entry descriptions on phones from 14px to 15px, the same floor every other entry page's body text meets. Item: **I-007**.
**The problem, as a reader has it:** "I'm scanning the list of ten cycles on my phone, and the line that tells me what each one *is* is the smallest text on the page."

### Section 0

- Primer: `docs/cold-starts/2026-09-28.md` read. First action run: `check-confidence-tag-taps.mjs` on production **7/7 PASS** (15:1xZ).
- Listener: 🟢 SSE alive (hello 15:09:38Z, replay 0) + loop armed by `ScheduleWakeup`; waker ladder ranks 1-3 running.
- Codex: GREEN (the `[codex-probe:]` line on this kickoff, 15:13Z). No dispatch planned: the change is a one-class edit in warm context.
- CI: `check-ci-status --workflow ci.yml` → **GREEN** on 3097366 (full sha, local HEAD).
- Deployed drift: `check-deployed-sha-drift --service sinusoidal-history` → NOT-APPLICABLE-BY-REGISTRY (a commit-trigger service). Read directly from the Render deploys API instead: **3097366 live** (finished 2026-09-27 17:04:41Z) = HEAD. No drift.
- Harness: running 2.1.283 · fleet UNIFORM (27/27) · installed 2.1.283 (SAME).
- Recs yesterday: the 2026-09-27 report's close carried W-003, I-006 and I-007 to 2026-10-03, and all three are still open. This packet takes I-007 early. W-003 stays dated (it is a cold walk and needs the surface settled). I-006 stays dated.
- North star: product-love. This is a readability change on the page a reader uses to choose a cycle. Nothing on this site can measure its effect (no client analytics, by standing choice), so it ships and is reported as unmeasured.

### Evidence

- OBSERVED: `src/app/(app)/cycles/page.tsx:274` has `text-[14px] sm:text-[15px]` on the description `<p>`. Source read, 2026-09-28.
- OBSERVED: `check-entry-folds.mjs --width 320 --height 568` on production, 2026-09-28 ~15:3xZ. `/cycles` has **30px spare**, and 13 of 13 entry pages answer. /cycles at 360x560 (69px) and 390x664 (188px) come from the 2026-09-26 read in I-007 and have not been re-read today.
- OBSERVED: the finding came from the Codex adversarial review of 4c1228e (2026-09-26). It is a judgement about text size, not a report from a real user.
- MISSING: any real-user evidence about /cycles readability. There are no analytics, `check-cycle-rotation` exits 2 (UNDETERMINED, because no real-user-evidence artifact is on record for this lane), and `docs/evangelism-bar.md` / `docs/evangelism-evidence.md` do not exist in this repo.
- HYPOTHESIS: at 15px each description wraps to more lines, so on a narrow phone the first description gets taller and could push the `/cycles` answer below the fold. Ten descriptions × a possible extra line each is the fold risk that `check-entry-folds` measures.

### Permission

I-007 is `open`, owner this lane, and its `waitingFor` reads "Nothing and nobody". It is this lane's own file and its own call, and no board card is open on it. The W-001 freeze (until 2026-10-07) covers titles, meta, H1 text and URLs. A body-text size change is outside it.

### Next action: improve

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs --width 360 --height 560
```

Then change `text-[14px]` to `text-[15px]` on `cycles/page.tsx:274`, keeping the `sm:` twin. Build with `next build` + `next start` (never `next dev`) and run `check-entry-folds` against the local build at 320x568, 360x560 and 390x664.

### Acceptance

I-007 closeWhen (a): below `sm`, the descriptions compute to 15px, and `check-entry-folds` reads 13 of 13 at all three phone sizes with `/cycles` at **8px spare or more**, on the local build and again on production after deploy. If any size drops under 8px, the change does not ship, and I-007 closes under (b) with a one-line "kept at 14px because …" in the row and beside the class.

### Delivery and encounter checks

- Delivery: Render deploy row for the new sha = live, then production `check-entry-folds` at all three sizes, plus a computed-style read of the first description (`15px` at 390 width). Also re-run `check-confidence-tag-taps.mjs`, since the entry block it taps is the one being edited.
- Encounter: blind. There are no client analytics, so a phone reader leaves no trace. The next encounter-shaped read is W-003's cold walk of this same page on 2026-10-03 (N = 1), which will read the new size as a side effect.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/page.tsx` (plus `continuity/items.json` and this report, which are internal). No prose change, so the `.md` mirror rule does not trigger.

<!-- findings:begin -->
**P3 finding, 2026-09-28: the packet's premise was half wrong.** 15px at every phone width does NOT fit. On the local build (`next build` + `next start`), `check-entry-folds` read `/cycles` at **2px spare at 320x568** (from 30px). The first description gained a line, and that is under the 8px floor. The same build read 41px at 360x560 and 181px at 390x664. So the change that shipped is 15px from 360px up and 14px below 360 (`max-[360px]:text-[14px]`, width < 360). I-007 therefore closes as (a) for 360 and up, and as (b) below 360, with the reason in the source comment. Reading the ten descriptions as a stranger (the manager's suggestion): each one's first clause already says what the cycle claims ("~120-year cycle of dynastic rise and fall", "~50–60 year economic long wave"). No copy was rewritten.
<!-- findings:end -->

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none**. Read from `dated gates due today` (0) and this morning's `check-due-gates-dispositioned --snapshot` ("0 gate(s) due on/before 2026-09-28").
- (b) Owed child rows in the orchestrator's ledger: **none**. Read from `rows owed to you` (0 of 729).
- (c) State reads marked CROSSED: **none**. Of the kickoff's reads, none printed a crossed threshold. `missingLinkedCommits` read NOTHING SWEPT (0 of 0), and `stale-actionable` read 0 of 4.

## P3 — Product-work loop

**Action (improve):** the `/cycles` entry descriptions are now **15px on phones from 360px up** and stay at 14px below 360 (I-007, closed). This shipped as `1c2cc72`.

**The four states**

1. **Implementation.** `1c2cc72` on `main`. `verify-with-receipt -- npm test`: 16 files, 118 tests pass, receipt on 1c2cc72. CI `ci.yml` GREEN on 1c2cc72 (`check-ci-status --wait`, 70s). Codex adversarial review, `Target: working tree diff`: **approve**, no material findings. Its two next steps were to record the narrow-screen exception in I-007 (done) and to verify computed sizes in a browser (done below, because its sandbox could not run a browser).
2. **Delivery.** Render deploy `1c2cc72` **live** at 2026-09-28 15:48:20Z (read from the Render deploys API; `check-deployed-sha-drift` is NOT-APPLICABLE-BY-REGISTRY for this commit-trigger service). The surface, read on production after the deploy:
   - computed size of all 10 descriptions: 14px at 320 and 359 wide, 15px at 360, 390 and 640 (`tmp/desc-size.mjs`)
   - `check-entry-folds`: 13 of 13 at 320x568 (`/cycles` 30px spare, unchanged), 360x560 (69 → 41px) and 390x664 (188 → 181px)
   - `check-confidence-tag-taps`: 7/7
3. **Encounter:** blind. The site has no client analytics, by standing choice, so a phone reader leaves no trace. The encounter-shaped read of this page is W-003's cold walk on 2026-10-03 (N = 1).
4. **Outcome:** open. There is no read yet.

**What changed from the packet.** 15px at every width failed the 8px floor at 320x568 (2px spare), so the band below 360 keeps 14px. The reason is in the findings block above and in the source comment. The manager's copy suggestion was checked: each description's first clause already states what the cycle claims, so no copy changed.

USER-VISIBLE: /cycles cycle descriptions are 15px instead of 14px on phones 360px and wider (14px kept below 360) — 1c2cc72 [proof: computed 14px → 15px at 360/390 on production after Render deploy live 2026-09-28 15:48:20Z, 10 of 10 descriptions; check-entry-folds 13/13 at 320x568, 360x560, 390x664] [coverage: none — no client analytics by standing choice · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a phone reader leaves no trace · bug row W-003]

## Close

ACTION: COMPLETED · item I-007 · P3 38ba9900

**What shipped, in plain words:** the `/cycles` descriptions are **15px from 360px up and 14px below 360**. They are not 15px on every phone: at 320x568, 15px left `/cycles` 2px of first-screen spare, under the 8px floor.

**Changed since the P3 post:**
- 4a4e8eb (report + ledger close, docs-only) CI `ci.yml` **GREEN** (`check-ci-status --workflow ci.yml`, run at close). It was pending at the P3 post.
- The manager review (dd4f3b01) read the action as COMPLETED and found no defects.

**Ledger delta:**
- I-007 closed in 4a4e8eb (P3): (a) from 360 up, (b) below 360.
- W-003 (`continuity-edit --set`): a note that 1c2cc72 changed the surface it walks, and a third onTrigger question (can a stranger scan the ten descriptions at 390 wide without tapping in). Its date stays 2026-10-03.

**Hygiene draft:** 1 draft line (`none — no inputs`), accepted. READ-MUTATED: `none — 0 reads guarded`. Engineering-zero PASS (0 findings). Wait-justification was re-run after I-007 closed: `RESULT: PASS — 4 of 11 row(s) carry waitJustification; 0 warn / 0 info`. Due gates: `verdict: CLEAR`, snapshot CURRENT (taken 2026-09-28), 0 due.

**Pending reads:**
- 2026-10-03: W-003 cold phone walk of `/cycles`. It is the first read of both the tappable confidence tag and the 15px descriptions (N = 1; the site has no analytics).
- 2026-10-03: I-006 (cycle counts written as literals).
- 2026-10-07: W-001 Search Console read. Titles, meta, H1s and URLs stay frozen until then.

**Receipt:** P3's receipt is still true; nothing new.
