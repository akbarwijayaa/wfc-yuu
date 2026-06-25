import { describe, it, expect } from "vitest";
import { rankShops, validateWeights } from "./engine";
import { DEFAULT_WEIGHTS, evaluate } from "./rules";
import type { ShopFactors, WeightMap } from "./types";

// Seed sample (SPK doc, Table 2) — order = id order (used for stable tie-breaking).
const SHOPS: ShopFactors[] = [
  { id: 1, name: "Filosofi Kopi Jogja", wifiSpeed: 25, powerOutlets: 8, avgPrice: 20000, operatingHours: 15, noiseLevel: "Rendah", comfort: "Nyaman", locationAccess: "Mudah" },
  { id: 2, name: "Kopi Klotok", wifiSpeed: 10, powerOutlets: 6, avgPrice: 15000, operatingHours: 11, noiseLevel: "Sedang", comfort: "Cukup", locationAccess: "Sedang" },
  { id: 3, name: "Cethe Coffee", wifiSpeed: 30, powerOutlets: 10, avgPrice: 22000, operatingHours: 14, noiseLevel: "Rendah", comfort: "Nyaman", locationAccess: "Mudah" },
  { id: 4, name: "Kedai Kopi Nol Derajat", wifiSpeed: 20, powerOutlets: 7, avgPrice: 18000, operatingHours: 12, noiseLevel: "Sedang", comfort: "Nyaman", locationAccess: "Mudah" },
  { id: 5, name: "Kopi Joss Lik Man", wifiSpeed: 5, powerOutlets: 3, avgPrice: 8000, operatingHours: 8, noiseLevel: "Tinggi", comfort: "Kurang", locationAccess: "Mudah" },
  { id: 6, name: "Epic Coffee", wifiSpeed: 35, powerOutlets: 9, avgPrice: 25000, operatingHours: 16, noiseLevel: "Rendah", comfort: "Nyaman", locationAccess: "Mudah" },
  { id: 7, name: "Awor Gallery & Coffee", wifiSpeed: 22, powerOutlets: 8, avgPrice: 28000, operatingHours: 14, noiseLevel: "Rendah", comfort: "Nyaman", locationAccess: "Sedang" },
  { id: 8, name: "Kopi Soe Jogja", wifiSpeed: 15, powerOutlets: 6, avgPrice: 16000, operatingHours: 13, noiseLevel: "Sedang", comfort: "Cukup", locationAccess: "Mudah" },
  { id: 9, name: "Titik Temu Coffee", wifiSpeed: 28, powerOutlets: 9, avgPrice: 23000, operatingHours: 15, noiseLevel: "Rendah", comfort: "Nyaman", locationAccess: "Sedang" },
  { id: 10, name: "Janji Jiwa Jogja", wifiSpeed: 12, powerOutlets: 5, avgPrice: 14000, operatingHours: 13, noiseLevel: "Tinggi", comfort: "Cukup", locationAccess: "Mudah" },
];

const round2 = (n: number) => Math.round(n * 100) / 100;

describe("MFEP conversion (evaluation factor)", () => {
  it("converts raw factors to the documented E values", () => {
    // Filosofi Kopi Jogja → 4,4,3,5,5,5,5 (SPK doc Table 5)
    const f = SHOPS[0];
    expect(["C1", "C2", "C3", "C4", "C5", "C6", "C7"].map((c) => evaluate(c as never, f))).toEqual([
      4, 4, 3, 5, 5, 5, 5,
    ]);
    // Kopi Joss Lik Man → 1,2,5,1,1,1,5
    const j = SHOPS[4];
    expect(["C1", "C2", "C3", "C4", "C5", "C6", "C7"].map((c) => evaluate(c as never, j))).toEqual([
      1, 2, 5, 1, 1, 1, 5,
    ]);
  });
});

describe("validateWeights", () => {
  it("accepts weights summing to 100", () => {
    expect(validateWeights(DEFAULT_WEIGHTS as unknown as WeightMap)).toEqual({ ok: true, total: 100 });
  });
  it("rejects weights not summing to 100", () => {
    const bad = { ...DEFAULT_WEIGHTS, C1: 25 } as unknown as WeightMap;
    expect(validateWeights(bad).ok).toBe(false);
  });
});

describe("rankShops — golden case (default weights)", () => {
  const ranked = rankShops(SHOPS, DEFAULT_WEIGHTS as unknown as WeightMap);

  it("reproduces the reference ranking order", () => {
    expect(ranked.map((r) => r.name)).toEqual([
      "Epic Coffee",
      "Cethe Coffee",
      "Filosofi Kopi Jogja",
      "Titik Temu Coffee",
      "Kedai Kopi Nol Derajat",
      "Awor Gallery & Coffee",
      "Kopi Soe Jogja",
      "Janji Jiwa Jogja",
      "Kopi Klotok",
      "Kopi Joss Lik Man",
    ]);
  });

  it("reproduces the reference total WE scores", () => {
    const byName = Object.fromEntries(ranked.map((r) => [r.name, round2(r.totalWe)]));
    expect(byName["Epic Coffee"]).toBe(4.55);
    expect(byName["Cethe Coffee"]).toBe(4.45);
    expect(byName["Filosofi Kopi Jogja"]).toBe(4.4);
    expect(byName["Titik Temu Coffee"]).toBe(4.25);
    expect(byName["Kedai Kopi Nol Derajat"]).toBe(3.7);
    expect(byName["Awor Gallery & Coffee"]).toBe(3.7);
    expect(byName["Kopi Soe Jogja"]).toBe(3.2);
    expect(byName["Janji Jiwa Jogja"]).toBe(3.05);
    expect(byName["Kopi Klotok"]).toBe(2.75);
    expect(byName["Kopi Joss Lik Man"]).toBe(2.3);
  });

  it("assigns ranks 1..10", () => {
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
