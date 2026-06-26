import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const shops = await prisma.coffeeShop.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Halo, {session.name}</h1>
        <p className="mt-1 text-sm text-ink-2">Mau cari coffee shop yang pas hari ini?</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/rekomendasi" className="panel group p-6 transition-colors hover:border-line-2">
          <p className="font-mono text-xs text-coffee">→ rekomendasi</p>
          <h2 className="mt-3 text-sm font-medium text-ink">Cari Rekomendasi</h2>
          <p className="mt-1 text-sm text-ink-2">Atur bobot preferensi dan dapatkan peringkat.</p>
        </Link>
        <Link href="/riwayat" className="panel group p-6 transition-colors hover:border-line-2">
          <p className="font-mono text-xs text-ink-3">→ riwayat</p>
          <h2 className="mt-3 text-sm font-medium text-ink">Riwayat</h2>
          <p className="mt-1 text-sm text-ink-2">Rekomendasi yang pernah kamu buat.</p>
        </Link>
      </div>

      <div>
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-ink-3">
          Jelajahi Coffee Shop
        </h2>
        <div className="panel divide-y divide-line">
          {shops.map((s) => (
            <Link
              key={s.id}
              href={`/coffee/${s.id}`}
              className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-panel-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-ink">{s.name}</p>
                <p className="text-xs text-ink-3">{s.region}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 font-mono text-xs text-ink-2 tabular-nums">
                <span>{s.wifiSpeed} Mbps</span>
                <span className="hidden sm:inline">Rp {s.avgPrice.toLocaleString("id-ID")}</span>
                <span className="text-ink-3">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
