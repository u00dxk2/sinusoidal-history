// Tier-1 read: organic search clicks, impressions and position for sinusoidalhistory.com,
// grouped by PAGE only. Page-only grouping is the one whose totals are whole — grouping by
// query (or page+query) drops the rows Search Console anonymizes, so their clicks vanish.
//
//   node scripts/gsc-read.mjs --start 2026-09-10 [--end 2026-09-16]
//
// Operator tooling, like crawl-read.mjs: it calls the Skylark Command Center's Search Console
// route with the operator's read PIN (CC_PROMPTS_PIN, env or Windows user scope). Never logs it.
// Search Console lags ~3 days, so the newest 2-3 days of any window are always empty.
import { execSync } from "node:child_process";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const start = arg("start");
const end = arg("end") ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(start ?? "")) {
  console.error("usage: node scripts/gsc-read.mjs --start YYYY-MM-DD [--end YYYY-MM-DD]");
  process.exit(2);
}

let pin = process.env.CC_PROMPTS_PIN;
if (!pin && process.platform === "win32") {
  try {
    pin = execSync(
      `powershell -NoProfile -Command "[System.Environment]::GetEnvironmentVariable('CC_PROMPTS_PIN','User')"`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
  } catch {
    pin = "";
  }
}
if (!pin) {
  console.error("gsc-read: CC_PROMPTS_PIN is not set (env or Windows user scope) — nothing read.");
  process.exit(2);
}

const url = `https://skylarkcreations.com/api/cc/gsc-performance?project=sinusoidal-cycles&startDate=${start}&endDate=${end}&dimensions=page`;
const res = await fetch(url, { headers: { "x-cc-pin": pin } });
const body = await res.json().catch(() => ({}));
if (!res.ok || body.error) {
  console.error(`gsc-read: HTTP ${res.status}${body.error ? ` — ${String(body.error).slice(0, 200)}` : ""}`);
  process.exit(1);
}

const row = (r) => `clicks=${r.clicks} impressions=${r.impressions} position=${Number(r.position).toFixed(1)}`;
console.log(`window ${start}..${end} (${body.property}) TOTAL ${row(body)}`);
for (const r of body.byDimensions ?? []) console.log(`  ${r.keys.join(" | ")}  ${row(r)}`);
if (body.byDimensionsTruncated) console.log("  (page list TRUNCATED at the route's row limit — the TOTAL line is still whole)");
