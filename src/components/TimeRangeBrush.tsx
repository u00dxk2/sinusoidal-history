"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { brushX, type D3BrushEvent } from "d3-brush";
import { select } from "d3-selection";
import { useContainerWidth, useTimeScale } from "@/lib/hooks";
import { RANGE_PRESET_OPTIONS } from "@/lib/siteConfig";
import { widenToMinSpan } from "@/lib/urlState";
import { cn } from "@/lib/utils";

// The strip draws time only (I-059, 2026-10-20). It used to draw the mean of every cycle's
// sinusoid, whose highest crest in 1600-2050 is 2029: each theory is anchored to a recent peak,
// so their average peaks at the present. Both cold walkers (E1/E2, 10-19) called that bump the
// page's strongest "peaking now" picture. The selection effect drawn as data, so it was removed,
// not relabelled. Pinned by convergenceShape.test.ts.
export const BRUSH_CAPTION = "Drag across the strip to zoom the chart above.";

/**
 * What the strip says when a drag was widened to MIN_VISIBLE_SPAN (I-062, 2026-10-22). Both
 * 10-21 walkers dragged to recent years, saw the selection snap wider with no word, and read
 * the strip as broken. The floor stays (I-060); the strip now says it applied it. It names only
 * what the code did: no claim about what any cycle looks like inside the window. It states the
 * rule, not the reader's drag: quoting the dragged years went stale three times (Codex r1, r2,
 * and the 10-22 cold walk, where a pan inside the box kept the previous drag's years).
 */
export function widenedNote(span: number): string {
  return `Widened to ${span} years, the shortest view this chart draws.`;
}

interface TimeRangeBrushProps {
  fullStartYear: number;
  fullEndYear: number;
  visibleStartYear: number;
  visibleEndYear: number;
  onChange: (start: number, end: number) => void;
}

const HEIGHT = 78;
/** An endpoint label (~28px of 11px mono) plus half a century label plus a gap. */
const LABEL_CLEARANCE = 48;
const HINT_STORAGE_KEY = "sh.brushHintSeen";

export default function TimeRangeBrush({
  fullStartYear,
  fullEndYear,
  visibleStartYear,
  visibleEndYear,
  onChange,
}: TimeRangeBrushProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(containerRef, 800);
  const brushGroupRef = useRef<SVGGElement | null>(null);

  // The last widened drag, kept only while the chart still shows the window it produced.
  const [widened, setWidened] = useState<{ start: number; end: number } | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.requestAnimationFrame(() => {
      if (!window.localStorage.getItem(HINT_STORAGE_KEY)) {
        setHintVisible(true);
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, []);
  const dismissHint = () => {
    setHintVisible(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(HINT_STORAGE_KEY, "1");
    }
  };

  const innerWidth = Math.max(0, width - 8);
  const xScale = useTimeScale(fullStartYear, fullEndYear, innerWidth);

  // Decade tick marks for the brush track. Editorial measure.
  const trackTicks = useMemo(() => {
    const out: number[] = [];
    for (let y = Math.ceil(fullStartYear / 50) * 50; y <= fullEndYear; y += 50) {
      out.push(y);
    }
    return out;
  }, [fullStartYear, fullEndYear]);

  // With no curve, the century labels are what makes the strip read as a timeline (manager
  // review, 2026-10-20). Centuries only: 50-year labels crowd at 390px. The endpoints keep
  // their own labels, so a century label within LABEL_CLEARANCE px of either end is skipped
  // (at 320-390px that drops 2000, which would overlap 2050).
  const centuryLabels = useMemo(
    () =>
      trackTicks.filter((y) => {
        const x = xScale(y);
        return y % 100 === 0 && x >= LABEL_CLEARANCE && innerWidth - x >= LABEL_CLEARANCE;
      }),
    [trackTicks, xScale, innerWidth],
  );

  useEffect(() => {
    const node = brushGroupRef.current;
    if (!node || innerWidth <= 0) return;
    const sel = select(node as SVGGElement);
    const brush = brushX<unknown>()
      .extent([
        [0, 6],
        [innerWidth, HEIGHT - 6],
      ])
      .on("start", () => {
        if (hintVisible) dismissHint();
      })
      .on("end", (event: D3BrushEvent<unknown>) => {
        if (!event.sourceEvent) return;
        const sel2 = event.selection as [number, number] | null;
        // The note follows OUTCOMES, never pointer events (Codex r1+r2, 2026-10-22): it is set by
        // a widened drag and cleared only when a drag lands on a different window, so a press
        // that changes nothing leaves it standing.
        const retire = (start: number, end: number) => {
          if (start !== visibleStartYear || end !== visibleEndYear) setWidened(null);
        };
        if (!sel2) {
          retire(fullStartYear, fullEndYear);
          onChange(fullStartYear, fullEndYear);
          return;
        }
        const [x0, x1] = sel2;
        const y0 = Math.round(xScale.invert(x0));
        const y1 = Math.round(xScale.invert(x1));
        const lo = Math.min(y0, y1);
        const hi = Math.max(y0, y1);
        if (hi - lo < 5) {
          retire(fullStartYear, fullEndYear);
          onChange(fullStartYear, fullEndYear);
          return;
        }
        // A drag shorter than MIN_VISIBLE_SPAN is widened about its centre (I-060), and the
        // brush redrawn to match. brush.move fires with no sourceEvent, so this handler skips it.
        const wide = widenToMinSpan(lo, hi, fullStartYear, fullEndYear);
        if (wide.start !== lo || wide.end !== hi) {
          sel.call(brush.move, [xScale(wide.start), xScale(wide.end)]);
          setWidened({ start: wide.start, end: wide.end });
        } else {
          retire(wide.start, wide.end);
        }
        onChange(wide.start, wide.end);
      });

    sel.call(brush);

    const x0 = xScale(visibleStartYear);
    const x1 = xScale(visibleEndYear);
    if (
      visibleStartYear === fullStartYear &&
      visibleEndYear === fullEndYear
    ) {
      // Even at "all-range", show a subtle indicator the whole strip is the
      // current selection — not a blank slate.
      sel.call(brush.move, null);
    } else {
      sel.call(brush.move, [x0, x1]);
    }

    // Editorial brush styling.
    sel
      .selectAll(".selection")
      .attr("fill", "var(--ink)")
      .attr("fill-opacity", 0.06)
      .attr("stroke", "var(--ink)")
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", 1)
      .attr("shape-rendering", "crispEdges");
    sel
      .selectAll<SVGRectElement, unknown>(".handle")
      .attr("fill", "var(--paper)")
      .attr("stroke", "var(--ink)")
      .attr("stroke-opacity", 0.85)
      .attr("stroke-width", 1)
      .attr("width", 8)
      .attr("rx", 1);
    sel.selectAll(".overlay").attr("cursor", "crosshair");

    return () => {
      sel.on(".brush", null);
    };
  }, [
    innerWidth,
    xScale,
    visibleStartYear,
    visibleEndYear,
    fullStartYear,
    fullEndYear,
    onChange,
    hintVisible,
  ]);

  const range = `${visibleStartYear}–${visibleEndYear}`;
  const isFullRange =
    visibleStartYear === fullStartYear && visibleEndYear === fullEndYear;
  // Shown only while the chart still shows the window the drag produced (a URL or Back change
  // hides it); a preset tap, or a drag to a different window, clears it outright.
  const note =
    widened && widened.start === visibleStartYear && widened.end === visibleEndYear
      ? widenedNote(widened.end - widened.start)
      : null;

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="flex flex-wrap gap-x-1 gap-y-2 items-baseline">
        <span className="text-[11px] uppercase tracking-[0.28em] text-ink-soft font-medium mr-3 self-center">
          Range
        </span>
        <div className="flex flex-wrap gap-1">
          {RANGE_PRESET_OPTIONS.map((preset) => {
            const active =
              preset.start === visibleStartYear &&
              preset.end === visibleEndYear;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  // A preset supersedes the drag: its note must not return on a later visit.
                  setWidened(null);
                  onChange(preset.start, preset.end);
                }}
                aria-pressed={active}
                className={cn(
                  // min-h-11: these sat at 28px on a phone, well under the
                  // 44px tap floor, and they are the primary way to reframe
                  // the chart on mobile. Canon R28.
                  "inline-flex items-center rounded-sm px-2.5 py-1 min-h-11 text-[12px] transition border",
                  active
                    ? "border-ink/60 bg-ink text-paper font-medium"
                    : "border-rule/35 text-ink-soft hover:bg-ink/5 hover:text-ink hover:border-ink/30",
                )}
              >
                {preset.label}
                <span className="ml-1.5 font-mono text-[11px] opacity-60">
                  {preset.short}
                </span>
              </button>
            );
          })}
        </div>
        <span className="text-[11px] text-ink-soft ml-auto font-mono tabular-nums">
          showing <span className="text-ink">{range}</span>
        </span>
      </div>
      {/* Always mounted, so a screen reader announces the note when it appears (polite). */}
      <p
        aria-live="polite"
        data-brush-widened={note ? "true" : undefined}
        className={cn("text-[11px] text-ink-soft", !note && "sr-only")}
      >
        {note ?? ""}
      </p>
      <div className="relative">
        <div className="relative rounded-sm border border-rule/35 bg-paper-deep/50 overflow-hidden">
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label="Time range selector — drag to zoom to a subrange, or click outside the selection to reset to the full range"
            className="block cursor-crosshair"
          >
            <g transform="translate(4,0)">
              {/* Decade ticks running through the strip */}
              {trackTicks.map((y) => (
                <line
                  key={y}
                  x1={xScale(y)}
                  x2={xScale(y)}
                  y1={6}
                  y2={HEIGHT - 6}
                  stroke="var(--ink)"
                  strokeOpacity={0.05}
                />
              ))}
              {centuryLabels.map((y) => (
                <text
                  key={y}
                  x={xScale(y)}
                  y={HEIGHT - 3}
                  textAnchor="middle"
                  className="fill-ink-soft font-mono text-[11px]"
                  style={{ opacity: 0.55 }}
                >
                  {y}
                </text>
              ))}
              {/* Decade labels at endpoints */}
              <text
                x={2}
                y={HEIGHT - 3}
                className="fill-ink-soft font-mono text-[11px]"
                style={{ opacity: 0.55 }}
              >
                {fullStartYear}
              </text>
              <text
                x={innerWidth - 2}
                y={HEIGHT - 3}
                textAnchor="end"
                className="fill-ink-soft font-mono text-[11px]"
                style={{ opacity: 0.55 }}
              >
                {fullEndYear}
              </text>
              <g ref={brushGroupRef} />
            </g>
          </svg>
          {hintVisible && isFullRange && innerWidth > 100 && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="rounded-sm bg-ink text-paper px-3 py-1 text-[11px] tracking-[0.18em] uppercase shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                ← drag to zoom →
              </span>
            </div>
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-ink-soft/75 italic font-display-italic">
          {BRUSH_CAPTION}
        </p>
      </div>
    </div>
  );
}
