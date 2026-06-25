"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { weightsSchema } from "@/lib/validation";
import { rankShops, type ShopFactors, type WeightMap } from "@/lib/mfep";

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

  const parsed = weightsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Bobot tidak valid" };
  }
  const weights = parsed.data as unknown as WeightMap;

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
