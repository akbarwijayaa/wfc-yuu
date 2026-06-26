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
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="eyebrow">Admin · Coffee</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Ubah Coffee Shop</h1>
      </div>
      <div className="panel p-6">
        <CoffeeShopForm action={action} initial={shop} submitLabel="Simpan Perubahan" />
      </div>
    </div>
  );
}
