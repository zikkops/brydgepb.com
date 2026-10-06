# Brydge web

Next.js 16 + Supabase shop for Brydge protein bars. Plan: `../UPGRADE.md`.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # order totals
npm run lint && npm run build
```

## Connecting Supabase

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill in the URL, anon key and service-role key.
3. Paste `supabase/setup.sql` into Supabase → SQL Editor and run it once
   (regenerate it with `npm run db:setup-sql` after changing the migrations or `src/data/products.ts`).
4. Create an admin user as described at the end of `setup.sql`, then sign in at `/admin/login`.

Until then the site shows the seed products, and checkout/contact reply "isn't connected yet".
