"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import type { Annotation, Cycle, DataSeries } from "@/data/types";
import CycleOverlay, { type CycleOverride } from "./CycleOverlay";
import ConvergenceNote from "./ConvergenceNote";
import CycleFacet from "./CycleFacet";
import CycleOverview from "./CycleOverview";
import FacetTimeAxis from "./FacetTimeAxis";
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
  // Did this page ARRIVE on Calibrate (a cycle page's "calibrate this cycle"
  // link), rather than have the tab opened by hand? Read once, at mount.
  const [arrivedOnCalibrate] = useState(() => tab === "calibrate");

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
      // The panel sits below the chart, so a keyboard user who picks a row
      // would be left below the facet it opened: carry focus up to it.
      // After the commit, so a facets tab that was not mounted is. The
      // focus scrolls on purpose: re-picking the already-open cycle changes
      // no state, so FacetView's scroll effect does not run for it.
      window.setTimeout(() => {
        document
          .querySelector<HTMLElement>(
            `[data-facet-id="${CSS.escape(id)}"] button[aria-expanded]`
          )
          ?.focus();
      }, 0);
    },
    [setTab, setFocusedCycleId]
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-5">
        {/* The chart leads. The editor's note sits between the curves it
            comments on and the brush it points at ("Drag the time-range
            below"), and the reckoning follows. With the panel and note
            first, a 390x664 phone met the first curve at 1381px and a
            1440x900 desktop at 1113px — the chart this page is named for sat
            below the fold at both. Moved in the DOM, not with CSS `order`,
            so focus and reading order match what is seen. Gate:
            `node scripts/measure-fold.mjs <url> 390 664
            '[data-facet-id] svg[role="img"]'`. 2026-09-21. */}
        {/* Phone only: the Overlay tab that shows all ten is desktop-only,
            so without this a phone met one cycle at a time. It follows the
            brush range and any calibration, like the facets it indexes.
            2026-09-22. */}
        <div className="sm:hidden">
          <CycleOverview
            cycles={effectiveCycles}
            currentYear={currentYear}
            startYear={visibleStartYear}
            endYear={visibleEndYear}
            detailBelow={tab === "facets"}
          />
        </div>
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
            <TabsList className="min-h-11" aria-label="Chart view">
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
              focusedCycleId={focusedCycleId}
              overrides={overrides}
              onChangeOverride={setOverride}
              onResetOverride={resetOverride}
              currentYear={currentYear}
              startYear={visibleStartYear}
              endYear={visibleEndYear}
              onOpenInFacets={handleSelectCycleFromSummary}
              scrollOnArrival={arrivedOnCalibrate}
            />
          </TabsContent>
        </Tabs>

        <ConvergenceNote />

        <TimeRangeBrush
          cycles={effectiveCycles}
          fullStartYear={fullStartYear}
          fullEndYear={fullEndYear}
          visibleStartYear={visibleStartYear}
          visibleEndYear={visibleEndYear}
          onChange={setRange}
        />

        <NowSummaryPanel
          cycles={effectiveCycles}
          currentYear={currentYear}
          onSelectCycle={handleSelectCycleFromSummary}
          permalinkHref={`/state/${currentYear}`}
        />
      </div>
    </TooltipProvider>
  );
}

/** history.state key marking an entry whose Calibrate arrival has scrolled. */
const ARRIVAL_KEY = "calibrateArrived";
/** Height of the "full record START–END · n=N" line r gains once its CSV loads. */
const R_LOAD_RESERVE = 20;

function CalibrationPanelWithPicker({
  cycles,
  dataSeriesByCycle,
  focusedCycleId,
  overrides,
  onChangeOverride,
  onResetOverride,
  currentYear,
  startYear,
  endYear,
  onOpenInFacets,
  scrollOnArrival,
}: {
  cycles: Cycle[];
  dataSeriesByCycle: Map<string, DataSeries>;
  focusedCycleId: string | null;
  overrides: Record<string, CycleOverride>;
  onChangeOverride: (id: string, ov: CycleOverride) => void;
  onResetOverride: (id: string) => void;
  currentYear: number;
  startYear: number;
  endYear: number;
  onOpenInFacets: (id: string) => void;
  scrollOnArrival: boolean;
}) {
  const calibratable = cycles.filter((c) => dataSeriesByCycle.has(c.id));
  // Open on the cycle the reader is already focused on (`?focus=<id>`, which
  // is how a cycle page's "Open in the chart" link arrives). It used to open
  // on the first calibratable cycle whatever the focus was, so a reader who
  // came for Schlesinger, and missed the pressed chip, dragged Ibn Khaldun's
  // slider (cold walk 2026-10-03).
  // Radix unmounts the inactive tab, so this initial value is read each time
  // the tab is opened. A focused cycle with no paired series has no chip here
  // and falls back to the first.
  const [selectedId, setSelectedId] = useState(
    () => calibratable.find((c) => c.id === focusedCycleId)?.id ?? calibratable[0]?.id ?? "",
  );
  const cycle = calibratable.find((c) => c.id === selectedId);
  const series = cycle ? dataSeriesByCycle.get(cycle.id) : undefined;

  // Arriving from a cycle page's "calibrate this cycle" link (I-022), put the
  // curve, the peak slider and r on one screen. Without this the page opened
  // at its top with the curve 1,096px down at 390x664 (measured 2026-10-04).
  // Once per history entry: the marker rides history.state, which the App
  // Router keeps on a traverse and the browser keeps on a reload, so Back and
  // reload leave the reader where they were. A tab opened by hand, or a focus
  // with no chip here, never scrolls.
  const [arrivalId] = useState(() =>
    scrollOnArrival && calibratable.some((c) => c.id === focusedCycleId)
      ? focusedCycleId
      : null,
  );
  useEffect(() => {
    if (!arrivalId) return;
    try {
      if (window.history.state?.[ARRIVAL_KEY]) return;
    } catch {
      return;
    }
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const facet = document.querySelector<HTMLElement>(
          `[data-facet-id="${CSS.escape(arrivalId)}"]`,
        );
        const chart = facet?.querySelector('svg[role="img"]');
        const r = facet?.querySelector('[aria-live="polite"]');
        if (!facet || !chart || !r) return;
        const facetTop = facet.getBoundingClientRect().top;
        const chartTop = chart.getBoundingClientRect().top;
        // r grows by a line ("full record …") when its CSV arrives; reserve it.
        const span = r.getBoundingClientRect().bottom - chartTop + R_LOAD_RESERVE;
        // Show as much of the facet's header above the curve as still leaves
        // r on screen; never push the curve's top off it.
        const above = Math.max(0, Math.min(chartTop - facetTop, window.innerHeight - span - 8));
        window.scrollTo({ top: window.scrollY + chartTop - above, behavior: "instant" });
        try {
          const state = window.history.state ?? {};
          window.history.replaceState({ ...state, [ARRIVAL_KEY]: true }, "");
        } catch {}
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [arrivalId]);

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
            // Read by check-calibrate-tab: which cycle the pressed chip is.
            data-chip-id={c.id}
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
      {/* The expanded facet, not a slider-only panel: this tab used to show
          two sliders and an r with no curve, so a reader moved the peak and
          could not see what moved (journey-walk 2026-08-24, D8/M12). The
          facet draws the curve against its paired series above the same
          sliders, follows the brush, and matches the Facets drawer's caption.
          Radix unmounts the inactive tab, so this never coexists with the
          Facets tab's copy of the same data-facet-id. 2026-09-28, I-008. */}
      <CycleFacet
        key={cycle.id}
        cycle={cycle}
        series={series}
        mode="expanded"
        startYear={startYear}
        endYear={endYear}
        currentYear={currentYear}
        override={overrides[cycle.id] ?? {}}
        onChangeOverride={(ov) => onChangeOverride(cycle.id, ov)}
        onResetOverride={() => onResetOverride(cycle.id)}
        onFocus={() => onOpenInFacets(cycle.id)}
        onBlur={() => onOpenInFacets(cycle.id)}
        onOpenInFacets={() => onOpenInFacets(cycle.id)}
        timeAxis={
          <FacetTimeAxis
            startYear={startYear}
            endYear={endYear}
            currentYear={currentYear}
          />
        }
      />
    </div>
  );
}
