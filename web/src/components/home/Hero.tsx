"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import heroAlmond from "@/assets/hero-almond.webp";
import type { ProductSummary } from "@/lib/data";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

function SplitWords({ text }: { text: string }) {
  return text.split(" ").map((word, i) => (
    <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <span data-word className="inline-block">
        {word}&nbsp;
      </span>
    </span>
  ));
}

// The moving shot is desktop only. Phones, and anyone who asks for less motion,
// keep the still and never download the video.
const VIDEO_OK = `(min-width: 1024px) and ${MOTION_OK}`;

function subscribeVideoOk(onChange: () => void) {
  const mq = window.matchMedia(VIDEO_OK);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function Hero({ products }: { products: ProductSummary[] }) {
  const root = useRef<HTMLElement>(null);
  const showVideo = useSyncExternalStore(
    subscribeVideoOk,
    () => window.matchMedia(VIDEO_OK).matches,
    () => false,
  );

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // Intro: the shot settles in, then the words rise over it.
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from("[data-pan]", { scale: 1.15, autoAlpha: 0, duration: 2, ease: "expo.out" }, 0)
          .from("[data-word]", { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.2)
          .from("[data-hero-fade]", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, "-=0.6");

        // Scroll parallax: the shot sinks slower than the page as the hero leaves.
        gsap.to("[data-photo]", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-copy]", {
          yPercent: 25,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        // The photo pans gently against the cursor.
        const pan = root.current?.querySelector<HTMLElement>("[data-pan]");
        if (!pan) return;
        const px = gsap.quickTo(pan, "x", { duration: 1.2, ease: "power3" });
        const py = gsap.quickTo(pan, "y", { duration: 1.2, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          px((e.clientX / window.innerWidth - 0.5) * -24);
          py((e.clientY / window.innerHeight - 0.5) * -14);
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="grain relative -mt-16 flex h-svh min-h-[36rem] overflow-hidden bg-cream pt-16 sm:-mt-20 sm:pt-20">
      {/* Full-bleed shot; the bar sits right of centre so the copy gets the empty stone on the left. */}
      <div data-photo className="absolute inset-x-0 -top-[4%] h-[108%]">
        <div data-pan className="absolute -inset-[2%]">
          <Image
            src={heroAlmond}
            alt="A Brydge Crispy Almond protein bar on a travertine slab with whole and split almonds"
            fill
            preload
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-[72%_70%] lg:object-[45%_50%]"
          />
          {/* Same shot in motion, laid over the still once it is playing. It plays once and
              holds on its last frame. */}
          {showVideo && (
            <video
              src="/video/hero-almond.mp4"
              autoPlay
              muted
              playsInline
              aria-hidden
              onPlaying={(e) => gsap.to(e.currentTarget, { autoAlpha: 1, duration: 0.8, ease: "power2.out" })}
              className="invisible absolute inset-0 size-full object-cover object-[45%_50%] opacity-0"
            />
          )}
        </div>
      </div>
      {/* Cream wash keeps the copy readable where the shot gets busy (top on phones, left on desktop). */}
      <div className="absolute inset-0 bg-linear-to-b from-cream from-25% via-cream/70 via-50% to-transparent to-75% lg:bg-linear-to-r lg:from-cream/90 lg:from-15% lg:via-cream/40 lg:via-35% lg:to-transparent lg:to-55%" />

      <div className="relative mx-auto flex w-full max-w-7xl items-start px-4 pt-6 sm:px-6 lg:items-center lg:pb-12 lg:pt-0">
        <div data-hero-copy className="relative z-10 max-w-xl">
          <p data-hero-fade className="eyebrow text-espresso-soft">Strength · Balance · Everyday fuel</p>
          <h1 className="display mt-4 text-[clamp(3rem,7vw,5.75rem)]">
            <span className="block"><SplitWords text="Built" /></span>
            <span className="block"><SplitWords text="for you." /></span>
          </h1>
          <p data-hero-fade className="mt-5 max-w-sm text-base text-espresso-soft sm:text-lg">
            Protein bars made for real days. Real protein, four honest flavours, delivered to your door and paid in cash.
          </p>
          <div data-hero-fade className="mt-7 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-dark">Shop the bars</Link>
            <Link href="/about" className="btn btn-outline">Our story</Link>
          </div>
          <ul data-hero-fade className="mt-8 hidden flex-wrap gap-2 sm:flex" aria-label="Flavours">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/shop/${p.slug}`}
                  className="flex items-center gap-2 rounded-full border border-line bg-paper/70 py-1.5 pl-1.5 pr-4 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-paper"
                >
                  <span className="size-6 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-espresso-soft lg:flex" aria-hidden>
        <span className="eyebrow !text-[10px]">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-espresso/40" />
      </div>
    </section>
  );
}
