import { describe, expect, it } from "vitest";
import { DEFAULT_YEAR_RANGE } from "./siteConfig";
import { formatRange, parseRange } from "./urlState";

const fallback = {
  start: DEFAULT_YEAR_RANGE.start,
  end: DEFAULT_YEAR_RANGE.end,
};

describe("parseRange", () => {
  it("uses the fallback when no range is present", () => {
    expect(parseRange(null, fallback)).toEqual({
      ...fallback,
      preset: null,
    });
  });

  it("resolves named presets", () => {
    expect(parseRange("modern", fallback)).toEqual({
      start: 1900,
      end: DEFAULT_YEAR_RANGE.end,
      preset: "modern",
    });
  });

  it("parses explicit start-end ranges", () => {
    expect(parseRange("1879-2026", fallback)).toEqual({
      start: 1879,
      end: 2026,
      preset: null,
    });
  });

  it("falls back for malformed or reversed ranges", () => {
    expect(parseRange("tomorrow", fallback)).toEqual({
      ...fallback,
      preset: null,
    });
    expect(parseRange("2050-1900", fallback)).toEqual({
      ...fallback,
      preset: null,
    });
  });
});

describe("formatRange", () => {
  it("omits the query value for the full default range", () => {
    expect(
      formatRange(
        DEFAULT_YEAR_RANGE.start,
        DEFAULT_YEAR_RANGE.end,
        DEFAULT_YEAR_RANGE.start,
        DEFAULT_YEAR_RANGE.end
      )
    ).toBeNull();
  });

  it("emits preset names when the range matches a preset", () => {
    expect(
      formatRange(
        1950,
        DEFAULT_YEAR_RANGE.end,
        DEFAULT_YEAR_RANGE.start,
        DEFAULT_YEAR_RANGE.end
      )
    ).toBe("living");
  });

  it("emits explicit start-end ranges otherwise", () => {
    expect(
      formatRange(
        1879,
        2026,
        DEFAULT_YEAR_RANGE.start,
        DEFAULT_YEAR_RANGE.end
      )
    ).toBe("1879-2026");
  });
});
