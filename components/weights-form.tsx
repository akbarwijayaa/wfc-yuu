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
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div className="space-y-3.5">
        {criteria.map((c) => (
          <div key={c.code} className="flex items-center gap-4">
            <div className="w-48 shrink-0 text-sm">
              <span className="badge mr-2">{c.code}</span>
              <span className="text-ink-2">{c.name}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={weights[c.code]}
              onChange={(e) => set(c.code, Number(e.target.value))}
              className="h-1 flex-1 accent-coffee"
            />
            <input
              type="number"
              name={c.code}
              min={0}
              max={100}
              value={weights[c.code]}
              onChange={(e) => set(c.code, Number(e.target.value))}
              className="w-16 rounded-md border border-line bg-bg px-2 py-1 text-right font-mono text-sm text-ink tabular-nums outline-none focus:border-coffee"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <span className="font-mono text-sm tabular-nums">
          <span className="text-ink-3">total </span>
          <span className={valid ? "text-coffee" : "text-red-400"}>{total}%</span>
        </span>
        <button type="button" onClick={reset} className="text-xs text-ink-3 transition-colors hover:text-ink">
          reset default
        </button>
      </div>

      <button disabled={!valid || pending} className="btn-primary w-full">
        {pending ? "Menghitung…" : "Hitung Rekomendasi"}
      </button>
    </form>
  );
}
