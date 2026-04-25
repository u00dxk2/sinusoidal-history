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
          near the present. That is not convergence evidence - it is a
          selection effect. Each theorist wrote in a period that felt
          consequential, and the &quot;reference peak&quot; they anchored to
          is, consciously or not, a recent moment. We read these theorists
          today precisely because their forecasts land in our era.
        </p>
        <p>
          A few specifics, since the choices matter. Huntington dated his
          fourth creedal-passion period as 1960–1975 (&quot;the S&amp;S
          years&quot;); we anchor at the interval midpoint (~1968) — that is
          the project&apos;s choice, not his. K-wave revivalists in the late
          1970s and early 1980s variously dated the post-WWII wave&apos;s
          turning point between 1968 and 1974; we use 1973 as the
          conventional anchor. Khaldun (d. 1406) made no claim about European
          history; we anchor at 1789 so the framework can be tested against
          the modern European record our other data series cover, and that is
          explicitly the project&apos;s editorial choice. Perez identifies
          2000–2001 as the &quot;Turning Point&quot; between Installation and
          Deployment phases of the ICT surge; we map her Turning Point to our
          sinusoid&apos;s peak — that conflates her concept with our
          mathematical convention.
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
          All seven theories are contested in different ways. Kondratiev
          waves have never been cleanly confirmed in empirical long-run data;
          spectral analyses report some weak periodicity, but period, phase
          dating, and existence are not agreed across studies. Khaldun wrote
          in the 14th century about dynastic politics in a Maghrebi context;
          applying his framework to a modern European-and-American axis is
          this project&apos;s choice. Huntington&apos;s creedal-passion cycle
          is an interpretive lens over American politics, not a measurement.
          Perez&apos;s techno-economic paradigm framework is rich and
          influential but methodologically qualitative — Schumpeterian
          historical pattern recognition, not statistical fitting. (An
          earlier draft of this site mistakenly labeled it
          &quot;quantitative.&quot;)
        </p>
        <p>
          Turchin&apos;s secular cycles have the most developed quantitative
          literature of the seven, but the 150-year period for the modern
          American cycle is a fitted parameter. Dalio&apos;s Big Cycle is a
          popularised composite, not a peer-reviewed measurement, and his own
          stated peak year for US power is the 1950s, not 1945 (we use 1950).
          Strauss-Howe is generational theory - influential in popular
          discourse, contested in academic history; reducing their four-
          turnings saeculum to a single sinusoid forces the choice of which
          peak to anchor (we use the post-WWII High at ~1955), and their
          predicted Crisis climax around 2020 is a trough in this construction,
          not a peak. Each cycle comes with a caveat surfaced inline in the
          focused-facet view; for Strauss-Howe in particular, treat
          skeptically.
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
