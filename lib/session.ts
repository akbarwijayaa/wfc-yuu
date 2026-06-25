import "server-only";
import { cookies } from "next/headers";
import { signToken, verifyToken } from "./jwt";

const COOKIE = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = {
  sub: string; // user id
  username: string;
  role: string; // admin | visitor
  name: string;
};

export async function createSession(user: SessionUser): Promise<void> {
  const token = await signToken({ ...user });
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    return {
      sub: String(payload.sub ?? ""),
      username: String(payload.username ?? ""),
      role: String(payload.role ?? ""),
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}
