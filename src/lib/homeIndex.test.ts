import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";
import Home, { metadata as homeMeta } from "@/app/(app)/page";
import { cycles } from "@/data/cycles";
import { cycleRoutePath } from "@/lib/cycleRoutes";
import { homeTitle } from "@/lib/homeIndex";
import { SITE_URL } from "@/lib/siteConfig";

describe("home: one link per cycle page, and JSON-LD that lists the same pages", () => {
  // Inside the nuqs testing adapter, so Viz renders rather than throwing into the Suspense
  // fallback (Codex diff review of e675c56, LOW 3).
  // createElement, not JSX: vitest's include is `*.test.ts` only, so a .tsx test never runs.
  const html = renderToStaticMarkup(createElement(NuqsTestingAdapter, null, createElement(Home)));

  it("renders the chart, not the Suspense fallback", () => {
    expect(html).not.toContain('aria-busy="true"');
    // Positive too: deleting <Viz> outright would also pass the line above (Codex confirm of 1fc9ca0).
    expect(html).toContain('aria-label="Chart view"');
  });

  it("links every /cycles/<slug> page", () => {
    for (const c of cycles) expect(html).toContain(`href="${cycleRoutePath(c)}"`);
  });

  it("the EMITTED ItemList names exactly the rendered links, in the same order", () => {
    // Read the JSON-LD the page actually emits, not the helper's output (LOW 3).
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    expect(scripts.length).toBe(1);
    const ld = JSON.parse(scripts[0][1]) as { "@graph": { "@type": string }[] };
    const list = ld["@graph"].find((g) => g["@type"] === "ItemList") as unknown as {
      itemListElement: { url: string; name: string; position: number }[];
      numberOfItems: number;
    };
    // The rendered list under "One page per cycle", in page order.
    const start = html.indexOf('id="cycle-pages"');
    expect(start).toBeGreaterThan(-1);
    const section = html.slice(start, html.indexOf("</section>", start));
    const links = [...section.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((m) => ({
      url: `${SITE_URL}${m[1]}`,
      name: m[2].replace(/&amp;/g, "&").replace(/&#x27;/g, "'"),
    }));
    expect(links.length).toBe(cycles.length);
    expect(list.numberOfItems).toBe(links.length);
    expect(list.itemListElement.map((i) => ({ url: i.url, name: i.name }))).toEqual(links);
    expect(list.itemListElement.map((i) => i.position)).toEqual(links.map((_, i) => i + 1));
  });

  it("the title says what the page shows, counted from the data", () => {
    expect(homeMeta.title).toBe(homeTitle(cycles.length));
    expect(homeTitle(10)).toBe("Ten long-wave theories of history, one time axis");
    // The result shows about 60-70 characters; the root template adds " · Sinusoidal History".
    expect(`${homeMeta.title} · Sinusoidal History`.length).toBeLessThanOrEqual(70);
  });
});
