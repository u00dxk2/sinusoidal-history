// The calibrate slider shipped with shadcn's colour utilities (bg-muted, bg-primary, border-primary),
// but this site's theme defines none of those tokens — Tailwind v4 emitted them as transparent, so
// on production the track and the filled range were INVISIBLE and a reader saw a lone circle with
// nothing to slide along (journey-walk 2026-09-26). Pin that every colour utility the slider uses
// resolves to a --color-* token globals.css actually defines.
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");
const slider = readFileSync(path.join(root, "src/components/ui/slider.tsx"), "utf8");
const css = readFileSync(path.join(root, "src/app/globals.css"), "utf8");

const defined = new Set(
  [...css.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((m) => m[1]),
);
// Tailwind built-ins that need no theme token.
const builtin = new Set(["white", "black", "transparent", "current", "inherit"]);

function colourNames(src: string): string[] {
  const out: string[] = [];
  for (const m of src.matchAll(/\b(?:bg|border|ring|text|fill|stroke)-([a-z][a-z0-9-]*?)(?:\/\d+)?(?=[\s"'`\]])/g)) {
    const name = m[1];
    // width / style / size utilities, not colours
    if (/^(\d|x|y|t|b|l|r|solid|dashed|none|collapse|separate|opacity|offset|inset|xs|sm|md|lg|xl|2xl|left|right|center|justify|clip|origin|no-repeat|cover|contain)/.test(name)) continue;
    out.push(name);
  }
  return out;
}

describe("calibrate slider colours", () => {
  it("uses only colour tokens the theme defines (else Tailwind v4 renders them transparent)", () => {
    const names = colourNames(slider);
    expect(names.length).toBeGreaterThan(0);
    const missing = names.filter((n) => !builtin.has(n) && !defined.has(n));
    expect(missing).toEqual([]);
  });

  it("the positive control: a shadcn token this theme lacks IS caught", () => {
    const missing = colourNames('className="bg-muted"').filter((n) => !builtin.has(n) && !defined.has(n));
    expect(missing).toEqual(["muted"]);
  });

  it("names each thumb for assistive tech (aria-label on the Root does not reach the thumb)", () => {
    expect(slider).toMatch(/<SliderPrimitive\.Thumb[\s\S]*?aria-label=/);
  });
});
