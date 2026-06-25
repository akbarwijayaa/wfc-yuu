"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ShopState } from "@/app/actions/admin";
import { ACCESS_LEVELS, COMFORT_LEVELS, NOISE_LEVELS } from "@/lib/validation";

export type ShopInitial = {
  name?: string;
  region?: string | null;
  address?: string | null;
  wifiSpeed?: number;
  powerOutlets?: number;
  avgPrice?: number;
  operatingHours?: number;
  noiseLevel?: string;
  comfort?: string;
  locationAccess?: string;
  description?: string | null;
  photoUrl?: string | null;
};

const input =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600";
const label = "mb-1 block text-sm font-medium text-slate-700";

export function CoffeeShopForm({
  action,
  initial = {},
  submitLabel,
}: {
  action: (prev: ShopState, formData: FormData) => Promise<ShopState>;
  initial?: ShopInitial;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {} as ShopState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div>
        <label className={label}>Nama coffee shop</label>
        <input name="name" className={input} defaultValue={initial.name ?? ""} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Wilayah</label>
          <input name="region" className={input} defaultValue={initial.region ?? ""} />
        </div>
        <div>
          <label className={label}>Alamat</label>
          <input name="address" className={input} defaultValue={initial.address ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className={label}>WiFi (Mbps)</label>
          <input name="wifiSpeed" type="number" min={0} className={input} defaultValue={initial.wifiSpeed ?? 0} required />
        </div>
        <div>
          <label className={label}>Stop kontak</label>
          <input name="powerOutlets" type="number" min={0} className={input} defaultValue={initial.powerOutlets ?? 0} required />
        </div>
        <div>
          <label className={label}>Harga (Rp)</label>
          <input name="avgPrice" type="number" min={0} className={input} defaultValue={initial.avgPrice ?? 0} required />
        </div>
        <div>
          <label className={label}>Jam/hari</label>
          <input name="operatingHours" type="number" min={0} max={24} className={input} defaultValue={initial.operatingHours ?? 0} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Kebisingan</label>
          <select name="noiseLevel" className={input} defaultValue={initial.noiseLevel ?? "Sedang"}>
            {NOISE_LEVELS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Kenyamanan</label>
          <select name="comfort" className={input} defaultValue={initial.comfort ?? "Cukup"}>
            {COMFORT_LEVELS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Lokasi/Akses</label>
          <select name="locationAccess" className={input} defaultValue={initial.locationAccess ?? "Sedang"}>
            {ACCESS_LEVELS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Deskripsi</label>
        <textarea name="description" className={input} rows={2} defaultValue={initial.description ?? ""} />
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={pending}
          className="rounded-lg bg-amber-700 px-5 py-2 font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : submitLabel}
        </button>
        <Link href="/admin/coffee" className="text-sm text-slate-500 hover:text-amber-800">
          Batal
        </Link>
      </div>
    </form>
  );
}
