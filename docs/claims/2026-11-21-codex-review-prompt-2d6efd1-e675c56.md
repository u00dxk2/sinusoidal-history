# Code review — commits 2d6efd14078580c489131e3308430fb2dabe33e1 (floor) and e675c566a8da7d11d4d9ba81209433580358e4f2 (build), merge-base bdfa4bbde19ffcb757925afb4783f92a5d77a24f

You are a read-only reviewer. Do NOT edit files. Repo: C:\dev\skylark\sinusoidal-cycles (Next.js 16 app, sinusoidalhistory.com, deployed on Render). Review `git diff bdfa4bbde19ffcb757925afb4783f92a5d77a24f 2d6efd14078580c489131e3308430fb2dabe33e1` (items 3-6 below) and `git diff 2d6efd14078580c489131e3308430fb2dabe33e1 e675c566a8da7d11d4d9ba81209433580358e4f2` (items 1-2), and say per finding which commit it is in. You may run read-only commands (git, node one-liners, reading node_modules/next/dist/docs). Do not run a build or the test suite.

Find correctness bugs, regressions, and anything that changes what users or crawlers get beyond the stated intent. Tag each finding REPRODUCED / SUPPLIED / STATIC, give severity (HIGH / MEDIUM / LOW), file:line, a concrete failure scenario, and a suggested fix (the lead treats it as a hypothesis).

Stated intent:
1. Cycle pages: a server-rendered "Worked example" section (src/components/WorkedExample.tsx, src/lib/workedExample.ts). Must not list any year past the drawn period's end (David's ruling, card 777f3084: "Yes: one wave per cycle, stop at today, retire the yearly state pages"). Must not break existing page-structure tests (seriesOverlay.test.ts order pins, cutPeriodCopy.test.ts "one period" ban on Perez/Turchin, testedSeries.test.ts TEST_RAN regex, bareCos.test.ts, cyclesIndexTag.test.ts maxAnchorDepth) — check the new text against each of those guards' regexes; they were NOT all run locally (only workedExample/homeIndex/cycleRoutes tests were). CI runs the full suite with NEXT_PUBLIC_DESIGN_PASS_VARIANT unset; production has it set to "a".
2. Home: ten links to /cycles/<slug>, a new title, WebSite + ItemList JSON-LD. Check the home page's check-entry-folds budget is not affected (the new section is at the bottom), that homeIndex.test.ts's renderToStaticMarkup(Home()) is sound (Viz is a client component inside Suspense), and that the JSON-LD is true to the visible page.
3. og:url per page via src/lib/pageMetadata.ts — check Next's metadata merging: does the page-level openGraph/twitter replace the layout's correctly, and does the title template still apply to <title>? Is og:title now "X · Sinusoidal History" as intended?
4. Sitemap: HTML only, no lastModified.
5. next.config.ts: sinusoidal-history.onrender.com added to the host-redirect regex; Link rel=canonical headers on /about.md, /methods.md, /colophon.md. Check the regex/`has` semantics (anchoring), that it cannot redirect sinusoidalhistory.com itself (loop), and that the headers entries are valid for this Next version.
6. scripts/indexnow-ping.mjs: refuses off-host URLs; key file public/<key>.txt.

End with a one-line verdict.


Also check, as CLAIMS (verdict HOLDS / REFUTED-AS-WRITTEN / UNVERIFIABLE-HERE with the narrower sentence), the two public strings added after the claims pass r1: (1) the /methods meta description in src/app/(app)/methods/page.tsx, "The curve model, the data sources and their transforms, normalization — and where the method breaks down, including why the correlation readout isn't a test."; (2) the scaling formula lines from src/lib/workedExample.ts scaleFormula as rendered on all nine paired cycle pages (e.g. Khaldun "plotted height ≈ 2 × ln(1 + value) ÷ 5.233 − 1", Kondratiev "plotted height = 2 × (value + 2.4902) ÷ (4.787 + 2.4902) − 1").
