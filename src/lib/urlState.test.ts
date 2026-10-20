import { describe, expect, it } from "vitest";
import { DEFAULT_YEAR_RANGE, MIN_VISIBLE_SPAN } from "./siteConfig";
import { formatRange, parseRange, widenToMinSpan } from "./urlState";

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
    expect(parseRange("1850-2026", fallback)).toEqual({
      start: 1850,
      end: 2026,
      preset: null,
    });
  });

  // I-060: a hand-written short window is widened like a short drag.
  it("widens an explicit range shorter than MIN_VISIBLE_SPAN", () => {
    expect(parseRange("2000-2050", fallback)).toEqual({
      start: 1900,
      end: 2050,
      preset: null,
    });
  });

  // SIN-R2 (Astra review 2026-10-05): `in` accepted inherited names, so
  // `?range=constructor` gave undefined bounds and blanked the facets.
  it.each(["constructor", "toString", "__proto__", "hasOwnProperty"])(
    "does not take inherited name %s as a preset",
    (name) => {
      expect(parseRange(name, fallback)).toEqual({ ...fallback, preset: null });
    }
  );

  // I-060: the short presets were removed, so an old `?range=now` link opens the full range.
  it.each(["now", "living"])("falls back for the removed preset %s", (name) => {
    expect(parseRange(name, fallback)).toEqual({ ...fallback, preset: null });
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

describe("widenToMinSpan", () => {
  const { start: fs, end: fe } = DEFAULT_YEAR_RANGE;

  it("leaves a window of MIN_VISIBLE_SPAN or more alone", () => {
    expect(widenToMinSpan(1800, 1800 + MIN_VISIBLE_SPAN, fs, fe)).toEqual({
      start: 1800,
      end: 1800 + MIN_VISIBLE_SPAN,
    });
  });

  it("widens a short window about its centre", () => {
    expect(widenToMinSpan(1790, 1810, fs, fe)).toEqual({ start: 1725, end: 1875 });
  });

  it("keeps a widened window inside the chart at either end", () => {
    expect(widenToMinSpan(2010, 2040, fs, fe)).toEqual({ start: 1900, end: 2050 });
    expect(widenToMinSpan(1600, 1620, fs, fe)).toEqual({ start: 1600, end: 1750 });
  });

  it("clamps a window that starts or ends outside the chart", () => {
    expect(widenToMinSpan(1500, 1650, fs, fe)).toEqual({ start: 1600, end: 1750 });
    expect(widenToMinSpan(1500, 2100, fs, fe)).toEqual({ start: fs, end: fe });
    expect(widenToMinSpan(1900, 1950, 1900, 2000)).toEqual({ start: 1900, end: 2000 });
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
        1900,
        DEFAULT_YEAR_RANGE.end,
        DEFAULT_YEAR_RANGE.start,
        DEFAULT_YEAR_RANGE.end
      )
    ).toBe("modern");
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
