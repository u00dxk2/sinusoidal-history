// Every vendored shadcn primitive in src/components/ui/ arrived with shadcn's colour utilities
// (bg-muted, text-muted-foreground, bg-accent, ring-ring, bg-border, border-input …). This site's
// theme defines none of those tokens, and Tailwind v4 emits an undefined colour utility with no
// colour at all — so on production the Facets / Overlay / Calibrate tab strip had no background and
// the slider track was invisible (journey-walk 2026-09-26; the slider was fixed in 4652e29 and is
// pinned by sliderTokens.test.ts). This generalises that pin to EVERY file in ui/: each colour
// utility must name a --color-* token that globals.css actually defines.
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");
const uiDir = path.join(root, "src/components/ui");
const css = readFileSync(path.join(root, "src/app/globals.css"), "utf8");

const defined = new Set([...css.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((m) => m[1]));
// Tailwind built-ins that need no theme token.
const builtin = new Set(["white", "black", "transparent", "current", "inherit"]);

// Non-colour utilities that share a colour prefix: widths, sides, sizes, alignment, wrapping.
const SIDE = /^(x|y|t|b|l|r|s|e)(-|$)/;
const NON_COLOUR = new Set([
  "solid", "dashed", "dotted", "double", "none", "hidden", "collapse", "separate",
  "xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl",
  "left", "right", "center", "justify", "start", "end",
  "balance", "wrap", "nowrap", "pretty", "clip", "ellipsis",
  "inset", "offset", "no-repeat", "cover", "contain", "origin",
]);

function colourNames(src: string): string[] {
  const out: string[] = [];
  const re = /(?<![\w-])(?:bg|border|ring|text|fill|stroke|outline)-([a-z][a-z0-9-]*?)(?:\/\d+)?(?=[\s"'`\]])/g;
  for (const m of src.matchAll(re)) {
    let name = m[1];
    // border-l-foo / border-t-foo: the side prefix is not part of the token
    const side = name.match(/^(?:x|y|t|b|l|r|s|e)-(.+)$/);
    if (side && m[0].startsWith("border-")) name = side[1];
    else if (SIDE.test(name)) continue;
    if (/^\d/.test(name) || NON_COLOUR.has(name)) continue;
    if (/^offset-/.test(name)) continue;
    out.push(name);
  }
  return out;
}

const files = readdirSync(uiDir).filter((f) => f.endsWith(".tsx"));

describe("ui/* colour utilities resolve to theme tokens", () => {
  it("finds the vendored primitives", () => {
    expect(files).toEqual(expect.arrayContaining(["tabs.tsx", "toggle.tsx", "scroll-area.tsx", "slider.tsx"]));
  });

  for (const f of files) {
    it(`${f} uses only colour tokens globals.css defines (else Tailwind v4 renders them transparent)`, () => {
      const src = readFileSync(path.join(uiDir, f), "utf8");
      const missing = [...new Set(colourNames(src).filter((n) => !builtin.has(n) && !defined.has(n)))];
      expect(missing).toEqual([]);
    });
  }

  it("the chart's tab strip carries an accessible name (its triggers are named by their text)", () => {
    const viz = readFileSync(path.join(root, "src/components/Viz.tsx"), "utf8");
    expect(viz).toMatch(/<TabsList[^>]*aria-label="[^"]+"/);
  });

  it("positive control: undefined shadcn tokens ARE caught, width/size utilities are not", () => {
    const src = 'className="bg-muted text-muted-foreground ring-ring/50 border-l-input border border-l text-sm text-balance ring-[3px] outline-none bg-ink"';
    expect(colourNames(src)).toEqual(["muted", "muted-foreground", "ring", "input", "ink"]);
  });
});
