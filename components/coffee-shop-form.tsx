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
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div>
        <label className="label">Nama coffee shop</label>
        <input name="name" className="input" defaultValue={initial.name ?? ""} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Wilayah</label>
          <input name="region" className="input" defaultValue={initial.region ?? ""} />
        </div>
        <div>
          <label className="label">Alamat</label>
          <input name="address" className="input" defaultValue={initial.address ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="label">WiFi (Mbps)</label>
          <input name="wifiSpeed" type="number" min={0} className="input" defaultValue={initial.wifiSpeed ?? 0} required />
        </div>
        <div>
          <label className="label">Stop kontak</label>
          <input name="powerOutlets" type="number" min={0} className="input" defaultValue={initial.powerOutlets ?? 0} required />
        </div>
        <div>
          <label className="label">Harga (Rp)</label>
          <input name="avgPrice" type="number" min={0} className="input" defaultValue={initial.avgPrice ?? 0} required />
        </div>
        <div>
          <label className="label">Jam/hari</label>
          <input name="operatingHours" type="number" min={0} max={24} className="input" defaultValue={initial.operatingHours ?? 0} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Kebisingan</label>
          <select name="noiseLevel" className="input" defaultValue={initial.noiseLevel ?? "Sedang"}>
            {NOISE_LEVELS.map((v) => (
              <option key={v} value={v} className="bg-panel">{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Kenyamanan</label>
          <select name="comfort" className="input" defaultValue={initial.comfort ?? "Cukup"}>
            {COMFORT_LEVELS.map((v) => (
              <option key={v} value={v} className="bg-panel">{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Lokasi/Akses</label>
          <select name="locationAccess" className="input" defaultValue={initial.locationAccess ?? "Sedang"}>
            {ACCESS_LEVELS.map((v) => (
              <option key={v} value={v} className="bg-panel">{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Deskripsi</label>
        <textarea name="description" className="input" rows={2} defaultValue={initial.description ?? ""} />
      </div>

      <div className="flex items-center gap-3 border-t border-line pt-5">
        <button disabled={pending} className="btn-primary">
          {pending ? "Menyimpan…" : submitLabel}
        </button>
        <Link href="/admin/coffee" className="text-sm text-ink-3 hover:text-ink">
          Batal
        </Link>
      </div>
    </form>
  );
}
