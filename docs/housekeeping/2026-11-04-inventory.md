# Housekeeping inventory: sinusoidal-cycles, 2026-11-04 (MT)

Stage 1 of the 11-04 housekeeping night: READ-ONLY. No file was moved, edited or deleted to produce this. The only write is this file. Two read-only Opus helpers did the docs truth-check and the reader-greps; their full working tables are summarised here, and every row below was either measured by the lead or carries the helper's file:line evidence. Two of the helper claims were re-checked by the lead (README's spectral contradiction at L286/L421-424 and the dead `state/[year]` / `stateOfCycles.ts` tree lines; the claimQuestion attribution at `cycleRoutes.ts:222/303`). Both held.

## Baseline

| Measure | Value | Command |
|---|---|---|
| Loaded every session | CLAUDE.md **12 B** (`@AGENTS.md` only) + AGENTS.md **13,592 B** (13,434 B with LF line endings) = **13,604 B**. No other @-import. | `(Get-Item CLAUDE.md).Length`, `(Get-Item AGENTS.md).Length` |
| MEMORY.md | **18,062 B**, 60 lines, 60 links (74% of the 24.4 KB limit) | `(Get-Item <memdir>\MEMORY.md).Length` |
| Memory files | **60** `.md` besides MEMORY.md, **149,959 B** in all; 0 dead links, 0 unindexed files | link regex over MEMORY.md vs `Get-ChildItem <memdir>` |
| Tracked files | **477** (docs 213, src 123, continuity 48, public 37, scripts 33) | `git ls-files \| Measure-Object` |
| Dead references | **0**. Search space: 134 unique paths in **6 docs** (live-doc list + latest 2 primers + items.json); 12 skipped as gitignored. Blind to the other ~200 docs. | `node C:/dev/skylark/skylark-site/scripts/check-doc-references.mjs` (exit 0) |
| Ledger open past due | **0** of 16 non-closed rows (14 open, 2 monitoring; 70 closed). The date field is `nextEvaluation` (this lane has no `nextCheckDate`). Due 11-05: I-043, W-006. | PowerShell over `continuity/items.json` |
| CI on main | **success**, 86b81eb ("docs(close-session): 11-04 session closed…"), run 41877807908 | `gh run list --branch main --limit 3` |

## Docs findings

**AGENTS.md is TRUE except for four lines.** Every path, script and npm command it names exists. The behaviours it describes match the code: /state 308 at `next.config.ts:30-37`, the 410 at `api/v1/state/route.ts:22`, `sampleDrawnPeriod` at `cycleMath.ts:78`, `checksPass` at `render.yaml:13`, the tsconfig exclusions, and the spectral flags plus 99,999 draws.

| Where | Verdict | Fix |
|---|---|---|
| AGENTS.md L120 | STALE, wrong file. It says the claim-page title, H1 and FAQPage "come from `claimQuestion.ts`", but that file builds only the answer text. The title is built at `cycleRoutes.ts:124`, the FAQPage at `cycleRoutes.ts:303`, the H1 at `cycles/[id]/page.tsx:287`. | one-sentence correction |
| AGENTS.md L24 | STALE, incomplete. CI also runs `npm audit --omit=dev --audit-level=critical` (`ci.yml:55-57`). Already an itch at `housekeeping-ledger.md:11`. | add the step |
| AGENTS.md L72-73 | STALE name. The "State of the cycles" panel was renamed with I-061 (`NowSummaryPanel.tsx:6`). | rename in place |
| AGENTS.md L19 | Version scope. The hazard was re-measured on 16.3.5; the repo runs 16.4.1 and has not been re-probed. The rule "keep writing `{" "}`" stands. | note it, no rule change |

**README.md has two contradictions and two dead paths.**
- **CONTRADICTION:** L51-60 says the spectral verdict shipped (Phase 15). L286 says /methods explains "why spectral analysis is deferred", and Non-goals L421-424 says it is "flagged on /methods as future work". /methods has no such text (grep: 0 hits).
- **DEAD PATHS** in the project tree: L303 `state/[year]/page.tsx` and L334 `lib/stateOfCycles.ts`.
- Other stale lines:
  - L333 lists `phasePosition`/`phasePositionLabel`, both deleted.
  - L158 names d3 sub-packages that are not installed (only `d3` and `d3-brush` are).
  - L180 gives the wrong gloss for typecheck (it runs `-p tsconfig.test.json`).
  - The L213 field table is missing `question`.
  - L314 still says "State of the cycles".
  - L397-400 tells you to add a Squarespace CNAME (legacy, superseded per DEPLOY.md:3-7).
  - The L341-353 docs and scripts trees list 7 docs and 4 scripts, against 213 and 33 tracked.
- **README has no "start here for an agent" section.** A draft (9 items, every path real) is ready for Stage 2.

**Core docs that still describe the site before I-061 (10-21):**
- `docs/key-user-flows.md` flows 1-2 describe:
  - the now-dot (L30);
  - the "State of the cycles" panel (L37-42);
  - "moving the peak re-labels the phase" (L47-48);
  - the "where this year sits" sentence and "Every cycle in <year> →" (L52-56);
  - `/state/<year>` as an exit and an arrival point (L62, L67-70).

  All of these were retired. **This is the doc /journey-walk reads to plan a walk, so a stale flow map seeds walks of surfaces that no longer exist.**
- `SECURITY.md:20` counts three read-only endpoints; two are live and state answers 410. `SECURITY.md:36` says three JSON-LD pages; there are two.
- `repo-health.json:29` lists `/api/v1/state` as a live endpoint "for each cycle's computed phase".
- **CONTRADICTION:** `daily-config.md:35` names `CHANGELOG.md` as the ship log. Its newest entry is 2026-10-11, and its top entry describes the "where this year sits" sentence that I-061 deleted. Since then the dailies and items.json have been the log in fact. **Stage 2 needs a choice:** retire CHANGELOG as the ship log (daily-config points at docs/daily/), or resume it. The proposal is to retire it, keeping the file as history up to 10-11.
- `evangelism-bar.md:34` still dates the W-005 read to 2026-11-04; it was re-pointed to 2027-01-04 today.
- Confirmed absent: `docs/lane-brief.md`, `docs/README.md`, `docs/key-metrics.json`, `docs/model-seats.json`. **The brief lists three of these as substrate-read paths. None exists in this lane.** Flagged to the orchestrator; nothing is created tonight without a reader that wants it.

**Placement: AGENTS.md whole-section moves, about 4.0 KB (about 30%) off the loaded file.**

| Section (lines) | LF bytes | Bites when | Proposal |
|---|---|---|---|
| nextjs block (1-9) | 678 | regenerated by `next dev` | KEEP (must) |
| JSX whitespace (11-19) | 1,982 | every prose-JSX edit | KEEP |
| CI, hook, traffic (21-52) | 2,212 | every ship and every new test | KEEP |
| **Rendered-text gate (54-89)** | 2,564 | only before a refactor or dependency bump | **MOVE → `docs/rendered-text-gate.md`**, one-line pointer |
| Prose mirrors (91-102) | 871 | any prose edit | KEEP |
| New-cycle checklist (104-123) | 2,517 | carries the I-061 no-position invariant, which bites on every UI edit | KEEP (proposal: retitle it so the invariant is visible in the heading) |
| cos-math audit (125-135) | 781 | rationale prose | KEEP |
| **Derived-data build scripts (137-143) + spectral manifest (145-158)** | 921 + 900 | only when adding or refreshing a CSV, cycle, pairing or period (the script aborts on mismatch anyway) | **MOVE → `docs/data-pipeline.md`**, one pointer |

Precondition, UNREAD: the CI, traffic and rendered-text sections sit inside `<!-- BEGIN/END:prose-mirror-invariant -->` markers, and `housekeeping-ledger.md:11` calls that block "mirrored". No consumer of the markers was found in this repo, `skylark-site/scripts` or `~/.claude/skills`. The wider `~/.claude` search timed out, so this is **UNREAD, not clean**. Stage 2 greps the marker names fleet-wide before moving anything out of a marked block.

**Drafts ready for Stage 2:** a README "Start here (agents)" section and a `docs/README.md` index (7 folders plus every top-level docs file, one line each). Both are drafted against real paths.

## File proposals (each with its reader-grep)

Search space for every grep: all tracked non-binary files here (the candidate itself excluded), plus `skylark-site/{scripts,src/lib,src/app/api}` and `~/.claude/skills`, 3,334 files. Exact `<folder>/<file>` matches were used, because a basename grep over-counts dated files.

**Four facts decide most rows:**
1. `check-doc-references` scans `continuity/items.json`, which cites more than 50 history paths. Moving a cited file needs an items.json rewrite in the same commit.
2. The Command Center reads `docs/daily/{date}-prelaunch.md` for any date (`skylark-site src/data/command-center.ts:815`, `api/cc/report-body/route.ts:103`). Archiving a daily makes that date 404.
3. Read-output sidecars are found by row id (`cc-due-gates.mjs:1088`), and each canonical sidecar's sha256 is pinned in its row.
4. Primer readers use only today's, the newest, tomorrow's (by a declared offset) or the latest 2, and they filter on `^\d{4}-\d{2}-\d{2}\.md$`, so an `archive/` subfolder is invisible to them.

**No-decision set (Stage 2 candidates). 97 files and 11.3 MB out of the working-tree listing; `.git` does not shrink. The only reader edit is one README line.**

| Path | Proposal | Reader-grep | Readers to update |
|---|---|---|---|
| 44 primers, `docs/cold-starts/2026-08-14…10-27` (excluding 08-19, 09-09, 09-20, 09-22, 09-23, 10-05) | ARCHIVE → `docs/cold-starts/archive/` + `INDEX.md` | Only the next day's daily/primer, as history prose. External hits are date-string fixtures in skylark-site tests, never reads of this file. | none. **58 → 14 entries in the folder a cold agent lists first.** 230,819 B |
| The 6 primers excluded above | KEEP | items.json (08-19, 09-20, 09-22, 09-23, 10-05), daily-config.md (09-09) | — |
| `docs/walks/frames/2026-10-21-i061/` (13 PNG) | ARCHIVE → `docs/walks/archive/2026-10/frames/` | 0 path readers. The folder is named once in daily 10-21:90 (history, unscanned). Frames of the never-pushed prototype; I-061 closed 10-22. | none. 5,461,296 B |
| 31 history frames, `docs/frames/2026-09-17…09-25` | ARCHIVE → `docs/frames/archive/2026-09/` + INDEX | CHANGELOG, dailies and primers 09-19…09-27 (history, unscanned) | none. 4,676,824 B |
| 4 byte-identical frames: `2026-09-20-cycles-390-after-prod`, `2026-09-21-home-390-after-prod`, `2026-09-22-home-1440-after`, `2026-09-22-home-390-after` | DELETE (SHA-256 identical to a kept copy; INDEX records which copy each matched) | 0 exact-path readers | none. 913,949 B |
| `continuity/read-outputs/I-021.partial.txt`, `I-046.partial.txt` | DELETE | 0 readers. Kill captures are never pointed at by a row (`due-gates-io.mjs:1159-1170`). Rows closed 10-09 and 10-21; the full captures exist. | none |
| `docs/journey-walk-2026-09-26.md` | ARCHIVE → `docs/archive/` | 0 in this repo. The one external hit is buddha-ur's file of the same name. | none |
| `docs/fact-check-prompt-round-3.md` | ARCHIVE → `docs/archive/` (not deleted: content not diffed) | 0 exact-path readers; superseded by `-round-3-self-contained.md` | none |
| `docs/fact-check-2026-04-25-round-3-blocked.md` | ARCHIVE → `docs/archive/` | README:348 tree line only | README.md:348 |

**KEEP, with the reason that binds:**
- **All 49 `docs/daily/`:** Command Center by-date reader. Archiving the 41 dailies up to 10-27 (1.1 MB) needs a `report-body` archive fallback in skylark-site, or David's acceptance of the 404s. That is a decision, not hygiene.
- **All 42 canonical sidecars:** the hash pins in items.json.
- **All 32 scripts:** every one has a live reader. `inspect.mjs` is the README screenshot regenerator, `measure-fold.mjs` is cited by daily-config and `Viz.tsx:150`, and `verify_tfp.py` is cited by `us_tfp_growth.source.md`.
- **The five round-1/2/3 fact-checks:** `public/llms.txt:76-80` links them by GitHub URL, a published surface.
- **Round-4, round-5, `journey-walk-2026-08-24`, design-canon-review, `docs/evidence/`, `docs/frames/2026-09-27-cycles-390.png`:** cited by items.json. The 09-27 frame is also inside the hashed W-002 sidecar.
- **Open-row evidence (tomorrow depends on it):**
  - walks `10-13-i041`, `10-14-i043`, `10-14-i045`, `10-16-i052-i048`, `10-16-dalio-claim`, `10-24-i064`, `10-25-i066`, `11-03-i063` and its parent `10-30-i063`;
  - `journey-walk-2026-10-14` (I-049);
  - `answers/2026-10-03.md` (I-025);
  - the sidecars of every open row.
- **Deferred:** 17 walks of closed rows (about 180 KB), which are cited by items.json and by each other (`10-15-i048` is cited by seven later walks, one of them open-row evidence). Move them only after a `check-doc-references` dry-run proves its RESOLVED-ELSEWHERE bucket finds a moved file. Otherwise KEEP.

**Untracked, listed, not touched:** `continuity/read-outputs/I-027.partial.txt`, a kill capture for I-027 (closed 11-03; the full `I-027.txt` is tracked).

## Memory findings

Structure is clean: 60 of 60 links resolve, and there are no orphans. **Truth and shape are not.**

1. **Instruments cited as live that were deleted on 10-21** (a327700, with I-061):
   - `check-year-position.mjs` is cited in MEMORY.md and in `project_i033_hatch_glance_walk`, `project_i036_curve_height_i006_closed`, `project_i051_dalio_claim_page`, `project_i061_one_wave`, `project_open_carryforwards` and `feedback_spawnsync_inprocess_server`.
   - `check-state-phone` is cited in MEMORY.md, `project_i013_state_reason_line` and `project_i061_one_wave`.
   - Fix: mark each as "deleted 10-21 with I-061" in place.
   - The other names that grep missed in this repo are skylark-site scripts that exist (`check-ci-status`, `check-deployed-sha-drift`, `check-next-primer-exists`, `check-cycle-rotation`). `check-inbox` is a skill. `check-prompt-round` exists nowhere (cited by `feedback_factcheck_external` and `project_open_carryforwards`): mark it gone or remove the mention.
2. **Stale states in index lines:**
   - The I-061 line says "the ONE pending read is the 10-22 two-walker production walk"; it was read and closed.
   - Many lines end "monitoring → <past date>" for rows now closed.
   - The `project_open_carryforwards` index line is **2,366 characters**, 13% of MEMORY.md on its own, and almost all of it is history of closed 08/09 work.
3. **Shape: about 45 of the 60 memories are one-ship logs** (`project_iNNN_*`). They repeat what items.json, the daily reports and git already record, which the memory rules say not to save. They cost recall: the 11-04 retro names "a fact written from memory (I-034 misnamed)". **Proposal:**
   - Consolidate the durable content into **`project_copy_rulings.md`**: the standing wording rulings, each with its source. Examples: never say a test ran; "this site requires", never "a test requires"; "no cycle", not "none"; no testability claim in the snippet or the card (consult b29504de); "some are the theorists' dates, others this site's choices"; "none drawn in these years"; the I-061 one-wave ruling quoted with `docs/answers/2026-10-21.md`; the I-013 band left to David via I-025; the I-026 checksPass go-ahead.
   - Also consolidate into **`project_instrument_lessons.md`**: the checker-design lessons that recur. Examples: geometry, not paint; reads need `img:visible`; the nav-type test is wrong both ways; `nuqs` replaceState wipes history.state; ogCardCache needs a restart.
   - Keep every `feedback_*` file plus `user_collaborator`, `project_discovery_channel`, `project_signal_date_field` and `project_no_v1_inbox_fallback` (its receipt-gate line is still the first-gates-green rule).
   - Delete the one-ship files whose only content is their ship. **No David ruling is deleted**: each one moves verbatim into the rulings file with its source.
   - **Target: MEMORY.md from 18,062 B to about 5-6 KB, and from 60 files to about 15.** It needs a line-by-line pass in Stage 2, not a bulk delete.

## Code (optional)

**Not surveyed tonight, so no proposals.** The file pass found every script live. A dead-export sweep of `src/lib` would need tests green before and after, and the full local suite is known to fail under fleet load (I-034, due 11-06), so it waits for that row rather than racing the heavy gate.

## Goals proposal

**Current goals (unchanged until David rules):**
- The evangelism bar's would-tell-a-friend moment: an honest verdict on one screen.
- The binding constraint: retention and word of mouth.
- The daily loop selects one continuity row per day.

**What the evidence says:**
- OBSERVED: Search Console from 09-20 to 11-04 shows **1 click and 123 impressions**, average position 7.7. The click was on `/`, and may be David's (founder traffic is not excluded). Source: `gsc-read.mjs --start 2026-09-20` as stamped in today's W-005 read.
- OBSERVED: over the last five weeks the ledger **minted 69 rows and closed 61** (weekly: 16/12, 16/20, 18/11, 10/7, 9/11; source: `created` and `closedAt` in items.json).
  - Most rows minted since 10-13 came from synthetic cold walks of the home chart and its copy. Examples: I-074 to I-078 come from the 11-03 walk, and I-068/I-071 from the 10-24/10-25 walks.
  - Most ships in that period changed a word, a mark or a position on surfaces no external reader has been observed using.
- OBSERVED: I-043 has been re-dated five times (notes count).
- HYPOTHESIS: the walk → row → ship loop is self-sustaining whether or not anyone arrives. Every walk of a tightened surface finds a next tightening, so the ledger never empties and the site gains no readers.
- HYPOTHESIS: the readers who exist arrive on named-theorist searches. The first non-brand queries were Dalio at position 49-60 (09-16), and the three claim pages are the pages built to answer them.

**Proposal for David (one fleet card; not self-adopted):**
- SUGGESTION, the ONE user problem: "I searched for Ray Dalio's Big Cycle, or the Fourth Turning, and nothing I found tells me whether it holds up." This is the evangelism bar's problem, narrowed to the moment of arrival.
- SUGGESTION, the measure: page-grouped Search Console **impressions** on the three claim pages (`/cycles/dalio`, `/cycles/strauss-howe`, `/cycles/turchin`). Clicks are too few to read for weeks, and impressions lead clicks.
- SUGGESTION, the 7-day target: an output target, because the outcome cannot move measurably in 7 days (Search Console lags about 3 days, and these pages see about 1-2 impressions a day).
  - Each claim page's title, description and first screen answers its theorist's question in the searcher's terms, with a Codex claims pass.
  - Each page is linked from the pages that already get impressions (`/`, `/cycles`, `/about`).
  - The baseline impression read is stamped on day 1 and re-read on day 7.
- SUGGESTION, what to STOP:
  - Minting new rows from synthetic walks of the home chart unless the row names a reader-visible **falsehood**. Such a falsehood is the I-079 class, which is bar work. Comprehension polish is not.
  - Re-dating rows. A row that reaches its date twice without being selected gets closed with "decided: stays as is" or selected; no third date.
  - The full Section 0 boilerplate in every daily report when nothing in it changed. Write "unchanged since <date>" plus the one read that moved.
- HYPOTHESIS, the risk: the claim pages may already be as good as copy can make them, and the binding constraint may be discovery volume, which this portfolio's rules forbid founder-led channels to fix. If so, the honest finding after 7 days is "copy is not the lever", and the lane's daily cadence itself should slow (a weekly ship).

**Process review:**
- The daily report: OBSERVED, it is read by the manager review (today: reviews 1a846cb4 and d4bba72f) and served by the Command Center by date. HYPOTHESIS: the State Appendix and Section 0 are read by no one unless something in them is RED.
- Ceremony: OBSERVED, the 11-04 hygiene helper cost **89,767 tokens for 2 ledger lines**, one of them with a false "all ten re-read" (11-04 retro synthesis, item 9). SUGGESTION: on a day with two or fewer due lines, disposition them by hand.

## What slowed us (11-04 retro + the last 7 reports)

1. **Outward prose written from memory instead of from `verdicts.json`.** On W-005, three Codex REJECTs on one defect class (testability claims refuted by the unpaired cycle and the cross-grid rows) came before the consult that changed the shape. The main share card carried two false sentences for 12 days (10-23 → 11-04). The fix in force is a vocabulary-ban test. The retro's ask: a P1 packet whose acceptance names outward text quotes the source rows it rests on, by count.
2. **A fact written from memory.** I-034 was called "the share-card row"; it is the local-suite timeout row. Memory is a ship log and is hard to search for what is still true (see Memory findings).
3. **Re-dating instead of deciding.** I-043 was re-dated five times, and I-071 was re-dated again today.
4. **Hygiene helper cost** (above).
5. **The local full suite fails under fleet load** (I-034), so a local green is unreliable and CI is the only trustworthy full gate.
6. **Stale flow map.** `key-user-flows.md` still describes /state and the now-dot two weeks after I-061 removed them. HYPOTHESIS: walks seeded from it spend steps on surfaces that no longer exist.
7. **Tonight, measured:** a PowerShell loop that ran `git ls-files` once per name exceeded the 120 s tool timeout and finished in the background. Batch the listing once, then match in memory.

## Carried items (untouched tonight)

- I-043: due 11-05. Select it or record that the lead stays; no fifth re-date.
- W-006: due 11-05 (the `/` leg).
- I-034, I-049, I-068: due 11-06.
- Every open row's evidence path listed above stays put.
- No David card is open.
