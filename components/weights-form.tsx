"use client";

import { useActionState, useMemo, useState } from "react";
import { runRecommendationAction, type RecoState } from "@/app/actions/recommendation";

type Crit = { code: string; name: string; defaultWeight: number };
const initial: RecoState = {};

/**
 * Normalize importance values into integer percentages that always sum to 100
 * (largest-remainder method). This makes it impossible for the user to produce
 * an invalid total — sliders can be set freely.
 */
function normalize(importance: Record<string, number>, codes: string[]): Record<string, number> {
  const total = codes.reduce((s, c) => s + (importance[c] || 0), 0);
  if (total <= 0) {
    const base = Math.floor(100 / codes.length);
    const out = Object.fromEntries(codes.map((c) => [c, base]));
    let rem = 100 - base * codes.length;
    for (let i = 0; rem > 0; i++, rem--) out[codes[i]]++;
    return out;
  }
  const parts = codes.map((c) => {
    const exact = ((importance[c] || 0) / total) * 100;
    return { c, base: Math.floor(exact), frac: exact - Math.floor(exact) };
  });
  const out = Object.fromEntries(parts.map((p) => [p.c, p.base]));
  let rem = 100 - parts.reduce((s, p) => s + p.base, 0);
  for (const p of [...parts].sort((a, b) => b.frac - a.frac)) {
    if (rem <= 0) break;
    out[p.c]++;
    rem--;
  }
  return out;
}

export function WeightsForm({ criteria }: { criteria: Crit[] }) {
  const codes = useMemo(() => criteria.map((c) => c.code), [criteria]);
  const [state, action, pending] = useActionState(runRecommendationAction, initial);
  const [importance, setImportance] = useState<Record<string, number>>(
    Object.fromEntries(criteria.map((c) => [c.code, c.defaultWeight]))
  );

  const weights = useMemo(() => normalize(importance, codes), [importance, codes]);
  const allZero = codes.every((c) => (importance[c] || 0) === 0);

  const set = (code: string, v: number) =>
    setImportance((w) => ({ ...w, [code]: Math.max(0, Math.min(100, v || 0)) }));
  const reset = () =>
    setImportance(Object.fromEntries(criteria.map((c) => [c.code, c.defaultWeight])));

  return (
    <form action={action} className="space-y-6">
      {state.error && (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <p className="text-sm leading-relaxed text-ink-2">
        Geser tiap kriteria sesuai seberapa <span className="text-ink">penting</span> bagimu — bebas,
        boleh semua tinggi. <span className="text-ink">Bobot</span> dihitung otomatis dan selalu pas{" "}
        <span className="font-mono text-coffee">100%</span>.
      </p>

      <div className="space-y-5">
        {criteria.map((c) => (
          <div key={c.code}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm">
                <span className="badge">{c.code}</span>
                <span className="text-ink">{c.name}</span>
              </span>
              <span className="font-mono text-sm tabular-nums text-coffee">{weights[c.code]}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={importance[c.code]}
              onChange={(e) => set(c.code, Number(e.target.value))}
              className="w-full accent-coffee"
              aria-label={`Tingkat kepentingan ${c.name}`}
            />
            <input type="hidden" name={c.code} value={weights[c.code]} readOnly />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <span className="font-mono text-sm tabular-nums">
          <span className="text-ink-3">total bobot </span>
          <span className="text-coffee">100%</span>
        </span>
        <button
          type="button"
          onClick={reset}
          className="text-xs text-ink-3 transition-colors hover:text-ink"
        >
          reset default
        </button>
      </div>

      <div>
        <button disabled={pending || allZero} className="btn-primary w-full">
          {pending ? "Menghitung…" : "Hitung Rekomendasi"}
        </button>
        {allZero && (
          <p className="mt-2 text-center text-xs text-ink-3">
            Naikkan minimal satu kriteria untuk mulai menghitung.
          </p>
        )}
      </div>
    </form>
  );
}
