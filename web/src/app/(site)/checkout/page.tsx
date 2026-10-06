import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getProducts, getSettings, toSummary } from "@/lib/data";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <p className="eyebrow text-espresso-soft">Cash on delivery</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">Checkout</h1>
      <div className="mt-10">
        <CheckoutForm products={products.map(toSummary)} settings={settings} />
      </div>
    </div>
  );
}
