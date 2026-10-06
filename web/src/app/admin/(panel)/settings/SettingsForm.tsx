"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/admin/actions";

export function SettingsForm({ deliveryFee, freeDeliveryOver }: { deliveryFee: number; freeDeliveryOver: number | null }) {
  const [message, action, pending] = useActionState(saveSettings, "");
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="delivery_fee" className="label">Delivery fee (USD)</label>
        <input id="delivery_fee" name="delivery_fee" type="number" min="0" step="0.01" defaultValue={deliveryFee} required className="field" />
      </div>
      <div>
        <label htmlFor="free_delivery_over" className="label">Free delivery from (USD)</label>
        <input id="free_delivery_over" name="free_delivery_over" type="number" min="0" step="0.01" defaultValue={freeDeliveryOver ?? ""} className="field" />
        <p className="mt-1 text-xs text-espresso-soft">Leave empty to always charge delivery.</p>
      </div>
      <button disabled={pending} className="btn btn-dark">{pending ? "Saving…" : "Save"}</button>
      {message && <p role="status" className="text-sm font-semibold">{message}</p>}
    </form>
  );
}
