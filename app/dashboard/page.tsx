import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const shops = await prisma.coffeeShop.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Halo, {session.name} 👋</h1>
        <p className="mt-1 text-sm text-slate-500">Mau cari coffee shop yang pas hari ini?</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/rekomendasi"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6 hover:bg-amber-100"
        >
          <h2 className="font-semibold text-amber-900">⚖️ Cari Rekomendasi</h2>
          <p className="mt-1 text-sm text-amber-800/80">
            Atur bobot preferensi dan dapatkan peringkat coffee shop.
          </p>
        </Link>
        <Link
          href="/riwayat"
          className="rounded-2xl border border-slate-200 bg-white p-6 hover:bg-slate-50"
        >
          <h2 className="font-semibold text-slate-800">🕑 Riwayat</h2>
          <p className="mt-1 text-sm text-slate-500">Lihat rekomendasi yang pernah kamu buat.</p>
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Jelajahi Coffee Shop</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((s) => (
            <Link
              key={s.id}
              href={`/coffee/${s.id}`}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:border-amber-300 hover:shadow-sm"
            >
              <p className="font-medium text-slate-800">{s.name}</p>
              <p className="text-xs text-slate-400">{s.region}</p>
              <p className="mt-2 text-xs text-slate-500">
                WiFi {s.wifiSpeed} Mbps · Rp {s.avgPrice.toLocaleString("id-ID")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
