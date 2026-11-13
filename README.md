# FoodLane Islamabad

A demo food-delivery marketplace for Islamabad, Pakistan, built with React,
TypeScript, and Vite.

**Restaurants, menus, delivery fees, and orders are fictional demo data.** Orders
are saved only in the current browser's local storage; no restaurant receives
an order and no food is delivered.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build` and serve it locally with
`npm run preview`. The production build is written to `dist/`.

## Project structure

- `src/` contains the active application:
  - `App.tsx`, `main.tsx`, and `style.css` — application entry and routing
  - `pages/` — home, restaurant, cart, checkout, and confirmation pages
  - `components/` and `cart/` — shared UI and cart state
  - `data/` and `lib/` — demo restaurants, formatting, and local demo orders
- `schema.sql` is a draft database schema; the app is not connected to it.
- The root-level duplicate app files and `foodlane-mvp-cart-fixed.zip` are
  retained as references. The build uses the application in `src/`.

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- The app uses client-side routes; configure the host to serve `index.html` for
  route requests if its defaults do not already support single-page apps.

The demo delivery fee is a placeholder defined in `src/lib/format.ts`.
