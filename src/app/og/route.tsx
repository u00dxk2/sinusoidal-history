import { ImageResponse } from "next/og";
import { cycles } from "@/data/cycles";
import type { Cycle } from "@/data/types";
import { sampleDrawnPeriod } from "@/lib/cycleMath";
import { clampCycleOverride } from "@/lib/cycleOverrides";
import {
  CALIBRATED_CARD_NOTE,
  holdsUpCard,
  holdsUpOverall,
} from "@/lib/holdsUp";
import { ogMainStandfirst } from "@/lib/countWords";
import { customCard, memoCard } from "@/lib/ogCardCache";
import {
  confidenceLabel,
  cycleTheorist,
  findCycleBySlug,
  seriesForCycle,
} from "@/lib/cycleRoutes";
import {
  DEFAULT_YEAR_RANGE,
  SITE_DOMAIN,
  SITE_MAKER,
  SITE_NAME,
} from "@/lib/siteConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WIDTH = 1200;
const HEIGHT = 630;

const PAPER = "#fafaf6";
const INK = "#1a1a1a";
const INK_SOFT = "#4a4a48";
const RULE = "#2a2a2a";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // `?cycle=<id>` renders the single-cycle card used by /cycles/<slug>, so
  // each per-cycle route gets its own share image rather than the shared
  // all-cycles snapshot.
  const cycleParam = url.searchParams.get("cycle");
  if (cycleParam) {
    const cycle = findCycleBySlug(cycleParam);
    if (cycle) return memoCard(`cycle:${cycle.id}`, () => cycleCard(cycle));
  }

  // Parsed and clamped exactly as the page does (nuqs parseAsInteger, then
  // the sliders' bounds), so `abc` falls back to the default and `0` cannot
  // divide by zero (SIN-S1, 2026-10-05).
  const intParam = (key: string) => {
    const raw = url.searchParams.get(key);
    if (raw == null) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  };
  const overrides: Record<
    string,
    { period_years?: number; reference_peak_year?: number }
  > = {};
  for (const c of cycles) {
    const ov = clampCycleOverride(
      c,
      intParam(`peak.${c.id}`),
      intParam(`period.${c.id}`)
    );
    // An override equal to the default draws the default picture, so it is
    // dropped: `peak.khaldun=1789` must not bypass the memo (SIN-R1).
    if (ov?.reference_peak_year === c.reference_peak_year) {
      delete ov.reference_peak_year;
    }
    if (ov?.period_years === c.period_years) delete ov.period_years;
    if (ov && (ov.reference_peak_year != null || ov.period_years != null)) {
      overrides[c.id] = ov;
    }
  }

  const effective = cycles.map((c) => {
    const ov = overrides[c.id];
    if (!ov) return c;
    return {
      ...c,
      period_years: ov.period_years ?? c.period_years,
      reference_peak_year:
        ov.reference_peak_year ?? c.reference_peak_year,
    };
  });

  if (Object.keys(overrides).length === 0) {
    return memoCard("snapshot", () => snapshotCard(effective, false));
  }
  // Bounded memo + render budget; past it, 429 (SIN-R1). The key is built in
  // cycles.json order, so param order in the URL does not split variants.
  return customCard(JSON.stringify(overrides), () => snapshotCard(effective, true));
}

// The share image for every page without its own. It was "State of the cycles · <month
// year>" with a bar per cycle giving its "current position on the trough → peak → trough
// swing" until I-061 (David 2026-10-21): no surface says where the present sits on a
// cycle. Each row now draws the cycle's one period on a shared axis, as the home figure
// does, with its period and reference peak. Under the masthead, the answer (I-056).
function snapshotCard(effective: Cycle[], calibrated: boolean) {
  const currentYear = new Date().getUTCFullYear();
  // The stored cycles, never `effective`: the verdicts were judged at the stored periods.
  const answer = holdsUpOverall(cycles);
  // One line either way: the note and the standfirst together wrap and push the last row's
  // curve into the footer rule (rendered 2026-10-23).
  const answerDetail = calibrated
    ? CALIBRATED_CARD_NOTE
    : `${answer.detail} ${ogMainStandfirst(cycles.length)}`;

  const left = effective.slice(0, Math.ceil(effective.length / 2));
  const right = effective.slice(Math.ceil(effective.length / 2));

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          background: PAPER,
          color: INK,
          padding: "44px 56px 36px 56px",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 14,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: INK_SOFT,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 500,
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex" }}>{SITE_NAME} · No. 01</div>
          <div
            style={{
              display: "flex",
              flex: 1,
              height: 1,
              background: RULE,
              opacity: 0.35,
            }}
          />
          <div style={{ display: "flex" }}>None confirmed</div>
        </div>

        {/* Masthead */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 0.96,
              color: INK,
            }}
          >
            Do the cycles hold up?
          </div>
          {/* The answer, at a size a phone-width link preview still shows (I-056). It was only
              the eyebrow's "None confirmed" until 2026-10-23. */}
          <div
            style={{
              display: "flex",
              fontSize: 34,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: INK,
              marginTop: 12,
            }}
          >
            {answer.headline}.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: INK_SOFT,
              marginTop: 8,
              fontStyle: "italic",
            }}
          >
            {answerDetail}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 11,
              color: INK_SOFT,
              marginTop: 8,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 500,
              opacity: 0.85,
            }}
          >
            Each drawn as one period around its reference peak · {DEFAULT_YEAR_RANGE.start}–{currentYear}
          </div>
        </div>

        {/* Two columns, one row per cycle */}
        <div
          style={{
            display: "flex",
            gap: 40,
            flex: 1,
            alignItems: "stretch",
            borderTop: `1px solid ${RULE}`,
            paddingTop: 14,
          }}
        >
          {[left, right].map((col, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: 6,
                justifyContent: "center",
              }}
            >
              {col.map((cycle, rowIdx) => {
                const overallIdx = idx === 0 ? rowIdx : left.length + rowIdx;
                return (
                  <PeriodRow
                    key={cycle.id}
                    idx={overallIdx + 1}
                    cycle={cycle}
                    currentYear={currentYear}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            marginTop: 18,
            paddingTop: 12,
            borderTop: `1px solid ${RULE}`,
            justifyContent: "space-between",
            fontSize: 12,
            color: INK_SOFT,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>
            {SITE_DOMAIN}
          </div>
          <div
            style={{
              display: "flex",
              fontStyle: "italic",
              textTransform: "none",
              letterSpacing: 0,
              fontSize: 14,
              fontFamily: "Georgia, serif",
              color: INK,
            }}
          >
            by {SITE_MAKER}
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    }
  );
}

/**
 * Share card for a single cycle route. The curve is embedded as a data-URI
 * SVG rather than inline SVG elements, which Satori renders reliably.
 */
function cycleCard(cycle: Cycle) {
  const series = seriesForCycle(cycle);
  const theorist = cycleTheorist(cycle);
  const subtitle = cycle.name.includes("—")
    ? (cycle.name.split("—")[1]?.trim() ?? "")
    : "";
  const idx = cycles.findIndex((c) => c.id === cycle.id) + 1;
  const holdsUp = holdsUpCard(cycle);

  const stats: [string, string][] = [
    ["Period", `${cycle.period_years} years`],
    ["Reference peak", String(cycle.reference_peak_year)],
    [
      "Paired data",
      series ? (series.legend_short ?? series.name) : "None this round",
    ],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          background: PAPER,
          color: INK,
          padding: "44px 56px 36px 56px",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 14,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: INK_SOFT,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 500,
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex" }}>
            {SITE_NAME} · No. {String(idx).padStart(2, "0")}
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              height: 1,
              background: RULE,
              opacity: 0.35,
            }}
          />
          <div style={{ display: "flex" }}>
            {confidenceLabel(cycle.confidence_level)}
          </div>
        </div>

        {/* Masthead */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: theorist.length > 18 ? 68 : 82,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 0.98,
              color: INK,
            }}
          >
            {theorist}
          </div>
          {subtitle ? (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: INK_SOFT,
                marginTop: 10,
                fontStyle: "italic",
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* Curve */}
        <div
          style={{
            display: "flex",
            marginTop: 22,
            borderTop: `1px solid ${RULE}`,
            borderBottom: `1px solid ${RULE}`,
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          {/* Satori renders a plain <img>; next/image has no meaning here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={curveDataUri(cycle)} width={1088} height={148} alt="" />
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 44,
            marginTop: holdsUp ? 14 : 18,
            alignItems: "flex-start",
          }}
        >
          {stats.map(([label, value]) => (
            <div
              key={label}
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: INK_SOFT,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
              <div style={{ display: "flex", fontSize: 25, color: INK }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Does it hold up? The friend a page is sent to sees this card first,
            and until I-032 (2026-10-10) it said nothing about whether anyone
            had checked. It replaces the truncated description: the subtitle
            already says what the cycle is. Same words as the page's box. */}
        {holdsUp ? (
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              marginTop: 14,
              gap: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: INK_SOFT,
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 500,
              }}
            >
              Does it hold up?
            </div>
            <div style={{ display: "flex", fontSize: 25, color: INK }}>
              {holdsUp.headline}.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                lineHeight: 1.3,
                color: INK_SOFT,
                fontStyle: "italic",
              }}
            >
              {holdsUp.detail}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "flex-start",
              marginTop: 16,
              fontSize: 19,
              lineHeight: 1.4,
              color: INK_SOFT,
              fontStyle: "italic",
            }}
          >
            {truncate(cycle.short_description, 150)}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            marginTop: 8,
            paddingTop: 12,
            borderTop: `1px solid ${RULE}`,
            justifyContent: "space-between",
            fontSize: 12,
            color: INK_SOFT,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>
            {SITE_DOMAIN}/cycles/{cycle.id.replace(/_/g, "-")}
          </div>
          <div
            style={{
              display: "flex",
              fontStyle: "italic",
              textTransform: "none",
              letterSpacing: 0,
              fontSize: 14,
              fontFamily: "Georgia, serif",
              color: INK,
            }}
          >
            by {SITE_MAKER}
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    }
  );
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:·\s]+$/, "")}…`;
}

/**
 * The cycle's one drawn period (cycleMath `drawnPeriod`, I-061) on the site's
 * 1600–2050 axis, as an inline data-URI SVG. It drew the repeating wave across
 * the whole axis until 2026-10-21.
 */
function curveDataUri(cycle: Cycle): string {
  const start = DEFAULT_YEAR_RANGE.start;
  const end = DEFAULT_YEAR_RANGE.end;
  const w = 1088;
  const h = 148;
  const pad = 12;

  const points = sampleDrawnPeriod(cycle, start, end, new Date().getUTCFullYear(), 1).map(
    (p) =>
      `${(((p.year - start) / (end - start)) * w).toFixed(1)},${(h / 2 - p.value * (h / 2 - pad)).toFixed(1)}`
  );

  const peakX = ((cycle.reference_peak_year - start) / (end - start)) * w;
  const inRange =
    cycle.reference_peak_year >= start && cycle.reference_peak_year <= end;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<line x1="0" y1="${h / 2}" x2="${w}" y2="${h / 2}" stroke="${RULE}" stroke-width="1" opacity="0.2"/>` +
    (inRange
      ? `<line x1="${peakX.toFixed(1)}" y1="0" x2="${peakX.toFixed(1)}" y2="${h}" stroke="${cycle.color}" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>` +
        `<circle cx="${peakX.toFixed(1)}" cy="${pad}" r="4" fill="${cycle.color}"/>`
      : "") +
    `<polyline points="${points.join(" ")}" fill="none" stroke="${cycle.color}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** A row's one drawn period on the shared 1600–present axis, as a data-URI SVG. */
function periodStripDataUri(cycle: Cycle, currentYear: number): string {
  const start = DEFAULT_YEAR_RANGE.start;
  const end = currentYear;
  const w = 480;
  const h = 14;
  const pad = 2;
  const points = sampleDrawnPeriod(cycle, start, end, currentYear, 1).map(
    (p) =>
      `${(((p.year - start) / (end - start)) * w).toFixed(1)},${(h / 2 - p.value * (h / 2 - pad)).toFixed(1)}`
  );
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<line x1="0" y1="${h - 1}" x2="${w}" y2="${h - 1}" stroke="${RULE}" stroke-width="1" opacity="0.15"/>` +
    (points.length > 1
      ? `<polyline points="${points.join(" ")}" fill="none" stroke="${cycle.color}" stroke-width="2" stroke-linejoin="round"/>`
      : "") +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function PeriodRow({
  idx,
  cycle,
  currentYear,
}: {
  idx: number;
  cycle: Cycle;
  currentYear: number;
}) {
  const { name, color } = cycle;
  const label = `${cycle.period_years}y · peak ${cycle.reference_peak_year}`;
  const displayName =
    name.length > 26 ? (name.split("—")[0]?.trim() ?? name) : name;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <div
            style={{
              display: "flex",
              fontSize: 11,
              fontFamily: "system-ui, sans-serif",
              color: INK_SOFT,
              opacity: 0.6,
              letterSpacing: "0.18em",
            }}
          >
            {String(idx).padStart(2, "0")}
          </div>
          <div
            style={{
              display: "flex",
              width: 3,
              alignSelf: "stretch",
              background: color,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.015em",
              color: INK,
            }}
          >
            {displayName}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 14,
            fontWeight: 500,
            fontStyle: "italic",
            letterSpacing: "-0.01em",
            color,
          }}
        >
          {label}
        </div>
      </div>
      <div style={{ display: "flex", marginLeft: 38 }}>
        {/* Satori renders a plain <img>; next/image has no meaning here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={periodStripDataUri(cycle, currentYear)} width={480} height={14} alt="" />
      </div>
    </div>
  );
}
