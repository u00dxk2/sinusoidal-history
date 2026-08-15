import { dataSeries } from "@/data/series";
import { cycles } from "@/data/cycles";

export const metadata = {
  title: "Methods · Sinusoidal History",
  description:
    "Data provenance, transformations, normalization, and methodological caveats.",
  alternates: { canonical: "/methods" },
};

export default function Methods() {
  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16 [&_p]:max-w-[68ch]">
      <header className="mb-8">
        <p className="text-[11px] sm:text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
          Methods · Provenance &amp; caveats
        </p>
        <h1
          className="font-display mt-3 text-ink leading-[0.98] tracking-[-0.015em]"
          style={{ fontSize: "clamp(40px, 6vw, 56px)" }}
        >
          How the numbers were chosen
        </h1>
        <p className="mt-3 font-display-italic text-ink/75 text-[17px] leading-snug">
          Where each data series comes from, what gets transformed, and why
          the correlation number on the calibration panel is a diagnostic and
          not a test statistic.
        </p>
        <div className="editorial-rule mt-6" />
      </header>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Data sources
        </h2>
        <ul className="space-y-5">
          {dataSeries.map((s) => {
            const cycle = cycles.find((c) => c.id === s.associated_cycle_id);
            const slug = s.data_file.replace("/data/", "").replace(".csv", "");
            return (
              <li
                key={s.id}
                className="border-t border-rule/30 pt-4 first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    aria-hidden
                    className="inline-block w-[3px] h-5 rounded-full self-stretch"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="font-display text-[18px] tracking-tight text-ink font-medium">
                    {s.name}
                  </span>
                  {cycle && (
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/85">
                      paired with {cycle.name}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[15px] leading-snug text-ink/85">
                  {s.short_description}
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                  {s.association_note}
                </p>
                <p className="mt-2 text-[12px] tracking-wide text-ink-soft/75 font-mono leading-relaxed">
                  Source:{" "}
                  <a
                    href={s.source_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline underline-offset-[3px] decoration-ink-soft/50 hover:decoration-ink hover:text-ink transition-colors"
                  >
                    {s.source}
                  </a>
                  {" · license: "}
                  {s.license}
                  {" · provenance: "}
                  <a
                    href={`/data/${slug}.source.md`}
                    className="underline underline-offset-[3px] decoration-ink-soft/50 hover:decoration-ink hover:text-ink transition-colors"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {slug}.source.md
                  </a>
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Normalization
        </h2>
        <p>
          Every overlaid data series is rescaled to the interval [-1, 1]
          using its own minimum and maximum over the visible window. The
          eight cycle curves are sinusoids of unit amplitude (the
          <code className="font-mono text-[13px]">amplitude_normalized</code>{" "}
          field on every cycle is 1.0). The vertical axis is therefore
          dimensionless: visual peak heights do not represent real-world
          magnitudes, only relative shape over time. That is convenient for
          eyeballing shape against a normalized sinusoid, and it is lossy:
          it hides absolute magnitude and makes level differences invisible.
          Two points stand out:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            A series with one enormous spike (e.g. global conflict deaths in
            WWII) compresses every other variation toward a thin band. The
            visible <em>shape</em> near the peaks is real; the visible shape
            away from them is attenuated.
          </li>
          <li>
            Because normalization is per-series, you cannot compare amplitudes
            across series. Only across time within a single series.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Why Pearson is the wrong tool
        </h2>
        <p>
          The calibration panel reports a Pearson correlation between the
          data series and the cycle curve. Pearson assumes two things this
          context violates:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <strong className="text-ink">Phase sensitivity.</strong> For two
            sinusoids of the same period, Pearson r reduces to{" "}
            <code className="font-mono text-[13px]">cos(Δφ)</code>, where Δφ is
            the phase offset between them. A perfect cosine evaluated over one
            full period has r = 1 with itself, r = 0 with a quarter-period
            shift, and r = −1 with a half-period shift — even though all three
            are the same cycle in any structural sense. Pearson therefore
            measures phase alignment, not cyclic similarity, and the
            calibration slider primarily moves r by changing Δφ.
          </li>
          <li>
            <strong className="text-ink">Independence of observations.</strong>{" "}
            Time series are autocorrelated, so classical Pearson significance
            tests are anti-conservative on data like ours: the effective
            sample size is smaller than the row count, and naive p-values
            overstate significance. The calibration drawer therefore reports
            the r value but not a p-value.
          </li>
        </ul>
        <p>
          The panel exposes Pearson anyway because the single most important
          question - &quot;how much is the peak-year choice doing?&quot; - is
          visible just from watching the correlation change as you move the
          slider. That diagnostic use is valid. Treating the number as a test
          statistic is not.
        </p>
        <p>
          Better tools for cyclic data include cross-correlation at varying
          lags, the Fourier periodogram (or Lomb-Scargle for unevenly sampled
          records, which the present series are not), and wavelet
          decomposition for non-stationary signals. These are flagged for
          future work.
        </p>
      </section>

      <section className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Missing and sparse data
        </h2>
        <p>
          The curves cover 1600–2050. Every data series has shorter coverage.
          DW-NOMINATE: 46th Congress–present (1879–current); Fernald TFP
          annual series 1948–present, displayed 1948–present (the 1948 and
          1949 values use a clipped, asymmetric window because a true 5-year
          centered window only becomes available at 1950 — treat the first
          two displayed points as edge artifacts); Project Mars conflict
          data 1800–2011;
          WID top-1% wealth modern coverage 1913–most-recent (with five
          earlier decadal points spliced from secondary sources, see below);
          Maddison US/world GDP share trimmed to 1870+ (earlier years have
          unstable country coverage); V-Dem 1789–present; Stimson Policy
          Mood 1952–2024. Gaps are simply absent from the chart - nothing
          is interpolated. If a series fails to load, its legend entry shows
          &quot;data unavailable&quot; and the rest of the viz keeps working.
        </p>
        <p>
          Two finer caveats. The modern WID/Saez–Zucman US top-1% wealth
          series begins in 1913; the five pre-1913 points (1820, 1850, 1880,
          1900, 1910) come from earlier historical sources spliced via OWID/
          WID and have wider standard errors. The TFP 5-year centered rolling
          average is this project&apos;s derivation from Fernald&apos;s annual{" "}
          <code className="font-mono text-[13px]">dtfp_util</code> column
          (utilization-adjusted TFP growth), not Fernald&apos;s own published
          series; the build script keeps clipped (asymmetric) windows at the
          boundaries rather than dropping rows, so 1948 = mean of {"{"}1948,
          1949, 1950{"}"} and 1949 = mean of {"{"}1948, 1949, 1950, 1951{"}"} —
          read those endpoints with appropriate skepticism.
        </p>
        <p>
          A third caveat. The Maddison rebuild forward-fills each
          country&apos;s GDP between sparse benchmark observations but does
          not back-fill before each country&apos;s first observation. Many
          non-Western countries enter Maddison only at 1950, so the world
          denominator is systematically smaller pre-1950 than post-1950 —
          biasing US share of world GDP upward for early years. The 1870
          value (~10.6%) and the magnitude of the 1870→1945 climb should
          both be read as &quot;US share of countries Maddison covers in
          that year,&quot; not &quot;US share of world GDP&quot; literally.
        </p>
      </section>

      <section className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Notes on individual pairings
        </h2>
        <p>
          <strong className="text-ink">V-Dem with Strauss-Howe, not
          Huntington.</strong>{" "}
          An earlier draft of this project paired V-Dem with Huntington as a
          secondary signal alongside DW-NOMINATE. We moved it to Strauss-Howe
          so each cycle would have exactly one paired series. Both are
          arguments. The Strauss-Howe pairing reads V-Dem&apos;s recent
          decline as a Fourth-Turning institutional-stress signal; the
          Huntington pairing would have read it as the trough side of a
          creedal-passion cycle. The data is the same; the framing differs.
        </p>
        <p>
          <strong className="text-ink">Project Mars covers conventional
          wars only.</strong>{" "}
          The conflict-deaths series registers years like 2010 as zero
          because no qualifying conventional war (interstate or civil war
          between states with differentiated militaries causing ≥500 deaths)
          was active that year — even though other conflict datasets (UCDP,
          COW, PRIO) record substantial casualties in 2010 (Afghanistan,
          Iraq, Mexican drug war). The series therefore measures
          conventional-war intensity, not all conflict deaths; read drops
          to zero accordingly.
        </p>
        <p>
          <strong className="text-ink">No paired series for Perez.</strong>{" "}
          The techno-economic paradigm story is harder to reduce to a single
          century-long series. TFP growth is paired with Kondratiev because
          the Kondratiev framing is more directly about productivity surges;
          Perez tells a richer story about installation and deployment phases
          that no single time series captures cleanly.
        </p>
        <p>
          <strong className="text-ink">Stimson Policy Mood with Schlesinger
          Jr.</strong>{" "}
          Of the eight cycles, Schlesinger&apos;s pairing is the closest the
          site gets to a direct measurement: Stimson&apos;s index is, by
          construction, an estimate of US public preference for liberal vs.
          conservative domestic policy — exactly what Schlesinger&apos;s cycle
          claims to track. The catch is coverage: the series only starts in
          1952, so only Schlesinger&apos;s most recent two completed swings
          (mid-50s trough → late-60s peak → late-70s trough) sit inside the
          empirical window. The pre-1952 shape of the Schlesinger curve
          cannot be stress-tested against the paired data; treat the
          calibration drawer&apos;s Pearson r accordingly.
        </p>
        <p>
          See each series&apos; per-source provenance file for full retrieval
          and processing notes.
        </p>
      </section>

      <footer className="mt-12 pt-4 border-t border-rule/30 text-[11px] tracking-[0.2em] uppercase text-ink-soft/70 font-mono">
        Last updated: 2026-04-26
      </footer>
    </article>
  );
}
