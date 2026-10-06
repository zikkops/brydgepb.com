import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/orders";
import { formatMoney } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";

type OrderRow = {
  id: string;
  reference: string;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  city: string;
  total: string;
  currency: string;
  created_at: string;
};

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (ORDER_STATUSES as readonly string[]).includes(sp.status) ? (sp.status as OrderStatus) : null;
  // Characters that would break PostgREST's or() filter syntax are dropped.
  const q = typeof sp.q === "string" ? sp.q.replace(/[,()%*\\]/g, " ").trim().slice(0, 100) : "";

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id, reference, status, customer_name, customer_phone, city, total, currency, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  if (q) query = query.or(`reference.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%`);
  const [{ data, error }, { data: allStatuses }] = await Promise.all([query, supabase.from("orders").select("status")]);
  const orders = (data ?? []) as OrderRow[];

  const counts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
  for (const r of (allStatuses ?? []) as { status: OrderStatus }[]) counts[r.status]++;

  const tab = (s: OrderStatus | null) =>
    `rounded-full px-4 py-2 text-sm font-semibold ${status === s ? "bg-espresso text-cream" : "bg-paper hover:bg-cream"}`;
  const href = (s: OrderStatus | null) => {
    const p = new URLSearchParams();
    if (s) p.set("status", s);
    if (q) p.set("q", q);
    return `/admin${p.size ? `?${p}` : ""}`;
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-4xl">Orders</h1>
        <form className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Name, phone or BRY-…" className="field !min-h-10 w-64 !py-2" aria-label="Search orders" />
          <button className="btn btn-dark !min-h-10">Search</button>
        </form>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filter by status">
        <Link href={href(null)} className={tab(null)}>All</Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s} href={href(s)} className={tab(s)}>
            {STATUS_LABELS[s]} <span className="opacity-60">{counts[s]}</span>
          </Link>
        ))}
      </nav>

      {error && <p className="mt-6 text-strawberry">Couldn&apos;t load orders: {error.message}</p>}

      <div className="mt-6 overflow-x-auto rounded-3xl bg-paper">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-espresso-soft">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-cream-soft">
                <td className="px-4 py-3 font-semibold">
                  <Link href={`/admin/orders/${o.id}`} className="underline underline-offset-4">{o.reference}</Link>
                </td>
                <td className="px-4 py-3">{o.customer_name}<br /><span className="text-espresso-soft">{o.customer_phone}</span></td>
                <td className="px-4 py-3">{o.city}</td>
                <td className="px-4 py-3 font-semibold">{formatMoney(Number(o.total), o.currency)}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-espresso-soft">{new Date(o.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Beirut" })}</td>
              </tr>
            ))}
            {orders.length === 0 && !error && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-espresso-soft">No orders{status || q ? " match" : " yet"}.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
