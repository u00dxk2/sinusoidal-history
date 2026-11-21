import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home, { metadata as homeMeta } from "@/app/(app)/page";
import { cycles } from "@/data/cycles";
import { cycleRoutePath } from "@/lib/cycleRoutes";
import { homeJsonLd, homeTitle } from "@/lib/homeIndex";
import { SITE_URL } from "@/lib/siteConfig";

describe("home: one link per cycle page, and JSON-LD that lists the same pages", () => {
  const html = renderToStaticMarkup(Home());

  it("links every /cycles/<slug> page", () => {
    for (const c of cycles) expect(html).toContain(`href="${cycleRoutePath(c)}"`);
  });

  it("the ItemList names exactly those pages, in the same order", () => {
    const ld = homeJsonLd(cycles);
    const list = ld["@graph"].find((g) => g["@type"] === "ItemList") as {
      itemListElement: { url: string; position: number }[];
      numberOfItems: number;
    };
    expect(list.numberOfItems).toBe(cycles.length);
    expect(list.itemListElement.map((i) => i.url)).toEqual(cycles.map((c) => `${SITE_URL}${cycleRoutePath(c)}`));
    expect(html).toContain('type="application/ld+json"');
  });

  it("the title says what the page shows, counted from the data", () => {
    expect(homeMeta.title).toBe(homeTitle(cycles.length));
    expect(homeTitle(10)).toBe("Ten long-wave theories of history, one time axis");
    // The result shows about 60-70 characters; the root template adds " · Sinusoidal History".
    expect(`${homeMeta.title} · Sinusoidal History`.length).toBeLessThanOrEqual(70);
  });
});
