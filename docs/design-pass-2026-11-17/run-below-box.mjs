// I-087 batch 3 (2026-11-18): the cycle page below the verdict box, every local check in ONE
// heavy-gate admit.
//
//   node docs/design-pass-2026-11-17/run-below-box.mjs
//
//   1. build with NEXT_PUBLIC_DESIGN_PASS_VARIANT=a
//   2. I-085: if the throwaway route src/app/jsx-probe-i085 exists, print its prerendered paragraphs
//      (the JSX-whitespace probe on this Next; the route is never committed)
//   3. serve it, then
//      - check-rendered-text snap of /cycles/dalio and /cycles/turchin-fathers-sons into tmp/
//        (diffed against the live before-snaps afterwards: no word may change)
//      - on all ten cycle pages, every heading, prose paragraph, strong/em and the caveat BELOW
//        #does-it-hold-up: its computed family, weight and style, and whether a LOADED font face
//        matches all three (a miss = a fallback face or a synthesised weight/slant)
//      - check-entry-folds at 320x568, 360x560 and 390x664 (nothing above the box may move)
//   4. stop the server it started, by its own PID
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const PORT = 3929;
const base = `http://127.0.0.1:${PORT}`;
const next = join(root, "node_modules/next/dist/bin/next");
const SLUGS = [
  "khaldun", "kondratiev", "huntington", "schlesinger-jr", "perez",
  "turchin", "dalio", "strauss-howe", "modelski", "turchin-fathers-sons",
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
async function serve(env) {
  const server = spawn(process.execPath, [next, "start", "-p", String(PORT), "-H", "127.0.0.1"], {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: "ignore",
  });
  const until = Date.now() + 60000;
  while (Date.now() < until) {
    try {
      if ((await fetch(`${base}/`)).ok) return server;
    } catch {
      // not up yet
    }
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

const onEnv = { NEXT_PUBLIC_DESIGN_PASS_VARIANT: "a" };
if (await run("next build (flag ON, a)", next, ["build"], onEnv)) {
  console.log("RESULT: FAIL — the flag-on build failed");
  process.exit(1);
}

// ---- I-085
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

const server = await serve(onEnv);
if (!server) {
  console.log("RESULT: FAIL — the flag-on server did not answer");
  process.exit(1);
}
try {
  for (const slug of ["dalio", "turchin-fathers-sons"]) {
    const code = await run(`rendered text /cycles/${slug}`, join(root, "scripts/check-rendered-text.mjs"), [
      "snap",
      `${base}/cycles/${slug}`,
      join(root, `tmp/i087-${slug === "dalio" ? "dalio" : "tfs"}-after-local.txt`),
    ]);
    note(code === 0, `snap /cycles/${slug} exit ${code}`);
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
        const after = (el) => box.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING && !box.contains(el);
        const pick = (sel, kind, filter = () => true) =>
          [...article.querySelectorAll(sel)].filter((el) => after(el) && !el.closest("figure") && filter(el)).map((el) => ({ el, kind }));
        const els = [
          ...pick("h2.font-display, h3.font-display", "heading"),
          ...pick("p", "prose", (el) => !el.closest(".font-mono") && !el.classList.contains("font-mono") && el.textContent.trim()),
          ...pick("strong, b", "strong"),
          ...pick("em, i", "em"),
          ...pick(".font-display-italic", "caveat"),
        ];
        return {
          rows: els.map(({ el, kind }) => {
            const cs = getComputedStyle(el);
            const family = cs.fontFamily.split(",")[0].trim().replace(/["']/g, "");
            const weight = cs.fontWeight;
            const style = cs.fontStyle;
            const match = loaded.some((f) => f.family === family && f.weight === weight && f.style === style);
            return { kind, family, weight, style, match, text: el.textContent.trim().slice(0, 40) };
          }),
        };
      });
      if (r.error) {
        note(false, `/cycles/${slug}: ${r.error}`);
        continue;
      }
      const bad = r.rows.filter((x) => !x.match);
      for (const x of r.rows) {
        const key = `${x.kind} → ${x.family} ${x.weight} ${x.style}`;
        kinds[key] = (kinds[key] ?? 0) + 1;
      }
      note(r.rows.length > 0 && bad.length === 0, `/cycles/${slug}: ${r.rows.length} element(s) below the box, ${bad.length} without a loaded matching face`);
      for (const x of bad) console.log(`     no loaded face: ${x.kind} ${x.family} ${x.weight} ${x.style} "${x.text}"`);
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
  await stopTree(server.pid);
  console.log(`flag-on server pid ${server.pid} stopped`);
}
console.log(`\nRESULT: ${problems === 0 ? "PASS" : "FAIL"} — ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
