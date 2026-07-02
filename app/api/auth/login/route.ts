import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { createSession } from "@/lib/session";
import { parseJson, jsonError } from "@/lib/api";

// REST wrapper around loginAction (app/actions/auth.ts). Verifies credentials,
// opens a session, and returns the user role instead of redirecting.
export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await parseJson(req));
  if (!parsed.success) return jsonError("Input tidak valid", 400);
  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return jsonError("Username atau password salah", 401);
  }

  await createSession({
    sub: String(user.id),
    username: user.username,
    role: user.role,
    name: user.name,
  });

  return Response.json({ name: user.name, username: user.username, role: user.role });
}
