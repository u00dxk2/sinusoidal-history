# sinusoidal-cycles — 2026-10-23 (Friday, MT) — day round 1

## P1 — Evidence and choice

[P1 — Evidence and choice]

### Section 0

- Primer: no `docs/cold-starts/2026-10-23.md`; read `docs/cold-starts/2026-10-22.md` (newest). Its first action, run: `check-brush-widened.mjs https://sinusoidalhistory.com 390x664 --preset-return` → **PASS**: 2 of 2 drags (mouse, touch) show "Widened to 150 years, the shortest view this chart draws."; 0 stale after a preset return; 0 erased by a no-op press.
- Listener: 🟢 SSE alive (SessionStart relaunch pid 34372, hello 14:35:36Z, replay 0) + loop armed by `ScheduleWakeup` (the Stop hook owns the cadence); waker ladder ranks 1-3 running (rank 1 fired once on this kickoff row and was relaunched).
- Codex: GREEN per the kickoff's `[codex-probe: …]` line (machine-level exec+write, 14:41:57Z). 0 calls at P1.
- CI: `check-ci-status --repo-dir … --workflow ci.yml` → GREEN on ccda0a8b12 (1 success, 0 failures, 0 pending). Local checkout fast-forwarded ebd8707 → ccda0a8 (the Next 16.4.1 bump).
- Drift: `check-deployed-sha-drift --service sinusoidal-history`, verdict line as printed: "sinusoidal-history           in-sync            live ccda0a8b → head ccda0a8b  live commit IS the branch head  [srv-d7mcat7lk1mc73bidim0]" (exit 0). ccda0a8b is the Next 16.4.1 bump for the 10-22 Next.js advisories.
- mechanism-verified: check-deployed-sha-drift read Render's live deploy row for srv-d7mcat7lk1mc73bidim0 at ~14:52Z: "live ccda0a8b → head ccda0a8b".
- Harness: running 2.1.309 · fleet UNIFORM (27 of 27 panes on 2.1.309) · installed 2.1.309 (SAME).
- Engineering zero: `check-engineering-zero --project sinusoidal-cycles` → lane 0 findings, 0 unreadable.
- Recs yesterday: none in the report (Grep `recommend|Section B|next cycle` over `docs/daily/2026-10-22-prelaunch.md`: 0 hits). The close's carried item (I-062 cold walk on the final wording, 10-23) is **carrying today → P3**, second leg (below). The close's offer of I-064 as the next cycle is the orchestrator's call; it is dated 10-27 and is not pulled forward here.
- North Star: retention + word-of-mouth. The bar reads UNMEASURED (`docs/evangelism-bar.md` `metricReady: false`, no client analytics by standing choice, W-003). A share card is the word-of-mouth surface itself: it is what the friend sees before deciding to open the link.
- Product-love rotation: `check-cycle-rotation --lane sinusoidal-cycles` → exit 0, "no product-love cycle picks this lane today". The normal P3 runs.
- David's word: `answered-cards --project sinusoidal-cycles` → 1 card, 0 new: 777f3084 "Yes: one wave per cycle, stop at today, retire the yearly state pages." SPENT (I-061 closed 10-22).

### Selection packet

**Outcome:** I-056, the main share card answers its own question. A person who gets a link to the site (home, /cycles, /methods, any page without its own card) sees a preview headed "Do the cycles hold up?" and, today, no answer to it except a small "NONE CONFIRMED" in the top-right corner of the eyebrow. Each of the ten rows gives a period, a reference peak and a small wave, and nothing about whether that cycle was checked.

**The user problem, in the user's words:** the card's own headline, "Do the cycles hold up?", asked of a reader who has not opened the site. The per-cycle cards already answer it ("Does it hold up? Not testable on the record that exists.", I-032); the card most links carry does not.

**Evidence:**
- OBSERVED: the live image. An HTTP GET of the production `/og` path → 200 image/png, 94,961 bytes, today ~14:57Z, served by ccda0a8b. Read by eye: masthead "Do the cycles hold up?", standfirst "Ten long-wave cycles of history, on one shared axis.", ten rows "<name> · <period>y · peak <year>" over a one-period wave; eyebrow right "NONE CONFIRMED". **No phase word and no position bar.** Limits: one render, read by me; not a cold reader.
- OBSERVED: I-056's readCommand, run through the gate (`check-due-gates-dispositioned --run I-056`): `git grep -n "phasePositionLabel" -- src/app/og` → exit 1, empty (no match). Positive control: `git log -S phasePositionLabel --oneline -- src/app/og` → `9849b93 feat(I-061): … no surface states where a year sits` (removed it) and `f6761a6` (added it), so the grep can see the token and it is gone. **So half of I-056's title is already stale: the phase words and bars left with I-061 on 10-21.** The disagreement is the finding: the row was minted 10-18, before I-061 shipped, and was never re-read.
- OBSERVED: what the missing half would carry. `public/data/spectral/verdicts.json`: 9 primary verdict rows, all `eligible: false` (`cycles_covered` 0.74 Turchin to 2.87 Perez); the tenth cycle has no paired series. So `holdsUpCard` gives 9 × "Not testable on the record that exists" + "N of the 3.0 full periods…" and 1 × "Not tested". Each row could say which, with its own number.
- OBSERVED: DEPLOY.md § 6 is stale in two places: line 102 tells the deployer to confirm "the "State of the cycles · {month}" headline and the eight phase bars" (neither exists; there are ten cycles), and line 98 fetches the legacy host `sinusoidal-history.skylarkcreations.com/og`, which 301s since the 08-20 cutover, so `curl -sI` shows the redirect, not the image.
- OBSERVED: Search Console 2026-10-08..10-22 (kickoff lead, from the 10-22 read): 42 impressions, 1 click site-wide. Population: Google search only; a link preview opened in a chat app is invisible to it.
- HYPOTHESIS: a reader shown ten neutral waves under "Do the cycles hold up?" fills in "yes" (each one looks like a clean cycle) or reads no answer at all. Not walked yet.
- MISSING: any real-user read of the share preview (W-003; no tracking will be added). No cold walk of the main card has ever been run.
- Prior-day retro finding that bears on this: "Building and screenshotting myself recurred (10-21 Q2)" [still on discipline]. The card is a server image, so the red/green reads are a `GET /og` render in vitest plus one live PNG fetch; no `next start` + browser loop is needed.

**Permission:** I-056 status open, owner sinusoidal-cycles, P3, no park, freeze or card. It extends I-032's per-cycle card wording (lane class: copy built from the frozen verdict row) to the shared card, and it serves David's I-061 ruling (the card no longer says where now sits; this makes it say what was checked instead). No board card needed. The verdict words are not new: they come from `src/lib/holdsUp.ts`, so the page box, the per-cycle card and this card cannot drift.

**Next action — improve.** P3 sequence:
1. Red first: a test that renders the snapshot card's row text through a pure helper and asserts each of the ten rows carries its `holdsUpCard` headline in short form (+ the periods-covered number where there is a verdict). It fails today.
2. Build: each `PeriodRow` on `/og` carries its verdict next to "<period>y · peak <year>" (short form of `holdsUpCard`, e.g. "Not testable · 1.8 of 3.0 periods", "Not tested · no paired data"); the eyebrow's "NONE CONFIRMED" stays. Exact wording comes from `holdsUp.ts` (a short-form export there if needed), and the I-028 no-test-ran guard (`testedSeries.test.ts`) must cover the new text. The og:image alt in `src/app/layout.tsx` and `src/app/(app)/cycles/page.tsx` gets the same answer ("none is testable on the record that exists yet") if it fits; the alt is published text too.
3. DEPLOY.md § 6: the canonical host, and "confirm the preview reads 'Do the cycles hold up?' with each cycle's verdict on its row and no phase word or position bar".
4. Codex read-only review (portable rule 3: published text) + a claims pass on the new sentences; render the PNG locally and look at it before pushing (fit at 1200×630, ten rows).
5. After deploy: fetch the live `/og` PNG, read each row, quote it in the report; one fresh cold reader (N=1, synthetic) shown ONLY the live PNG, asked "what does this card say about whether the cycles hold up?" with the bar written before the walk.

Second leg, the due read (not the choice): I-062's one fresh cold walker on the final years-free wording, prompt and bar in `docs/walks/2026-10-22-i062.md` unchanged, 390x664, run AFTER the /og ship and one at a time.

First command:

```
node C:/dev/skylark/skylark-site/scripts/check-due-gates-dispositioned.mjs --run I-056 --dry-run
```

**Acceptance (observable):** the live `/og` PNG (fetched after deploy, served sha named) shows on each of its ten rows that cycle's verdict in `holdsUp.ts` words, and no phase word or position bar; the vitest red→green is recorded (portable rule 1); DEPLOY.md § 6 says what the card shows now. I-056 closes on that read. If the ten verdicts do not fit legibly at 1200×630, the fallback is a single answer line under the masthead ("None of the ten is testable on the record that exists yet"), and I-056 records that decision and its reason.

**Delivery and encounter:** delivery = drift in-sync on the ship's sha + the live PNG read. Encounter: blind for real users (a chat app's preview fetch is a Render request with no referer; crawl-read could only count `/og` fetches, not who saw them). The readable event is the synthetic cold read of the live PNG, N=1. Note: `/og` is `s-maxage=86400` and `ogCardCache` memoises per process, so the live read waits for the new deploy's process (a deploy restarts it); a platform card cache (Bluesky, X) may hold the old image longer, which is outside this read.

**USER-FACING: yes.** Paths: `src/app/og/route.tsx`, `src/lib/holdsUp.ts` (if a short form is exported), a new or extended test (`src/app/og/route.test.ts` or `src/lib/holdsUp.test.ts`), `src/lib/testedSeries.test.ts` (guard coverage), possibly `src/app/layout.tsx` + `src/app/(app)/cycles/page.tsx` (og:image alt), `DEPLOY.md`, `continuity/items.json`, today's report, a walk doc.

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice: 4 — I-034 (spawned-selftest timeouts under fleet load; substrate budget; 2 more full-suite runs owed), I-043 (/methods lead + row label copy), I-049 (cycle descriptions' full stops), I-062 (cold walk on the final wording: it RUNS in P3 as the second leg above, the hygiene helper only stamps it). Read: `check-due-gates-dispositioned --snapshot` → "5 gate(s) due on/before 2026-10-23" (I-034, I-043, I-049, I-056, I-062; 70 ledger rows swept). I-056 is selected and leaves this list.
- (b) owed child rows: none. Read: "rows owed to you in skylark-site's ledger: 0 of 759".
- (c) CROSSED state reads: 2 — dated gates due 5 of 70 (5 UNREAD at compose; 3 READ_NEVER_RUN: I-034, I-056 (now run, exit 1 = token absent), I-062); key numbers "no list yet" (docs/key-metrics.json absent). Not crossed: stale-actionable 0 of 16, queued rows 0, missingLinkedCommits nothing swept (0 of 0), HEAD CI GREEN, report PENDING as expected, board card 1 (spent).

<!-- findings:begin -->
- The packet's premise was half stale, and the packet said so: I-056's title ("still lists each cycle's current phase word and a position bar") was already false on 10-23, removed by I-061 (9849b93). The remaining defect was the missing answer.
- The manager review (b2000710, REDIRECT) replaced the acceptance: one answer line at 30px or more under the masthead, not per-row verdicts. Measured: at 360px wide the answer line reads; the row labels do not (the cold reader misread "peak 1789" as "peak 1765"). The redirect's HYPOTHESIS held.
<!-- findings:end -->

## P3 — Product-work loop

[P3 — Product-work loop]

**Action (kind: improve the product):** I-056, the main share card answers its own question, per manager REDIRECT b2000710.

**1. Implementation — 550df48, 562ab1f, 92fa188 on main.**
- Under the 84px "Do the cycles hold up?", at 34px: "Not yet: none of the ten is testable on the record that exists." Then: "No record covers the 3.0 full periods this site requires before testing. Ten long-wave cycles of history, on one shared axis." Caption: "Each drawn as at most one period around its reference peak, cut at today · 1600–2026".
- Words from `src/lib/holdsUp.ts` (`overallAnswer`, `holdsUpOverall`, `holdsUpOverallAlt`), counted from the frozen verdict rows at the STORED periods. A period/peak override card (`/og?period.<id>=`) keeps the answer and says "This card draws changed periods or peaks; the verdicts are for the stored ones."
- Home and /cycles og:image alt carry the same answer; the I-028 no-test-ran guard reads the answer, the alt and the calibrated note.
- DEPLOY.md § 6: canonical host (the old one permanently redirects), and the card as it is now.
- Tests: red 5 failed / 89 passed before the helper existed → green 116/116 (holdsUp, testedSeries, countWords, og route). The 30px leg red-armed: `fontSize: 24` → "expected 24 to be greater than or equal to 30", restored → green. Lint and `npm run typecheck` clean.
- CI ci.yml green on 92fa188b06 (1 completed success, 0 failures, 0 pending).
- Codex read-only, foreground pipe, banner workdir `C:\dev\skylark\sinusoidal-cycles` both rounds. r1 on 550df48: 5 findings, all CONFIRMED, fixed in 562ab1f (MED: a period override could make the detail false → answer from stored cycles + calibrated note; MED: tests passed with the answer deleted → font-size leg; LOW: "each cycle's page" → "each paired cycle's page"; LOW: "301s" → "permanently redirects" (next.config permanent = 308); LOW: "one period" → "at most one period …, cut at today"). r2 on 562ab1f: 2 LOW; the card caption CONFIRMED and fixed in 92fa188; the font-size test reading a source literal (a later style spread could hide a smaller size) DELIBERATE, a declared ceiling: it catches the deletion and direct change it was written for.
- Sibling sweep, "each drawn as one period" over the repo outside node_modules/.next/tmp: 4 hits, 1 fixed (the card). Carried: `public/llms.txt:3`, `src/app/poster/page.tsx:8`, `src/lib/countWords.ts:48` (I-061 wording, outside this card).
- Extremes rendered locally before push: the default card and `?period.perez=41` (the override note alone stays one line; with the standfirst it wrapped and pushed the last row into the footer rule, fixed before push).

**2. Delivery — on for users.** `check-deployed-sha-drift --service sinusoidal-history`: "sinusoidal-history in-sync live 92fa188b → head 92fa188b live commit IS the branch head". Live `/og` (bare URL): 200 image/png, 110,365 bytes (94,961 at 14:57Z before the deploy). Read by eye: the answer line under the masthead, no phase word, no position bar.

**3. Encounter — blind.** A link preview is fetched by the chat host, not the reader, and the site has no client analytics by standing choice (W-003). The share-encounter row is I-032 (its closeWhen waits on a referral from a messaging host, or W-005's 2026-11-04 read). Synthetic proxy (not an encounter): one fresh cold reader shown ONLY the live PNG at 360px, against the bar pre-registered in `docs/walks/2026-10-23-i056.md`: **HELD** ("Not yet … So the card's verdict is "untestable so far", not "false""; "No. No cycle is called rising, peaking, falling or near a peak today."; would tap: "a direct, slightly contrarian answer"). Residual: studying the small curves, a reader could infer a direction from where each is cut at today (I-063's family).

**4. Outcome — open.** No real reader has been seen meeting the card.

**Second leg, due read: I-062 cold walk on the final wording — HELD.** Production ccda0a8b, prompt and bar from `docs/walks/2026-10-22-i062.md` unchanged; the walker quoted "Widened to 150 years, the shortest view this chart draws." and called the strip "limited". Two new I-064 details recorded (Modern lights up and the URL reads `?range=modern` after a drag; the note pushes the strip down ~28px). Result appended to that walk doc. I-062 is closeable at P5.

**I-056: CLOSED** (`continuity-edit --close I-056`, receipt in the row's notes).

**Hygiene helper:** DISPATCHED ~15:11Z · draft `tmp/hygiene-draft-sinusoidal-cycles-2026-10-23.md` PRESENT. Nothing production-shaped (engineering-zero 0/0, wait-justification pass, 0 READ-MUTATED). It flags I-034's `waitJustification.until` = 2026-10-23 and its unWait (2 more local full-suite runs) as conflicting with the 10-21 no-local-verify-when-CI-green ruling: a re-scope for the close.

USER-VISIBLE: The main share card (the link preview for the home page, /cycles and every page without its own card) now answers "Do the cycles hold up?" right under the headline at 34px: "Not yet: none of the ten is testable on the record that exists." — 550df48 [proof: live /og answered only in a 14px "None confirmed" eyebrow (94,961 bytes, 14:57Z) → carries the answer line (110,365 bytes, after deploy), drift in-sync live 92fa188b, cold reader on the live PNG at 360px HELD] [coverage: none can see a link-preview reader; gsc-read.mjs sees search clicks only · last good read 2026-10-22 · founder+test excluded no] [exposure: blind — a preview is fetched by the chat host, no client analytics by standing choice (W-003) · bug row I-032]
