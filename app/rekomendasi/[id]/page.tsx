import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { rankShops, type ShopFactors, type WeightMap } from "@/lib/mfep";

export default async function RecommendationResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const rec = await prisma.recommendation.findUnique({ where: { id: Number(id) } });
  if (!rec || rec.userId !== Number(session.sub)) notFound();

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
  const ranked = rankShops(factors, weights);
  const top = ranked[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Hasil Rekomendasi</h1>
        <Link href="/rekomendasi" className="text-sm text-amber-700 hover:underline">
          ← Ubah bobot
        </Link>
      </div>

      {top && (
        <div className="rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 p-6 text-white">
          <p className="text-sm text-amber-100">Rekomendasi teratas</p>
          <p className="mt-1 text-3xl font-bold">{top.name}</p>
          <p className="mt-1 text-amber-100">Total WE: {top.totalWe.toFixed(4)}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Coffee Shop</th>
              <th className="px-4 py-3 text-right">Total WE</th>
              <th className="px-4 py-3">Rincian W×E</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ranked.map((r) => (
              <tr key={r.shopId} className={r.rank === 1 ? "bg-amber-50/60" : ""}>
                <td className="px-4 py-3 font-semibold text-slate-700">{r.rank}</td>
                <td className="px-4 py-3">
                  <Link href={`/coffee/${r.shopId}`} className="font-medium text-amber-800 hover:underline">
                    {r.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{r.totalWe.toFixed(4)}</td>
                <td className="px-4 py-3">
                  <details>
                    <summary className="cursor-pointer text-slate-500 hover:text-amber-800">
                      lihat
                    </summary>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {r.breakdown.map((b) => (
                        <span
                          key={b.code}
                          className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600"
                          title={`W ${b.weightPercent}% × E ${b.evaluation}`}
                        >
                          {b.code}: {b.weightPercent}%×{b.evaluation}={b.we.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        Dihitung dengan metode MFEP — bobot:{" "}
        {Object.entries(weights)
          .map(([k, v]) => `${k} ${v}%`)
          .join(", ")}
      </p>
    </div>
  );
}
