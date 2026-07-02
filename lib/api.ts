import "server-only";
import { getSession, type SessionUser } from "@/lib/session";

/** Parse a JSON request body, returning `undefined` on malformed input. */
export async function parseJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}

export function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

/**
 * Guard for admin-only endpoints. Returns the session on success, or a ready
 * Response (401/403) to return directly. Mirrors the `requireAdmin` guard used
 * by the server actions (app/actions/admin.ts).
 */
export async function requireAdmin(): Promise<
  { session: SessionUser } | { error: Response }
> {
  const session = await getSession();
  if (!session) return { error: jsonError("Belum login", 401) };
  if (session.role !== "admin") return { error: jsonError("Butuh akses admin", 403) };
  return { session };
}
