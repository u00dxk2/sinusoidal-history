import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "https://sinusoidalhistory.com";
const OUT_DIR = "screenshots";

async function snap(page, path, file) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  // Give CSV fetches and chart rendering a beat to settle.
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: `${OUT_DIR}/${file}`,
    fullPage: true,
  });
  console.log(`✓ ${file}  ←  ${path}`);
}

async function main() {
  const browser = await chromium.launch();

  // Desktop @ 1280×900
  {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await snap(page, "/", "01-home-desktop.png");
    await snap(page, "/?focus=turchin", "02-home-focus-turchin.png");
    await snap(page, "/?focus=dalio&range=modern", "03-home-focus-dalio-modern.png");
    await snap(page, "/poster", "04-poster.png");
    await snap(page, "/methods", "05-methods.png");
    await snap(page, "/about", "06-about.png");
    await snap(page, "/embed/docs", "07-embed-docs.png");
    await ctx.close();
  }

  // Mobile @ 390×844 (iPhone 14)
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await snap(page, "/", "10-home-mobile.png");
    await snap(page, "/?focus=turchin", "11-home-mobile-focus.png");
    await snap(page, "/poster", "12-poster-mobile.png");
    await ctx.close();
  }

  // Tight focus on the State-of-cycles panel + brush + facets, desktop
  {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    const summary = await page.locator("section[aria-label='State of the cycles summary']").first();
    if (await summary.count()) {
      await summary.screenshot({ path: `${OUT_DIR}/20-summary-panel.png` });
      console.log("✓ 20-summary-panel.png");
    }

    const brush = await page.locator("svg[aria-label*='Time range']").first();
    if (await brush.count()) {
      await brush.screenshot({ path: `${OUT_DIR}/21-brush.png` });
      console.log("✓ 21-brush.png");
    }

    await ctx.close();
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
