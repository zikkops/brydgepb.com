import Link from "next/link";
import { FlavourSwitcher } from "@/components/home/FlavourSwitcher";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { getProducts, getSettings, toSummary } from "@/lib/data";
import { formatMoney } from "@/lib/pricing";

const STEPS = [
  { n: "01", title: "Pick your box", text: "Choose your flavours. Mix them up, every box is 12 bars." },
  { n: "02", title: "We deliver", text: "We call to confirm and bring it to your door." },
  { n: "03", title: "Pay cash", text: "Pay when it arrives. No card, no account needed." },
];

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const withNutrition = products.map((p) => ({ ...toSummary(p), protein: p.nutrition.protein, description: p.description, nutrition: p.nutrition }));

  return (
    <>
      <Hero products={withNutrition} />

      <Marquee words={["Strength", "Balance", "Everyday fuel", "Built for you"]} className="bg-espresso py-6 text-cream" />

      <FlavourSwitcher products={withNutrition} currency={settings.currency} />

      <Stats />

      <section aria-labelledby="lineup-title" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-espresso-soft">The lineup</p>
            <h2 id="lineup-title" className="display mt-4 text-5xl sm:text-7xl">Four bars.<br />Zero compromise.</h2>
          </div>
          <Link href="/shop" className="btn btn-outline">See the shop</Link>
        </div>
        <Reveal className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {withNutrition.map((p) => (
            <ProductCard key={p.slug} product={p} protein={p.protein} currency={settings.currency} />
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="cod-title" className="grain bg-almond">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <p className="eyebrow text-espresso/70">How it works</p>
          <h2 id="cod-title" className="display mt-4 max-w-3xl text-5xl sm:text-7xl">Order today. Pay at the door.</h2>
          <Reveal as="ol" className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.15}>
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-[2rem] bg-cream-soft p-8">
                <span className="display text-6xl text-almond">{s.n}</span>
                <h3 className="display mt-6 text-2xl">{s.title}</h3>
                <p className="mt-2 text-espresso-soft">{s.text}</p>
              </li>
            ))}
          </Reveal>
          {settings.freeDeliveryOver !== null && (
            <p className="mt-10 font-display text-sm font-bold uppercase tracking-widest">
              Free delivery on orders over {formatMoney(settings.freeDeliveryOver, settings.currency)}
            </p>
          )}
        </div>
      </section>

      <Marquee words={["Almond", "Strawberry", "Dark Chocolate", "Coconut Matcha"]} className="bg-cream py-8 text-espresso/15" />
    </>
  );
}
