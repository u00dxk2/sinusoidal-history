export interface SeriesPoint {
  year: number;
  /** Working value: the transformed value where a transform applies (log1p). */
  value: number;
  /** Untransformed source value, kept so tooltips can show real units. */
  sourceValue?: number;
}

export interface NormalizedPoint extends SeriesPoint {
  /**
   * Pre-normalization value in the series' real units — the untransformed
   * source value where a transform applies. Tooltips print this with
   * `value_units`, so it must never be a logged number.
   */
  raw: number;
}

export function normalizeSeries(points: SeriesPoint[]): NormalizedPoint[] {
  if (points.length === 0) return [];
  let min = Infinity;
  let max = -Infinity;
  for (const p of points) {
    if (p.value < min) min = p.value;
    if (p.value > max) max = p.value;
  }
  if (min === max) {
    return points.map((p) => ({
      year: p.year,
      value: 0,
      raw: p.sourceValue ?? p.value,
    }));
  }
  const span = max - min;
  return points.map((p) => ({
    year: p.year,
    value: ((p.value - min) / span) * 2 - 1,
    raw: p.sourceValue ?? p.value,
  }));
}

export function alignSeriesToYears(
  points: SeriesPoint[],
  years: number[]
): (SeriesPoint | null)[] {
  const byYear = new Map<number, number>();
  for (const p of points) byYear.set(p.year, p.value);
  return years.map((y) => {
    const v = byYear.get(y);
    return v === undefined ? null : { year: y, value: v };
  });
}

export function pearsonCorrelation(a: number[], b: number[]): number | null {
  if (a.length !== b.length || a.length < 2) return null;
  const n = a.length;
  for (let i = 0; i < n; i++) {
    if (!Number.isFinite(a[i]) || !Number.isFinite(b[i])) return null;
  }
  let sumA = 0;
  let sumB = 0;
  for (let i = 0; i < n; i++) {
    sumA += a[i];
    sumB += b[i];
  }
  const meanA = sumA / n;
  const meanB = sumB / n;
  let num = 0;
  let denA = 0;
  let denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  if (denA === 0 || denB === 0) return null;
  return num / Math.sqrt(denA * denB);
}

export function pairedValuesForCorrelation(
  seriesPoints: SeriesPoint[],
  cycleAt: (year: number) => number
): { series: number[]; cycle: number[] } {
  const seriesValues: number[] = [];
  const cycleValues: number[] = [];
  for (const p of seriesPoints) {
    seriesValues.push(p.value);
    cycleValues.push(cycleAt(p.year));
  }
  return { series: seriesValues, cycle: cycleValues };
}
