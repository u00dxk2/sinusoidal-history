import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import { cycles } from "./cycles";
import { dataSeries } from "./series";

describe("series.json cross-references", () => {
  it("every associated_cycle_id resolves to an existing cycle", () => {
    const cycleIds = new Set(cycles.map((c) => c.id));
    for (const s of dataSeries) {
      expect(cycleIds.has(s.associated_cycle_id)).toBe(true);
    }
  });

  it("every series has a unique id", () => {
    const ids = dataSeries.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every data_file path starts with /data/", () => {
    for (const s of dataSeries) {
      expect(s.data_file.startsWith("/data/")).toBe(true);
    }
  });

  it("every declared CSV exists and exposes numeric, ordered data columns", () => {
    for (const s of dataSeries) {
      const relativeCsvPath = s.data_file.replace(/^\//, "");
      const csvPath = path.join(process.cwd(), "public", relativeCsvPath);
      expect(fs.existsSync(csvPath), `${s.id} CSV exists`).toBe(true);

      const provenancePath = csvPath.replace(/\.csv$/, ".source.md");
      expect(
        fs.existsSync(provenancePath),
        `${s.id} provenance markdown exists`
      ).toBe(true);

      const parsed = Papa.parse<Record<string, string>>(
        fs.readFileSync(csvPath, "utf8"),
        {
          header: true,
          skipEmptyLines: true,
        }
      );

      expect(parsed.errors, `${s.id} CSV parse errors`).toEqual([]);
      expect(parsed.data.length, `${s.id} row count`).toBeGreaterThan(0);

      let previousYear = -Infinity;
      for (const [index, row] of parsed.data.entries()) {
        expect(
          Object.hasOwn(row, s.year_column),
          `${s.id} row ${index + 1} has year column "${s.year_column}"`
        ).toBe(true);
        expect(
          Object.hasOwn(row, s.value_column),
          `${s.id} row ${index + 1} has value column "${s.value_column}"`
        ).toBe(true);

        const year = Number(row[s.year_column]);
        const value = Number(row[s.value_column]);
        expect(Number.isFinite(year), `${s.id} row ${index + 1} year`).toBe(
          true
        );
        expect(Number.isFinite(value), `${s.id} row ${index + 1} value`).toBe(
          true
        );
        expect(
          year,
          `${s.id} row ${index + 1} year is strictly increasing`
        ).toBeGreaterThan(previousYear);
        previousYear = year;
      }
    }
  });
});
