"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

// Fades and lifts its direct children into view, one after another, as the
// block scrolls in. Content is visible without JavaScript or with reduced motion.
export function Reveal({
  children,
  as: Tag = "div",
  className,
  stagger = 0.1,
  y = 40,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: number;
  y?: number;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const items = root.current ? Array.from(root.current.children) : [];
        gsap.from(items, {
          y,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}
