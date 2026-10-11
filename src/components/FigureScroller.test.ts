// I-031 (2026-10-11): which edges of the spectral figure's scroller show a cue. At 900px the figure
// is 900 wide in a 704 window (headed read: overflow 196px on all nine pages); at lg+ it is drawn
// whole (no overflow), so nothing shows there.
import { describe, expect, it } from "vitest";
import { hiddenEdges } from "@/components/FigureScroller";

describe("hiddenEdges", () => {
  it("no overflow: no cue on either side (lg+, the figure drawn whole)", () => {
    expect(hiddenEdges(0, 900, 900)).toEqual({ left: false, right: false });
    expect(hiddenEdges(0, 900, 1096)).toEqual({ left: false, right: false });
  });

  it("on arrival at 900px: only the right side is cut", () => {
    expect(hiddenEdges(0, 900, 704)).toEqual({ left: false, right: true });
  });

  it("part way: both sides are cut", () => {
    expect(hiddenEdges(100, 900, 704)).toEqual({ left: true, right: true });
  });

  it("at the right end: only the left side is cut, including a sub-pixel stop", () => {
    expect(hiddenEdges(196, 900, 704)).toEqual({ left: true, right: false });
    expect(hiddenEdges(195.6, 900, 704)).toEqual({ left: true, right: false });
  });

  it("a one-pixel overflow is treated as none (rounding, not a hidden figure)", () => {
    expect(hiddenEdges(0, 705, 704)).toEqual({ left: false, right: false });
  });
});
