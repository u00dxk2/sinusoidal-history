import { cycles } from "@/data/cycles";

export const metadata = {
  title: "About · Sinusoidal History",
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">About</h1>

      <section className="mt-6 space-y-3 text-foreground/80">
        <h2 className="text-lg font-semibold text-foreground">Intent</h2>
        <p>
          Sinusoidal History overlays named long-wave theories on a shared
          time axis so the viewer can see <em>where their predictions line
          up and where they disagree</em>. In Phase 1 we added three empirical
          data series and a calibration panel, so you can stress-test the
          theories instead of just admiring them side by side.
        </p>
        <p>
          Each cycle curve is a pure sinusoid built from the theory&apos;s own
          period and a single explicitly documented reference peak. That is a
          naïve choice on purpose: it strips the viz down to exactly one knob
          per cycle (calibration), so that disagreement between theories — not
          parameter fiddling — is what you see.
        </p>
      </section>

      <section className="mt-8 space-y-3 text-foreground/80">
        <h2 className="text-lg font-semibold text-foreground">
          Why every cycle peaks near now
        </h2>
        <p>
          If you look at Phase 0 you notice all three original cycles peak
          around the present. That is not convergence evidence — it is
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
          The implication is not that the theories are worthless — it is that
          the calibration is the single most consequential parameter, and it
          is doing a lot of the work of &quot;predicting&quot; the present.
          The calibration panel on the main page lets you move the peak and
          watch the correlation with real data change.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">Cycles in this version</h2>
        <ul className="space-y-4">
          {cycles.map((c) => (
            <li key={c.id}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  aria-hidden
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: c.color }}
                />
                <span className="font-semibold">{c.name}</span>
                <span className="font-mono text-xs text-foreground/60">
                  period {c.period_years}y · peak {c.reference_peak_year}
                </span>
              </div>
              <p className="mt-1 text-sm text-foreground/75">
                {c.short_description}
              </p>
              <p className="mt-1 text-sm text-foreground/60 italic">
                Peak calibration: {c.reference_peak_rationale}
              </p>
              <p className="mt-1 text-xs text-foreground/50">{c.source}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 space-y-3 text-foreground/80">
        <h2 className="text-lg font-semibold text-foreground">
          Intellectual-honesty disclaimer
        </h2>
        <p>
          All seven of these theories are contested. Kondratiev waves have
          never been cleanly confirmed in empirical long-run data; different
          scholars will mark different decades as the peak. Khaldun wrote in
          the 14th century about dynastic politics in a Maghrebi context.
          Huntington&apos;s creedal-passion cycle is an interpretive lens over
          American politics, not a measurement. Perez&apos;s techno-economic
          paradigm is the most empirically anchored of the four, but even
          there the period length and phase boundaries are arguments, not
          observations.
        </p>
        <p>
          The Phase 2 cycles raise the stakes here. Turchin&apos;s secular
          cycles have a real quantitative literature behind them but the
          150-year period is still a fitted parameter. Dalio&apos;s Big Cycle
          is a popularised composite, not a peer-reviewed measurement.
          Strauss-Howe is generational theory — influential in popular
          discourse, contested in academic history. Each of these comes with
          a caveat surfaced inline in the focused-facet view; for
          Strauss-Howe in particular, treat skeptically.
        </p>
        <p>
          Treat this tool as a way of making those judgments visible and
          comparable, not as evidence that any one cycle is real. See{" "}
          <a
            href="/methods"
            className="underline underline-offset-2 hover:text-foreground"
          >
            methods
          </a>{" "}
          for the data-side caveats.
        </p>
      </section>

      <section className="mt-8 space-y-3 text-foreground/80">
        <h2 className="text-lg font-semibold text-foreground">
          Phase 3 scope
        </h2>
        <p>
          Phase 3 turned this into an artifact that travels. Every UI state
          is in the URL, so you can share a specific calibration by DMing a
          link.{" "}
          <a
            href="/poster"
            className="underline underline-offset-2 hover:text-foreground"
          >
            /poster
          </a>{" "}
          is a dedicated shareable summary panel with a PNG download. The{" "}
          <a
            href="/embed/docs"
            className="underline underline-offset-2 hover:text-foreground"
          >
            /embed
          </a>{" "}
          route is iframe-safe for Substack inclusions. A curated layer of
          14 historical events can be toggled on to see whether 1929 or 1968
          or 2008 actually lands where the cycle theories predict. The
          Khaldun/conflict-deaths pairing is now log-transformed so WWI/WWII
          no longer flatten the rest of the series, and the phase-label
          bands were tightened so &quot;peaking&quot; actually means peaking.
        </p>
      </section>
    </div>
  );
}
