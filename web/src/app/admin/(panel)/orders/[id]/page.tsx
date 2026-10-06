import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "../../StatusBadge";
import { updateOrderStatus } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/orders";
import { formatMoney } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Beirut" });

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items (id, product_name, unit_price, quantity, line_total), order_events (id, from_status, to_status, note, created_at)")
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();

  const money = (n: string | number) => formatMoney(Number(n), order.currency);
  const phoneDigits = String(order.customer_phone).replace(/\D/g, "");
  const events = [...(order.order_events as { id: number; from_status: OrderStatus | null; to_status: OrderStatus | null; note: string | null; created_at: string }[])].sort(
    (a, b) => b.created_at.localeCompare(a.created_at),
  );

  return (
    <>
      <Link href="/admin" className="text-sm underline underline-offset-4">← All orders</Link>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <h1 className="display text-4xl">{order.reference}</h1>
        <StatusBadge status={order.status} />
        <span className="text-sm text-espresso-soft">Placed {when(order.created_at)} · Cash on delivery</span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-3xl bg-paper p-6">
            <h2 className="eyebrow text-espresso-soft">Items</h2>
            <table className="mt-4 w-full text-sm">
              <tbody className="divide-y divide-line">
                {(order.order_items as { id: number; product_name: string; unit_price: string; quantity: number; line_total: string }[]).map((i) => (
                  <tr key={i.id}>
                    <td className="py-2">{i.product_name}</td>
                    <td className="py-2 text-espresso-soft">{i.quantity} × {money(i.unit_price)}</td>
                    <td className="py-2 text-right font-semibold">{money(i.line_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>{money(order.delivery_fee)}</dd></div>
              <div className="flex justify-between text-base font-bold"><dt>Collect in cash</dt><dd>{money(order.total)}</dd></div>
            </dl>
          </section>

          <section className="rounded-3xl bg-paper p-6">
            <h2 className="eyebrow text-espresso-soft">Customer</h2>
            <p className="mt-3 text-lg font-semibold">{order.customer_name}</p>
            <p className="mt-1 flex flex-wrap gap-3 text-sm">
              <a href={`tel:${order.customer_phone}`} className="underline underline-offset-4">{order.customer_phone}</a>
              <a href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hi ${order.customer_name.split(" ")[0]}, this is Brydge about your order ${order.reference}.`)}`} target="_blank" rel="noreferrer" className="underline underline-offset-4">WhatsApp</a>
              {order.customer_email && <a href={`mailto:${order.customer_email}`} className="underline underline-offset-4">{order.customer_email}</a>}
            </p>
            <h2 className="eyebrow mt-6 text-espresso-soft">Deliver to</h2>
            <p className="mt-2 whitespace-pre-line">{order.address}</p>
            <p className="font-semibold">{order.city}</p>
            {order.notes && (
              <>
                <h2 className="eyebrow mt-6 text-espresso-soft">Notes</h2>
                <p className="mt-2 whitespace-pre-line">{order.notes}</p>
              </>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl bg-paper p-6">
            <h2 className="eyebrow text-espresso-soft">Update status</h2>
            <form action={updateOrderStatus} className="mt-4 space-y-3">
              <input type="hidden" name="order_id" value={order.id} />
              <select name="status" defaultValue={order.status} className="field" aria-label="Status">
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <textarea name="note" rows={2} placeholder="Note (optional), e.g. called, confirmed for 5pm" className="field" aria-label="Note" />
              <button className="btn btn-dark w-full">Save</button>
            </form>
          </section>

          <section className="rounded-3xl bg-paper p-6">
            <h2 className="eyebrow text-espresso-soft">History</h2>
            <ol className="mt-4 space-y-4 text-sm">
              {events.map((e) => (
                <li key={e.id} className="border-l-2 border-espresso pl-3">
                  <p className="font-semibold">
                    {e.from_status && e.to_status && e.from_status !== e.to_status
                      ? `${STATUS_LABELS[e.from_status]} → ${STATUS_LABELS[e.to_status]}`
                      : e.to_status ? STATUS_LABELS[e.to_status] : "Note"}
                  </p>
                  {e.note && <p className="text-espresso-soft">{e.note}</p>}
                  <p className="text-xs text-espresso-soft">{when(e.created_at)}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}
