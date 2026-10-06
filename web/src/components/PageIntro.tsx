"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

// Big page title that rises in line by line.
export function PageIntro({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from("[data-intro-word]", { yPercent: 110, duration: 1, stagger: 0.07 })
          .from("[data-intro-fade]", { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, "-=0.6");
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pt-20">
      <p data-intro-fade className="eyebrow text-espresso-soft">{eyebrow}</p>
      <h1 className="display mt-4 text-[clamp(3rem,10vw,7.5rem)]">
        {title.split(" ").map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span data-intro-word className="inline-block">{w}&nbsp;</span>
          </span>
        ))}
      </h1>
      {lead && <p data-intro-fade className="mt-6 max-w-xl text-lg text-espresso-soft">{lead}</p>}
    </div>
  );
}
