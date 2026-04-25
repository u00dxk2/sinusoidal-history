import { Suspense } from "react";
import Viz from "@/components/Viz";
import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import { annotations } from "@/data/annotations";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      <section className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Historical cycle theories on one axis
        </h1>
        <p className="mt-1 text-sm sm:text-base text-foreground/70 max-w-3xl">
          <span className="hidden sm:inline">
            Seven named cycle models — Khaldun, Kondratiev, Huntington, Perez,
            Turchin, Dalio, Strauss-Howe — drawn over 1600–2050, each with its
            own period, a documented reference peak, and a paired empirical
            data series for stress-testing. Click a row to focus one cycle;
            drag the brush below to zoom in time.
          </span>
          <span className="sm:hidden">
            Seven cycle theories on one axis. Tap a row to focus and calibrate.
          </span>
        </p>
      </section>

      <Suspense fallback={<div className="h-[600px]" aria-busy="true" />}>
        <Viz cycles={cycles} dataSeries={dataSeries} annotations={annotations} />
      </Suspense>

      <section className="mt-6 sm:mt-8 text-sm text-foreground/60 max-w-3xl">
        <p>
          The cycle curves are pure sinusoids from each theory&apos;s declared
          period and a single calibration date. The overlaid data series are
          the rawest available proxies we could source. See{" "}
          <a
            href="/methods"
            className="underline underline-offset-2 hover:text-foreground"
          >
            methods
          </a>{" "}
          for provenance and caveats.
        </p>
      </section>
    </div>
  );
}
