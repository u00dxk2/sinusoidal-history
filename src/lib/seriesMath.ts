export interface SeriesPoint {
  year: number;
  value: number;
}

export interface NormalizedPoint extends SeriesPoint {
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
    return points.map((p) => ({ year: p.year, value: 0, raw: p.value }));
  }
  const span = max - min;
  return points.map((p) => ({
    year: p.year,
    value: ((p.value - min) / span) * 2 - 1,
    raw: p.value,
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
