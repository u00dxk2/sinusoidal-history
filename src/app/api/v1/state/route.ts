import type { NextRequest } from "next/server";
import { stateOfCycles } from "@/lib/stateOfCycles";
import { SITE_URL } from "@/lib/siteConfig";

// Where every cycle sits at a given year, computed from the same cosine the
// chart draws. The one endpoint that is computation rather than a file:
// GET /api/v1/state?year=2026 (year defaults to the current UTC year).
const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600",
};

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("year");
  const year = raw === null ? new Date().getUTCFullYear() : Number(raw);

  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    return Response.json(
      { error: "year must be an integer between 1 and 9999" },
      { status: 400, headers: HEADERS }
    );
  }

  return Response.json(
    {
      site: SITE_URL,
      year,
      formula: "cos(2π · (year − reference_peak_year) / period_years)",
      note: "Positions of each fixed-sinusoid construction, not forecasts. See /methods for caveats and /about for why most cycles peak near the present.",
      cycles: stateOfCycles(year),
    },
    { headers: HEADERS }
  );
}
