# sinusoidal-cycles — 2026-11-15 (Sunday, MT)

## BLUF

**P3 shipped it, live b0da386f (CI ci.yml green on b0da386f5c, deploy in sync).** Each of the ten /cycles entries now carries one line, such as "Can't be tested yet: its record is 73 years too short." Kondratiev and Turchin name the record their verdict is judged on. The unpaired cycle says it is not tested. On production the page's text gained exactly those 10 lines and lost none, and the phone first screen is unchanged (13 of 13, /cycles 7px spare). Codex r1: 0 defects, and every string HOLDS. Encounter blind; outcome open (I-082).

**P1 picked one change on /cycles: each of the ten entries says its own verdict.** /cycles is the page Search Console showed most this week: 12 of 22 impressions since 11-08. Its title asks "Do history's cycles hold up?", but each entry names only its paired series. The per-cycle answer, for example "needs 73 more years" for Dalio, sits in a table about 3,000px below the roster. A reader who came for Dalio sees Dalio's answer in Dalio's entry. Round 0 (a Sonnet fact-listing helper) went out at P1 prep, before any wording exists. Section 0 is clean: CI green on 162a8043, deploy in sync (live 162a8043 = head). The one due gate, I-049, was read: /cycles 12, /about 6, /methods 1, /cycles/dalio 1 page impressions. Nothing is ready to ship yet, and no commit touches the change until the review.

## What changed

**P3: each /cycles entry states its own verdict (I-082). Shipped 2f533e3, then b0da386; live b0da386f; CI ci.yml green on b0da386f5c.** Manager review de6ac390: APPROVE, with the instruction that the line beside a verdict must name the series the verdict is judged on.

- **Code:**
  - Each entry in `src/app/(app)/cycles/page.tsx` gets one line under "Paired data", built by `entryVerdict`. It reads "Can't be tested yet: its record is N years too short."
  - Kondratiev and Turchin read "the record it is judged on, <judged name>, is N years too short." The judged name comes from `judgedCut` (`src/lib/testedSeries.ts`).
  - The unpaired fathers-and-sons cycle reads "Not tested: there is no paired record to test it against."
  - The shortfall arithmetic had three copies: VerdictTable, the cycle page's box, and now the index. It is now one exported `yearsShortOfFloor` in `src/lib/spectral.ts`.
  - `public/llms.txt`'s Cycles-index line says what an entry now states.
- **Test, red-armed:** `src/lib/cyclesIndexVerdict.test.ts`. Its oracle reads the raw verdicts.json and series.json and takes the judged names from the frozen lay_text.
  - On the prior tree, 19 of 22 failed. After the change, 22 of 22 passed.
  - After Codex r1, two legs were added: the line sits before the closed "longer story" panel with no hiding class on its own tag, and each entry's shortfall equals its VerdictTable row. With +1 on the entry shortfall, 10 of 24 failed. With `class="hidden"` on the line, the placement leg failed.
  - The first draft of the placement leg passed the hidden mutation. It read the 200 characters before the attribute, and `class` renders after it. It now reads the line's whole opening tag.
  - The six related test files pass 179 of 179. Typecheck and lint are clean.
- **Codex r1 on 2f533e3** (gpt-6-astra, read-only foreground pipe, banner workdir `C:\dev\skylark\sinusoidal-cycles` matched, exit 0):
  - Job 1, the claims pass: all 10 entry strings and the llms.txt line HOLD. Every number was checked against its frozen verdicts.json row and its CSV's first and last years. Kondratiev and Turchin were checked by name.
  - Job 2: no defects. The refactor leaves every VerdictTable and cycle-page value unchanged.
  - The test's blind spots it named: placement and visibility, agreement with the table, appended false claims, and the eligible branch. The first two are closed in b0da386. The other two stay: a substring test cannot ban every appended sentence, and the eligible branch is unreachable on today's frozen rows.
- **Live reads on b0da386f:**
  - `check-deployed-sha-drift --wait --sha b0da386f…`: OBSERVED in sync after 1 poll.
  - Production /cycles snap: before 313 lines, after 323. The line multiset differs by exactly the 10 new entry lines, with 0 removed.
  - `check-entry-folds --width 320 --height 568`: 13 of 13, with `/cycles` at 7px spare (unchanged).
- **Encounter:** blind. There are no client analytics, by standing choice (card 1e069bb4). Search Console sees /cycles impressions, never a reader meeting an entry.

P1 (selection and prep) is recorded below.

- **Section 0:**
  - Primer: `docs/cold-starts/2026-11-14.md` was read first. No `2026-11-15.md` exists.
  - Listener: 🟢 SSE alive (hello 16:55:34Z, replay 0) + loop armed by tool call. All three waker rungs are running.
  - Codex: GREEN (kickoff probe 16:52:43Z: execute and write both proved).
  - CI: `check-ci-status --workflow ci.yml` → GREEN on 162a8043d8 (1 success, 0 failures).
  - Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 162a8043 = head.
  - Harness: running 2.1.325 · fleet UNIFORM (27 of 27) · installed 2.1.325 (SAME). The tracked record says 2.1.277, so the script prints CHANGED. That record is old and this is a READ, not a stop.
  - Recs yesterday: the 11-14 Recommendation block was that day's P1 packet (I-081). Executed: 927a088 + 7dbfbb9, live 7dbfbb9f, and I-081 is closed.
- **Morning snapshot** (`check-due-gates-dispositioned --snapshot`): "1 gate(s) due on/before 2026-11-15", I-049.
- **I-049 read** (`check-due-gates-dispositioned --run I-049`, exit 0, 2.95s). `gsc-read.mjs --start 2026-11-08` uses page-only grouping. Window 2026-11-08..2026-11-15: 22 impressions and 1 click, and the click went to `/`. The four counts the onTrigger asks for are /cycles 12, /about 6, /methods 1 and /cycles/dalio 1, all with 0 clicks. Limits: Search Console lags by about two days, so the last days of the window are partial. Impressions count who was shown a page, not who read it. The close applies the row's onTrigger (see HYGIENE INPUTS).
- **Fold baseline** (`check-entry-folds --width 320 --height 568`, production): 13 of 13, with `/cycles` at 7px spare. That leg measures `header + ul > li:first-child p`, the first entry's description.
- **Round 0 dispatched** at P1 prep (memory `feedback_round0_at_p1`). For every pairing it lists the series the entry names against the series the verdict is judged on, the record's first and last year, years short, every existing verdict phrase on the site, and the copy rulings, each with `file:line`. P3 writes the words from that list.
- **Round 0: helper 54 lines**, returned after the P1 post (`tmp/round0-cycles-entry-verdict-2026-11-15.md`). It is a helper's list, not yet checked against source by me. P3 confirms each fact before relying on it. Three facts for P3:
  - All 9 primary verdicts are insufficient data. Years short, in index order: Schlesinger Jr. 18, Kondratiev 85, Perez 7, Huntington 36, Dalio 73, Strauss-Howe 16, Modelski 178, Khaldun 149, Turchin 339. These match `public/methods.md`.
  - **The index's "Paired data" line is already inexact on two entries.** Kondratiev names the 5-year rolling TFP series, but its verdict is judged on the annual unsmoothed series. Turchin names the wealth-share series from 1820, but its verdict is judged on the 1913-onward cut. I-030 and I-035 fixed this on the cycle pages only. So a verdict placed beside that line must name the cut it is judged on, or the line must change with it.
  - **The records end between 2011 and 2025.** Khaldun's ends in 2011. So the words must say how much longer the record would need to be, never "N years from now". The phrase family on the site is VerdictTable's "needs N more years" and the cycle page's "Roughly N more years of that measurement would reach the floor" (`src/app/(app)/cycles/[id]/page.tsx:191`, per the helper).

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** each /cycles entry states its own verdict (no row yet; P3 mints one if the review approves). Kind: improve.
- **The user problem, in a reader's words:** no reader has said it. The nearest words are the bar's: "I can't tell whether any of it holds up or is just a good story" (`docs/evangelism-bar.md:14`, HYPOTHESIS). The bar's moment is "a plain verdict on whether the record can even test it" (`:20`). On the index, that verdict is not where the reader is.
- **Evidence:**
  - OBSERVED · Search Console, page-only grouping, read today (I-049): /cycles had 12 of the site's 22 impressions since 11-08 at average position 7.7, with 0 clicks. It is the most-shown page. On 11-14 the 10-15..11-14 window gave /cycles 35 of 89.
  - OBSERVED · source, read today: each entry prints only `Paired data - ${series.name}` (`src/app/(app)/cycles/page.tsx:303-307`). The per-pairing verdict and its years short appear only in `VerdictTable` (`src/components/VerdictTable.tsx:9-13, :39-48`), placed after the roster (`page.tsx:347-375`). The page's own comment puts that section about 3,103px down at 390x664 (`page.tsx:215`).
  - OBSERVED · the production rendered text (`tmp/i049-cycles.txt`, snapped 11-08; the roster has not changed since): ten entries with no verdict word, then "Does any of them hold up?" at line 124 of 313.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` exited 0: "no product-love cycle picks this lane today … run the normal P3".
  - HYPOTHESIS · that an arriving reader looks for one named cycle and stops at its entry. Nobody has walked this. The header's "See which ones, and how short ↓" link exists because a 2026-09-30 cold walk (I-015) could not find the answer.
  - MISSING · `docs/evangelism-evidence.md` does not exist. The bar reads UNMEASURED (`docs/evangelism-bar.md:30`), and there are no client analytics, by standing choice (card 1e069bb4).
  - MISSING · `docs/key-metrics.json` does not exist (kickoff: "no list yet").
- **Why not the open rows:** I-075, I-077 and I-078 all change the phone home first screen. The 11-17 I-075 re-walk must see the same screen the 11-13 walker saw (`docs/walks/2026-11-13-i075.md`). I-071 (zoom snapping) is dated 11-18, and it is a reading-precision note with no failure. I-042 waits on a spectral re-freeze. This change is on /cycles, away from the home figure.
- **Prior-retro finding that bears on this** (11-14 Q0, "round 0 before the sentence exists": did not recur). It applies today, and round 0 went out before any wording.
- **Permission:** lane copy and code in lane-owned files. No open card names /cycles (`answered-cards --project sinusoidal-cycles`: 0 lane cards, 2 portfolio riders, 0 new). Binding rules: I-061 (no present position, so the words say what the record lacks and never where today sits on a cycle) and the copy rulings in memory `project_copy_rulings`. The VerdictTable's rows and its methods.md mirror stay unchanged.
- **Next action:** kind = improve. When round 0 is back, write a source-pinned test that each entry carries its pairing's verdict words, and prove it red on today's tree. Then render them from the same `spectralPrimary` arithmetic `VerdictTable` uses, with no second copy of the formula. The first command is the rendered-text baseline of production /cycles, taken before any edit:

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles C:/dev/skylark/sinusoidal-cycles/tmp/cycles-before-2026-11-15.txt
  ```

- **Acceptance condition:**
  1. On production /cycles, each of the 9 paired entries carries its own verdict and the years its record is short, matching its VerdictTable row exactly. The unpaired entry says it has no series to test.
  2. The words pass the claims pass before the first commit. Where a verdict is judged on a different cut from the series the entry names, the words do not imply the named series' own span.
  3. A source-pinned test is red on today's tree and green after.
  4. No regression: `check-entry-folds --width 320 --height 568` still reads 13 of 13, with `/cycles` at 7px or more spare. The measured element is the first description, and the verdict goes after it. The rendered-text multiset of /cycles before → after differs only by the added verdict lines.
- **Delivery and encounter checks:** delivery means `check-deployed-sha-drift --service sinusoidal-history --wait --sha <full sha>` reads in sync, then a production snap of /cycles shows the ten verdict lines. That is a server-rendered page, so `check-rendered-text` can see it. Encounter: Search Console /cycles impressions after the deploy are a proxy for who was shown the page, never for who read it. A read could come from the next dated GSC look, about 7 days out, at the current ~12 a week. Clicks from /cycles to a cycle page are blind (no client analytics).
- **Key number:** /cycles entries that state their own verdict. Today it is 0 of 10, from a source read (`page.tsx:303-307`), and 10 of 10 after. It is NOT measured live yet: P3 measures it on production with the before-snap above.
- **USER-FACING: yes.** Paths: `src/app/(app)/cycles/page.tsx`, plus possibly `src/components/VerdictTable.tsx` or `src/lib/spectral.ts` if the years-short arithmetic is exported for reuse. Internal: a new or extended test under `src/lib/`, `continuity/items.json`, `docs/daily/`. /cycles has no prose mirror. P3 checks `public/llms.txt` for a description of the index entries.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: 1. I-049 (monitoring, due 11-15) was read today: /cycles 12, /about 6, /methods 1, /cycles/dalio 1. Its onTrigger says record the four counts and close the row, with the outcome open. Read: `check-due-gates-dispositioned --snapshot` → "1 gate(s) due on/before 2026-11-15".
  - (b) owed child rows: none. Read: kickoff "rows owed to you in skylark-site's ledger: 0 of 823".
  - (c) state reads marked CROSSED: 2. (1) "dated gates due today: 1": I-049, above. (2) "board cards carrying David's word: 2": dd410b2a (screenshot piles) and 2516f28c (refactor-night permission rules). Both are skylark-site cards, "governs: unlinked". dd410b2a binds this lane's captures: commit only the pictures a report points at as proof. 2516f28c names no work for this lane today. Disposition: read; dd410b2a is followed at P3.

## State Appendix

- Kickoff: orchestrator f6a3845d (2026-11-15T16:59:51Z), body file sha256 84ac1e28…, VERIFIED.
- Composer state reads (16:59:19Z): HEAD CI GREEN (run 43629430290), queued rows 0, stale-actionable 0 of 11, report artifact PENDING (this file).
- Search Console still lists `/state/2026` (1 impression). That route redirects permanently to /cycles since I-061 (2026-10-21), so this is an index that has not caught up, not a served page.
