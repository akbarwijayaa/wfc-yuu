import { prisma } from "@/lib/db";
import { CriteriaWeightsForm } from "@/components/criteria-weights-form";

export default async function AdminKriteriaPage() {
  const criteria = await prisma.criterion.findMany({ orderBy: { code: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="eyebrow">Admin · Kriteria</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Bobot default kriteria</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Dipakai sebagai nilai awal saat pengunjung membuka halaman rekomendasi. Total harus{" "}
          <span className="font-mono text-ink">100%</span>.
        </p>
      </div>
      <div className="panel p-6">
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
