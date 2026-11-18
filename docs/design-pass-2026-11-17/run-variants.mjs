// Design pass 2026-11-17, admit 2: everything the blind pick needs, in ONE heavy-gate run.
//
//   node docs/design-pass-2026-11-17/run-variants.mjs
//
// Steps, stopping at the first failure:
//   1. typecheck (tsconfig.test.json), eslint on the pass's files, the targeted tests
//   2. `next build` with DESIGN_PASS_PREVIEW=1 and NO variant flag: `/` is today's site and
//      /design-pass/a|b|c are the three first screens
//   3. `next start` on an odd port, frame each variant at 1440x900 and 390x844, and frame `/`
//      as the control
//   4. separability: on a 390 phone screen, each variant must show the glance caption, the
//      height label and the verdict line with the same text as the control `/`
//   5. stop the server it started, by its own PID
//
// Output: docs/design-pass-2026-11-17/variants/*.png and a RESULT line.
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const PORT = 3927;
const base = `http://127.0.0.1:${PORT}`;
const outDir = join(here, "variants");

function run(label, script, args, env = {}) {
  return new Promise((done) => {
    console.log(`\n--- ${label}`);
    const child = spawn(process.execPath, [join(root, script), ...args], {
      cwd: root,
      env: { ...process.env, ...env },
      stdio: "inherit",
    });
    child.on("exit", (code) => done(code ?? 1));
  });
}

function stopTree(pid) {
  return new Promise((done) => {
    const killer = spawn("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
    killer.on("exit", () => done());
    killer.on("error", () => done());
  });
}

async function waitForServer(ms) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    try {
      const res = await fetch(`${base}/`);
      if (res.ok) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

const PASS_FILES = [
  "src/lib/designPass.ts",
  "src/lib/designPassCopy.ts",
  "src/lib/designPassFonts.ts",
  "src/components/DesignPassMasthead.tsx",
  "src/app/(app)/page.tsx",
  "src/app/(app)/design-pass/[variant]/page.tsx",
  "src/app/(app)/cycles/[id]/page.tsx",
  "src/app/layout.tsx",
  "src/app/error.tsx",
  "src/app/not-found.tsx",
  "docs/design-pass-2026-11-17/run-variants.mjs",
  "docs/design-pass-2026-11-17/capture-frames.mjs",
];
const TESTS = [
  "src/lib/phoneDek.test.ts",
  "src/lib/holdsUp.test.ts",
  "src/lib/testedSeries.test.ts",
  "src/lib/siteConfig.test.ts",
  "src/lib/seriesOverlay.test.ts",
  "src/lib/countWords.test.ts",
];

// The flag must be OFF for this build: `/` is the control.
const buildEnv = { DESIGN_PASS_PREVIEW: "1", NEXT_PUBLIC_DESIGN_PASS_VARIANT: "" };

let failed = "";
if (await run("typecheck", "node_modules/typescript/bin/tsc", ["--noEmit", "-p", "tsconfig.test.json"])) failed = "typecheck";
if (!failed && (await run("eslint", "node_modules/eslint/bin/eslint.js", PASS_FILES))) failed = "eslint";
if (!failed && (await run("vitest (targeted)", "node_modules/vitest/vitest.mjs", ["run", ...TESTS]))) failed = "vitest";
if (!failed && (await run("next build (preview)", "node_modules/next/dist/bin/next", ["build"], buildEnv))) failed = "build";

if (failed) {
  console.log(`\nRESULT: FAIL — stopped at ${failed}; no frames taken`);
  process.exit(1);
}

console.log("\n--- next start");
const server = spawn(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "start", "-p", String(PORT), "-H", "127.0.0.1"], {
  cwd: root,
  env: { ...process.env, ...buildEnv },
  stdio: "ignore",
});
let problems = 0;
try {
  if (!(await waitForServer(60000))) {
    console.log("RESULT: FAIL — the local server did not answer within 60s");
    process.exitCode = 1;
  } else {
    mkdirSync(outDir, { recursive: true });
    const SIZES = [
      { name: "1440", width: 1440, height: 900, scale: 1 },
      { name: "390", width: 390, height: 844, scale: 2 },
    ];
    const PAGES = [
      { name: "control", path: "/" },
      { name: "a", path: "/design-pass/a" },
      { name: "b", path: "/design-pass/b" },
      { name: "c", path: "/design-pass/c" },
    ];
    // The three phone lines the I-077 / I-078 reads judge. Compared case-insensitively: the
    // caption is uppercased by CSS, which innerText applies.
    const probe = () => {
      const text = (document.querySelector("main")?.innerText ?? "").split("\n").map((l) => l.trim());
      const find = (re) => text.find((l) => re.test(l)) ?? null;
      return {
        caption: find(/no cycle confirmed|theory shapes, not findings/i),
        height: find(/^height: shape, not size$/i),
        verdict: find(/^None is confirmed:/i),
        h1: document.querySelector("h1")?.innerText ?? null,
        scrollWidth: document.documentElement.scrollWidth,
      };
    };
    const browser = await chromium.launch();
    try {
      const phone = {};
      for (const size of SIZES) {
        const context = await browser.newContext({
          viewport: { width: size.width, height: size.height },
          deviceScaleFactor: size.scale,
        });
        const page = await context.newPage();
        for (const target of PAGES) {
          const res = await page.goto(`${base}${target.path}`, { waitUntil: "networkidle", timeout: 60000 });
          await page.waitForTimeout(800);
          await page.screenshot({ path: join(outDir, `${target.name}-${size.name}.png`), fullPage: false });
          const read = await page.evaluate(probe);
          console.log(`OK   ${target.name}-${size.name}.png (HTTP ${res?.status() ?? "?"}) h1=${JSON.stringify(read.h1)} scrollWidth=${read.scrollWidth}`);
          if (res?.status() !== 200) problems += 1;
          if (read.scrollWidth > size.width) {
            problems += 1;
            console.log(`BAD  ${target.name}-${size.name}: horizontal overflow, scrollWidth ${read.scrollWidth} > ${size.width}`);
          }
          if (size.name === "390") phone[target.name] = read;
        }
        await context.close();
      }
      console.log("\n--- separability at 390 (each variant against the control `/`)");
      const control = phone.control;
      console.log(`control: caption=${JSON.stringify(control.caption)} height=${JSON.stringify(control.height)} verdict=${JSON.stringify(control.verdict)}`);
      for (const key of ["caption", "height", "verdict"]) {
        if (!control[key]) {
          problems += 1;
          console.log(`BAD  control has no ${key} line: the probe cannot judge it`);
        }
      }
      for (const name of ["a", "b", "c"]) {
        for (const key of ["caption", "height", "verdict"]) {
          const same = control[key] !== null && phone[name][key] === control[key];
          if (!same) problems += 1;
          console.log(`${same ? "SAME" : "DIFF"} ${name}.${key}${same ? "" : ` -> ${JSON.stringify(phone[name][key])}`}`);
        }
      }
    } finally {
      await browser.close();
    }
    console.log(`\nRESULT: ${problems === 0 ? "PASS" : "FAIL"} — 8 frames in ${outDir}; ${problems} problem(s)`);
    process.exitCode = problems === 0 ? 0 : 1;
  }
} finally {
  if (server.pid) await stopTree(server.pid);
  console.log(`server pid ${server.pid} stopped (taskkill /T on the PID this script started)`);
}
