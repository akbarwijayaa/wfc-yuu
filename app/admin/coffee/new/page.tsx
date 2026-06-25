import { CoffeeShopForm } from "@/components/coffee-shop-form";
import { createShopAction } from "@/app/actions/admin";

export default function NewCoffeeShopPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Tambah Coffee Shop</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <CoffeeShopForm action={createShopAction} submitLabel="Tambah Coffee Shop" />
      </div>
    </div>
  );
}
