import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/app/actions/auth";

export default async function Nav() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight text-ink">
          spk<span className="text-coffee">/</span>coffee
        </Link>

        <div className="flex items-center gap-5">
          {session ? (
            <>
              {session.role === "admin" ? (
                <>
                  <Link href="/admin" className="navlink">Dashboard</Link>
                  <Link href="/admin/coffee" className="navlink">Coffee Shop</Link>
                  <Link href="/admin/kriteria" className="navlink">Kriteria</Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="navlink">Dashboard</Link>
                  <Link href="/rekomendasi" className="navlink">Rekomendasi</Link>
                  <Link href="/riwayat" className="navlink">Riwayat</Link>
                </>
              )}
              <span className="hidden items-center gap-2 text-xs text-ink-3 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-coffee" />
                {session.name}
              </span>
              <form action={logoutAction}>
                <button className="navlink">Keluar</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="navlink">Masuk</Link>
              <Link href="/register" className="btn-primary">Daftar</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
