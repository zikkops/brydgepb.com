import { STATUS_LABELS, type OrderStatus } from "@/lib/orders";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-almond text-espresso",
  confirmed: "bg-chocolate text-paper",
  out_for_delivery: "bg-matcha text-espresso",
  delivered: "bg-espresso text-cream",
  cancelled: "bg-strawberry text-paper",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
