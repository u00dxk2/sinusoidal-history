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
//      127.0.0.1:3933; refuses if that port already answers.
// Both modes (GREEN):
//   - claim leg: every surface carries NO old phrase and DOES carry "August 2026".
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
import { existsSync, readFileSync, writeFileSync } from "node:fs";
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
const OLD = /Turchin posts the underlying|is posted on his site|database he posts/;
const NEW = /August 2026/;
const SURFACES = [
  "/methods",
  "/methods.md",
  "/cycles",
  "/cycles/turchin-fathers-sons",
  "/about",
  "/about.md",
  "/api/v1/cycles",
];

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
  for (const p of SURFACES) {
    const r = await body(PRODUCTION, p);
    note(r.status === 200 && OLD.test(r.text), `production ${p} (${r.status}) still carries an old present-tense phrase (must, before the deploy)`);
  }
  const prodMethods = await body(PRODUCTION, "/methods");
  note(!/<article[^>]*data-dp/.test(prodMethods.text), "production /methods has no article[data-dp] (must, before the deploy)");
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
  if (await answers()) {
    console.log(`RESULT: FAIL — something already answers on ${base}; refusing to read evidence from it`);
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
  if (!up) {
    await stopTree(server.pid);
    console.log("RESULT: FAIL — the flag-on server did not answer");
    process.exit(1);
  }
  console.log(`served on ${base} (pid ${server.pid})`);
}

try {
  console.log(`\n--- GREEN claim leg (${base})`);
  for (const p of SURFACES) {
    const r = await body(base, p);
    const old = r.text.match(OLD);
    note(r.status === 200 && !old && NEW.test(r.text), `${p} (${r.status}): old phrase ${old ? JSON.stringify(old[0]) : "absent"}, "August 2026" ${NEW.test(r.text) ? "present" : "ABSENT"}`);
  }

  const browser = await chromium.launch();
  try {
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
      const before = readFileSync(BEFORE, "utf8").split("\n").filter(Boolean);
      const after = await methodsLines(browser, base);
      const gone = before.filter((l) => !after.includes(l));
      const added = after.filter((l) => !before.includes(l));
      for (const l of gone) console.log(`  - ${l}`);
      for (const l of added) console.log(`  + ${l}`);
      const stray = [...gone, ...added].filter((l) => !l.includes("USPVD2010.xlsx"));
      note(before.length === after.length && gone.length === 1 && added.length === 1 && stray.length === 0, `/methods: ${before.length} → ${after.length} lines, ${gone.length} removed, ${added.length} added, ${stray.length} changed line(s) outside the Turchin note`);
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
      note(/August 2026/.test(info.text) && !OLD.test(info.text), `${w}x${h} box carries the dated sentence and no old phrase`);
      const tag = LIVE ? "live" : "local";
      await p.locator("#does-it-hold-up").screenshot({ path: join(root, `tmp/i088-tfs-box-${w}-${tag}.png`) });
      const cav = p.locator("#caveat");
      if (await cav.count()) await cav.screenshot({ path: join(root, `tmp/i088-tfs-caveat-${w}-${tag}.png`) });
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
