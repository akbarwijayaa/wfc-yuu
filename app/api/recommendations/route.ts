import { prisma } from "@/lib/db";
import { CRITERIA_CODES, equalWeights, rankShops, type CriteriaCode, type ShopFactors } from "@/lib/mfep";

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

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body harus JSON valid" }, { status: 400 });
  }

  const raw = (body as { criteria?: unknown })?.criteria;
  const selected = Array.isArray(raw)
    ? raw.map(String).filter((c): c is CriteriaCode => (CRITERIA_CODES as string[]).includes(c))
    : [];

  if (selected.length === 0) {
    return Response.json(
      { error: "Pilih minimal satu kriteria valid (C1..C7)." },
      { status: 400 }
    );
  }

  const weights = equalWeights(selected);
  const shops = await prisma.coffeeShop.findMany({ orderBy: { id: "asc" } });
  const ranking = rankShops(toFactors(shops), weights);

  return Response.json({ weights, ranking });
}
