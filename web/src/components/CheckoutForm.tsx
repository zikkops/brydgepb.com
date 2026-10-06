"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { placeOrder, type ActionResult } from "@/app/actions";
import { OrderSummary, useCartLines } from "@/components/CartView";
import { cart } from "@/lib/cart";
import type { ProductSummary } from "@/lib/data";
import { formatMoney, type DeliverySettings } from "@/lib/pricing";

export function CheckoutForm({ products, settings }: { products: ProductSummary[]; settings: DeliverySettings }) {
  const router = useRouter();
  const lines = useCartLines(products);
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(placeOrder, null);

  // On success: empty the cart and go to the confirmation page.
  useEffect(() => {
    if (state?.ok && state.url) {
      cart.clear();
      router.replace(state.url);
    }
  }, [state, router]);

  if (lines.length === 0 && !state?.ok) {
    return (
      <div className="rounded-[2rem] bg-paper px-6 py-16 text-center">
        <p className="display text-3xl">Nothing to check out yet</p>
        <Link href="/shop" className="btn btn-dark mt-8">Shop the bars</Link>
      </div>
    );
  }

  const items = JSON.stringify(lines.map((l) => ({ slug: l.product.slug, quantity: l.quantity })));

  return (
    // Submitted via startTransition rather than <form action> so the fields
    // aren't cleared when the server sends back an error.
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="grid gap-10 lg:grid-cols-[1.4fr_1fr]"
    >
      <input type="hidden" name="items" value={items} />
      {/* Honeypot: people never see this field; bots fill it in. */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="space-y-10">
        <fieldset className="space-y-5">
          <legend className="display mb-5 text-3xl">Your details</legend>
          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input id="name" name="name" required autoComplete="name" className="field" maxLength={200} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="label">Phone (WhatsApp)</label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" className="field" placeholder="+961 …" maxLength={30} />
            </div>
            <div>
              <label htmlFor="email" className="label">Email <span className="normal-case tracking-normal opacity-60">(optional)</span></label>
              <input id="email" name="email" type="email" autoComplete="email" className="field" maxLength={200} />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="display mb-5 text-3xl">Delivery</legend>
          <div>
            <label htmlFor="city" className="label">City / area</label>
            <input id="city" name="city" required autoComplete="address-level2" className="field" placeholder="e.g. Achrafieh, Beirut" maxLength={100} />
          </div>
          <div>
            <label htmlFor="address" className="label">Address</label>
            <textarea id="address" name="address" required rows={3} autoComplete="street-address" className="field" placeholder="Street, building, floor, landmark" maxLength={1000} />
          </div>
          <div>
            <label htmlFor="notes" className="label">Notes <span className="normal-case tracking-normal opacity-60">(optional)</span></label>
            <textarea id="notes" name="notes" rows={2} className="field" placeholder="Best time to call, delivery instructions…" maxLength={2000} />
          </div>
        </fieldset>

        <div className="flex items-start gap-4 rounded-[2rem] border-2 border-espresso p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-espresso font-display font-black text-cream">$</span>
          <div>
            <p className="font-display font-extrabold uppercase tracking-widest">Cash on delivery</p>
            <p className="mt-1 text-sm text-espresso-soft">We call you to confirm, then you pay the driver in cash when your bars arrive.</p>
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="display mb-5 text-3xl">Your order</h2>
        <ul className="mb-4 space-y-3">
          {lines.map((l) => (
            <li key={l.product.slug} className="flex items-center gap-3 text-sm">
              <span className="size-8 shrink-0 rounded-full" style={{ background: l.product.color }} />
              <span className="flex-1">{l.quantity} × {l.product.name}</span>
              <span className="font-semibold">{formatMoney(l.unitPrice * l.quantity, settings.currency)}</span>
            </li>
          ))}
        </ul>
        <OrderSummary lines={lines} settings={settings} />
        {state && !state.ok && (
          <p role="alert" className="mt-4 rounded-2xl bg-strawberry px-4 py-3 text-sm text-paper">{state.error}</p>
        )}
        <button type="submit" disabled={pending || lines.some((l) => !l.product.inStock)} className="btn btn-dark mt-4 w-full">
          {pending ? "Placing your order…" : "Place order"}
        </button>
        <Link href="/cart" className="mt-3 block text-center text-sm underline underline-offset-4">Back to cart</Link>
      </aside>
    </form>
  );
}
