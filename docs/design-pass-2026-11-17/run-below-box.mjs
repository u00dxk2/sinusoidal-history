// I-087 batch 3 (2026-11-18): the cycle page below the verdict box, every check in ONE
// heavy-gate admit.
//
//   node docs/design-pass-2026-11-17/run-below-box.mjs                 local: build + serve + check
//   node docs/design-pass-2026-11-17/run-below-box.mjs --live <origin> no build: check a served site
//
//   local only:
//   1. build with NEXT_PUBLIC_DESIGN_PASS_VARIANT=a
//   2. I-085: if the throwaway route src/app/jsx-probe-i085 exists, print its prerendered paragraphs
//   3. serve it on 127.0.0.1:3929, refusing if that port already answers (a stale server would
//      supply the evidence)
//   both:
//   - rendered text of /cycles/dalio and /cycles/turchin-fathers-sons, DIFFED against the
//     before-snaps in tmp/ (taken from production before the change): any difference is BAD
//   - on all ten cycle pages, EVERY element below #does-it-hold-up that draws text of its own
//     (figures excluded) must compute to one of the pass's two faces (next/font's dpDisplay,
//     dpText from designPassFonts.ts), upright, with a loaded face matching its exact family,
//     weight and style; every h2/h3 must be dpDisplay. It prints what each tag resolves to.
//     Before this change the headings computed to Fraunces and the prose to Geist, so this leg
//     is RED on the prior tree. It does NOT see visibility (opacity, colour) or a flag-off build.
//   - check-entry-folds at 320x568, 360x560 and 390x664 (nothing above the box may move)
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
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
const PORT = 3929;
const base = LIVE ?? `http://127.0.0.1:${PORT}`;
const next = join(root, "node_modules/next/dist/bin/next");
const SLUGS = [
  "khaldun", "kondratiev", "huntington", "schlesinger-jr", "perez",
  "turchin", "dalio", "strauss-howe", "modelski", "turchin-fathers-sons",
];
const SNAPS = [
  ["dalio", "dalio"],
  ["turchin-fathers-sons", "tfs"],
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
async function serve(env) {
  if (await answers()) {
    console.log(`RESULT: FAIL — something already answers on ${base}; refusing to read evidence from it`);
    process.exit(1);
  }
  const server = spawn(process.execPath, [next, "start", "-p", String(PORT), "-H", "127.0.0.1"], {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: "ignore",
  });
  const until = Date.now() + 60000;
  while (Date.now() < until) {
    if (server.exitCode !== null) break;
    if (await answers()) return server;
    await new Promise((r) => setTimeout(r, 500));
  }
  await stopTree(server.pid);
  return null;
}

let problems = 0;
const note = (ok, line) => {
  if (!ok) problems += 1;
  console.log(`${ok ? "OK  " : "BAD "} ${line}`);
};

let server = null;
if (!LIVE) {
  const onEnv = { NEXT_PUBLIC_DESIGN_PASS_VARIANT: "a" };
  if (await run("next build (flag ON, a)", next, ["build"], onEnv)) {
    console.log("RESULT: FAIL — the flag-on build failed");
    process.exit(1);
  }
  const probeHtml = join(root, ".next/server/app/jsx-probe-i085.html");
  if (existsSync(join(root, "src/app/jsx-probe-i085/page.tsx"))) {
    if (existsSync(probeHtml)) {
      const html = readFileSync(probeHtml, "utf8");
      console.log(`\n--- I-085 probe (${probeHtml})`);
      for (const id of ["probe-a", "probe-b", "probe-c"]) {
        const m = html.match(new RegExp(`<p id="${id}">([\\s\\S]*?)</p>`));
        console.log(`  ${id}: ${m ? JSON.stringify(m[1]) : "NOT FOUND"}`);
      }
    } else {
      console.log(`I-085: no prerendered file at ${probeHtml} (UNREAD)`);
    }
  }
  server = await serve(onEnv);
  if (!server) {
    console.log("RESULT: FAIL — the flag-on server did not answer");
    process.exit(1);
  }
}
console.log(`\nchecking ${base} (${LIVE ? "live, no build" : "local flag-on build"})`);

try {
  const tag = LIVE ? "after-live" : "after-local";
  for (const [slug, short] of SNAPS) {
    const before = join(root, `tmp/i087-${short}-before.txt`);
    const after = join(root, `tmp/i087-${short}-${tag}.txt`);
    const snap = await run(`rendered text /cycles/${slug}`, join(root, "scripts/check-rendered-text.mjs"), ["snap", `${base}/cycles/${slug}`, after]);
    note(snap === 0, `snap /cycles/${slug} exit ${snap}`);
    if (!existsSync(before)) {
      note(false, `no before-snap at ${before}: the text leg is UNREAD`);
      continue;
    }
    const diff = await run(`diff /cycles/${slug} against the before-snap`, join(root, "scripts/check-rendered-text.mjs"), ["diff", before, after]);
    note(diff === 0, `rendered text /cycles/${slug} identical to the before-snap (diff exit ${diff})`);
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const kinds = {};
    for (const slug of SLUGS) {
      await page.goto(`${base}/cycles/${slug}`, { waitUntil: "load" });
      const r = await page.evaluate(async () => {
        await document.fonts.ready;
        const box = document.querySelector("#does-it-hold-up");
        const article = document.querySelector("article[data-dp]");
        if (!box || !article) return { error: `box ${!!box} article[data-dp] ${!!article}` };
        const loaded = [...document.fonts]
          .filter((f) => f.status === "loaded")
          .map((f) => ({ family: f.family.replace(/["']/g, ""), weight: String(f.weight), style: f.style }));
        // One stated rule, no classification (after two review rounds found picker defects):
        // EVERY element below the box (figures excluded) that draws text of its own must
        // compute to one of the two pass faces, upright, with a loaded face matching its exact
        // family + weight + style (so no fallback face, no synthesised weight or slant). On top,
        // by TAG, not class: every h2/h3 must be the display face.
        const after = (el) => box.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING && !box.contains(el);
        const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        const els = [...article.querySelectorAll("*")].filter((el) => after(el) && !el.closest("figure") && ownText(el));
        return {
          rows: els.map((el) => {
            const cs = getComputedStyle(el);
            const family = cs.fontFamily.split(",")[0].trim().replace(/["']/g, "");
            const weight = cs.fontWeight;
            const style = cs.fontStyle;
            const heading = /^H[23]$/.test(el.tagName);
            const kind = heading ? "h2/h3" : el.tagName.toLowerCase();
            const loadedMatch = loaded.some((f) => f.family === family && f.weight === weight && f.style === style);
            const passFace = heading ? family.includes("dpDisplay") : /dpDisplay|dpText/.test(family);
            return { kind, family, weight, style, ok: loadedMatch && passFace && style === "normal", want: heading ? "dpDisplay, loaded, normal" : "dpDisplay|dpText, loaded, normal", text: el.textContent.trim().slice(0, 40) };
          }),
        };
      });
      if (r.error) {
        note(false, `/cycles/${slug}: ${r.error}`);
        continue;
      }
      const bad = r.rows.filter((x) => !x.ok);
      for (const x of r.rows) {
        const key = `${x.kind} → ${x.family} ${x.weight} ${x.style}`;
        kinds[key] = (kinds[key] ?? 0) + 1;
      }
      note(r.rows.length > 0 && bad.length === 0, `/cycles/${slug}: ${r.rows.length} element(s) below the box, ${bad.length} not on the expected loaded face`);
      for (const x of bad.slice(0, 5)) console.log(`     ${x.kind}: got ${x.family} ${x.weight} ${x.style}, want ${x.want} — "${x.text}"`);
      if (bad.length > 5) console.log(`     (+${bad.length - 5} more)`);
    }
    console.log("\n--- what each kind resolves to (all ten pages)");
    for (const [k, n] of Object.entries(kinds)) console.log(`  ${k} ×${n}`);
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
    console.log(`flag-on server pid ${server.pid} stopped`);
  }
}
console.log(`\nRESULT: ${problems === 0 ? "PASS" : "FAIL"} — ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
