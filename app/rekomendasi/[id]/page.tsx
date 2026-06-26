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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Hasil · MFEP</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Peringkat rekomendasi</h1>
        </div>
        <Link href="/rekomendasi" className="btn-ghost">
          Ubah bobot
        </Link>
      </div>

      {top && (
        <div className="panel flex items-center justify-between p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-coffee">peringkat 01</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{top.name}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl tabular-nums text-coffee">{top.totalWe.toFixed(4)}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-ink-3">total WE</p>
          </div>
        </div>
      )}

      <div className="panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-xs uppercase tracking-wider text-ink-3">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Coffee Shop</th>
              <th className="px-4 py-3 text-right font-medium">Total WE</th>
              <th className="px-4 py-3 font-medium">Rincian W×E</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ranked.map((r) => (
              <tr key={r.shopId} className={r.rank === 1 ? "bg-coffee/[0.06]" : ""}>
                <td className="px-4 py-3 font-mono text-ink-3 tabular-nums">
                  {String(r.rank).padStart(2, "0")}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/coffee/${r.shopId}`} className="text-ink hover:text-coffee">
                    {r.name}
                  </Link>
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono tabular-nums ${
                    r.rank === 1 ? "text-coffee" : "text-ink-2"
                  }`}
                >
                  {r.totalWe.toFixed(4)}
                </td>
                <td className="px-4 py-3">
                  <details className="group">
                    <summary className="cursor-pointer list-none font-mono text-xs text-ink-3 hover:text-ink">
                      lihat ▾
                    </summary>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.breakdown.map((b) => (
                        <span key={b.code} className="badge" title={`W ${b.weightPercent}% × E ${b.evaluation}`}>
                          {b.code} {b.weightPercent}×{b.evaluation}={b.we.toFixed(2)}
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

      <p className="font-mono text-xs text-ink-3">
        bobot:{" "}
        {Object.entries(weights)
          .map(([k, v]) => `${k}=${v}`)
          .join(" · ")}
      </p>
    </div>
  );
}
