# sinusoidal-cycles — 2026-10-01 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** a phone reader on /cycles can get from the page's headline ("0 of the 9 paired theories…") to each cycle's verdict in one tap, instead of scrolling about five screens with no sign the answer is below. **Item:** no row yet. I-015 will be minted at P3 through `continuity-edit`. The source is the 2026-09-30 cold walk, finding 2 (skylark-site `docs/walks/2026-09-30/sinusoidal-cycles.md`).

**The user problem, in the reader's words:** "Does any of this hold up?" The header of /cycles states the headline and links off-page to /methods. The per-cycle answers ("Does any of them hold up?") sit below all ten cycle entries, and nothing on the page links to them.

### Section 0

- Primer: `docs/cold-starts/2026-09-30.md` read whole. Its first action ran: `check-verdict-phone.mjs https://sinusoidalhistory.com` → **316/316 PASS** (yesterday's two ships hold on production).
- Listener: 🟢 SSE alive (relaunched by the SessionStart hook, pid 29960; SESSION START 14:42:35Z, hello 14:42:43Z, slug sinusoidal-cycles, replayed 0). Waker ranks 1-3 armed. The loop is armed by `ScheduleWakeup`, and the Stop hook owns the interval.
- Codex: RED (the probe line on this prompt, machine-level exec at 15:14:27Z). Today's review plan is in P3. No Codex dispatch.
- CI: `check-ci-status --workflow ci.yml` → **GREEN** for `e3ed7d0257e32beaf68788f21b0a39ab297f8c5c`.
- Deploy drift: NOT-APPLICABLE-BY-REGISTRY for `sinusoidal-history` (daily-config), so I read the Render deploys API for `srv-d7mcat7lk1mc73bidim0`. The live deploy is `e3ed7d0257e32beaf68788f21b0a39ab297f8c5c`, finished 2026-09-30 22:02:37Z, and it **equals HEAD. There is no drift.**
- Harness: running 2.1.286 · fleet UNIFORM (26 of 27 panes read, 1 transcript unreadable) · installed 2.1.286 (SAME). The script exits 3 as CHANGED against its 2026-09-18 record (2.1.277). That is a read, not a stop.
- Recs yesterday: the round-2 close carried no Recommendation block. Its carry-forwards: W-003 walk → **carrying** to 2026-10-03; I-013 → **carrying** (David decides, only if W-003 shows a reader tripping). Walk findings 2 and 3 → finding 2 **selected here**; finding 3 is still held.

### Evidence

- OBSERVED: I measured production `/cycles` with a scratchpad Playwright script (`measure-verdict-offset.mjs`) at ~16:20Z today. It reads the `#does-any-hold-up` section's top and counts the links that target it.

  | Viewport | Verdict section top | Screens down | Links to it on the page |
  |---|---|---|---|
  | 390x664 (iPhone 15 context) | 3103px | 4.7 | 0 |
  | 360x560 | 3291px | 5.9 | 0 |
  | 320x568 | 3418px | 6.0 | 0 |
  | 1440x900 | 2312px | 2.6 | 0 |

  Population: 1 page, 4 sizes, 1 run. Limits: layout only; it does not judge whether a reader wants the list.
- OBSERVED: a repo-wide Grep for `does-any-hold-up` (excluding node_modules) finds it only in `src/app/(app)/cycles/page.tsx`, its own definition. **No surface on the site links to the per-cycle verdicts on /cycles.**
- OBSERVED: the header paragraph (`cycles/page.tsx:203-211`) already states the headline ("0 of the 9 … record long enough"), and its only link goes to `/methods#spectral-testing`. A reader who wants "which ones, and how short?" is sent off the page, away from the list that answers it.
- OBSERVED: the 2026-09-30 cold walk, finding 2 ("the verdict list starts ~3,170px down … roughly five screens"; canon 25/31). Today's read is 3103px at 390x664, the same shape.
- OBSERVED (constraint): `check-entry-folds --width 320 --height 568` on production → 13 of 13, `/cycles` **30px spare**. The fold floor is 8px, so the header can grow by at most about one line at 320.
- MISSING: real-user evidence. There is no client analytics (a standing choice), and `docs/evangelism-bar.md` and `docs/evangelism-evidence.md` do not exist. `check-cycle-rotation --lane sinusoidal-cycles` → exit 0, "no product-love cycle picks this lane today; run the normal P3".
- HYPOTHESIS: a phone reader who reads "0 of the 9" in the header wants to know which ones and by how much. Today the page sends them to /methods, or makes them scroll past ten entries without saying the answer is below.
- Why not hold for W-003 (yesterday's call): W-003's eighth question tells the walker to "scroll to the spectral verdicts", so it measures reading the list, not finding it. It cannot answer this finding. A missing read does not hold product work (David, 09-04).

### Permission

- No row, no card, and no freeze covers it. W-001's freeze (to 2026-10-07) covers titles, meta, H1s and URLs. This touches a body paragraph and adds an in-page anchor link; the H1 and the URL are unchanged.
- It is display only: the copy and link sit around the frozen `verdicts.json`, so there is no spectral re-run and no manifest change.
- Decision class: a lane-owned navigation and copy fix on an existing surface.

### Next action — improve

Build: in the /cycles header paragraph, link the headline to `#does-any-hold-up` (on-page; for example "See each cycle's verdict ↓"). Keep "How the test works →" one tap away inside the verdict section, so /methods is still reachable from where the reader is. The header must stay within its current line count at 320x568, or the fold must keep ≥8px. Write the check first and red-arm it against production:

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-verdict-reach.mjs https://sinusoidalhistory.com
```

(It will be new. It reads, at 390x664, 360x560, 320x568 and 1440: a visible link inside the first screen whose href is `#does-any-hold-up`, at least 44px tall on a coarse pointer, and after tapping it the section heading "Does any of them hold up?" sits inside the viewport. It also reads a link to `/methods#spectral-testing` inside the section. Expected red on production today: 0 inbound links.)

### Acceptance

- `check-verdict-reach.mjs` is red on production before the deploy and green after it, at all four sizes.
- `check-entry-folds` stays 13 of 13 at 390x664, 360x560 and 320x568, with `/cycles` ≥8px spare.
- The rendered-text line multiset, production before vs after, on /cycles: only the header link line and the in-section methods line change; nothing else moves.
- `check-verdict-phone` stays 316/316.
- `npm test` is green.

### Delivery and encounter checks

- **Delivery:** once the push lands, read the Render deploys API for srv-d7mcat7lk1mc73bidim0 until the sha is live, then run the three checks and the multiset on production.
- **Encounter:** blind (no client analytics). W-003's cold walk on 2026-10-03 is the read. P3 adds a question that does NOT tell the walker where the list is: "At 390 wide on /cycles, cold: which cycles have a long enough record to test, and how did you find out?" Pass: answered via the header link within one tap.

USER-FACING: yes. The paths: `src/app/(app)/cycles/page.tsx` (served on /cycles), `scripts/check-verdict-reach.mjs` (new, internal), `continuity/items.json` (I-015 mint and W-003 question, internal). There is no prose-page mirror: /cycles has no `public/*.md` twin (AGENTS.md lists about, methods and colophon only). `public/llms.txt` is unaffected (no count or URL change).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none. Read: `dated gates due today`. The morning snapshot `check-due-gates-dispositioned --snapshot` → "0 gate(s) due on/before 2026-10-01".
- (b) Owed child rows (the orchestrator's ledger): none. Read: `rows owed to you in skylark-site's ledger`, 0 of 739.
- (c) State reads marked CROSSED: none. Read: the kickoff state block. Stale-actionable was 0 of 10, queued rows 0, and David's-word cards 0.

mechanism-verified: `node scripts/check-verdict-phone.mjs https://sinusoidalhistory.com` (production, 2026-10-01) → `316/316 PASS`; Render deploys API for srv-d7mcat7lk1mc73bidim0 → `live e3ed7d0257e32beaf68788f21b0a39ab297f8c5c 09/30/2026 22:02:37` = HEAD; `check-entry-folds --width 320 --height 568` → `13 of 13`, /cycles 30px spare.

**Prep while holding for review (uncommitted):** `scripts/check-verdict-reach.mjs` is written and lint-clean.

[red-armed: node scripts/check-verdict-reach.mjs https://sinusoidalhistory.com (production, before any change) -> 1/5 FAIL — "0 link(s) to #does-any-hold-up" at 390x664, 360x560, 320x568 and 1440x900; only the coarse-pointer proof passes, and the tap and method legs cannot run without a link]

Prior-day retro finding that bears on the choice: none of the 9 still-on-discipline findings recurred this morning. The one CARRIED finding (I-013, 2026-10-03) is still carried and is not today's choice.

## P3 — Product-work loop

[P3 — Product-work loop]

**Action (kind: improve):** I-015. On /cycles, the header's headline ("0 of the 9 paired theories have a record long enough…") now ends in "See which ones, and how short ↓". One tap jumps to the per-cycle verdicts on the same page. Before this, they sat 3103px down at 390x664 and nothing on the site linked to them. "How the test works →" moved under the verdict list. The manager review (10976e92) APPROVED this, and I measured both of its HYPOTHESES; both **held**:

1. **Tap box.** A 44px target in normal flow would break the fold. I grew the inline link's tap box with vertical padding instead, which doesn't change the line height. At `py-[11px]` it measured **41px**, so it ships at `py-[13px]`, **45px**. The check measures the hit box (the client rect) and hit-tests both edges. `/cycles` keeps its **30px** spare at 320x568, unchanged.
2. **Scroll margin.** Without one, the heading lands **flush at 0px**. With `scroll-mt-6` it lands at **24px**.

I took its SUGGESTION too: the link says the answer ("See which ones, and how short ↓").

1. **Implementation.**
   - Commits on main:
     - `d69f696`: the link, the moved method link, the scroll margin, the new check `scripts/check-verdict-reach.mjs`, the I-015 mint and W-003's new question.
     - `26c244d`: the review round-1 fixes.
   - Gates at `26c244d`: `npm test` 124/124 via verify-with-receipt, typecheck clean, lint clean on both touched files. **CI: GREEN** for `26c244dfd71a506a8981aae7e9dd979c4c388ff8` (`check-ci-status --workflow ci.yml`).
   - Review: Codex is RED today (probe at 15:14:27Z), so no Codex run. In its place, one fresh-context Claude sub-agent reviewed `d69f696` read-only. It found nothing HIGH: 2 MED and 6 LOW, all STATIC.
     - FIXED in `26c244d`:
       - (1) The hit-test ran only on touch sizes. It now runs at 1440 too.
       - (2) Visibility read the link's own style only. It now uses `checkVisibility()`, which also catches a hidden or transparent ancestor.
       - (3) The landing had no upper bound. The heading must now land 12-48px below the top.
       - (5) The href suffix match is now exact.
       - (8) The ↓ is `aria-hidden`.
     - CORRECTED: (4) `d69f696`'s message said the method link stays "one tap from the answer". On phones it sits under all ten verdict entries: one scroll, then one tap. The check header now names that.
     - MEASURED, no change: (6) the longer nowrap link adds no header line at 375x667 or 340x568 (`/cycles` 171px and 30px spare, 13/13 at both, local build).
     - ACCEPTED: (7) the 13px padding reaches ~11px into the line above, so a tap on that plain text follows the link.
     - NAMED in the check's NOT-seen header: occlusion off the two hit-test points, overflow clipping, contrast, large text scaling.
     - The `26c244d` delta got no second review round. It was proven by mutation instead (below).
   - Proof that the check fails (each run on its own build, restored afterward):
     - Production before the change: **1/5** (0 links).
     - `py-[11px]`: **17/20** (41px box).
     - Scroll margin removed and method href broken: **12/20** (heading at 0px; no method link).
     - Round-1 legs (`scroll-mt-24`, plus the link wrapped in `max-[360px]:opacity-0`): **15/19**. The landing leg failed at 390, 360 and 1440 (heading at 96px, which the old bound passed), and the first-screen leg failed at 320 (hidden by its parent, which the old test passed).
     - Final build: **24/24**.
   - Visual check at the extremes: 320x568 light, 320x568 dark after the tap (the heading sits 24px down, with verdict entries below it), and 1440 light. The link fits on one line at every size.
   - Sibling sweep: a Grep for `does-any-hold-up` outside node_modules found only the page's own definition before this change. No other surface links the per-cycle list, and none needs to.
2. **Delivery.**
   - Render deploy `26c244dfd71a506a8981aae7e9dd979c4c388ff8` is **live**, finished 2026-10-01 17:22:38Z (Render deploys API for srv-d7mcat7lk1mc73bidim0). `check-deployed-sha-drift` is NOT-APPLICABLE-BY-REGISTRY for this service, per daily-config.
   - Production reads after the deploy:
     - `check-verdict-reach.mjs https://sinusoidalhistory.com`: **24/24 PASS** (1/5 before).
     - `check-entry-folds --width 320 --height 568`: **13 of 13**, `/cycles` 30px spare (30 before).
     - `check-verdict-phone`: **316/316**, still.
     - `/cycles` line multiset, production before vs after: 311 → 313. The 2 added lines are the link, which the extractor splits at its aria-hidden span ("See which ones, and how short" and "↓"). **0 lines lost.** "How the test works →" moved and is present on both sides.
     - The W-001 freeze holds: no title, meta, H1 or URL was touched.
3. **Encounter:** blind. There is no client analytics (a standing choice), so a reader leaves no trace. The encounter read is W-003's cold walk on 2026-10-03, which gained a question asked BEFORE the eighth so it does not give the list's location away: "at 390 wide on /cycles, cold: which cycles have a long enough record to test, and how did you find out?" Pass: answered through the header link within one tap.
4. **Outcome:** open. No read yet.

USER-VISIBLE: on /cycles the headline "0 of the 9 paired theories have a record long enough…" now ends in "See which ones, and how short ↓", a 45px tap that jumps to the per-cycle verdicts on the same page (heading lands 24px below the top); before, they sat 3103px down at 390x664 (3418px at 320x568) and nothing linked to them — 26c244d [proof: check-verdict-reach 1/5 → 24/24 on production after Render deploy 26c244d live 2026-10-01 17:22:38Z at 390x664, 360x560, 320x568 and 1440x900; entry folds 13/13 at 320x568 with /cycles 30px spare unchanged; /cycles line multiset production before vs after 0 lines lost] [coverage: none — no client analytics by standing choice · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader who taps the link leaves no trace · bug row W-003]

[red-armed: node scripts/check-verdict-reach.mjs http://localhost:3100 (local build with scroll-mt-24 and the link wrapped in max-[360px]:opacity-0) -> 15/19 FAIL — "the tap lands … 12-48px below the top" at 390x664, 360x560 and 1440x900 (heading at 96-132px), and "1 link(s) to #does-any-hold-up; none visible inside 0-568px" at 320x568]

mechanism-verified: `node scripts/check-verdict-reach.mjs https://sinusoidalhistory.com` (production, after the deploy) → `24/24 PASS`

codexCalls: 0 (probe-red: machine-level exec RED at 15:14:27Z)
adversarialReviews: 0 — BY-INSPECTION (Codex probe RED, so no cross-family run was possible. One fresh-context Claude sub-agent reviewed d69f696 read-only: 8 findings, 5 fixed in 26c244d, 1 corrected, 1 measured, 1 accepted. The 26c244d delta was proven by mutation, 15/19, not by a second round.)
hygiene helper: DISPATCHED ~16:39Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-01.md PRESENT (21 lines, 0 disposition lines). Inputs: none. wait-justification `RESULT: PASS — 9 of 18` at the helper (before I-015's wait). engineering-zero `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable`. READ-MUTATED: none.
Ledger (all through `continuity-edit`):
- I-015 minted, then → **monitoring**: nextEvaluation 2026-10-03, with a waitJustification until then. readCommand = check-verdict-reach. linkedCommits: d69f696, 26c244d. The first half of its closeWhen (24/24 on production) is met; the second half is W-003's walk.
- W-003's onTrigger gained the I-015 question.
[standing-rules-hash: 88cc2dc9]

**What remains:** W-003's walk on 2026-10-03 is I-015's encounter read, as it is for I-008 through I-014. Walk finding 3 (phone list names don't look much like links) is still not worked: it is a HYPOTHESIS fix, and W-003's eighth question is the read that tests it. I-013 is still David's decision and still carried to 10-03. Nothing else is owed on this outcome today.

<!-- findings:begin -->
**P3 findings, 2026-10-01.**
1. Both manager-review hypotheses held when measured: a 41px box at `py-[11px]`, and the heading at 0px without the scroll margin. That makes "the check measures the hit box, not the text" and "landing needs clearance" correct legs, not style.
2. The review found two ways the new check could read GREEN for a link a reader cannot use (an ancestor's opacity, a heading far down the screen). Both were closed in round 1 and mutation-proven. Its remaining blind spots are named in the check's header rather than added as legs, per the stop-patching rule.
3. The /cycles rendered-text extraction now splits the header link into two lines at its aria-hidden span. That is expected, the same shape as W-002's tag split.
<!-- findings:end -->

## Close

[P5 — Delta-only close]

ACTION: COMPLETED · item I-015 · P3 ecba3770

**What shipped, in plain words:** on /cycles, the headline "0 of the 9 paired theories have a record long enough…" now ends in "See which ones, and how short ↓". One tap jumps to the per-cycle verdicts on the same page, and the heading lands 24px below the top. Before, they sat 3103px down at 390x664 and nothing linked to them. "How the test works →" sits under the verdict list.

**Changed since the P3 post:**
- The manager review (6099b86b) read the action as COMPLETED with no defects. It confirmed `d69f696` and `26c244d` are ancestors of origin/main and that the tree matches the claim.
- **The review gap, stated plainly, not as a pass.** Codex was RED all day (probe at 15:14:27Z), so **no cross-family review ran**. The only review was one same-family, fresh-context Claude sub-agent, on `d69f696`. The `26c244d` delta (its fixes) had **no second review round**. It was proven by mutation instead: 15/19 on a broken build, 24/24 on the real one.
- The low-memory reaper stopped all three waker rungs at ~17:50Z. I relaunched them under David's 2026-09-26 standing go-ahead with 24,462,792 KB free (bus 84de49fe). This was not product work.

**Hygiene draft:** 0 lines, with nothing to accept, amend or reject (inputs: none).
- READ-MUTATED: none (0 reads guarded).
- check-wait-justification: `RESULT: PASS — 9 of 18` at the helper. Re-run at close, after I-015's wait: `RESULT: PASS — 10 of 19 row(s) carry waitJustification; 0 warn / 0 info (exit 0)`.
- check-engineering-zero: `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable` (Sentry and Dependabot). No lockfile changed today.

**Due gates:** `check-due-gates-dispositioned` → `verdict: CLEAR — every gate due at Phase 0 was dispositioned.` The snapshot is CURRENT (taken 2026-10-01; 0 rows were due).

**Ledger delta (all through `continuity-edit`):**
- **I-015 minted → monitoring** (at P3): nextEvaluation 2026-10-03, with a waitJustification until then. readCommand is check-verdict-reach. linkedCommits: d69f696, 26c244d. The first half of its closeWhen (24/24 on production) is met.
- **I-015 onTrigger** (at P5) now carries the pending read: W-003's cold walk on 2026-10-03 asks, before its eighth question, "at 390 wide on /cycles, cold: which cycles have a long enough record to test, and how did you find out?" Pass: answered through the header link within one tap.
- **W-003**: its onTrigger gained that question (at P3).
- **I-013 unchanged.** It is still David's decision, carried to 10-03, and goes on a board card only if W-003 shows a reader tripping on rising vs peaking.

**Pending reads:** W-003's cold walk on **2026-10-03** is the encounter read for I-015 (the find-the-list question), I-008 through I-014, and I-013. Walk finding 3 (phone list names don't look much like links) is still held behind W-003's eighth question.

**Receipt:** P3's line (ecba3770) still holds. Nothing new.

codexCalls: 0 (probe-red: machine-level exec RED at 15:14:27Z)
[standing-rules-hash: 88cc2dc9]

---

## Round 2 — P1, evidence and choice (2026-10-01, ~16:30 MT)

**Outcome:** after a reader uses the /cycles header link "See which ones, and how short ↓" and then opens a cycle, browser Back brings back /cycles. **Item:** I-015 (monitoring). This is a defect in I-015's own change (`d69f696`/`26c244d`), so no new row is needed. Its fix and the new check leg are recorded on I-015 through `continuity-edit` at P3.

**The user problem, in the reader's words:** "I tapped down to the verdicts, opened Carlota Perez, hit Back, and nothing happened." The URL changes to `/cycles#does-any-hold-up` but the Perez page stays on screen. A second Back is needed.

### Section 0 (round-2 deltas only; round 1's Section 0 above still stands)

- `git pull`: already up to date at `e1aba80`. The kickoff read CI as GREEN for `e1aba809` (run 36903745111). No code has changed since round 1's deploy of `26c244d`.
- Listener: 🟢 relaunched by the SessionStart hook (pid 52456; SESSION START 22:14:55Z, hello 22:15:03Z, slug sinusoidal-cycles, replayed 0). Waker ranks 1-3 are armed and the loop is armed by `ScheduleWakeup`.
- Codex: **GREEN** (the probe line on this prompt, machine-level exec at 22:18:38Z, SPAWN proven with fd-backed stdio). A cross-family review of the P3 diff is planned, plus the `d69f696..26c244d` gap the round-1 close named.
- Primer: `docs/cold-starts/2026-10-01.md` read whole. Its banner still stands; round 2 will be appended to the same file at close.

### Evidence

- OBSERVED (cold walk, skylark-site `docs/walks/2026-10-01/sinusoidal-cycles.md` finding 1): /cycles → link → Perez → Back leaves Perez on screen with the URL at `/cycles#does-any-hold-up`. The control without the link returns correctly. Walked on Chromium, iPhone 15 emulation plus desktop. Walk window 20:00:00Z-20:22:55Z, to be excluded from every read.
- OBSERVED (my reproduction on production, ~22:30Z, `tmp/repro-back.mjs`, Playwright Chromium; 1 run, 4 trips):

  | Viewport | Trip | After one Back |
  |---|---|---|
  | iPhone 15 (tap) | WITH the link | url `/cycles#does-any-hold-up` · h1 "Carlota Perez — techno-economic paradigm" ✗ |
  | iPhone 15 (tap) | control, scroll instead | url `/cycles` · h1 "The ten cycles" ✓ |
  | 1440x900 (click) | WITH the link | url `/cycles#does-any-hold-up` · h1 "Carlota Perez — …" ✗ |
  | 1440x900 (click) | control | url `/cycles` · h1 "The ten cycles" ✓ |

- OBSERVED (mechanism, read in source): `node_modules/next/dist/client/components/app-router.js:284-288`. The App Router's `onPopState` returns early when `event.state` is null ("this case only happens when pushState/replaceState was called outside of Next.js"). A plain `<a href="#…">` is a native fragment navigation, so it pushes a history entry with null state. Back into that entry fires a popstate the router ignores. The walk's hypothesis is therefore confirmed in the code, not just inferred.
- OBSERVED (the existing check is blind to this): `scripts/check-verdict-reach.mjs` has no navigation after the tap, so it read 24/24 on production with this bug live.
- MISSING: real iOS Safari. Both the walk and my reproduction ran on Chromium. The mechanism is in the router's JavaScript, not the engine, so WebKit is expected to behave the same (HYPOTHESIS until a WebKit run).
- MISSING: real-user evidence. There is no client analytics (a standing choice), no `docs/evangelism-bar.md`, and no `docs/evangelism-evidence.md`. `check-cycle-rotation --lane sinusoidal-cycles` → exit 0, "no product-love cycle picks this lane today; run the normal P3".
- Why this one: I shipped it today, and it breaks the trip the link exists for (tap down, open one cycle, come back to compare). A live defect from my own change outranks new work.

### Permission

- I-015 is lane-owned and monitoring. Fixing a defect in its own change is a lane-owned navigation fix on an existing surface.
- W-001's freeze (titles, meta, H1s, URLs to 2026-10-07) is untouched: no title, meta, H1 or URL changes, and the rendered text is the same.
- No spectral or manifest surface is touched. No board card is open on this, and no David decision is needed.

### Next action — improve (fix a live defect)

Add the Back leg to the check first and red-arm it against production. At each size: tap the header link, tap a visible cycle link inside `#does-any-hold-up`, then `goBack()`. Pass means the path is `/cycles` and the h1 reads "The ten cycles". Then fix the link.

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-verdict-reach.mjs https://sinusoidalhistory.com
```

The fix to test first (HYPOTHESIS until measured): replace the header's `<a href="#does-any-hold-up">` with `next/link` (`<Link href="#does-any-hold-up">`), keeping `py-[13px] whitespace-nowrap`. The router then pushes the hash entry with its own `__NA` state, so popstate restores. Fallback if `Link`'s hash scroll ignores `scroll-mt-6` or misplaces the landing: a small client component that calls `preventDefault` + `scrollIntoView()` + `history.replaceState` and pushes no entry at all.

### Acceptance

- The new Back leg is **red on production before the deploy** and green after it, at all four sizes (iPhone 15 390x664, 360x560, 320x568, 1440x900).
- Every existing leg stays green (24/24 today). In particular the landing stays 12-48px below the top, and the tap box stays ≥44px and one fragment.
- `check-entry-folds` stays 13 of 13 at 390x664, 360x560 and 320x568, with `/cycles` ≥8px spare.
- The rendered-text multiset of /cycles is unchanged.

### Delivery and encounter checks

- Delivery: the extended `check-verdict-reach` on production after Render goes live. The deploy sha is read from the Render deploys API.
- Encounter: W-003's cold walk on **2026-10-03**. It adds a leg: after the I-015 find-the-list question, open one cycle from the list and press Back. A pass means the reader is back on /cycles without a second press. At this traffic there is no event to read (no client analytics), so the walk is the only encounter read.

**USER-FACING: yes.** Paths: `src/app/(app)/cycles/page.tsx` (the header link), `scripts/check-verdict-reach.mjs` (internal check), `continuity/items.json` (internal, via `continuity-edit`).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none** (read: `check-due-gates-dispositioned --print` → "0 gate(s) due on/before 2026-10-01", 19 rows swept).
- (b) Owed child rows: **none** (read: the kickoff's "rows owed to you" → 0 of 739).
- (c) Reads that crossed a threshold or could not be judged:
  - **key numbers:** no `docs/key-metrics.json` yet, so this is unjudged rather than 0.
  - **missingLinkedCommits:** NOTHING SWEPT, 0 of 0 considered.
  - **prior-day retro:** 9 of 10 of my 09-30 findings are still on discipline, and 1 is carried (I-013, to 10-03). None recurred in a way that bears on this choice.

**Held, not selected:** walk finding 2 (the per-cycle deep link lands with the cycle's h1 off-screen) and finding 3 (where the "0 of the 9" sits). Both are low severity per the walker, and both are behind W-003.

---

## Round 2 — P3, product-work loop (2026-10-01)

**Action (kind: improve — a fix to my own live change):** I-015. After a reader used "See which ones, and how short ↓" on /cycles and then opened a cycle, one Back changed the URL to `/cycles#does-any-hold-up` but left the cycle page on screen. One Back now returns them to /cycles **at the verdict list** (heading 24px down), which is the manager review's "great version". The same bug was live in **six more** in-page links, and they are fixed too. The manager review (0d02870c) APPROVED it. Its HYPOTHESIS that `next/link` with a hash respects `scroll-mt-6` **held** (landing 24px). Its two SUGGESTIONS were taken: the Back leg records and now judges where /cycles lands, and the check runs in WebKit.

1. **Implementation.**
   - Commits on main:
     - `4d4fe3a`: the seven `#hash` anchors become `next/link`; a lint rule; a Back leg and a `--webkit` switch in `check-verdict-reach`.
     - `76e3153`: Codex r1's two regressions from `next/link` were reproduced. The fix changes the shape: `src/components/HashLink.tsx` does the jump itself. It calls `history.pushState(null, …)`, which Next's patched pushState stamps with router state, so Back restores. It then calls `scrollIntoView`, then focuses the target, so the next Tab continues from it. All seven jumps use it. The lint rule now refuses both `<a href="#…">` and `<Link href="#…">`. The check gains repeat-jump and keyboard legs.
     - `f620cee`: Codex r2's two check-predicate gaps are closed. The Back landing is judged, and the forward page must prove it is a cycle page before Back.
   - **Gates:** `verify-with-receipt -- npm test` → 124/124, exit 0, receipt on `f620cee1` (dirty paths are ledger-only). lint and typecheck are clean. **CI: GREEN** for `f620cee` (`check-ci-status --workflow ci.yml --wait`, 1 success, 0 failures).
   - **Review — cross-family, Codex, read-only, foreground pipe, banner workdir checked = `C:\dev\skylark\sinusoidal-cycles` both rounds:**
     - **r1** on `e3ed7d0..4d4fe3a`, which also covers round 1's unreviewed `d69f696..26c244d` gap. Two P2 findings, both CONFIRMED by reproduction:
       - (1) After Enter on the link, Tab went to the roster above the verdicts. Production's native `<a>` put focus inside them. **Fixed in `76e3153`.**
       - (2) A second click on the same link did not jump: heading at 2312px, against 24px on native. **Fixed in `76e3153`.**
       - Coverage notes: the lint rule's blind spots are now named in its comment, and the Back leg's fixed waits are replaced by render and restore polls (`f620cee`).
       - The config-override question was REFUTED by Codex itself: eslint-config-next sets no `no-restricted-syntax`.
     - **r2** on `4d4fe3a..76e3153`. **No runtime defect in HashLink.** Two P2 findings in the check, both CONFIRMED against source:
       - (1) The Back landing was printed but not judged. **Fixed in `f620cee`:** the heading must sit on the upper half of the screen.
       - (2) The forward wait accepted no h1, or the error boundary's h1. **Fixed in `f620cee`:** it requires an h1 and `#does-it-hold-up`, and fails closed.
     - `f620cee` touches the check only and had **no third review round**. It was proven by mutation instead (below).
   - **Proof the instruments fail** (rule 1):
     - Production before any change: Back leg **24/28** in Chromium and in WebKit.
     - The `4d4fe3a` (Link) build: **28/33**, exactly the 5 new repeat and keyboard legs.
     - Mutation, /cycles scrolled to the top after Back: **33/37**, exactly the 4 landing legs.
     - Mutation, the forward wait aimed at an id no page has: **33/37**, the 4 Back legs ("it never rendered as a cycle page").
     - Lint rule on `4d4fe3a`'s pages: **7 of 7** Link anchors flagged. Before `4d4fe3a`, it flagged **6 of 6** plain anchors.
     - All mutations were reverted, and a Grep confirmed 0 `MUTATION` lines left.
   - **Measured, not changed:**
     - In WebKit, production's native `<a>` also puts focus on BODY after Enter+Tab, because WebKit's Tab skips links by default. So the keyboard leg is Chromium-only and says why.
     - One WebKit Back failure in 3 runs was the check's fixed 800ms wait: a local forward render once took >10s. Across 10 repeated trips, every restore that followed a rendered page took 71-768ms.
     - Jump→Back, Back→Forward and jump→2nd hash→Back are byte-identical to native `<a>` on scroll and URL.
   - **Sibling sweep** (pattern: plain `<a>` with a `#…` href; roots: `src/**/*.tsx`; hit count **6** beyond the header link):
     - /cycles `#confidence-tags`
     - /methods `#spectral-testing` and its "On this page" list
     - /cycles/<slug> `#confidence`, `#spectral-verdict` and `#caveat`

     All 6 were live-broken on production (**0/6** came back after a hash jump, an in-app navigation and Back) and are fixed. The lint rule keeps the class out.

2. **Delivery.**
   - Render deploy `f620cee` is **live**, finished 2026-10-02 00:28:34Z UTC (Render deploys API, srv-d7mcat7lk1mc73bidim0; `check-deployed-sha-drift` is NOT-APPLICABLE-BY-REGISTRY for this commit-triggered service).
   - Production reads after the deploy:
     - `check-verdict-reach https://sinusoidalhistory.com`: **37/37** (29/37 before).
     - `--webkit`: **36/36**.
     - Sibling probe: **6/6** (0/6 before), each landing at the same offset as before (24/0/0/24/0/24px).
     - `check-entry-folds 320x568`: **13 of 13**, `/cycles` 30px spare (unchanged).
     - `/cycles` visible text, before vs live: **identical** (313 lines). /methods, /cycles/perez and the fathers-and-sons page were identical on the local build.
     - The W-001 freeze holds: no title, meta, H1 or URL changed.

3. **Encounter:** blind. There is no client analytics (a standing choice), so a reader pressing Back leaves no trace. The read is W-003's cold walk on 2026-10-03, whose onTrigger now adds: after the I-015 find-the-list question, open one cycle from the list and press Back once. Pass: back at the verdict list without a second press, on a real iPhone if one is available.

4. **Outcome:** open. No read yet.

USER-VISIBLE (debt-paydown): one Back from a cycle page now returns to the page the reader came from, at the place they left it — on /cycles after "See which ones, and how short ↓" (lands at the verdict list, heading 24px down) and after six other in-page links on /cycles, /methods and every cycle page; before, Back changed the URL and left the cycle page on screen — f620cee [proof: check-verdict-reach 29/37 → 37/37 on production (Chromium) and 36/36 (WebKit) after Render deploy f620cee live 2026-10-02 00:28:34Z UTC; sibling Back probe 0/6 → 6/6 on production; /cycles visible text identical; entry folds 13/13 at 320x568 unchanged] [coverage: none — no client analytics by standing choice · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader pressing Back leaves no trace · bug row W-003]

[red-armed: node scripts/check-verdict-reach.mjs https://sinusoidalhistory.com (production before the deploy, plain <a href="#…">) -> 29/37 FAIL — "one Back from a cycle opened there shows /cycles again" and "that Back lands at the verdict list" at all four sizes: after Back, url /cycles#does-any-hold-up · h1 "Schlesinger Jr. — liberal/conservative cycle" · verdict heading at nullpx]

mechanism-verified: `node scripts/check-verdict-reach.mjs https://sinusoidalhistory.com` (production, after the deploy) → `37/37 PASS`

codexCalls: 2 (two foreground `codex exec --sandbox read-only` review runs, r1 and r2)
adversarialReviews: 2 — EXECUTED (Codex r1 on e3ed7d0..4d4fe3a: 2 P2 found, both reproduced and fixed in 76e3153; Codex r2 on 4d4fe3a..76e3153: 0 runtime defects, 2 check-predicate P2 fixed in f620cee; f620cee check-only, proven by two mutations, no r3)
hygiene helper: DISPATCHED ~22:36Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-01-r2.md PRESENT (0 disposition lines; inputs none). wait-justification `RESULT: PASS — 10 of 19`. engineering-zero `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable`. READ-MUTATED: none.
Ledger (all through `continuity-edit`):
- I-015: linkedCommits + 4d4fe3a, 76e3153, f620cee. closeWhen now reads 37/37 on production (met), plus W-003's find-the-list AND one-Back answers. notes + the round-2 record. Status is still monitoring to 10-03.
- W-003: onTrigger gains the Back question.
[standing-rules-hash: 88cc2dc9]

**What remains:** W-003's walk on 2026-10-03 is the encounter read. A real iPhone (iOS Safari) has not been walked; the fix was verified in Chromium and Playwright WebKit. Walk findings 2 (the per-cycle deep link lands with the cycle's h1 off-screen) and 3 (where "0 of the 9" sits) are still held. Nothing else is owed on this outcome today.

<!-- findings:begin -->
**Round-2 P3 findings, 2026-10-01.**
1. The obvious fix (next/link with a hash) fixed Back and silently dropped two native behaviours, keyboard focus and repeat jumps. A cross-family review caught both; neither the rendered-text gate nor the reach check could see them. In-page jumps now go through one component (HashLink) and a lint rule keeps plain or Link hash anchors out.
2. The Back bug was not one link: 7 in-page anchors across /cycles, /methods and every cycle page carried it on production. The sibling sweep found 6 that the cold walk never touched.
3. WebKit's Tab skips links by default, so a keyboard leg in WebKit reads BODY even for a native link; the leg is Chromium-only and says so.
<!-- findings:end -->

---

## Round 2 — Close

ACTION: COMPLETED · item I-015 · P3 406f929e

**What shipped, in plain words:** one Back after an in-page jump now returns to the page and the place the reader left. On /cycles that means the verdict list, with its heading 24px down. The fix covers the "See which ones, and how short ↓" link and six sibling links on /cycles, /methods and every cycle page. Before this, Back changed the URL and left the next page on screen.

**Changed since the P3 post (406f929e):**
- The manager review (d7b54576) read the action as COMPLETED with no defects. It confirmed that `4d4fe3a`, `76e3153` and `f620cee` are ancestors of origin/main. It also confirmed that all seven in-page jumps go through HashLink and that no plain `<a href="#…">` is left in src/app. It did not re-run the production check.
- At 01:08Z I posted ONE status, "P5 not queued +30m" (0d645ee0), as the P3 brief requires.
- Waker rank 1 exited once more and was relaunched alone, per the standing rule. This was not product work.

**Hygiene draft:** 0 lines, so nothing to accept, amend or reject (inputs: none).
- READ-MUTATED: none (0 reads guarded).
- check-wait-justification at the helper: `RESULT: PASS — 10 of 19`. Re-run at close, after I touched I-015's wait: `RESULT: PASS — 10 of 19 row(s) carry waitJustification; 0 warn / 0 info (exit 0)`.
- check-engineering-zero: `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable`. No lockfile changed today.

**Due gates:** `check-due-gates-dispositioned` returned `verdict: CLEAR — every gate due at Phase 0 was dispositioned.` The snapshot is CURRENT (taken 2026-10-01; 0 rows were due).

**Ledger delta (all through `continuity-edit`):**
- **I-015 stays monitoring.** Its nextEvaluation is still 2026-10-03.
  - At P3: linkedCommits gained 4d4fe3a, 76e3153 and f620cee. closeWhen now reads 37/37 on production (met), plus W-003's find-the-list AND one-Back answers. notes gained the round-2 record.
  - At P5: onTrigger gained the PENDING READ: open one cycle from the verdict list and press Back once, on a real iPhone if available. Pass means back at the verdict list on one press. Walk findings 2 and 3 are recorded as held, not dropped. waitJustification.loadBearing now cites the round-2 delivery (37/37 + 36/36 + 6/6 on f620cee).
- **W-003:** onTrigger gained the press-Back-once question (at P3).
- **I-013 unchanged.** It is still David's decision, carried to 10-03.

**Pending reads:** W-003's cold walk on **2026-10-03** is the encounter read for I-015's find-the-list and one-Back questions, I-008 through I-014, and I-013. Real iOS Safari is unwalked: the fix was measured in Chromium and Playwright WebKit only.

**Receipt:** P3's line (406f929e) still holds. Nothing new.

**UNRESOLVED:** none.

codexCalls: 2 (two foreground read-only Codex review runs at P3, r1 and r2; none at P5)
[standing-rules-hash: 88cc2dc9]
