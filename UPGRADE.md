# Brydge Protein Bars: build plan

E-commerce site for **Brydge** ("Built for you"), a protein bar brand with four
flavours. **Next.js front end + Supabase back end**, cash on delivery, and an
admin area where the team sees and manages orders. Plan written 24 Sep 2026.

Project notes live in the AI brain vault at
`C:\Users\User\Documents\ai brain\01 - Projects\Brydge Protein Bars\`
(main note, Pages, Open Questions). When a task here finishes, update the vault
to match.

The owner's goals, in order:

1. Four pages for customers: **Home, About us, Shop, Contact us** (plus cart,
   checkout and order confirmation, which the shop needs).
2. Four products, one per flavour in the brand palette.
3. A back end for sales. **Version 1 is cash on delivery only.**
4. GSAP animation and good-looking placeholders until real photos and copy exist.

## How to use this file

- Work top-down. Each phase needs the one before it.
- **Each task is one session.** If a task grows, split it here before starting.
- **(owner)** marks a task that needs the owner's answer first. Ask, write the
  answer next to the task, then build.
- Tick `[x]` and add one line on what was done when a task finishes.
- Every task ends with `npm run lint` and `npm run build` (in `web/`). For anything
  the customer sees, check it at phone width (360px) and desktop width.
- Next.js 16 has breaking changes. Read `web/node_modules/next/dist/docs/` before
  writing code (middleware is `proxy.ts`, `params` is a Promise).
- Same stack and patterns as [Tailored Times](C:\Projects\tailored times) (Next.js 16,
  Supabase, Tailwind v4, GSAP). Copy from there before inventing something new.

---

## Brand (from the owner's files, 24 Sep 2026)

Logo: `C:\Users\User\Downloads\brydge_logo.png` → `web/public/brand/logo.png`.
Espresso wordmark "BRYDGE" with the split Y, tagline "BUILT FOR YOU".
Brand line: **Strength · Balance · Everyday fuel**.

| Name | Hex | Use |
|---|---|---|
| Almond (natural & nutty) | `#CEA67D` | Almond flavour, packaging |
| Strawberry (fruity & vibrant) | `#A04150` | Strawberry flavour, packaging |
| Dark Chocolate (rich & indulgent) | `#556A78` | Dark Chocolate flavour, packaging |
| Coconut Matcha (fresh & balanced) | `#9EA488` | Coconut Matcha flavour, packaging |
| Warm Cream (clean & timeless) | `#E3DDD2` | Primary: backgrounds, layouts |
| Espresso Brown (bold & refined) | `#392519` | Typography and key text only |

The four flavour colours give the four products: **Almond, Strawberry,
Dark Chocolate, Coconut Matcha**. Each product page and card takes its flavour colour.

Fonts: the logo is a heavy geometric sans. The site uses **Montserrat** (800/900,
uppercase, for headings, close to the logo) and **DM Sans** (body), both free
Google Fonts. Swap for the brand's real typeface if one exists (owner).

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4) in `web/`.
- **GSAP + ScrollTrigger** (`@gsap/react` `useGSAP`) for all animation.
  Everything respects `prefers-reduced-motion`.
- **Supabase:** Postgres with RLS, Auth (admin login only). No storage bucket in v1.
- Cart lives in the browser (`localStorage`). The server **recalculates every
  price** from the database at checkout. Never trust a price from the browser.
- Not hosted yet. Never push or deploy without being asked.

## Data model (v1)

- `products`: slug, name, flavour tagline, description, colour, price, bars per box,
  nutrition (jsonb), `in_stock`, `active`, `sort_order`.
- `settings` (one row): currency, delivery fee, free-delivery threshold, delivery areas note.
- `orders`: reference `BRY-000123`, customer name/phone/email, city/area, address,
  notes, subtotal, delivery fee, total, `status`, `payment_method = 'cod'`.
- `order_items`: product id, name and unit price **copied at order time**, quantity, line total.
- `order_events`: status history with admin notes.
- `contact_messages`: name, email, phone, subject, message, handled.
- `admins`: invited users only (no public sign-up).

Order statuses: `pending` → `confirmed` → `out_for_delivery` → `delivered`,
plus `cancelled` (admin only).

## Pages

| Route | Page |
|---|---|
| `/` | Home: animated hero with the bars, flavour switcher, "why Brydge" stats, marquee, CTA |
| `/about` | About us: story, values (Strength, Balance, Everyday fuel), timeline |
| `/shop` | Shop: the four products |
| `/shop/[slug]` | Product: colour-themed page, nutrition, add to cart |
| `/cart` | Cart |
| `/checkout` | Checkout (cash on delivery) |
| `/order/[reference]` | Order confirmation |
| `/contact` | Contact us: form + details |
| `/admin/login` | Admin login |
| `/admin` | Orders list (filter by status, search) |
| `/admin/orders/[id]` | Order detail: items, customer, status changes, notes |
| `/admin/products` | Edit product name, price, description, in stock, visible |
| `/admin/messages` | Contact messages inbox |
| `/admin/settings` | Delivery fee and free-delivery threshold |

---

## Current state (24 Sep 2026, end of session)

- Whole site + admin built in `web/`. `npm run lint`, `npm test` (9/9) and `npm run build` pass.
- Checked in Chrome at 1440px and 390px: every public page, no JS errors, no sideways scroll.
  Cart flow tested (add, quantities, free delivery at $60, checkout keeps what was typed after an error).
- ⚠️ **Not connected to a database yet.** Pages show the seed products from `src/data/products.ts`;
  checkout and contact reply "isn't connected yet". Blocked on P4.1.
- ⚠️ Admin pages are built and type-checked but have never run against a real Supabase project.
- ⚠️ All prices, nutrition facts, About copy and contact details are PLACEHOLDER.

## Phase 0: Set up

- [x] **P0.1 Add the project to the AI brain vault.** Main note, Pages Index,
  one note per page, Open Questions, and a link from `Home.md`.
- [x] **P0.2 Write this plan.**
- [x] **P0.3 Scaffold `web/`.** Next.js 16, Tailwind v4, GSAP, Supabase client libs,
  Vitest. Brand tokens in `globals.css`, logo in `public/brand/`, fonts. *Done 24 Sep 2026: Next 16.3.6, Tailwind v4, GSAP 3.15, Supabase SSR, Vitest. Tokens in globals.css, logo as a CSS mask (components/Logo.tsx).*
- [ ] **P0.4 (owner) Answer the open questions** (see the bottom of this file).

## Phase 1: The site (front end, placeholder content)

- [x] **P1.1 Layout.** Sticky header (logo, Home / Shop / About / Contact, cart with
  item count), footer (tagline, links, contact, socials). Mobile menu. *Done 24 Sep 2026: SiteHeader (sticky, cart count + bump, added-to-cart toast, mobile menu), SiteFooter.*
- [x] **P1.2 Placeholder product art.** An SVG bar wrapper for each flavour
  (flavour colour, BRYDGE wordmark, protein callout), used until real product
  photos arrive. No stock photos. *Done 24 Sep 2026: components/BarArt.tsx (SVG wrapper per flavour) + components/Ingredient.tsx (almond, strawberry, chocolate, leaf, coconut).*
- [x] **P1.3 Home.** Hero with floating bars (GSAP intro + scroll parallax),
  marquee band, flavour switcher that re-colours the section, pinned
  "why Brydge" numbers that count up, shop CTA. *Done 24 Sep 2026: Hero (word-by-word title, bars fly in, float, cursor tilt, scroll parallax), Marquee, FlavourSwitcher (pinned on desktop, tabs on phones), Stats count-up, lineup grid, how-it-works.*
- [x] **P1.4 Shop + product page.** Grid of four cards with a hover tilt; product
  page themed in its flavour colour with nutrition panel and quantity stepper. *Done 24 Sep 2026: ProductCard (tilt), /shop/[slug] (ProductHero, nutrition grid, stepper, other flavours).*
- [x] **P1.5 About us.** Story, three values, "how a bar is made" steps that
  reveal on scroll. **Copy is placeholder.** *Done 24 Sep 2026: Copy is PLACEHOLDER. MadeSteps draws its line on scroll.*
- [x] **P1.6 Contact us.** Form (name, email, phone, subject, message, honeypot),
  contact details panel. *Done 24 Sep 2026: ContactForm + channel cards (WhatsApp, email, Instagram: PLACEHOLDER details).*

## Phase 2: Sales back end (cash on delivery)

- [x] **P2.1 Database.** `supabase/migrations/0001_init.sql` (tables above, RLS,
  admin check function), `seed.sql` with the four products, one-file `setup.sql`. *Done 24 Sep 2026: place_order() Postgres function writes order + items + event in one transaction; only service_role can run it.*
- [x] **P2.2 Cart.** Client cart context in `localStorage`, add/remove/quantity,
  cart page with totals shown as an estimate. *Done 24 Sep 2026: lib/cart.ts (useSyncExternalStore over localStorage, synced across tabs).*
- [x] **P2.3 Checkout.** Server action validates input, reloads products and
  prices from the database, computes subtotal + delivery fee, saves order +
  items + first event, returns the reference. Honeypot against bots. *Done 24 Sep 2026: placeOrder in app/actions.ts. Tested in the browser up to the "not connected yet" reply; not yet run against a live database.*
- [x] **P2.4 Order confirmation page** with reference, items, total and
  "pay cash when it arrives". Shows only what's safe: looked up by reference + a
  random token in the URL, so references can't be guessed. *Done 24 Sep 2026: Confetti + tick animation (OrderPlaced.tsx). Link is /order/BRY-000123?t=<access_token>.*
- [x] **P2.5 Pricing logic tests** (Vitest): totals, delivery fee, free-delivery
  threshold, quantity limits. *Done 24 Sep 2026: 9 tests pass (src/lib/pricing.test.ts).*

## Phase 3: Admin

- [x] **P3.1 Login + guard.** Supabase Auth, `proxy.ts` session redirect,
  `requireAdmin()` in every admin page and action. *Done 24 Sep 2026: Ported from Tailored Times. Not tested against a live database.*
- [x] **P3.2 Orders list + detail**, status changes with history and notes,
  `tel:` / WhatsApp links for the customer. *Done 24 Sep 2026: Status filter with counts, search, WhatsApp/tel links, history. Not tested live.*
- [x] **P3.3 Products editor** (name, tagline, description, price, in stock, visible). *Done 24 Sep 2026: Not tested live.*
- [x] **P3.4 Messages inbox** and **delivery settings.** *Done 24 Sep 2026: Not tested live.*

## Phase 4: Go live (blocked on the owner)

- [ ] **P4.1 (owner) Create the Supabase project**, fill in `web/.env.local`
  (see `.env.example`), run `supabase/setup.sql`, create the first admin user.
  Until then the shop shows the seed products and checkout says "isn't connected yet".
- [ ] **P4.2 (owner) Real content:** product photos, prices, nutrition facts,
  About us story, contact details, social links. Replace every item marked
  `PLACEHOLDER` in the code (`grep -r PLACEHOLDER web/src`).
  *29 Sep 2026: first real wrapper received (Crispy Almond: 15g protein, 180 cal). Almond protein/calories set from it; a Higgsfield product shot of it (`web/src/assets/hero-almond.webp`) replaces the SVG bar fan in the home hero. Other three flavours still PLACEHOLDER.*
  *30 Sep 2026: desktop hero (1024px and up) plays a 5s Higgsfield video of the same shot, almonds dropping onto the slab, played once and held on its last frame (`web/public/video/hero-almond.mp4`); phones and reduced-motion visitors keep the still and never download the video.*
- [ ] **P4.3 New-order notification** (email via Resend or WhatsApp). Until then
  the team checks `/admin`.
- [ ] **P4.4 Hosting** (Vercel, root directory `web`) and domain. Only when asked.

## Phase 5: Later (version 2+)

- [ ] Online payment (card / Whish / OMT); `payment_method` column is already there.
- [ ] Stock counts that go down with each order, low-stock warning in admin.
- [ ] Pack sizes (single bar, box of 6, box of 12) and a mixed "variety box".
- [ ] Discount codes.
- [ ] Customer order tracking page by phone + reference.
- [ ] Subscriptions ("a box every month").
- [ ] Arabic version.

---

## Open questions (owner)

Assumed for now so the build isn't blocked; each is easy to change.

- **Prices:** placeholder **$30 per box of 12**, all flavours. Real prices?
- **Sold how?** Assumed boxes of 12 only. Single bars too?
- **Currency:** assumed USD.
- **Delivery:** assumed Lebanon only, **$3 fee, free over $60**. Real areas and fees?
- **Nutrition facts** per flavour (protein, calories, sugar, ingredients, allergens).
  Placeholders shown until then, marked in the code.
- **Contact details:** phone / WhatsApp, email, Instagram, address.
- **Who gets admin access**, and where should new-order alerts go?
- **Brand font:** is there an official typeface for the wordmark?
- **Domain** for the site.
