export type CriteriaCode = "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7";

/** Weights as integer percentages; all codes should sum to 100. */
export type WeightMap = Record<CriteriaCode, number>;

/** Raw, unconverted attributes of a coffee shop needed by MFEP. */
export interface ShopFactors {
  id: number;
  name: string;
  wifiSpeed: number; // Mbps
  powerOutlets: number; // count
  avgPrice: number; // Rupiah
  operatingHours: number; // hours/day
  noiseLevel: string; // Rendah | Sedang | Tinggi
  comfort: string; // Kurang | Cukup | Nyaman
  locationAccess: string; // Sulit | Sedang | Mudah
}

export interface FactorBreakdown {
  code: CriteriaCode;
  evaluation: number; // E, 1..5
  weightPercent: number; // W as percent
  we: number; // (W/100) * E
}

export interface RankedShop {
  shopId: number;
  name: string;
  totalWe: number; // sum of we, rounded to 4 decimals
  rank: number; // 1 = best
  breakdown: FactorBreakdown[];
}
