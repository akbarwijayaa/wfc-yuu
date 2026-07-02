import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { jsonError } from "@/lib/api";

// Session-aware dashboard payload. Admin gets aggregate counts (mirrors
// app/admin/page.tsx); visitor gets the coffee shop list (mirrors
// app/dashboard/page.tsx).
export async function GET() {
  const session = await getSession();
  if (!session) return jsonError("Belum login", 401);

  if (session.role === "admin") {
    const [coffeeShops, criteria, users, recommendations] = await Promise.all([
      prisma.coffeeShop.count(),
      prisma.criterion.count(),
      prisma.user.count(),
      prisma.recommendation.count(),
    ]);
    return Response.json({
      role: "admin",
      counts: { coffeeShops, criteria, users, recommendations },
    });
  }

  const coffeeShops = await prisma.coffeeShop.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      region: true,
      wifiSpeed: true,
      avgPrice: true,
    },
  });
  return Response.json({ role: "visitor", coffeeShops });
}
