import { CoffeeShopForm } from "@/components/coffee-shop-form";
import { createShopAction } from "@/app/actions/admin";

export default function NewCoffeeShopPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="eyebrow">Admin · Coffee</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Tambah Coffee Shop</h1>
      </div>
      <div className="panel p-6">
        <CoffeeShopForm action={createShopAction} submitLabel="Tambah Coffee Shop" />
      </div>
    </div>
  );
}
