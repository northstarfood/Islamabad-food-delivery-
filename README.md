# FoodLane Islamabad

Food delivery marketplace for Islamabad, Pakistan. React + TypeScript + Vite, hosted on Cloudflare Pages.

**All restaurants and menus in the app are fictional DEMO data.** They are not real partners.

## Run / build
```
npm install
npm run dev      # local development
npm run build    # production build into dist/
```

## Structure
```
index.html, package.json, vite.config.ts, tsconfig*.json   (project root)
public/manifest.webmanifest
src/main.tsx, App.tsx (routes), style.css, types.ts, ui.ts, vite-env.d.ts
src/pages/        Home, Restaurant, Cart, Checkout, Confirmation
src/components/   PageHeader, QuantityStepper, CartBar
src/cart/         CartContext (cart state, saved in localStorage)
src/data/         demo restaurants and menus
src/lib/          format.ts (prices, delivery fee), orders.ts (local demo orders)
supabase/schema.sql   database tables + security policies (not connected yet)
archive/polished-homepage/   an alternative homepage design kept for reference (not built)
```

## Cloudflare Pages settings
- Framework preset: Vite (or None)
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: see `.env.example`
- Single-page-app routing: Cloudflare Pages serves `index.html` for unknown paths automatically
  when the project has no `404.html`, so refreshing `/cart` works.

## Configurable delivery fee
Set `VITE_DELIVERY_FEE` (default 150) and optionally `VITE_FREE_DELIVERY_ABOVE` in Cloudflare.

## Not connected yet
Orders are saved on the customer's own device only. See `supabase/schema.sql` and `.env.example`.
