import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth-forms";
import { getSession } from "@/lib/session";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect(session.role === "admin" ? "/admin" : "/dashboard");

  return (
    <div className="mx-auto max-w-sm py-8">
      <p className="eyebrow">Daftar</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Buat akun pengunjung</h1>
      <p className="mt-2 text-sm text-ink-2">Simpan preferensi bobot &amp; riwayat rekomendasimu.</p>
      <div className="mt-6 panel p-6">
        <RegisterForm />
      </div>
      <p className="mt-4 text-center text-sm text-ink-2">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-coffee hover:text-coffee-2">
          Masuk
        </Link>
      </p>
    </div>
  );
}
