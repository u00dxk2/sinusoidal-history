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

import { readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const SERVICE_ID = "srv-d7mcat7lk1mc73bidim0";
const OWNER_ID = "tea-ctl08nrv2p9s738cgcug";

// Render caps a single logs response at 100 entries and pages backward via
// nextEndTime. The old cap was 40 pages (~4,000 requests) on the belief that it
// was "far above this site's volume" — but the trailing 7 days measured 2,401,
// so W-001's scheduled `--days 14` read would have silently truncated. 300
// pages ≈ 30,000 requests; fetchRequestLogs also REPORTS truncation now, so the
// cap being wrong again degrades to a loud incomplete rather than a quiet lie.
const MAX_PAGES = 300;

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

/**
 * Throws rather than returning a short read. Two failure modes this guards,
 * both found in the 2026-08-15 cross-family review:
 *
 * F4 — a 200 whose body has no usable `logs` array (Render returns `{}`,
 * `logs: null`, or changes shape) previously fell through `body.logs?.length`
 * to a clean zero: "Google: ZERO hits", a zero snapshot appended, exit 0. A
 * zero from an unreadable response is indistinguishable from a measured zero,
 * and this script's whole job is to be believed. It now throws.
 *
 * F3 — paging stopped at MAX_PAGES silently. The trailing 7 days was already
 * 2,401 requests, so W-001's scheduled `--days 14` read would have discarded
 * the older half — including, potentially, the one Google hit whose absence is
 * the finding — and reported it as complete. Truncation is now returned and
 * recorded, and the cap is far above a 14-day read.
 */
export function assertUsableBody(body) {
  if (!Array.isArray(body?.logs)) {
    const keys = Object.keys(body ?? {}).join(", ") || "none";
    throw new Error(
      `Render logs API returned 200 but no usable "logs" array (top-level keys: ${keys}). ` +
        `Refusing to report a zero from a response we could not read.`
    );
  }
}

async function fetchRequestLogs(apiKey, startTime, endTime) {
  const rows = [];
  let cursorEnd = endTime;
  let truncated = false;

  for (let page = 0; page < MAX_PAGES; page++) {
    const url =
      `https://api.render.com/v1/logs?ownerId=${OWNER_ID}&resource=${SERVICE_ID}` +
      `&type=request&limit=100&direction=backward` +
      `&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(cursorEnd)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) throw new Error(`Render logs API returned ${res.status}`);

    const body = await res.json();
    assertUsableBody(body);
    if (body.logs.length === 0) break;

    rows.push(...body.logs.map(parseEntry));
    if (!body.hasMore || !body.nextEndTime) break;
    cursorEnd = body.nextEndTime;

    // Last allowed page and the API still has more: the window is incomplete.
    if (page === MAX_PAGES - 1) truncated = true;
  }

  return { rows, truncated };
}

/**
 * Path minus query string. Coverage is a question about ROUTES — `/cycles`,
 * `/cycles?_rsc=1r34m` and `/?focus=perez` are two routes, not three.
 */
export function routeOf(path) {
  return String(path ?? "").split("?")[0] || "/";
}

/**
 * F5: `startsWith("/cycles")` also matched a hypothetical `/cycles-old`. Match
 * the index exactly or a real child segment.
 */
export function isCycleRoute(path) {
  const route = routeOf(path);
  return route === "/cycles" || route.startsWith("/cycles/");
}

/**
 * F1: a 404 or 301 is a crawler VISIT, not crawl COVERAGE. A bot 404ing on all
 * eight cycle routes would otherwise have made the snapshot read fully crawled.
 * 2xx is coverage; 3xx is revalidation/redirect; everything else is a failure,
 * and each is reported separately rather than summed.
 */
export function statusClass(status) {
  const n = Number(status);
  if (!Number.isFinite(n)) return "unknown";
  if (n >= 200 && n < 300) return "accepted";
  if (n >= 300 && n < 400) return "redirect";
  return "failed";
}

function report(rows, days, truncated = false) {
  const crawlers = rows.filter(
    (r) => r.who !== "self / tooling" && r.who !== "browser-ish" && r.who !== "unknown (no UA)"
  );
  const accepted = crawlers.filter((r) => statusClass(r.status) === "accepted");

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

  const nonOk = crawlers.filter((r) => statusClass(r.status) !== "accepted");
  if (nonOk.length) {
    console.log(
      `\n${nonOk.length} crawler request(s) did NOT return 2xx and are excluded from coverage.`
    );
  }

  // The W-001 headline: has Google been here at all?
  const google = crawlers.filter((r) => r.who.startsWith("Google"));
  console.log(
    google.length
      ? `\nGoogle: ${google.length} hit(s). Crawl is happening — GSC would now add impressions/queries.`
      : `\nGoogle: ZERO hits in this window. Google does not appear to know this site exists;` +
          ` a verified Search Console property + sitemap submission is the unblock, not more SEO surface.`
  );

  // Coverage counts only accepted responses (F1).
  const cycleHits = accepted.filter((r) => isCycleRoute(r.path));
  console.log(
    cycleHits.length
      ? `Phase 12 routes: ${cycleHits.length} crawler hit(s) on /cycles* (2xx only).`
      : `Phase 12 routes: no crawler has successfully fetched a /cycles* page yet.`
  );

  if (truncated) {
    console.log(
      `\n⚠ INCOMPLETE READ — hit the ${MAX_PAGES}-page cap with more logs available.` +
        ` Counts above are a LOWER BOUND and a zero here proves nothing. Narrow --days.`
    );
  }

  return { rows, crawlers, accepted, google, cycleHits, byWho, truncated };
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
export function buildSnapshot(
  { days, rows, crawlers, accepted, google, cycleHits, byWho, truncated = false },
  nowIso
) {
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

  // F2 — marginals alone (googleHits + a flat path list) cannot prove WHICH bot
  // fetched WHICH route. That is the entire 2026-08-15 finding, and once the log
  // window expires the snapshot is the only record of it. Keyed bot × route,
  // accepted responses only, assets excluded.
  const coverage = {};
  for (const r of accepted ?? []) {
    const route = routeOf(r.path);
    if (route.startsWith("/_next/")) continue;
    coverage[r.who] ??= {};
    coverage[r.who][route] = (coverage[r.who][route] ?? 0) + 1;
  }

  // Non-2xx kept as its own dimension so "nobody crawled it" and "everybody got
  // a 404 on it" can never look the same in a future diff.
  const nonOkByClass = {};
  for (const r of crawlers) {
    const cls = statusClass(r.status);
    if (cls === "accepted") continue;
    nonOkByClass[cls] = (nonOkByClass[cls] ?? 0) + 1;
  }

  return {
    readAt: nowIso,
    windowDays: days,
    // A truncated read is a LOWER BOUND. Recorded so a future diff cannot read a
    // capped window as a complete one (F3).
    complete: !truncated,
    totalLines: rows.length,
    crawlerHits: crawlers.length,
    acceptedCrawlerHits: (accepted ?? []).length,
    // Named exactly as classify() labels them, so a future diff is key-stable.
    byWho: Object.fromEntries([...byWho].sort((a, b) => b[1] - a[1])),
    coverage,
    nonOkByClass,
    googleHits: google.length,
    cyclesHits: cycleHits.length,
    crawlerPaths: paths,
    firstCrawlerTs: byTs.length ? byTs[0].ts : null,
    lastCrawlerTs: byTs.length ? byTs[byTs.length - 1].ts : null,
  };
}

async function selfcheck() {
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

  // F4 — the fix-first finding. Every one of these shapes previously produced a
  // confident "Google: ZERO hits" and a zero snapshot at exit 0.
  for (const bad of [{}, { logs: null }, { data: [] }, null, undefined, { logs: "nope" }]) {
    let threw = false;
    try {
      assertUsableBody(bad);
    } catch {
      threw = true;
    }
    assert(threw, `unreadable body ${JSON.stringify(bad)} must throw, never read as a measured zero`);
  }
  // An empty-but-VALID window is a real zero and must still be allowed through.
  assertUsableBody({ logs: [] });

  // The snapshot is the thing a future read DIFFS against, so a silent shape
  // change here would break the comparison months from now, not today.
  const rows = [
    { ts: "2026-08-15T10:27:30Z", path: "/cycles/kondratiev", status: "200", who: "GPTBot" },
    { ts: "2026-08-15T10:27:04Z", path: "/", status: "200", who: "GPTBot" },
    { ts: "2026-08-15T09:00:00Z", path: "/", status: "200", who: "browser-ish" },
    { ts: "2026-08-15T10:27:05Z", path: "/_next/static/chunks/abc123.js", status: "200", who: "GPTBot" },
  ];
  rows.push(
    // A 404 on a cycle route: a visit, NOT coverage (F1).
    { ts: "2026-08-15T10:28:00Z", path: "/cycles/perez", status: "404", who: "GPTBot" },
    // Same route, different query: one route, not two (F5/routeOf).
    { ts: "2026-08-15T10:27:35Z", path: "/cycles?_rsc=1r34m", status: "200", who: "GPTBot" }
  );
  const crawlers = rows.filter((r) => r.who === "GPTBot");
  const accepted = crawlers.filter((r) => statusClass(r.status) === "accepted");
  const byWho = new Map([["GPTBot", 5], ["browser-ish", 1]]);
  const snap = buildSnapshot(
    {
      days: 7,
      rows,
      crawlers,
      accepted,
      google: [],
      cycleHits: accepted.filter((r) => isCycleRoute(r.path)),
      byWho,
    },
    "2026-08-15T15:30:00.000Z"
  );
  assert(snap.totalLines === 6 && snap.crawlerHits === 5, "snapshot counts");

  // F1 — a 404 must never read as coverage.
  assert(snap.acceptedCrawlerHits === 4, "acceptedCrawlerHits excludes the 404");
  assert(snap.nonOkByClass.failed === 1, "non-2xx is kept as its own dimension, not dropped");
  assert(
    snap.coverage.GPTBot["/cycles/perez"] === undefined,
    "a 404 route must NOT appear as covered — otherwise an all-404 crawl looks fully crawled"
  );
  assert(snap.cyclesHits === 2, "cyclesHits counts only 2xx cycle routes (kondratiev + /cycles)");

  // F2 — the bot x route relationship must survive log expiry.
  assert(
    snap.coverage.GPTBot["/cycles/kondratiev"] === 1,
    "coverage proves WHICH bot fetched WHICH route — the whole 2026-08-15 finding"
  );
  assert(
    snap.coverage.GPTBot["/_next/static/chunks/abc123.js"] === undefined,
    "assets stay out of coverage"
  );

  // F5 — query strings are not distinct routes, and /cycles-old is not a cycle route.
  assert(snap.coverage.GPTBot["/cycles"] === 1, "query string collapses to its route");
  assert(routeOf("/?focus=perez") === "/", "routeOf strips the query");
  assert(isCycleRoute("/cycles") && isCycleRoute("/cycles/turchin"), "real cycle routes match");
  assert(!isCycleRoute("/cycles-old"), "prefix match must not swallow /cycles-old");

  // F3 — a capped read is a lower bound and must say so.
  assert(snap.complete === true, "a normal read is complete");
  const capped = buildSnapshot(
    { days: 14, rows, crawlers, accepted, google: [], cycleHits: [], byWho, truncated: true },
    "2026-08-15T15:30:00.000Z"
  );
  assert(capped.complete === false, "a truncated read records complete:false, never a silent zero");

  assert(statusClass("301") === "redirect" && statusClass("500") === "failed", "status classes");
  assert(
    !snap.crawlerPaths.some((p) => p.startsWith("/_next/")),
    "build-hashed assets stay OUT of crawlerPaths — they churn every deploy and would poison the diff"
  );
  // crawlerPaths is the RAW audit trail (all crawler requests, assets removed),
  // deliberately distinct from `coverage` which is 2xx-only and route-keyed.
  assert(snap.crawlerPaths.length === 4, "crawlerPaths keeps content paths only, assets dropped");
  assert(snap.googleHits === 0, "googleHits — the headline zero");
  // Unsorted input on purpose: the caller must not have to pre-sort.
  assert(snap.firstCrawlerTs === "2026-08-15T10:27:04Z", "firstCrawlerTs sorts by ts, not input order");
  // The 404 at 10:28 is still a crawler VISIT, so it bounds the window even
  // though it is excluded from coverage.
  assert(snap.lastCrawlerTs === "2026-08-15T10:28:00Z", "lastCrawlerTs sorts by ts");
  assert(snap.byWho["browser-ish"] === 1, "byWho keys survive verbatim for diffing");
  assert(JSON.stringify(snap).length < 20000, "snapshot stays one reasonable JSONL line");

  // F6 — appending to a corrupt series must refuse, not extend the corruption.
  const scratch = path.join(import.meta.dirname, ".selfcheck-crawl-reads.tmp.jsonl");
  await writeFile(scratch, '{"readAt":"x"}\n{ this is not json\n');
  let refused = false;
  try {
    await appendSnapshot(scratch, snap);
  } catch (err) {
    refused = /not valid JSON/.test(err.message);
  }
  await rm(scratch, { force: true });
  assert(refused, "appendSnapshot refuses to append to a torn/corrupt JSONL");

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
  const { rows, truncated } = await fetchRequestLogs(
    apiKey,
    start.toISOString(),
    end.toISOString()
  );
  const totals = report(rows, days, truncated);

  if (argv.includes("--snapshot")) {
    const snap = buildSnapshot({ days, ...totals }, end.toISOString());
    const file = path.join(import.meta.dirname, "..", "docs", "crawl-reads.jsonl");
    await appendSnapshot(file, snap);
    console.log(
      `\nSnapshot appended to docs/crawl-reads.jsonl` +
        ` (${snap.acceptedCrawlerHits} accepted crawler hits, complete=${snap.complete}).`
    );
    console.log("Commit it — the Render log window this came from expires.");
  }

  // An incomplete read still gets recorded (flagged), but must not exit clean —
  // a caller scripting this should not read success from a capped window.
  if (truncated) process.exitCode = 2;
}

/**
 * F6: `appendFile` can tear on a crash mid-write, and a half-line silently
 * corrupts every future read of the series. Read-validate-rewrite via a temp
 * file and an atomic rename instead: the file is small (one line per read) and
 * the whole point of it is to be trustworthy years from now.
 */
export async function appendSnapshot(file, snap) {
  let existing = "";
  try {
    existing = await readFile(file, "utf8");
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  const lines = existing.split("\n").filter((l) => l.trim());
  lines.forEach((line, i) => {
    try {
      JSON.parse(line);
    } catch {
      throw new Error(
        `docs/crawl-reads.jsonl line ${i + 1} is not valid JSON — refusing to append to a ` +
          `corrupt series. Repair or remove that line first.`
      );
    }
  });

  lines.push(JSON.stringify(snap));
  const tmp = `${file}.tmp`;
  await writeFile(tmp, lines.join("\n") + "\n");
  await rename(tmp, file);
}

main().catch((err) => {
  // ponytail: message only — a Render error body can echo the request URL, and the
  // Authorization header is not in it, but there is no reason to print a body at all.
  console.error(`crawl-read failed: ${err.message}`);
  process.exit(1);
});
