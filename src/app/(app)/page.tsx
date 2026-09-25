import { Suspense } from "react";
import Viz from "@/components/Viz";
import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import { annotations } from "@/data/annotations";

// The overlay is the canonical home. `?focus=<id>` variants are the same page
// with one curve highlighted, so they resolve here rather than competing with
// the per-cycle routes — GPTBot crawled all eight of them on 2026-08-15.
export const metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    // max-[390px] (width < 390) spacing: the top padding, the masthead's
    // bottom margin and its row gap tighten, so all ten overview rows clear
    // a 360x560 first screen. 390 and up are unchanged. 2026-09-24.
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 max-[390px]:pt-5 pb-12 sm:pt-12">
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
            Ten cycles,
            <span className="block italic font-display-italic text-ink-soft">
              one axis.
            </span>
          </h1>
        </div>
        <div className="sm:col-span-5 sm:pt-3 sm:border-l sm:border-rule/30 sm:pl-6 flex flex-col justify-end">
          <p className="text-[15px] sm:text-base leading-relaxed text-ink/85 sm:max-w-sm">
            <span className="hidden sm:inline">
              Khaldun, Kondratiev, Huntington, Schlesinger Jr., Perez, Turchin
              (twice), Dalio, Strauss-Howe, Modelski — drawn over 1600–2050.
              Each a pure sinusoid pinned to one documented peak; nine of the
              ten carry a paired empirical series for stress-testing.
            </span>
            {/* The tap instruction moved to the caption under the phone
                overview: said here, it sat directly above ten rows that
                are a figure, not controls. 2026-09-22.
                The phone line used to restate the H1 ("Ten cycles … on one
                axis") and wrapped to two lines at 320. It now says what the
                H1 does not — the subject and the span — in one. 2026-09-24. */}
            <span className="sm:hidden">Long-wave history, 1600–2050.</span>
          </p>
          <p className="hidden sm:block mt-3 text-[13px] text-ink-soft italic font-display-italic">
            Click a row to focus one cycle; drag the brush below to zoom in
            time.
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="h-[600px]" aria-busy="true" />}>
        <Viz cycles={cycles} dataSeries={dataSeries} annotations={annotations} />
      </Suspense>

      <section className="mt-10 sm:mt-14 max-w-2xl">
        <div className="editorial-rule mb-5" />
        <p className="text-[14px] leading-relaxed text-ink-soft">
          The cycle curves are pure sinusoids from each theory&apos;s declared
          period and a single calibration date. The overlaid data series are
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
          Each pairing also faces a pre-registered spectral test: 0 of the 9
          reach its 3.0-period evidence gate — none of these records is long
          enough to test, which is itself the finding. The protocol lives
          under{" "}
          <a
            href="/methods#spectral-testing"
            className="text-ink underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            spectral testing
          </a>
          .
        </p>
      </section>
    </div>
  );
}
