import { SITE_URL } from "@/lib/siteConfig";

// Retired 2026-10-21 (I-061, David: "one wave per cycle, stop at today, retire
// the yearly state pages"). This endpoint returned every cycle's position on a
// repeating cosine at any year; the site no longer states where a year sits on
// a cycle. It answers 410 Gone with a pointer, so an existing caller gets a
// reason instead of a bare 404. /api/v1/cycles still serves each cycle's
// period, reference peak and rationale.
const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=86400",
};

export async function GET() {
  return Response.json(
    {
      error: "gone",
      retired: "2026-10-21",
      note: "This site no longer states where a year sits on any cycle. Each cycle is drawn as at most one period around its reference peak, cut at the present.",
      see: [`${SITE_URL}/api/v1/cycles`, `${SITE_URL}/cycles`],
    },
    { status: 410, headers: HEADERS }
  );
}
