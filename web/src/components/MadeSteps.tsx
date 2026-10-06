"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type Step = { title: string; text: string; color: string };

// Vertical timeline: the line fills as you scroll and each step pops in as the line reaches it.
export function MadeSteps({ steps }: { steps: Step[] }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-line-fill]", {
          scaleY: 0,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 70%", scrub: 0.5 },
        });
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el) => {
          const dot = el.querySelector("[data-dot]");
          const body = el.querySelector("[data-body]");
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none reverse" } });
          tl.from(dot, { scale: 0, duration: 0.4, ease: "back.out(3)" }).from(body, { x: 40, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, "-=0.2");
        });
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative ml-5 space-y-16 border-l-0 sm:ml-8">
      <span aria-hidden className="absolute -left-px top-2 bottom-2 w-0.5 bg-line" />
      <span aria-hidden data-line-fill className="absolute -left-px top-2 bottom-2 w-0.5 bg-espresso" />
      {steps.map((s, i) => (
        <li key={s.title} data-step className="relative pl-12 sm:pl-16">
          <span
            data-dot
            className="absolute -left-5 top-0 flex size-10 items-center justify-center rounded-full font-display text-sm font-black text-paper ring-8 ring-cream"
            style={{ background: s.color }}
          >
            {i + 1}
          </span>
          <div data-body>
            <h3 className="display text-3xl sm:text-4xl">{s.title}</h3>
            <p className="mt-3 max-w-xl text-espresso-soft">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
