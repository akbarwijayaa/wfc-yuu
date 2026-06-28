import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatWIB } from "@/lib/datetime";

export default async function RiwayatPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const recs = await prisma.recommendation.findMany({
    where: { userId: Number(session.sub) },
    orderBy: { createdAt: "desc" },
    include: { details: { where: { rank: 1 }, include: { coffeeShop: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Riwayat</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Rekomendasi tersimpan</h1>
      </div>

      {recs.length === 0 ? (
        <div className="panel p-10 text-center">
          <p className="text-sm text-ink-2">Belum ada riwayat.</p>
          <Link href="/rekomendasi" className="mt-4 inline-block btn-primary">
            Buat rekomendasi pertama
          </Link>
        </div>
      ) : (
        <div className="panel divide-y divide-line">
          {recs.map((r) => (
            <Link
              key={r.id}
              href={`/rekomendasi/${r.id}`}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-panel-2"
            >
              <div>
                <p className="text-sm text-ink">
                  <span className="text-ink-3">teratas · </span>
                  {r.details[0]?.coffeeShop.name ?? "—"}
                </p>
                <p className="mt-0.5 font-mono text-xs text-ink-3">{formatWIB(r.createdAt)}</p>
              </div>
              <span className="text-ink-3">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
