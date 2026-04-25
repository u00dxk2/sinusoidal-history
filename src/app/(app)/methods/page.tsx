import { dataSeries } from "@/data/series";
import { cycles } from "@/data/cycles";

export const metadata = {
  title: "Methods · Sinusoidal History",
  description:
    "Data provenance, transformations, normalization, and methodological caveats.",
};

export default function Methods() {
  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <header className="mb-8">
        <p className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
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
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/85">
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
                <p className="mt-2 text-[11px] tracking-wide text-ink-soft/75 font-mono leading-relaxed">
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
          Every overlaid series is rescaled to the interval [-1, 1] using its
          own minimum and maximum over the visible window. That is convenient
          for eyeballing shape against a normalized sinusoid, and it is lossy:
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
            <strong className="text-ink">Linearity.</strong> Sinusoids are not
            linear in year. Pearson will say a perfect cosine has zero
            correlation with the same cosine shifted by a quarter period,
            which is correct numerically but misses that one is just the
            derivative of the other.
          </li>
          <li>
            <strong className="text-ink">Independence of observations.</strong>{" "}
            Time series are autocorrelated. Classical Pearson significance
            tests don&apos;t apply; the number has no legitimate p-value.
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
          lags, Lomb-Scargle or Fourier spectra, and wavelet decomposition.
          These are flagged for future work.
        </p>
      </section>

      <section className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Missing and sparse data
        </h2>
        <p>
          The curves cover 1600–2050. Every data series has shorter coverage.
          DW-NOMINATE: 46th Congress–present (1879–current); Fernald TFP
          underlying series 1947Q2–present, displayed ~1950–present after
          the 5-year centered window; Project Mars conflict data 1800–2011;
          WID top-1% wealth modern coverage 1913–most-recent (with five
          earlier decadal points spliced from secondary sources, see below);
          Maddison US/world GDP share trimmed to 1870+ (earlier years have
          unstable country coverage); V-Dem 1789–present. Gaps are simply
          absent from the chart - nothing is interpolated. If a series fails
          to load, its legend entry shows &quot;data unavailable&quot; and the
          rest of the viz keeps working.
        </p>
        <p>
          Two finer caveats. The modern WID/Saez–Zucman US top-1% wealth
          series begins in 1913; the five pre-1913 points (1820, 1850, 1880,
          1900, 1910) come from earlier historical sources spliced via OWID/
          WID and have wider standard errors. The TFP 5-year centered rolling
          average is this project&apos;s derivation from Fernald&apos;s annual{" "}
          <code className="font-mono text-[13px]">dtfp</code> column, not
          Fernald&apos;s own published series; the windows at the extreme
          ends are clipped, which is why the displayed series effectively
          starts ~1950 rather than 1948.
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
          <strong className="text-ink">No paired series for Perez.</strong>{" "}
          The techno-economic paradigm story is harder to reduce to a single
          century-long series. TFP growth is paired with Kondratiev because
          the Kondratiev framing is more directly about productivity surges;
          Perez tells a richer story about installation and deployment phases
          that no single time series captures cleanly.
        </p>
        <p>
          See each series&apos; per-source provenance file for full retrieval
          and processing notes.
        </p>
      </section>
    </article>
  );
}
