import { ImageResponse } from "next/og";
import { cycles } from "@/data/cycles";
import {
  phasePositionLabel,
  phaseProgressPercent,
} from "@/lib/cycleMath";

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
          <div style={{ display: "flex" }}>Sinusoidal History · No. 01</div>
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
            Seven long-wave theories of history, on one shared axis.
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
            sinusoidal-history.skylarkcreations.com
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
            by Skylark Creations
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
