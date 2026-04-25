import { dataSeries } from "@/data/series";
import { cycles } from "@/data/cycles";

export const metadata = {
  title: "Methods · Sinusoidal History",
};

export default function Methods() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Methods</h1>
      <p className="mt-2 text-foreground/60 text-sm">
        Data provenance, transformations, and methodological caveats.
      </p>

      <section className="mt-8 space-y-3 text-foreground/80">
        <h2 className="text-lg font-semibold text-foreground">
          Data sources
        </h2>
        <ul className="space-y-5">
          {dataSeries.map((s) => {
            const cycle = cycles.find((c) => c.id === s.associated_cycle_id);
            const slug = s.data_file.replace("/data/", "").replace(".csv", "");
            return (
              <li key={s.id}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    aria-hidden
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="font-semibold">{s.name}</span>
                  {cycle && (
                    <span className="text-xs text-foreground/60">
                      paired with {cycle.name}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm">{s.short_description}</p>
                <p className="mt-1 text-sm text-foreground/70">
                  {s.association_note}
                </p>
                <p className="mt-1 text-xs text-foreground/50 font-mono">
                  Source:{" "}
                  <a
                    href={s.source_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline underline-offset-2"
                  >
                    {s.source}
                  </a>
                  {" · license: "}
                  {s.license}
                  {" · full provenance: "}
                  <a
                    href={`/data/${slug}.source.md`}
                    className="underline underline-offset-2"
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

      <section className="mt-8 space-y-3 text-foreground/80">
        <h2 className="text-lg font-semibold text-foreground">
          Normalization
        </h2>
        <p>
          Every overlaid series is rescaled to the interval [-1, 1] using its
          own minimum and maximum over the visible window. That is convenient
          for eyeballing shape against a normalized sinusoid, and it is
          lossy: it hides absolute magnitude and makes level differences
          invisible. Two points stand out:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            A series with one enormous spike (e.g. global conflict deaths in
            WWII) compresses every other variation toward a thin band. The
            visible <em>shape</em> near the peaks is real; the visible
            shape away from them is attenuated.
          </li>
          <li>
            Because normalization is per-series, you cannot compare
            amplitudes across series. Only across time within a single
            series.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-3 text-foreground/80">
        <h2 className="text-lg font-semibold text-foreground">
          Why Pearson is the wrong tool
        </h2>
        <p>
          The calibration panel reports a Pearson correlation between the
          data series and the cycle curve. Pearson assumes two things that
          this context violates:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Linearity.</strong> Sinusoids are not linear in year.
            Pearson will say a perfect cosine has zero correlation with the
            same cosine shifted by a quarter period, which is correct
            numerically but misses that one is just the derivative of the
            other.
          </li>
          <li>
            <strong>Independence of observations.</strong> Time series are
            autocorrelated. Classical Pearson significance tests don&apos;t
            apply; the number has no legitimate p-value.
          </li>
        </ul>
        <p>
          The panel exposes Pearson anyway because the single most important
          question — &quot;how much is the peak-year choice doing?&quot; — is
          visible just from watching the correlation change as you move the
          slider. That diagnostic use is valid. Treating the number as a
          test statistic is not.
        </p>
        <p>
          Better tools for cyclic data include cross-correlation at varying
          lags, Lomb-Scargle or Fourier spectra, and wavelet decomposition.
          These are flagged for future work; they would be Phase 3 at
          earliest.
        </p>
      </section>

      <section className="mt-8 space-y-3 text-foreground/80">
        <h2 className="text-lg font-semibold text-foreground">
          Missing and sparse data
        </h2>
        <p>
          The curves cover 1600–2050. Every data series has shorter
          coverage. DW-NOMINATE starts in 1879; Fernald TFP starts in 1948;
          Project Mars conflict data starts in 1800; WID top-1% wealth
          starts in 1820; Maddison US/world GDP share is trimmed to 1870+
          (earlier years have unstable country coverage); V-Dem starts in
          1789. Gaps are simply absent from the chart — nothing is
          interpolated. If a series fails to load, its legend entry shows
          &quot;data unavailable&quot; and the rest of the viz keeps working.
        </p>
      </section>

      <section className="mt-8 space-y-3 text-foreground/80">
        <h2 className="text-lg font-semibold text-foreground">
          Phase 2 spec deviation: V-Dem pairing
        </h2>
        <p>
          The Phase 2 spec named V-Dem as a secondary pairing for Huntington
          (DW-NOMINATE remaining primary). Phase 2&apos;s small-multiples UX
          works best when each cycle has exactly one paired data series, so
          we paired V-Dem with Strauss-Howe instead. Both are arguments. The
          Strauss-Howe pairing reads V-Dem&apos;s recent decline as a
          &quot;Fourth Turning&quot; institutional-stress signal; the
          Huntington pairing would have read it as the trough side of a
          creedal-passion cycle. The data is the same; the framing differs.
          See the per-series source.md for full provenance.
        </p>
      </section>
    </div>
  );
}
