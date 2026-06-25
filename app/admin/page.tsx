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
    { label: "Coffee Shop", value: shops, href: "/admin/coffee" },
    { label: "Kriteria", value: criteria, href: "/admin/kriteria" },
    { label: "Pengguna", value: users, href: "/admin" },
    { label: "Sesi Rekomendasi", value: recs, href: "/admin" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin</h1>

      <div className="grid gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-amber-300">
            <p className="text-3xl font-bold text-amber-800">{s.value}</p>
            <p className="mt-1 text-sm text-slate-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/coffee" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 hover:bg-amber-100">
          <h2 className="font-semibold text-amber-900">☕ Kelola Coffee Shop</h2>
          <p className="mt-1 text-sm text-amber-800/80">Tambah, ubah, dan hapus data coffee shop beserta nilai kriterianya.</p>
        </Link>
        <Link href="/admin/kriteria" className="rounded-2xl border border-slate-200 bg-white p-6 hover:bg-slate-50">
          <h2 className="font-semibold text-slate-800">⚖️ Kelola Kriteria &amp; Bobot</h2>
          <p className="mt-1 text-sm text-slate-500">Atur bobot default tiap kriteria (total 100%).</p>
        </Link>
      </div>
    </div>
  );
}
