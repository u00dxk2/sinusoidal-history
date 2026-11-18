// Design rollout 2026-11-17 (round 3): the production proof after the flag went on, in ONE
// heavy-gate admit.
//
//   node docs/design-pass-2026-11-17/run-live-proof.mjs
//
//   1. frames of the LIVE site, first viewport, 1440x900 and 390x844, by the same script that took
//      the before frames (capture-frames.mjs live) -> docs/design-pass-2026-11-17/live/
//   2. the phone first-screen folds on production at 320x568, 360x560 and 390x664
//      (scripts/check-entry-folds.mjs, 13 entry-page legs each)
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const LIVE = "https://sinusoidalhistory.com";

function run(label, file, args) {
  return new Promise((done) => {
    console.log(`\n--- ${label}`);
    const child = spawn(process.execPath, [file, ...args], { cwd: root, stdio: "inherit" });
    child.on("exit", (code) => done(code ?? 1));
  });
}

let problems = 0;
const frames = await run("live frames", join(here, "capture-frames.mjs"), ["live", "--base", LIVE]);
console.log(`${frames === 0 ? "OK  " : "BAD "} live frames exit ${frames}`);
if (frames !== 0) problems += 1;
for (const [w, h] of [[320, 568], [360, 560], [390, 664]]) {
  const code = await run(`check-entry-folds ${w}x${h} (production)`, join(root, "scripts/check-entry-folds.mjs"), [LIVE, "--width", String(w), "--height", String(h)]);
  console.log(`${code === 0 ? "OK  " : "BAD "} production folds ${w}x${h} exit ${code}`);
  if (code !== 0) problems += 1;
}
console.log(`\nRESULT: ${problems === 0 ? "PASS" : "FAIL"} — ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
