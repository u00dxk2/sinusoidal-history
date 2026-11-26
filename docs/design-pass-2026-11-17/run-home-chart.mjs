// I-087, the home chart batch (2026-11-26): every check for moving `Viz` into the design pass,
// in ONE heavy-gate admit per tree.
//
//   node docs/design-pass-2026-11-17/run-home-chart.mjs --tag before         local: build + serve + measure
//   node docs/design-pass-2026-11-17/run-home-chart.mjs --tag after          same, on the changed tree
//   node docs/design-pass-2026-11-17/run-home-chart.mjs --tag live --live <origin>   no build
//   node docs/design-pass-2026-11-17/run-home-chart.mjs --compare before after       no browser
//   node docs/design-pass-2026-11-17/run-home-chart.mjs --tag off --flag-off         flag-off build
//
// What a measure run writes, to tmp/home-chart-<tag>.json, for each viewport (320x568, 360x560,
// 390x664, 1280x900) and URL (/, /?tab=calibrate, /?focus=dalio):
// - text: every non-empty text node under the chart root, by textContent (NOT innerText, which
//   applies text-transform: dropping `uppercase` would change innerText while no word changed),
//   as a sorted multiset. sr-only text is included.
// - faces: for every element that draws text of its own (SVG text too), its computed first
//   family, weight, style and text-transform.
// - clipped: elements whose content is wider than their box (truncate / overflow hidden).
// - the four budgeted phone lines (caption, height label, verdict line, cluster line): box,
//   bottom y, line count.
// - tabular figures: font-variant-numeric on the year ticks, and the width of "1111" against
//   "0000" set in the tick's own computed font. Equal widths = tabular digits in the face.
// The chart root is found the same way on both trees: the closest `.flex.flex-col.gap-5` above
// the "Chart view" tab list (Viz's own root), so the before tree needs no new attribute.
//
// --compare reads two of those files and prints: text multiset identical per key (BAD if not),
// faces after (with the flag on, every text element must be on dpDisplay or dpText, upright: BAD
// if not), newly clipped elements (BAD), budget lines that gained a line (BAD), tabular digits.
// The check-entry-folds and check-strip-near-chart reads run inside every measure run.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : null;
};
const PORT = 3929;
const next = join(root, "node_modules/next/dist/bin/next");
const outFile = (tag) => join(root, `tmp/home-chart-${tag}.json`);
const VIEWPORTS = [
  [320, 568],
  [360, 560],
  [390, 664],
  [1280, 900],
];
const URLS = ["/", "/?tab=calibrate", "/?focus=dalio"];

let problems = 0;
const note = (ok, line) => {
  if (!ok) problems += 1;
  console.log(`${ok ? "OK  " : "BAD "} ${line}`);
};

// ---------------------------------------------------------------- compare (no browser)
if (process.argv.includes("--compare")) {
  const i = process.argv.indexOf("--compare");
  const [a, b] = [process.argv[i + 1], process.argv[i + 2]];
  const A = JSON.parse(readFileSync(outFile(a), "utf8"));
  const B = JSON.parse(readFileSync(outFile(b), "utf8"));
  console.log(`compare ${a} (${A.builtAt}) -> ${b} (${B.builtAt})`);
  const faceKinds = {};
  for (const key of Object.keys(A.pages)) {
    const pa = A.pages[key];
    const pb = B.pages[key];
    if (!pb) {
      note(false, `${key}: missing in ${b}`);
      continue;
    }
    if (pa.error || pb.error) {
      note(false, `${key}: ${pa.error ?? ""} ${pb.error ?? ""}`);
      continue;
    }
    const same = JSON.stringify(pa.text) === JSON.stringify(pb.text);
    note(same, `${key}: text multiset ${pa.text.length} -> ${pb.text.length} line(s), ${same ? "identical" : "DIFFERENT"}`);
    if (!same) {
      const count = (xs) => xs.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map());
      const ca = count(pa.text);
      const cb = count(pb.text);
      const keys = new Set([...ca.keys(), ...cb.keys()]);
      let shown = 0;
      for (const k of keys) {
        if ((ca.get(k) ?? 0) !== (cb.get(k) ?? 0) && shown < 8) {
          console.log(`     ${ca.get(k) ?? 0} -> ${cb.get(k) ?? 0}  ${JSON.stringify(k.slice(0, 80))}`);
          shown += 1;
        }
      }
    }
    if (B.flagOn) {
      const off = pb.faces.filter((f) => !/dpDisplay|dpText/.test(f.family) || f.style !== "normal" || f.transform === "uppercase" || f.loaded !== true);
      note(off.length === 0, `${key}: ${pb.faces.length} text element(s), ${off.length} off the pass faces (or italic / uppercase / no loaded face matching family+weight+style)`);
      for (const f of off.slice(0, 5)) console.log(`     ${f.tag}: ${f.family} ${f.weight} ${f.style} ${f.transform} loaded=${f.loaded} — "${f.text}"`);
    }
    for (const f of pb.faces) {
      const k = `${f.family} ${f.weight} ${f.style}`;
      faceKinds[k] = (faceKinds[k] ?? 0) + 1;
    }
    const wasClipped = new Set(pa.clipped.map((c) => c.text));
    const newly = pb.clipped.filter((c) => !wasClipped.has(c.text));
    note(newly.length === 0, `${key}: ${pb.clipped.length} clipped (${pa.clipped.length} before), ${newly.length} newly clipped`);
    for (const c of newly.slice(0, 5)) console.log(`     ${c.scroll}px in ${c.client}px — "${c.text}"`);
    for (const [name, la] of Object.entries(pa.budget)) {
      const lb = pb.budget[name];
      if (!la || !lb) continue;
      const ok = lb.lines <= la.lines && !lb.overflow;
      note(ok, `${key}: ${name} ${la.lines} -> ${lb.lines} line(s), bottom ${la.bottom} -> ${lb.bottom}, width ${la.scroll}/${la.client} -> ${lb.scroll}/${lb.client}`);
    }
    if (pb.tnum) console.log(`     ticks: font-variant-numeric "${pb.tnum.variant}", "1111" ${pb.tnum.ones}px vs "0000" ${pb.tnum.zeros}px (${pb.tnum.family})`);
  }
  console.log(`\n--- what the text elements resolve to in ${b} (all keys)`);
  for (const [k, n] of Object.entries(faceKinds)) console.log(`  ${k} ×${n}`);
  for (const [tag, F] of [[a, A], [b, B]]) {
    for (const [k, v] of Object.entries(F.gates)) console.log(`  ${tag} ${k}: exit ${v}`);
  }
  for (const [k, v] of Object.entries(B.gates)) note(v === 0, `${b} ${k} exit ${v}`);
  console.log(`\nRESULT: ${problems === 0 ? "PASS" : "FAIL"} — ${problems} problem(s)`);
  process.exit(problems === 0 ? 0 : 1);
}

// ---------------------------------------------------------------- measure
const TAG = arg("--tag");
if (!TAG) {
  console.log("RESULT: FAIL — --tag <name> is required");
  process.exit(2);
}
const LIVE = arg("--live");
const FLAG_ON = !process.argv.includes("--flag-off");
const base = LIVE ?? `http://127.0.0.1:${PORT}`;

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

let server = null;
if (!LIVE) {
  const env = { NEXT_PUBLIC_DESIGN_PASS_VARIANT: FLAG_ON ? "a" : "off" };
  if (await run(`next build (flag ${FLAG_ON ? "ON, a" : "OFF"})`, next, ["build"], env)) {
    console.log("RESULT: FAIL — the build failed");
    process.exit(1);
  }
  server = await serve(env);
  if (!server) {
    console.log("RESULT: FAIL — the server did not answer");
    process.exit(1);
  }
  console.log(`server pid ${server.pid}`);
}
console.log(`\nmeasuring ${base} (${LIVE ? "live, no build" : `local build, flag ${FLAG_ON ? "on" : "off"}`})`);

const result = { tag: TAG, base, flagOn: FLAG_ON, builtAt: new Date().toISOString(), pages: {}, gates: {} };
try {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  try {
    for (const [w, h] of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      for (const url of URLS) {
        const key = `${w}x${h} ${url}`;
        await page.goto(`${base}${url}`, { waitUntil: "networkidle" });
        try {
          await page.waitForSelector(w < 640 ? "[data-overview-id] svg path" : "[data-facet-id] svg", { timeout: 20000 });
        } catch {
          result.pages[key] = { error: "the chart did not render" };
          continue;
        }
        result.pages[key] = await page.evaluate(async () => {
          await document.fonts.ready;
          const tabs = document.querySelector('[role="tablist"][aria-label="Chart view"]');
          const chart = tabs?.closest(".flex.flex-col.gap-5");
          if (!chart) return { error: "no chart root" };
          const walker = document.createTreeWalker(chart, NodeFilter.SHOW_TEXT);
          const text = [];
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            const t = n.textContent.replace(/\s+/g, " ").trim();
            if (t) text.push(t);
          }
          text.sort();
          const visible = (el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          };
          const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
          const els = [...chart.querySelectorAll("*")].filter((el) => ownText(el) && visible(el) && !el.closest(".sr-only"));
          const loadedFaces = [...document.fonts]
            .filter((f) => f.status === "loaded")
            .map((f) => `${f.family.replace(/["']/g, "")}|${f.weight}|${f.style}`);
          const faces = els.map((el) => {
            const cs = getComputedStyle(el);
            const family = cs.fontFamily.split(",")[0].trim().replace(/["']/g, "");
            return {
              tag: el.tagName.toLowerCase(),
              family,
              loaded: loadedFaces.includes(`${family}|${cs.fontWeight}|${cs.fontStyle}`),
              weight: cs.fontWeight,
              style: cs.fontStyle,
              transform: cs.textTransform,
              text: el.textContent.trim().slice(0, 40),
            };
          });
          const clipped = [...chart.querySelectorAll("*")]
            .filter((el) => el instanceof HTMLElement && visible(el) && !el.closest(".sr-only") && !el.classList.contains("sr-only"))
            .filter((el) => {
              const cs = getComputedStyle(el);
              return (cs.overflowX !== "visible" || cs.textOverflow === "ellipsis") && el.scrollWidth > el.clientWidth + 1 && el.textContent.trim();
            })
            .filter((el) => !el.querySelector("svg"))
            .map((el) => ({ scroll: el.scrollWidth, client: el.clientWidth, text: el.textContent.trim().slice(0, 60) }));
          const budget = {};
          for (const [name, sel] of [
            ["caption", "#cycle-overview-title"],
            ["height label", "[data-glance-height-label] > span[aria-hidden]"],
            ["verdict line", "[data-glance-verdict]"],
            ["cluster line", "[data-glance-cluster]"],
          ]) {
            const el = document.querySelector(sel);
            if (!el || !visible(el)) continue;
            const r = el.getBoundingClientRect();
            const lh = parseFloat(getComputedStyle(el).lineHeight) || r.height;
            const holder = el.closest("[data-glance-height-label]") ?? el;
            budget[name] = {
              lines: Math.round(r.height / lh),
              bottom: Math.round(r.bottom + window.scrollY),
              scroll: holder.scrollWidth,
              client: holder.clientWidth,
              overflow: holder.scrollWidth > holder.clientWidth + 1,
            };
          }
          let tnum = null;
          const tick = chart.querySelector("[data-glance-height-label] + div span") ?? chart.querySelector("svg text");
          if (tick) {
            const cs = getComputedStyle(tick);
            const probe = (s) => {
              const span = document.createElement("span");
              span.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-family:${cs.fontFamily};font-size:${cs.fontSize};font-weight:${cs.fontWeight};font-feature-settings:${cs.fontFeatureSettings};font-variant-numeric:${cs.fontVariantNumeric};letter-spacing:${cs.letterSpacing}`;
              span.textContent = s;
              document.body.appendChild(span);
              const width = span.getBoundingClientRect().width;
              span.remove();
              return Math.round(width * 100) / 100;
            };
            tnum = {
              family: cs.fontFamily.split(",")[0].trim(),
              variant: cs.fontVariantNumeric,
              ones: probe("1111"),
              zeros: probe("0000"),
            };
          }
          return { text, faces, clipped, budget, tnum };
        });
        const p = result.pages[key];
        console.log(`  ${key}: ${p.error ?? `${p.text.length} text line(s), ${p.faces.length} text element(s), ${p.clipped.length} clipped`}`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  for (const [w, h] of [[320, 568], [360, 560], [390, 664]]) {
    result.gates[`check-entry-folds ${w}x${h}`] = await run(
      `check-entry-folds ${w}x${h}`,
      join(root, "scripts/check-entry-folds.mjs"),
      [base, "--width", String(w), "--height", String(h)],
    );
  }
  for (const [w, h, extra] of [[390, 664, []], [360, 560, []], [320, 568, ["--expect-rows", "8"]]]) {
    result.gates[`check-strip-near-chart ${w}x${h}`] = await run(
      `check-strip-near-chart ${w}x${h}`,
      join(root, "scripts/check-strip-near-chart.mjs"),
      [base, "--width", String(w), "--height", String(h), ...extra],
    );
  }
} finally {
  if (server) {
    await stopTree(server.pid);
    console.log(`server pid ${server.pid} stopped`);
  }
}
writeFileSync(outFile(TAG), JSON.stringify(result, null, 1));
console.log(`\nwrote ${outFile(TAG)}`);
for (const [k, v] of Object.entries(result.gates)) note(v === 0, `${k} exit ${v}`);
for (const [k, p] of Object.entries(result.pages)) if (p.error) note(false, `${k}: ${p.error}`);
console.log(`\nRESULT: ${problems === 0 ? "PASS" : "FAIL"} — ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
