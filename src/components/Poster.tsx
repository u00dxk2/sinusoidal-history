"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Cycle } from "@/data/types";
import { periodCutAtToday, sampleDrawnPeriod } from "@/lib/cycleMath";
import { confidenceLabel } from "@/lib/cycleRoutes";
import { posterStandfirst } from "@/lib/countWords";
import {
  DEFAULT_YEAR_RANGE,
  SITE_DOMAIN,
  SITE_MAKER,
  SITE_NAME,
} from "@/lib/siteConfig";
import { useOverridesState } from "@/lib/urlState";

// The poster was "State of the cycles" with a dateline and, per cycle, a
// trough → peak → trough gauge and a phase word for the current year, until
// I-061 (David 2026-10-21): no surface says where the present sits on a cycle.
// Each row now draws the cycle's one period on a shared axis.

interface PosterProps {
  cycles: Cycle[];
}

export default function Poster({ cycles }: PosterProps) {
  const [overrides] = useOverridesState(cycles);
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

  const currentYear = new Date().getUTCFullYear();

  const posterRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#fafaf6",
      });
      const link = document.createElement("a");
      link.download = `sinusoidal-history-${currentYear}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Poster download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink/[0.04] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-[1240px] mb-5 flex items-baseline justify-end gap-4 print:hidden">
        <Link
          href="/"
          className="text-[12px] text-ink-soft hover:text-ink transition-colors uppercase tracking-[0.18em]"
        >
          ← back to interactive
        </Link>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-sm border border-ink/40 bg-paper px-4 py-1.5 text-[12px] uppercase tracking-[0.18em] font-medium text-ink hover:bg-ink hover:text-paper transition-colors disabled:opacity-50 disabled:hover:bg-paper disabled:hover:text-ink"
        >
          {downloading ? "Rendering…" : "Download PNG"}
        </button>
      </div>

      {/* overflow-x-auto wrapper: flex-centering a fixed 1200px poster on a
          390px phone put half of it in unreachable left overflow — the page
          scrolled in NEITHER axis and showed a frozen centre crop. w-full +
          pan restores mobile; mx-auto keeps desktop centred. Journey-walk
          2026-08-24, J2. */}
      <div className="w-full overflow-x-auto">
        <div
          ref={posterRef}
          style={{ width: 1200, minHeight: 800 }}
          className="mx-auto bg-paper text-ink flex flex-col px-16 py-14 shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-rule/40 relative"
        >
        {/* Top corner-band: dateline + masthead. Asymmetric. */}
        <header className="grid grid-cols-12 gap-8 mb-2">
          <div className="col-span-8">
            <p className="text-[11px] tracking-[0.36em] uppercase text-ink-soft font-medium">
              {/* Issue number = cycle count, matching the home masthead —
                  this was hardcoded "No. 01" while home derived "No. 10".
                  Journey-walk 2026-08-24, J19. */}
              {SITE_NAME}
              {` · No. ${String(cycles.length).padStart(2, "0")} · A reckoning`}
            </p>
            <h1
              className="font-display mt-3 text-ink leading-[0.94] tracking-[-0.02em]"
              style={{ fontSize: 92 }}
            >
              The cycles, <br />
              <span
                className="font-display-italic text-ink-soft"
                style={{ fontStyle: "italic" }}
              >
                each drawn once
              </span>
            </h1>
          </div>
          <div className="col-span-4 flex flex-col items-end justify-end text-right pt-1">
            <div className="text-[11px] font-mono leading-[1.5] tracking-wide text-ink-soft">
              {SITE_DOMAIN}
              <br />
              <span className="italic font-display-italic text-[12px] text-ink/70">
                by {SITE_MAKER}
              </span>
            </div>
          </div>
        </header>

        {/* Editorial standfirst */}
        <div className="grid grid-cols-12 gap-8 mt-1 mb-7">
          <div className="col-span-8 col-start-1 border-t border-ink/30 pt-3">
            <p
              className="font-display-italic text-ink/80 leading-snug"
              style={{ fontSize: 19 }}
            >
              {posterStandfirst(cycles.length)}
            </p>
          </div>
        </div>

        {/* Cycle rows */}
        <div className="flex-1 flex flex-col gap-3.5">
          {effectiveCycles.map((cycle, idx) => (
            <PosterRow
              key={cycle.id}
              cycle={cycle}
              idx={idx}
              currentYear={currentYear}
            />
          ))}
        </div>

        {/* Footer with editorial colophon */}
        <footer className="mt-10 pt-4 border-t border-ink/30 grid grid-cols-12 gap-8 items-baseline">
          <div className="col-span-8 text-[11px] tracking-[0.18em] uppercase text-ink-soft">
            <span className="font-display-italic normal-case tracking-normal text-[14px] text-ink/85">
              Drawn from
            </span>{" "}
            Khaldun · Kondratiev · Huntington · Schlesinger Jr. · Perez ·
            Turchin (twice) · Dalio · Strauss-Howe · Modelski
          </div>
          <div className="col-span-4 text-right text-[11px] font-mono uppercase tracking-[0.2em] text-ink-soft">
            cycles are contested ·
            <br />
            a comparison tool, not prophecy
          </div>
        </footer>
        </div>
      </div>
    </div>
  );
}

function PosterRow({
  cycle,
  idx,
  currentYear,
}: {
  cycle: Cycle;
  idx: number;
  currentYear: number;
}) {
  return (
    <div className="grid grid-cols-12 gap-5 items-center border-t border-rule/40 pt-3.5">
      {/* Numerical eyebrow column */}
      <div className="col-span-1 flex items-start gap-2">
        <span className="font-mono text-[11px] text-ink-soft/70 tabular-nums tracking-wider">
          {String(idx + 1).padStart(2, "0")}
        </span>
        <span
          aria-hidden
          className="block w-[3px] self-stretch rounded-full"
          style={{ backgroundColor: cycle.color, minHeight: 56 }}
        />
      </div>
      {/* Title + standfirst column */}
      <div className="col-span-6 min-w-0">
        <h3
          className="font-display tracking-tight text-ink"
          style={{ fontSize: 24, lineHeight: 1.05 }}
        >
          {cycle.name}
        </h3>
        <p
          className="text-ink-soft mt-1 leading-snug max-w-[640px] truncate"
          style={{ fontSize: 13 }}
        >
          {cycle.short_description}
        </p>
        <div className="flex items-baseline gap-3 mt-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/85">
            Period {cycle.period_years}y
          </span>
          <span className="text-ink-soft/40">·</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/85">
            Peak {cycle.reference_peak_year}
          </span>
          <span className="text-ink-soft/40">·</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/85">
            {confidenceLabel(cycle.confidence_level)}
          </span>
        </div>
      </div>
      {/* The cycle's one drawn period on the shared axis */}
      <div className="col-span-5">
        <PeriodStrip cycle={cycle} currentYear={currentYear} />
      </div>
    </div>
  );
}

const STRIP_W = 420;
const STRIP_H = 40;

function PeriodStrip({ cycle, currentYear }: { cycle: Cycle; currentYear: number }) {
  const start = DEFAULT_YEAR_RANGE.start;
  const end = currentYear;
  const x = (year: number) => ((year - start) / (end - start)) * STRIP_W;
  const y = (v: number) => STRIP_H / 2 - v * (STRIP_H / 2 - 3);
  const points = sampleDrawnPeriod(cycle, start, end, currentYear, 1)
    .map((p) => `${x(p.year).toFixed(1)},${y(p.value).toFixed(1)}`)
    .join(" ");
  return (
    <div className="space-y-1">
      <svg
        viewBox={`0 0 ${STRIP_W} ${STRIP_H}`}
        className="block w-full h-auto"
        role="img"
        aria-label={`${cycle.name}: ${periodCutAtToday(cycle, currentYear) ? "part of one" : "one"} ${cycle.period_years}-year period around its reference peak ${cycle.reference_peak_year}`}
      >
        <line x1="0" y1={STRIP_H - 1} x2={STRIP_W} y2={STRIP_H - 1} stroke="currentColor" strokeOpacity="0.15" />
        {points && (
          <polyline points={points} fill="none" stroke={cycle.color} strokeWidth="2" strokeLinejoin="round" />
        )}
      </svg>
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-ink-soft/65">
        <span>{start}</span>
        <span>{end}</span>
      </div>
    </div>
  );
}
