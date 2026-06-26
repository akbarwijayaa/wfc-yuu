"use client";

import { useActionState, useState } from "react";
import { updateWeightsAction, type WeightsState } from "@/app/actions/admin";

type Crit = { code: string; name: string; defaultWeight: number; type: string };

export function CriteriaWeightsForm({ criteria }: { criteria: Crit[] }) {
  const [state, action, pending] = useActionState(updateWeightsAction, {} as WeightsState);
  const [w, setW] = useState<Record<string, number>>(
    Object.fromEntries(criteria.map((c) => [c.code, c.defaultWeight]))
  );

  const total = criteria.reduce((s, c) => s + (Number(w[c.code]) || 0), 0);
  const valid = total === 100;

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-md border border-green-900/50 bg-green-950/40 px-3 py-2 text-sm text-green-300">
          Bobot default tersimpan.
        </p>
      )}

      <div className="divide-y divide-line">
        {criteria.map((c) => (
          <div key={c.code} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="badge">{c.code}</span>
              <span className="text-ink">{c.name}</span>
              <span className="font-mono text-xs text-ink-3">{c.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name={c.code}
                min={0}
                max={100}
                value={w[c.code]}
                onChange={(e) =>
                  setW((prev) => ({ ...prev, [c.code]: Math.max(0, Math.min(100, Number(e.target.value) || 0)) }))
                }
                className="input w-20 px-2 py-1.5 text-right font-mono tabular-nums"
              />
              <span className="text-sm text-ink-3">%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <span className="font-mono text-sm tabular-nums">
          <span className="text-ink-3">total </span>
          <span className={valid ? "text-coffee" : "text-red-400"}>{total}%</span>
        </span>
        <button disabled={!valid || pending} className="btn-primary">
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
