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
          cycle curves are sinusoids of unit amplitude (the
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
          <li>
            Because the min/max is taken over the <em>visible window</em>,
            brushing the time range re-normalizes the series: normalized
            heights are comparable only within the current window, and a
            narrow window forces even trivial local variation to span the
            full −1 to +1 height.
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
            the phase offset between them (exactly so for continuous
            integration or evenly spaced samples over whole periods;
            approximately for the finite, partial-period records actually
            correlated here). A perfect cosine evaluated over one
            full period has r = 1 with itself, r = 0 with a quarter-period
            shift, and r = −1 with a half-period shift - even though all three
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
          statistic is not. Three further honesty notes: the readout is always
          computed over the series&apos; <em>full</em> record, not the brushed
          window shown in the chart (equal weight per row, so densely sampled
          modern years dominate an irregular series); it is computed on the
          transformed values where a transform applies (log1p for Project
          Mars), so it is the correlation of the logged series; and because
          the sliders let you tune both phase and period against the same
          observations, a slider-maximized r is an in-sample search result,
          not evidence - do not hunt for the peak.
        </p>
        <p>
          Better tools for cyclic data include cross-correlation at varying
          lags, the Fourier periodogram, Lomb-Scargle for unevenly sampled
          records (which one of the present series is: the WID wealth
          series&apos; pre-1913 points arrive at 30-, 20-, 10-, and 3-year
          gaps before annual coverage begins), and wavelet decomposition for
          non-stationary signals. The periodogram leg is now implemented -
          see the spectral-testing section below. Cross-correlation remains
          future work, and wavelets are deliberately excluded (pointwise
          wavelet significance is a known false-positive trap).
        </p>
      </section>

      <section
        id="spectral-testing"
        className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85"
      >
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Spectral testing
        </h2>
        <p>
          Since August 2026 every cycle–series pairing carries a
          pre-registered spectral verdict, computed by a committed script
          (<code className="font-mono text-[13px]">scripts/spectral_verdict.py</code>)
          from a frozen analysis manifest and published at{" "}
          <a
            href="/data/spectral/verdicts.json"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            /data/spectral/verdicts.json
          </a>{" "}
          with one figure per pairing. The question is narrow: does the paired
          series contain significant power at the theory&apos;s exact stated
          period, above an autocorrelated (red-noise) null? In plain terms:
          does the data actually repeat at the rhythm the theory names, more
          strongly than slow-drifting noise would produce by chance?
          Frequencies are
          never fitted or scanned - the test is a harmonic regression at
          exactly 1/P (cosine + sine + linear trend) compared by likelihood
          ratio against the same model without the sinusoid, with the p-value
          calibrated by parametric bootstrap (99,999 draws) from a fitted
          AR(1) null and re-checked against an AR(2) null. Multiple tests are
          Holm-corrected within pre-registered families. The multitaper
          spectrum on each figure (NW = 2, K = 3) is the descriptive picture
          only; it is never the verdict. Inference always runs on unsmoothed,
          uninterpolated records: TFP on Fernald&apos;s raw annual{" "}
          <code className="font-mono text-[13px]">dtfp_util</code> (never the
          5-year-averaged display series) and the wealth series only from its
          annual 1913+ span.
        </p>
        <p>
          Before any spectrum, an eligibility gate: a pairing is testable only
          if its record spans at least 3.0 full target periods - a
          deliberately conservative site rule, not a theorem (period{" "}
          <em>estimation</em> conventionally wants ~5). Below the gate the
          verdict is INSUFFICIENT_DATA and no code path emits a p-value; the
          test suite enforces that, not just convention. There are exactly
          four verdict states: INSUFFICIENT_DATA,
          NO_SIGNIFICANT_TARGET_POWER, MODEL_SENSITIVE (the AR(1) and AR(2)
          nulls disagree at the Holm-adjusted threshold, so no verdict is
          claimed), and SIGNIFICANT_TARGET_POWER. The 2026 run&apos;s
          headline: <strong className="font-medium text-ink">0 of the 9
          paired constructions reach the gate</strong> - none of these
          records is long enough to test its claim at all, which is itself
          the finding. A secondary cross-grid panel re-pairs each period with
          every series long enough to clear the gate (19 cells, labelled as
          re-pairings, not the site&apos;s claims). A 54- and a 55-year
          period differ by 0.000337 cycles per year - separating them would
          take a ~3,000-year record - so no verdict text distinguishes
          Kondratiev from Perez; every result in that band is one
          ~54–55-year statement.
        </p>
        <p>
          The failed-detection precedents that shaped this design: Korotayev
          &amp; Tsirel (2010) report a significant Kondratiev wave only after
          replacing the World War years with geometric means, on a record of
          at most three cycles - contested, never retracted. Kuznets&apos;s
          ~20-year swings were killed as a moving-average artifact (Adelman
          1965; Howrey 1968), the direct ancestor of this site&apos;s
          unsmoothed-TFP rule. Turchin himself reports the ~150-year cycle as
          one realized oscillation and offers no formal spectral test -
          candor this page treats as the standard. Method references: Mann
          &amp; Lees (1996); Torrence &amp; Compo (1998); Hamilton (2018);
          Meyers (2012).
        </p>
      </section>

      <section className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Missing and sparse data
        </h2>
        <p>
          The curves cover 1600–2050. Every data series has shorter coverage.
          DW-NOMINATE: 46th–118th Congress (1879–2023); Fernald TFP
          annual series 1948–present, displayed 1948–present (the 1948 and
          1949 values use a clipped, asymmetric window because a true 5-year
          centered window only becomes available at 1950 - treat the first
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
          1949, 1950{"}"} and 1949 = mean of {"{"}1948, 1949, 1950, 1951{"}"} -
          read those endpoints with appropriate skepticism.
        </p>
        <p>
          A third caveat. The Maddison rebuild forward-fills each
          country&apos;s GDP between sparse benchmark observations but does
          not back-fill before each country&apos;s first observation. Many
          non-Western countries enter Maddison only at 1950, so the world
          denominator is systematically smaller pre-1950 than post-1950 -
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
          so no cycle would carry two series - nine of the ten cycles have
          exactly one paired series; Turchin&apos;s fathers-and-sons cycle has
          none. Both are
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
          was active that year - even though other conflict datasets (UCDP,
          COW, PRIO) record substantial casualties in 2010 (Afghanistan,
          Iraq, Mexican drug war). The series therefore measures
          conventional-war intensity, not all conflict deaths; read drops
          to zero accordingly.
        </p>
        <p>
          <strong className="text-ink">Perez pairs with technology
          diffusion, not asset prices.</strong>{" "}
          Through Phase 13 Perez had no paired series; the HATCH
          diffusion-intensity composite closed that gap in Phase 14.
          Shiller&apos;s CAPE was the runner-up candidate - Perez&apos;s
          frenzy/turning-point mechanism is financial, and the 2000 anchor is
          exactly a valuation peak - but CAPE carries no explicit reuse
          license and measures paper values, not the economy-wide diffusion
          that is Perez&apos;s actual object. We cite CAPE here as anchor
          validation without redistributing it.
        </p>
        <p>
          <strong className="text-ink">No paired series for Turchin&apos;s
          fathers-and-sons cycle.</strong>{" "}
          The natural series - Turchin&apos;s US political-violence event
          data - has no cleanly redistributable file. The cycle ships
          unpaired rather than paired to a construct-mismatched proxy.
        </p>
        <p>
          <strong className="text-ink">Stimson Policy Mood with Schlesinger
          Jr.</strong>{" "}
          Of the ten cycles, Schlesinger&apos;s pairing is the closest the
          site gets to a direct measurement: Stimson&apos;s index is, by
          construction, an estimate of US public preference for liberal vs.
          conservative domestic policy - exactly what Schlesinger&apos;s cycle
          claims to track. The catch is coverage: the series only starts in
          1952. Inside the empirical window this construction (period 30,
          peak 1970) plots troughs at 1955, 1985, and 2015 and peaks at 1970
          and 2000 - two full swings. The pre-1952 shape of the Schlesinger curve
          cannot be stress-tested against the paired data; treat the
          calibration drawer&apos;s Pearson r accordingly.
        </p>
        <p>
          See each series&apos; per-source provenance file for full retrieval
          and processing notes.
        </p>
      </section>

      <footer className="mt-12 pt-4 border-t border-rule/30 text-[11px] tracking-[0.2em] uppercase text-ink-soft/70 font-mono">
        Last updated: 2026-08-19
      </footer>
    </article>
  );
}
