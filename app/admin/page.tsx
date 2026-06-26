import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [shops, criteria, users, recs] = await Promise.all([
    prisma.coffeeShop.count(),
    prisma.criterion.count(),
    prisma.user.count(),
    prisma.recommendation.count(),
  ]);

  const stats = [
    ["coffee shop", shops],
    ["kriteria", criteria],
    ["pengguna", users],
    ["sesi rekomendasi", recs],
  ] as const;

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Dashboard</h1>
      </div>

      <div className="panel grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
        {stats.map(([label, value], i) => (
          <div key={label} className={`p-6 ${i < 2 ? "border-b border-line sm:border-b-0" : ""}`}>
            <p className="font-mono text-3xl tabular-nums text-ink">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-ink-3">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/coffee" className="panel p-6 transition-colors hover:border-line-2">
          <p className="font-mono text-xs text-coffee">→ coffee</p>
          <h2 className="mt-3 text-sm font-medium text-ink">Kelola Coffee Shop</h2>
          <p className="mt-1 text-sm text-ink-2">Tambah, ubah, dan hapus data beserta nilai kriterianya.</p>
        </Link>
        <Link href="/admin/kriteria" className="panel p-6 transition-colors hover:border-line-2">
          <p className="font-mono text-xs text-ink-3">→ kriteria</p>
          <h2 className="mt-3 text-sm font-medium text-ink">Kelola Kriteria &amp; Bobot</h2>
          <p className="mt-1 text-sm text-ink-2">Atur bobot default tiap kriteria (total 100%).</p>
        </Link>
      </div>
    </div>
  );
}
