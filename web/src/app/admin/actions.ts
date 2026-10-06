"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";

// Every action re-checks the admin role; proxy.ts only checks for a session.
// Writes go through the signed-in user's client, so RLS applies too.

export async function updateOrderStatus(formData: FormData) {
  const admin = await requireAdmin();
  const orderId = String(formData.get("order_id"));
  const status = String(formData.get("status")) as OrderStatus;
  const note = String(formData.get("note") ?? "").trim().slice(0, 2000);
  if (!ORDER_STATUSES.includes(status)) return;

  const supabase = await createClient();
  const { data: current } = await supabase.from("orders").select("status").eq("id", orderId).single();
  if (!current) return;

  if (current.status !== status) {
    await supabase.from("orders").update({ status }).eq("id", orderId);
  }
  if (current.status !== status || note) {
    await supabase.from("order_events").insert({
      order_id: orderId,
      from_status: current.status,
      to_status: status,
      note: note || null,
      created_by: admin.id,
    });
  }
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
}

export async function updateProduct(_prev: string, formData: FormData): Promise<string> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const tagline = String(formData.get("tagline") ?? "").trim().slice(0, 100);
  const description = String(formData.get("description") ?? "").trim().slice(0, 2000);
  const price = Number(formData.get("price"));
  const sortOrder = Math.floor(Number(formData.get("sort_order")));
  if (!name) return "Name is required.";
  if (!Number.isFinite(price) || price < 0 || price > 10000) return "Price must be a number from 0 to 10,000.";
  if (!Number.isFinite(sortOrder)) return "Order must be a number.";

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name,
      tagline,
      description,
      price: Math.round(price * 100) / 100,
      sort_order: sortOrder,
      in_stock: formData.get("in_stock") === "on",
      active: formData.get("active") === "on",
    })
    .eq("id", String(formData.get("id")));
  if (error) return `Save failed: ${error.message}`;
  revalidatePath("/", "layout");
  return "Saved.";
}

export async function saveSettings(_prev: string, formData: FormData): Promise<string> {
  const admin = await requireAdmin();
  const fee = Number(formData.get("delivery_fee"));
  const freeRaw = String(formData.get("free_delivery_over") ?? "").trim();
  const free = freeRaw === "" ? null : Number(freeRaw);
  if (!Number.isFinite(fee) || fee < 0) return "Delivery fee must be 0 or more.";
  if (free !== null && (!Number.isFinite(free) || free < 0)) return "Free delivery threshold must be 0 or more, or empty for never.";

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({ delivery_fee: fee, free_delivery_over: free, updated_by: admin.id })
    .eq("id", 1);
  if (error) return `Save failed: ${error.message}`;
  revalidatePath("/", "layout");
  return "Delivery settings saved.";
}

export async function setMessageHandled(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from("contact_messages")
    .update({ handled: formData.get("handled") === "true" })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/messages");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
