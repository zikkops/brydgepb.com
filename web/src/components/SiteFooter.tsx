import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CONTACT } from "@/data/products";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-espresso text-cream">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="w-44" />
            <p className="mt-6 max-w-xs text-sm text-cream/70">
              Protein bars built for real days. Strength, balance and everyday fuel in four flavours.
            </p>
          </div>
          <div>
            <h2 className="eyebrow text-cream/50">Shop</h2>
            <ul className="mt-4 space-y-1 text-sm">
              <li><Link href="/shop/almond" className="inline-block py-1 hover:text-almond">Almond</Link></li>
              <li><Link href="/shop/strawberry" className="inline-block py-1 hover:text-almond">Strawberry</Link></li>
              <li><Link href="/shop/dark-chocolate" className="inline-block py-1 hover:text-almond">Dark Chocolate</Link></li>
              <li><Link href="/shop/coconut-matcha" className="inline-block py-1 hover:text-almond">Coconut Matcha</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-cream/50">Brydge</h2>
            <ul className="mt-4 space-y-1 text-sm">
              <li><Link href="/about" className="inline-block py-1 hover:text-almond">About us</Link></li>
              <li><Link href="/contact" className="inline-block py-1 hover:text-almond">Contact</Link></li>
              <li><Link href="/cart" className="inline-block py-1 hover:text-almond">Your cart</Link></li>
            </ul>
          </div>
          {/* PLACEHOLDER contact details (src/data/products.ts CONTACT) */}
          <div>
            <h2 className="eyebrow text-cream/50">Get in touch</h2>
            <ul className="mt-4 space-y-1 text-sm">
              <li><a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="inline-block py-1 hover:text-almond">{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className="inline-block py-1 hover:text-almond">{CONTACT.email}</a></li>
              <li><a href={`https://instagram.com/${CONTACT.instagram}`} className="inline-block py-1 hover:text-almond" target="_blank" rel="noreferrer">@{CONTACT.instagram}</a></li>
              <li className="py-1 text-cream/70">{CONTACT.area}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-cream/15 pt-6 text-xs text-cream/50">
          <p>© {year} Brydge. All rights reserved.</p>
          <p className="eyebrow !text-[10px]">Strength · Balance · Everyday fuel</p>
          <p>Cash on delivery across Lebanon</p>
        </div>
      </div>
    </footer>
  );
}
