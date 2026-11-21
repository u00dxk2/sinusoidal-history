import { Suspense } from "react";
import Viz from "@/components/Viz";
import DesignPassMasthead from "@/components/DesignPassMasthead";
import { designVariant } from "@/lib/designPass";
import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import { annotations } from "@/data/annotations";
import { countWord, homeDek, homeGateLine } from "@/lib/countWords";
import { spectralHeadline } from "@/lib/spectral";
import { homeIndex, homeJsonLd, homeTitle } from "@/lib/homeIndex";
import { jsonLdHtml } from "@/lib/jsonLdHtml";

// The overlay is the canonical home. `?focus=<id>` variants are the same page
// with one curve highlighted, so they resolve here rather than competing with
// the per-cycle routes — GPTBot crawled all eight of them on 2026-08-15.
export const metadata = {
  // Says what the page shows (2026-11-21, search day; the title was the bare site name).
  // Logged in W-005's notes. The share card keeps the root layout's block, url "/".
  title: homeTitle(cycles.length),
  alternates: { canonical: "/" },
};

const textLink =
  "text-ink underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors";

export default function Home() {
  const variant = designVariant();
  return (
    // max-[390px] (width < 390) spacing: the top padding, the masthead's
    // bottom margin and its row gap tighten, so all ten overview rows clear
    // a 360x560 first screen. 390 and up are unchanged. 2026-09-24.
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 max-[390px]:pt-5 pb-12 sm:pt-12">
      {/* The design pass's first screen (docs/DESIGN.md), only when its build-time flag is
          set; unset, the masthead below is today's, untouched. */}
      {variant ? (
        <DesignPassMasthead />
      ) : (
      <section className="mb-8 max-[390px]:mb-5 sm:mb-12 grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-4 max-[390px]:gap-y-3">
        <div className="sm:col-span-7">
          {/* max-[390px] (width < 390) tracking: at 0.32em the kicker wrapped
              to two lines there, one of the three wraps that cost a 320px
              phone half the cycle overview. 2026-09-24. */}
          <p className="text-[11px] sm:text-[11px] uppercase tracking-[0.32em] max-[390px]:tracking-[0.16em] text-ink-soft font-medium mb-3 sm:mb-4">
            <span aria-hidden className="inline-block mr-2 align-middle">
              <svg
                viewBox="0 0 24 8"
                width="22"
                height="8"
                className="inline-block"
              >
                <path
                  d="M0 4 C 4 0, 8 8, 12 4 S 20 0, 24 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </span>
            Vol. I · An editorial chart-room
          </p>
          <h1 className="font-display text-[44px] sm:text-[68px] lg:text-[84px] leading-[0.95] tracking-tight text-ink">
            {countWord(cycles.length)}{" "}cycles,
            <span className="block italic font-display-italic text-ink-soft">
              one axis.
            </span>
          </h1>
        </div>
        <div className="sm:col-span-5 sm:pt-3 sm:border-l sm:border-rule/30 sm:pl-6 flex flex-col justify-end">
          <p className="text-[15px] sm:text-base leading-relaxed text-ink/85 sm:max-w-sm">
            <span className="hidden sm:inline">
              {homeDek(cycles.length, dataSeries.length)}
            </span>
            {/* The tap instruction moved to the caption under the phone
                overview: said here, it sat directly above ten rows that
                are a figure, not controls. 2026-09-22.
                The phone line used to restate the H1 ("Ten cycles … on one
                axis") and wrapped to two lines at 320. It now says what the
                H1 does not — the subject and the span — in one. 2026-09-24.
                The span came out (I-070, 2026-11-01): "1600–2050" named
                2027–2050 as history though no curve is drawn past today
                (I-061), and it kept naming 1600–2050 after a zoom showed a
                narrower window. With no year in it, the line names no window
                to disagree with the chart's. phoneDek.test.ts is a source
                check that this span's literal text carries no four-digit
                number. */}
            <span className="sm:hidden">Long-wave theories of history.</span>
          </p>
          <p className="hidden sm:block mt-3 text-[13px] text-ink-soft italic font-display-italic">
            Click a row to focus one cycle; drag the brush below to zoom in
            time.
          </p>
        </div>
      </section>
      )}

      <Suspense fallback={<div className="h-[600px]" aria-busy="true" />}>
        <Viz cycles={cycles} dataSeries={dataSeries} annotations={annotations} />
      </Suspense>

      <section className="mt-10 sm:mt-14 max-w-2xl">
        <div className="editorial-rule mb-5" />
        <p className="text-[14px] leading-relaxed text-ink-soft">
          The cycle curves are pure sinusoids, each built from one period this
          site uses for the theory and a single calibration date. The overlaid data series are
          the rawest available proxies we could source. See{" "}
          <a
            href="/methods"
            className="text-ink underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            methods
          </a>{" "}
          for provenance and caveats.
        </p>
        {/* The site's headline result was reachable only ~4,900px into
            /methods — a cold reader never met it. One sentence here, linked
            to the protocol. Journey-walk 2026-08-24, J7. */}
        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
          {homeGateLine(
            spectralHeadline.eligible_primary,
            spectralHeadline.total_primary,
          )}{" "}
          The protocol lives under{" "}
          <a
            href="/methods#spectral-testing"
            className="text-ink underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            spectral testing
          </a>
          .
        </p>
      </section>

      {/* One link per cycle page (2026-11-21, search day): the served home named all ten in
          the chart but linked none. Below everything, so no phone first screen moves. The
          ItemList in the JSON-LD is built from the same homeIndex(), so it lists exactly these. */}
      <section className="mt-10 max-w-2xl" aria-labelledby="cycle-pages">
        <h2 id="cycle-pages" className="font-display text-[20px] tracking-tight text-ink mb-3">
          One page per cycle
        </h2>
        <ul className="space-y-1.5 text-[14px] leading-relaxed text-ink-soft">
          {homeIndex(cycles).map((e) => (
            <li key={e.path}>
              <a href={e.path} className={textLink}>
                {e.name}
              </a>
              {` · ${e.period_years}-year period, reference peak ${e.reference_peak_year}`}
            </li>
          ))}
        </ul>
      </section>
      <script
        type="application/ld+json"
        // JSON-LD is generated from cycles.json, never user input.
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(homeJsonLd(cycles)) }}
      />
    </div>
  );
}
