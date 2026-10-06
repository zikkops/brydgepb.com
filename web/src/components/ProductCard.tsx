"use client";

import Link from "next/link";
import { useRef } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BarArt, INK } from "@/components/BarArt";
import type { ProductSummary } from "@/lib/data";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { formatMoney } from "@/lib/pricing";

// Shop card in the flavour's colour. The card tilts toward the pointer and the
// bar lifts off it on hover.
export function ProductCard({ product: p, protein, currency }: { product: ProductSummary; protein: number; currency: string }) {
  const card = useRef<HTMLElement>(null);
  const ink = INK[p.ink];

  useGSAP(
    () => {
      const el = card.current;
      if (!el) return;
      gsap.matchMedia().add(`${MOTION_OK} and (hover: hover)`, () => {
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
        const bar = el.querySelector("[data-card-bar]");
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 12);
          rx(((e.clientY - r.top) / r.height - 0.5) * -12);
        };
        const onEnter = () => gsap.to(bar, { y: -14, rotation: -10, scale: 1.06, duration: 0.5, ease: "back.out(2)" });
        const onLeave = () => {
          rx(0);
          ry(0);
          gsap.to(bar, { y: 0, rotation: -6, scale: 1, duration: 0.6, ease: "power3.out" });
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: card },
  );

  return (
    <div className="[perspective:1000px]">
      <article
        ref={card}
        className="grain @container relative flex h-full flex-col overflow-hidden rounded-[2rem] p-6 [transform-style:preserve-3d]"
        style={{ background: p.color, color: ink }}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="eyebrow opacity-80">{p.tagline}</p>
          {!p.inStock && <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ background: ink, color: p.color }}>Sold out</span>}
        </div>
        <Link href={`/shop/${p.slug}`} className="mt-2 block after:absolute after:inset-0 after:content-['']">
          <h3 className="display text-[clamp(1.5rem,12.5cqi,2.4rem)]">{p.name}</h3>
        </Link>
        <div data-card-bar className="relative my-8 -rotate-6 drop-shadow-[0_20px_22px_rgba(0,0,0,0.3)]">
          <BarArt name={p.name} color={p.color} ink={p.ink} protein={protein} className="w-full" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="display text-3xl">{formatMoney(p.price, currency)}</p>
            <p className="text-xs opacity-75">Box of {p.barsPerBox} bars</p>
          </div>
          <AddToCartButton
            slug={p.slug}
            inStock={p.inStock}
            className="btn relative z-10 !px-5"
            style={{ background: ink, color: p.color }}
          >
            Add
          </AddToCartButton>
        </div>
      </article>
    </div>
  );
}
