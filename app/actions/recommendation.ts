"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { CRITERIA_CODES, equalWeights, rankShops, type CriteriaCode, type ShopFactors } from "@/lib/mfep";

export type RecoState = { error?: string };

function toFactors(
  shops: {
    id: number;
    name: string;
    wifiSpeed: number;
    powerOutlets: number;
    avgPrice: number;
    operatingHours: number;
    noiseLevel: string;
    comfort: string;
    locationAccess: string;
  }[]
): ShopFactors[] {
  return shops.map((s) => ({
    id: s.id,
    name: s.name,
    wifiSpeed: s.wifiSpeed,
    powerOutlets: s.powerOutlets,
    avgPrice: s.avgPrice,
    operatingHours: s.operatingHours,
    noiseLevel: s.noiseLevel,
    comfort: s.comfort,
    locationAccess: s.locationAccess,
  }));
}

export async function runRecommendationAction(_prev: RecoState, formData: FormData): Promise<RecoState> {
  const session = await getSession();
  if (!session) redirect("/login");

  // Checklist input: which criteria matter to the user. Backend splits 100% evenly.
  const selected = formData
    .getAll("criteria")
    .map(String)
    .filter((c): c is CriteriaCode => (CRITERIA_CODES as string[]).includes(c));

  if (selected.length === 0) return { error: "Pilih minimal satu kriteria." };

  const weights = equalWeights(selected);

  const shops = await prisma.coffeeShop.findMany({ orderBy: { id: "asc" } });
  if (shops.length === 0) return { error: "Belum ada data coffee shop." };

  const ranked = rankShops(toFactors(shops), weights);

  const rec = await prisma.recommendation.create({
    data: {
      userId: Number(session.sub),
      weights: JSON.stringify(weights),
      details: {
        create: ranked.map((r) => ({ coffeeShopId: r.shopId, totalWe: r.totalWe, rank: r.rank })),
      },
    },
  });

  redirect(`/rekomendasi/${rec.id}`);
}
