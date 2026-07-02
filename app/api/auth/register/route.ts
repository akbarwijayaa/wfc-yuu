import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { createSession } from "@/lib/session";
import { parseJson, jsonError } from "@/lib/api";

// REST wrapper around registerAction (app/actions/auth.ts). Creates a visitor
// account, opens a session, and returns the user instead of redirecting.
export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await parseJson(req));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Input tidak valid", 400);
  }
  const { name, email, username, password } = parsed.data;

  const exists = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
  if (exists) return jsonError("Username atau email sudah terdaftar", 409);

  const user = await prisma.user.create({
    data: { name, email, username, password: bcrypt.hashSync(password, 10), role: "visitor" },
  });

  await createSession({
    sub: String(user.id),
    username: user.username,
    role: user.role,
    name: user.name,
  });

  return Response.json(
    { id: user.id, name: user.name, username: user.username, role: user.role },
    { status: 201 }
  );
}
