import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarArt, INK } from "@/components/BarArt";
import { ProductBuy } from "@/components/ProductBuy";
import { ProductHero } from "@/components/ProductHero";
import { Reveal } from "@/components/Reveal";
import { getProduct, getProducts, getSettings } from "@/lib/data";
import { formatMoney } from "@/lib/pricing";

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Not found" };
  return { title: `${product.name} protein bar`, description: `${product.tagline}. ${product.description}` };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const [product, all, settings] = await Promise.all([getProduct(slug), getProducts(), getSettings()]);
  if (!product) notFound();
  const ink = INK[product.ink];
  const others = all.filter((p) => p.slug !== product.slug);
  const n = product.nutrition;

  return (
    <>
      <section className="grain overflow-hidden" style={{ background: product.color, color: ink }}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
          <ProductHero slug={product.slug} name={product.name} color={product.color} ink={product.ink} protein={n.protein} />
          <div className="@container">
            <Link href="/shop" className="eyebrow opacity-70 hover:opacity-100">← All flavours</Link>
            <p className="eyebrow mt-8 opacity-80">{product.tagline}</p>
            <h1 className="display mt-3 text-[clamp(2.5rem,12.5cqi,5.75rem)]">{product.name}</h1>
            <p className="mt-6 max-w-lg text-lg opacity-90">{product.description}</p>
            <p className="display mt-8 text-4xl">
              {formatMoney(product.price, settings.currency)}
              <span className="ml-3 align-middle font-sans text-sm font-normal normal-case tracking-normal opacity-80">
                box of {product.barsPerBox} × {product.weightGrams}g bars
              </span>
            </p>
            <ProductBuy slug={product.slug} inStock={product.inStock} color={product.color} ink={product.ink} />
            <p className="mt-4 text-sm opacity-80">Cash on delivery · We call to confirm every order</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="nutrition-title" className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow text-espresso-soft">Per {product.weightGrams}g bar</p>
          <h2 id="nutrition-title" className="display mt-4 text-5xl">What&apos;s inside</h2>
          <p className="mt-6 text-espresso-soft">{product.ingredients}</p>
          {/* PLACEHOLDER nutrition facts (src/data/products.ts) until the owner confirms them */}
          <p className="mt-4 text-xs text-espresso-soft">Nutrition values shown are indicative.</p>
        </div>
        <Reveal as="dl" className="grid grid-cols-2 gap-4 sm:grid-cols-3" stagger={0.06}>
          {[
            ["Protein", `${n.protein}g`],
            ["Calories", `${n.calories}`],
            ["Carbs", `${n.carbs}g`],
            ["Sugar", `${n.sugar}g`],
            ["Fat", `${n.fat}g`],
            ["Fibre", `${n.fibre}g`],
          ].map(([k, v], i) => (
            <div
              key={k}
              className="rounded-3xl p-6"
              style={i === 0 ? { background: product.color, color: ink } : { background: "var(--cream-soft)" }}
            >
              <dt className="eyebrow opacity-70">{k}</dt>
              <dd className="display mt-3 text-4xl normal-case">{v}</dd>
            </div>
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="others-title" className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 id="others-title" className="display text-4xl">Try the others</h2>
          <Reveal className="mt-10 grid gap-6 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/shop/${o.slug}`}
                className="group block rounded-[2rem] p-6 transition-[translate] duration-300 hover:-translate-y-1"
                style={{ background: o.color, color: INK[o.ink] }}
              >
                <p className="eyebrow opacity-80">{o.tagline}</p>
                <p className="display mt-2 text-3xl">{o.name}</p>
                <div className="mt-6 -rotate-3 transition-transform duration-500 group-hover:rotate-0">
                  <BarArt name={o.name} color={o.color} ink={o.ink} protein={o.nutrition.protein} className="w-full" />
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
