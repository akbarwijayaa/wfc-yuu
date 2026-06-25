import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { evaluate, type CriteriaCode, type ShopFactors } from "@/lib/mfep";

export default async function CoffeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await prisma.coffeeShop.findUnique({ where: { id: Number(id) } });
  if (!shop) notFound();

  const factors: ShopFactors = {
    id: shop.id,
    name: shop.name,
    wifiSpeed: shop.wifiSpeed,
    powerOutlets: shop.powerOutlets,
    avgPrice: shop.avgPrice,
    operatingHours: shop.operatingHours,
    noiseLevel: shop.noiseLevel,
    comfort: shop.comfort,
    locationAccess: shop.locationAccess,
  };

  const rows: { code: CriteriaCode; label: string; raw: string }[] = [
    { code: "C1", label: "Kecepatan WiFi", raw: `${shop.wifiSpeed} Mbps` },
    { code: "C2", label: "Ketersediaan Stop Kontak", raw: `${shop.powerOutlets} titik` },
    { code: "C3", label: "Harga Rata-rata", raw: `Rp ${shop.avgPrice.toLocaleString("id-ID")}` },
    { code: "C4", label: "Jam Operasional", raw: `${shop.operatingHours} jam/hari` },
    { code: "C5", label: "Tingkat Kebisingan", raw: shop.noiseLevel },
    { code: "C6", label: "Kenyamanan Tempat Duduk", raw: shop.comfort },
    { code: "C7", label: "Lokasi / Akses", raw: shop.locationAccess },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/dashboard" className="text-sm text-amber-700 hover:underline">
        ← Kembali
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-800">{shop.name}</h1>
        <p className="text-sm text-slate-500">
          {shop.region}
          {shop.address ? ` · ${shop.address}` : ""}
        </p>
        {shop.description && <p className="mt-3 text-sm text-slate-600">{shop.description}</p>}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Kode</th>
              <th className="px-4 py-3">Kriteria</th>
              <th className="px-4 py-3">Nilai</th>
              <th className="px-4 py-3 text-right">Skor (1–5)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.code}>
                <td className="px-4 py-3 font-semibold text-amber-800">{r.code}</td>
                <td className="px-4 py-3 text-slate-600">{r.label}</td>
                <td className="px-4 py-3 text-slate-700">{r.raw}</td>
                <td className="px-4 py-3 text-right font-semibold">{evaluate(r.code, factors)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400">
        Skor 1–5 adalah hasil konversi (evaluation factor) sesuai aturan MFEP.
      </p>
    </div>
  );
}
