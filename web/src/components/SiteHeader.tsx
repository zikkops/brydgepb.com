"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { CART_ADD_EVENT, useCart } from "@/lib/cart";
import { gsap, MOTION_OK } from "@/lib/gsap";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState("");
  const cartRef = useRef<HTMLAnchorElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bump the cart and show a short "added" message whenever something goes in.
  useEffect(() => {
    const onAdd = (e: Event) => {
      const { quantity } = (e as CustomEvent<{ quantity: number }>).detail;
      setToast(`Added ${quantity} ${quantity === 1 ? "box" : "boxes"} to your cart`);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(""), 2600);
      if (cartRef.current && window.matchMedia(MOTION_OK).matches) {
        gsap.fromTo(cartRef.current, { scale: 1 }, { scale: 1.25, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
      }
    };
    window.addEventListener(CART_ADD_EVENT, onAdd);
    return () => window.removeEventListener(CART_ADD_EVENT, onAdd);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled || open ? "bg-cream/90 shadow-[0_1px_0_var(--line)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <Link href="/" className="text-espresso" onClick={() => setOpen(false)}>
          <Logo className="w-28 sm:w-32" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className="group relative px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.16em]"
            >
              {n.label}
              <span
                className={`absolute inset-x-4 -bottom-0.5 h-0.5 origin-left bg-espresso transition-transform duration-300 ${
                  isActive(n.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            ref={cartRef}
            href="/cart"
            className="relative flex size-11 items-center justify-center rounded-full bg-espresso text-cream"
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-strawberry px-1 font-display text-[10px] font-extrabold leading-5 text-paper">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full border-2 border-espresso md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-0.5 w-5 bg-espresso transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-0.5 w-5 bg-espresso transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line px-4 pb-6 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(n.href) ? "page" : undefined}
              className="display block border-b border-line py-4 text-3xl aria-[current=page]:text-strawberry"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {toast && (
          <p className="pointer-events-auto flex items-center gap-3 rounded-full bg-espresso px-5 py-3 text-sm text-cream shadow-xl">
            {toast}
            <Link href="/cart" className="font-display text-xs font-extrabold uppercase tracking-widest underline underline-offset-4">
              View cart
            </Link>
          </p>
        )}
      </div>
    </header>
  );
}
