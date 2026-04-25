import { cycles } from "@/data/cycles";

export const metadata = {
  title: "About · Sinusoidal History",
  description:
    "What this site is, why it exists, what it doesn't claim, and the seven cycles in this version.",
};

export default function About() {
  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <header className="mb-8">
        <p className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
          About · The argument
        </p>
        <h1
          className="font-display mt-3 text-ink leading-[0.98] tracking-[-0.015em]"
          style={{ fontSize: "clamp(40px, 6vw, 56px)" }}
        >
          What this is
        </h1>
        <div className="editorial-rule mt-6" />
      </header>

      <section className="mt-8 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Intent
        </h2>
        <p>
          Sinusoidal History overlays seven named long-wave theories on a
          shared time axis so a reader can see <em>where their predictions
          line up and where they disagree</em>. Each cycle is paired with a
          real long-run data series, and a calibration panel lets you stress-
          test the fit instead of just admiring the curves side by side.
        </p>
        <p>
          Each cycle curve is a pure sinusoid built from the theory&apos;s own
          period and a single explicitly documented reference peak. That is a
          naïve choice on purpose: it strips the viz down to exactly one knob
          per cycle (calibration), so disagreement between theories - not
          parameter fiddling - is what you see.
        </p>
      </section>

      <section className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Why every cycle peaks near now
        </h2>
        <p>
          Open the chart and notice that nearly every cycle peaks somewhere
          near the present. That is not convergence evidence - it is
          publication bias. Each theorist wrote in a period that felt
          consequential, and the &quot;reference peak&quot; they anchored to
          is, consciously or not, a recent moment.
        </p>
        <p>
          Huntington anchored on 1965 because he was writing in 1981 and the
          civil-rights surge dominated his view. Kondratiev-wave popularisers
          anchored on 1973 because the oil shock was vivid to them. Khaldun
          anchored a European Enlightenment collapse because his later Western
          readers needed the framework legible in their own history. Perez
          anchors on 2000 because the dot-com bubble was the defining
          technology-finance event of her career.
        </p>
        <p>
          The implication is not that the theories are worthless - it is that
          the calibration is the single most consequential parameter, and it
          is doing a lot of the work of &quot;predicting&quot; the present.
          The calibration panel on the main page lets you move the peak and
          watch the correlation with real data change.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Cycles in this version
        </h2>
        <ul className="space-y-5">
          {cycles.map((c) => (
            <li
              key={c.id}
              className="border-t border-rule/30 pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  aria-hidden
                  className="inline-block w-[3px] h-5 rounded-full self-stretch"
                  style={{ backgroundColor: c.color }}
                />
                <span className="font-display text-[18px] tracking-tight text-ink font-medium">
                  {c.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/85">
                  period {c.period_years}y · peak {c.reference_peak_year}
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-snug text-ink/85">
                {c.short_description}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft font-display-italic">
                Peak calibration: {c.reference_peak_rationale}
              </p>
              <p className="mt-1.5 text-[11px] tracking-wide text-ink-soft/70 font-mono">
                {c.source}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Intellectual-honesty disclaimer
        </h2>
        <p>
          All seven theories are contested. Kondratiev waves have never been
          cleanly confirmed in empirical long-run data; different scholars
          will mark different decades as the peak. Khaldun wrote in the 14th
          century about dynastic politics in a Maghrebi context. Huntington&apos;s
          creedal-passion cycle is an interpretive lens over American
          politics, not a measurement. Perez&apos;s techno-economic paradigm
          is the most empirically anchored of these, but even there the
          period length and phase boundaries are arguments, not observations.
        </p>
        <p>
          The newer additions raise the stakes. Turchin&apos;s secular cycles
          have a real quantitative literature behind them but the 150-year
          period is still a fitted parameter. Dalio&apos;s Big Cycle is a
          popularised composite, not a peer-reviewed measurement. Strauss-Howe
          is generational theory - influential in popular discourse, contested
          in academic history. Each comes with a caveat surfaced inline in the
          focused-facet view; for Strauss-Howe in particular, treat skeptically.
        </p>
        <p>
          Treat this tool as a way of making those judgments visible and
          comparable, not as evidence that any one cycle is real. See{" "}
          <a
            href="/methods"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            methods
          </a>{" "}
          for the data-side caveats and{" "}
          <a
            href="/colophon"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            colophon
          </a>{" "}
          for how the site was built.
        </p>
      </section>
    </article>
  );
}
