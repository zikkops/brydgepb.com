import { ProductEditor } from "./ProductEditor";
import { BarArt } from "@/components/BarArt";
import { requireAdmin } from "@/lib/auth";
import { fromRow, type ProductRow } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").order("sort_order");
  const products = ((data ?? []) as ProductRow[]).map(fromRow);

  return (
    <>
      <h1 className="display text-4xl">Products</h1>
      <p className="mt-2 text-sm text-espresso-soft">Changes show on the shop straight away. Orders already placed keep the price they were placed at.</p>
      {error && <p className="mt-6 text-strawberry">Couldn&apos;t load products: {error.message}</p>}
      <div className="mt-8 space-y-6">
        {products.map((p) => (
          <section key={p.id} className="grid gap-6 rounded-3xl bg-paper p-6 md:grid-cols-[200px_1fr]">
            <div className="flex items-center rounded-2xl p-3" style={{ background: p.color }}>
              <BarArt name={p.name} color={p.color} ink={p.ink} protein={p.nutrition.protein} className="w-full" />
            </div>
            <ProductEditor
              product={{
                id: p.id!,
                name: p.name,
                tagline: p.tagline,
                description: p.description,
                price: p.price,
                sortOrder: p.sortOrder,
                inStock: p.inStock,
                active: p.active,
              }}
            />
          </section>
        ))}
      </div>
    </>
  );
}
