import { dataSeries } from "@/data/series";

// The canonical data-series definitions (src/data/series.json), served live
// with open CORS. The CSVs they point at are under /data/ (also CORS-open).
const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600",
};

export async function GET() {
  return Response.json(dataSeries, { headers: HEADERS });
}
