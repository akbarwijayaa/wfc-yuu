import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Next.js 16 "proxy" convention (replaces middleware) — route guard.
export async function proxy(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  let session: Awaited<ReturnType<typeof verifyToken>> | null = null;
  if (token) {
    try {
      session = await verifyToken(token);
    } catch {
      session = null;
    }
  }

  const { pathname } = req.nextUrl;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && session.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/rekomendasi/:path*", "/riwayat/:path*"],
};
