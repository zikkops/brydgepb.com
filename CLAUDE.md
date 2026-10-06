# Brydge Protein Bars

E-commerce site for Brydge ("Built for you"), a protein bar brand with four
flavours (Almond, Strawberry, Dark Chocolate, Coconut Matcha). Next.js 16 app
with a Supabase back end, cash on delivery, GSAP animation.

- **Plan and task list:** `UPGRADE.md`. Work top-down, tick tasks when done.
- **Project notes:** AI brain vault, `C:\Users\User\Documents\ai brain\01 - Projects\Brydge Protein Bars\`.
  When a task lands, update the vault note and page notes to match.
- **App:** `web/` (see `web/AGENTS.md`: Next 16 has breaking changes; read
  `web/node_modules/next/dist/docs/` before writing code. Middleware is now `proxy.ts`,
  `params` is a Promise).
- Patterns are copied from `C:\Projects\tailored times\web`. Look there first.

## Commands (run in `web/`)

- `npm run dev`: local site at http://localhost:3000
- `npm test`: Vitest (order totals and delivery fee)
- `npm run lint`, `npm run build`: run both before calling a task done
- `npm run db:setup-sql`: regenerate `supabase/setup.sql` (migrations + seed, pasted into the Supabase SQL editor)

## Rules

- Brand colours live in `web/src/app/globals.css` and `web/src/data/products.ts`. Espresso is for text only; Warm Cream is the base background.
- Prices are always recalculated on the server (`src/lib/pricing.ts`). The cart total in the browser is only an estimate.
- Public pages never write to tables from the browser. Orders and contact messages go through server
  actions using the service-role client (`src/lib/supabase/admin.ts`), after validating input.
- Every admin page and server action calls `requireAdmin()`, even behind `proxy.ts`.
- Order statuses: `pending` → `confirmed` → `out_for_delivery` → `delivered` (+ `cancelled`).
- Payment is cash on delivery only (`payment_method = 'cod'`).
- All animation goes through GSAP and must respect `prefers-reduced-motion`.
- Made-up content is marked `PLACEHOLDER` in the code. Never present it as real.
- Not hosted yet. Never push or deploy without being asked.
