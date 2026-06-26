import Link from "next/link";
import { getSession } from "@/lib/session";

const PREVIEW = [
  { rank: "01", name: "Epic Coffee", score: "4.5500" },
  { rank: "02", name: "Cethe Coffee", score: "4.4500" },
  { rank: "03", name: "Filosofi Kopi Jogja", score: "4.4000" },
  { rank: "04", name: "Titik Temu Coffee", score: "4.2500" },
];

const FEATURES = [
  { n: "01", t: "Multi-kriteria", d: "Tujuh faktor: WiFi, stop kontak, harga, jam buka, kebisingan, kenyamanan, lokasi." },
  { n: "02", t: "Bobot personal", d: "Atur bobot tiap kriteria (total 100%). Peringkat menyesuaikan kebutuhanmu." },
  { n: "03", t: "Transparan", d: "Lihat rincian W×E per kriteria di balik setiap skor." },
];

export default async function Home() {
  const session = await getSession();
  const ctaHref = session ? (session.role === "admin" ? "/admin" : "/rekomendasi") : "/register";

  return (
    <div className="space-y-20">
      {/* Hero — asymmetric: copy left, live result preview right */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow">MFEP · Yogyakarta</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Coffee shop terbaik,
            <br />
            ditentukan oleh datamu.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-2">
            Sistem penunjang keputusan dengan metode Multi-Factor Evaluation Process. Tentukan bobot
            kriteria, dan dapatkan peringkat coffee shop yang objektif — bukan sekadar rating bintang.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link href={ctaHref} className="btn-primary">
              {session ? "Mulai cari rekomendasi" : "Mulai sekarang"}
            </Link>
            {!session && (
              <Link href="/login" className="btn-ghost">
                Masuk
              </Link>
            )}
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="font-mono text-xs text-ink-3">hasil_rekomendasi · bobot default</span>
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-line-2" />
              <span className="h-2 w-2 rounded-full bg-line-2" />
              <span className="h-2 w-2 rounded-full bg-coffee" />
            </div>
          </div>
          <ul className="divide-y divide-line">
            {PREVIEW.map((r) => (
              <li key={r.rank} className="flex items-center gap-3 px-4 py-3">
                <span className="font-mono text-xs text-ink-3">{r.rank}</span>
                <span className={`flex-1 text-sm ${r.rank === "01" ? "text-ink" : "text-ink-2"}`}>
                  {r.name}
                </span>
                <span
                  className={`font-mono text-sm tabular-nums ${
                    r.rank === "01" ? "text-coffee" : "text-ink-2"
                  }`}
                >
                  {r.score}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Feature strip — one bordered grid, mono numerals, no floating cards */}
      <section className="panel grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {FEATURES.map((f) => (
          <div key={f.n} className="p-6">
            <p className="font-mono text-xs text-coffee">{f.n}</p>
            <h3 className="mt-3 text-sm font-medium text-ink">{f.t}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{f.d}</p>
          </div>
        ))}
      </section>

      {/* Stats */}
      <section className="flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-8">
        {[
          ["10", "coffee shop terdata"],
          ["7", "kriteria evaluasi"],
          ["MFEP", "metode perhitungan"],
        ].map(([v, l]) => (
          <div key={l}>
            <p className="font-mono text-2xl tracking-tight text-ink">{v}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-ink-3">{l}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
