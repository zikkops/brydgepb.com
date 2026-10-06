"use client";

import { useMemo, useSyncExternalStore } from "react";
import { MAX_QTY_PER_ITEM } from "@/lib/pricing";

// The cart lives in localStorage: slugs and quantities only, never prices.
// Prices come from the server on every page and again at checkout.

export type CartItem = { slug: string; quantity: number };

const KEY = "brydge-cart";
export const CART_ADD_EVENT = "brydge:cart-add";

const listeners = new Set<() => void>();
let cache: string | null = null;

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getSnapshot() {
  if (cache === null) cache = read();
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function parse(raw: string): CartItem[] {
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((i) => typeof i?.slug === "string" && Number.isInteger(i?.quantity) && i.quantity > 0)
      .map((i) => ({ slug: i.slug, quantity: Math.min(i.quantity, MAX_QTY_PER_ITEM) }));
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  cache = JSON.stringify(items.filter((i) => i.quantity > 0));
  try {
    localStorage.setItem(KEY, cache);
  } catch {
    // Private mode or storage full: the cart still works for this page view.
  }
  listeners.forEach((l) => l());
}

const current = () => parse(getSnapshot());

export const cart = {
  add(slug: string, quantity = 1) {
    const items = current();
    const found = items.find((i) => i.slug === slug);
    if (found) found.quantity = Math.min(found.quantity + quantity, MAX_QTY_PER_ITEM);
    else items.push({ slug, quantity: Math.min(quantity, MAX_QTY_PER_ITEM) });
    write(items);
    window.dispatchEvent(new CustomEvent(CART_ADD_EVENT, { detail: { slug, quantity } }));
  },
  set(slug: string, quantity: number) {
    write(current().map((i) => (i.slug === slug ? { ...i, quantity: Math.max(0, Math.min(quantity, MAX_QTY_PER_ITEM)) } : i)));
  },
  remove(slug: string) {
    write(current().filter((i) => i.slug !== slug));
  },
  clear() {
    write([]);
  },
};

export function useCart() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const items = useMemo(() => parse(raw), [raw]);
  const count = items.reduce((n, i) => n + i.quantity, 0);
  return { items, count };
}
