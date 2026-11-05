# Claims pass, overnight 2026-11-04/05

Item 3 of the overnight repair prompt. Reviewer: Codex (other model family), `codex exec --sandbox read-only`, banner workdir checked, run 23:07 to ~23:35 MT on 2026-11-04, no network. Each finding below was dispositioned by the lane against source. A Codex verdict is not a fact until then.

**Search space:** read in full: `README.md`, `public/llms.txt`, `public/about.md`, `public/colophon.md`, `public/methods.md`, `CITATION.cff`, `SECURITY.md`, `DEPLOY.md`, `docs/how-this-was-made.md`. Codex's own HOLDS tally (non-exclusive, repeats counted): named-person 58, dates 142, numbers 203. **Blind to:** `src/data/cycles.json` prose as a target (it was a source here), per-cycle `.source.md` files as targets, and anything needing a source the repo does not hold.

**Outcome:** 26 findings. 12 fixed in internal docs, 11 carried on row I-080 because they sit on public pages (3 of those also had an internal copy fixed: 1, 13, 18), 2 left as they are with a reason, 1 refuted by a live read. No board card: nothing was shown to be a false claim about a real person. The closest is the Metz sentence (finding 7), which is unverified, not false.

| # | Where | Sentence | Lane disposition | Done |
|---|---|---|---|---|
| 1 | README:65, :438 (+ colophon:19, methods:11, :144, :161, cycles page:405, llms) | "the theory's exact stated period" / "the theory's own period" | CONFIRMED as imprecise, not as a false claim about a person: round 5 item 8 says Modelski (range), Schlesinger (derived), Khaldun, Strauss-Howe and Dalio have no explicit period in the primary text. Per-cycle pages do disclose it (about.md:141) | README fixed. Public pages: I-080 |
| 2 | how-this-was-made:46 | "Each theorist wrote in a moment that felt consequential and anchored their cycle there." | CONFIRMED: the site withdrew this on 10-31 (I-072) | Dated note at the top of the file |
| 3 | how-this-was-made:46 | "it is publication bias" | CONFIRMED: README:142 records the change to "selection effect", later withdrawn too | Dated note |
| 4 | CITATION.cff:19 | "theorist motivation, and selection effect visible by construction" | Open row I-073 already holds "selection effect". This adds "theorist motivation" | I-080 points at it. CITATION is not edited before a release |
| 5 | colophon:7, how-this-was-made:3 | "He pitched what he called 'the sinusoidal pattern of history'" | DELIBERATE: David's own first-person account of his own call. Nothing in the repo can check it, and nothing needs to | None |
| 6 | about.md:47 | "we use 1973 as the most cited single year" | UNVERIFIED: fact-check-2026-04-25:39 backs 1973 as defensible, not "most cited" | I-080 |
| 7 | about.md:51, cycles.json:25 | "published renunciations - Metz, who once reported K-wave evidence, later withdrew it, and Solomou's long-run studies find no regular wave" | UNVERIFIED and stronger than the only held source (fact-check-2026-04-25:249: Metz 1992 reports some periodicity, Metz 2011 is "skeptical"). Two web searches did not reach the text of Metz 2011; a secondary source still lists Metz 1992 as a confirmation. Not shown false | I-080, first in line |
| 8 | about.md:161 | "the most developed quantitative literature of the ten" | UNVERIFIED superlative | I-080 |
| 9 | methods.md:189 | "Korotayev & Tsirel (2010) report a significant Kondratiev wave only after replacing the World War years with geometric means, on a record of at most three cycles - contested, never retracted." | UNVERIFIED: only the internal spec repeats it. The paper does report a Kondratieff wave; "only after" and "never retracted" are undecided | I-080 |
| 10 | methods.md:189 | "Turchin himself reports the ~150-year cycle as one realized oscillation and offers no formal spectral test" | UNVERIFIED: only the internal spec repeats it | I-080 |
| 11 | llms.txt:71 | "Headline: 0 of 9 pairings are testable - every record is too short." | CONFIRMED false as worded: verdicts.json holds 19 eligible cross-grid rows (recomputed: primary 9 INSUFFICIENT_DATA, cross-grid 19 NO_SIGNIFICANT_TARGET_POWER). Not about a person | I-080 |
| 12 | how-this-was-made:46 | "Every cycle on the chart peaks near the present." | CONFIRMED: 9 of 10, and it now cuts against I-061 | Dated note |
| 13 | README:164, llms.txt:86 | "post-fact-check Phase 11" | CONFIRMED stale | README fixed. llms: I-080 |
| 14 | about.md:167, colophon.md:37, methods.md:213 | "Last updated …" | CONFIRMED stale per Codex's git read (not re-run by the lane) | I-080 |
| 15 | README:178 | "no user input" | CONFIRMED: the chart has calibration inputs | Fixed |
| 16 | README:378 | "the pinned year, event-marker visibility" | CONFIRMED for the pinned year (grep of `src/components`: 0 hits) | Fixed |
| 17 | how-this-was-made:9 | "The site is at `sinusoidal-history.skylarkcreations.com`." | CONFIRMED stale | Dated note |
| 18 | how-this-was-made:25, colophon.md:15 | "five rough phases" | CONFIRMED: Phase 0 to 5 is six | Dated note. Colophon: I-080 (David's first-person page) |
| 19 | how-this-was-made:17 | "A real data series paired with each" | CONFIRMED: the same note's Phase 1 leaves Perez unpaired | Dated note |
| 20 | how-this-was-made:54 | "one knob per cycle" | CONFIRMED: peak and period | Dated note |
| 21 | how-this-was-made:68 | "The data files live in `/src/data`" | CONFIRMED | Dated note |
| 22 | how-this-was-made:68 | "the test suite (45 cases) is in …cycleMath.test.ts" | CONFIRMED: 7 `it` calls counted by the lane | Dated note |
| 23 | DEPLOY.md:5 | "all 301" | CONFIRMED: `permanent: true` is a 308 | Fixed |
| 24 | DEPLOY.md:41 | "`render.yaml` records the same config" | CONFIRMED. The lane also found DEPLOY.md:38 "Auto-Deploy: on", stale since I-026 | Both fixed |
| 25 | DEPLOY.md:35, :69, :81, :119 | Starter price, propagation times, last-deploy behaviour | UNVERIFIED vendor facts in an April walkthrough, no decision rests on them | Left |
| 26 | SECURITY.md:33, :37, :44, :45, :47, :48 | GitHub settings | REFUTED, the sentences hold: `gh api` read 2026-11-04 23:38 MT gives secret scanning and push protection enabled, Dependabot alerts 204, security updates disabled, `main` not protected (404), private reporting `enabled:false`. "No scheduled scan" cannot be read from the API | None |

**The lane's own checks beside the Codex pass.** Ledger lines putting David beside a quotation (3 lines, 2 distinct quotes): "today is another light day please. save tokens." traces to the 10-27 kickoff (`docs/daily/2026-10-27-prelaunch.md:7`, where it is the head of a longer sentence). The I-026 quote is a dashboard setting's label, not David's words. No invented quote found in that search; it covers `continuity/items.json` lines that put David beside a quotation, not bus history.
