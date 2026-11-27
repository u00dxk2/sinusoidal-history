// I-092 (2026-11-27): every check for the arrow re-subset in ONE heavy-gate admission.
//
//   node docs/design-pass-2026-11-17/run-arrow-glyphs.mjs
//
// 1. Measures production (`run-home-chart --tag live-before --live <prod>`): the baseline, no build.
// 2. Builds the working tree with the flag on (`next build`, NEXT_PUBLIC_DESIGN_PASS_VARIANT=a),
//    serves it on 127.0.0.1:3931, and measures it with `run-home-chart --tag arrows --live <local>`
//    (text multiset, faces, clipping, budget lines, and the fold gates inside it).
// 3. Runs `scripts/check-glyph-source.mjs` on the local build (which font draws each probed
//    character: the arrows and the five siblings added with them).
// 4. Stops the server (its whole process tree) and runs `run-home-chart --compare live-before arrows`.
// The change is three font files, so the "before" tree is production, which still serves the old
// files (check-deployed-sha-drift in-sync at the start of the day). run-home-chart's own --batch
// restores page.tsx and globals.css from a base sha; it cannot model a font-file change.
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const next = join(root, "node_modules/next/dist/bin/next");
const homeChart = join(here, "run-home-chart.mjs");
const arrows = join(root, "scripts/check-glyph-source.mjs");
const PROD = "https://sinusoidalhistory.com";
const PORT = 3931;
const LOCAL = `http://127.0.0.1:${PORT}`;
const ENV = { NEXT_PUBLIC_DESIGN_PASS_VARIANT: "a" };

function run(label, args, env = {}) {
  return new Promise((done) => {
    console.log(`\n--- ${label}`);
    const child = spawn(process.execPath, args, { cwd: root, env: { ...process.env, ...env }, stdio: "inherit" });
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
    return (await fetch(`${LOCAL}/`)).ok;
  } catch {
    return false;
  }
}

const codes = {};
codes.liveBefore = await run("measure production (baseline)", [homeChart, "--tag", "live-before", "--live", PROD]);
if (await answers()) {
  console.log(`RESULT: FAIL — something already answers on ${LOCAL}; refusing to read evidence from it`);
  process.exit(1);
}
codes.build = await run("next build (flag ON, a)", [next, "build"], ENV);
if (codes.build) {
  console.log("RESULT: FAIL — the build failed");
  process.exit(1);
}
const server = spawn(process.execPath, [next, "start", "-p", String(PORT), "-H", "127.0.0.1"], {
  cwd: root,
  env: { ...process.env, ...ENV },
  stdio: "ignore",
});
console.log(`server pid ${server.pid}`);
const stop = async () => stopTree(server.pid);
process.on("SIGINT", async () => {
  await stop();
  process.exit(130);
});
try {
  const until = Date.now() + 60000;
  let up = false;
  while (Date.now() < until && server.exitCode === null) {
    if ((up = await answers())) break;
    await new Promise((r) => setTimeout(r, 500));
  }
  if (!up) {
    console.log("RESULT: FAIL — the server did not answer");
    process.exitCode = 1;
  } else {
    codes.arrowsMeasure = await run("measure the build", [homeChart, "--tag", "arrows", "--live", LOCAL]);
    codes.arrowGlyphs = await run("which font draws each arrow (build)", [arrows, LOCAL, "--json", join(root, "tmp/arrow-glyphs-build.json")]);
  }
} finally {
  await stop();
  console.log(`stopped server tree ${server.pid}`);
}
codes.compare = await run("compare live-before -> arrows", [homeChart, "--compare", "live-before", "arrows"]);
console.log(`\nexits: ${JSON.stringify(codes)}`);
const ok = Object.values(codes).every((c) => c === 0);
console.log(`RESULT: ${ok ? "PASS" : "FAIL"}`);
process.exit(ok ? 0 : 1);
