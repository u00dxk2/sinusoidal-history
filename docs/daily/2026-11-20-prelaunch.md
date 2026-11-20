# sinusoidal-cycles — 2026-11-20 (Friday, MT)

## BLUF

**P3 shipped it, live at 8245d1d (CI ci.yml green on 8245d1d1b5, deploy in sync), and the post-deploy proof reads 0 problems.** What changed for visitors:
- **/methods** is in the new design: the heading and kicker in the display face, the lede in Plex Serif upright. Its first-screen answer now fits with 18px spare at 320x568, 10px at 360x560 and 106px at 390x664. With the new faces and the old spacing it was 20px and 7px below the fold.
- **Turchin's violence database:** every place that said he "posts" it now gives the dated fact, for example "In August 2026 the project found the underlying database on Turchin's site with no reuse licence stated on its page, so this site does not redistribute it." That covers the verdict box, the caveat (cycle page, /about, /api/v1/cycles), /methods, /cycles, and both `.md` mirrors.

SCREENS.md: DONE 9 · NEXT 5 · HOLD 0 · N/A 7. I-088's closeWhen is met. The row closes at P5.

**P1: today's change is /methods moving into the new design system, with the Turchin licence sentence narrowed to a dated fact on every surface that carries it (I-088, pulled forward from 11-24).** Nothing a visitor sees has changed yet. /methods is the most-seen screen still in the old faces. Its first screen ran 7px below the fold at 360x560 when the new faces were applied on 2026-11-17, so its kicker and lede are re-budgeted first. I-088's sentence ("Turchin posts the underlying database …") is present-tense on six source surfaces, and the page it cited now redirects to a page with no file link. The order binds: round 0 (a fact list), then a Codex claims pass on the fact list, then the words. Section 0 is clean: CI is green on c25ff52, the deploy is in sync, and the morning snapshot shows 0 due. The packet is under Recommendation and is waiting for the manager review.

## What changed

**P3 (I-088 with I-087's /methods row; manager review APPROVE 0107fd42).**
- **Commits:**
  - 2849895: the words on every surface, `data-dp` on /methods, the lede rule, and the runner;
  - a097260: the /methods re-budget below sm, plus Codex r2's runner fixes;
  - 456f968: the runner's claim check reshaped to named targets, after Codex r3;
  - 8245d1d: the /cycles target is `main`;
  - a later docs commit: the /cycles `<details>` read, SCREENS.md and this report.
- **Round 0:** a Sonnet helper's fact list, `tmp/sinusoidal-cycles-round0-i088.md`. It found the caveat feeds /about, the cycle page and the API; a test ties `about.md` to `cycles.json`; `cycles/page.tsx:84` is Goldstein's, not Turchin's; and on /methods, `header > p` would set the lede in the label face.
- **The current location of the file:** UNVERIFIABLE-HERE. Three pages were fetched today: the old page (it redirects to "Age of Discord II"), the site search (it returned the home page, so it is UNREAD) and the sitemap. All three show 0 hits for `.xlsx|USPVD|Political Violence Database|violence-database`. A positive control on the same pages found 7 hits for `violence|dataset|download`. Per the manager review, the dated sentence shipped without waiting on it (`docs/claims/2026-11-20-i088-web-search.md`).
- **Codex (read-only, gpt-6.2-sol, the banner workdir `C:\dev\skylark\sinusoidal-cycles` checked on every run):**
  - claims r1 on the proposed sentences: S1-S3 and S5 HOLD · SUPPLIED. S4 was REFUTED-AS-WRITTEN ("stated" put the observation on the database itself) and replaced with Codex's sentence. Record: `docs/claims/2026-11-20-i088-codex-claims-r1.md`.
  - r2 on 2849895: the copy, the mirrors and the CSS scope were clean. The new rule matches only the /methods lede. 4 runner findings (2 MEDIUM, 2 LOW), all CONFIRMED and fixed in a097260.
  - r3 on a097260: the committed classes equal what the probe measured, and every held sentence is byte-identical to its source. 3 runner findings. Two were the SAME class as r2's (the raw-response matcher), so per the stop-patching rule the matcher was replaced, not patched, in 456f968. Each check now reads one named target the way its reader gets it, with no normaliser. The third, a LOW port race in local mode, is declared as a ceiling in the runner's header.
- **Tests:** `holdsUp.test.ts` and `i080Claims.test.ts` pass, 54 of 54. Red-armed: with the flag on and the old sentence restored, `holdsUp.test.ts` fails 1 (turchin-fathers-sons); restored, it passes. **Found:** without the flag the test renders only the flag-off sentence, so CI, which runs flag off, does not cover the flag-on box sentence.
- **Heavy jobs, one at a time:**

  | Run | Queue wait | Peak | Result |
  |---|---|---|---|
  | `run-i088.mjs`, flag-on build | 12m52s | 2,071 MB | red-before 8 of 8 red; every leg green except the /methods fold (CUT 20px at 320x568, 7px at 360x560) |
  | `probe-methods-fold.mjs` run 1 | 21m17s | 764 MB | discarded: it lacked the tree's lede rule and its baseline did not reproduce the build |
  | `probe-methods-fold.mjs` run 2 | 42m08s | 729 MB | baseline CUT 20 / CUT 7 (control held); the chosen candidate: 18px and 10px spare |
  | `run-i088.mjs --live` red-arm on production, before the push | 40m47s | 704 MB | 12 BAD as designed; the /cycles target read MISSING (its root is a div), fixed in 8245d1d |
  | `run-i088.mjs --live` after the deploy | 25m52s | 885 MB | 1 BAD: /cycles read NEITHER, because the sentence is in a closed `<details>` and innerText skips it |
  | `run-i088.mjs --live` after the deploy, with the `<details>` opened | 6m37s | 649 MB | **PASS, 0 problems** |

- **Delivery:**
  - CI: `check-ci-status --workflow ci.yml --sha 8245d1d1…` GREEN.
  - Deploy: `check-deployed-sha-drift --service sinusoidal-history --wait --sha 8245d1d1…` in-sync, live 8245d1d1 = head.
  - A signed-out GET of /methods returned 200 with `article data-dp` and "was on his site in August 2026". "is posted on his site" is absent.
  - A signed-out GET of /cycles carries "August 2026 check found on Turchin" twice and "database he posts" 0 times.
- **The proof of record (run-i088 --live, PASS):**
  - all 8 claim targets read NEW;
  - H1 and kicker dpDisplay 600, lede dpText 400, all upright and loaded;
  - /methods has 100 → 100 lines with exactly 1 difference, the note;
  - the unpaired box carries the held sentence at 360 and 390, with one `#caveat`;
  - check-entry-folds is 13 of 13 at 320x568, 360x560 and 390x664.
- **Visible side effect:** 92 `.font-mono` elements on /methods (the verdict-table metrics, source lines, inline code) now take the display face, through the same rule /about already gets. Codex r2 read it as consistent.
- **Receipt:** USER-VISIBLE: /methods is in the new design with its first-screen answer above the fold on phones, and every surface that said Turchin "posts" his violence database now states what the August 2026 check found — 2849895 [proof: production said "is posted on his site" / "Turchin posts the underlying database" with /methods in the old faces before → after the deploy, drift in-sync live 8245d1d1, a signed-out GET of /methods shows data-dp and "was on his site in August 2026", and run-i088.mjs --live reads PASS (8 of 8 claim targets NEW, folds 13/13 at three sizes)] [coverage: Search Console page-only (gsc-read.mjs) · last good read 2026-11-18 · founder+test excluded no] [exposure: blind — no client analytics or visitor instrument by standing choice; Search Console shows impressions, never a read · bug row I-087]

## Recommendation

### P1 selection packet
[P1 — Evidence and choice]

- **Outcome:** /methods enters the design system (the flag-on faces, with the first screen re-budgeted so the "In brief" answer clears the phone fold), and every surface that says Turchin posts his violence database states a dated fact instead. Items **I-088** (the sentence; selected) and **I-087** (its SCREENS.md `/methods` NEXT row). Kind: improve.
- **The user problem, in a reader's words:** the bar's own (HYPOTHESIS, `docs/evangelism-bar.md:14`): "I can't tell whether any of it holds up or is just a good story." What breaks the moment is "any sentence that overclaims" (`:24`). A reader who follows "Turchin posts the underlying database" to his site finds no file there today.
- **David's direction** (chat, quoted in the 11-19 primer, lines 16 and 19): "go - substrate next - then a full design and copy round after that." and "We'll continue with the design / copy updates tomorrow please make sure we stay on track with that tomorrow."
- **Evidence:**
  - OBSERVED · I-088 readCommand, run today, exit 0: 5 lines on 5 files — `public/about.md:155`, `public/methods.md:205`, `src/app/(app)/methods/page.tsx:449`, `src/data/cycles.json:128`, `src/lib/designPassCopy.ts:66`, plus the test pin `src/lib/holdsUp.test.ts:63`.
  - OBSERVED · the readCommand misses a surface that carries the same claim in other words. A wider grep found `src/app/(app)/cycles/page.tsx:179` ("the violence database he posts carries no reuse license"). The row's description names it, but its readCommand would read 0 on it. (Correction after the post: `:84` is Goldstein's data files, not Turchin's, so it is out of I-088's scope. The round 0 grep showed this; the posted packet had it wrong.) That is the 11-18 Q0 finding ("a check that passed for the wrong reason") in advance, so the readCommand is widened before any word changes.
  - SUPPLIED (I-088 description, the 11-19 close read; not re-run today) · the old USPVD page now redirects to "Age of Discord II", whose HTML carries no `.xlsx`, "USPVD" or "download". Only those two pages were searched. The 2026-08-24 fact-check (`docs/fact-check-2026-08-24-round-5.md:14`) verified the file live then.
  - OBSERVED · `cycles.json:128` also feeds the cycle page caveat, `/api/v1/cycles` and the `/about` list, and `public/about.md:155` mirrors it. `/methods` `page.tsx:448-450` mirrors `public/methods.md:205`. So the mirrors move in the same commit (AGENTS.md).
  - OBSERVED · `/methods` is in the old faces: it carries no `data-dp` (the 8 files that do are cycles, cycle page, globals.css, colophon, about, designPassFonts, not-found, error). Its header (`methods/page.tsx:46-60`) has per-breakpoint spacing from the 2026-09-25/26 fold fixes. SCREENS.md row: "with the pass's faces its first screen ends 7px below the fold at 360x560 (flag-on local build, 2026-11-17) … It needs its kicker and lede re-budgeted first".
  - SUPPLIED (11-19 P1 packet, heavy-gate read) · live folds at 320x568 on the old faces: /methods 1px spare.
  - OBSERVED · rotation: `check-cycle-rotation --lane sinusoidal-cycles` exit 0, "no product-love cycle picks this lane today … run the normal P3".
  - OBSERVED · free memory 20.5 GB (20,506,812 KB) at P1. The 11-19 retro measured a build at 2,236 MB peak, so the runner declares `--mem 2.5`.
  - MISSING · `docs/evangelism-evidence.md`, `docs/key-metrics.json`. The bar reads UNMEASURED (`evangelism-bar.md:30`). There is no client analytics by standing choice, so the encounter read is blind.
  - HYPOTHESIS · that a reader has followed the link and found no file. No reader is on record. This is the bar's overclaim rule applied to a read of the source page, not an observed failure.
- **Why not the others:** the home chart's faces are second on today's lead and next if the round has room. Embed, embed docs, poster and the share card stay on 11-24. The share card changes every shared link's preview, so it is decided on its own.
- **Prior-retro findings that bear on this:** (1) 11-19 Q0, still on discipline: "a check that passed for the wrong reason". This is answered above by widening I-088's readCommand before the words. (2) 11-19 Q5: an UNVERIFIABLE-HERE verdict gets a disposition like any finding. Today's claims pass will meet this, because the file's current location may be UNVERIFIABLE-HERE again.
- **Permission:** lane-owned copy and styling. There is no sign-in, payment, account or data screen. No open card names it (`answered-cards --project sinusoidal-cycles`: 0 lane cards, 4 portfolio riders, all skylark-site, 0 new). I-088's closeWhen fixes the gates: round 0, a Codex claims pass, CI, deploy and a signed-out GET, with the mirrors moving together.
- **Next action:** kind = improve. Prep now, with no commit: round 0. That is a fact list with file:line for every surface carrying the claim, the dated sentence from I-088's closeWhen, one bounded search of peterturchin.com for the file's current location (search space named), and every word the /methods re-budget would change. Then the Codex claims pass on the fact list (read-only, banner workdir checked). First command:

  ```
  git -C C:/dev/skylark/sinusoidal-cycles grep -n -i -e "Turchin posts" -e "posted on his site" -e "database he posts" -e "His own data files" -e "USPVD" -e "Political Violence Database" -- src public scripts
  ```

  At P3: the words come from the held facts, in one commit with the mirrors (`about.md`, `methods.md`), `holdsUp.test.ts:63`, `public/llms.txt` swept, and I-088's readCommand widened. /methods goes under `[data-dp]` with its kicker and lede re-budgeted. ONE heavy-gate admit (`--mem 2.5`) runs one runner on a flag-on local build: folds at 320x568, 360x560 and 390x664, plus the faces check on /methods in the `run-below-box` shape, red-armed on production before the deploy. Then a Codex read-only diff review, CI green, the deploy, and signed-out GETs.
- **Acceptance condition:**
  1. On production, I-088's widened readCommand returns 0 lines in `src` and `public`, and every surface states the claims-pass-held dated sentence (or a re-verified location). `/api/v1/cycles` and `/about.md` carry the same words.
  2. A signed-out GET of /methods carries the design-pass faces (`data-dp`). The faces check reads 0 elements off the expected face, red on production before the deploy and green after.
  3. `check-entry-folds` reads 13 of 13 at 320x568, 360x560 and 390x664, with /methods at ≥ 0px spare at each size.
  4. /methods' rendered text is unchanged except the held sentences; any word changed on the page is changed in `public/methods.md` in the same commit.
  5. CI is green on HEAD, the deploy is in sync, and SCREENS.md `/methods` → DONE with counts updated. I-088 closes per its closeWhen.
- **Delivery and encounter checks:** delivery = `check-deployed-sha-drift --wait --service sinusoidal-history --sha <full sha>` in sync, then signed-out GETs of `/methods`, `/methods.md`, `/cycles`, `/cycles/turchin-fathers-sons`, `/about.md` and `/api/v1/cycles`. Encounter: Search Console page-only on /methods (`gsc-read.mjs --start 2026-11-20`, readable ~11-25). It shows only that a page was shown. A reader's reaction is not readable at any N this month.
- **Key number:** places that serve the unverified present tense: 7, from 6 source files (the verdict box, the cycle-page caveat, `/api/v1/cycles`, one line on /cycles, /methods, and the `about.md` and `methods.md` mirrors). Target 0.
- **USER-FACING: yes.** Paths: `src/app/(app)/methods/page.tsx`, `src/app/globals.css` (if the `[data-dp]` rules need a /methods reach), `public/methods.md`, `src/data/cycles.json`, `public/about.md`, `src/lib/designPassCopy.ts`, `src/app/(app)/cycles/page.tsx`, possibly `public/llms.txt`. Tests and checkers: `src/lib/holdsUp.test.ts`. Internal: `continuity/items.json`, `docs/SCREENS.md`, `docs/claims/`, this report.
- **Section 0:**
  - Listener 🟢: SSE hello 14:52:03Z, replay 0, slug match. The loop is armed by ScheduleWakeup and waker rungs 1-3 are running. Posted as 67e01abd.
  - CI: `check-ci-status --workflow ci.yml` → GREEN on c25ff52397.
  - Drift: `--service sinusoidal-history` → in-sync, live c25ff523 = head.
  - Codex: GREEN, from the kickoff probe (machine-level exec and write, 14:49Z).
  - Harness: running 2.1.329 · fleet UNIFORM (28 of 28) · installed 2.1.329 (SAME).
  - Morning snapshot: "0 gate(s) due on/before 2026-11-20".
- **Recs yesterday** (11-19 report and close):
  - The 11-19 P1 packet (I-077 / I-078): executed (44cb739 live, walk HELD, both rows closed).
  - I-088, dated 11-24: carrying today → this packet (pulled forward by today's lead 3).
  - I-087 NEXT batch, dated 11-24: /methods carrying today → this packet. The home chart's faces → P3 if the round has room, else 11-24. Embed, embed docs, poster, share card and sizes under 16px → 11-24, not today.
  - I-086 → 11-24, I-071 → 11-25, W-007 → 11-28: not today.
  - The four carried LOWs from 11-19 P3: still carried, none bears on today's change.
- **HYGIENE INPUTS:**
  - (a) Due rows not bearing on the choice: none — read `check-due-gates-dispositioned --snapshot` (0 due).
  - (b) Owed child rows: none — read the kickoff's "rows owed to you in skylark-site's ledger: 0 of 850 considered".
  - (c) State reads marked CROSSED: 1. "board cards carrying David's word: 4": 312499ee, ba1578df, 3ef4f9e4, 4a0c2c7e, all skylark-site, "governs: unlinked". 312499ee (heavy jobs) governs how this lane runs heavy work today. Its items 2 and 3 are applied in the runner plan above. Disposition: read.

## State Appendix

- Morning snapshot: `tmp/due-gates-snapshot.json`, 0 due.
- HEAD at P1: c25ff5239792a9b2ba68f0c4ed9fc34095c356b2.
