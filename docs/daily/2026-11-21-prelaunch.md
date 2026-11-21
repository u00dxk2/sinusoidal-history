# sinusoidal-cycles — 2026-11-21 (Saturday, MT)

## BLUF

**Close: the search floor is live at 4b22f15, and the worked example is built but held for David.**
- Live (CI ci.yml green, deploy in sync, live GETs as a browser and as OAI-SearchBot):
  - shared links to /methods, /about, /colophon, /poster and /embed/docs preview their own page;
  - the sitemap lists 17 HTML pages with no false dates;
  - the Render address redirects to sinusoidalhistory.com.
- Held on branch `held/search-day-build`: the worked example on the ten cycle pages, the home links and the new titles. Codex's review held it because only David can say whether the worked example may name calendar years under his "one wave per cycle" ruling. The details are under State Appendix → Close.

**P1: today's change makes each cycle page show its own arithmetic, and makes the site's structure readable by search engines.** Every one of the ten cycle pages gets a worked example in its served HTML: the curve formula with that theory's own period and peak, worked at named years, and the paired record's own years and values carried through the same steps. The home page links each of its ten rows to its cycle page. Today those links are missing from the served HTML. Its title says what the page shows. The search floor gets fixed: the OpenGraph URL is wrong on five pages, the sitemap stamps every URL with the deploy time and lists the `.md` mirrors, and `/embed` is indexable. **No new page template is built.** Each cycle already has one page, so a second page per cycle would differ from the first only in wording. Nothing a visitor sees has changed yet. The packet is under Recommendation and is waiting for the manager review.

Every entry page Search Console was asked about is **indexed** (URL Inspection, 7 of 7, read today). That leaves two problems, impressions and clicks. Over 10-22..11-19 the site had 83 impressions and 2 clicks, both on `/`.

## What changed

**P3: built and HELD, nothing a visitor sees has changed.** Both commits are local, and nothing is pushed. Codex refused the diff review with a usage limit ("try again at Nov 22nd, 2026 9:39 PM"). The orchestrator holds every push fleet-wide until David rules (0e368ce7). The row is **I-090** (next read 2026-11-23).

| Held commit | What it changes | New public words? | Waits on |
|---|---|---|---|
| `2d6efd1` | og:url and the share block name their own page on /methods, /about, /colophon, /poster and /embed/docs. The sitemap lists HTML pages only and has no build-time lastmod. `sinusoidal-history.onrender.com` redirects to the apex. The `.md` mirrors carry `Link: rel=canonical`. IndexNow gets a key file and `scripts/indexnow-ping.mjs`. | **No.** Each share title is the page's existing `<title>`, and /methods keeps the share description it had before. | The Codex diff review |
| `e675c56` | A "Worked example" on all ten `/cycles/<slug>` pages. On `/`: ten links to the cycle pages, a new title, and WebSite + ItemList JSON-LD. The /methods title and description change. | **Yes** | The Codex diff review, plus David's ruling on new public words |

- **The worked example**, server-rendered below the extrema list on every cycle page:
  - the curve formula with the cycle's own peak and period;
  - the quarter-period years inside the drawn period only. Perez drops 2027.5, and Turchin drops 2057.5 and 2095;
  - on the nine paired pages, the record's first year, lowest and highest values carried through the chart's min-max scaling, then years covered ÷ period.
  - Every number comes from the points the figure already draws (`src/lib/workedExample.ts`).
- **Claims, cross-family** (Codex r1, read-only, banner workdir checked; `docs/claims/2026-11-21-worked-example-codex-claims.md`): 14 of 18 HOLD (REPRODUCED).
  - A10, A12 and C1 were CONFIRMED and fixed.
  - A7 is DELIBERATE, as the lane's reading of I-061. It is put to David below.
  - Two strings added later (the /methods description and the formula line) have had no claims pass yet. They are in the saved Codex prompt.
- **Review, same family, fresh context (NOT cross-family):** no HIGH, 1 MEDIUM, 6 LOW. All seven were CONFIRMED and fixed or labelled (claims doc). The MEDIUM: the /methods description still opened with the phrase the claims pass refuted in the title, and the share block would have spread it.
- **Red-armed:**
  - The drawn-period checker: with the filter removed, it fails on `perez 2027.5 after the drawn period's end 2026` and `turchin 2057.5 …`. Restored, 11 of 11 pass.
  - `indexnow-ping` refuses an onrender URL with exit 1; its test spawns the script with a positive control and four refusals.
- **Gates at `e675c56`:**
  - vitest, 13 files, **232 of 232**. These are today's tests plus every page guard: seriesOverlay, cutPeriodCopy, testedSeries, bareCos, cyclesIndexTag, holdsUp, article and siteConfig.
  - typecheck and eslint both exit 0.
  - Heavy-gate peaks were 0.3-0.6 GB. One run died with exit 127, because `npx` does not resolve without a shell. It was re-queued once with `node node_modules/vitest/vitest.mjs`.
- **Revised from P1 (findings):**
  - `/embed` does NOT get `noindex`. Its canonical to `/` is a deliberate, commented choice, and pairing `noindex` with `rel=canonical` sends two conflicting signals.
  - The onrender redirect is safe for Render's health check. That check sends a verified custom domain as `Host` and counts a 3xx as healthy (render.com/docs/health-checks, read 2026-11-21).
- **W-005:** three notes log the `/` and `/methods` title changes and the description change, each dated before any read that judges it.
- **Receipt:** USER-VISIBLE: none — the search-day build (worked example on all ten cycle pages, home links, search floor) is committed locally as 2d6efd1 + e675c56 and held: Codex's usage limit blocks the cross-family diff review until 2026-11-22 21:39 MT, and the orchestrator holds every push until David rules (0e368ce7)

<!-- findings:begin -->
- P1 said `/embed` would get `noindex`. Revised: its canonical to `/` is deliberate (`src/app/embed/page.tsx:12-15`), and Google advises against pairing `noindex` with `rel=canonical`. It was left as is.
- P1's acceptance item 3 named "a 308 from the Render address while Render's health check still passes". The health-check half is now read from Render's documentation. The proof stays a deploy row going live, after a push.
- The record half of the worked example names years past the drawn period's end (a record's last year, its high). The enforced rule is narrower: no CURVE row past the drawn end. The record is drawn across the whole window, as the figure already did.
<!-- findings:end -->

## Recommendation

### P1 selection packet
[P1 — Evidence and choice]

- **Outcome:** each cycle page shows how its curve is computed and how much of the theory its record covers, worked with its own numbers. The home page links each cycle to its page, and the search floor is complete. Item: this lane's search-day lead (no ledger row; one is minted at P3 for the build). Kind: improve.
- **The user problem, in a reader's words:** the bar's own words (HYPOTHESIS, `docs/evangelism-bar.md`): "I can't tell whether any of it holds up or is just a good story." A search result or an assistant can say "Dalio's Big Cycle is about 75 years". It cannot show the arithmetic that puts that wave on this chart, or this record's own years against it.
- **David's direction** (quoted from `C:/dev/skylark/skylark-site/docs/specs/seo-aeo-day-2026-11-21.md:5`, banked by the orchestrator at `docs/answers/2026-11-20-seo-aeo-day.md` in skylark-site): "So, please plan for the run-day tomorrow to go deep on all projects."

#### The audit sheet (live reads, 2026-11-21)

| # | Item | Reading |
|---|---|---|
| 1 | Hosts | Canonical host `https://sinusoidalhistory.com`. `www.` and `http://` both 301 to it. **`sinusoidal-history.onrender.com` answers 200** and is not redirected. Its canonical names the apex. Canonicals name the apex on all 11 page types fetched. **og:url is wrong on 5:** `/methods`, `/about`, `/colophon`, `/poster` and `/embed/docs` all emit `og:url=https://sinusoidalhistory.com` (the home URL). The sitemap names only the apex. |
| 2 | Readers of the Render address | Three found. (1) **DNS:** `www.sinusoidalhistory.com` CNAME → `sinusoidal-history.onrender.com` (`Resolve-DnsName` via 1.1.1.1). (2) **DNS:** `sinusoidal-history.skylarkcreations.com` (the old host, which 301s) CNAME → the same. (3) `DEPLOY.md:24,46,52,65` names it in setup prose (docs, not a caller). **Searched, none found:** the whole repo excluding `node_modules`/`.next`/`tmp` (`onrender\.com`: only DEPLOY.md and one archived primer), `render.yaml` (`healthCheckPath: /`, no host), `.github/workflows/ci.yml`, and skylark-site excluding rollups (`sinusoidal-history\.onrender`: 0). No env var, webhook, cron, OAuth redirect or mobile config exists in this repo. **Not verified here:** whether Render keeps serving a custom domain whose CNAME targets the `onrender.com` host once that subdomain is disabled. That needs Render's documentation before the switch. |
| 3 | Five stages | See the table below. |
| 4 | Served HTML, JS off | Read as a plain GET twice, as a browser and as `OAI-SearchBot` (same word counts). **Cycle pages** (1,171-1,436 words): verdict, extrema, paired series, license, downloads and spectral verdict are all in the HTML. **`/cycles`** 3,256 words, **`/methods`** 4,325, **`/about`** 3,390: all prose served. **`/`**: 257 words. The ten rows (name, period, peak) are served, but **0 links to any `/cycles/<slug>`**. The served links are `/cycles /poster /methods /about /?tab=calibrate /colophon /embed/docs`. **`/poster`**: 6 words and **`/embed`**: 5 words, both client-drawn. |
| 5 | Sitemap | 21 URLs, **1 distinct `lastmod` (`2026-11-20T19:35:13.448Z`, the build)**: `src/app/sitemap.ts:7` is `new Date()`. It lists **4 non-HTML duplicates** (`/llms.txt`, `/about.md`, `/methods.md`, `/colophon.md`). It holds no filter, empty or per-user URLs. `/poster` (6 served words) is listed. |
| 6 | Per-user pages | None exist. The calibrate view is query state on `/` and has no own URL. **`/embed`** (an iframe surface, 5 words) has its canonical set to `/` and carries **no `noindex`**. It is not in the sitemap. |
| 7 | Structured data | Cycle pages: WebPage+BreadcrumbList+DefinedTerm+Dataset, plus FAQPage on the 3 claim pages. `/cycles`: DefinedTermSet. **`/`, `/methods`, `/about`, `/colophon`, `/poster`, `/embed/docs`: none.** No ClaimReview. The FAQPage on the three claim pages answers the page's own visible H1 question. It is not aimed at the FAQ display, and nothing new is planned for it. |
| 8 | Titles and descriptions | `/`: "Sinusoidal History" (18 chars), which does not say what the page is. `/methods` 28, `/about` 26, `/colophon` 29, `/poster` 27, `/embed/docs` 26: each is "<Name> · Sinusoidal History". Claim pages run 80-88 characters with the site-name suffix (decoded). That is longer than a result shows. Whether the lane's "Title ≤ 70" rule counts the suffix gets checked at P3, not assumed. `/cycles` is **frozen**: W-005 (monitoring to 2027-01-04) judges its 11-04 snippet. |
| 9 | Analytics | **No client analytics, by standing choice** (Phase 12 close, 2026-09-16). AI referrers and `utm_source=chatgpt.com` are **UNREAD**: no instrument sees a Referer (W-005 notes, 11-04: crawl-read carries no Referer). No analytics will be added today. |
| 10 | Search Console / Bing | Search Console: **verified** (`sc-domain:sinusoidalhistory.com`; `gsc-read.mjs` and `cc-gsc-inspect.mjs` both read it today). Bing Webmaster Tools: **no property** (last recorded 2026-09-08; the ask was struck under "product over measurement", W-001). Bingbot crawls on its own from the sitemap. |

#### Five stages per entry page

URL Inspection (`cc-gsc-inspect.mjs --site-url sc-domain:sinusoidalhistory.com`, read today). Performance: `gsc-read.mjs --start 2026-10-22 --end 2026-11-19`, page-only. The route truncated the page list at 10 rows. Those 10 rows sum to 83 impressions and 2 clicks, which equals the whole TOTAL line, so every page not listed had **0** in the window.

| Page | Inspection | Last crawl | Impr / clicks / pos | Stage |
|---|---|---|---|---|
| `/` | Submitted and indexed | 11-18 | 13 / 2 / 3.7 | **earning clicks** |
| `/cycles` | Submitted and indexed | 10-26 | 39 / 0 / 11.7 | earning impressions |
| `/cycles/dalio` | Submitted and indexed | 10-30 | 4 / 0 / 7.0 | earning impressions |
| `/cycles/strauss-howe` | Submitted and indexed | 11-01 | 2 / 0 / 3.0 | earning impressions |
| `/cycles/turchin` | Submitted and indexed | **09-04** | 0 | indexed, no impressions |
| `/cycles/kondratiev` | Submitted and indexed | 10-30 | 0 | indexed, no impressions |
| `/methods` | Submitted and indexed | 11-01 | 0 | indexed, no impressions |

Clicks are not founder-excluded. The 2 clicks on `/` may be David's.

#### The build, as a page list: the question each answers, and what is on it that the result or the assistant cannot give

1. **The ten cycle pages, `/cycles/<slug>` (existing URLs; no new page).** The question: *"How is <theory>'s curve computed, and how much of the theory does its record cover?"* New section, served HTML, one per page: **"Worked example"**.
   - **The curve:** curve height = cos(2π · (year − peak) / period), with this cycle's numbers. It is worked at the drawn period's peak, quarter point and trough (derived, never typed). It writes "curve height", never a bare "cos" (`bareCos.test.ts`). It names no present-year position (I-061).
   - **The record**, for the nine paired cycles: the record's first and last year and its year count; years ÷ period = periods covered against the 3.0 floor, at one decimal, through `judgedCut()`. Then two actual values from the paired CSV carried through the site's rescaling to the plotted height. The unpaired tenth (fathers-and-sons) shows the curve half only.
   - **What a snippet cannot give:** the computation with this theory's own numbers, and this record's own values traced through the same steps, beside the CSV that is already downloadable on the page.
   - **The data-sufficiency rule:** a page gets the section only from its stored `cycles.json`/`series.json` values and its own CSV, and the record half only where a paired CSV exists. That is 10 pages from one template, at the ~10 threshold. The reviewer's five random reads apply.
2. **`/` (existing).** The question: *"Which long-wave theories of history are there, and what period and peak does each use, side by side?"* Changes:
   - each of the ten served rows links to its `/cycles/<slug>` (0 today);
   - a title that says what it shows (draft "Ten cycle theories of history on one time axis · Sinusoidal History", 66 chars; claims-checked before it ships);
   - `WebSite` + `ItemList` JSON-LD of the ten cycle pages, true to the visible list.
   - The thing itself: all ten periods and peaks drawn against one axis, and the calibrate tool.
3. **`/methods` (existing).** The question: *"How is every curve and series built, and where does the method break?"* Changes: a title that says so (draft, ≤70 chars), and og:url fixed. The body is unchanged. The title change is logged in W-005's notes before any read judges it.

**Considered and not built today:**
- A page per data record (`/data/<series>`, about 9 pages). It overlaps the cycle pages' "Paired data series" section, except where cross-grid pairings tie one record to several cycles. It could be a later round if the cross-grid tie gives each page enough of its own content.
- **The research's top move, a dated annual verdict** (`skylark-site docs/research-library/2026-08-18-sinusoidal-cycles-citability.md:19-39`). It runs into David's I-061 ruling, "Yes: one wave per cycle, stop at today, retire the yearly state pages" (card 777f3084, `docs/answers/2026-10-21.md`). **HELD for David.** One version stays inside the ruling: a dated edition of the testability verdict that names no present position. Whether that is in or out is his call. The lane does not build it.

#### Floor (P3, before the build)

| Floor item | Today | P3 |
|---|---|---|
| Canonical host forced | `www`/`http` 301. `onrender.com` serves 200 with an apex canonical. | Redirect the exact host `sinusoidal-history.onrender.com` to the apex in the app (308). Read Render's health-check host first, so the check is not redirected. Nothing is switched off. |
| Canonicals on every page type | yes | og:url per page on `/methods`, `/about`, `/colophon`, `/poster` and `/embed/docs` |
| robots.txt | `User-Agent: * / Allow: /` + sitemap. Every named crawler is allowed by the wildcard. | none |
| Sitemap | build-time `lastmod`, plus 4 non-HTML URLs | drop the build-time stamp (no `lastmod` rather than a false one); remove `llms.txt` and the three `.md` mirrors from the sitemap. The files stay served. Each `.md` mirror carries a `Link: rel="canonical"` header pointing to its HTML page. |
| `/embed` | indexable | `noindex` (the iframe still works) |
| IndexNow | not wired | a key file plus `scripts/indexnow-ping.mjs`, run at close for the URLs changed today. That puts it on the lane's close path. An automatic post-deploy ping needs a Render deploy hook, which is David's. |
| Shared cross-site footer | none in this repo | none |
| The repo as a search surface | `gh repo view`: description "Eight historical cycle theories … (1600-2050)"; homepage the old subdomain | correct both (ten cycles; `https://sinusoidalhistory.com`) |

- **Evidence:**
  - OBSERVED · the live fetches above (plain GET, browser UA and OAI-SearchBot UA, 2026-11-21). Script: the session scratchpad `audit-fetch.mjs`. Limit: one fetch per page type.
  - OBSERVED · URL Inspection, 7 of 7 entry pages "Submitted and indexed", read today.
  - OBSERVED · Search Console, page-only, 10-22..11-19: 83 impressions, 2 clicks (both `/`), position 11.0. Limit: founder not excluded, and the newest ~3 days are always empty.
  - OBSERVED · `cycles/[id]/page.tsx:536-566`: the extrema section states peaks and troughs but not the formula or any record values. `ReusePacket` (CSV, SVG, PNG, attribution, license) already ships on every cycle page. The research's "reuse packet" move is therefore done; it is not today's work.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` exit 0: "no product-love cycle picks this lane today … run the normal P3".
  - OBSERVED · answered-cards: 0 lane cards; 1 portfolio rider (312499ee, heavy jobs), 0 new.
  - MISSING · `docs/evangelism-evidence.md` and `docs/key-metrics.json`. There is no reader on record. AI-referred visits are UNREAD (no instrument).
  - HYPOTHESIS · that the worked example raises impressions or clicks. At 83 impressions in 4 weeks, no CTR or impression change is readable this month (W-005's arithmetic). The 60-day read (~2027-01-20) is the first that could show it.
- **Prior-retro finding that bears on this:** 11-20 Q0, still on discipline: "a check that passed for the wrong reason." Here, the truncated Search Console list could have read as "unlisted pages: UNREAD". Instead, the 10 rows were summed and matched against the TOTAL line, which shows the unlisted pages had 0. Every new checker at P3 (the worked-example numbers, the sitemap, og:url) ships red-armed.
- **Permission:** lane-owned copy, metadata and routing. There is no sign-in, payment, account or data screen. The work proceeds under David's search-day direction. **W-005** freezes the `/cycles` title and description, so they are not touched. Title changes on `/` and `/methods` are logged in W-005's notes first, as its onTrigger requires. **I-087's** home-chart faces stay on 11-24. The row links touch the home rows' markup, so the folds are re-read at three sizes. **HELD for David** (the orchestrator batches the cards): see "Needs from David" below.
- **Next action:** kind = improve. Prep now, with no commit. Round 0: a fact list with `file:line` for the rescaling transform (what the plotted height of a record value is computed from), the `judgedCut()` inputs per cycle, and each draft sentence. Then a Codex claims pass on the fact list and the drafts (read-only, banner workdir checked), then the cos-math audit. First command:

  ```
  git -C C:/dev/skylark/sinusoidal-cycles grep -n -i -e "normaliz" -e "rescal" -e "judgedCut" -e "sampleDrawnPeriod" -- src/lib
  ```

- **Acceptance condition:**
  1. A JS-off GET of each of the ten `/cycles/<slug>` pages carries a "Worked example" section. Its curve numbers match `python scripts/audit_cycle_rationales.py` / cos(2π(y−peak)/period). On the nine paired pages, the record's years and two values match its CSV, and periods covered match the verdict box. A checker reads this and is shown red on a deliberately wrong number before it goes green.
  2. A JS-off GET of `/` carries 10 links, one to each `/cycles/<slug>`. Its JSON-LD parses to an `ItemList` of those same 10 URLs. Its title is the claims-checked one.
  3. og:url equals the page's own canonical on every page type. The sitemap has 0 non-HTML URLs and no build-time `lastmod`. `/embed` serves `noindex`. A GET of `sinusoidal-history.onrender.com/` returns 308 to the apex, while Render's health check still passes (the deploy goes live).
  4. Every new public sentence has a Codex claims verdict, each disposition is recorded, and all of that happens before the deploy. `check-entry-folds` reads 13 of 13 at 320x568, 360x560 and 390x664.
  5. CI is green on HEAD, the deploy is in sync, and the IndexNow ping returns 200/202 for the changed URLs.
- **Delivery and encounter checks:** delivery = `check-deployed-sha-drift --wait --service sinusoidal-history --sha <full sha>`, then the JS-off fetches above re-run as browser and as OAI-SearchBot. Encounter: URL Inspection "Last crawl" after the deploy on the changed pages (readable within days), then Search Console page-only impressions. The reading is the 60-day baseline (~2027-01-20). A reader's reaction is not readable at any N this month.
- **Key number:** cycle pages that show their own computation: 0 of 10 → target 10 of 10. Home links to cycle pages in served HTML: 0 → 10.
- **USER-FACING: yes.** Paths:
  - the build: `src/app/(app)/cycles/[id]/page.tsx`, a new `src/lib/workedExample.ts` (+ test), `src/app/(app)/page.tsx` and the home row-label component, and `src/app/layout.tsx` / per-page `metadata` (titles, og:url) in `methods`, `about`, `colophon`, `poster` and `embed/docs`;
  - the floor: `src/app/sitemap.ts`, `src/app/embed/page.tsx`, `next.config.*` (headers) or a `proxy`/middleware for the host redirect and the `.md` canonical header, `public/<indexnow-key>.txt` and `scripts/indexnow-ping.mjs`;
  - outside the site: the GitHub repo description and homepage.
  - Internal: `continuity/items.json` (W-005 notes plus a build row), `docs/claims/`, this report. No mirror (`about.md`, `methods.md`, `colophon.md`) changes unless its page's body does.
- **Needs from David (for the orchestrator's two batched cards; the lane files none):**
  1. **Bing Webmaster Tools property** for `sinusoidalhistory.com`. None exists, while Bingbot crawls on its own.
  2. **The Render address:** its readers are the two DNS CNAMEs above. Before it can be switched off, someone must confirm that Render keeps serving `www.` and the old host when the `onrender.com` subdomain is disabled.
  3. **An automatic IndexNow ping after each deploy** needs a Render deploy hook (a Render setting). Until then it runs at the lane's close.
  4. **Decision:** is a dated, yearly testability verdict that names no present position inside or outside the I-061 ruling? (Not built either way today.)
- **Section 0:**
  - Listener 🟢: SSE hello 16:25:05Z, replay 0, slug match. The loop is armed by ScheduleWakeup; waker rungs 1-3 are running.
  - CI: `check-ci-status --workflow ci.yml` → GREEN on bdfa4bbde1.
  - Drift: `--service sinusoidal-history` → in-sync, live bdfa4bbd = head.
  - Codex: GREEN, from the kickoff probe (machine-level, 16:23:56Z).
  - Harness: 2.1.330.
  - Free memory: 17.5 GB (17,551,468 KB).
  - Morning snapshot: "0 gate(s) due on/before 2026-11-21".
- **Recs yesterday** (the 11-20 close): I-087's NEXT batch, I-089 and I-086 → 11-24; I-071 → 11-25; W-007 → 11-28. None is due today and none is pulled in. The search day is the lead.
- **HYGIENE INPUTS:**
  - (a) Due rows not bearing on the choice: none — read `check-due-gates-dispositioned --snapshot` (0 due).
  - (b) Owed child rows: none — read the kickoff's "rows owed to you in skylark-site's ledger: 0 of 855 considered".
  - (c) State reads marked CROSSED: 1. "board cards carrying David's word: 1": 312499ee (skylark-site, heavy jobs, "governs: unlinked"). Items 2 and 3 govern how this lane runs heavy work: one heavy-gate job at a time, and a dead job re-queued without waiting. Disposition: read.

## State Appendix

- Morning snapshot: `tmp/due-gates-snapshot.json`, 0 due.

### Close

ACTION: DEFERRED — the worked example, home links and new titles (P1's acceptance items 1, 2 and 4) are built and held on branch held/search-day-build (37cc794): the Codex diff review held them on the date question, which is David's reading of I-061 · trigger David's answer (card batch; I-090 re-read 2026-11-24) · item I-090 · P3 94a3f802 (follow-up 152be47c). The search floor (acceptance item 3) is DONE and live.

**Changed since the P3 post (94a3f802):**
- **Codex came back** (orchestrator b4f9b7cd). One diff review ran over both commits: 142,098 tokens used, banner workdir checked. Verdict line: "Hold `e675c56` for the Worked example's date rules. `2d6efd1` has no blocking finding."
  - Findings 1 and 2 (MEDIUM, the date class, second appearance after A7): CONFIRMED. The build is held for David rather than reworded.
  - Finding 3 (LOW, home test): CONFIRMED. It will be fixed before the build ships.
  - Finding 4 (LOW, IndexNow raw URL): CONFIRMED and fixed in 4b22f15.
  - Finding 5 (LOW, share descriptions): DELIBERATE. They are the pages' own existing descriptions.
  - Claims: the /methods description and all nine formulas HOLD.
- **Released 2d6efd1 + 4b22f15:**
  - CI ci.yml is GREEN on 4b22f156. Drift: "RESULT: PASS — OBSERVED after 4 poll(s), 96s — the target is live".
  - Live GETs, as a browser and as OAI-SearchBot: og:url is the page's own URL on all five pages; sitemap.xml has 17 locs and 0 lastmod; the onrender host answers 308 to the apex with the path kept; all three `.md` mirrors carry the canonical `Link` header.
  - IndexNow: HTTP 202 for the 5 changed URLs.
- **The held build** was rebased (e675c56 → 37cc794) and moved to `held/search-day-build`. `main` = 4b22f15 plus this docs commit.

**Ledger delta:**
- I-090 minted, then updated: the floor is live, the build is held, closeWhen and readCommand point at the branch, and the wait is to 2026-11-24 (David's date answer).
- W-005: four notes. The last says what is actually live: no `<title>` or description changed; only the share block moved.
- No row closed. No row re-dated.

**Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected (every section read `none`).
- check-wait-justification: "RESULT: PASS — 35 of 98 row(s) carry `waitJustification`; 0 warn / 0 info", re-run after I-090.
- check-engineering-zero: PASS, WAIVED by W-007 (Dependabot #62, until 2026-11-28).
- The orchestrator's `next` 15.5.29 note does not apply: this app is on next 16.4.5.

**Due gates:** `check-due-gates-dispositioned` (no flag): "verdict: CLEAR — every gate due at Phase 0 was dispositioned." Snapshot CURRENT (taken 2026-11-21).

**Baseline row for the 60-day reading (about 2027-01-20):**

| Measure | Reading (source, date) |
|---|---|
| Non-brand clicks per week | Not separable: page-only totals are 2 clicks in 4 weeks, both on `/` and not founder-excluded (`gsc-read.mjs --start 2026-10-22 --end 2026-11-19`). Query rows are anonymised at this volume, so non-brand is UNREAD. |
| Impressions, 4 weeks | 83 total, position 11.0 (same read) |
| Sitemap URLs | 21 before → **17** live after 4b22f15 (HTML only, 0 lastmod; live GET 2026-11-21) |
| Pages built today | 0 new. 10 cycle pages enriched, held (not live). 5 pages' share metadata fixed, live. |
| Pages proven live | 5 (/methods, /about, /colophon, /poster, /embed/docs: og:url and og:title read live, browser and OAI-SearchBot), plus the sitemap, the onrender 308 and the 3 `.md` headers |
| Entry pages by stage (URL Inspection 2026-11-21) | `/` earning clicks; `/cycles`, `/cycles/dalio`, `/cycles/strauss-howe` earning impressions; `/cycles/turchin`, `/cycles/kondratiev`, `/methods` indexed with 0 impressions in the window. 7 of 7 "Submitted and indexed". |
| AI-referred visits | UNREAD (no instrument sees a Referer; no client analytics by standing choice) |
| Waits on David | A Bing Webmaster Tools property. The Render address switch-off (readers: two DNS CNAMEs). A Render deploy hook for automatic IndexNow. Decision: a dated yearly testability verdict under I-061. Decision: calendar years in the worked example (A7 + Codex findings 1-2). The GitHub repo description and homepage are stale and held as an outward change. |

**Pending reads:** I-090 on 2026-11-24 (David's date answer). URL Inspection "Last crawl" on the 5 changed pages after the next crawl. The 60-day baseline about 2027-01-20.
