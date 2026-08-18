import { cycles } from "@/data/cycles";

// The canonical cycle definitions (src/data/cycles.json), served live with
// open CORS so agents and notebooks don't need the GitHub hop.
const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600",
};

export async function GET() {
  return Response.json(cycles, { headers: HEADERS });
}
