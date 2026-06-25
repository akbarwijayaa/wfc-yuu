import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth-forms";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "admin" ? "/admin" : "/dashboard");

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-bold text-slate-800">Masuk</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500">
          Demo: <code className="rounded bg-slate-100 px-1">admin / admin123</code> atau{" "}
          <code className="rounded bg-slate-100 px-1">user / user123</code>
        </p>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-amber-700 hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
