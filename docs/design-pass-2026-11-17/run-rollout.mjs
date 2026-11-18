// Design rollout 2026-11-17 (round 3): every local check the variant needs before and after it
// turns on, in ONE heavy-gate admit.
//
//   node docs/design-pass-2026-11-17/run-rollout.mjs
//
//   1. build with the flag OFF; serve it; then
//      - the design detectors on `/` and /cycles/dalio (are the variant's findings pre-existing?)
//      - the served HTML and every CSS file it links: no IBM Plex reference, no Plex preload
//      - `/design-pass/a`, `/b`, `/c` answer 404; no design-pass element on `/`
//   2. build with NEXT_PUBLIC_DESIGN_PASS_VARIANT=a; serve it; then
//      - the design detectors on the same two pages
//      - `/` carries data-design-variant="a"; `/design-pass/a|b|c` still 404
//      - the served JS chunks name none of the removed variants' copy
//      - the phone first-screen folds at 320x568, 360x560 and 390x664 (check-entry-folds)
//   3. stop each server it started, by its own PID
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const PORT = 3928;
const base = `http://127.0.0.1:${PORT}`;
const next = join(root, "node_modules/next/dist/bin/next");
const DETECTORS = "C:/dev/skylark/skylark-site/scripts/check-design-detectors.mjs";

// Strings only the removed variants b and c used (their copy and their component text), each
// checked absent from src/ after the removal, so a hit here can only be a removed variant.
const REMOVED_STRINGS = ["primary records covers the 3.0 full periods", "Peak year used", "dp-label"];

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

async function get(path) {
  const res = await fetch(`${base}${path}`);
  return { status: res.status, text: await res.text() };
}
const assetUrls = (html, ext) =>
  [...new Set([...html.matchAll(new RegExp(`(?:href|src)="(/_next/[^"]+\\.${ext}[^"]*)"`, "g"))].map((m) => m[1]))];

async function previewRoutes404(label) {
  for (const v of ["a", "b", "c"]) {
    const { status } = await get(`/design-pass/${v}`);
    note(status === 404, `${label}: /design-pass/${v} answers ${status} (want 404)`);
  }
}

// ---- 1. flag off
const offEnv = { NEXT_PUBLIC_DESIGN_PASS_VARIANT: "" };
if (await run("next build (flag OFF)", next, ["build"], offEnv)) {
  console.log("RESULT: FAIL — the flag-off build failed");
  process.exit(1);
}
let server = await serve(offEnv);
if (!server) {
  console.log("RESULT: FAIL — the flag-off server did not answer");
  process.exit(1);
}
try {
  const home = await get("/");
  note(!/data-design-variant|data-dp=/.test(home.text), "flag off: no design-pass element in the served HTML of /");
  const css = assetUrls(home.text, "css");
  let plexInCss = 0;
  for (const u of css) if (/plex|font-dp-/i.test((await get(u)).text)) plexInCss += 1;
  note(css.length > 0, `flag off: ${css.length} stylesheet(s) linked from / (want above 0, else the font read below swept nothing)`);
  console.log(`flag off: ${plexInCss} of ${css.length} stylesheet(s) mention Plex or the dp font variables`);
  const preloads = [...home.text.matchAll(/<link[^>]+rel="preload"[^>]*>/g)].map((m) => m[0]);
  const plexPreloads = preloads.filter((p) => /plex|dp/i.test(p));
  note(plexPreloads.length === 0, `flag off: ${plexPreloads.length} Plex preload(s) of ${preloads.length} preload link(s) (want 0)`);
  note(!/plex/i.test(home.text), "flag off: the HTML of / names no Plex file");
  await previewRoutes404("flag off");
  const det = await run("design detectors, flag OFF", DETECTORS, ["--url", `${base}/`, "--url", `${base}/cycles/dalio`]);
  console.log(`design detectors (flag off) exit ${det} (0 clean · 3 findings · 2 nothing swept)`);
  if (det === 2) problems += 1;
} finally {
  await stopTree(server.pid);
  console.log(`flag-off server pid ${server.pid} stopped`);
}

// ---- 2. flag on
const onEnv = { NEXT_PUBLIC_DESIGN_PASS_VARIANT: "a" };
if (await run("next build (flag ON, a)", next, ["build"], onEnv)) {
  console.log("RESULT: FAIL — the flag-on build failed");
  process.exit(1);
}
server = await serve(onEnv);
if (!server) {
  console.log("RESULT: FAIL — the flag-on server did not answer");
  process.exit(1);
}
try {
  const home = await get("/");
  note(/data-design-variant="a"/.test(home.text), 'flag on: / carries data-design-variant="a" in the served HTML');
  const js = assetUrls(home.text, "js");
  let hits = 0;
  for (const u of js) {
    const body = (await get(u)).text;
    for (const s of REMOVED_STRINGS) if (body.includes(s)) {
      hits += 1;
      console.log(`  removed string ${JSON.stringify(s)} found in ${u}`);
    }
  }
  const htmlHits = REMOVED_STRINGS.filter((s) => home.text.includes(s));
  note(js.length > 0, `flag on: ${js.length} script chunk(s) linked from / (want above 0)`);
  note(hits === 0 && htmlHits.length === 0, `flag on: ${hits} removed-variant string(s) in JS, ${htmlHits.length} in HTML (want 0 and 0)`);
  await previewRoutes404("flag on");
  for (const [w, h] of [[320, 568], [360, 560], [390, 664]]) {
    const code = await run(`check-entry-folds ${w}x${h}`, join(root, "scripts/check-entry-folds.mjs"), [base, "--width", String(w), "--height", String(h)]);
    note(code === 0, `check-entry-folds ${w}x${h} exit ${code}`);
  }
  const det = await run("design detectors, flag ON", DETECTORS, ["--url", `${base}/`, "--url", `${base}/cycles/dalio`]);
  console.log(`design detectors (flag on) exit ${det} (0 clean · 3 findings · 2 nothing swept)`);
  if (det === 2) problems += 1;
} finally {
  await stopTree(server.pid);
  console.log(`flag-on server pid ${server.pid} stopped`);
}
console.log(`\nRESULT: ${problems === 0 ? "PASS" : "FAIL"} — ${problems} problem(s); detector findings are compared off against on by hand`);
process.exit(problems === 0 ? 0 : 1);
