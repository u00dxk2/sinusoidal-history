#!/usr/bin/env node
/**
 * Self-contained secret scanner (no external binary / no network) — the fleet's
 * shared one. ONE `PATTERNS` list, THREE callers, no export and no second copy
 * (guard by mechanism: two secret matchers drift apart, and the one you are not
 * looking at is the one that goes quiet):
 *
 *   (default)                 STAGED, ADDED lines only (`git diff --cached`), so
 *                             it blocks NEW leaks without tripping on pre-existing
 *                             content. Born from the 2026-07-07 portfolio security
 *                             review (3 of 4 criticals were secrets-in-git).
 *                             exit 0 clean · 1 hits
 *   --message-file <path>     a COMMIT MESSAGE (the commit-msg hook's $1).
 *                             exit 0 clean · 1 hits
 *   --history <days>          every ADDED line of every hunk in REACHABLE history
 *                             for the window (`git log -p --all --since=<ISO>`).
 *                             exit 0 CLEAN · 2 ERROR or NOTHING SWEPT · 3 HITS
 *
 * ⚠ HISTORY HITS EXIT 3, NOT 1 — deliberately DISTINCT from the staged/message
 * ladder above (0/1), so a caller can never confuse "history is dirty" with
 * "your commit is blocked". The staged/message exit codes are unchanged.
 * Contract: billionaire-army R-073 (needs-decision be2c5a60, ruled 2026-08-29).
 *
 * History output is REDACTED: pattern name · short sha · path:line only. The
 * matched value and the line text are NEVER printed — this mode runs over real
 * history and its output lands in transcripts. A run with 0 commits in the
 * window prints NOTHING SWEPT and exits 2: a clean verdict over nothing is not
 * clean. Every outcome prints the denominator first.
 *
 * "Reachable" = reachable from ANY ref (branches, tags, remote-tracking refs,
 * stash). Dangling / unreachable objects are NOT scanned; a merge commit's own
 * resolution diff is not shown by `git log -p` either. The stronger sweep, if
 * ever needed, is `git cat-file --batch-all-objects`.
 *
 * Bypass a genuine false positive by appending a trailing comment to the line
 * (every mode honours it, same semantics):
 *   `pragma: allowlist secret`   (or `gitleaks:allow` / `secret-scan:ignore`)
 *
 * Portable: copy into any sibling repo's scripts/ and call from its pre-commit,
 * or run it from a lane root as `node ../skylark-site/scripts/check-staged-secrets.mjs --history 30`.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, writeSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// ponytail: NO ./lib imports in this file, on purpose — it is VENDORED into sibling repos' pre-commit
// hooks (the header's "Portable" promise). e746922f (2026-08-29) imported ./lib/known-flags.mjs and
// ./lib/result-line.mjs; agentic-news re-synced its copy per its fork guard, the import threw
// ERR_MODULE_NOT_FOUND, and the hook BLOCKED the commit instead of scanning it (agentic-news B-71).
// The two helpers are inlined below with the same names and contracts (unknown flag → exit 2, nothing
// scanned; RESULT line = result-line.mjs's format, kept in step by hand — one greppable line).
const KNOWN_FLAGS = new Set(["help", "message-file", "history", "repo", "selftest"]);
function refuseUnknownFlags(args) {
  const unknown = args.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")[0]).filter((f) => !KNOWN_FLAGS.has(f));
  if (unknown.length === 0) return;
  console.error(
    `${SCRIPT}: unknown flag(s) ${unknown.map((f) => `--${f}`).join(", ")} — nothing was scanned. ` +
      `A dropped flag would return a clean verdict over the wrong scope. Run --help for the flag list.`,
  );
  process.exit(2);
}
let resultDetail = "";
let resultArmed = false;
function setResultDetail(text) {
  resultDetail = text == null ? "" : String(text);
}
function armResultLine(map) {
  if (resultArmed) return;
  resultArmed = true;
  process.on("exit", (code) => {
    try {
      const verdict = typeof map?.[code] === "string" ? map[code] : "UNKNOWN";
      const text = resultDetail.replace(/\s+/g, " ").trim();
      writeSync(1, `RESULT: ${verdict}${text ? ` — ${text}` : ""} (exit ${code})\n`);
    } catch {
      // Second carrier only; the exit code stands.
    }
  });
}

// SCANNER_SHAPES_VERSION — bump on ANY change to PATTERNS. A vendoring lane's
// copy carries this line, so a stale vendored scanner is a one-grep finding
// (check-secret-scan-coverage can compare it to skylark-site's).
// 2026-10-05.3: no PATTERNS change, but the URI placeholder judgement moved
// from the whole line to the matched token — a stale copy misses real URIs.
const SCANNER_SHAPES_VERSION = "2026-10-05.3";

// Shapes added 2026-10-05 (secreview SUB-1): the fleet's ACTUAL credentials —
// Render, Anthropic, OpenAI, Doppler, SendGrid, Stripe webhook/restricted,
// Supabase (PAT, secret key, service_role JWT), PostHog personal, Sentry,
// rediss://, gh[ousr]_ and Slack webhooks. Anchored forms follow
// agent-ops-patterns lib/snippet-redact.mjs SHAPES; generic base64/hex runs
// are deliberately NOT here (a pre-commit gate that fires on every hash
// teaches people to allowlist).
// Every new quantifier is BOUNDED ({m,n}): an unbounded run whose charset
// contains its own prefix (`sk-sk-sk-…`, `eyJa-eyJa-…`) rescans to end of line
// from every start, which is quadratic on a long minified line (Codex review
// 2026-10-05 reproduced >1.5 s on 48 KB). Bounds sit far above real key lengths.
const PATTERNS = [
  { name: "private-key-block", re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/ },
  // URI user/password runs bounded too (Codex round 2: `rediss://:x` repeated, no `@`, was quadratic).
  { name: "mongodb-uri-with-creds", re: /mongodb(?:\+srv)?:\/\/[^\s:/@]{1,256}:[^\s@]{1,512}@/ },
  { name: "postgres-uri-with-creds", re: /postgres(?:ql)?:\/\/[^\s:/@]{1,256}:[^\s@]{1,512}@/ },
  { name: "mysql-uri-with-creds", re: /mysql:\/\/[^\s:/@]{1,256}:[^\s@]{1,512}@/ },
  { name: "redis-uri-with-creds", re: /rediss?:\/\/[^\s:/@]{0,256}:[^\s@]{1,512}@/ },
  { name: "amqp-uri-with-creds", re: /amqps?:\/\/[^\s:/@]{1,256}:[^\s@]{1,512}@/ },
  { name: "aws-access-key", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "stripe-live-secret", re: /\bsk_live_[0-9a-zA-Z]{16,}\b/ },
  { name: "stripe-restricted-live", re: /\brk_live_[0-9a-zA-Z]{16,256}/ },
  { name: "stripe-webhook-secret", re: /\bwhsec_[0-9a-zA-Z+/=]{24,256}/ },
  { name: "github-pat", re: /\b(?:ghp_[0-9A-Za-z]{36}|gh[ousr]_[0-9A-Za-z]{36,255}|github_pat_[0-9A-Za-z_]{40,})\b/ },
  // Trailing `(?![A-Za-z0-9_-])`, not `\b` (2026-10-05.2): the body is FIXED-length
  // and may end in `-`, and `\b` between that `-` and a space, quote or end of line
  // never holds, so a key ending in `-` passed whole. Same fix as the redactor's
  // copy in src/lib/cc-snippet-redact.mjs (SUB-4 Codex round 1).
  { name: "google-api-key", re: /\bAIza[0-9A-Za-z\-_]{35}(?![A-Za-z0-9_-])/ },
  { name: "slack-token", re: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/ },
  { name: "slack-webhook", re: /\bhttps:\/\/hooks\.slack\.com\/services\/[A-Za-z0-9]{1,64}\/[A-Za-z0-9]{1,64}\/[A-Za-z0-9]{16,64}/ },
  { name: "render-api-key", re: /\brnd_[A-Za-z0-9]{24,128}/ },
  // Anthropic: sk-ant-<kind><2 digits>- then the ~90-char body (api03, admin01, …).
  // Checked BEFORE OpenAI. A prose word like `sk-ant-api03-generated-admin-keys` is too short.
  // `(?<![A-Za-z0-9_-])`, not `\b`: `-sk-` INSIDE a base64url blob is not a key start
  // (fleet sweep 2026-10-05: a Google Places photo name in frolic's QA fixtures fired).
  { name: "anthropic-key", re: /(?<![A-Za-z0-9_-])sk-ant-[a-z]{2,10}\d{2}-[A-Za-z0-9_-]{40,300}/ },
  // OpenAI: a typed prefix + a long body, or the legacy form = an unbroken 40+ alnum run
  // (no hyphens, so kebab-case identifiers like `sk-Button-primary-size-2` never match).
  { name: "openai-key", re: /(?<![A-Za-z0-9_-])sk-(?:(?:proj|svcacct|admin|None)-[A-Za-z0-9_-]{40,300}|[A-Za-z0-9]{40,300}(?![A-Za-z0-9]))/ },
  { name: "doppler-token", re: /\bdp\.(?:st|ct|pt|sa|scim|audit)\.[A-Za-z0-9._-]{20,256}/ },
  { name: "sendgrid-key", re: /\bSG\.[A-Za-z0-9_-]{16,64}\.[A-Za-z0-9_-]{30,128}/ },
  { name: "supabase-access-token", re: /\bsbp_[A-Za-z0-9]{32,128}/ },
  { name: "supabase-secret-key", re: /\bsb_secret_[A-Za-z0-9_-]{20,256}/ },
  // Anon keys are public by design: flag ONLY a JWT whose decoded payload says role service_role.
  { name: "supabase-service-role-jwt", test: hasServiceRoleJwt },
  { name: "posthog-personal-key", re: /\bphx_[A-Za-z0-9]{30,128}/ },
  { name: "sentry-token", re: /\bsntry[su]_[A-Za-z0-9+/=_-]{30,512}/ },
];

// Supabase-issued JWTs are compact JSON, so both header and payload start `eyJ`
// (base64url of `{"`); a whitespace-padded JSON encoding is not a shape Supabase mints.
const JWT_RE = /\beyJ[A-Za-z0-9_-]{8,2048}\.(eyJ[A-Za-z0-9_-]{8,4096})\.[A-Za-z0-9_-]{8,1024}/g;
/** True when any JWT on the line decodes to a payload with top-level role "service_role". */
function hasServiceRoleJwt(content) {
  for (const m of content.matchAll(JWT_RE)) {
    try {
      const payload = JSON.parse(Buffer.from(m[1], "base64url").toString("utf8"));
      if (payload && typeof payload === "object" && payload.role === "service_role") return true;
    } catch {
      // not a JSON payload → not a Supabase key; stay silent
    }
  }
  return false;
}

// Markers that void a connection-string match (placeholders, not real secrets).
const PLACEHOLDER =
  /(localhost|127\.0\.0\.1|example\.com|<[^>]*>|:password@|:pass@|:changeme@|:your[-_]|:xxx+@|REDACTED|\*\*\*)/i;
const ALLOW = /(pragma:\s*allowlist secret|gitleaks:allow|secret-scan:ignore)/i;
// The host/path tail of a URI after its `user:pass@` match: up to the first
// delimiter a URI does not contain in practice. Bounded like every other run.
const URI_TAIL = /^[^\s"'`<>()[\]{},;]{0,1024}/;

/**
 * True when at least one match of a URI pattern on the line is NOT a
 * placeholder. PLACEHOLDER is tested against each matched URI TOKEN (the
 * `scheme://user:pass@` match plus its host/path tail), never the whole line
 * (2026-10-05.3, urban-beaver report: a real credential-bearing URI on a line
 * that also said `example.com` or `<password>` anywhere else was let through).
 * Every match is judged, so a placeholder URI earlier on the line cannot
 * shield a real one of the same scheme later on it.
 */
function hasRealUriMatch(re, content) {
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
  for (const m of content.matchAll(g)) {
    const tail = URI_TAIL.exec(content.slice(m.index + m[0].length))?.[0] ?? "";
    if (!PLACEHOLDER.test(m[0] + tail)) return true;
  }
  return false;
}

/**
 * The one judgement every caller makes about one line: the FIRST pattern that
 * fires, or null. An allowlisted line never fires; a connection-string match
 * that is itself a placeholder voids THAT match and the scan CONTINUES (it used
 * to void the whole line, so a placeholder URI shielded a real token later on
 * the same line — Codex review reproduced it once `rediss://` joined the list).
 */
function firstPatternHit(content) {
  if (ALLOW.test(content)) return null;
  for (const p of PATTERNS) {
    if (!(p.test ? p.test(content) : p.re.test(content))) continue;
    if (p.name.endsWith("uri-with-creds") && !hasRealUriMatch(p.re, content)) continue;
    return p.name;
  }
  return null;
}

/**
 * A path is printed only when it is not itself secret-shaped (Codex review
 * 2026-10-05, round 3): an ADDED content line reading `++ b/<token>` appears
 * in the diff as `+++ b/<token>`, the line-oriented parsers below take it for a
 * file header, and the next finding would print the token as its PATH.
 * Redacting at print time closes the leak whatever the parser believes.
 */
function printablePath(p) {
  return firstPatternHit(String(p)) ? "<path redacted: secret-shaped>" : p;
}

const argv = process.argv.slice(2);
const SCRIPT = "check-staged-secrets";

if (argv.includes("--help")) {
  console.log(`${SCRIPT}.mjs — the fleet's shared secret scanner (one PATTERNS list, three callers)
  shapes version ${SCANNER_SHAPES_VERSION} · ${PATTERNS.length} patterns: ${PATTERNS.map((p) => p.name).join(", ")}

  node scripts/${SCRIPT}.mjs                        staged ADDED lines (pre-commit hook)    exit 0 clean · 1 hits
  node scripts/${SCRIPT}.mjs --message-file <path>  a commit message (commit-msg hook's $1) exit 0 clean · 1 hits
  node scripts/${SCRIPT}.mjs --history <days> [--repo <path>]
        every ADDED line of every hunk in REACHABLE history for the window
        (git log -p --all --since=<ISO>; --repo defaults to the current directory)
        exit 0 CLEAN · 2 ERROR (git unreadable / bad args) or NOTHING SWEPT (0 commits in window) · 3 HITS
        ⚠ HITS exit 3, NOT 1 — deliberately distinct from the staged/message ladder above, so
          "history is dirty" can never be read as "your commit is blocked".
        "reachable" = reachable from ANY ref (branches, tags, remote-tracking refs, stash);
          dangling / unreachable objects are NOT scanned.
        Output is REDACTED: pattern · short sha · path:line only — the matched value is never printed.
        Every outcome prints the denominator first:
          history: <N> commits scanned · <M> hunks · <K> added lines · window <days>d since <ISO>
  node scripts/${SCRIPT}.mjs --history <days> --selftest
        throwaway-repo arms, each run as a real child process of this script:
          RED    a commit tripping EVERY pattern → exit 3, every pattern named, no value printed
          GREEN  realistic content + an allowlisted line → exit 0
          EMPTY  the only commit is outside the window → NOTHING SWEPT, exit 2
          plus staged / --message-file regression arms (exit 1 on a fixture, 0 on clean)
          and a TOKEN-SCOPED PLACEHOLDER arm (a placeholder word elsewhere on a line never voids a real URI).
        exit 0 all arms pass · 1 an arm failed
  --help  this text

Allowlist (all modes, same semantics): a trailing \`pragma: allowlist secret\`
(or gitleaks:allow / secret-scan:ignore) on the line.`);
  process.exit(0);
}

refuseUnknownFlags(argv);

// --message-file <path>: scan a COMMIT MESSAGE instead of the staged diff, with
// the SAME pattern list (one list, no divergent copy — guard by mechanism).
// Item 9 (retros 2026-08-08, bounds-ledger's 3-day recurrence class): the
// remediation WRITE-UP reintroduced the removed secret — commit bodies were one
// of three recurrence surfaces the staged-files hook structurally cannot see.
// Wired from .githooks/commit-msg with the hook's $1.
const msgFlagIdx = argv.indexOf("--message-file");
if (msgFlagIdx !== -1) {
  const msgPath = argv[msgFlagIdx + 1];
  if (!msgPath) {
    console.error(`${SCRIPT}: --message-file requires a path`);
    process.exit(1);
  }
  let msg = "";
  try {
    msg = readFileSync(msgPath, "utf8");
  } catch {
    process.exit(0); // unreadable message file → never block (the diff hook already ran)
  }
  const msgFindings = [];
  // SUB-10 (secreview 2026-10-05): REDACTED like --history — pattern, line
  // number and length only. The old 60-char excerpt printed whole tokens into
  // stderr, i.e. into the agent transcript this scanner exists to protect.
  const msgLines = msg.split("\n");
  for (let i = 0; i < msgLines.length; i++) {
    const line = msgLines[i].endsWith("\r") ? msgLines[i].slice(0, -1) : msgLines[i];
    if (line.startsWith("#")) continue; // comment lines are stripped by git anyway
    const pattern = firstPatternHit(line);
    if (pattern) msgFindings.push({ pattern, lineNo: i + 1, length: line.length });
  }
  if (msgFindings.length) {
    console.error("\n✗ commit-msg: possible secret(s) in the COMMIT MESSAGE itself (REDACTED — the value is never printed):\n");
    for (const f of msgFindings) console.error(`  [${f.pattern}]  line ${f.lineNo} · ${f.length} chars`);
    console.error("\n  A remediation write-up must never quote the removed value (bounds-ledger 2026-08-08).");
    console.error("  Reword the message; false positive? append `pragma: allowlist secret` to the line.\n");
    process.exit(1);
  }
  process.exit(0);
}

// ---------------------------------------------------------------- --history
// The third caller of PATTERNS. Ported from bounds-ledger's history-sweep.mjs
// (scan-over-diff-text shape), NOT its pattern list — this file's list is the
// one the fleet's hooks already run, so history and staged cannot disagree.

const historyIdx = argv.indexOf("--history");
if (historyIdx !== -1) {
  // The RESULT line is armed at the moment the verdict is known, so the label
  // matches the outcome (exit 2 is ERROR on a git failure but NOTHING-SWEPT on
  // an empty window — one code, two honest labels).
  const finish = (code, label, detail) => {
    armResultLine({ [code]: label });
    setResultDetail(detail);
    process.exit(code);
  };
  const daysRaw = argv[historyIdx + 1];
  if (!/^\d+$/.test(daysRaw ?? "") || Number(daysRaw) < 1) {
    console.error(`${SCRIPT}: --history requires a positive whole number of days (got ${JSON.stringify(daysRaw ?? "")})`);
    finish(2, "ERROR", "bad --history argument");
  }
  const days = Number(daysRaw);
  const repoIdx = argv.indexOf("--repo");
  const repo = repoIdx !== -1 ? argv[repoIdx + 1] : process.cwd();
  if (repoIdx !== -1 && (!repo || repo.startsWith("--"))) {
    console.error(`${SCRIPT}: --repo requires a path`);
    finish(2, "ERROR", "bad --repo argument");
  }

  if (argv.includes("--selftest")) {
    const code = selftestHistory(days);
    finish(code, code === 0 ? "PASS" : "FAIL", code === 0 ? "selftest: every arm passed" : "selftest: an arm failed");
  }

  const r = sweepHistory({ days, repo });
  if (r.error) {
    console.error(`${SCRIPT}: ${r.error}`);
    finish(2, "ERROR", r.error);
  }
  console.log(r.summary);
  if (r.nothingSwept) {
    console.log("NOTHING SWEPT — 0 commits reachable in the window; a clean verdict over nothing is not clean.");
    finish(2, "NOTHING-SWEPT", r.summary);
  }
  if (r.hits.length) {
    console.log(`\n✗ history: ${r.hits.length} possible secret(s) in reachable history (REDACTED — pattern · commit · path:line; the value is never printed):\n`);
    for (const h of r.hits) console.log(`  [${h.pattern}]  ${h.sha}  ${h.file}:${h.line}`);
    console.log("\n  A value in history stays in history — removing it from the tip does not remove it.");
    console.log("  Rotate the credential first; then decide whether the history itself must be rewritten.");
    console.log("  False positive? the line needs a trailing `pragma: allowlist secret` in the commit that added it.\n");
    finish(3, "FINDINGS", `${r.hits.length} hit(s) · ${r.summary}`);
  }
  console.log("CLEAN — no secret-shaped ADDED line in the window.");
  finish(0, "PASS", r.summary);
}

/**
 * Walk `git log -p` over reachable history for the window and classify every
 * ADDED line. Returns the denominator on every outcome; never prints.
 * @returns {{ summary: string, hits: Array<{pattern: string, sha: string, file: string, line: number}>, nothingSwept: boolean, error?: string }}
 */
function sweepHistory({ days, repo }) {
  const sinceIso = new Date(Date.now() - days * 86_400_000).toISOString();
  let log = "";
  try {
    log = execFileSync(
      "git",
      [
        "-C", repo, "log", "-p", "--all", "--no-color", "--unified=0", "--no-ext-diff", "--no-textconv",
        `--since=${sinceIso}`,
        // One marker line per commit (0x01 never starts a diff line); the body is not printed.
        "--format=%x01commit %h",
      ],
      { encoding: "utf8", maxBuffer: 1024 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] },
    );
  } catch (err) {
    const first = String(err?.stderr || err?.message || "git log failed").trim().split("\n")[0];
    return { summary: "", hits: [], nothingSwept: false, error: `git unreadable (${repo}): ${first}` };
  }

  let commits = 0;
  let hunks = 0;
  let added = 0;
  let sha = "?";
  let file = "?";
  let newLine = 0;
  const hits = [];
  for (const raw of log.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    if (line.startsWith("\x01commit ")) { commits++; sha = line.slice(8).trim(); file = "?"; continue; }
    if (line.startsWith("+++ ")) { file = diffPath(line.slice(4)); continue; }
    if (line.startsWith("--- ")) continue;
    if (line.startsWith("@@")) {
      hunks++;
      const m = /^@@ -\d+(?:,\d+)? \+(\d+)/.exec(line);
      newLine = m ? Number(m[1]) : 0;
      continue;
    }
    if (line.startsWith("+")) {
      added++;
      const n = newLine++;
      const pattern = firstPatternHit(line.slice(1));
      if (pattern) hits.push({ pattern, sha, file: printablePath(file), line: n });
      continue;
    }
    if (line.startsWith(" ")) newLine++; // context (none under --unified=0; kept for correctness)
  }

  const summary = `history: ${commits} commits scanned · ${hunks} hunks · ${added} added lines · window ${days}d since ${sinceIso}`;
  return { summary, hits, nothingSwept: commits === 0 };
}

/** `b/path`, `"b/path with spaces"` or `/dev/null` → the path as git names it. */
function diffPath(s) {
  let p = s.trim();
  if (p.startsWith("\"") && p.endsWith("\"")) p = p.slice(1, -1);
  if (p.startsWith("b/")) p = p.slice(2);
  return p;
}

// ---------------------------------------------------------------- --selftest
// KP-82: a green never seen red is not evidence. Each arm builds a throwaway
// git repo and runs THIS script as a child process — the whole scan, exit code
// and printed output included — never the predicate alone.
function selftestHistory(days) {
  const fx = (n) => "Fx7kQ2mZ9p".repeat(Math.ceil(n / 10)).slice(0, n);
  const b64u = (o) => Buffer.from(JSON.stringify(o), "utf8").toString("base64url");
  const fxJwt = (role) => [b64u({ alg: "HS256", typ: "JWT" }), b64u({ iss: "supabase", ref: "fixtureref", role }), fx(43)].join(".");
  // One obviously-fake value per pattern. The trailing comment on each SOURCE
  // line is what lets this file commit through its own staged scan; the STRING
  // carries no allowlist marker, so it fires when committed to the fixture repo.
  const FIRE = [
    ["private-key-block", "-----BEGIN RSA PRIVATE KEY-----"], // pragma: allowlist secret gitleaks:allow
    ["mongodb-uri-with-creds", "MONGO=mongodb+srv://fixtureuser:fixturepw@cluster0.fixture.mongodb.net/db"], // pragma: allowlist secret gitleaks:allow
    ["postgres-uri-with-creds", "DATABASE_URL=postgres://fixtureuser:fixturepw@db.fixture.internal:5432/app"], // pragma: allowlist secret gitleaks:allow
    ["mysql-uri-with-creds", "MYSQL=mysql://fixtureuser:fixturepw@db.fixture.internal/app"], // pragma: allowlist secret gitleaks:allow
    ["redis-uri-with-creds", "REDIS=redis://:fixturepw@cache.fixture.internal:6379"], // pragma: allowlist secret gitleaks:allow
    ["amqp-uri-with-creds", "AMQP=amqps://fixtureuser:fixturepw@mq.fixture.internal/vhost"], // pragma: allowlist secret gitleaks:allow
    ["aws-access-key", "aws_access_key_id = AKIAFIXTUREFIXTURE00"], // pragma: allowlist secret gitleaks:allow
    ["stripe-live-secret", "STRIPE=sk_live_FIXTUREFIXTUREFIXTURE0"], // pragma: allowlist secret gitleaks:allow
    ["github-pat", "GITHUB_TOKEN=ghp_FIXTUREFIXTUREFIXTUREFIXTUREFIXTURE0"], // pragma: allowlist secret gitleaks:allow
    // Ends in `-` on purpose (2026-10-05.2): the old trailing `\b` never matched this shape.
    ["google-api-key", "GOOGLE=AIzaFIXTUREFIXTUREFIXTUREFIXTUREFIXTUR-"], // pragma: allowlist secret gitleaks:allow
    ["slack-token", "SLACK=xoxb-FIXTUREFIXTURE0"], // pragma: allowlist secret gitleaks:allow
    // 2026-10-05 shapes: BUILT AT RUNTIME by concatenation, so no source line
    // here is itself key-shaped (this file is scanned by its own hook and CI).
    ["stripe-restricted-live", "STRIPE_RK=" + "rk" + "_live_" + fx(24)],
    ["stripe-webhook-secret", "STRIPE_WEBHOOK_SECRET=" + "whsec" + "_" + fx(32)],
    ["slack-webhook", "SLACK_WEBHOOK=" + "https://hooks.slack.com/serv" + "ices/" + "T0FIXTURE/B0FIXTURE/" + fx(24)],
    ["render-api-key", "RENDER_API_KEY=" + "rnd" + "_" + fx(32)],
    ["anthropic-key", "ANTHROPIC_API_KEY=" + "sk" + "-ant-" + "api03-" + fx(93)],
    ["openai-key", "OPENAI_API_KEY=" + "sk" + "-proj-" + fx(120)],
    ["doppler-token", "DOPPLER_TOKEN=" + "dp" + ".st." + "prd." + fx(43)],
    ["sendgrid-key", "SENDGRID_API_KEY=" + "SG" + "." + fx(22) + "." + fx(43)],
    ["supabase-access-token", "SUPABASE_ACCESS_TOKEN=" + "sbp" + "_" + fx(40)],
    ["supabase-secret-key", "SUPABASE_SECRET=" + "sb" + "_secret_" + fx(32)],
    ["supabase-service-role-jwt", "SUPABASE_SERVICE_ROLE_KEY=" + fxJwt("service" + "_role")],
    ["posthog-personal-key", "POSTHOG_API_KEY=" + "phx" + "_" + fx(43)],
    ["sentry-token", "SENTRY_AUTH_TOKEN=" + "sntry" + "s_" + fx(60)],
  ];
  // Realistic repo content that must stay silent — URLs, base64-looking text,
  // placeholder connection strings, a CI secret reference, and ONE line that
  // would fire but carries the allowlist marker.
  const SILENT = [
    "https://api.github.com/repos/u00dxk2/skylark-site/commits?per_page=50",
    "const b64 = \"U2t5bGFyayBDcmVhdGlvbnMgcG9ydGZvbGlvIHNpdGUgZml4dHVyZQ==\";",
    "DATABASE_URL=postgres://user:password@localhost:5432/app",
    "MONGODB_URI=mongodb+srv://<user>:<password>@cluster.example.com/db",
    "redis://cache.internal:6379/0",
    "Authorization: Bearer ${{ secrets.GITHUB_TOKEN }}",
    "The scanner keys on the xoxb prefix and the AKIA prefix; neither word alone is a token.",
    "aws_access_key_id = AKIAFIXTUREFIXTURE01  # pragma: allowlist secret",
    // A Supabase ANON key is public by design and must stay silent.
    "NEXT_PUBLIC_SUPABASE_ANON_KEY=" + fxJwt("anon"),
    "an Admin API key (sk-ant-admin01-…), the rnd_ prefix, a dp.ct.* token, phx_… and sntr… keys",
    "see sk-learn-is-a-python-library-name-here; rediss://cache.internal:6380/0",
  ];

  let failed = 0;
  const arm = (label, ok, why) => {
    console.log(`selftest arm — ${label}: ${ok ? "PASS" : "FAIL"}${ok ? "" : ` — ${why}`}`);
    if (!ok) failed++;
  };

  // Every pattern owns a fixture, and every fixture names a live pattern — a
  // pattern with no fixture is untested and a clean sweep would not prove it.
  const names = PATTERNS.map((p) => p.name);
  const missing = names.filter((n) => !FIRE.some(([f]) => f === n));
  const stray = FIRE.map(([f]) => f).filter((f) => !names.includes(f));
  arm("coverage — every pattern has exactly one fixture", missing.length === 0 && stray.length === 0 && FIRE.length === names.length,
    `missing ${JSON.stringify(missing)} stray ${JSON.stringify(stray)}`);

  const self = fileURLToPath(import.meta.url);
  const base = mkdtempSync(join(tmpdir(), "css-history-selftest-"));
  const env = { ...process.env };
  for (const k of ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "CC_RESULT_LINE_NEST"]) delete env[k];
  const GIT_CFG = [
    "-c", "user.name=selftest", "-c", "user.email=selftest@example.invalid",
    "-c", "commit.gpgsign=false", "-c", "core.autocrlf=false", "-c", `core.hooksPath=${join(base, "no-hooks")}`,
  ];
  const git = (repo, args, extraEnv = {}) =>
    execFileSync("git", ["-C", repo, ...GIT_CFG, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: { ...env, ...extraEnv } });
  const initRepo = (name) => {
    const dir = join(base, name);
    execFileSync("git", ["init", "-q", "-b", "main", dir], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env });
    return dir;
  };
  const runSelf = (args, cwd) => {
    const r = spawnSync(process.execPath, [self, ...args], { cwd, encoding: "utf8", env });
    return { status: r.status, out: `${r.stdout ?? ""}\n${r.stderr ?? ""}` };
  };
  const fixtureValues = FIRE.map(([, v]) => v);
  const leaked = (out) => fixtureValues.filter((v) => out.includes(v));

  try {
    // RED — a commit that trips every pattern.
    const red = initRepo("red");
    writeFileSync(join(red, "config.txt"), `${FIRE.map(([, v]) => v).join("\n")}\n`);
    git(red, ["add", "-A"]);
    git(red, ["commit", "-q", "-m", "add fixture config"]);
    const r1 = runSelf(["--history", String(days), "--repo", red]);
    const unnamed = FIRE.map(([n]) => n).filter((n) => !r1.out.includes(`[${n}]`));
    const leak1 = leaked(r1.out);
    arm(
      `RED — every pattern fires on one commit, exit 3, values redacted (${days}d window)`,
      r1.status === 3 && unnamed.length === 0 && leak1.length === 0 && /^history: 1 commits scanned · \d+ hunks · \d+ added lines/m.test(r1.out),
      `exit ${r1.status}; unnamed ${JSON.stringify(unnamed)}; ${leak1.length} fixture value(s) PRINTED; out: ${r1.out.slice(0, 200)}`,
    );

    // GREEN — realistic content plus one allowlisted line.
    const green = initRepo("green");
    writeFileSync(join(green, "README.md"), `${SILENT.join("\n")}\n`);
    git(green, ["add", "-A"]);
    git(green, ["commit", "-q", "-m", "add realistic content"]);
    const r2 = runSelf(["--history", String(days), "--repo", green]);
    arm(
      "GREEN — realistic content + an allowlisted line, exit 0 with a non-zero denominator",
      r2.status === 0 && /^history: 1 commits scanned · [1-9]\d* hunks · [1-9]\d* added lines/m.test(r2.out) && r2.out.includes("CLEAN"),
      `exit ${r2.status}; out: ${r2.out.slice(0, 200)}`,
    );

    // EMPTY — the only commit predates the window.
    const empty = initRepo("empty");
    writeFileSync(join(empty, "old.txt"), `${FIRE[6][1]}\n`);
    git(empty, ["add", "-A"]);
    const old = new Date(Date.now() - (days + 400) * 86_400_000).toISOString();
    git(empty, ["commit", "-q", "-m", "an old commit"], { GIT_AUTHOR_DATE: old, GIT_COMMITTER_DATE: old });
    const r3 = runSelf(["--history", String(days), "--repo", empty]);
    arm(
      "EMPTY — 0 commits in the window → NOTHING SWEPT, exit 2 (a secret outside the window is not a clean run)",
      r3.status === 2 && r3.out.includes("NOTHING SWEPT") && /^history: 0 commits scanned/m.test(r3.out) && leaked(r3.out).length === 0,
      `exit ${r3.status}; out: ${r3.out.slice(0, 200)}`,
    );

    // STAGED regression — the pre-commit path still exits 1 on a fixture, 0 on clean.
    const staged = initRepo("staged");
    writeFileSync(join(staged, "a.txt"), `${FIRE[7][1]}\n`);
    git(staged, ["add", "-A"]);
    const r4 = runSelf([], staged);
    git(staged, ["reset", "-q"]);
    writeFileSync(join(staged, "a.txt"), `${SILENT.join("\n")}\n`);
    git(staged, ["add", "-A"]);
    const r5 = runSelf([], staged);
    arm(
      "STAGED regression — exit 1 on a staged fixture, 0 on realistic staged content",
      r4.status === 1 && r4.out.includes("[stripe-live-secret]") && r5.status === 0,
      `fixture exit ${r4.status}, clean exit ${r5.status}`,
    );

    // MESSAGE regression — the commit-msg path still exits 1 on a fixture, 0 on clean.
    const msgBad = join(base, "msg-bad.txt");
    const msgOk = join(base, "msg-ok.txt");
    writeFileSync(msgBad, `fix: rotate the key\n\nold value was ${FIRE[8][1]}\n`);
    writeFileSync(msgOk, `fix: rotate the key\n\n# comment lines are ignored\nno value quoted here\n`);
    const r6 = runSelf(["--message-file", msgBad], base);
    const r7 = runSelf(["--message-file", msgOk], base);
    arm(
      "MESSAGE regression — exit 1 on a fixture in the message, 0 on a clean message",
      r6.status === 1 && r6.out.includes("[github-pat]") && r7.status === 0,
      `fixture exit ${r6.status}, clean exit ${r7.status}`,
    );

    // TOKEN-SCOPED PLACEHOLDER (2026-10-05.3) — a placeholder word elsewhere on the
    // line must not void a real URI; a URI whose OWN password is a placeholder stays silent.
    const pgReal = "postgres" + "://appuser:" + fx(20) + "@db.fixture.internal/app";
    const tokBad = join(base, "msg-tok-bad.txt");
    const tokOk = join(base, "msg-tok-ok.txt");
    writeFileSync(tokBad, `fix: db\n\nDATABASE_URL=${pgReal}  # format: see example.com, password goes in <password>\n`);
    writeFileSync(tokOk, `fix: db\n\nDATABASE_URL=${"postgres" + "://appuser:changeme@db.fixture.internal/app"} and ${"postgres" + "://user:<password>@host/db"}\n`);
    const rT1 = runSelf(["--message-file", tokBad], base);
    const rT2 = runSelf(["--message-file", tokOk], base);
    arm(
      "TOKEN-SCOPED PLACEHOLDER — real URI + placeholder word elsewhere → exit 1; URI's own placeholder password → exit 0",
      rT1.status === 1 && rT1.out.includes("[postgres-uri-with-creds]") && !rT1.out.includes(fx(20)) && rT2.status === 0,
      `mixed-line exit ${rT1.status}, own-placeholder exit ${rT2.status}`,
    );

    // USAGE — bad args and an unknown flag refuse with 2, never scan.
    const r8 = runSelf(["--history", "zero", "--repo", red]);
    const r9 = runSelf(["--history", String(days), "--repo", red, "--histroy"]);
    arm("USAGE — non-numeric days and an unknown flag both exit 2", r8.status === 2 && r9.status === 2, `bad days exit ${r8.status}, unknown flag exit ${r9.status}`);
  } catch (err) {
    failed++;
    console.log(`selftest arm — harness: FAIL — ${String(err?.message ?? err).split("\n")[0]}`);
  } finally {
    try { rmSync(base, { recursive: true, force: true }); } catch { /* temp dir; best effort */ }
  }
  console.log(failed === 0 ? `selftest: PASS (${FIRE.length} patterns, ${SILENT.length} silent lines, 8 arms)` : `selftest: FAIL — ${failed} arm(s) failed`);
  return failed === 0 ? 0 : 1;
}

// ---------------------------------------------------------------- staged (default)
let diff = "";
try {
  diff = execFileSync(
    "git",
    ["diff", "--cached", "--unified=0", "--no-color", "--diff-filter=ACM"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
} catch {
  process.exit(0); // no staged changes / git unavailable → never block
}

const findings = [];
let file = "?";
for (const line of diff.split("\n")) {
  if (line.startsWith("+++ b/")) { file = line.slice(6); continue; }
  if (line.startsWith("+++") || line.startsWith("---")) continue;
  if (!line.startsWith("+")) continue;
  const pattern = firstPatternHit(line.slice(1));
  if (pattern) findings.push({ file: printablePath(file), pattern });
}

if (findings.length) {
  console.error("\n✗ pre-commit: possible secret(s) in staged changes:\n");
  for (const f of findings) console.error(`  [${f.pattern}]  ${f.file}`);
  console.error("\n  Move the secret to Doppler or an OS-level env var — never a committed file (.env.local is retired).");
  console.error("  False positive? append a trailing `pragma: allowlist secret` to the line, then re-commit.\n");
  process.exit(1);
}
process.exit(0);
