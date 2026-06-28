import { prisma } from "@/lib/db";

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
