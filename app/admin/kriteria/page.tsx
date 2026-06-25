import { prisma } from "@/lib/db";
import { CriteriaWeightsForm } from "@/components/criteria-weights-form";

export default async function AdminKriteriaPage() {
  const criteria = await prisma.criterion.findMany({ orderBy: { code: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Kelola Kriteria &amp; Bobot Default</h1>
        <p className="mt-1 text-sm text-slate-500">
          Bobot default dipakai sebagai nilai awal saat pengunjung membuka halaman rekomendasi. Total
          harus 100%.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <CriteriaWeightsForm
          criteria={criteria.map((c) => ({
            code: c.code,
            name: c.name,
            defaultWeight: c.defaultWeight,
            type: c.type,
          }))}
        />
      </div>
    </div>
  );
}
