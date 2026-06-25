import type { CriteriaCode, ShopFactors } from "./types";

/**
 * MFEP conversion rules (SPK doc, Table 4).
 * Cost criteria (C3 price, C5 noise) have their inversion baked into the
 * mapping — so the engine treats every converted E as a benefit.
 */

type NumericBand = { upTo: number; score: number };

// Numeric criteria: first band whose `upTo` is >= raw wins (bands ascending).
const numericBands: Partial<Record<CriteriaCode, NumericBand[]>> = {
  // C1 WiFi (Mbps) — benefit
  C1: [
    { upTo: 10, score: 1 },
    { upTo: 15, score: 2 },
    { upTo: 20, score: 3 },
    { upTo: 25, score: 4 },
    { upTo: Infinity, score: 5 },
  ],
  // C2 Power outlets (count) — benefit
  C2: [
    { upTo: 2, score: 1 },
    { upTo: 4, score: 2 },
    { upTo: 6, score: 3 },
    { upTo: 8, score: 4 },
    { upTo: Infinity, score: 5 },
  ],
  // C3 Average price (Rupiah) — cost (inversion baked in: cheaper = higher score)
  C3: [
    { upTo: 10000, score: 5 },
    { upTo: 15000, score: 4 },
    { upTo: 20000, score: 3 },
    { upTo: 25000, score: 2 },
    { upTo: Infinity, score: 1 },
  ],
  // C4 Operating hours (hours/day) — benefit
  C4: [
    { upTo: 8, score: 1 },
    { upTo: 10, score: 2 },
    { upTo: 12, score: 3 },
    { upTo: 14, score: 4 },
    { upTo: Infinity, score: 5 },
  ],
};

// Categorical criteria — cost direction (C5) already inverted in the map.
const categoryMaps: Partial<Record<CriteriaCode, Record<string, number>>> = {
  C5: { Tinggi: 1, Sedang: 3, Rendah: 5 }, // noise — cost
  C6: { Kurang: 1, Cukup: 3, Nyaman: 5 }, // comfort — benefit
  C7: { Sulit: 1, Sedang: 3, Mudah: 5 }, // location — benefit
};

export const CRITERIA_CODES: CriteriaCode[] = ["C1", "C2", "C3", "C4", "C5", "C6", "C7"];

export const DEFAULT_WEIGHTS = {
  C1: 20,
  C2: 10,
  C3: 15,
  C4: 10,
  C5: 15,
  C6: 15,
  C7: 15,
} as const;

function rawValueFor(code: CriteriaCode, s: ShopFactors): number | string {
  switch (code) {
    case "C1":
      return s.wifiSpeed;
    case "C2":
      return s.powerOutlets;
    case "C3":
      return s.avgPrice;
    case "C4":
      return s.operatingHours;
    case "C5":
      return s.noiseLevel;
    case "C6":
      return s.comfort;
    case "C7":
      return s.locationAccess;
  }
}

function bandScore(bands: NumericBand[], raw: number): number {
  for (const b of bands) if (raw <= b.upTo) return b.score;
  return bands[bands.length - 1].score;
}

/** Convert a single raw factor to its 1..5 evaluation score. */
export function evaluate(code: CriteriaCode, s: ShopFactors): number {
  const bands = numericBands[code];
  if (bands) return bandScore(bands, rawValueFor(code, s) as number);

  const map = categoryMaps[code];
  if (map) {
    const v = rawValueFor(code, s) as string;
    const score = map[v];
    if (score == null) throw new Error(`Unknown category "${v}" for ${code}`);
    return score;
  }
  throw new Error(`No conversion rule for ${code}`);
}
