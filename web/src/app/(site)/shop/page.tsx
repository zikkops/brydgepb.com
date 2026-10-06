import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { getProducts, getSettings, toSummary } from "@/lib/data";
import { formatMoney } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop Brydge protein bars: Almond, Strawberry, Dark Chocolate and Coconut Matcha. Boxes of 12, cash on delivery.",
};

export default async function ShopPage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return (
    <>
      <PageIntro eyebrow="Shop" title="Pick your fuel." lead="Four flavours, twelve bars a box. Mix as many boxes as you like, then pay cash when they reach your door." />
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={toSummary(p)} protein={p.nutrition.protein} currency={settings.currency} />
          ))}
        </Reveal>
        <ul className="mt-16 grid gap-4 border-t border-line pt-10 text-sm sm:grid-cols-3">
          <li><strong className="font-display uppercase tracking-widest">Cash on delivery.</strong> Pay when your order arrives.</li>
          <li>
            <strong className="font-display uppercase tracking-widest">Delivery.</strong>{" "}
            {settings.deliveryFee > 0 ? `${formatMoney(settings.deliveryFee, settings.currency)} anywhere we deliver` : "Free"}
            {settings.freeDeliveryOver !== null && settings.deliveryFee > 0 && `, free over ${formatMoney(settings.freeDeliveryOver, settings.currency)}`}.
          </li>
          <li><strong className="font-display uppercase tracking-widest">We call first.</strong> Every order is confirmed by phone.</li>
        </ul>
      </section>
    </>
  );
}
