"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BarArt, INK } from "@/components/BarArt";
import { Ingredient, INGREDIENTS_BY_FLAVOUR } from "@/components/Ingredient";
import type { Nutrition } from "@/data/products";
import type { ProductSummary } from "@/lib/data";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { formatMoney } from "@/lib/pricing";

type FlavourProduct = ProductSummary & { description: string; nutrition: Nutrition };

const PIN_QUERY = `(min-width: 768px) and ${MOTION_OK}`;

// "Pick your flavour": on desktop the section pins and scrolling steps through
// the four flavours; the background takes each flavour's colour. On phones
// (and with reduced motion) the tabs switch flavours instead.
export function FlavourSwitcher({ products, currency }: { products: FlavourProduct[]; currency: string }) {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const p = products[active];
  const ink = INK[p.ink];
  const last = products.length - 1;

  useGSAP(
    () => {
      gsap.matchMedia().add(PIN_QUERY, () => {
        trigger.current = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * last}`,
          pin: true,
          snap: { snapTo: 1 / last, duration: { min: 0.2, max: 0.5 }, ease: "power2.inOut" },
          onUpdate: (self) => setActive(Math.round(self.progress * last)),
        });
        return () => {
          trigger.current = null;
        };
      });
    },
    { scope: root },
  );

  // Animate the new flavour in whenever it changes.
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-flavour-bar]",
          { xPercent: 35, rotation: 18, autoAlpha: 0, scale: 0.9 },
          { xPercent: 0, rotation: -8, autoAlpha: 1, scale: 1, duration: 0.9, ease: "expo.out" },
        );
        gsap.fromTo("[data-flavour-copy] > *", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" });
        gsap.fromTo(
          "[data-flavour-ingredient]",
          { scale: 0, rotation: -60 },
          { scale: 1, rotation: 0, duration: 0.8, stagger: 0.08, ease: "back.out(2)" },
        );
      });
    },
    { scope: root, dependencies: [active], revertOnUpdate: false },
  );

  function choose(i: number) {
    const st = trigger.current;
    if (st) window.scrollTo({ top: st.start + ((st.end - st.start) * i) / last + 1, behavior: "smooth" });
    else setActive(i);
  }

  return (
    <section
      ref={root}
      aria-labelledby="flavours-title"
      className="relative flex min-h-svh items-center overflow-hidden motion-safe:transition-colors motion-safe:duration-700"
      style={{ backgroundColor: p.color, color: ink }}
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-24 sm:px-6 md:grid-cols-2">
        <div>
          <p className="eyebrow opacity-70">Pick your flavour</p>
          <h2 id="flavours-title" className="sr-only">Our four flavours</h2>

          <div role="tablist" aria-label="Flavours" className="mt-5 flex flex-wrap gap-2">
            {products.map((f, i) => (
              <button
                key={f.slug}
                role="tab"
                type="button"
                aria-selected={i === active}
                onClick={() => choose(i)}
                className="flex min-h-10 items-center gap-2 rounded-full border-2 px-3 text-xs font-bold uppercase tracking-widest transition-colors"
                style={{
                  borderColor: ink,
                  background: i === active ? ink : "transparent",
                  color: i === active ? f.color : ink,
                }}
              >
                <span className="size-3 rounded-full border" style={{ background: f.color, borderColor: ink }} />
                {f.name}
              </button>
            ))}
          </div>

          <div data-flavour-copy role="tabpanel" aria-live="polite" className="@container mt-10">
            <p className="eyebrow opacity-80">{p.tagline}</p>
            <p className="display mt-3 text-[clamp(2.5rem,12.5cqi,6.5rem)]">{p.name}</p>
            <p className="mt-6 max-w-md text-base opacity-85 sm:text-lg">{p.description}</p>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
              {[
                ["Protein", `${p.nutrition.protein}g`],
                ["Calories", `${p.nutrition.calories}`],
                ["Sugar", `${p.nutrition.sugar}g`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border-2 px-3 py-3" style={{ borderColor: `${ink}33` }}>
                  <dt className="text-[10px] font-bold uppercase tracking-widest opacity-70">{k}</dt>
                  <dd className="display mt-1 text-2xl normal-case">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AddToCartButton slug={p.slug} inStock={p.inStock} className="btn" style={{ background: ink, color: p.color }}>
                Add to cart · {formatMoney(p.price, currency)}
              </AddToCartButton>
              <Link href={`/shop/${p.slug}`} className="btn btn-outline">
                Details
              </Link>
            </div>
          </div>
        </div>

        <div className="relative aspect-square w-full">
          <div className="absolute inset-[12%] rounded-full opacity-25" style={{ background: ink }} />
          <p
            aria-hidden
            className="display pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(8rem,22vw,18rem)] opacity-10"
          >
            {String(active + 1).padStart(2, "0")}
          </p>
          <div data-flavour-bar className="absolute left-[4%] top-[34%] w-[92%] drop-shadow-[0_30px_30px_rgba(0,0,0,0.3)]">
            <BarArt name={p.name} color={p.color} ink={p.ink} protein={p.nutrition.protein} className="w-full" />
          </div>
          {(INGREDIENTS_BY_FLAVOUR[p.slug] ?? []).map((kind, i) => (
            <div
              key={`${p.slug}-${i}`}
              data-flavour-ingredient
              className="absolute w-[14%]"
              style={{ top: ["8%", "70%", "18%"][i], left: ["12%", "20%", "76%"][i] }}
            >
              <Ingredient kind={kind} className="w-full drop-shadow-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* progress dots */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 gap-2 md:flex" aria-hidden>
        {products.map((f, i) => (
          <span key={f.slug} className="h-1.5 rounded-full transition-all duration-500" style={{ width: i === active ? 32 : 12, background: ink, opacity: i === active ? 1 : 0.35 }} />
        ))}
      </div>
    </section>
  );
}
