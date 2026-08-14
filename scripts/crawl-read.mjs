/**
 * Who is actually crawling sinusoidal-history, and what are they fetching?
 *
 * This is the site's entire analytics stack. It reads Render's own HTTP
 * request logs — which already record path + user-agent for every hit — and
 * aggregates them. Nothing is instrumented in the app: no client script, no
 * cookie, no consent surface, no third-party beacon. That is deliberate. The
 * question W-001 asks ("did the Phase 12 /cycles routes earn discovery?") is
 * a crawl question first, and crawl is fully answerable server-side.
 *
 * What this CANNOT tell you: impressions, queries, ranking position, or
 * whether an indexed page was ever shown to a human. Those need Google Search
 * Console. This script narrows the gap; it does not close it.
 *
 * Usage (from repo root):
 *   RENDER_API_KEY=... node scripts/crawl-read.mjs [--days 7]
 *
 * On Windows, the key lives in a user-scope env var, so:
 *   $env:RENDER_API_KEY = [System.Environment]::GetEnvironmentVariable('RENDER_API_KEY','User')
 *   node scripts/crawl-read.mjs
 *
 * Self-check (no network, no key needed):
 *   node scripts/crawl-read.mjs --selfcheck
 */

const SERVICE_ID = "srv-d7mcat7lk1mc73bidim0";
const OWNER_ID = "tea-ctl08nrv2p9s738cgcug";

// Render caps a single logs response at 100 entries and pages backward via
// nextEndTime. 40 pages ≈ 4000 requests, far above this site's volume.
const MAX_PAGES = 40;

/** Crawlers we care about, longest-match-first so GPTBot doesn't swallow OAI-SearchBot. */
const CRAWLERS = [
  ["Googlebot", /Googlebot/i],
  ["Google-Extended", /Google-Extended/i],
  ["Google other", /Google(?!bot|-Extended)/i],
  ["Bingbot", /bingbot/i],
  ["OAI-SearchBot", /OAI-SearchBot/i],
  ["GPTBot", /GPTBot/i],
  ["ClaudeBot", /ClaudeBot|Claude-Web|anthropic-ai/i],
  ["PerplexityBot", /PerplexityBot/i],
  ["Applebot", /Applebot/i],
  ["Bytespider", /Bytespider/i],
  ["Amazonbot", /Amazonbot/i],
  ["Meta/Facebook", /facebookexternalhit|meta-externalagent/i],
  ["other bot", /bot\b|crawler|spider|slurp/i],
];

/** Our own verification traffic — curl/PowerShell/node from an agent session. */
const SELF = /curl\/|PowerShell\/|node-fetch|python-requests|Go-http-client|axios/i;

export function classify(userAgent) {
  const ua = userAgent ?? "";
  if (!ua.trim()) return "unknown (no UA)";
  for (const [name, re] of CRAWLERS) if (re.test(ua)) return name;
  if (SELF.test(ua)) return "self / tooling";
  return "browser-ish";
}

/** Render puts path/status/method in `labels`, and the UA inside the message string. */
export function parseEntry(entry) {
  const labels = Object.fromEntries(
    (entry.labels ?? []).map((l) => [l.name, l.value])
  );
  const ua = /userAgent="([^"]*)"/.exec(entry.message ?? "")?.[1] ?? "";
  return {
    ts: entry.timestamp,
    path: labels.path ?? "?",
    status: labels.statusCode ?? "?",
    ua,
    who: classify(ua),
  };
}

async function fetchRequestLogs(apiKey, startTime, endTime) {
  const rows = [];
  let cursorEnd = endTime;
  for (let page = 0; page < MAX_PAGES; page++) {
    const url =
      `https://api.render.com/v1/logs?ownerId=${OWNER_ID}&resource=${SERVICE_ID}` +
      `&type=request&limit=100&direction=backward` +
      `&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(cursorEnd)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) throw new Error(`Render logs API returned ${res.status}`);
    const body = await res.json();
    if (!body.logs?.length) break;
    rows.push(...body.logs.map(parseEntry));
    if (!body.hasMore || !body.nextEndTime) break;
    cursorEnd = body.nextEndTime;
  }
  return rows;
}

function report(rows, days) {
  const crawlers = rows.filter(
    (r) => r.who !== "self / tooling" && r.who !== "browser-ish" && r.who !== "unknown (no UA)"
  );

  console.log(`\nsinusoidal-history — crawl read, last ${days}d`);
  console.log(`${rows.length} request log lines, ${crawlers.length} from known crawlers\n`);

  console.log("Who hit the site:");
  const byWho = new Map();
  for (const r of rows) byWho.set(r.who, (byWho.get(r.who) ?? 0) + 1);
  for (const [who, n] of [...byWho].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(5)}  ${who}`);
  }

  console.log("\nCrawler hits by path:");
  if (crawlers.length === 0) {
    console.log("  (none)");
  } else {
    for (const r of crawlers.sort((a, b) => String(a.ts).localeCompare(String(b.ts)))) {
      console.log(`  ${r.ts}  ${r.status}  ${r.path.padEnd(28)} ${r.who}`);
    }
  }

  // The W-001 headline: has Google been here at all?
  const google = crawlers.filter((r) => r.who.startsWith("Google"));
  console.log(
    google.length
      ? `\nGoogle: ${google.length} hit(s). Crawl is happening — GSC would now add impressions/queries.`
      : `\nGoogle: ZERO hits in this window. Google does not appear to know this site exists;` +
          ` a verified Search Console property + sitemap submission is the unblock, not more SEO surface.`
  );

  const cycleHits = crawlers.filter((r) => r.path.startsWith("/cycles"));
  console.log(
    cycleHits.length
      ? `Phase 12 routes: ${cycleHits.length} crawler hit(s) on /cycles*.`
      : `Phase 12 routes: no crawler has fetched a /cycles* page yet.`
  );
}

function selfcheck() {
  const assert = (cond, msg) => {
    if (!cond) throw new Error(`selfcheck failed: ${msg}`);
  };
  // Longest-match-first ordering: these two both contain "Mozilla" and "bot".
  assert(classify("compatible; GPTBot/1.4; +https://openai.com/gptbot") === "GPTBot", "GPTBot");
  assert(
    classify("Chrome/131 Safari/537.36; compatible; OAI-SearchBot/1.4") === "OAI-SearchBot",
    "OAI-SearchBot must not be swallowed by the generic bot rule"
  );
  assert(classify("Googlebot/2.1 (+http://www.google.com/bot.html)") === "Googlebot", "Googlebot");
  assert(classify("Mozilla/5.0 (compatible; Google-Extended)") === "Google-Extended", "Google-Extended");
  assert(classify("curl/8.21.0") === "self / tooling", "curl is ours, not a crawler");
  assert(classify("") === "unknown (no UA)", "empty UA");
  assert(classify("Mozilla/5.0 (Macintosh) Chrome/131 Safari/537.36") === "browser-ish", "plain browser");

  const parsed = parseEntry({
    timestamp: "2026-08-13T15:32:31Z",
    labels: [
      { name: "path", value: "/sitemap.xml" },
      { name: "statusCode", value: "200" },
    ],
    message: 'clientIP="1.2.3.4" responseTimeMS=7 userAgent="compatible; GPTBot/1.4"',
  });
  assert(parsed.path === "/sitemap.xml", "path from labels");
  assert(parsed.status === "200", "status from labels");
  assert(parsed.who === "GPTBot", "UA extracted from message string");

  console.log("selfcheck ok");
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--selfcheck")) return selfcheck();

  const days = Number(argv[argv.indexOf("--days") + 1]) || 7;
  const apiKey = process.env.RENDER_API_KEY;
  if (!apiKey) {
    console.error("RENDER_API_KEY is not set — see the usage note at the top of this file.");
    process.exit(1);
  }

  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const rows = await fetchRequestLogs(apiKey, start.toISOString(), end.toISOString());
  report(rows, days);
}

main().catch((err) => {
  // ponytail: message only — a Render error body can echo the request URL, and the
  // Authorization header is not in it, but there is no reason to print a body at all.
  console.error(`crawl-read failed: ${err.message}`);
  process.exit(1);
});
