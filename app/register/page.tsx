import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth-forms";
import { getSession } from "@/lib/session";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect(session.role === "admin" ? "/admin" : "/dashboard");

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-bold text-slate-800">Daftar sebagai Pengunjung</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500">
          Buat akun untuk menyimpan preferensi & riwayat rekomendasi.
        </p>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-amber-700 hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
