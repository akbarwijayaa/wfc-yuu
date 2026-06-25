import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  const ctaHref = session ? (session.role === "admin" ? "/admin" : "/rekomendasi") : "/register";

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 px-8 py-16 text-white">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight">
          Temukan coffee shop terbaik di Yogyakarta sesuai preferensimu
        </h1>
        <p className="mt-4 max-w-xl text-amber-100">
          Sistem Penunjang Keputusan dengan metode <strong>MFEP</strong> (Multi-Factor Evaluation
          Process). Atur bobot kriteria — WiFi, harga, kenyamanan, lokasi, dan lainnya — lalu dapatkan
          peringkat yang objektif dan personal.
        </p>
        <Link
          href={ctaHref}
          className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-amber-800 hover:bg-amber-50"
        >
          {session ? "Mulai cari rekomendasi" : "Mulai sekarang"}
        </Link>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {[
          { t: "Multi-kriteria", d: "7 kriteria: WiFi, stop kontak, harga, jam buka, kebisingan, kenyamanan, lokasi." },
          { t: "Bobot personal", d: "Atur bobot tiap kriteria (total 100%). Hasil ranking menyesuaikan kebutuhanmu." },
          { t: "Transparan", d: "Lihat rincian perhitungan W×E per kriteria untuk setiap coffee shop." },
        ].map((f) => (
          <div key={f.t} className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-amber-800">{f.t}</h3>
            <p className="mt-2 text-sm text-slate-600">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
