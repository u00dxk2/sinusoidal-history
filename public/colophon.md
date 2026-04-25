# Colophon · A note from the maker

> Plain-markdown mirror of https://sinusoidal-history.skylarkcreations.com/colophon. The canonical rendered version is the React page at `/colophon`; this file shadows the prose for LLM and agent consumption. CORS-enabled.

# From the maker

*Mark R and I were on a phone call Friday - both of us walking, both on our own loops. He pitched what he called "the sinusoidal pattern of history": could you plot Khaldun's 5 stages, Huntington's 60-year cycles, and the rest as actual sine waves on one axis, and see where they net out? (He also raised counterfactuals and alternate-history maps as related territory.) I told him I'd take a swing.*

The spec emerged across the next few Claude Code sessions. What I wanted: seven theorists drawing seven curves on one shared canvas, each paired with a real long-run data series, with a calibration panel that lets you stress-test the fit instead of nodding politely.

A few notes, since people ask.

## On the AI part

I built this with Claude Code (Opus 4.7) over five rough phases across a few days. The model writes D3 plumbing fast and doesn't typo. It is reliably worse than me at noticing when a chart is dishonest. Every commit went through me. Every cycle's reference peak is a choice I made and can defend. The footer line — *cycles are contested, this is a comparison tool, not prophecy* — is what I actually believe. The model is fast scaffolding, not authorship.

## On the math

Each cycle is a single sinusoid built from the theory's own period and one explicitly documented peak. That's deliberately naïve. The cycles aren't real with more fidelity than that, and the simple math keeps the calibration drawer doing the most consequential work - move the peak year, watch the correlation move.

## On the data

Six of the seven cycles are paired with a real long-run series: DW-NOMINATE polarization, WID top-1% wealth share, conflict deaths (log-transformed so the World Wars don't flatten everything else), total factor productivity, the V-Dem liberal-democracy index, U.S. share of world GDP. The pairings are defensible but not the only choices. I read each series myself before wiring it in. See [methods](https://sinusoidal-history.skylarkcreations.com/methods) for provenance.

## On the convergence problem

Every cycle on this page peaks near the present. That isn't convergence - it is a selection effect. Each theorist wrote in a moment that felt consequential and anchored their cycle there; we read them precisely because their climaxes land in our era. The site says it on the home page, on [/about](https://sinusoidal-history.skylarkcreations.com/about), and here. Carry the caveat with you or the rest of the project doesn't work.

---

*Thanks Mark. Send the next idea.*

Source: [u00dxk2/sinusoidal-history](https://github.com/u00dxk2/sinusoidal-history). The build journal lives in [docs/how-this-was-made.md](https://github.com/u00dxk2/sinusoidal-history/blob/main/docs/how-this-was-made.md). Bug or a fit you can't defend? Tell me.

David Kooi · Skylark Creations · April 2026

*Last updated: 2026-04-25*
