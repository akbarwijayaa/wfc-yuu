import { prisma } from "@/lib/db";
import { WeightsForm } from "@/components/weights-form";

export default async function RekomendasiPage() {
  const criteria = await prisma.criterion.findMany({ orderBy: { code: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="eyebrow">Rekomendasi</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Pilih preferensi</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Centang kriteria yang penting bagimu — sistem membagi bobot rata ke pilihanmu (total selalu{" "}
          <span className="font-mono text-ink">100%</span>). Kriteria harga &amp; kebisingan bersifat{" "}
          <em>cost</em> (makin rendah makin baik), sudah ditangani otomatis.
        </p>
      </div>
      <div className="panel p-6">
        <WeightsForm
          criteria={criteria.map((c) => ({
            code: c.code,
            name: c.name,
            description: c.description,
          }))}
        />
      </div>
    </div>
  );
}
