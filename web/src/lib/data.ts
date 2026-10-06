import "server-only";

import { DEFAULT_SETTINGS, PRODUCTS, type Nutrition } from "@/data/products";
import { isSupabaseConfigured } from "@/lib/env";
import type { DeliverySettings } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";

export type Product = {
  id: string | null; // null when served from seed data
  slug: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  ink: "espresso" | "cream";
  price: number;
  barsPerBox: number;
  weightGrams: number;
  nutrition: Nutrition;
  ingredients: string;
  inStock: boolean;
  active: boolean;
  sortOrder: number;
};

// What the browser needs for the cart and product cards.
export type ProductSummary = Pick<Product, "slug" | "name" | "tagline" | "color" | "ink" | "price" | "barsPerBox" | "inStock"> & { protein: number };

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  ink: "espresso" | "cream";
  price: string | number; // numeric comes back as a string
  bars_per_box: number;
  weight_grams: number;
  nutrition: Partial<Nutrition> | null;
  ingredients: string;
  in_stock: boolean;
  active: boolean;
  sort_order: number;
};

const seedProducts = (): Product[] =>
  PRODUCTS.map((p) => ({ ...p, id: null, inStock: true, active: true }));

export const fromRow = (r: ProductRow): Product => {
  const seed = PRODUCTS.find((p) => p.slug === r.slug);
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    color: r.color,
    ink: r.ink,
    price: Number(r.price),
    barsPerBox: r.bars_per_box,
    weightGrams: r.weight_grams,
    nutrition: { ...(seed?.nutrition ?? { protein: 0, calories: 0, carbs: 0, sugar: 0, fat: 0, fibre: 0 }), ...r.nutrition },
    ingredients: r.ingredients,
    inStock: r.in_stock,
    active: r.active,
    sortOrder: r.sort_order,
  };
};

export const toSummary = (p: Product): ProductSummary => ({
  slug: p.slug,
  name: p.name,
  tagline: p.tagline,
  color: p.color,
  ink: p.ink,
  price: p.price,
  barsPerBox: p.barsPerBox,
  inStock: p.inStock,
  protein: p.nutrition.protein,
});

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return seedProducts();
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("active", true).order("sort_order");
  if (error || !data) return seedProducts(); // tables not created yet
  return (data as ProductRow[]).map(fromRow);
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured) return seedProducts().find((p) => p.slug === slug) ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  if (error) return seedProducts().find((p) => p.slug === slug) ?? null;
  return data ? fromRow(data as ProductRow) : null;
}

export async function getSettings(): Promise<DeliverySettings> {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  const supabase = await createClient();
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return {
    currency: data.currency,
    deliveryFee: Number(data.delivery_fee),
    freeDeliveryOver: data.free_delivery_over === null ? null : Number(data.free_delivery_over),
  };
}
