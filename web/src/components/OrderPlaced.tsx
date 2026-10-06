"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const CONFETTI = ["#CEA67D", "#A04150", "#556A78", "#9EA488"];

// Thank-you header: a tick draws itself and flavour-coloured confetti bursts out.
export function OrderPlaced({ firstName, reference }: { firstName: string; reference: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline();
        tl.from("[data-badge]", { scale: 0, duration: 0.6, ease: "back.out(2)" })
          .from("[data-tick]", { strokeDashoffset: 60, duration: 0.5, ease: "power2.out" }, "-=0.2")
          .fromTo(
            "[data-confetti]",
            { x: 0, y: 0, scale: 0, autoAlpha: 1 },
            {
              x: () => gsap.utils.random(-220, 220),
              y: () => gsap.utils.random(-160, 120),
              rotation: () => gsap.utils.random(-360, 360),
              scale: 1,
              autoAlpha: 0,
              duration: 1.6,
              ease: "power3.out",
              stagger: 0.01,
            },
            "-=0.4",
          )
          .from("[data-thanks] > *", { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: "power3.out" }, "-=1.4");
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="text-center">
      <div className="relative mx-auto size-24">
        {Array.from({ length: 28 }, (_, i) => (
          <span
            key={i}
            data-confetti
            aria-hidden
            className="invisible absolute left-1/2 top-1/2 h-3 w-1.5 rounded-sm"
            style={{ background: CONFETTI[i % 4] }}
          />
        ))}
        <span data-badge className="relative flex size-24 items-center justify-center rounded-full bg-espresso">
          <svg viewBox="0 0 40 40" className="size-12" aria-hidden>
            <path data-tick d="M10 21 L17 28 L31 13" fill="none" stroke="#E3DDD2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="0" />
          </svg>
        </span>
      </div>
      <div data-thanks>
        <p className="eyebrow mt-8 text-espresso-soft">Order {reference}</p>
        <h1 className="display mt-3 text-5xl sm:text-7xl">Thank you, {firstName}!</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-espresso-soft">
          Your order is in. We&apos;ll call you shortly to confirm, then deliver. Pay in cash when it arrives.
        </p>
      </div>
    </div>
  );
}
