// RECORD OF ROUND 2. Since the rollout (round 3) only variant a exists and DESIGN_PASS_PREVIEW is
// gone, so `b` and `c` build the pre-pass site; use run-rollout.mjs for checks now.
//
// Design pass 2026-11-17, admit 3: the SELECTED variant's after frames and checks, in ONE run.
//
//   node docs/design-pass-2026-11-17/run-after.mjs <a|b|c>
//
//   1. build with the flag OFF; serve it; measure LCP, CLS and an interaction delay on `/` and
//      /cycles/dalio (the control), and record whether any design-pass font file is requested
//   2. build with NEXT_PUBLIC_DESIGN_PASS_VARIANT=<variant>; serve it; then
//      - the after frames, by the SAME script that took the before frames
//      - the same speed reads, for the comparison
//      - reduced motion: the sheet's traces must not animate under prefers-reduced-motion
//      - the phone first-screen folds at 320x568, 360x560 and 390x664 (check-entry-folds)
//      - the design detectors on `/` and /cycles/dalio
//   3. stop each server it started, by its own PID
//
// Speed is read on one machine, local server, three runs each, median: good for "did the flag
// make it worse", not an absolute number. The interaction read is one tab click's longest
// event duration, a stand-in for INP, which needs real use to measure.
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const variant = process.argv[2];
if (!["a", "b", "c"].includes(variant)) {
  console.error("usage: run-after.mjs <a|b|c>");
  process.exit(2);
}
const PORT = 3927;
const base = `http://127.0.0.1:${PORT}`;
const next = join(root, "node_modules/next/dist/bin/next");

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

const median = (xs) => [...xs].sort((p, q) => p - q)[Math.floor(xs.length / 2)];
const SIZES = [
  { name: "1440", width: 1440, height: 900 },
  { name: "390", width: 390, height: 844 },
];
const PERF_PAGES = ["/", "/cycles/dalio"];

async function speed(browser) {
  const out = {};
  let plexRequests = 0;
  for (const size of SIZES) {
    for (const path of PERF_PAGES) {
      const lcps = [];
      const clss = [];
      const taps = [];
      for (let i = 0; i < 3; i += 1) {
        const context = await browser.newContext({ viewport: { width: size.width, height: size.height } });
        const page = await context.newPage();
        page.on("request", (r) => {
          if (/ibm-plex|plex/i.test(r.url()) || (/\.woff2/.test(r.url()) && /dp|plex/i.test(r.url()))) plexRequests += 1;
        });
        await page.addInitScript(() => {
          window.__lcp = 0;
          window.__cls = 0;
          window.__evt = 0;
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) window.__lcp = e.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
          }).observe({ type: "layout-shift", buffered: true });
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) window.__evt = Math.max(window.__evt, e.duration);
          }).observe({ type: "event", durationThreshold: 16, buffered: true });
        });
        await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 60000 });
        await page.waitForTimeout(1200);
        if (path === "/") {
          const tab = page.getByRole("tab", { name: "Calibrate" });
          if (await tab.count()) {
            await tab.first().click();
            await page.waitForTimeout(400);
          }
        }
        const read = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls, evt: window.__evt }));
        lcps.push(read.lcp);
        clss.push(read.cls);
        taps.push(read.evt);
        await context.close();
      }
      out[`${path} @${size.name}`] = {
        lcpMs: Math.round(median(lcps)),
        cls: Number(median(clss).toFixed(4)),
        tapMs: Math.round(median(taps)),
      };
    }
  }
  return { out, plexRequests };
}

let problems = 0;
const note = (ok, line) => {
  if (!ok) problems += 1;
  console.log(`${ok ? "OK  " : "BAD "} ${line}`);
};

// ---- 1. the control: flag off
const offEnv = { NEXT_PUBLIC_DESIGN_PASS_VARIANT: "", DESIGN_PASS_PREVIEW: "" };
if (await run("next build (flag OFF, the control)", next, ["build"], offEnv)) {
  console.log("RESULT: FAIL — the flag-off build failed");
  process.exit(1);
}
let server = await serve(offEnv);
if (!server) {
  console.log("RESULT: FAIL — the flag-off server did not answer");
  process.exit(1);
}
// The like-for-like before frames: same local build path, same script, same viewports and
// settle wait as the after frames below, with the flag off (orchestrator rule, 2026-11-17).
if (await run("before frames, local build, flag off", join(here, "capture-frames.mjs"), ["before-local", "--base", base])) {
  await stopTree(server.pid);
  console.log("RESULT: FAIL — the like-for-like before frames were not all written");
  process.exit(1);
}
let control;
let browser = await chromium.launch();
try {
  control = await speed(browser);
  const page = await browser.newPage();
  const res = await page.goto(`${base}/design-pass/a`);
  note(res?.status() === 404, `flag off: /design-pass/a answers ${res?.status()} (want 404)`);
  await page.goto(`${base}/`);
  const leak = await page.evaluate(() => ({
    dp: document.querySelectorAll(".dp, [data-dp], [data-design-variant]").length,
    htmlClass: document.documentElement.className,
    h1: document.querySelector("h1")?.innerText,
  }));
  note(leak.dp === 0, `flag off: ${leak.dp} design-pass element(s) on / (want 0); h1=${JSON.stringify(leak.h1)}`);
  note(control.plexRequests === 0, `flag off: ${control.plexRequests} design-pass font request(s) across 12 loads (want 0)`);
} finally {
  await browser.close();
  await stopTree(server.pid);
  console.log(`control server pid ${server.pid} stopped`);
}

// ---- 2. the selected variant: flag on
const onEnv = { NEXT_PUBLIC_DESIGN_PASS_VARIANT: variant, DESIGN_PASS_PREVIEW: "" };
if (await run(`next build (flag ON, variant ${variant})`, next, ["build"], onEnv)) {
  console.log("RESULT: FAIL — the flag-on build failed");
  process.exit(1);
}
server = await serve(onEnv);
if (!server) {
  console.log("RESULT: FAIL — the flag-on server did not answer");
  process.exit(1);
}
try {
  if (await run("after frames", join(here, "capture-frames.mjs"), ["after", "--base", base])) problems += 1;

  browser = await chromium.launch();
  try {
    const after = await speed(browser);
    console.log("\n--- speed, control (flag off) against the variant (flag on); median of 3, local server");
    for (const key of Object.keys(control.out)) {
      const c = control.out[key];
      const v = after.out[key];
      // A regression: LCP more than 20% and 100ms slower, or CLS up by more than 0.02.
      const worse = (v.lcpMs > c.lcpMs * 1.2 && v.lcpMs - c.lcpMs > 100) || v.cls - c.cls > 0.02;
      note(!worse, `${key}: LCP ${c.lcpMs} -> ${v.lcpMs} ms · CLS ${c.cls} -> ${v.cls} · tap ${c.tapMs} -> ${v.tapMs} ms`);
    }
    console.log(`design-pass font requests with the flag on: ${after.plexRequests} (expected above 0)`);

    console.log("\n--- reduced motion");
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(`${base}/`, { waitUntil: "networkidle" });
    const motion = await page.evaluate(() => {
      const els = [...document.querySelectorAll(".dp-trace, .dp-grid")];
      return { count: els.length, animated: els.filter((e) => getComputedStyle(e).animationName !== "none").length };
    });
    note(motion.animated === 0, `reduced motion: ${motion.animated} of ${motion.count} sheet element(s) still animate (want 0; 0 of 0 means this variant draws no sheet)`);
    const face = await page.evaluate(() => getComputedStyle(document.querySelector("h1")).fontFamily);
    note(/plex|__dp|dpDisplay/i.test(face), `h1 font-family resolves to ${face}`);
    await context.close();
  } finally {
    await browser.close();
  }

  for (const [w, h] of [[320, 568], [360, 560], [390, 664]]) {
    const code = await run(`check-entry-folds ${w}x${h}`, join(root, "scripts/check-entry-folds.mjs"), [base, "--width", String(w), "--height", String(h)]);
    note(code === 0, `check-entry-folds ${w}x${h} exit ${code}`);
  }

  const det = await run("design detectors", "C:/dev/skylark/skylark-site/scripts/check-design-detectors.mjs", ["--url", `${base}/`, "--url", `${base}/cycles/dalio`]);
  console.log(`design detectors exit ${det} (0 clean · 3 findings, to be read one by one · 2 nothing swept)`);
  if (det === 2) problems += 1;
} finally {
  await stopTree(server.pid);
  console.log(`variant server pid ${server.pid} stopped`);
}
console.log(`\nRESULT: ${problems === 0 ? "PASS" : "FAIL"} — variant ${variant}; ${problems} problem(s); detector findings are listed above and judged by hand`);
process.exit(problems === 0 ? 0 : 1);
