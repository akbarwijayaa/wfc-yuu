"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema, loginSchema } from "@/lib/validation";
import { createSession, destroySession } from "@/lib/session";

export type AuthState = { error?: string };

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }
  const { name, email, username, password } = parsed.data;

  const exists = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
  if (exists) return { error: "Username atau email sudah terdaftar" };

  const user = await prisma.user.create({
    data: { name, email, username, password: bcrypt.hashSync(password, 10), role: "visitor" },
  });

  await createSession({ sub: String(user.id), username: user.username, role: user.role, name: user.name });
  redirect("/dashboard");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Input tidak valid" };
  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return { error: "Username atau password salah" };
  }

  await createSession({ sub: String(user.id), username: user.username, role: user.role, name: user.name });
  redirect(user.role === "admin" ? "/admin" : "/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
