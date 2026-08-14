import { ImageResponse } from "next/og";
import { cycles } from "@/data/cycles";
import type { Cycle } from "@/data/types";
import {
  phasePositionLabel,
  phaseProgressPercent,
  sineAtYear,
} from "@/lib/cycleMath";
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

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function GET(request: Request) {
  const url = new URL(request.url);

  // `?cycle=<id>` renders the single-cycle card used by /cycles/<slug>, so
  // each per-cycle route gets its own share image rather than the shared
  // eight-row snapshot.
  const cycleParam = url.searchParams.get("cycle");
  if (cycleParam) {
    const cycle = findCycleBySlug(cycleParam);
    if (cycle) return cycleCard(cycle);
  }

  const overrides: Record<
    string,
    { period_years?: number; reference_peak_year?: number }
  > = {};
  for (const c of cycles) {
    const peak = url.searchParams.get(`peak.${c.id}`);
    const period = url.searchParams.get(`period.${c.id}`);
    if (peak || period) {
      overrides[c.id] = {
        reference_peak_year: peak ? Number(peak) : undefined,
        period_years: period ? Number(period) : undefined,
      };
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

  const now = new Date();
  const headline = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
  const currentYear = now.getFullYear();

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
          <div style={{ display: "flex" }}>{headline}</div>
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
            State of the cycles
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: INK_SOFT,
              marginTop: 10,
              fontStyle: "italic",
            }}
          >
            Eight long-wave theories of history, on one shared axis.
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
            Bars · current position on the trough → peak → trough swing
          </div>
        </div>

        {/* Two-column phase rows */}
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
                gap: 11,
                justifyContent: "center",
              }}
            >
              {col.map((cycle, rowIdx) => {
                const progress = phaseProgressPercent(cycle, currentYear);
                const label = phasePositionLabel(cycle, currentYear);
                const overallIdx = idx === 0 ? rowIdx : left.length + rowIdx;
                return (
                  <PhaseRow
                    key={cycle.id}
                    idx={overallIdx + 1}
                    name={cycle.name}
                    color={cycle.color}
                    progress={progress}
                    label={label}
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
            marginTop: 18,
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

        {/* Lede */}
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

/** The cycle's sinusoid over 1600–2050 as an inline data-URI SVG. */
function curveDataUri(cycle: Cycle): string {
  const start = DEFAULT_YEAR_RANGE.start;
  const end = DEFAULT_YEAR_RANGE.end;
  const w = 1088;
  const h = 148;
  const pad = 12;

  const points: string[] = [];
  for (let year = start; year <= end; year += 1) {
    const x = ((year - start) / (end - start)) * w;
    const y = h / 2 - sineAtYear(cycle, year) * (h / 2 - pad);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

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

function PhaseRow({
  idx,
  name,
  color,
  progress,
  label,
}: {
  idx: number;
  name: string;
  color: string;
  progress: number;
  label: string;
}) {
  const clamped = Math.max(0, Math.min(100, progress));
  const displayName =
    name.length > 26 ? (name.split("—")[0]?.trim() ?? name) : name;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
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
      <div
        style={{
          display: "flex",
          position: "relative",
          height: 3,
          background: "#e0dcd0",
          overflow: "hidden",
          marginLeft: 38,
        }}
      >
        <div
          style={{
            display: "flex",
            width: `${clamped}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}
