import { prisma } from "@/lib/db";

// Preference options for building a recommendation — the criteria checklist the
// visitor picks from on the /rekomendasi page. Documented as GET /rekomendasi
// (opsi preferensi) in the design doc; backed by the same criteria data.
export async function GET() {
  const criteria = await prisma.criterion.findMany({
    orderBy: { code: "asc" },
    select: { id: true, code: true, name: true, description: true, type: true },
  });
  return Response.json({ options: criteria });
}
