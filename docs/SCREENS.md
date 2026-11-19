# Screens — sinusoidalhistory.com

Every user-facing screen and state, built from the router (`src/app`, `next.config.ts` redirects
and rewrites) and then walked. First written 2026-11-17 (round 3, the design rollout), the night
the design pass (`docs/DESIGN.md`, `docs/PRODUCT.md`) went live behind
`NEXT_PUBLIC_DESIGN_PASS_VARIANT=a`.

**Who sees it:** the site has no sign-in, no account, no payment and no email, so every screen is
a signed-out visitor screen. "Agent" means a crawler or an LLM tool that fetches the file directly.

**Status:** DONE = in the new system (the flag-on faces, accent and voice) · NEXT = dated, not yet ·
HOLD = waits on something named · N/A = not a visual screen (data, redirects, machine files), so the
design system does not apply · UNREACHED = listed but not walked, with why.

**Update this file** when a route is added (`src/app/**/page.tsx`, `route.ts(x)`), when a screen
moves into the system, and when a NEXT date passes.

| Screen / state | Route | Who | What it is for | States | Last touched | Status |
|---|---|---|---|---|---|---|
| Home, first screen (masthead) | `/` | visitor | Say what the site is and send the reader to check a cycle | success; the chart below loads its data client-side | 2026-11-07 (`(app)/page.tsx`) | DONE: variant a, the recorder sheet (flag on). Phone: the sheet is hidden below `sm`; the glance figure stays as it was |
| Home, the chart (Facets and Calibrate tabs, glance figure, caption, height label, verdict line) | `/`, `/?tab=calibrate`, `/?focus=<id>` | visitor | Read and move the ten curves | loading (`aria-busy` placeholder), data-file failure handled inside the chart, success | `Viz` and children | NEXT 2026-11-24 (with I-087's batch): the words are settled. I-078 went live at 44cb739 on 2026-11-19 (verdict line, "Not testable on its paired record", calibrated-period scope), and the walk held I-077 and I-078 (`docs/walks/2026-11-19-i077-i078.md`). The chart itself is still in the pre-pass faces; the variant left it untouched on purpose until the words landed |
| Cycles index | `/cycles` | visitor | All ten cycles with their verdict lines; the site's most-shown page in Search Console | success | 2026-11-17 | DONE (batch 2, 571a31a): faces under `[data-dp]`. Flag-on local build fold: 30px spare at 320x568 (7px before), 41px at 360x560 |
| Cycle page, header and verdict box (10 pages) | `/cycles/<slug>` | visitor | One cycle, its curve and its verdict (claim pages answer their question first) | success; empty: no paired series (`/cycles/turchin-fathers-sons`) | 2026-11-15 | DONE (flag on): header faces, the verdict box as the sheet's mark, the empty state's reason and link |
| Cycle page, below the verdict box | `/cycles/<slug>` | visitor | Curve figure, paired series, provenance, FAQ | success | 2026-11-18 | DONE (faces, aff41df..b66d8a5, flag on): headings in Plex Sans Condensed 600, prose, provenance and footer source in Plex Serif, emphasis upright at 600 (no italic is loaded), the caveat upright. Rendered text unchanged. Checked live by `docs/design-pass-2026-11-17/run-below-box.mjs --live`. NEXT 2026-11-24 on this row: the body sizes under 16px and the tracked uppercase labels (`DESIGN.md:61`, `:82`; Codex r1 LOW), which move layout, so they are a batch of their own |
| 404 | any unknown path | visitor | Say there is no page here, then give the next step | — | 2026-04-25 (`not-found.tsx`) | DONE (flag on): "There is no page at this address." and two links |
| Error screen | any view that throws | visitor | Say the view failed and offer retry or the chart | — | 2026-11-17 (`error.tsx`) | DONE: the unflagged sentence fixed (202d75a); with the flag on, the pass's faces and words. Not walked live (nothing on the site throws on demand), so its proof is the served chunk: the new sentence is in 1 of 12 chunks, the old one in none |
| About | `/about` | visitor | What the site is and the ten cycles | success | 2026-11-17 | DONE (batch 2, 571a31a): faces only; no word changed, so `public/about.md` is unchanged |
| Methods | `/methods` | visitor | How curves and verdicts are made | success | 2026-11-08 | NEXT 2026-11-24: with the pass's faces its first screen ends 7px below the fold at 360x560 (flag-on local build, 2026-11-17), so it was taken out of batch 2. It needs its kicker and lede re-budgeted first; mirror `public/methods.md` if a word changes |
| Colophon | `/colophon` | visitor | Credits, sources, licences | success | 2026-11-17 | DONE (batch 2, 571a31a): faces only; `public/colophon.md` unchanged |
| Embed (iframe widget) | `/embed` (rewrite) | visitor on another site | One cycle or the overlay inside someone else's page | success | 2026-09-09 | NEXT 2026-11-24: it renders inside other sites, so a face change ships with its own check |
| Embed docs | `/embed/docs` | visitor (site owners) | How to embed | success | 2026-10-21 | NEXT 2026-11-24 |
| Poster | `/poster` | visitor | Printable chart | success | 2026-10-24 | NEXT 2026-11-24 |
| Share image | `/og` | anyone a link is shared to | The preview card in chats and social posts | success | 2026-11-04 | NEXT 2026-11-24: changing it changes the preview of every link already shared, so it is decided on its own |
| Retired yearly state pages | `/state`, `/state/<year>` | visitor with an old link | 308 redirect to `/cycles` (I-061) | redirect | `next.config.ts` | N/A (redirect) |
| Markdown mirrors | `/about.md`, `/methods.md`, `/colophon.md` | agent | Plain-text copies of the prose pages | — | 2026-11-08 | N/A (text; kept in step with their pages, AGENTS.md) |
| `llms.txt` | `/llms.txt` | agent | Site summary for LLM tools | — | 2026-11-15 | N/A (text) |
| Data files | `/data/*` | agent, chart | CSVs and provenance notes | — | per file | N/A (data) |
| API | `/api/v1/cycles`, `/api/v1/series`; `/api/v1/state` answers 410 | agent | JSON | — | 2026-08-18, 2026-10-29 | N/A (JSON) |
| robots, sitemap | `/robots.txt`, `/sitemap.xml` (`robots.ts`, `sitemap.ts`) | crawler | Crawl rules and the URL list | — | — | N/A (machine files) |
| Favicon | `/favicon.ico` | visitor | Tab icon | — | — | N/A for tonight; no design-pass icon exists |

**Counts (2026-11-19, after I-078 went live at 44cb739):** 21 rows. DONE 8 · NEXT 6 (`/methods`, embed, embed docs, poster, share image, the home chart) · HOLD 0 · N/A 7 · UNREACHED 0.

**Counts (2026-11-18, after batch 3 went live at b66d8a5 with the flag on):** 21 rows. DONE 8 (home first screen, `/cycles`, cycle page header and verdict, cycle page below the verdict box, 404, error, `/about`, `/colophon`) · NEXT 5 (`/methods`, embed, embed docs, poster, share image) · HOLD 1 (the home chart: I-077, I-078) · N/A 7 · UNREACHED 0. (Batch 2's counts, 2026-11-17: DONE 7 · NEXT 6.)

**Rollback (tested 2026-11-17, round 3):** set `NEXT_PUBLIC_DESIGN_PASS_VARIANT` to `off` on Render (any value other than `a` reads as unset) and redeploy:
`node C:/dev/skylark/skylark-site/scripts/render-put-secret.mjs --service srv-d7mcat7lk1mc73bidim0 --env NEXT_PUBLIC_DESIGN_PASS_VARIANT --from-literal off`, then the same script with `--deploy-latest`. Measured: the old page was back on a signed-out GET about a minute after the deploy started. Set `a` and redeploy to turn it back on.
