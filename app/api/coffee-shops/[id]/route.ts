import { prisma } from "@/lib/db";
import { CRITERIA_CODES, evaluate, type ShopFactors } from "@/lib/mfep";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await prisma.coffeeShop.findUnique({ where: { id: Number(id) } });
  if (!shop) {
    return Response.json({ error: "Coffee shop tidak ditemukan" }, { status: 404 });
  }

  const factors: ShopFactors = {
    id: shop.id,
    name: shop.name,
    wifiSpeed: shop.wifiSpeed,
    powerOutlets: shop.powerOutlets,
    avgPrice: shop.avgPrice,
    operatingHours: shop.operatingHours,
    noiseLevel: shop.noiseLevel,
    comfort: shop.comfort,
    locationAccess: shop.locationAccess,
  };
  const scores = Object.fromEntries(CRITERIA_CODES.map((c) => [c, evaluate(c, factors)]));

  return Response.json({
    id: shop.id,
    name: shop.name,
    region: shop.region,
    address: shop.address,
    wifiSpeed: shop.wifiSpeed,
    powerOutlets: shop.powerOutlets,
    avgPrice: shop.avgPrice,
    operatingHours: shop.operatingHours,
    noiseLevel: shop.noiseLevel,
    comfort: shop.comfort,
    locationAccess: shop.locationAccess,
    scores,
  });
}
