import { prisma } from "@/lib/db";

export async function GET() {
  const criteria = await prisma.criterion.findMany({ orderBy: { code: "asc" } });
  return Response.json(criteria);
}
