"use server";

import { CONTACT } from "@/data/products";
import { fromRow, getSettings, type ProductRow } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { calculateTotals, isValidQuantity } from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult = { ok: true; url?: string } | { ok: false; error: string };

const str = (fd: FormData, key: string, max = 2000) => String(fd.get(key) ?? "").trim().slice(0, max);

const serviceReady = () => isSupabaseConfigured && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

const NOT_READY: ActionResult = {
  ok: false,
  error: `Online ordering isn't connected yet. Please order on WhatsApp or call us on ${CONTACT.phone}.`,
};

const PHONE = /^\+?[\d\s\-()]{7,20}$/;
const EMAIL = /^\S+@\S+\.\S+$/;

// ---------------------------------------------------------------- checkout

// The browser sends only slugs and quantities. Every price, the delivery fee
// and the total are worked out here from the database; nothing the browser
// says about money is used.
export async function placeOrder(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (str(formData, "website")) return { ok: true, url: "/" }; // honeypot: pretend success
  if (!serviceReady()) return NOT_READY;

  let requested: { slug: string; quantity: number }[];
  try {
    requested = JSON.parse(str(formData, "items", 5000));
  } catch {
    return { ok: false, error: "Your cart couldn't be read. Please refresh the page and try again." };
  }
  if (!Array.isArray(requested) || requested.length === 0) return { ok: false, error: "Your cart is empty." };
  if (requested.length > 20) return { ok: false, error: "Too many different items in one order." };
  const slugs = new Set<string>();
  for (const r of requested) {
    if (typeof r?.slug !== "string" || !isValidQuantity(r.quantity) || slugs.has(r.slug)) {
      return { ok: false, error: "Something in your cart doesn't look right. Please check the quantities." };
    }
    slugs.add(r.slug);
  }

  const customer = {
    name: str(formData, "name", 200),
    phone: str(formData, "phone", 30),
    email: str(formData, "email", 200),
    city: str(formData, "city", 100),
    address: str(formData, "address", 1000),
    notes: str(formData, "notes", 2000),
  };
  if (!customer.name || !customer.phone || !customer.city || !customer.address) {
    return { ok: false, error: "Please fill in your name, phone number, city and address." };
  }
  if (!PHONE.test(customer.phone)) return { ok: false, error: "Please check your phone number." };
  if (customer.email && !EMAIL.test(customer.email)) return { ok: false, error: "Please check your email address." };

  const db = createAdminClient();
  const { data: rows, error: productsError } = await db.from("products").select("*").in("slug", [...slugs]).eq("active", true);
  if (productsError) {
    console.error("placeOrder: products lookup failed", productsError);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  const products = (rows as ProductRow[]).map(fromRow);

  const lines = [];
  for (const r of requested) {
    const p = products.find((x) => x.slug === r.slug);
    if (!p) return { ok: false, error: "One of the products in your cart is no longer available. Please check your cart." };
    if (!p.inStock) return { ok: false, error: `${p.name} is sold out right now. Please remove it from your cart.` };
    lines.push({ product: p, quantity: r.quantity, unitPrice: p.price });
  }

  const settings = await getSettings();
  const totals = calculateTotals(lines, settings);

  const { data, error } = await db.rpc("place_order", {
    p_order: {
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_email: customer.email,
      city: customer.city,
      address: customer.address,
      notes: customer.notes,
      subtotal: totals.subtotal,
      delivery_fee: totals.deliveryFee,
      total: totals.total,
      currency: settings.currency,
    },
    p_items: lines.map((l) => ({
      product_id: l.product.id,
      product_name: l.product.name,
      unit_price: l.unitPrice,
      quantity: l.quantity,
      line_total: calculateTotals([l], { ...settings, deliveryFee: 0 }).subtotal,
    })),
  });
  const placed = Array.isArray(data) ? data[0] : data;
  if (error || !placed?.reference) {
    console.error("placeOrder: place_order failed", error);
    return { ok: false, error: "Something went wrong saving your order. Please try again." };
  }

  return { ok: true, url: `/order/${placed.reference}?t=${placed.access_token}` };
}

// ----------------------------------------------------------------- contact

export async function sendContactMessage(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (str(formData, "website")) return { ok: true }; // honeypot
  if (!serviceReady()) {
    return { ok: false, error: `Messages aren't connected yet. Please email ${CONTACT.email} or call ${CONTACT.phone}.` };
  }

  const msg = {
    name: str(formData, "name", 200),
    email: str(formData, "email", 200),
    phone: str(formData, "phone", 30) || null,
    subject: str(formData, "subject", 200),
    message: str(formData, "message", 5000),
  };
  if (!msg.name || !msg.subject || !msg.message) return { ok: false, error: "Please fill in your name, a subject and your message." };
  if (!EMAIL.test(msg.email)) return { ok: false, error: "Please check your email address." };
  if (msg.phone && !PHONE.test(msg.phone)) return { ok: false, error: "Please check your phone number." };

  const { error } = await createAdminClient().from("contact_messages").insert(msg);
  if (error) {
    console.error("contact insert failed", error);
    return { ok: false, error: "Something went wrong. Please try again or email us." };
  }
  return { ok: true };
}
