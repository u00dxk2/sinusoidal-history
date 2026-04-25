import Link from "next/link";

export const metadata = {
  title: "Colophon · Sinusoidal History",
  description:
    "A note from the maker on how this site was built, what was AI, and what was me.",
};

export default function Colophon() {
  return (
    <article className="max-w-2xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <header className="mb-8">
        <p className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
          Colophon · A note from the maker
        </p>
        <h1
          className="font-display mt-3 text-ink leading-[0.98] tracking-[-0.015em]"
          style={{ fontSize: "clamp(40px, 6vw, 56px)" }}
        >
          From the maker
        </h1>
        <div className="editorial-rule mt-6" />
      </header>

      <div className="space-y-5 text-[16px] leading-[1.65] text-ink/85 font-serif">
        <p className="font-display-italic text-ink/80 text-[19px] leading-snug">
          Mark R and I were on a phone call Friday - both of us walking, both
          on our own loops. He pitched what he called &ldquo;the sinusoidal
          pattern of history&rdquo;: could you plot Khaldun&apos;s 5 stages,
          Huntington&apos;s 60-year cycles, and the rest as actual sine waves
          on one axis, and see where they net out? (He also raised
          counterfactuals and alternate-history maps as related territory.) I
          told him I&apos;d take a swing.
        </p>

        <p>
          The spec emerged across the next few Claude Code sessions. What I
          wanted: seven theorists drawing seven curves on one shared canvas,
          each paired with a real long-run data series, with a calibration
          panel that lets you stress-test the fit instead of nodding politely.
        </p>

        <p>A few notes, since people ask.</p>

        <h2 className="font-display text-[22px] tracking-tight text-ink pt-4 mt-6 border-t border-rule/30">
          On the AI part
        </h2>
        <p>
          I built this with Claude Code (Opus 4.7) over five rough phases across
          a few days. The model writes D3 plumbing fast and doesn&apos;t typo.
          It is reliably worse than me at noticing when a chart is dishonest.
          Every commit went through me. Every cycle&apos;s reference peak is a
          choice I made and can defend. The footer line - <em>cycles are
          contested, this is a comparison tool, not prophecy</em> - is what I
          actually believe. The model is fast scaffolding, not authorship.
        </p>

        <h2 className="font-display text-[22px] tracking-tight text-ink pt-4 mt-6 border-t border-rule/30">
          On the math
        </h2>
        <p>
          Each cycle is a single sinusoid built from the theory&apos;s own
          period and one explicitly documented peak. That&apos;s deliberately
          naïve. The cycles aren&apos;t real with more fidelity than that, and
          the simple math keeps the calibration drawer doing the most
          consequential work - move the peak year, watch the correlation move.
        </p>

        <h2 className="font-display text-[22px] tracking-tight text-ink pt-4 mt-6 border-t border-rule/30">
          On the data
        </h2>
        <p>
          Six of the seven cycles are paired with a real long-run series:
          DW-NOMINATE polarization, WID top-1% wealth share, conflict deaths
          (log-transformed so the World Wars don&apos;t flatten everything
          else), total factor productivity, the V-Dem liberal-democracy index,
          U.S. share of world GDP. The pairings are defensible but not the only
          choices. I read each series myself before wiring it in. See{" "}
          <Link
            href="/methods"
            className="underline underline-offset-[3px] decoration-ink/30 hover:decoration-ink transition-colors"
          >
            methods
          </Link>{" "}
          for provenance.
        </p>

        <h2 className="font-display text-[22px] tracking-tight text-ink pt-4 mt-6 border-t border-rule/30">
          On the convergence problem
        </h2>
        <p>
          Every cycle on this page peaks near the present. That isn&apos;t
          convergence - it is publication bias. Each theorist wrote in a moment
          that felt consequential and anchored their cycle there. The site says
          it on the home page, on{" "}
          <Link
            href="/about"
            className="underline underline-offset-[3px] decoration-ink/30 hover:decoration-ink transition-colors"
          >
            /about
          </Link>
          , and here. Carry the caveat with you or the rest of the project
          doesn&apos;t work.
        </p>

        <div className="pt-6 mt-8 border-t-2 border-ink/40">
          <p className="font-display-italic text-ink/85 text-[18px] leading-snug">
            Thanks Mark. Send the next idea.
          </p>
          <p className="mt-4 text-[14px] text-ink-soft">
            Source:{" "}
            <a
              href="https://github.com/u00dxk2/sinusoidal-history"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-[3px] decoration-ink/30 hover:decoration-ink transition-colors"
            >
              u00dxk2/sinusoidal-history
            </a>
            . The build journal lives in{" "}
            <a
              href="https://github.com/u00dxk2/sinusoidal-history/blob/main/docs/how-this-was-made.md"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-[3px] decoration-ink/30 hover:decoration-ink transition-colors"
            >
              docs/how-this-was-made.md
            </a>
            . Bug or a fit you can&apos;t defend? Tell me.
          </p>
          <p className="mt-6 text-[12px] tracking-[0.2em] uppercase text-ink-soft font-mono">
            David Kooi · Skylark Creations · April 2026
          </p>
        </div>
      </div>
    </article>
  );
}
