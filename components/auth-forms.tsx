"use client";

import { useActionState } from "react";
import { loginAction, registerAction, type AuthState } from "@/app/actions/auth";

const initial: AuthState = {};
const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600";

function ErrorMsg({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="space-y-4">
      <ErrorMsg error={state.error} />
      <div>
        <label className="mb-1 block text-sm font-medium">Username</label>
        <input name="username" className={inputClass} placeholder="admin atau user" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <input name="password" type="password" className={inputClass} required />
      </div>
      <button
        disabled={pending}
        className="w-full rounded-lg bg-amber-700 py-2 font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
      >
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
        <label className="mb-1 block text-sm font-medium">Nama lengkap</label>
        <input name="name" className={inputClass} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input name="email" type="email" className={inputClass} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Username</label>
        <input name="username" className={inputClass} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <input name="password" type="password" className={inputClass} required minLength={6} />
      </div>
      <button
        disabled={pending}
        className="w-full rounded-lg bg-amber-700 py-2 font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
      >
        {pending ? "Memproses…" : "Daftar"}
      </button>
    </form>
  );
}
