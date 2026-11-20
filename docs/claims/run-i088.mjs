// I-088 + the /methods design move (2026-11-20): every check in ONE heavy-gate admit.
//
//   node docs/claims/run-i088.mjs                 red-before on production + flag-on local build + checks
//   node docs/claims/run-i088.mjs --live <origin> no build: the post-deploy read of a served site
//
// Local mode:
//   1. RED-BEFORE on PRODUCTION, which still serves the old tree:
//      - the claim leg: each served surface must still carry an OLD present-tense phrase;
//      - the faces leg: /methods must NOT carry article[data-dp].
//      A leg that already passes on production proves nothing about the change, and is BAD here.
//      It also writes production's /methods rendered lines to tmp/i088-methods-before.txt.
//   2. next build with NEXT_PUBLIC_DESIGN_PASS_VARIANT=a (production's variant), served on
//      127.0.0.1:3933; refuses if that port is bound or answers. CEILING (Codex r3 LOW, not
//      closed): a listener that binds between that check and our child's bind can still answer
//      for it. --live mode starts no server and is the proof of record.
// Both modes (GREEN):
//   - claim leg: eight named targets (CHECKS below) each read NEW. Run --live against a site
//     still serving the old tree and every target reads OLD: that is this leg's red arm.
//   - faces leg on /methods: the H1 and kicker compute to dpDisplay 600, the lede to dpText 400,
//     all upright and each matching a LOADED face (family + weight + style). It prints what the
//     page's .font-mono elements resolve to (they move with [data-dp], as on /about).
//   - text leg: /methods' rendered lines against tmp/i088-methods-before.txt. Every changed line
//     must be the Turchin note (it contains "USPVD2010.xlsx"); any other changed line is BAD.
//   - check-entry-folds at 320x568, 360x560 and 390x664 (all entry pages; /methods among them).
//   - the unpaired page (/cycles/turchin-fathers-sons) at 360x560 and 390x664: the box text is
//     printed whole with its reason paragraph's line count; the box and the caveat are
//     screenshotted to tmp/ (manager review 0107fd42: the dated sentence is longer).
// Blind to: a flag-off build; colour and visibility; whether a reader takes the new sentence as
// meant; any surface not in SURFACES below (the claims pass and git grep cover the source).
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const liveAt = process.argv.indexOf("--live");
const LIVE = liveAt > -1 ? process.argv[liveAt + 1] : null;
if (liveAt > -1 && !/^https?:\/\//.test(LIVE ?? "")) {
  console.log("RESULT: FAIL — --live needs an origin, e.g. --live https://sinusoidalhistory.com");
  process.exit(2);
}
const PRODUCTION = "https://sinusoidalhistory.com";
const PORT = 3933;
const base = LIVE ?? `http://127.0.0.1:${PORT}`;
const next = join(root, "node_modules/next/dist/bin/next");
const BEFORE = join(root, "tmp/i088-methods-before.txt");
// The exact old and held sentences, byte-identical to source (Codex r3 checked each).
const OLD_BOX = "Turchin posts the underlying database, but it carries no explicit reuse licence, so this site does not redistribute it.";
const NEW_BOX = "In August 2026 the project found the underlying database on Turchin's site with no reuse licence stated on its page, so this site does not redistribute it.";
const OLD_CAVEAT = "No paired data series: Turchin posts the underlying US Political Violence Database (USPVD2010.xlsx; 1,590 events, 1780–2010) on his site, but it carries no explicit reuse license, so this site does not redistribute it.";
const NEW_CAVEAT = "No paired data series: in August 2026 the project found the underlying US Political Violence Database (USPVD2010.xlsx, 1780–2010) on Turchin's site with no reuse license stated on its page, so this site does not redistribute it.";
const OLD_METHODS = "The natural series - Turchin's US Political Violence Database - is posted on his site (USPVD2010.xlsx) but carries no explicit reuse license, so we do not redistribute it.";
const NEW_METHODS = "The natural series - Turchin's US Political Violence Database - was on his site in August 2026 (USPVD2010.xlsx) with no reuse license stated on its page, so we do not redistribute it.";
const OLD_CYCLES = "no paired data series, because the violence database he posts carries no reuse license, so we don't redistribute it.";
const NEW_CYCLES = "no paired data series, because we don't redistribute the violence database, which the August 2026 check found on Turchin's site with no license text on the download page.";
// The /methods note as one rendered line, before and after (the strong lead-in + the sentence).
const NOTE_LEAD = "No paired series for Turchin's fathers-and-sons cycle. ";
const NOTE_TAIL = " The cycle ships unpaired rather than paired to a construct-mismatched proxy.";
// SHAPE CHANGE (Codex r3 on a097260: the second round to find the claim leg's text matcher
// beatable, after r2 on 2849895). No raw-response matcher and no entity normaliser any more. Each
// check reads ONE NAMED TARGET the way its reader gets it, and compares exact strings:
//   pages  -> the browser's innerText of a named element (no markup, no entities, no <script>);
//   .md    -> the raw file, the reader of a .md file (both sentences carry no Markdown marker);
//   API    -> JSON.parse, then the turchin_fathers_sons caveat field.
// Each target reads OLD (old sentence, not the held one), NEW (the reverse), BOTH or NEITHER.
// A missing target (no #caveat, no note paragraph, no cycle in the JSON) reads NEITHER.
const ws = (s) => s.replace(/\s+/g, " ").trim();
const CHECKS = [
  {
    label: "/methods note paragraph (whole, exact)",
    read: async (b, o) =>
      pageText(b, `${o}/methods`, () => {
        const p = [...document.querySelectorAll("article p")].find((x) => x.querySelector("strong")?.textContent?.startsWith("No paired series for Turchin"));
        return p ? p.innerText : null;
      }),
    old: (t) => t === NOTE_LEAD + OLD_METHODS + NOTE_TAIL,
    neu: (t) => t === NOTE_LEAD + NEW_METHODS + NOTE_TAIL,
  },
  { label: "/methods.md (raw)", read: (b, o) => raw(`${o}/methods.md`), old: (t) => t.includes(OLD_METHODS), neu: (t) => t.includes(NEW_METHODS) },
  {
    // /cycles' root is a <div data-dp>, not an <article> (red-arm 2026-11-20 read MISSING on
    // "article"), so the target is the layout's <main> (src/app/(app)/layout.tsx:68).
    label: "/cycles main text",
    read: (b, o) => pageText(b, `${o}/cycles`, () => document.querySelector("main")?.innerText ?? null),
    old: (t) => t.includes(OLD_CYCLES),
    neu: (t) => t.includes(NEW_CYCLES),
  },
  {
    label: "/cycles/turchin-fathers-sons verdict-box answer paragraph (exact)",
    read: (b, o) => pageText(b, `${o}/cycles/turchin-fathers-sons`, () => document.querySelector("#does-it-hold-up p")?.innerText ?? null),
    old: (t) => t === `No paired data series. ${OLD_BOX}`,
    neu: (t) => t === `No paired data series. ${NEW_BOX}`,
  },
  {
    label: "/cycles/turchin-fathers-sons #caveat",
    read: (b, o) => pageText(b, `${o}/cycles/turchin-fathers-sons`, () => document.querySelector("#caveat")?.innerText ?? null),
    old: (t) => t.includes(OLD_CAVEAT),
    neu: (t) => t.includes(NEW_CAVEAT),
  },
  {
    label: "/about article text",
    read: (b, o) => pageText(b, `${o}/about`, () => document.querySelector("article")?.innerText ?? null),
    old: (t) => t.includes(OLD_CAVEAT),
    neu: (t) => t.includes(NEW_CAVEAT),
  },
  { label: "/about.md (raw)", read: (b, o) => raw(`${o}/about.md`), old: (t) => t.includes(OLD_CAVEAT), neu: (t) => t.includes(NEW_CAVEAT) },
  {
    label: "/api/v1/cycles turchin_fathers_sons.caveat (JSON.parse)",
    read: async (b, o) => {
      const r = await raw(`${o}/api/v1/cycles`);
      if (r.status !== 200) return r;
      try {
        const list = JSON.parse(r.text);
        const c = (Array.isArray(list) ? list : list.cycles ?? []).find((x) => x.id === "turchin_fathers_sons");
        return { status: r.status, text: c?.caveat ?? null };
      } catch {
        return { status: r.status, text: null };
      }
    },
    old: (t) => t.endsWith(OLD_CAVEAT),
    neu: (t) => t.endsWith(NEW_CAVEAT),
  },
];
async function raw(url) {
  const res = await fetch(url, { headers: { "user-agent": "sinusoidal-cycles-i088-check" } });
  return { status: res.status, text: await res.text() };
}
async function pageText(browser, url, fn) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    const res = await page.goto(url, { waitUntil: "load" });
    const t = await page.evaluate(fn);
    return { status: res?.status() ?? 0, text: t == null ? null : ws(t) };
  } finally {
    await page.close();
  }
}
async function readClaims(browser, origin) {
  const out = [];
  for (const c of CHECKS) {
    const r = await c.read(browser, origin);
    const t = r.text;
    const o = t != null && c.old(t);
    const n = t != null && c.neu(t);
    out.push({ label: c.label, status: r.status, state: t == null ? "MISSING" : o && n ? "BOTH" : o ? "OLD" : n ? "NEW" : "NEITHER" });
  }
  return out;
}

function run(label, file, args, env = {}) {
  return new Promise((done) => {
    console.log(`\n--- ${label}`);
    const child = spawn(process.execPath, [file, ...args], {
      cwd: root,
      env: { ...process.env, ...env },
      stdio: "inherit",
    });
    child.on("exit", (code) => done(code ?? 1));
  });
}
const stopTree = (pid) =>
  new Promise((done) => {
    const k = spawn("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
    k.on("exit", () => done());
    k.on("error", () => done());
  });
async function answers() {
  try {
    return (await fetch(`${base}/`)).ok;
  } catch {
    return false;
  }
}
// Codex r2 LOW: an HTTP probe cannot tell a stale listener from ours, so first prove the port is
// FREE by binding it ourselves; a bind failure refuses the run.
async function portFree(port) {
  const { createServer } = await import("node:net");
  return new Promise((done) => {
    const s = createServer();
    s.once("error", () => done(false));
    s.listen(port, "127.0.0.1", () => s.close(() => done(true)));
  });
}
async function body(origin, path) {
  const res = await fetch(`${origin}${path}`, { headers: { "user-agent": "sinusoidal-cycles-i088-check" } });
  return { status: res.status, text: await res.text() };
}

let problems = 0;
const note = (ok, line) => {
  if (!ok) problems += 1;
  console.log(`${ok ? "OK  " : "BAD "} ${line}`);
};

const { chromium } = await import("playwright");

async function methodsLines(browser, origin) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${origin}/methods`, { waitUntil: "load" });
  const text = await page.locator("article").innerText();
  await page.close();
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

let server = null;
if (!LIVE) {
  console.log("\n--- RED-BEFORE on production (old tree)");
  {
    const b1 = await chromium.launch();
    try {
      for (const r of await readClaims(b1, PRODUCTION)) {
        note(r.status === 200 && r.state === "OLD", `production ${r.label} (${r.status}) reads ${r.state} (must be OLD, before the deploy)`);
      }
    } finally {
      await b1.close();
    }
  }
  const prodMethods = await body(PRODUCTION, "/methods");
  note(prodMethods.status === 200 && /<article[\s>]/.test(prodMethods.text) && !/<article[^>]*data-dp/.test(prodMethods.text), `production /methods (${prodMethods.status}) has an article and no data-dp on it (must, before the deploy)`);
  mkdirSync(dirname(BEFORE), { recursive: true });
  const b0 = await chromium.launch();
  try {
    const lines = await methodsLines(b0, PRODUCTION);
    writeFileSync(BEFORE, lines.join("\n") + "\n");
    console.log(`wrote ${lines.length} production /methods lines to ${BEFORE}`);
  } finally {
    await b0.close();
  }

  const onEnv = { NEXT_PUBLIC_DESIGN_PASS_VARIANT: "a" };
  if (await run("next build (flag ON, a)", next, ["build"], onEnv)) {
    console.log("RESULT: FAIL — the flag-on build failed");
    process.exit(1);
  }
  if (!(await portFree(PORT)) || (await answers())) {
    console.log(`RESULT: FAIL — port ${PORT} is taken; refusing to read evidence from another listener`);
    process.exit(1);
  }
  server = spawn(process.execPath, [next, "start", "-p", String(PORT), "-H", "127.0.0.1"], {
    cwd: root,
    env: { ...process.env, ...onEnv },
    stdio: "ignore",
  });
  const until = Date.now() + 60000;
  let up = false;
  while (Date.now() < until && server.exitCode === null) {
    if (await answers()) {
      up = true;
      break;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  if (!up || server.exitCode !== null) {
    await stopTree(server.pid);
    console.log("RESULT: FAIL — the flag-on server did not answer, or our child exited");
    process.exit(1);
  }
  console.log(`served on ${base} (pid ${server.pid})`);
}

try {
  const browser = await chromium.launch();
  try {
    console.log(`\n--- GREEN claim leg (${base})`);
    for (const r of await readClaims(browser, base)) {
      note(r.status === 200 && r.state === "NEW", `${r.label} (${r.status}) reads ${r.state} (must be NEW)`);
    }

    console.log("\n--- faces leg: /methods header");
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${base}/methods`, { waitUntil: "load" });
    const r = await page.evaluate(async () => {
      await document.fonts.ready;
      const article = document.querySelector("article[data-dp]");
      if (!article) return { error: "no article[data-dp]" };
      const loaded = [...document.fonts]
        .filter((f) => f.status === "loaded")
        .map((f) => ({ family: f.family.replace(/["']/g, ""), weight: String(f.weight), style: f.style }));
      const read = (el) => {
        const cs = getComputedStyle(el);
        const family = cs.fontFamily.split(",")[0].trim().replace(/["']/g, "");
        return {
          family,
          weight: cs.fontWeight,
          style: cs.fontStyle,
          loaded: loaded.some((f) => f.family === family && f.weight === cs.fontWeight && f.style === cs.fontStyle),
          text: el.textContent.trim().slice(0, 40),
        };
      };
      const header = article.querySelector("header");
      const ps = header ? [...header.querySelectorAll(":scope > p")] : [];
      return {
        h1: header?.querySelector("h1") ? read(header.querySelector("h1")) : null,
        kicker: ps[0] ? read(ps[0]) : null,
        lede: ps[1] ? read(ps[1]) : null,
        mono: [...article.querySelectorAll(".font-mono")].map(read),
      };
    });
    if (r.error) {
      note(false, `/methods: ${r.error}`);
    } else {
      const want = (x, face, weight) => x && x.family.includes(face) && x.weight === weight && x.style === "normal" && x.loaded;
      const show = (x) => (x ? `${x.family} ${x.weight} ${x.style}${x.loaded ? "" : " (NOT a loaded face)"} — "${x.text}"` : "MISSING");
      note(want(r.h1, "dpDisplay", "600"), `H1 → ${show(r.h1)}`);
      note(want(r.kicker, "dpDisplay", "600"), `kicker → ${show(r.kicker)}`);
      note(want(r.lede, "dpText", "400"), `lede → ${show(r.lede)}`);
      const kinds = {};
      for (const m of r.mono) kinds[`${m.family} ${m.weight} ${m.style}`] = (kinds[`${m.family} ${m.weight} ${m.style}`] ?? 0) + 1;
      console.log(`  .font-mono on /methods: ${r.mono.length} element(s) ${JSON.stringify(kinds)}`);
    }
    await page.close();

    console.log("\n--- text leg: /methods rendered lines against production's");
    if (!existsSync(BEFORE)) {
      note(false, `no before-file at ${BEFORE}: the text leg is UNREAD`);
    } else {
      // Codex r2 MEDIUM: compared IN ORDER, index by index. The ONE allowed difference is the
      // note going from exactly its old line to exactly its new line; anything else is BAD.
      const norm = (l) => l.replace(/\s+/g, " ").trim();
      const before = readFileSync(BEFORE, "utf8").split("\n").filter(Boolean).map(norm);
      const after = (await methodsLines(browser, base)).map(norm);
      const oldNote = NOTE_LEAD + OLD_METHODS + NOTE_TAIL;
      const newNote = NOTE_LEAD + NEW_METHODS + NOTE_TAIL;
      const diffs = [];
      for (let i = 0; i < Math.max(before.length, after.length); i += 1) {
        if (before[i] !== after[i]) diffs.push(i);
      }
      for (const i of diffs) console.log(`  @${i}\n  - ${before[i] ?? "(none)"}\n  + ${after[i] ?? "(none)"}`);
      const ok =
        before.length === after.length &&
        diffs.length === 1 &&
        before[diffs[0]] === oldNote &&
        after[diffs[0]] === newNote;
      note(ok, `/methods: ${before.length} → ${after.length} lines, ${diffs.length} differing index(es); the only allowed one is the note, old line → held line exactly`);
    }

    console.log("\n--- the unpaired page's box and caveat (manager review: frame at 360 and 390)");
    for (const [w, h] of [[360, 560], [390, 664]]) {
      const p = await browser.newPage({ viewport: { width: w, height: h } });
      await p.goto(`${base}/cycles/turchin-fathers-sons`, { waitUntil: "networkidle" });
      const info = await p.evaluate(() => {
        const lines = (el) => {
          const range = document.createRange();
          range.selectNodeContents(el);
          return new Set([...range.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top))).size;
        };
        const box = document.querySelector("#does-it-hold-up");
        const first = box?.querySelector("p");
        const r = box?.getBoundingClientRect();
        return {
          text: box?.innerText ?? "",
          firstLines: first ? lines(first) : -1,
          top: r ? Math.round(r.top + scrollY) : null,
          bottom: r ? Math.round(r.bottom + scrollY) : null,
        };
      });
      console.log(`  ${w}x${h} box y ${info.top}-${info.bottom}, reason paragraph ${info.firstLines} line(s)`);
      console.log(info.text.split("\n").map((l) => `  | ${l}`).join("\n"));
      const bt = ws(info.text);
      note(bt.includes(NEW_BOX) && !bt.includes(OLD_BOX), `${w}x${h} box carries the held sentence exactly and not the old one`);
      const tag = LIVE ? "live" : "local";
      await p.locator("#does-it-hold-up").screenshot({ path: join(root, `tmp/i088-tfs-box-${w}-${tag}.png`) });
      const cav = p.locator("#caveat");
      const hasCaveat = (await cav.count()) === 1;
      note(hasCaveat, `${w}x${h} exactly one #caveat (the box's "Why there is none" link target)`);
      if (hasCaveat) await cav.screenshot({ path: join(root, `tmp/i088-tfs-caveat-${w}-${tag}.png`) });
      await p.close();
    }
  } finally {
    await browser.close();
  }

  for (const [w, h] of [[320, 568], [360, 560], [390, 664]]) {
    const code = await run(`check-entry-folds ${w}x${h}`, join(root, "scripts/check-entry-folds.mjs"), [base, "--width", String(w), "--height", String(h)]);
    note(code === 0, `check-entry-folds ${w}x${h} exit ${code}`);
  }
} finally {
  if (server) {
    await stopTree(server.pid);
    console.log(`stopped server pid ${server.pid}`);
  }
}

console.log(`\nRESULT: ${problems === 0 ? "PASS" : "FAIL"} — ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
