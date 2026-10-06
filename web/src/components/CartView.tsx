"use client";

import Link from "next/link";
import { BarArt } from "@/components/BarArt";
import { QuantityStepper } from "@/components/QuantityStepper";
import { cart, useCart } from "@/lib/cart";
import type { ProductSummary } from "@/lib/data";
import { calculateTotals, formatMoney, MAX_QTY_PER_ITEM, type DeliverySettings } from "@/lib/pricing";

// Joins the cart (slugs + quantities from localStorage) with today's products
// and prices from the server. Unknown slugs (a product that was removed) drop out.
export function useCartLines(products: ProductSummary[]) {
  const { items } = useCart();
  const lines = items.flatMap((i) => {
    const product = products.find((p) => p.slug === i.slug);
    return product ? [{ product, quantity: i.quantity, unitPrice: product.price }] : [];
  });
  return lines;
}

export function OrderSummary({ lines, settings }: { lines: ReturnType<typeof useCartLines>; settings: DeliverySettings }) {
  const totals = calculateTotals(lines, settings);
  const toFree = settings.freeDeliveryOver !== null ? settings.freeDeliveryOver - totals.subtotal : 0;
  return (
    <div className="rounded-[2rem] bg-paper p-6 sm:p-8">
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(totals.subtotal, settings.currency)}</dd></div>
        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd>{totals.deliveryFee === 0 ? "Free" : formatMoney(totals.deliveryFee, settings.currency)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <dt className="font-display font-extrabold uppercase tracking-widest">Total</dt>
          <dd className="display text-3xl">{formatMoney(totals.total, settings.currency)}</dd>
        </div>
      </dl>
      {toFree > 0 && totals.deliveryFee > 0 && (
        <p className="mt-4 rounded-2xl bg-almond/30 px-4 py-3 text-sm">
          Add {formatMoney(toFree, settings.currency)} more for free delivery.
        </p>
      )}
      <p className="mt-4 text-xs text-espresso-soft">Pay cash when your order arrives.</p>
    </div>
  );
}

export function CartView({ products, settings }: { products: ProductSummary[]; settings: DeliverySettings }) {
  const lines = useCartLines(products);

  if (lines.length === 0) {
    return (
      <div className="rounded-[2rem] bg-paper px-6 py-16 text-center">
        <p className="display text-3xl">Your cart is empty</p>
        <p className="mt-3 text-espresso-soft">Four flavours are waiting for you.</p>
        <Link href="/shop" className="btn btn-dark mt-8">Shop the bars</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <ul className="divide-y divide-line border-y border-line">
        {lines.map(({ product: p, quantity }) => (
          <li key={p.slug} className="flex flex-wrap items-center gap-4 py-6 sm:flex-nowrap sm:gap-6">
            <Link href={`/shop/${p.slug}`} className="w-32 shrink-0 rounded-2xl p-3 sm:w-40" style={{ background: p.color }}>
              <BarArt name={p.name} color={p.color} ink={p.ink} protein={p.protein} className="w-full -rotate-6" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/shop/${p.slug}`} className="display text-2xl hover:underline">{p.name}</Link>
              <p className="text-sm text-espresso-soft">Box of {p.barsPerBox} · {formatMoney(p.price, settings.currency)}</p>
              {!p.inStock && <p className="mt-1 text-sm font-semibold text-strawberry">Sold out: remove it to check out.</p>}
            </div>
            <QuantityStepper value={quantity} onChange={(q) => cart.set(p.slug, q)} max={MAX_QTY_PER_ITEM} label={`Boxes of ${p.name}`} />
            <p className="w-20 text-right font-display font-extrabold">{formatMoney(p.price * quantity, settings.currency)}</p>
            <button type="button" onClick={() => cart.remove(p.slug)} className="min-h-11 text-sm text-espresso-soft underline underline-offset-4 hover:text-strawberry">
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary lines={lines} settings={settings} />
        {lines.some((l) => !l.product.inStock) ? (
          <p className="mt-4 text-sm text-strawberry">Remove sold-out items to continue.</p>
        ) : (
          <Link href="/checkout" className="btn btn-dark mt-4 w-full">Checkout</Link>
        )}
        <Link href="/shop" className="mt-3 block text-center text-sm underline underline-offset-4">Keep shopping</Link>
      </div>
    </div>
  );
}
