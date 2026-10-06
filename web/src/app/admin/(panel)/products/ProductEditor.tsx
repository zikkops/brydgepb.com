"use client";

import { useActionState } from "react";
import { updateProduct } from "@/app/admin/actions";

type Editable = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  sortOrder: number;
  inStock: boolean;
  active: boolean;
};

export function ProductEditor({ product: p }: { product: Editable }) {
  const [message, action, pending] = useActionState(updateProduct, "");
  const id = (k: string) => `${p.id}-${k}`;
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={p.id} />
      <div>
        <label htmlFor={id("name")} className="label">Name</label>
        <input id={id("name")} name="name" defaultValue={p.name} required className="field" />
      </div>
      <div>
        <label htmlFor={id("tagline")} className="label">Tagline</label>
        <input id={id("tagline")} name="tagline" defaultValue={p.tagline} className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={id("description")} className="label">Description</label>
        <textarea id={id("description")} name="description" defaultValue={p.description} rows={3} className="field" />
      </div>
      <div>
        <label htmlFor={id("price")} className="label">Price per box (USD)</label>
        <input id={id("price")} name="price" type="number" min="0" step="0.01" defaultValue={p.price} required className="field" />
      </div>
      <div>
        <label htmlFor={id("sort")} className="label">Order on the shop</label>
        <input id={id("sort")} name="sort_order" type="number" step="1" defaultValue={p.sortOrder} className="field" />
      </div>
      <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="in_stock" defaultChecked={p.inStock} className="size-5 accent-espresso" /> In stock
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="active" defaultChecked={p.active} className="size-5 accent-espresso" /> Visible on the site
        </label>
        <button disabled={pending} className="btn btn-dark ml-auto !min-h-10">{pending ? "Saving…" : "Save"}</button>
      </div>
      {message && <p role="status" className="text-sm font-semibold sm:col-span-2">{message}</p>}
    </form>
  );
}
