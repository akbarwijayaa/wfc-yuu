import { CRITERIA_CODES, evaluate } from "./rules";
import type { CriteriaCode, FactorBreakdown, RankedShop, ShopFactors, WeightMap } from "./types";

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/**
 * Distribute 100% equally across the selected criteria (integer percentages,
 * largest-remainder so the total is exactly 100). Unselected criteria get 0.
 * Used for the checklist-based preference UX — picking criteria, not numbers.
 */
export function equalWeights(selected: CriteriaCode[]): WeightMap {
  const result = Object.fromEntries(CRITERIA_CODES.map((c) => [c, 0])) as WeightMap;
  const chosen = CRITERIA_CODES.filter((c) => selected.includes(c)); // canonical order
  const n = chosen.length;
  if (n === 0) return result;
  const base = Math.floor(100 / n);
  let rem = 100 - base * n;
  for (const c of chosen) result[c] = base + (rem-- > 0 ? 1 : 0);
  return result;
}

/** Validate that the weight percentages sum to exactly 100. */
export function validateWeights(weights: WeightMap): { ok: boolean; total: number } {
  const total = CRITERIA_CODES.reduce((sum, c) => sum + (Number(weights[c]) || 0), 0);
  return { ok: total === 100, total };
}

/**
 * Core MFEP ranking. Pure function — no DB/HTTP.
 * WE = (W/100) * E per factor; Total WE = ΣWE; rank by highest Total WE.
 * Ties keep input order (Array.prototype.sort is stable), so pass shops in a
 * deterministic order (e.g. by id) to get reproducible tie-breaking.
 */
export function rankShops(shops: ShopFactors[], weights: WeightMap): RankedShop[] {
  const scored: RankedShop[] = shops.map((s) => {
    const breakdown: FactorBreakdown[] = CRITERIA_CODES.map((code) => {
      const e = evaluate(code, s);
      const weightPercent = Number(weights[code]) || 0;
      return { code, evaluation: e, weightPercent, we: (weightPercent / 100) * e };
    });
    const totalWe = breakdown.reduce((sum, b) => sum + b.we, 0);
    return { shopId: s.id, name: s.name, totalWe: round4(totalWe), rank: 0, breakdown };
  });

  scored.sort((a, b) => b.totalWe - a.totalWe);
  scored.forEach((s, i) => (s.rank = i + 1));
  return scored;
}
