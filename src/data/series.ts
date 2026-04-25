import seriesJson from "./series.json";
import { cycles } from "./cycles";
import type { DataSeries } from "./types";

export const dataSeries: DataSeries[] = seriesJson as DataSeries[];

const cycleIds = new Set(cycles.map((c) => c.id));
for (const s of dataSeries) {
  if (!cycleIds.has(s.associated_cycle_id)) {
    throw new Error(
      `series.json: "${s.id}" references unknown cycle "${s.associated_cycle_id}"`
    );
  }
}
