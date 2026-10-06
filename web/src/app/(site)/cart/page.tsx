import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { getProducts, getSettings, toSummary } from "@/lib/data";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default async function CartPage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <h1 className="display text-6xl sm:text-7xl">Your cart</h1>
      <div className="mt-10">
        <CartView products={products.map(toSummary)} settings={settings} />
      </div>
    </div>
  );
}
