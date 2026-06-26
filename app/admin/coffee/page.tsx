import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteShopAction } from "@/app/actions/admin";

export default async function AdminCoffeeListPage() {
  const shops = await prisma.coffeeShop.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Admin · Coffee</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Kelola Coffee Shop</h1>
        </div>
        <Link href="/admin/coffee/new" className="btn-primary">
          + Tambah
        </Link>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-xs uppercase tracking-wider text-ink-3">
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Wilayah</th>
              <th className="px-4 py-3 text-right font-medium">WiFi</th>
              <th className="px-4 py-3 text-right font-medium">Harga</th>
              <th className="px-4 py-3 text-right font-medium">Jam</th>
              <th className="px-4 py-3 font-medium">Suasana</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {shops.map((s) => (
              <tr key={s.id} className="transition-colors hover:bg-panel-2">
                <td className="px-4 py-3 text-ink">{s.name}</td>
                <td className="px-4 py-3 text-ink-3">{s.region}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-2 tabular-nums">{s.wifiSpeed}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-2 tabular-nums">
                  {s.avgPrice.toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink-2 tabular-nums">{s.operatingHours}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-3">
                  {s.noiseLevel[0]}/{s.comfort[0]}/{s.locationAccess[0]}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/coffee/${s.id}`} className="text-coffee hover:text-coffee-2">
                      ubah
                    </Link>
                    <form action={deleteShopAction.bind(null, s.id)}>
                      <button className="text-ink-3 transition-colors hover:text-red-400">hapus</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
