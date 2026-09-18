// Rendered-text gate: did the words a reader sees change? Compares the VISIBLE text of pages
// (scripts, styles and markup stripped, whitespace collapsed) between two builds or two reads.
//
//   node scripts/check-rendered-text.mjs snap <source> <out.txt>   save a baseline
//   node scripts/check-rendered-text.mjs diff <a> <b>              exit 0 identical, 3 different
//   node scripts/check-rendered-text.mjs --selftest                red-arm on a fixture
//
// A <source> is a URL, an .html file, a directory (every *.html under it, e.g.
// .next/server/app after `npm run build`), or a .txt snapshot written by `snap`.
// Typical use around a refactor or a dependency bump: snap before, change, diff after.
//
// ponytail: text only. Whitespace runs collapse (as HTML does), so a one-space-vs-two change is
// invisible, and CSS is not compared — a framework bump changes the emitted CSS bytes
// (per-build @font-face url tokens, KP-004) without changing a style; use frames for layout.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const visibleText = (html) =>
  html
    .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");

const htmlFiles = (dir) =>
  readdirSync(dir, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith(".html"))
    .sort();

async function load(source) {
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`${source} answered HTTP ${res.status}`);
    return visibleText(await res.text());
  }
  if (statSync(source).isDirectory()) {
    const files = htmlFiles(source);
    if (!files.length) throw new Error(`${source} holds no .html files — build first`);
    return files
      .map((f) => `=== ${relative(source, join(source, f)).replace(/\\/g, "/")}\n${visibleText(readFileSync(join(source, f), "utf8"))}`)
      .join("\n");
  }
  const raw = readFileSync(source, "utf8");
  return source.endsWith(".txt") ? raw : visibleText(raw);
}

function firstDifference(a, b) {
  const x = a.split("\n");
  const y = b.split("\n");
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] !== y[i]) return { line: i + 1, a: x[i], b: y[i] };
  }
  return null;
}

function selftest() {
  const page = `<!DOCTYPE html><html><head><style>h2{color:red}</style><script>var x = "<b>hidden</b>";</script></head>
<body><h2>Does any of them hold up?</h2><p>By this site&#x27;s own test, 0 of the 9 paired theories &amp; more.<!-- -->  <a href="/methods">How the test works →</a></p>
<table><tr><td>Ray Dalio</td><td>+73</td></tr></table></body></html>`;
  const base = visibleText(page);
  const checks = [
    ["scripts and styles are stripped", !base.includes("hidden") && !base.includes("color:red")],
    ["entities decode", base.includes("site's own test") && base.includes("theories & more")],
    ["an identical page is GREEN", firstDifference(base, visibleText(page)) === null],
    ["reformatted markup with the same words is GREEN", firstDifference(base, visibleText(page.replace(/></g, ">\n  <"))) === null],
    // The red arms: protected text removed, and one verdict cell changed.
    ["a page missing the heading is RED", firstDifference(base, visibleText(page.replace("Does any of them hold up?", ""))) !== null],
    ["a changed table cell is RED", firstDifference(base, visibleText(page.replace("+73", "+74")))?.b === "+74"],
  ];
  for (const [name, ok] of checks) console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  const failed = checks.filter(([, ok]) => !ok).length;
  console.log(failed ? `selftest: ${failed} FAILED` : `selftest: ${checks.length} passed`);
  return failed ? 1 : 0;
}

const [mode, a, b] = process.argv.slice(2);
if (mode === "--selftest") {
  process.exit(selftest());
} else if (mode === "snap" && a && b) {
  const text = await load(a);
  writeFileSync(b, text);
  console.log(`snap: ${a} -> ${b} (${text.split("\n").length} lines)`);
} else if (mode === "diff" && a && b) {
  const [x, y] = await Promise.all([load(a), load(b)]);
  const d = firstDifference(x, y);
  if (d) {
    console.log(`RED: first difference at line ${d.line}\n  a: ${d.a ?? "(end of text)"}\n  b: ${d.b ?? "(end of text)"}`);
    process.exit(3);
  }
  console.log(`GREEN: identical visible text (${x.split("\n").length} lines)`);
} else {
  console.error("usage: check-rendered-text.mjs snap <source> <out.txt> | diff <a> <b> | --selftest");
  process.exit(1);
}
