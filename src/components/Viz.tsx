"use client";

import { useMemo, useCallback, useState } from "react";
import type { Annotation, Cycle, DataSeries } from "@/data/types";
import CycleOverlay, { type CycleOverride } from "./CycleOverlay";
import CalibrationPanel from "./CalibrationPanel";
import ConvergenceNote from "./ConvergenceNote";
import FacetView from "./FacetView";
import NowSummaryPanel from "./NowSummaryPanel";
import TimeRangeBrush from "./TimeRangeBrush";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  useTabState,
  useFocusState,
  useRangeState,
  useOverridesState,
  parseRange,
  formatRange,
} from "@/lib/urlState";
import { DEFAULT_YEAR_RANGE } from "@/lib/siteConfig";

interface VizProps {
  cycles: Cycle[];
  dataSeries: DataSeries[];
  annotations?: Annotation[];
  fullStartYear?: number;
  fullEndYear?: number;
}

export default function Viz({
  cycles,
  dataSeries,
  annotations = [],
  fullStartYear = DEFAULT_YEAR_RANGE.start,
  fullEndYear = DEFAULT_YEAR_RANGE.end,
}: VizProps) {
  const [annotationsVisible, setAnnotationsVisible] = useState(true);
  const [tab, setTab] = useTabState();
  const [focusedCycleId, setFocusedCycleId] = useFocusState();
  const [rangeParam, setRangeParam] = useRangeState();
  const [overrides, setOverride, resetOverride, setAllOverrides] =
    useOverridesState(cycles);

  const range = useMemo(
    () => parseRange(rangeParam, { start: fullStartYear, end: fullEndYear }),
    [rangeParam, fullStartYear, fullEndYear]
  );
  const visibleStartYear = range.start;
  const visibleEndYear = range.end;

  // UTC, matching the /state route's request-time year bound — a local-time
  // year here would 404 the "annual permalink" link near New Year in
  // timezones ahead of UTC.
  const currentYear = new Date().getUTCFullYear();

  const seriesByCycle = useMemo(() => {
    const map = new Map<string, DataSeries>();
    for (const s of dataSeries) {
      if (!map.has(s.associated_cycle_id)) {
        map.set(s.associated_cycle_id, s);
      }
    }
    return map;
  }, [dataSeries]);

  const effectiveCycles = useMemo(
    () =>
      cycles.map((c) => {
        const ov = overrides[c.id];
        if (!ov) return c;
        return {
          ...c,
          period_years: ov.period_years ?? c.period_years,
          reference_peak_year:
            ov.reference_peak_year ?? c.reference_peak_year,
        };
      }),
    [cycles, overrides]
  );

  const setRange = useCallback(
    (start: number, end: number) => {
      setRangeParam(formatRange(start, end, fullStartYear, fullEndYear));
    },
    [setRangeParam, fullStartYear, fullEndYear]
  );

  const handleSelectCycleFromSummary = useCallback(
    (id: string) => {
      setTab("facets");
      setFocusedCycleId(id);
    },
    [setTab, setFocusedCycleId]
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-5">
        <NowSummaryPanel
          cycles={effectiveCycles}
          currentYear={currentYear}
          onSelectCycle={handleSelectCycleFromSummary}
          permalinkHref={`/state/${currentYear}`}
        />

        <ConvergenceNote />

        <Tabs
          value={tab}
          onValueChange={(v) =>
            setTab(v as "facets" | "overlay" | "calibrate")
          }
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* min-h-11 set here rather than in ui/tabs.tsx — that file is
                vendored shadcn and shared; the 44px tap floor is this app's
                requirement, not a change to the primitive. Canon R28. */}
            <TabsList className="min-h-11">
              <TabsTrigger value="facets" className="min-h-11">
                Facets
              </TabsTrigger>
              <TabsTrigger
                value="overlay"
                className="hidden sm:inline-flex min-h-11"
              >
                Overlay
              </TabsTrigger>
              <TabsTrigger value="calibrate" className="min-h-11">
                Calibrate
              </TabsTrigger>
            </TabsList>
            {annotations.length > 0 && (
              /* hidden sm:flex — annotation labels never render on mobile
                 (FacetTimeAxis hides them under 640px), so this was an armed
                 control that did nothing on a phone. Journey-walk 2026-08-24,
                 J12. */
              <label className="hidden sm:flex items-center gap-2 text-xs text-foreground/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={annotationsVisible}
                  onChange={(e) => setAnnotationsVisible(e.target.checked)}
                  className="accent-foreground"
                />
                show historical events
              </label>
            )}
          </div>

          <TabsContent value="facets" className="mt-4">
            <FacetView
              cycles={cycles}
              dataSeries={dataSeries}
              annotations={annotationsVisible ? annotations : []}
              currentYear={currentYear}
              startYear={visibleStartYear}
              endYear={visibleEndYear}
              focusedCycleId={focusedCycleId}
              onChangeFocus={setFocusedCycleId}
              overrides={overrides}
              onChangeOverrides={setAllOverrides}
            />
          </TabsContent>

          <TabsContent value="overlay" className="mt-4">
            <CycleOverlay
              cycles={cycles}
              dataSeries={dataSeries}
              cycleOverrides={overrides}
              currentYear={currentYear}
              startYear={visibleStartYear}
              endYear={visibleEndYear}
            />
          </TabsContent>

          <TabsContent value="calibrate" className="mt-4">
            <CalibrationPanelWithPicker
              cycles={cycles}
              dataSeriesByCycle={seriesByCycle}
              overrides={overrides}
              onChangeOverride={setOverride}
              onResetOverride={resetOverride}
            />
          </TabsContent>
        </Tabs>

        <TimeRangeBrush
          cycles={effectiveCycles}
          fullStartYear={fullStartYear}
          fullEndYear={fullEndYear}
          visibleStartYear={visibleStartYear}
          visibleEndYear={visibleEndYear}
          onChange={setRange}
        />
      </div>
    </TooltipProvider>
  );
}

function CalibrationPanelWithPicker({
  cycles,
  dataSeriesByCycle,
  overrides,
  onChangeOverride,
  onResetOverride,
}: {
  cycles: Cycle[];
  dataSeriesByCycle: Map<string, DataSeries>;
  overrides: Record<string, CycleOverride>;
  onChangeOverride: (id: string, ov: CycleOverride) => void;
  onResetOverride: (id: string) => void;
}) {
  const calibratable = cycles.filter((c) => dataSeriesByCycle.has(c.id));
  const [selectedId, setSelectedId] = useState(calibratable[0]?.id ?? "");
  const cycle = calibratable.find((c) => c.id === selectedId);
  const series = cycle ? dataSeriesByCycle.get(cycle.id) : undefined;

  if (!cycle || !series) {
    return (
      <p className="text-sm text-foreground/60">
        No cycle is currently calibratable.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs uppercase tracking-wide text-foreground/55 font-medium mr-1">
          Cycle
        </span>
        {calibratable.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedId(c.id)}
            aria-pressed={selectedId === c.id}
            className={`rounded-md border px-2.5 py-1 text-sm transition ${
              selectedId === c.id
                ? "border-foreground/40 bg-foreground/10 font-medium"
                : "border-foreground/15 hover:bg-foreground/5"
            }`}
            style={{
              borderLeft: `3px solid ${c.color}`,
            }}
          >
            {c.name}
          </button>
        ))}
      </div>
      <CalibrationPanel
        cycle={cycle}
        series={series}
        override={overrides[cycle.id] ?? {}}
        onChange={(ov) => onChangeOverride(cycle.id, ov)}
        onReset={() => onResetOverride(cycle.id)}
      />
    </div>
  );
}
