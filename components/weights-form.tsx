"use client";

import { useActionState, useState } from "react";
import { runRecommendationAction, type RecoState } from "@/app/actions/recommendation";

type Crit = { code: string; name: string; defaultWeight: number };
const initial: RecoState = {};

export function WeightsForm({ criteria }: { criteria: Crit[] }) {
  const [state, action, pending] = useActionState(runRecommendationAction, initial);
  const [weights, setWeights] = useState<Record<string, number>>(
    Object.fromEntries(criteria.map((c) => [c.code, c.defaultWeight]))
  );

  const total = criteria.reduce((sum, c) => sum + (Number(weights[c.code]) || 0), 0);
  const valid = total === 100;

  const set = (code: string, value: number) =>
    setWeights((w) => ({ ...w, [code]: Math.max(0, Math.min(100, value || 0)) }));

  const reset = () =>
    setWeights(Object.fromEntries(criteria.map((c) => [c.code, c.defaultWeight])));

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div className="space-y-3">
        {criteria.map((c) => (
          <div key={c.code} className="flex items-center gap-3">
            <div className="w-52 shrink-0 text-sm">
              <span className="font-semibold text-amber-800">{c.code}</span>{" "}
              <span className="text-slate-600">{c.name}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={weights[c.code]}
              onChange={(e) => set(c.code, Number(e.target.value))}
              className="flex-1 accent-amber-700"
            />
            <input
              type="number"
              name={c.code}
              min={0}
              max={100}
              value={weights[c.code]}
              onChange={(e) => set(c.code, Number(e.target.value))}
              className="w-16 rounded border border-slate-300 px-2 py-1 text-right text-sm"
            />
            <span className="w-4 text-sm text-slate-400">%</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
        <span className={`text-sm font-semibold ${valid ? "text-green-700" : "text-red-600"}`}>
          Total bobot: {total}% {valid ? "✓" : "(harus 100%)"}
        </span>
        <button
          type="button"
          onClick={reset}
          className="text-sm text-slate-500 hover:text-amber-800"
        >
          Reset default
        </button>
      </div>

      <button
        disabled={!valid || pending}
        className="w-full rounded-lg bg-amber-700 py-2.5 font-semibold text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Menghitung…" : "Hitung Rekomendasi"}
      </button>
    </form>
  );
}
