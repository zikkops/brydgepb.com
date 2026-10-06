import type { Metadata } from "next";
import Link from "next/link";
import { BarArt } from "@/components/BarArt";
import { MadeSteps } from "@/components/MadeSteps";
import { Marquee } from "@/components/Marquee";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "About us",
  description: "Brydge makes protein bars for real days: strength, balance and everyday fuel.",
};

// PLACEHOLDER copy for the whole page until the owner writes the real story (UPGRADE.md P4.2).

const VALUES = [
  { title: "Strength", text: "Real protein in every bar, so the work you put in has something to build on.", bg: "bg-strawberry", fg: "text-paper" },
  { title: "Balance", text: "Low sugar, real ingredients and flavours that taste like food, not a lab.", bg: "bg-matcha", fg: "text-espresso" },
  { title: "Everyday fuel", text: "Made for bags, desks and car seats. Something good to reach for, every single day.", bg: "bg-chocolate", fg: "text-paper" },
];

const STEPS = [
  { title: "Start with real food", text: "Nuts, cocoa, fruit and matcha we'd happily eat on their own, picked for flavour first.", color: "#CEA67D" },
  { title: "Build the protein", text: "A milk protein blend for a soft, chewy bite, never chalky, and 15g or more in every bar.", color: "#A04150" },
  { title: "Keep it balanced", text: "Sweetened lightly and packed with fibre, so the energy lasts past lunchtime.", color: "#556A78" },
  { title: "Wrap it for your day", text: "Sealed fresh, boxed in twelves and brought to your door by people who'll call you first.", color: "#9EA488" },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About us" title="Built for real days." lead="Brydge started with a simple frustration: protein bars that were either healthy or tasty, never both. So we built our own." />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 sm:px-6 md:grid-cols-2">
        <Reveal className="grid grid-cols-2 gap-4" stagger={0.12}>
          {PRODUCTS.map((p, i) => (
            <div key={p.slug} className={`grain flex aspect-square items-center rounded-[2rem] p-4 ${i % 2 ? "translate-y-8" : ""}`} style={{ background: p.color }}>
              <BarArt name={p.name} color={p.color} ink={p.ink} protein={p.nutrition.protein} className={`w-full ${i % 2 ? "rotate-6" : "-rotate-6"}`} />
            </div>
          ))}
        </Reveal>
        <Reveal className="space-y-6 text-lg text-espresso-soft">
          <p className="display text-4xl text-espresso sm:text-5xl">A bridge between how you want to eat and how your day actually goes.</p>
          <p>
            Early starts, long commutes, a workout squeezed in before dinner. Real days don&apos;t leave much room for perfect meals. That&apos;s the gap Brydge fills: a bar
            with the protein your body needs and a taste you&apos;ll actually look forward to.
          </p>
          <p>
            We keep the lineup small on purpose. Four flavours, each one worked on until it was right, each with its own colour so you can find your favourite at a glance.
          </p>
        </Reveal>
      </section>

      <Marquee words={["Strength", "Balance", "Everyday fuel"]} className="bg-espresso py-6 text-cream" />

      <section aria-labelledby="values-title" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <p className="eyebrow text-espresso-soft">What we stand for</p>
        <h2 id="values-title" className="display mt-4 text-5xl sm:text-7xl">Three promises.</h2>
        <Reveal className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.15}>
          {VALUES.map((v, i) => (
            <article key={v.title} className={`grain rounded-[2rem] p-8 ${v.bg} ${v.fg}`}>
              <span className="display text-7xl opacity-40">0{i + 1}</span>
              <h3 className="display mt-10 text-4xl">{v.title}</h3>
              <p className="mt-4 opacity-90">{v.text}</p>
            </article>
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="made-title" className="bg-cream-soft">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-espresso-soft">From kitchen to your bag</p>
            <h2 id="made-title" className="display mt-4 text-5xl sm:text-6xl">How a Brydge bar is made</h2>
          </div>
          <MadeSteps steps={STEPS} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
        <h2 className="display mx-auto max-w-3xl text-5xl sm:text-7xl">Find your flavour.</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-dark">Shop the bars</Link>
          <Link href="/contact" className="btn btn-outline">Say hello</Link>
        </div>
      </section>
    </>
  );
}
