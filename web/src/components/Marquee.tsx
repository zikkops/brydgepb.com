"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

// Endless scrolling band of words. Scrolling the page speeds it up briefly.
export function Marquee({ words, className = "" }: { words: string[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tween = gsap.to("[data-track]", { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
        let last = window.scrollY;
        const onScroll = () => {
          const v = Math.min(Math.abs(window.scrollY - last), 60);
          last = window.scrollY;
          gsap.to(tween, { timeScale: 1 + v / 8, duration: 0.2, overwrite: true });
          gsap.to(tween, { timeScale: 1, duration: 1, delay: 0.2 });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
      });
    },
    { scope: root },
  );

  const run = [...words, ...words, ...words];
  return (
    <div ref={root} className={`overflow-hidden whitespace-nowrap ${className}`} aria-label={words.join(", ")}>
      <div data-track className="inline-flex" aria-hidden>
        {[0, 1].map((copy) => (
          <span key={copy} className="inline-flex">
            {run.map((w, i) => (
              <span key={`${copy}-${i}`} className="display flex items-center px-6 text-4xl sm:text-6xl">
                {w}
                <span className="ml-12 inline-block size-3 rounded-full bg-current opacity-50" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
