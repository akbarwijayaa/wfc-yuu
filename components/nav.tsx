import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/app/actions/auth";

export default async function Nav() {
  const session = await getSession();

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-amber-800">
          ☕ SPK Coffee Shop
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {session ? (
            <>
              {session.role === "admin" ? (
                <>
                  <Link href="/admin" className="hover:text-amber-800">Dashboard</Link>
                  <Link href="/admin/coffee" className="hover:text-amber-800">Coffee Shop</Link>
                  <Link href="/admin/kriteria" className="hover:text-amber-800">Kriteria</Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="hover:text-amber-800">Dashboard</Link>
                  <Link href="/rekomendasi" className="hover:text-amber-800">Rekomendasi</Link>
                  <Link href="/riwayat" className="hover:text-amber-800">Riwayat</Link>
                </>
              )}
              <span className="hidden text-slate-500 sm:inline">Hai, {session.name}</span>
              <form action={logoutAction}>
                <button className="rounded bg-slate-100 px-3 py-1 hover:bg-slate-200">Keluar</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-amber-800">Masuk</Link>
              <Link
                href="/register"
                className="rounded bg-amber-700 px-3 py-1 text-white hover:bg-amber-800"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
