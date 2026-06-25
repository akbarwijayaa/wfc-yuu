"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { coffeeShopSchema, weightsSchema, type CoffeeShopInput } from "@/lib/validation";

export type ShopState = { error?: string };
export type WeightsState = { error?: string; success?: boolean };

async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "admin") redirect("/login");
}

function toData(d: CoffeeShopInput) {
  return {
    name: d.name,
    address: d.address || null,
    region: d.region || null,
    wifiSpeed: d.wifiSpeed,
    powerOutlets: d.powerOutlets,
    avgPrice: d.avgPrice,
    operatingHours: d.operatingHours,
    noiseLevel: d.noiseLevel,
    comfort: d.comfort,
    locationAccess: d.locationAccess,
    description: d.description || null,
    photoUrl: d.photoUrl || null,
  };
}

export async function createShopAction(_prev: ShopState, formData: FormData): Promise<ShopState> {
  await requireAdmin();
  const parsed = coffeeShopSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  await prisma.coffeeShop.create({ data: toData(parsed.data) });
  redirect("/admin/coffee");
}

export async function updateShopAction(
  id: number,
  _prev: ShopState,
  formData: FormData
): Promise<ShopState> {
  await requireAdmin();
  const parsed = coffeeShopSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  await prisma.coffeeShop.update({ where: { id }, data: toData(parsed.data) });
  redirect("/admin/coffee");
}

export async function deleteShopAction(id: number): Promise<void> {
  await requireAdmin();
  // Remove references in past recommendations first (FK), then the shop.
  await prisma.$transaction([
    prisma.recommendationDetail.deleteMany({ where: { coffeeShopId: id } }),
    prisma.coffeeShop.delete({ where: { id } }),
  ]);
  revalidatePath("/admin/coffee");
}

export async function updateWeightsAction(
  _prev: WeightsState,
  formData: FormData
): Promise<WeightsState> {
  await requireAdmin();
  const parsed = weightsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Total bobot harus 100%" };
  }
  const weights = parsed.data as Record<string, number>;
  await prisma.$transaction(
    Object.entries(weights).map(([code, defaultWeight]) =>
      prisma.criterion.update({ where: { code }, data: { defaultWeight } })
    )
  );
  revalidatePath("/admin/kriteria");
  return { success: true };
}
