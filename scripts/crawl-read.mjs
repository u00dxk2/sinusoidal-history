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
 *   RENDER_API_KEY=... node scripts/crawl-read.mjs [--days 7] [--snapshot]
 *
 * --snapshot appends one aggregate JSON line to docs/crawl-reads.jsonl. Use it
 * on every real read: Render only serves a trailing log window, so an
 * un-snapshotted finding stops being checkable once that window rolls past it.
 *
 * On Windows, the key lives in a user-scope env var, so:
 *   $env:RENDER_API_KEY = [System.Environment]::GetEnvironmentVariable('RENDER_API_KEY','User')
 *   node scripts/crawl-read.mjs
 *
 * Self-check (no network, no key needed):
 *   node scripts/crawl-read.mjs --selfcheck
 */

import { appendFile } from "node:fs/promises";
import path from "node:path";

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

  return { rows, crawlers, google, cycleHits, byWho };
}

/**
 * One JSON line per run, appended to docs/crawl-reads.jsonl.
 *
 * Why this exists: Render's request-log API only serves a trailing retention
 * window, so the evidence behind every finding this script has produced expires.
 * W-001's read dates ask us to COMPARE ("has anything changed since ...?"), and a
 * comparison against a paragraph in a primer is not a comparison. The committed
 * JSONL is the series; the log is just today's page of it.
 *
 * Deliberately NOT stored: the per-request rows. Path + UA + timestamp for
 * browser-shaped traffic is visitor data, and this site keeps none by design.
 * Aggregates only.
 */
export function buildSnapshot({ days, rows, crawlers, google, cycleHits, byWho }, nowIso) {
  // Build-hashed asset paths are excluded: their filenames change on EVERY
  // deploy, so keeping them would make each future diff show dozens of path
  // changes that mean nothing. They still count in crawlerHits — we just don't
  // diff on them. Content routes are the question.
  const paths = [
    ...new Set(crawlers.map((r) => r.path).filter((p) => !p.startsWith("/_next/"))),
  ].sort();
  // Sort here rather than trusting report()'s in-place sort — this function has
  // to be correct when called on its own (selfcheck does exactly that).
  const byTs = [...crawlers].sort((a, b) => String(a.ts).localeCompare(String(b.ts)));
  return {
    readAt: nowIso,
    windowDays: days,
    totalLines: rows.length,
    crawlerHits: crawlers.length,
    // Named exactly as classify() labels them, so a future diff is key-stable.
    byWho: Object.fromEntries([...byWho].sort((a, b) => b[1] - a[1])),
    googleHits: google.length,
    cyclesHits: cycleHits.length,
    crawlerPaths: paths,
    firstCrawlerTs: byTs.length ? byTs[0].ts : null,
    lastCrawlerTs: byTs.length ? byTs[byTs.length - 1].ts : null,
  };
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

  // The snapshot is the thing a future read DIFFS against, so a silent shape
  // change here would break the comparison months from now, not today.
  const rows = [
    { ts: "2026-08-15T10:27:30Z", path: "/cycles/kondratiev", status: "200", who: "GPTBot" },
    { ts: "2026-08-15T10:27:04Z", path: "/", status: "200", who: "GPTBot" },
    { ts: "2026-08-15T09:00:00Z", path: "/", status: "200", who: "browser-ish" },
    { ts: "2026-08-15T10:27:05Z", path: "/_next/static/chunks/abc123.js", status: "200", who: "GPTBot" },
  ];
  const crawlers = rows.filter((r) => r.who === "GPTBot");
  const byWho = new Map([["GPTBot", 3], ["browser-ish", 1]]);
  const snap = buildSnapshot(
    { days: 7, rows, crawlers, google: [], cycleHits: crawlers.filter((r) => r.path.startsWith("/cycles")), byWho },
    "2026-08-15T15:30:00.000Z"
  );
  assert(snap.totalLines === 4 && snap.crawlerHits === 3, "snapshot counts");
  assert(
    !snap.crawlerPaths.some((p) => p.startsWith("/_next/")),
    "build-hashed assets stay OUT of crawlerPaths — they churn every deploy and would poison the diff"
  );
  assert(snap.crawlerPaths.length === 2, "crawlerPaths keeps content routes only");
  assert(snap.googleHits === 0 && snap.cyclesHits === 1, "snapshot headline fields");
  // Unsorted input on purpose: the caller must not have to pre-sort.
  assert(snap.firstCrawlerTs === "2026-08-15T10:27:04Z", "firstCrawlerTs sorts by ts, not input order");
  assert(snap.lastCrawlerTs === "2026-08-15T10:27:30Z", "lastCrawlerTs sorts by ts");
  assert(snap.byWho["browser-ish"] === 1, "byWho keys survive verbatim for diffing");
  assert(JSON.stringify(snap).length < 20000, "snapshot stays one reasonable JSONL line");

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
  const totals = report(rows, days);

  if (argv.includes("--snapshot")) {
    const snap = buildSnapshot({ days, ...totals }, end.toISOString());
    const file = path.join(import.meta.dirname, "..", "docs", "crawl-reads.jsonl");
    await appendFile(file, JSON.stringify(snap) + "\n");
    console.log(`\nSnapshot appended to docs/crawl-reads.jsonl (${snap.crawlerHits} crawler hits).`);
    console.log("Commit it — the Render log window this came from expires.");
  }
}

main().catch((err) => {
  // ponytail: message only — a Render error body can echo the request URL, and the
  // Authorization header is not in it, but there is no reason to print a body at all.
  console.error(`crawl-read failed: ${err.message}`);
  process.exit(1);
});
