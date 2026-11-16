// The expanded facet (the Facets tab's focused card AND the Calibrate tab) renders its Calibrate
// controls before the rationale, in the DOM. On 2026-11-16 the Facets tab's focused card put a
// screen of text between the chart and its sliders on a phone (686-1071px, production); only the
// Calibrate tab had the controls-first order. This pins the source shape; the live geometry is
// scripts/check-focused-calibrate.mjs. Red arm: the prior tree's `controlsFirst ? controls : about`
// fails both legs.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const facet = readFileSync(resolve(__dirname, "../components/CycleFacet.tsx"), "utf8");
const tail = facet.slice(facet.indexOf("function ExpandedTail"), facet.indexOf("function SliderRow"));

describe("expanded facet: Calibrate before the rationale", () => {
  it("found the ExpandedTail body", () => {
    expect(tail.length).toBeGreaterThan(200);
    expect(tail).toContain("const controls =");
    expect(tail).toContain("const about =");
  });

  it("renders {controls} then {about}, unconditionally, in the returned grid", () => {
    const ret = tail.slice(tail.lastIndexOf("return ("));
    const c = ret.indexOf("{controls}");
    const a = ret.indexOf("{about}");
    expect(c).toBeGreaterThan(-1);
    expect(a).toBeGreaterThan(c);
    expect(ret).not.toMatch(/\?\s*(controls|about)\b/);
  });

  it("has no switch that could put the rationale first again", () => {
    expect(facet).not.toContain("controlsFirst");
    expect(facet).not.toMatch(/\border-(first|last|\d)\b/);
  });
});
