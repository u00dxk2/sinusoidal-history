// I-078 (2026-11-19): every check for the verdict-words change in ONE heavy-gate admit.
//
//   node docs/claims/run-i078.mjs            red-before on production + flag-on local build + checks
//   node docs/claims/run-i078.mjs --live <origin>   no build: the post-deploy read of a served site
//
// Local mode:
//   1. RED-BEFORE: the four checkers whose oracles now carry the new words run against PRODUCTION,
//      which still serves the old words. Each must exit non-zero; one that passes there proves
//      nothing about the new words, and this run says so (BAD).
//   2. next build with NEXT_PUBLIC_DESIGN_PASS_VARIANT=a (production's variant), served on
//      127.0.0.1:3931; refuses if that port already answers.
//   3. GREEN: the same four checkers against the local build, each must exit 0.
// Both modes:
//   - check-entry-folds at 320x568, 360x560, 390x664 (exit 0).
//   - LAYOUT (manager review, 2026-11-19): on /, at 390x664, 360x560 and 320x568, the glance
//     caption and verdict line: their text, line count (distinct client-rect tops of the text),
//     and bottom against the viewport. Asserted: the caption is ONE line at every size; the
//     verdict line is at most TWO lines at every size and ends on the first screen at 390x664
//     (the size its 118-char budget was measured at). At 320x568 and 360x560 it may take no more
//     lines than the pre-change production line did (three).
//   - the unpaired page's box text, printed whole.
// Ceiling: the calibrated line is not rendered here (no URL state sets an override); it is 91
// characters against the stored line's 117, and overviewReading.test.ts pins both.
import { spawn } from "node:child_process";
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
const PORT = 3931;
const base = LIVE ?? `http://127.0.0.1:${PORT}`;
const next = join(root, "node_modules/next/dist/bin/next");
const CHECKERS = [
  "check-holds-up-line.mjs",
  "check-verdict-phone.mjs",
  "check-verdict-landing.mjs",
  "check-open-card-position.mjs",
];
const SIZES = [
  [390, 664],
  [360, 560],
  [320, 568],
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

let problems = 0;
const note = (ok, line) => {
  if (!ok) problems += 1;
  console.log(`${ok ? "OK  " : "BAD "} ${line}`);
};

let server = null;
if (!LIVE) {
  for (const c of CHECKERS) {
    const code = await run(`RED-BEFORE ${c} (production, old words)`, join(root, "scripts", c), [PRODUCTION]);
    note(code !== 0, `red-before ${c} on production exit ${code} (must be non-zero)`);
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
  for (const c of CHECKERS) {
    const code = await run(`GREEN ${c} (${base})`, join(root, "scripts", c), [base]);
    note(code === 0, `${c} on ${base} exit ${code}`);
  }
  for (const [w, h] of SIZES) {
    const code = await run(`check-entry-folds ${w}x${h}`, join(root, "scripts/check-entry-folds.mjs"), [base, "--width", String(w), "--height", String(h)]);
    note(code === 0, `folds ${w}x${h} exit ${code}`);
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  try {
    console.log("\n--- LAYOUT: home caption and verdict line");
    for (const [w, h] of SIZES) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      await page.goto(`${base}/`, { waitUntil: "networkidle" });
      await page.waitForSelector("[data-glance-verdict]", { timeout: 20000 });
      const read = await page.evaluate(() => {
        const lines = (el) => {
          const range = document.createRange();
          range.selectNodeContents(el);
          const tops = new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top)));
          return tops.size;
        };
        const box = (el) => {
          const r = el.getBoundingClientRect();
          return { top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY) };
        };
        const cap = document.querySelector("#cycle-overview-title");
        const v = document.querySelector("[data-glance-verdict]");
        return {
          caption: cap?.textContent?.trim(),
          captionLines: cap ? lines(cap) : -1,
          verdict: v?.textContent?.trim(),
          verdictLines: v ? lines(v) : -1,
          verdictBox: v ? box(v) : null,
        };
      });
      const tag = `${w}x${h}`;
      console.log(`  ${tag} caption (${read.captionLines} line): ${JSON.stringify(read.caption)}`);
      console.log(`  ${tag} verdict (${read.verdictLines} lines, y ${read.verdictBox?.top}-${read.verdictBox?.bottom}): ${JSON.stringify(read.verdict)}`);
      note(read.captionLines === 1, `${tag} caption is one line`);
      // The 118-char budget is a 390x664 budget (two lines). At 360x560 and 320x568 production's
      // PRE-change line took three lines at y 547-601 (read 2026-11-19 before the deploy), so the
      // bar there is "no more lines than before", not two. (This runner first asserted two at
      // every size; that was the runner's error, not the page's.)
      const MAX = w === 390 ? 2 : 3;
      note(read.verdictLines > 0 && read.verdictLines <= MAX, `${tag} verdict line is ${read.verdictLines} line(s), at most ${MAX}`);
      if (w === 390) note((read.verdictBox?.bottom ?? Infinity) <= h, `${tag} verdict line ends at y=${read.verdictBox?.bottom}, on the first screen (${h})`);
      await page.close();
    }

    console.log("\n--- the unpaired page's box, whole");
    const page = await browser.newPage({ viewport: { width: 390, height: 664 } });
    await page.goto(`${base}/cycles/turchin-fathers-sons`, { waitUntil: "networkidle" });
    const boxText = await page.locator("#does-it-hold-up").innerText();
    console.log(boxText.split("\n").map((l) => `  | ${l}`).join("\n"));
    note(/No paired data series/i.test(boxText) && /none is a test of this cycle/.test(boxText), "unpaired box carries the new headline and the period paragraph");
    await page.close();
  } finally {
    await browser.close();
  }
} finally {
  if (server) {
    await stopTree(server.pid);
    console.log(`stopped server pid ${server.pid}`);
  }
}

console.log(`\nRESULT: ${problems === 0 ? "PASS" : "FAIL"} — ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
