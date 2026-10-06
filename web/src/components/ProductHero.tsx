"use client";

import { useRef } from "react";
import { BarArt, INK } from "@/components/BarArt";
import { Ingredient, INGREDIENTS_BY_FLAVOUR } from "@/components/Ingredient";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

// Product page art: the bar spins in, then drifts; its ingredients orbit it.
export function ProductHero({ slug, name, color, ink, protein }: { slug: string; name: string; color: string; ink: "espresso" | "cream"; protein: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline()
          .from("[data-ph-ring]", { scale: 0.3, autoAlpha: 0, duration: 1.2, ease: "expo.out" })
          .from("[data-ph-bar]", { rotation: -200, scale: 0.4, autoAlpha: 0, duration: 1.3, ease: "expo.out" }, 0.1)
          .from("[data-ph-ing]", { scale: 0, autoAlpha: 0, stagger: 0.1, duration: 0.7, ease: "back.out(2)" }, 0.6);
        gsap.to("[data-ph-bar-inner]", { y: -16, rotation: 3, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.utils.toArray<HTMLElement>("[data-ph-ing-inner]").forEach((el, i) => {
          gsap.to(el, { y: i % 2 ? 18 : -18, rotation: i % 2 ? 25 : -25, duration: 2.4 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative aspect-square w-full">
      <div data-ph-ring className="absolute inset-[10%] rounded-full border-2 border-dashed opacity-40" style={{ borderColor: INK[ink] }} />
      <div className="absolute inset-[22%] rounded-full opacity-15" style={{ background: INK[ink] }} />
      <div data-ph-bar className="absolute left-[2%] top-[33%] w-[96%] -rotate-12">
        <div data-ph-bar-inner className="drop-shadow-[0_30px_30px_rgba(0,0,0,0.35)]">
          <BarArt name={name} color={color} ink={ink} protein={protein} className="w-full" />
        </div>
      </div>
      {(INGREDIENTS_BY_FLAVOUR[slug] ?? []).map((kind, i) => (
        <div key={i} data-ph-ing className="absolute w-[16%]" style={{ top: ["6%", "74%", "12%"][i], left: ["14%", "66%", "72%"][i] }}>
          <div data-ph-ing-inner>
            <Ingredient kind={kind} className="w-full drop-shadow-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
