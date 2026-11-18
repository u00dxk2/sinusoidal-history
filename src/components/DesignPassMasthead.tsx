import Link from "next/link";
import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import type { Cycle } from "@/data/types";
import { sampleDrawnPeriod } from "@/lib/cycleMath";
import { cycleTheorist } from "@/lib/cycleRoutes";
import {
  DP_CTA,
  DP_HOW_DRAWN,
  DP_SECONDARY,
  dpHeadline,
  dpHowChecked,
  pairedCycleCount,
} from "@/lib/designPassCopy";
import { countWord } from "@/lib/countWords";
import { GLANCE_HEIGHT_LABEL, glanceVerdictLine } from "@/lib/overviewReading";
import { DEFAULT_YEAR_RANGE } from "@/lib/siteConfig";

/**
 * The home page's first screen under the design pass (docs/DESIGN.md): the world is a
 * ten-channel chart-recorder strip, and the instrument is the hero: a slim header line, then
 * the ten-channel sheet across the whole measure. This is variant a, the one picked on
 * 2026-11-17 (docs/design-pass-2026-11-17/blind-pick.md, then the review page); the other two
 * variants were removed with their CSS and copy at the rollout.
 *
 * Rendered only when the design-pass flag is set (src/lib/designPass.ts). It replaces the
 * masthead section alone. The chart below it (Viz) is untouched, so on a phone the glance
 * figure, its caption, its height label and its verdict line are exactly today's: the
 * recorder sheet here is hidden below `sm`, where that figure already is the ten-row strip.
 *
 * No present position anywhere (I-061): the sheet draws each cycle through
 * `sampleDrawnPeriod`, with no mark at the current year and no moving trace.
 */
export default function DesignPassMasthead() {
  const headline = dpHeadline(cycles.length);
  const howChecked = dpHowChecked(pairedCycleCount(cycles, dataSeries), cycles.length);
  return (
    <section data-design-variant="a" className="dp mb-8 max-[390px]:mb-5 sm:mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-3 items-end">
        <h1 className="dp-display sm:col-span-7 text-[26px] leading-[1.08] sm:text-[40px] lg:text-[48px] sm:leading-[1.04] text-ink">
          {headline}
        </h1>
        <p className="dp-text hidden sm:block sm:col-span-5 text-[16px] leading-[1.5] text-ink/85">
          {DP_HOW_DRAWN} {howChecked}
        </p>
      </div>
      <div className="mt-3 sm:mt-5">
        <Actions />
      </div>
      <div className="hidden sm:block mt-6">
        <Sheet />
      </div>
    </section>
  );
}

function Actions() {
  return (
    <p className="flex flex-wrap items-center gap-x-6 gap-y-1">
      <Link href="/cycles" className="dp-cta">
        {DP_CTA}
      </Link>
      {/* The wrapper hides it on phones: `.dp-link` sets its own display, which would beat a
          `hidden` class on the link itself, and a second line here pushes the glance figure
          down the first phone screen. */}
      <span className="hidden sm:inline-flex">
        <Link href="/?tab=calibrate" className="dp-link">
          {DP_SECONDARY}
        </Link>
      </span>
    </p>
  );
}

/** The recorder sheet with its inspector's line: the verdict the phone glance figure shows. */
function Sheet() {
  const verdict = glanceVerdictLine(cycles);
  return (
    <div className="dp-sheet">
      <RecorderStrip />
      {verdict && (
        // The rule runs the sheet's width; the sentence is held to a reading measure (the
        // detector read ~136 characters a line here at 1280 on the first after run).
        <div className="dp-mark px-6 py-3">
          <p className="dp-text text-[16px] leading-[1.5] text-ink max-w-[68ch]">{verdict}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Ten channels on one time base, as static SVG. One row per cycle: a header block (name,
 * period, the peak year this site uses) and the cycle's one drawn period on the shared
 * 1600–2050 ruling. Every full wave reaches the same height on every row (amplitude is 1.0 on
 * every cycle), which the height label says in the phone figure's own words.
 */
function RecorderStrip() {
  const year = new Date().getUTCFullYear();
  const { start, end } = DEFAULT_YEAR_RANGE;
  const width = 1200;
  const head = 300;
  const rowH = 42;
  const top = 14;
  const plotL = head;
  const plotR = width - 16;
  const bottom = top + cycles.length * rowH;
  const height = bottom + 30;
  const x = (y: number) => plotL + ((y - start) / (end - start)) * (plotR - plotL);
  const ticks: number[] = [];
  for (let y = start; y <= end; y += 50) ticks.push(y);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      // The rows are named in the label: the figure is one image to a screen reader, so the
      // names, periods and peak years drawn in it would otherwise be lost (review r2).
      aria-label={`${countWord(cycles.length)} cycles on one ${start} to ${end} time axis, each drawn as at most one period around the peak year this site uses. No curve is drawn past today. The rows: ${cycles.map((c) => `${cycleTheorist(c)}, ${c.period_years} years, peak year used ${c.reference_peak_year}`).join("; ")}.`}
      className="block w-full h-auto text-ink"
    >
      <g className="dp-grid">
        {ticks.map((t) => (
          <line
            key={t}
            x1={x(t)}
            x2={x(t)}
            y1={top}
            y2={bottom}
            stroke="currentColor"
            strokeOpacity={t % 100 === 0 ? 0.22 : 0.09}
            strokeWidth={1}
          />
        ))}
        {cycles.map((c, i) => (
          <line
            key={c.id}
            x1={16}
            x2={plotR}
            y1={top + (i + 1) * rowH}
            y2={top + (i + 1) * rowH}
            stroke="currentColor"
            strokeOpacity={0.14}
            strokeWidth={1}
          />
        ))}
        {ticks
          .filter((t) => t % 100 === 0)
          .map((t) => (
            <text
              key={t}
              x={x(t)}
              y={bottom + 20}
              textAnchor="middle"
              fontSize={13}
              fill="currentColor"
              fillOpacity={0.7}
              className="dp-display"
            >
              {t}
            </text>
          ))}
        <text x={16} y={bottom + 20} fontSize={13} fill="currentColor" fillOpacity={0.7} className="dp-text" fontStyle="italic">
          {GLANCE_HEIGHT_LABEL}
        </text>
      </g>
      {cycles.map((c, i) => (
        <ChannelRow
          key={c.id}
          cycle={c}
          mid={top + i * rowH + rowH / 2}
          amp={rowH / 2 - 7}
          x={x}
          year={year}
        />
      ))}
    </svg>
  );
}

function ChannelRow({
  cycle,
  mid,
  amp,
  x,
  year,
}: {
  cycle: Cycle;
  mid: number;
  amp: number;
  x: (year: number) => number;
  year: number;
}) {
  const { start, end } = DEFAULT_YEAR_RANGE;
  const points = sampleDrawnPeriod(cycle, start, end, year, 1);
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.year).toFixed(1)},${(mid - p.value * amp).toFixed(1)}`)
    .join("");
  return (
    <g>
      <rect x={16} y={mid - 9} width={3} height={18} fill={cycle.color} />
      <text x={28} y={mid + 5} fontSize={16} fill="currentColor" className="dp-display">
        {cycleTheorist(cycle)}
      </text>
      <text x={292} y={mid + 5} textAnchor="end" fontSize={13} fill="currentColor" fillOpacity={0.7} className="dp-display">
        {`${cycle.period_years} y · peak ${cycle.reference_peak_year}`}
      </text>
      {d && (
        <path
          d={d}
          fill="none"
          stroke={cycle.color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="dp-trace"
        />
      )}
    </g>
  );
}
