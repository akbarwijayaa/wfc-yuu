import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export default async function RiwayatPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const recs = await prisma.recommendation.findMany({
    where: { userId: Number(session.sub) },
    orderBy: { createdAt: "desc" },
    include: { details: { where: { rank: 1 }, include: { coffeeShop: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Riwayat Rekomendasi</h1>

      {recs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Belum ada riwayat.{" "}
          <Link href="/rekomendasi" className="font-medium text-amber-700 hover:underline">
            Buat rekomendasi pertama
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {recs.map((r) => (
            <Link
              key={r.id}
              href={`/rekomendasi/${r.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-slate-50"
            >
              <div>
                <p className="font-medium text-slate-800">
                  Teratas: {r.details[0]?.coffeeShop.name ?? "—"}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(r.createdAt).toLocaleString("id-ID")}
                </p>
              </div>
              <span className="text-sm text-amber-700">Lihat →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
