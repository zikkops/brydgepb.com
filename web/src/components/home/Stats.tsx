"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

// PLACEHOLDER figures until the real nutrition facts are confirmed.
const STATS = [
  { value: 15, suffix: "g+", label: "Protein in every bar", note: "Up to 21g in Dark Chocolate" },
  { value: 3, suffix: "g", label: "Sugar or less", prefix: "≤", note: "Sweet, without the crash" },
  { value: 4, suffix: "", label: "Honest flavours", note: "Almond to Coconut Matcha" },
  { value: 12, suffix: "", label: "Bars in every box", note: "Two weeks of weekday fuel" },
];

export function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          gsap.from(el, {
            textContent: 0,
            snap: { textContent: 1 },
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
        gsap.from("[data-stat]", {
          y: 60,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
        gsap.from("[data-stat-line]", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1.2,
          stagger: 0.12,
          ease: "power3.inOut",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="why-title" className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow text-espresso-soft">Why Brydge</p>
          <h2 id="why-title" className="display mt-4 text-5xl sm:text-7xl">
            Real fuel.
            <br />
            <span className="text-strawberry">No drama.</span>
          </h2>
        </div>
        <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <li key={s.label} data-stat>
              <span data-stat-line className="block h-1 w-full bg-espresso" />
              <p className="display mt-6 text-7xl normal-case sm:text-8xl">
                {s.prefix}
                <span data-count>{s.value}</span>
                {s.suffix}
              </p>
              <p className="mt-3 font-display text-sm font-extrabold uppercase tracking-widest">{s.label}</p>
              <p className="mt-1 text-sm text-espresso-soft">{s.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
