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
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Bobot default tersimpan.
        </p>
      )}

      <div className="divide-y divide-slate-100">
        {criteria.map((c) => (
          <div key={c.code} className="flex items-center justify-between py-3">
            <div className="text-sm">
              <span className="font-semibold text-amber-800">{c.code}</span>{" "}
              <span className="text-slate-700">{c.name}</span>{" "}
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                {c.type}
              </span>
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
                className="w-20 rounded border border-slate-300 px-2 py-1 text-right text-sm"
              />
              <span className="text-sm text-slate-400">%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
        <span className={`text-sm font-semibold ${valid ? "text-green-700" : "text-red-600"}`}>
          Total: {total}% {valid ? "✓" : "(harus 100%)"}
        </span>
        <button
          disabled={!valid || pending}
          className="rounded-lg bg-amber-700 px-5 py-2 font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
        >
          {pending ? "Menyimpan…" : "Simpan Bobot Default"}
        </button>
      </div>
    </form>
  );
}
