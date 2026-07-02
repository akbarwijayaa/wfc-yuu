import { prisma } from "@/lib/db";
import { weightsSchema } from "@/lib/validation";
import { parseJson, jsonError, requireAdmin } from "@/lib/api";

export async function GET() {
  const criteria = await prisma.criterion.findMany({ orderBy: { code: "asc" } });
  return Response.json(criteria);
}

// Update default weights (admin only). Wraps updateWeightsAction
// (app/actions/admin.ts): the seven codes must sum to exactly 100.
export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const parsed = weightsSchema.safeParse(await parseJson(req));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Total bobot harus 100%", 400);
  }

  const weights = parsed.data as Record<string, number>;
  await prisma.$transaction(
    Object.entries(weights).map(([code, defaultWeight]) =>
      prisma.criterion.update({ where: { code }, data: { defaultWeight } })
    )
  );

  const criteria = await prisma.criterion.findMany({ orderBy: { code: "asc" } });
  return Response.json(criteria);
}
