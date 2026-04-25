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
  const headlineText = `State of the cycles · ${headline}`;

  const left = effective.slice(0, Math.ceil(effective.length / 2));
  const right = effective.slice(Math.ceil(effective.length / 2));

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          background: "#fafafa",
          color: "#0f172a",
          padding: 56,
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 16,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            Sinusoidal History
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 8,
            }}
          >
            {headlineText}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#475569",
              marginTop: 8,
            }}
          >
            Seven historical cycle theories on one axis
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 36,
            flex: 1,
            alignItems: "stretch",
          }}
        >
          {[left, right].map((col, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: 14,
                justifyContent: "center",
              }}
            >
              {col.map((cycle) => {
                const progress = phaseProgressPercent(cycle, currentYear);
                const label = phasePositionLabel(cycle, currentYear);
                return (
                  <PhaseRow
                    key={cycle.id}
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

        <div
          style={{
            display: "flex",
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #e5e7eb",
            justifyContent: "space-between",
            fontSize: 13,
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex" }}>
            sinusoidal-history.skylarkcreations.com
          </div>
          <div style={{ display: "flex" }}>by Skylark Creations</div>
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
  name,
  color,
  progress,
  label,
}: {
  name: string;
  color: string;
  progress: number;
  label: string;
}) {
  const clamped = Math.max(0, Math.min(100, progress));
  const displayName =
    name.length > 28 ? (name.split("—")[0]?.trim() ?? name) : name;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
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
        <div
          style={{
            display: "flex",
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "#0f172a",
          }}
        >
          {displayName}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 16,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1.5,
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
          height: 10,
          borderRadius: 5,
          background: "#e2e8f0",
          overflow: "hidden",
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
