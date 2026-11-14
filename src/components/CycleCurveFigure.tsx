import type { Cycle } from "@/data/types";
import { drawnSpan, periodCutAtToday, sampleDrawnPeriod } from "@/lib/cycleMath";
import { DEFAULT_YEAR_RANGE } from "@/lib/siteConfig";
import type { SpectralVerdictRow } from "@/lib/spectral";
import { MISSING_CLAUSE, missingYears, type JudgedRecord } from "@/lib/seriesOverlay";
import type { NormalizedPoint } from "@/lib/seriesMath";

/**
 * Static rendering of the cycle's sinusoid across the default window. Drawn
 * from the same `sineAtYear` the interactive chart uses, so the figure can't
 * drift from the curve it illustrates.
 */
// The curve's band and the record's strip, in viewBox units of a 900-wide
// figure. 164 against the old 150 costs 4px at 320x568, where the tightest
// first screen (Perez) went from 9px to spare to 5 (measured 2026-10-12). The
// strip draws 15px tall at 320 and 19px at 390; the record fills all but its
// 5-unit padding.
const CURVE_BAND = 104;
const STRIP = { top: 116, bottom: 164, pad: 5 } as const;

export default function CurveFigure({
  cycle,
  year,
  judged,
  overlay,
  verdict,
}: {
  cycle: Cycle;
  year: number;
  /** The record the verdict is judged on; null draws no line and no key. */
  judged: JudgedRecord | null;
  /** That record as the home chart normalises a series; empty draws no line and no key. */
  overlay: NormalizedPoint[];
  /** The pairing's verdict; a not-testable one hatches every year before the record. */
  verdict: SpectralVerdictRow | null;
}) {
  const { start, end } = DEFAULT_YEAR_RANGE;
  const width = 900;

  // The judged record gets its own strip under the curve, on its own scale,
  // sharing only the time axis (I-033 shape (a), 2026-10-12). Drawn on the
  // curve's axes, a rescaled record sat on the sinusoid by construction, and a
  // reader who glanced and did not read took its swing for the cycle fitting:
  // a key (10-10) and a hatch (10-12) did not undo that. With nothing to draw
  // the figure keeps its single 150-unit band.
  const drawnSeries = judged && overlay.length > 1 ? judged : undefined;
  const strip = drawnSeries ? STRIP : null;
  const curveHeight = strip ? CURVE_BAND : 150;
  const height = strip ? strip.bottom : curveHeight;
  const padY = strip ? 10 : 14;

  const x = (year: number) => ((year - start) / (end - start)) * width;
  const y = (value: number) =>
    curveHeight / 2 - value * (curveHeight / 2 - padY);

  // One period around the stored peak, cut at today (cycleMath `drawnPeriod`;
  // I-061, David 2026-10-21). Until then this drew the wave across the whole
  // window, and Dalio's 2025 repeat read as "peaking now".
  const points = sampleDrawnPeriod(cycle, start, end, year, 1).map(
    (p) => `${x(p.year).toFixed(2)},${y(p.value).toFixed(2)}`
  );
  const drawn = drawnSpan(cycle, start, end, year);

  // The record, in its strip. Straight segments between the CSV's points: no
  // smoothing invents a shape between points.
  const sy = (value: number) =>
    strip
      ? (strip.top + strip.bottom) / 2 -
        value * ((strip.bottom - strip.top) / 2 - strip.pad)
      : 0;
  const seriesPoints = drawnSeries
    ? overlay.map((p) => `${x(p.year).toFixed(2)},${sy(p.value).toFixed(2)}`)
    : [];

  // Every year before the record, hatched from the window's start (I-033, I-039). Only on a
  // not-testable verdict. Until 2026-10-13 it hatched just the shortfall to the 3-period
  // floor, so on 8 of 9 pages blank pre-record years sat beside a key reading "years missing
  // from the record", and Perez's 7-year hatch was ~4px at 320 (cold walk 2026-10-13). The
  // shortfall in years stays in the verdict box's words. "The record" is the one the verdict
  // counts: Turchin's hatch ends at 1913 although its file starts in 1820, because the five
  // rough points before 1913 are not part of that record (testedSeries.ts, whyTwoLabels).
  const missing =
    drawnSeries && verdict
      ? missingYears(verdict, overlay[overlay.length - 1].year)
      : null;
  const hatch =
    missing && missing.to > start
      ? { from: start, x1: x(start), x2: x(Math.min(end, missing.to)) }
      : null;

  const centuryTicks: number[] = [];
  for (let year = Math.ceil(start / 100) * 100; year <= end; year += 100) {
    centuryTicks.push(year);
  }

  const peakX = x(cycle.reference_peak_year);
  const showPeakMarker =
    cycle.reference_peak_year >= start && cycle.reference_peak_year <= end;

  // No "now" mark (I-061): the figure says nothing about where the present
  // sits. It had a now-line, dot and "now · <year>" label from 2026-09-29.

  return (
    // mt-4: since I-033 the figure sits directly under the title's rule, above
    // the verdict box.
    <figure className="mt-4">
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          // The peak clause is gated on the same condition as the marker it
          // describes: naming a marker that is not drawn is the 2026-09-22
          // overview defect, latent here only because every peak year currently
          // falls inside the window. The now clause is gated the same way.
          aria-label={`${cycle.name}: ${periodCutAtToday(cycle, year) ? "part of one" : "one"} ${cycle.period_years}-year period of a sinusoid${drawn ? `, drawn from ${Math.round(drawn.from)} to ${Math.round(drawn.to)} on a ${start} to ${end} axis` : ""}${showPeakMarker ? `, with its reference peak at ${cycle.reference_peak_year}` : ""}.${drawnSeries ? ` Drawn below it, in its own strip on its own scale: ${drawnSeries.fullName}, the record the verdict counts.` : ""}${hatch ? ` Hatched before it: the earlier years missing from this record. ${MISSING_CLAUSE}` : ""}`}
          className="block w-full h-auto"
        >
          {hatch && (
            <>
              {/* Stripes 4 units wide every 12, so a phone's ~0.35 scale still
                  draws them at about 1.4px. */}
              <defs>
                <pattern
                  id={`missing-${cycle.id}`}
                  width="12"
                  height="12"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="4" />
                </pattern>
              </defs>
              <rect
                data-mark="missing-years"
                data-from={hatch.from}
                data-to={missing!.to}
                x={hatch.x1}
                y={strip!.top}
                width={hatch.x2 - hatch.x1}
                height={strip!.bottom - strip!.top}
                fill={`url(#missing-${cycle.id})`}
                className="text-ink"
                opacity="0.16"
              />
            </>
          )}
          <line
            x1="0"
            y1={curveHeight / 2}
            x2={width}
            y2={curveHeight / 2}
            stroke="currentColor"
            strokeWidth="1"
            className="text-rule"
            opacity="0.2"
          />
          {strip && (
            <rect
              data-mark="record-strip"
              x={0}
              y={strip.top}
              width={width}
              height={strip.bottom - strip.top}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className="text-rule"
              opacity="0.35"
            />
          )}
          {centuryTicks.map((tick) => (
            <line
              key={tick}
              x1={x(tick)}
              y1={padY / 2}
              x2={x(tick)}
              y2={height - padY / 2}
              stroke="currentColor"
              strokeWidth="1"
              className="text-rule"
              opacity="0.12"
            />
          ))}
          {showPeakMarker && (
            <>
              <line
                x1={peakX}
                y1={padY / 2}
                x2={peakX}
                y2={curveHeight - padY / 2}
                stroke={cycle.color}
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.7"
              />
            </>
          )}
          {drawnSeries && (
            <polyline
              data-mark="paired-series"
              points={seriesPoints.join(" ")}
              fill="none"
              stroke={drawnSeries.color}
              strokeWidth="1.5"
              strokeOpacity="0.65"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke={cycle.color}
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* The reference peak: a hollow ring. It was an SVG circle (r 3.5 in
            the viewBox), which a phone drew at ~1.2px radius (Codex review,
            2026-09-29); HTML over the SVG keeps it legible. */}
        {showPeakMarker && (
          <span
            aria-hidden
            data-mark="ref-peak"
            className="absolute block w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{
              left: `${(peakX / width) * 100}%`,
              top: `${(y(1) / height) * 100}%`,
              borderColor: cycle.color,
            }}
          />
        )}
      </div>
      {hatch && (
        <div aria-hidden className="relative h-4 mt-1">
          {/* The hatch's key, in the row's empty left side. */}
          {hatch && (
            <span
              data-key="missing-years"
              className="absolute top-0 left-0 whitespace-nowrap text-[11px] leading-4 italic text-ink-soft"
            >
              {/* Its own stripes, not the figure's pattern: that pattern is laid
                  out in the figure's units, and in a 12-unit swatch its stripes
                  fell on the corners and the swatch read as empty. */}
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className="inline-block w-3 h-3 mr-1.5 align-[-2px] text-ink"
              >
                <path
                  d="M-2 4 L4 -2 M-2 10 L10 -2 M2 14 L14 2 M8 14 L14 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
              </svg>
              {/* Past tense on purpose: "years a test still needs" over 1600-1913
                  read as a wait ahead to two cold walkers (I-038, 2026-10-13). */}
              years missing from the record
            </span>
          )}
        </div>
      )}
      <figcaption className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/75">
        <span>{start}</span>
        <span className="normal-case tracking-normal text-[11px] font-sans italic">
          {/* The key for the reference-peak ring, so it is not read as "now"
              (the filled now-dot is labelled above). */}
          <span
            aria-hidden
            className="inline-block w-2 h-2 rounded-full border-[1.5px] mr-1.5 align-[-1px]"
            style={{ borderColor: cycle.color }}
          />
          {/* Below 360px the word "Reference" goes: with it this caption wrapped to
              two lines at 320x568, and the hatch's clause in the key below needed
              that line to keep the verdict on the first screen (I-033, 2026-10-12).
              The ring still reads as the peak. */}
          <span className="max-[360px]:hidden">Reference </span>peak{" "}
          {cycle.reference_peak_year} · period{" "}
          {cycle.period_years}{" "}years
        </span>
        <span>{end}</span>
      </figcaption>
      {/* The key for the second line. It says where the record is and that its
          height is its own, because a record drawn on the curve's height read
          as a fit, which on a page whose verdict is "not testable" contradicts
          the box right below (I-033). "The record the verdict counts" says the
          line is what the box below is about (I-035). */}
      {drawnSeries && (
        <p
          data-key="paired-series"
          className="mt-1.5 text-[12px] leading-[1.45] text-ink-soft"
        >
          <span
            aria-hidden
            className="inline-block w-4 h-[2px] mr-1.5 align-middle"
            style={{ backgroundColor: cycle.color }}
          />
          {`${cycle.period_years}-year sinusoid`}{" "}
          <span
            aria-hidden
            className="inline-block w-4 h-[1.5px] ml-3 mr-1.5 align-middle opacity-65"
            style={{ backgroundColor: drawnSeries.color }}
          />
          {`${drawnSeries.keyName}: the record the verdict counts, drawn below on its own scale`}
          {hatch && `. ${MISSING_CLAUSE}`}
        </p>
      )}
    </figure>
  );
}
