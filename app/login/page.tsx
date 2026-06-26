import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth-forms";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "admin" ? "/admin" : "/dashboard");

  return (
    <div className="mx-auto max-w-sm py-8">
      <p className="eyebrow">Masuk</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Selamat datang kembali</h1>
      <div className="mt-6 panel p-6">
        <LoginForm />
      </div>
      <p className="mt-4 rounded-md border border-line bg-panel px-3 py-2 font-mono text-xs text-ink-3">
        demo · admin/admin123 · user/user123
      </p>
      <p className="mt-4 text-center text-sm text-ink-2">
        Belum punya akun?{" "}
        <Link href="/register" className="text-coffee hover:text-coffee-2">
          Daftar
        </Link>
      </p>
    </div>
  );
}
