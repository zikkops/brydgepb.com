// Order totals. Runs on the server at checkout (the only total that counts)
// and in the browser for the cart estimate. Works in cents so 0.1 + 0.2 never
// turns into 0.30000000000000004 on a receipt.

export const MAX_QTY_PER_ITEM = 20;

export type DeliverySettings = {
  currency: string;
  deliveryFee: number;
  freeDeliveryOver: number | null; // subtotal at or above this ships free; null = never
};

export type PricedLine = { unitPrice: number; quantity: number };

export type Totals = { subtotal: number; deliveryFee: number; total: number };

const cents = (n: number) => Math.round(n * 100);

export function calculateTotals(lines: PricedLine[], settings: DeliverySettings): Totals {
  const subtotalC = lines.reduce((sum, l) => sum + cents(l.unitPrice) * l.quantity, 0);
  const free = settings.freeDeliveryOver !== null && subtotalC >= cents(settings.freeDeliveryOver);
  const feeC = subtotalC === 0 || free ? 0 : cents(settings.deliveryFee);
  return { subtotal: subtotalC / 100, deliveryFee: feeC / 100, total: (subtotalC + feeC) / 100 };
}

export function isValidQuantity(q: unknown): q is number {
  return Number.isInteger(q) && (q as number) >= 1 && (q as number) <= MAX_QTY_PER_ITEM;
}

export function formatMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
