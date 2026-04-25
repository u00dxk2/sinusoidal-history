# how this was made

Mark R and I were on a phone call Friday - both of us walking, both on our own loops. He pitched what he called "the sinusoidal pattern of history": could you plot Khaldun's 5 stages, Huntington's 60-year cycles, and the rest as actual sine waves on one axis, and see where they net out? He also raised counterfactuals and alternate-history maps as related territory. I told him I'd take a swing.

The image stuck. Seven theorists - Ibn Khaldun in the 14th century, Kondratiev in the 1920s, Huntington in the early '80s, Perez in the 2000s, Turchin and Dalio and Strauss-Howe in our present - all drawing different sine curves on the same canvas. None of them coordinating across six centuries.

That's a chart I wanted to see.

So I built it. The site is at `sinusoidal-history.skylarkcreations.com`. This note is the honest accounting of how that happened, written for Mark and for anyone who wants to know what was AI and what was me.

---

## the seed

The call ran maybe an hour. We moved through Kondratiev, through Strauss-Howe, through whether Dalio's "big cycle" framework is doing real intellectual work or just making vivid charts. Mark's pitch was the cleanest version: forget the prose arguments, plot the cycles literally, see what the chart says.

The spec emerged across the next few Claude Code sessions, not on the call. Seven cycles. One axis. A real data series paired with each, so the prettiest theory still has to face the messy actual numbers. A calibration panel so a reader can move the reference peak and watch their pet theory get less convincing.

The editorial point of the project is small and specific: most cycle visualizations show you a clean curve and let you nod. I wanted one that would let you stress-test the curve against a real series and admit when the fit is bad.

---

## what the LLM actually did

I built this with Claude Code (Opus 4.7, 1M context) - the model I do most of my coding with - across five rough phases over a few days. Roughly:

- **Phase 0**: scaffolding. Next.js skeleton, the seven cycle JSON entries with their periods and reference peaks, the basic D3 axis. I drove the architecture decisions; the model wrote the boilerplate fast.
- **Phase 1**: the real data series. I picked the pairings (DW-NOMINATE for Huntington, WID for Kondratiev, conflict deaths for Khaldun, TFP for Perez, V-Dem for Strauss-Howe, US-share-of-world-GDP for Dalio). The model fetched, parsed, and wired up the CSV ingestion. I read each series myself and rejected one fit that felt like cherry-picking.
- **Phase 2**: the calibration drawer. Small math but it's where the project lives intellectually - you need to be able to drag a peak year and watch correlation update. The model wrote the slider plumbing. I wrote and rewrote the copy that says "this is a diagnostic, not a test statistic."
- **Phase 3**: shareability. URL state, embed route, OpenGraph card, the dedicated `/poster` page. Lots of small Next.js plumbing. Mostly the model.
- **Phase 4**: ship-ready. Mobile, 404, deploy on Render with a Squarespace CNAME pointed at it. Mostly me debugging the deploy.
- **Phase 5** (yesterday-into-today): editorial design pass. Switched the whole site to Fraunces serif, redrew the cycle palette to manuscript-illumination jewel tones, rebuilt the State-of-the-cycles panel and the poster as proper editorial artifacts. The model did the keystrokes; I steered the aesthetic and rejected the things that came back looking like a SaaS dashboard.

What I want to be clear about: there's no version of this where I sat back and read the output. Every commit went through me. Every cycle's reference peak is a choice I made and can defend. The footer line - "cycles are contested, this is a comparison tool, not prophecy" - is what I actually believe. The model is fast scaffolding, not authorship.

What the model is genuinely better at than me: writing 200 lines of D3 brush plumbing in two minutes without typos. What it is reliably worse at: knowing when a chart is dishonest. That second part is still mine.

---

## where it got hard

Three places, in case you're curious.

**The Khaldun pairing.** Conflict deaths over centuries are dominated by the two World Wars - they sit so far above everything else that the rest of the series flattens into a baseline and the visual story becomes "WWI happened." The fix was a log transform. Obvious in retrospect; took a beat to actually see.

**The convergence problem.** Every cycle on the chart peaks near the present. I noticed that staring at the Phase 0 prototype, and it became the project's actual editorial purpose. It isn't convergence - it is publication bias. Each theorist wrote in a moment that felt consequential and anchored their cycle there. Writing that out loud on the home page and on `/about`, in a way that didn't sound either conspiratorial ("they're all in on it") or dismissive ("none of this is real"), took several rewrites.

**The poster.** It's intended to be screenshotted and shared. A screenshot is a test of nerve - whatever's on the page becomes the whole argument, with no defense. The first three versions of the poster looked like a competent dashboard. The current version - Fraunces, two-line italic headline, numbered byline rows - started looking like an artifact. That took deliberate iteration; it isn't what came back the first time.

---

## what's still rough

The math is naive on purpose - one sinusoid per theory, one knob per cycle (the calibration year). A reasonable extension would be a damped or shape-fit curve. I think the naïveté is part of the honesty: the cycles aren't real with that much fidelity, and pretending otherwise with a fancier model would mislead. But it is a choice and a future version could revisit it.

The OG card uses Georgia rather than Fraunces because Satori needs the font as an ArrayBuffer and bundling a variable serif in the worker adds weight. Cosmetic but real - the social card doesn't quite match the site.

The data-series pairings are defensible but not the only ones I could have chosen. DW-NOMINATE for Huntington is fine; you could argue for affective-polarization measures instead. The site should probably let you toggle between paired series. It currently doesn't.

And the cycles themselves are still contested. Kondratiev waves have never been cleanly confirmed in empirical long-run data. Strauss-Howe is generational theory and academically shaky. The project is a comparison tool. Treat it as one.

---

## thanks

Mark - thanks for the call and the framing. Send the next idea. The build was a few days of fairly enjoyable work; the conversation that started it was an hour.

If anyone else is reading: source is on GitHub at `u00dxk2/sinusoidal-history`. The data files live in `/src/data` with citations. The math lives in `/src/lib/cycleMath.ts` and the test suite (45 cases) is in `/src/lib/cycleMath.test.ts`. If you find a bug or a fit you can't defend, tell me.

That's the honest version.

David Kooi · Skylark Creations · April 2026
