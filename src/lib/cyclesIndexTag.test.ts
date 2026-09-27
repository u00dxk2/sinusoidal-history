// W-002 (2026-09-27): on a phone, the confidence tag on each /cycles entry (NARRATIVE,
// QUANTITATIVE …) read as a fact about the cycle, sat one line above "Paired data - …", and did
// nothing when touched; its definition was below all ten entries and the verdict table. The fix
// makes the tag a real link to #confidence-tags and says, there, that the tag grades the
// theorist's evidence while the paired series is this site's own comparison.
//
// These assertions run on the SERVER-RENDERED markup of the page, not its source, because the
// defect they guard is structural: an <a> nested in the entry's block <Link> is invalid HTML
// (browsers re-parent it), which is why the tag could not simply be wrapped in an anchor.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CyclesIndex from "@/app/(app)/cycles/page";
import CyclePage from "@/app/(app)/cycles/[id]/page";
import { cycles } from "@/data/cycles";

const html = renderToStaticMarkup(createElement(CyclesIndex));

// Walk the markup's <a> open/close tags and report the deepest nesting reached.
function maxAnchorDepth(markup: string): number {
  let depth = 0;
  let max = 0;
  for (const m of markup.matchAll(/<(\/?)a(?=[\s>])/g)) {
    depth += m[1] ? -1 : 1;
    max = Math.max(max, depth);
  }
  return max;
}

const tagLinks = [...html.matchAll(/<a[^>]*href="#confidence-tags"[^>]*>([^<]*)<\/a>/g)];

describe("/cycles confidence tag is a tappable link to its definition (W-002)", () => {
  it("renders one tag link per cycle, each pointing at #confidence-tags", () => {
    expect(tagLinks).toHaveLength(cycles.length);
  });

  it("the tag links carry the tag labels a reader sees", () => {
    const labels = tagLinks.map((m) => m[1]);
    expect(labels).toEqual(expect.arrayContaining(["Narrative", "Quantitative"]));
  });

  it("no anchor is nested inside another (the entry link and the tag link are siblings)", () => {
    expect(maxAnchorDepth(html)).toBe(1);
  });

  it("every entry still links to its own cycle page", () => {
    for (const c of cycles) {
      const slug = c.id.replace(/_/g, "-");
      expect(html).toContain(`href="/cycles/${slug}"`);
    }
  });

  it("the link target exists, and says the paired data is the site's comparison, not the tag's evidence", () => {
    expect(html).toMatch(/id="confidence-tags"/);
    const glossary = html.slice(html.indexOf('id="confidence-tags"'));
    expect(glossary).toMatch(/paired data series[^.]*this site added/);
  });

  it("positive control: the nesting walker does see a nested anchor", () => {
    expect(maxAnchorDepth('<a href="/x"><span><a href="#y">t</a></span></a>')).toBe(2);
  });
});

// Sibling of the same defect: each /cycles/<slug> masthead carried the same bare tag, with its
// definition at the foot of the page.
describe("/cycles/<slug> masthead tag links to the page's own classification (W-002 sibling)", () => {
  for (const c of cycles) {
    it(`${c.id}: masthead tag -> #confidence, which exists and names the paired data as the site's`, async () => {
      const element = await CyclePage({ params: Promise.resolve({ id: c.id.replace(/_/g, "-") }) });
      const page = renderToStaticMarkup(element);
      expect(page).toMatch(/<a[^>]*href="#confidence"[^>]*>[^<]+<\/a>/);
      expect(page).toMatch(/id="confidence"/);
      expect(page.slice(page.indexOf('id="confidence"'))).toMatch(/paired data series is\s+a separate comparison this site added/);
      expect(maxAnchorDepth(page)).toBe(1);
    });
  }
});
