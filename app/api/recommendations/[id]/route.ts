import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { rankShops, type ShopFactors, type WeightMap } from "@/lib/mfep";
import { jsonError } from "@/lib/api";

// Fetch a saved recommendation and its ranking (mirrors
// app/rekomendasi/[id]/page.tsx). Ownership is enforced: a recommendation that
// belongs to another user is reported as 404, not 403.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return jsonError("Belum login", 401);

  const { id } = await params;
  const rec = await prisma.recommendation.findUnique({ where: { id: Number(id) } });
  if (!rec || rec.userId !== Number(session.sub)) {
    return jsonError("Rekomendasi tidak ditemukan", 404);
  }

  const weights = JSON.parse(rec.weights) as WeightMap;
  const shops = await prisma.coffeeShop.findMany({ orderBy: { id: "asc" } });
  const factors: ShopFactors[] = shops.map((s) => ({
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
  const ranking = rankShops(factors, weights);

  return Response.json({ id: rec.id, createdAt: rec.createdAt, weights, ranking });
}
