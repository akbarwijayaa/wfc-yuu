import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CoffeeShopForm } from "@/components/coffee-shop-form";
import { updateShopAction } from "@/app/actions/admin";

export default async function EditCoffeeShopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = await prisma.coffeeShop.findUnique({ where: { id: Number(id) } });
  if (!shop) notFound();

  const action = updateShopAction.bind(null, shop.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Ubah Coffee Shop</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <CoffeeShopForm action={action} initial={shop} submitLabel="Simpan Perubahan" />
      </div>
    </div>
  );
}
