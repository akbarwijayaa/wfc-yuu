import { prisma } from "@/lib/db";
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

export async function GET() {
  const shops = await prisma.coffeeShop.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      region: true,
      address: true,
      wifiSpeed: true,
      powerOutlets: true,
      avgPrice: true,
      operatingHours: true,
      noiseLevel: true,
      comfort: true,
      locationAccess: true,
    },
  });
  return Response.json(shops);
}

// Create a coffee shop (admin only). Wraps createShopAction (app/actions/admin.ts).
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const parsed = coffeeShopSchema.safeParse(await parseJson(req));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Input tidak valid", 400);
  }

  const shop = await prisma.coffeeShop.create({ data: toData(parsed.data) });
  return Response.json(shop, { status: 201 });
}
