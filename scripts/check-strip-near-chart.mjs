// Can a phone reader see the ten overview rows and the zoom strip on one screen? (I-066)
//
// The strip zooms the chart. Until I-066 it sat after all ten facet rows, ~2,400px below the
// phone overview figure it narrows, so a reader who dragged it never saw the chart change
// (cold walks 2026-10-22 and 2026-10-24). This reads, on the home page, every overview row's box
// and the strip plus the status line under it, and asks how many rows share a screen with them.
//
//   node scripts/check-strip-near-chart.mjs [origin] [--width N] [--height N] [--expect-rows N]
//   node scripts/check-strip-near-chart.mjs --selftest
//
// origin defaults to https://sinusoidalhistory.com; the viewport to 390x664. --expect-rows
// declares a size's ceiling (320x568 cannot fit all ten rows and the strip): the run passes when
// at least that many rows share the screen. Exit 0 all rows (or the declared count) share it ·
// 1 fewer do · 2 the rows or the strip are missing or hidden. PHONE layout only: at 640px and
// up the overview is hidden by design and the run reads HIDDEN.
// NOT read: whether the reader scrolls to that position (the cold walk asks), and touch on iOS.

// How many rows share one screen with the strip block. Boxes are absolute page y. A row counts
// when it is wholly inside the best screen-tall window that also holds the whole strip block.
export function together(rows, strip, height) {
  if (!rows?.length || !strip) return { state: "MISSING" };
  if (strip.hidden || rows.some((r) => r.hidden)) return { state: "HIDDEN" };
  const top = Math.min(strip.top, ...rows.map((r) => r.top));
  const bottom = Math.max(strip.bottom, ...rows.map((r) => r.bottom));
  if (bottom - top <= height) return { state: "TOGETHER", rows: rows.length, of: rows.length, spare: height - (bottom - top) };
  // Too tall for one screen: pin the window to the strip on the side the rows are on.
  const below = strip.top >= Math.min(...rows.map((r) => r.top));
  const [lo, hi] = below ? [strip.bottom - height, strip.bottom] : [strip.top, strip.top + height];
  const n = rows.filter((r) => r.top >= lo && r.bottom <= hi).length;
  return { state: n > 0 ? "PARTIAL" : "APART", rows: n, of: rows.length, gap: below ? strip.top - Math.max(...rows.map((r) => r.bottom)) : Math.min(...rows.map((r) => r.top)) - strip.bottom };
}

export function exitFor(v, expectRows) {
  if (v.state === "MISSING" || v.state === "HIDDEN") return 2;
  if (v.state === "TOGETHER") return 0;
  if (v.state === "APART") return 1;
  return expectRows != null && v.rows >= expectRows ? 0 : 1;
}

function selftest() {
  const ten = (y0) => Array.from({ length: 10 }, (_, i) => ({ top: y0 + i * 24, bottom: y0 + i * 24 + 24 }));
  const near = together(ten(352), { top: 808, bottom: 906 }, 664);
  const far = together(ten(352), { top: 3095, bottom: 3193 }, 664);
  const tight = together(ten(316), { top: 838, bottom: 936 }, 568);
  const checks = [
    ["rows and strip inside one screen are TOGETHER, all ten", near.state === "TOGETHER" && near.rows === 10 && near.spare === 664 - (906 - 352)],
    // The red arms: the production layout before I-066, and a size too short for both.
    ["the strip ~2,500px under the rows is APART, 0 rows", far.state === "APART" && far.rows === 0 && far.gap === 3095 - 592],
    // Window 936-568 = 368: rows whose top is at or below 368 are i = 3..9.
    ["a screen too short for all ten is PARTIAL with the rows that fit", tight.state === "PARTIAL" && tight.rows === 7],
    ["APART exits 1", exitFor(far) === 1],
    ["PARTIAL exits 1 with no declared ceiling", exitFor(tight) === 1],
    ["PARTIAL at or over a declared ceiling exits 0", exitFor(tight, 7) === 0 && exitFor(tight, 8) === 1],
    ["a declared ceiling never rescues APART", exitFor(far, 0) === 1],
    ["missing rows are MISSING and exit 2", together([], { top: 0, bottom: 1 }, 664).state === "MISSING" && exitFor(together([], null, 664)) === 2],
    ["a hidden strip is HIDDEN and exits 2", exitFor(together(ten(0), { top: 0, bottom: 0, hidden: true }, 664)) === 2],
    // Window 100-600: rows at 500, 524, 548, 572 fit.
    ["a strip above the rows is judged too", together(ten(500), { top: 100, bottom: 200 }, 500).rows === 4],
  ];
  for (const [name, ok] of checks) console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  const failed = checks.filter(([, ok]) => !ok).length;
  console.log(failed ? `selftest: ${failed} FAILED` : `selftest: ${checks.length} passed`);
  return failed ? 1 : 0;
}

function flag(args, name, fallback) {
  const i = args.indexOf(name);
  return i === -1 ? fallback : Number(args[i + 1]);
}

async function run(args) {
  const origin = (args.find((a) => !a.startsWith("--") && !/^\d+$/.test(a)) ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
  const width = flag(args, "--width", 390);
  const height = flag(args, "--height", 664);
  const expectRows = args.includes("--expect-rows") ? flag(args, "--expect-rows") : null;
  // Loaded here, not at the top, so --selftest runs where no browser is installed.
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, isMobile: true, hasTouch: true });
  await page.goto(origin + "/", { waitUntil: "networkidle" });
  const boxes = await page.evaluate(() => {
    const box = (el) => {
      const r = el.getBoundingClientRect();
      const visible = el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
      return { top: Math.round(r.top + window.scrollY), bottom: Math.round(r.bottom + window.scrollY), hidden: !visible || r.width === 0 || r.height === 0 };
    };
    const rows = [...document.querySelectorAll("[data-overview-id]")].map(box);
    const svg = document.querySelector('svg[aria-label^="Time range selector"]');
    if (!svg) return { rows, strip: null };
    // The strip's box, then the status line under it (the sentence that says what a drag did).
    const s = box(svg);
    const line = svg.parentElement?.nextElementSibling;
    return { rows, strip: line ? { ...s, bottom: Math.max(s.bottom, box(line).bottom) } : s };
  });
  await browser.close();
  const v = together(boxes.rows, boxes.strip, height);
  const exit = exitFor(v, expectRows);
  const detail =
    v.state === "TOGETHER" ? `all ${v.of} rows and the strip on one screen, ${v.spare}px spare`
    : v.state === "PARTIAL" || v.state === "APART" ? `${v.rows} of ${v.of} rows share a screen with the strip; ${v.gap}px between the rows and the strip`
    : v.state === "HIDDEN" ? "the overview rows or the strip render zero-size (desktop layout?)"
    : "no overview rows or no strip on the page";
  const ceiling = expectRows != null ? ` (declared ceiling: ${expectRows} rows)` : "";
  console.log(`${origin}/ @ ${width}x${height}: ${v.state} — ${detail}${ceiling}`);
  console.log(exit === 0 ? "RESULT: PASS" : `RESULT: RED (exit ${exit})`);
  return exit;
}

const args = process.argv.slice(2);
process.exit(args.includes("--selftest") ? selftest() : await run(args));
