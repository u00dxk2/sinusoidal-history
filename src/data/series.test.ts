import { describe, it, expect } from "vitest";
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
});
