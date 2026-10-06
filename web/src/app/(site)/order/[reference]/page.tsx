import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderPlaced } from "@/components/OrderPlaced";
import { CONTACT } from "@/data/products";
import { isSupabaseConfigured } from "@/lib/env";
import { formatMoney } from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Needs the order's secret token from the checkout redirect, so nobody can
// read someone else's order by guessing references.
export default async function OrderPage({ params, searchParams }: PageProps<"/order/[reference]">) {
  const { reference } = await params;
  const t = (await searchParams).t;
  const token = typeof t === "string" ? t : "";
  if (!isSupabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY || !UUID.test(token) || !/^BRY-\d{6,}$/.test(reference)) notFound();

  const db = createAdminClient();
  const { data: order } = await db
    .from("orders")
    .select("id, reference, customer_name, city, address, subtotal, delivery_fee, total, currency, created_at, order_items (product_name, quantity, unit_price, line_total)")
    .eq("reference", reference)
    .eq("access_token", token)
    .maybeSingle();
  if (!order) notFound();

  const firstName = order.customer_name.split(" ")[0];
  const money = (n: number | string) => formatMoney(Number(n), order.currency);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <OrderPlaced firstName={firstName} reference={order.reference} />

      <section aria-labelledby="summary-title" className="mt-12 rounded-[2rem] bg-paper p-6 sm:p-8">
        <h2 id="summary-title" className="display text-2xl">Order {order.reference}</h2>
        <ul className="mt-6 divide-y divide-line">
          {order.order_items.map((i) => (
            <li key={i.product_name} className="flex justify-between py-3 text-sm">
              <span>{i.quantity} × {i.product_name}</span>
              <span>{money(i.line_total)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd>{Number(order.delivery_fee) === 0 ? "Free" : money(order.delivery_fee)}</dd></div>
          <div className="flex items-baseline justify-between pt-2">
            <dt className="font-display font-extrabold uppercase tracking-widest">To pay in cash</dt>
            <dd className="display text-3xl">{money(order.total)}</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-espresso-soft">
          Delivering to {order.address}, {order.city}.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/shop" className="btn btn-dark">Keep shopping</Link>
        <a href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi Brydge, about my order ${order.reference}`)}`} className="btn btn-outline" target="_blank" rel="noreferrer">
          Message us
        </a>
      </div>
    </div>
  );
}
