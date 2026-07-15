// Real technical data from the Poddar Agri Gold catalogue (IS 4985:2000),
// powering the pipe/solvent-cement calculator. Every figure here is taken
// directly from the real catalogue tables — nothing interpolated or invented.

export type PressureClass = "class2" | "class3";

export const PRESSURE_CLASS_LABELS: Record<PressureClass, string> = {
  class2: "Class 2 (4 kgf/cm²)",
  class3: "Class 3 (6 kgf/cm²)",
};

interface WallThicknessRow {
  size: number; // mm
  minMm: number;
  maxMm: number;
}

// IS 4985 - Class 2 (4 kgf/cm2)
export const CLASS2_WALL_THICKNESS: WallThicknessRow[] = [
  { size: 63, minMm: 1.5, maxMm: 1.9 },
  { size: 75, minMm: 1.8, maxMm: 2.2 },
  { size: 90, minMm: 2.1, maxMm: 2.6 },
  { size: 110, minMm: 2.5, maxMm: 3.0 },
  { size: 125, minMm: 2.9, maxMm: 3.4 },
  { size: 140, minMm: 3.2, maxMm: 3.8 },
  { size: 160, minMm: 3.7, maxMm: 4.3 },
  { size: 180, minMm: 4.2, maxMm: 4.9 },
  { size: 200, minMm: 4.6, maxMm: 5.3 },
  { size: 225, minMm: 5.2, maxMm: 6.0 },
  { size: 250, minMm: 5.7, maxMm: 6.5 },
  { size: 315, minMm: 7.2, maxMm: 8.3 },
];

// IS 4985 - Class 3 (6 kgf/cm2)
export const CLASS3_WALL_THICKNESS: WallThicknessRow[] = [
  { size: 40, minMm: 1.4, maxMm: 1.8 },
  { size: 50, minMm: 1.7, maxMm: 2.1 },
  { size: 63, minMm: 2.2, maxMm: 2.7 },
  { size: 75, minMm: 2.6, maxMm: 3.1 },
  { size: 90, minMm: 3.1, maxMm: 3.7 },
  { size: 110, minMm: 3.7, maxMm: 4.3 },
  { size: 125, minMm: 4.3, maxMm: 5.0 },
  { size: 140, minMm: 4.8, maxMm: 5.5 },
  { size: 160, minMm: 5.4, maxMm: 6.2 },
  { size: 180, minMm: 6.1, maxMm: 7.1 },
  { size: 200, minMm: 6.8, maxMm: 7.9 },
  { size: 225, minMm: 7.6, maxMm: 8.8 },
  { size: 250, minMm: 8.5, maxMm: 9.8 },
  { size: 315, minMm: 10.7, maxMm: 12.4 },
];

export function getWallThickness(pressureClass: PressureClass, size: number): WallThicknessRow | undefined {
  const table = pressureClass === "class2" ? CLASS2_WALL_THICKNESS : CLASS3_WALL_THICKNESS;
  return table.find((r) => r.size === size);
}

export function availableSizes(pressureClass: PressureClass): number[] {
  const table = pressureClass === "class2" ? CLASS2_WALL_THICKNESS : CLASS3_WALL_THICKNESS;
  return table.map((r) => r.size);
}

// PVC pipe temperature de-rating factor for pressure rating (from the
// catalogue's "PVC Pipes Temperature De-rating Factor" table).
export const TEMP_DERATING: { tempC: number; tempF: number; factor: number }[] = [
  { tempC: 23, tempF: 73, factor: 1.0 },
  { tempC: 27, tempF: 80, factor: 0.88 },
  { tempC: 32, tempF: 90, factor: 0.75 },
  { tempC: 38, tempF: 100, factor: 0.62 },
  { tempC: 43, tempF: 110, factor: 0.51 },
  { tempC: 49, tempF: 120, factor: 0.4 },
  { tempC: 54, tempF: 130, factor: 0.31 },
  { tempC: 60, tempF: 140, factor: 0.22 },
];

export function nearestDeratingFactor(tempC: number) {
  return TEMP_DERATING.reduce((closest, row) =>
    Math.abs(row.tempC - tempC) < Math.abs(closest.tempC - tempC) ? row : closest
  );
}

// Solvent cement size buckets, matching the catalogue's set/cure tables.
// The tables only cover up to 150mm (6") — larger Agri Gold sizes (160mm+)
// aren't tabulated in the source, so the calculator says so rather than
// guessing a number.
export type SizeBucket = "15-32mm" | "40-50mm" | "65-150mm" | "over150mm";

export function sizeToBucket(size: number): SizeBucket {
  if (size <= 32) return "15-32mm";
  if (size <= 50) return "40-50mm";
  if (size <= 150) return "65-150mm";
  return "over150mm";
}

export const SIZE_BUCKET_LABELS: Record<SizeBucket, string> = {
  "15-32mm": '½"–1¼" (15mm–32mm)',
  "40-50mm": '1½"–2" (40mm–50mm)',
  "65-150mm": '2½"–6" (65mm–150mm)',
  over150mm: "Above 150mm (not tabulated in the catalogue)",
};

export type TempRange = "warm" | "moderate" | "cold";

export const TEMP_RANGE_LABELS: Record<TempRange, string> = {
  warm: "60°–100°F / 16°–38°C",
  moderate: "40°–60°F / 5°–16°C",
  cold: "0°–40°F / -18°–5°C",
};

export function tempCToRange(tempC: number): TempRange {
  if (tempC >= 16) return "warm";
  if (tempC >= 5) return "moderate";
  return "cold";
}

// Average initial set schedule (minutes), by size bucket x temperature range.
const SET_SCHEDULE_MIN: Record<Exclude<SizeBucket, "over150mm">, Record<TempRange, number>> = {
  "15-32mm": { warm: 2, moderate: 5, cold: 10 },
  "40-50mm": { warm: 5, moderate: 10, cold: 15 },
  "65-150mm": { warm: 30, moderate: 120, cold: 720 },
};

export function initialSetMinutes(bucket: SizeBucket, range: TempRange): number | null {
  if (bucket === "over150mm") return null;
  return SET_SCHEDULE_MIN[bucket][range];
}

// Average joint cure schedule (minutes) for "up to 160 psi" — Agri Gold's
// Class 2/3 working pressures (4-6 kgf/cm2, roughly 57-85 psi) always fall
// in this lowest tabulated pressure band, so no separate pressure input is
// needed for this product line.
const CURE_SCHEDULE_MIN: Record<Exclude<SizeBucket, "over150mm">, Record<TempRange, number>> = {
  "15-32mm": { warm: 15, moderate: 20, cold: 30 },
  "40-50mm": { warm: 30, moderate: 45, cold: 60 },
  "65-150mm": { warm: 90, moderate: 240, cold: 4320 },
};

export function jointCureMinutes(bucket: SizeBucket, range: TempRange): number | null {
  if (bucket === "over150mm") return null;
  return CURE_SCHEDULE_MIN[bucket][range];
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes < 1440) {
    const hours = minutes / 60;
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hours`;
  }
  const days = minutes / 1440;
  return `${Number.isInteger(days) ? days : days.toFixed(1)} days`;
}
