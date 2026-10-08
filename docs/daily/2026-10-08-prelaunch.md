# sinusoidal-cycles — 2026-10-08 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** Turchin's "Does it hold up?" box stops saying a test ran. It names the record the verdict is judged on and says why the page carries two labels. **Item:** I-028 (open, lane-owned, due 2026-10-08). Today's rotation makes P3 an evangelism pass, so this is the pass's product change. The bar file this lane has never had gets written alongside it.

**The user problem, in the page's own words.** No user reported this. It is a false sentence a reader meets on arrival. Live `/cycles/turchin`, read 2026-10-08 (`tmp/turchin-before-2026-10-08.txt:21`): "The record this verdict tests — a different cut of the paired series from the one drawn on the chart, named in the verdict below — runs 111 years". Three lines further down, the frozen verdict says "No test was run and no p-value exists" (`public/data/spectral/verdicts.json:190`). The box and the verdict contradict each other, and the box is the side that is wrong. W-003 D2 (2026-10-03, synthetic) put the same two-label confusion on Kondratiev in a walker's words: they "could not tell from the page which series was tested". I-024 fixed it there.

**What a user will see differently:** the Turchin box will read "The record this verdict is judged on, US top 1% wealth share (1913 onward), runs 111 years: …". Under the verdict, a "Why two labels" paragraph will say why the chart draws 1820 onward while the verdict reads 1913 onward. Nothing else on the page changes.

### Section 0

- **Primer:** `docs/cold-starts/2026-10-07.md` (written yesterday; there is no `2026-10-08.md`). Its first action is I-028, and the before-snapshot has been taken: `tmp/turchin-before-2026-10-08.txt`, 95 lines.
- **git:** `pull --ff-only` printed "Already up to date". HEAD `1d13876` = origin.
- **Listener:** 🟢 SSE alive + loop ticking. The SessionStart hook relaunched the listener: pid 19416, hello 14:51:48Z, 0 replayed. `read-listener-strand` reads SLUG MATCH with 0 no-loop warnings. The loop is armed by a `ScheduleWakeup` call. Waker ranks 1-3 were launched; rank 1 fired a wake-shorten for this prompt and was relaunched.
- **Codex:** GREEN, from the `[codex-probe]` line on this prompt (14:56Z). It wasn't used at P1 because there is no diff yet.
- **CI:** `check-ci-status --workflow ci.yml` → GREEN for `1d13876348` (1 success, 0 failures, 0 pending).
- **Deploy drift:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live `1d138763` = head. This is a checksPass service, so it was judged.
- **Harness:** running 2.1.294 · fleet UNIFORM (27 of 27) · installed 2.1.294 (SAME). The record moved from 2.1.277.
- **Cycle rotation:** **exit 3**, "evangelism-pass DUE — P3 IS the pass (run /evangelism-pass); fleet cycle 18d since 2026-09-20". The journey-walk picked for today is deferred (one pass per lane per day).
- **Due gates:** `--snapshot`, taken once → "1 gate(s) due on/before 2026-10-08" (I-028, readCommand WAIVED: "the gate is picking it up, not a measurement"). `tmp/due-gates-snapshot.json`.
- **Board:** `answered-cards` → no waiting, answered or pending-verify cards.
- **Recs yesterday:** `docs/daily/2026-10-07-prelaunch.md` has no `## Recommendation` block, so `Recs yesterday: none`.
- **Retro (10-07):** one finding bears on this choice: "a check written from a measurement inherits its looseness" (eighth round). It applies to the test I'll extend. The new entry's guard must fail on the live wording, not merely on a string I made up.

### Evidence

- **OBSERVED, live page** (`/cycles/turchin`, snapshot 2026-10-08, server-rendered text): line 21 is the generic "verdict tests" sentence quoted above.
- **OBSERVED, in the tree:** the box takes the fallback at `src/app/(app)/cycles/[id]/page.tsx:242`, because `testedSeriesNote("wid_top1_wealth_1913")` returns nothing (`src/lib/testedSeries.ts:21-27` holds only `us_tfp_growth_annual`).
- **OBSERVED, the inference:** `scripts/spectral_verdict.py:141-152` sets `wid_top1_wealth_1913` to the same CSV as the chart, with `truncate_min_year: 1913` and lay_name "US top 1% wealth share (1913 onward)". That lay_name is the exact spelling in the verdict's lay_text, and `verdicts.json:177-180` gives span 111, 0.74 cycles, not eligible.
- **OBSERVED, the reason for two labels** (`public/data/wid_top1_wealth.source.md:6`): the modern Saez–Zucman series starts in 1913, and the five pre-1913 points (1820, 1850, 1880, 1900, 1910) come from earlier sources with wider errors. The script's own comment (`:145-147`) adds that decadal points that far apart act as low-pass filtering, which "fabricates power exactly in the 120-150y band". **That is a P3 check, not settled:** the CSV has 117 rows = 5 + 112, so the pre-1913 years are sparse points, not interpolated rows. I'll word the reason from source.md and confirm the filtering claim against how the loader or chart fills the gaps before using it. The TFP smoothing reason does not transfer.
- **OBSERVED, scope of the false verb:** only Kondratiev and Turchin judge a cut that differs from the displayed series (`spectral_verdict.py:158-166` against `src/data/series.json` ids). After this entry no page reaches line 242's fallback. I'll still change its verb to "is judged on" so a future cycle can't bring "tests" back.
- **MISSING:** real-user evidence. There is no client analytics (a standing choice), and the lane has no evangelism-bar or evangelism-evidence file. P3 writes `docs/evangelism-bar.md` (evangelism-bar Job 1) because the pass can't run without one. That writing stays inside the substrate budget and is not the ship.
- **MISSING:** a cog-ops map for this lane (`docs/cog-ops-map*` → none). The pass's step 2.5 needs a seat. This change sits on a rule seat: copy keyed off frozen verdict data, with no model in the loop.

### Permission, and the freezes

- **Decision class:** lane-owned body copy on a cycle page. I-028's onTrigger reads "Body copy only". Its gate was W-004's read of I-024's wording on Kondratiev, and the 10-07 note says "W-004 (2026-10-07) is read, so this row's gate is met". No card is open on it.
- **Frozen, not touched:** `public/data/spectral/` (manifest-frozen; this change only reads verdicts.json), `FigureScroller.tsx`, `HashLink.tsx`, and the /state bands with `state-2026.csv` (I-025). Titles, meta, H1s and URLs are unchanged (the W-001 freeze ended 10-07 in any case).
- **Mirrors:** /methods, /about and /colophon prose is untouched. `llms.txt` is untouched. Its "p-values where a test ran" is conditional and true (10-07 sweep).

### Alongside: the Next.js security patch (a standing obligation, not the choice)

`node_modules/next/package.json` reads `16.3.6`. `npm audit --omit=dev` **exits 1**, reporting "next 16.0.0 - 16.3.7, Severity: high" across six advisories, including GHSA-cjq9-62q9-8jv4 (SSRF in Image Optimization). That exit is the failing check before the fix. In P3, bump `next` (and `eslint-config-next` if it is pinned to match) to 16.3.8, with `npm audit --omit=dev` → exit 0 as the passing check after it. That is one more reason not to accept `npm audit fix --force`'s 16.4.0, which is out of range. Because this is a dependency bump, I'll diff the rendered text before and after over `.next/server/app` (AGENTS.md), and CI is the gate. This is a separate commit from I-028.

### Next action — improve

Prep only until the review: no commit, push or deploy.

1. Add a `wid_top1_wealth_1913` entry to `src/lib/testedSeries.ts`, with name "US top 1% wealth share (1913 onward)" and a `whyTwoLabels` paragraph built from source.md:6. It must contain no "a test ran" wording (the TEST_RAN guard matches even a negation, so any negation is worded "No test was run: …").
2. Change the verb at `page.tsx:242`'s fallback from "tests" to "is judged on".
3. Extend `src/lib/testedSeries.test.ts` so it covers the new entry: the name equals the verdict's lay_name spelling, and the TEST_RAN guard runs over it. First the failing run: the extended test fails with the entry absent, then passes with it.
4. Run `python scripts/audit_cycle_rationales.py`. No year/phase claim changes, but it is cheap.

First command (the failing test, before the entry exists):

```
npm --prefix C:/dev/skylark/sinusoidal-cycles test -- src/lib/testedSeries.test.ts
```

**Prep done after posting (uncommitted):** `testedSeries.test.ts` is extended. It also exposed that the old `TEST_RAN` guard did **not** match the live sentence ("verdict tests" fits none of its patterns), and that a test pinned Turchin's generic sentence as correct. That is the "check inherits its looseness" finding again. The guard now includes `verdict\s+tests`, with the live 10-08 sentence as its positive control, and the pinning test was replaced by four I-028 assertions. Failing run before the entry: **4 failed / 11** (all four new I-028 tests); the 7 Kondratiev tests pass under the wider guard. The page's own Dataset JSON-LD already calls the pre-1913 points "WID interpolations sourced from earlier US wealth-distribution literature", which is a second on-page source for the reason.

### Acceptance

- On production `/cycles/turchin` the box reads "The record this verdict is judged on, US top 1% wealth share (1913 onward), runs 111 years: …", and a "Why two labels" paragraph appears under the verdict.
- `check-rendered-text.mjs` multiset, production before → after: exactly one line removed (line 21's generic sentence) and two added (the new box sentence and the why-two-labels paragraph). Nothing else moves.
- Kondratiev's page multiset is unchanged, as a control that the shared code path didn't move.
- A repo-wide sweep for `verdict tests` over `src/**`, `public/*.md` and `public/llms.txt` → 0 hits. The space searched gets named; the positive control is today's live hit at snapshot line 21.
- CI green on the commit, and `check-deployed-sha-drift` in-sync.

### Delivery and encounter checks

- **Delivery:** the production snapshot diff above, read after the deploy row reads live.
- **Encounter:** blind. There is no client analytics (bug row W-004 carries the cold walks). The next cold walk on or after 10-09 (I-021's) can read Turchin's box in the same pass. The Search Console read for `/cycles/turchin` impressions is W-005's 11-04 window. There is no N at which a reader of this sentence becomes visible.

### USER-FACING: yes

Paths: `src/lib/testedSeries.ts`, `src/app/(app)/cycles/[id]/page.tsx` (one verb), `src/lib/testedSeries.test.ts`, `docs/evangelism-bar.md` (new, internal). The security patch, separately: `package.json`, `package-lock.json`.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **0**. `dated gates due today` lists 1 row, I-028, which is the selection itself.
- (b) Owed child rows in skylark-site's ledger: **0** of 747 considered (kickoff read).
- (c) State reads marked CROSSED: **0**. Read: dated gates, owed rows, board, prior retro, primer, listener, HEAD CI, report artifact, queued rows, stale-actionable, missingLinkedCommits (NOTHING SWEPT, 0 of 0, not a clean read).

## P3 — Product-work loop

[P3 — Product-work loop]

**Action, kind improve:** I-028, plus the evangelism pass's bar. Manager review 77265f70 APPROVED it. Both of its points were measured, not taken on trust:
- The chart draws the 117 CSV rows (five pre-1913 points, then 1913–2024 every year) as one `curveMonotoneX` line (`CycleFacet.tsx:313-320`). The data hold no filled-in years, so the manager's HYPOTHESIS holds, and the paragraph says the chart "joins" the points.
- The paragraph names the chart's own "US Top 1% Wealth Share" label.

**What shipped (5 commits, pushed `1d13876..61bd1f8`):**
- `12f5fb2`: Turchin's box reads "The record this verdict is judged on, US top 1% wealth share (1913 onward), runs 111 years: …", and a "Why two labels" paragraph appears under the verdict. The generic fallback's verb changes to "is judged on". Adds `docs/evangelism-bar.md` (Job 1; metricReady false, every line a hypothesis).
- `8c90fc1`: Schlesinger's pairing note goes from "the pairing tests his data" to "sets his data against" (series.json, the methods.md mirror, stimson source.md). The guard now reads all 9 ineligible cycle pages.
- `bc47408`: next and eslint-config-next 16.3.6 → 16.3.8. `npm audit --omit=dev`: before, exit 1, high, 6 advisories incl. GHSA-cjq9-62q9-8jv4; after, 0 vulnerabilities. Rendered-text multiset over `.next/server/app`, 16.3.6 vs 16.3.8: 1860 lines / 765 distinct on both sides. The only change is the two copies of the Schlesinger note, from `8c90fc1`.
- `05df21a`: the VerdictTable footnote "each verdict actually tests" becomes "is judged on", and the /methods headline "a pre-registered spectral test finds that 0 of the 9" becomes "under a pre-registered spectral protocol, 0 of the 9". The methods.md mirror changes in the same commit. The guard now also reads /cycles, /methods, and every published `.md` plus `llms.txt`.
- `61bd1f8`: each allowed true passage is scoped to its own file and must be present verbatim.

**The four states:**
1. **Implementation:** full suite 205/205 (`verify-with-receipt`, receipt `61bd1f82`). Typecheck and lint are clean, and `next build` is green on 16.3.8. **CI green** on `61bd1f8` (`check-ci-status --wait`: 1 success, 0 failures).
   - Red arms: the I-028 tests fail 4/11 before the entry; "tests" put back in Schlesinger's note fails `schlesinger-jr`; "actually tests" put back in VerdictTable fails `/cycles` and `/methods`; a sentence planted in about.md fails `public/about.md`. Each was restored, with the tree checked.
2. **Delivery:** `check-deployed-sha-drift --service sinusoidal-history` reads in-sync, live `61bd1f82` = head.
   - Production `/cycles/turchin` text multiset, morning → after: 1 removed (the "verdict tests" sentence), 2 added (the named box sentence, "Why two labels"), nothing else.
   - The old strings (`verdict tests|actually tests|pairing tests|spectral test finds`) appear 0 times in live snapshots of /cycles/turchin, /cycles/schlesinger-jr, /cycles/kondratiev and /methods. Positive control: 1 hit in the morning Turchin snapshot.
3. **Encounter:** blind. There is no client analytics (a standing choice), and Search Console sees impressions, not who read a sentence. Bug row W-004.
4. **Outcome:** open. There is no read.

**Independent review:** 4 read-only `codex exec` rounds (gpt-6-astra). Each banner's `workdir` was `C:\dev\skylark\sinusoidal-cycles`, checked before reading.
- r1 @ `12f5fb2`: all four paragraph sentences HOLD.
  - "WID interpolations" in Turchin's Source line: **REFUTED**. The external round-4 fact-check (`docs/fact-check-2026-04-26-round-4.md:106-110`) supports it.
  - Schlesinger "pairing tests": **CONFIRMED**, fixed in `8c90fc1`.
- r2 @ `bc47408`: lockfile changes exactly 12 next/@next/eslint-config-next entries and nothing else; the mirror is in sync.
  - VerdictTable footnote and the /methods headline: **CONFIRMED**, fixed in `05df21a`.
- r3 @ `05df21a`: both rewrites are true and grammatical.
  - Allowlist applied in every file: **CONFIRMED**, fixed in `61bd1f8`.
- r4 @ `61bd1f8`: no defects.
  - Its note that the "own file" test does not exercise the removal path is accepted as a coverage note. The planted-sentence red arm exercised that path on the real files.
- **Shape change:** the false-test class appeared three times in one day, each time on a surface the guard never read. So the guard's REACH changed (every ineligible cycle page, /cycles, /methods, all published Markdown), not just its pattern.

**Sibling sweep:** pattern `verdict tests|this test|was tested|tests? (ran|run on)|the test (runs|ran)` over `src/` and `public/*.md|txt`. After the fixes, 0 hits remain in reader-facing copy. Remaining `src/` hits are code comments and test fixtures; the `public/` hits are a negation ("so no test ran") and a conditional ("p-values where a test ran"), both allowed by exact passage.

**Hygiene helper:** dispatched at the start of P3; its draft `tmp/hygiene-draft-sinusoidal-cycles-2026-10-08.md` is PRESENT. One finding (W-004 `waitJustification.until` expired 10-07) was posted as status 5ac8a6eb, with the fix drafted for the close. check-engineering-zero PASS.

**Corrective:** none. **Substrate:** the evangelism bar file only.

**npm note:** the first `npm install` stalled about 25 min (18 s of CPU) while 3+ other lanes ran installs at once. I stopped it by its verified PID (47056, this lane's command line) and re-ran; the second run took about 10 min.

USER-VISIBLE: /cycles/turchin's "Does it hold up?" box names the record its verdict is judged on and says why the page carries two labels, and Schlesinger's pairing note, the verdict-table footnote and the /methods headline no longer say a test ran — 12f5fb2 [proof: production /cycles/turchin text before → after: 1 line removed ("The record this verdict tests …"), 2 added (named box sentence, "Why two labels"); old test-ran strings 0 hits across live turchin, schlesinger-jr, kondratiev and /methods vs 1 in the morning snapshot; check-deployed-sha-drift in-sync, live 61bd1f82] [coverage: Search Console via scripts/gsc-read.mjs (impressions only, cannot see a reader of a sentence) · last good read 2026-09-16 · founder+test excluded no] [exposure: blind — no client analytics, so no instrument can see a reader meet this sentence · bug row W-004]

**What remains:** I-028's ledger row (close at P5, linking the 5 SHAs); the W-004 wait fix (helper draft, at P5); I-021's cold walk 10-09 can read Turchin's box in the same pass.
