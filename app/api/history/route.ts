import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { jsonError } from "@/lib/api";

// A visitor's saved recommendations, newest first (mirrors app/riwayat/page.tsx).
// Each entry carries the rank-1 shop as a preview.
export async function GET() {
  const session = await getSession();
  if (!session) return jsonError("Belum login", 401);

  const recs = await prisma.recommendation.findMany({
    where: { userId: Number(session.sub) },
    orderBy: { createdAt: "desc" },
    include: { details: { where: { rank: 1 }, include: { coffeeShop: true } } },
  });

  return Response.json(
    recs.map((r) => ({
      id: r.id,
      createdAt: r.createdAt,
      topShop: r.details[0]?.coffeeShop.name ?? null,
    }))
  );
}
