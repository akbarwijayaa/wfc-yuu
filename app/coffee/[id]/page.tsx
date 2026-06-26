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
    <div className="mx-auto max-w-2xl space-y-8">
      <Link href="/dashboard" className="font-mono text-xs text-ink-3 hover:text-ink">
        ← kembali
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{shop.name}</h1>
        <p className="mt-1 text-sm text-ink-3">
          {shop.region}
          {shop.address ? ` · ${shop.address}` : ""}
        </p>
        {shop.description && <p className="mt-3 text-sm leading-relaxed text-ink-2">{shop.description}</p>}
      </div>

      <div className="panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-xs uppercase tracking-wider text-ink-3">
              <th className="px-4 py-3 font-medium">Kode</th>
              <th className="px-4 py-3 font-medium">Kriteria</th>
              <th className="px-4 py-3 font-medium">Nilai</th>
              <th className="px-4 py-3 text-right font-medium">Skor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.code}>
                <td className="px-4 py-3">
                  <span className="badge">{r.code}</span>
                </td>
                <td className="px-4 py-3 text-ink-2">{r.label}</td>
                <td className="px-4 py-3 text-ink">{r.raw}</td>
                <td className="px-4 py-3 text-right font-mono text-coffee tabular-nums">
                  {evaluate(r.code, factors)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-mono text-xs text-ink-3">
        skor 1–5 = evaluation factor hasil konversi aturan MFEP
      </p>
    </div>
  );
}
