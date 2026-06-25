import { prisma } from "@/lib/db";
import { WeightsForm } from "@/components/weights-form";

export default async function RekomendasiPage() {
  const criteria = await prisma.criterion.findMany({ orderBy: { code: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Atur Preferensi Bobot</h1>
        <p className="mt-1 text-sm text-slate-500">
          Geser bobot tiap kriteria sesuai kebutuhanmu. Total harus tepat <strong>100%</strong>.
          Kriteria harga &amp; kebisingan bersifat <em>cost</em> (semakin rendah semakin baik) — sudah
          ditangani otomatis dalam perhitungan.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <WeightsForm
          criteria={criteria.map((c) => ({
            code: c.code,
            name: c.name,
            defaultWeight: c.defaultWeight,
          }))}
        />
      </div>
    </div>
  );
}
