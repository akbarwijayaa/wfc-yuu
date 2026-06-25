import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteShopAction } from "@/app/actions/admin";

export default async function AdminCoffeeListPage() {
  const shops = await prisma.coffeeShop.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Kelola Coffee Shop</h1>
        <Link
          href="/admin/coffee/new"
          className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
        >
          + Tambah
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Wilayah</th>
              <th className="px-4 py-3 text-right">WiFi</th>
              <th className="px-4 py-3 text-right">Harga</th>
              <th className="px-4 py-3 text-right">Jam</th>
              <th className="px-4 py-3">Suasana</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shops.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                <td className="px-4 py-3 text-slate-500">{s.region}</td>
                <td className="px-4 py-3 text-right">{s.wifiSpeed}</td>
                <td className="px-4 py-3 text-right">Rp {s.avgPrice.toLocaleString("id-ID")}</td>
                <td className="px-4 py-3 text-right">{s.operatingHours}</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {s.noiseLevel}/{s.comfort}/{s.locationAccess}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/coffee/${s.id}`} className="text-amber-700 hover:underline">
                      Ubah
                    </Link>
                    <form action={deleteShopAction.bind(null, s.id)}>
                      <button className="text-red-600 hover:underline">Hapus</button>
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
