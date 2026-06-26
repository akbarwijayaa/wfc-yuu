"use client";

import { useActionState, useState } from "react";
import { runRecommendationAction, type RecoState } from "@/app/actions/recommendation";
import { equalWeights, type CriteriaCode } from "@/lib/mfep";

type Crit = { code: string; name: string; description?: string | null };
const initial: RecoState = {};

export function WeightsForm({ criteria }: { criteria: Crit[] }) {
  const [state, action, pending] = useActionState(runRecommendationAction, initial);
  const [checked, setChecked] = useState<Set<string>>(new Set(criteria.map((c) => c.code)));

  const weights = equalWeights(Array.from(checked) as CriteriaCode[]);
  const n = checked.size;

  const toggle = (code: string) =>
    setChecked((s) => {
      const next = new Set(s);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });

  return (
    <form action={action} className="space-y-6">
      {state.error && (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <p className="text-sm leading-relaxed text-ink-2">
        Centang kriteria yang <span className="text-ink">penting</span> bagimu. Bobot dibagi rata
        otomatis ke kriteria yang dipilih — totalnya selalu{" "}
        <span className="font-mono text-coffee">100%</span>.
      </p>

      <div className="space-y-2">
        {criteria.map((c) => {
          const on = checked.has(c.code);
          return (
            <label
              key={c.code}
              className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors ${
                on
                  ? "border-coffee/60 bg-coffee/[0.08]"
                  : "border-line bg-panel-2 hover:border-line-2"
              }`}
            >
              <input
                type="checkbox"
                name="criteria"
                value={c.code}
                checked={on}
                onChange={() => toggle(c.code)}
                className="mt-0.5 size-4 shrink-0 accent-coffee"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-ink">
                    <span className="badge">{c.code}</span>
                    {c.name}
                  </span>
                  <span
                    className={`font-mono text-xs tabular-nums ${on ? "text-coffee" : "text-ink-3"}`}
                  >
                    {on ? `${weights[c.code as CriteriaCode]}%` : "—"}
                  </span>
                </span>
                {c.description && (
                  <span className="mt-1 block text-xs leading-relaxed text-ink-3">{c.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <span className="font-mono text-sm">
          <span className="text-ink-3">{n} dari {criteria.length} dipilih</span>
        </span>
        <div className="flex gap-4 text-xs">
          <button
            type="button"
            onClick={() => setChecked(new Set(criteria.map((c) => c.code)))}
            className="text-ink-3 transition-colors hover:text-ink"
          >
            pilih semua
          </button>
          <button
            type="button"
            onClick={() => setChecked(new Set())}
            className="text-ink-3 transition-colors hover:text-ink"
          >
            kosongkan
          </button>
        </div>
      </div>

      <div>
        <button disabled={pending || n === 0} className="btn-primary w-full">
          {pending ? "Menghitung…" : "Hitung Rekomendasi"}
        </button>
        {n === 0 && (
          <p className="mt-2 text-center text-xs text-ink-3">Pilih minimal satu kriteria.</p>
        )}
      </div>
    </form>
  );
}
