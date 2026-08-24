import Link from "next/link";
import { cycles } from "@/data/cycles";
import { cycleRoutePath } from "@/lib/cycleRoutes";

export const metadata = {
  title: "About · Sinusoidal History",
  description:
    "What this site is, why it exists, what it doesn't claim, and the ten cycles in this version.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <header className="mb-8">
        <p className="text-[11px] sm:text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
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
          Sinusoidal History puts ten named long-wave theories of history on
          one shared time axis so you can see <em>where their predictions
          line up and where they disagree</em>. Nine of the ten are paired
          with a real long-run data series (Turchin&apos;s fathers-and-sons
          cycle has none this round), and a calibration panel lets you
          stress-test each fit instead of just admiring the curves side by
          side.
        </p>
        <p>
          Each curve is a pure sinusoid built from the theory&apos;s own
          stated period and a single documented reference peak. That is a
          naïve choice on purpose. One knob per cycle means that when two
          theories disagree on this chart, the disagreement comes from the
          theories - not from us tuning parameters until something looked
          profound.
        </p>
      </section>

      <section className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Why every cycle peaks near now
        </h2>
        <p>
          Open the chart and nearly every cycle peaks somewhere near the
          present. That is not evidence the theories converge - it is a
          selection effect. Each theorist wrote in a moment that felt
          consequential and anchored the cycle, consciously or not, to a
          recent peak. And we read these particular theorists today precisely
          because their forecasts land in our era. The ones whose cycles
          peaked quietly in 1880 don&apos;t get republished.
        </p>
        <p>
          A few specifics, since the choices matter. Huntington dated his
          fourth creedal-passion period as 1960–1975 (&quot;the S&amp;S
          years&quot;); we anchor at the interval midpoint (~1968) - that is
          the project&apos;s choice, not his. K-wave revivalists in the late
          1970s and early 1980s variously dated the post-WWII wave&apos;s
          turning point between 1968 and 1974; we use 1973 as the
          conventional anchor. Khaldun (d. 1406) made no claim about European
          history; we anchor at 1789 so the framework can be tested against
          the modern US and global record our data series cover, and that is
          explicitly the project&apos;s editorial choice. Perez identifies
          2000–2001 as the &quot;Turning Point&quot; between Installation and
          Deployment phases of the ICT surge; we map her Turning Point to our
          sinusoid&apos;s peak - that conflates her concept with our
          mathematical convention, and 2000 is best read as her
          financial-frenzy peak (her 2009 &quot;double bubble&quot; paper
          treats the 2000 and 2008 crashes as two parts of one structural
          episode). The conventional tabulation of Schlesinger Jr.&apos;s
          scheme dates the most recently completed liberal era 1962–1978; we
          anchor at the midpoint (~1970), a project construction, but
          Schlesinger himself expected the next liberal turn shortly before
          or after 1990, which a strict 30-year-from-1970 sinusoid does not
          reproduce - read his curve as a stylization of his stated period,
          not as his own forecast.
        </p>
        <p>
          None of this makes the theories worthless. It does mean the
          peak-year choice is the most consequential parameter on the site,
          and that it is doing a lot of the work of
          &quot;predicting&quot; the present. The calibration panel on the
          main page exists so you can check this yourself: move the peak and
          watch the correlation with real data change.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Cycles in this version
        </h2>
        <p className="text-[15px] leading-[1.65] text-ink/85">
          Each has its own page with the full calibration rationale, sourcing,
          and paired-data provenance - see{" "}
          <Link
            href="/cycles"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            all ten cycles
          </Link>
          .
        </p>
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
                <Link
                  href={cycleRoutePath(c)}
                  className="font-display text-[18px] tracking-tight text-ink font-medium underline decoration-ink/25 underline-offset-[3px] hover:decoration-ink transition-colors"
                >
                  {c.name}
                </Link>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/85">
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
          All ten cycles are contested in different ways. Kondratiev
          waves have never been cleanly confirmed in empirical long-run data;
          spectral analyses report some weak periodicity, but period, phase
          dating, and existence are not agreed across studies. Khaldun wrote
          in the 14th century about dynastic politics in a Maghrebi context;
          applying his framework to a modern US-and-global axis is
          this project&apos;s choice. Huntington&apos;s creedal-passion cycle
          is an interpretive lens over American politics, not a measurement.
          Perez&apos;s techno-economic paradigm framework is rich and
          influential but methodologically qualitative - Schumpeterian
          historical pattern recognition, not statistical fitting. (An
          earlier draft of this site mistakenly labeled it
          &quot;quantitative.&quot;)
        </p>
        <p>
          Turchin&apos;s secular cycles have the most developed quantitative
          literature of the ten, but the 150-year period for the modern
          American cycle is a fitted parameter. Dalio&apos;s Big Cycle is a
          popularised composite, not a peer-reviewed measurement, and his own
          stated peak year for US power is the 1950s, not 1945 (we use 1950).
          Strauss-Howe is generational theory - influential in popular
          discourse, contested in academic history; reducing their four-
          turnings saeculum to a single sinusoid forces the choice of which
          peak to anchor (we use the post-WWII High at ~1955). With period
          84, the trough of this construction lands at 1997 and the next
          peak at 2039; their predicted Fourth-Turning Crisis climax around
          2020 sits on the rising arm of the sinusoid (cos ≈ +0.15), neither
          at a trough nor a peak - there is no peak-year anchor that lines
          their Crisis climax up with the sinusoid&apos;s extrema. Schlesinger Jr.&apos;s liberal/conservative cycle is
          interpretive periodization formalizing his father&apos;s alternating
          phases (averaging 16.55 years in the elder Schlesinger&apos;s count)
          into a ~30-year full cycle; the empirical pairing (Stimson Policy
          Mood) only covers 1952 onward, so the Schlesinger curve&apos;s
          pre-1952 shape cannot be stress-tested against the data.
          Modelski&apos;s long cycle is a 100–120-year range that he says
          &quot;does not connote strict cycles&quot;; we plot a fixed
          110-year sinusoid he would disclaim, paired with a largest-economy
          series that is a proxy for a correlate of his naval construct, not
          the construct itself. Turchin&apos;s fathers-and-sons cycle is a
          three-peak claim (1870, 1920, 1970) from a single 2012 paper by the
          same author as the 150-year secular cycle - not independent
          corroboration - and its observed pattern is sharply peaked, not
          sinusoidal. Four cycles (Schlesinger Jr., Strauss-Howe, Modelski,
          and Turchin fathers-and-sons) carry an inline caveat surfaced in
          the focused-facet view; treat those caveats as part of the claim.
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

      <footer className="mt-12 pt-4 border-t border-rule/30 text-[11px] tracking-[0.2em] uppercase text-ink-soft/70 font-mono">
        Last updated: 2026-08-19
      </footer>
    </article>
  );
}
