"use client";

import { useMemo } from "react";
import { parseAsStringEnum, parseAsString, useQueryState } from "nuqs";
import type { Annotation, Cycle, DataSeries } from "@/data/types";
import NowSummaryPanel from "./NowSummaryPanel";
import FacetView from "./FacetView";
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

  const currentYear = new Date().getFullYear();

  return (
    <div className="p-4 bg-background min-h-screen flex flex-col gap-4">
      {view === "state-only" && (
        <NowSummaryPanel
          cycles={effectiveCycles}
          currentYear={currentYear}
          onSelectCycle={() => {}}
        />
      )}
      {view === "facets" && (
        <>
          <NowSummaryPanel
            cycles={effectiveCycles}
            currentYear={currentYear}
            onSelectCycle={() => {}}
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
