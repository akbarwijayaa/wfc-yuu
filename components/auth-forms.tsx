"use client";

import { useActionState } from "react";
import { loginAction, registerAction, type AuthState } from "@/app/actions/auth";

const initial: AuthState = {};

function ErrorMsg({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
      {error}
    </p>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="space-y-4">
      <ErrorMsg error={state.error} />
      <div>
        <label className="label">Username</label>
        <input name="username" className="input" placeholder="admin atau user" required />
      </div>
      <div>
        <label className="label">Password</label>
        <input name="password" type="password" className="input" placeholder="••••••••" required />
      </div>
      <button disabled={pending} className="btn-primary w-full">
        {pending ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial);
  return (
    <form action={action} className="space-y-4">
      <ErrorMsg error={state.error} />
      <div>
        <label className="label">Nama lengkap</label>
        <input name="name" className="input" required />
      </div>
      <div>
        <label className="label">Email</label>
        <input name="email" type="email" className="input" required />
      </div>
      <div>
        <label className="label">Username</label>
        <input name="username" className="input" required />
      </div>
      <div>
        <label className="label">Password</label>
        <input name="password" type="password" className="input" required minLength={6} />
      </div>
      <button disabled={pending} className="btn-primary w-full">
        {pending ? "Memproses…" : "Daftar"}
      </button>
    </form>
  );
}
