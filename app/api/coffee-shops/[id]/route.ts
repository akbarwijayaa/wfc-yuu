import { prisma } from "@/lib/db";
import { CRITERIA_CODES, evaluate, type ShopFactors } from "@/lib/mfep";
import { coffeeShopSchema, type CoffeeShopInput } from "@/lib/validation";
import { parseJson, jsonError, requireAdmin } from "@/lib/api";

// Map validated input to the CoffeeShop columns (mirrors app/actions/admin.ts).
function toData(d: CoffeeShopInput) {
  return {
    name: d.name,
    address: d.address || null,
    region: d.region || null,
    wifiSpeed: d.wifiSpeed,
    powerOutlets: d.powerOutlets,
    avgPrice: d.avgPrice,
    operatingHours: d.operatingHours,
    noiseLevel: d.noiseLevel,
    comfort: d.comfort,
    locationAccess: d.locationAccess,
    description: d.description || null,
    photoUrl: d.photoUrl || null,
  };
}

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

// Update a coffee shop (admin only). Wraps updateShopAction (app/actions/admin.ts).
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const parsed = coffeeShopSchema.safeParse(await parseJson(req));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Input tidak valid", 400);
  }

  const existing = await prisma.coffeeShop.findUnique({ where: { id: Number(id) } });
  if (!existing) return jsonError("Coffee shop tidak ditemukan", 404);

  const shop = await prisma.coffeeShop.update({
    where: { id: Number(id) },
    data: toData(parsed.data),
  });
  return Response.json(shop);
}

// Delete a coffee shop (admin only). Removes recommendation references first to
// satisfy the FK, mirroring deleteShopAction (app/actions/admin.ts).
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const existing = await prisma.coffeeShop.findUnique({ where: { id: Number(id) } });
  if (!existing) return jsonError("Coffee shop tidak ditemukan", 404);

  await prisma.$transaction([
    prisma.recommendationDetail.deleteMany({ where: { coffeeShopId: Number(id) } }),
    prisma.coffeeShop.delete({ where: { id: Number(id) } }),
  ]);
  return Response.json({ ok: true });
}
