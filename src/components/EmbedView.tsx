"use client";

import { useMemo } from "react";
import { parseAsStringEnum, parseAsString, useQueryState } from "nuqs";
import type { Annotation, Cycle, DataSeries } from "@/data/types";
import NowSummaryPanel from "./NowSummaryPanel";
import FacetView from "./FacetView";
import CycleFacet from "./CycleFacet";
import FacetTimeAxis from "./FacetTimeAxis";
import CycleOverlay from "./CycleOverlay";
import { DEFAULT_YEAR_RANGE } from "@/lib/siteConfig";
import { useOverridesState, useRangeState, parseRange } from "@/lib/urlState";

type EmbedViewName = "facets" | "overlay" | "state-only";

const VIEW_VALUES = ["facets", "overlay", "state-only"] as const;

interface EmbedViewProps {
  cycles: Cycle[];
  dataSeries: DataSeries[];
  annotations: Annotation[];
  fullStartYear?: number;
  fullEndYear?: number;
}

export default function EmbedView({
  cycles,
  dataSeries,
  annotations,
  fullStartYear = DEFAULT_YEAR_RANGE.start,
  fullEndYear = DEFAULT_YEAR_RANGE.end,
}: EmbedViewProps) {
  const [view] = useQueryState(
    "view",
    parseAsStringEnum<EmbedViewName>([...VIEW_VALUES]).withDefault("facets")
  );
  const [cyclesParam] = useQueryState("cycles", parseAsString);
  const [rangeParam] = useRangeState();
  const [overrides] = useOverridesState(cycles);

  const range = useMemo(
    () => parseRange(rangeParam, { start: fullStartYear, end: fullEndYear }),
    [rangeParam, fullStartYear, fullEndYear]
  );

  const filteredCycles = useMemo(() => {
    if (!cyclesParam) return cycles;
    const allow = new Set(cyclesParam.split(","));
    return cycles.filter((c) => allow.has(c.id));
  }, [cycles, cyclesParam]);

  const filteredSeries = useMemo(() => {
    const ids = new Set(filteredCycles.map((c) => c.id));
    return dataSeries.filter((s) => ids.has(s.associated_cycle_id));
  }, [dataSeries, filteredCycles]);

  const effectiveCycles = useMemo(
    () =>
      filteredCycles.map((c) => {
        const ov = overrides[c.id];
        if (!ov) return c;
        return {
          ...c,
          period_years: ov.period_years ?? c.period_years,
          reference_peak_year:
            ov.reference_peak_year ?? c.reference_peak_year,
        };
      }),
    [filteredCycles, overrides]
  );

  const currentYear = new Date().getUTCFullYear();

  // An embed's peak/period overrides change the curve and the phase word it
  // prints, so the reader has to be told the numbers are the page author's
  // and not the site's. The facet's own "cal" tag is md+ only, and an iframe
  // is usually narrower than that (I-037).
  const calibrated = filteredCycles.flatMap((c) => {
    const ov = overrides[c.id];
    if (!ov) return [];
    const parts: string[] = [];
    if (
      ov.reference_peak_year !== undefined &&
      ov.reference_peak_year !== c.reference_peak_year
    ) {
      parts.push(
        `peak ${ov.reference_peak_year} (the site's reference peak is ${c.reference_peak_year})`
      );
    }
    if (ov.period_years !== undefined && ov.period_years !== c.period_years) {
      parts.push(
        `period ${ov.period_years}y (the site's is ${c.period_years}y)`
      );
    }
    return parts.length > 0 ? [{ id: c.id, name: c.name, parts }] : [];
  });

  // One cycle in the facets view is the "argue a specific claim" embed: the
  // curve is the point, so it gets a chart a reader can see (200px, not the
  // stack's 60px) and no ten-row summary panel above it repeating the phase
  // word the facet header already prints.
  const single = view === "facets" && filteredCycles.length === 1;

  return (
    <div className="p-4 bg-background min-h-screen flex flex-col gap-4">
      {calibrated.length > 0 && (
        <p
          data-embed-calibration
          className="text-[12px] leading-snug text-ink border-l-2 border-ink/40 pl-2.5"
        >
          Calibrated for this page, not the site&apos;s published values:{" "}
          {calibrated.map((c, i) => (
            <span key={c.id}>
              {i > 0 ? "; " : ""}
              {c.name}, {c.parts.join(", ")}
            </span>
          ))}
          .
        </p>
      )}
      {single && (
        <CycleFacet
          cycle={filteredCycles[0]}
          series={filteredSeries[0]}
          mode="normal"
          startYear={range.start}
          endYear={range.end}
          currentYear={currentYear}
          override={overrides[filteredCycles[0].id] ?? {}}
          onChangeOverride={() => {}}
          onResetOverride={() => {}}
          onFocus={() => {}}
          onBlur={() => {}}
          readOnly
          chartHeight={200}
          timeAxis={
            <FacetTimeAxis
              startYear={range.start}
              endYear={range.end}
              currentYear={currentYear}
              annotations={annotations}
            />
          }
        />
      )}
      {view === "state-only" && (
        <NowSummaryPanel
          cycles={effectiveCycles}
          currentYear={currentYear}
          interactive={false}
        />
      )}
      {view === "facets" && !single && (
        <>
          <NowSummaryPanel
            cycles={effectiveCycles}
            currentYear={currentYear}
            interactive={false}
          />
          <FacetView
            cycles={filteredCycles}
            dataSeries={filteredSeries}
            annotations={annotations}
            currentYear={currentYear}
            startYear={range.start}
            endYear={range.end}
            focusedCycleId={null}
            onChangeFocus={() => {}}
            overrides={overrides}
            onChangeOverrides={() => {}}
            readOnly
          />
        </>
      )}
      {view === "overlay" && (
        <CycleOverlay
          cycles={filteredCycles}
          dataSeries={filteredSeries}
          cycleOverrides={overrides}
          currentYear={currentYear}
          startYear={range.start}
          endYear={range.end}
        />
      )}
      <footer className="text-[11px] text-foreground/60 border-t border-foreground/10 pt-2">
        via{" "}
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="underline underline-offset-2"
        >
          Sinusoidal History
        </a>
        {" · "}
        <a
          href="/methods"
          target="_blank"
          rel="noopener"
          className="underline underline-offset-2"
        >
          methods & sources
        </a>
      </footer>
    </div>
  );
}
