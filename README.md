# DesiDhar

Storefront and operations console for a small-batch Indian dairy and mithai
business: milk, ghee, makkhan, paneer, dahi, cream, mithai and combo packs.

The repository contains both halves of the application:

- **`src/`** — React 19 + TypeScript SPA (Vite, Tailwind, Zustand, React Router).
- **`server/`** — Node HTTP API backed by SQLite (`node:sqlite`), with
  migrations, server-authoritative cart pricing, OTP sessions, orders and an
  admin API.

Every price, stock count, delivery slot, coupon, review and order shown in the
UI comes from the API. There is no bundled sample catalogue in the frontend:
when the database is empty the storefront renders empty states, and when a
request fails it renders an actionable error instead of a fallback record.

## Quick start

```bash
npm ci
cp .env.example .env          # then set OTP_SECRET / SMS provider as needed
npm run db:migrate            # create the SQLite schema
npm run db:seed               # import the catalogue + serviceable pincodes
npm run dev                   # API on :8787, Vite on :5173 with /api proxy
```

`npm run dev` starts the API and the Vite dev server together. The SPA always
talks to `/api` on its own origin; Vite proxies that path to the API server, so
the session cookie stays first-party.

For a production-style run:

```bash
npm run build
npm start                     # serves dist/ and /api from one process
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | API + Vite dev server (`tools/dev.mjs`) |
| `npm run build` | Type-check the SPA and build `dist/` |
| `npm start` | Serve `dist/` and the API from `server/index.mjs` |
| `npm run api` | API only |
| `npm run db:migrate` | Apply `server/db/migrations/*.sql` |
| `npm run db:seed` | Import the catalogue, pincodes and coupons (idempotent) |
| `npm run admin:grant -- <phone>` | Promote a registered mobile number to admin |
| `npm test` | API integration tests against a throwaway SQLite database |
| `npm run lint` | Oxlint |

## Configuration

All server configuration lives in environment variables (or `.env`, which is
git-ignored). See `.env.example` for the full list. The important ones:

- `OTP_SECRET` — HMAC secret for OTP hashes. Set a long random value in production.
- `OTP_DEV_ECHO` — development only; returns the OTP in the API response so you
  can sign in without an SMS provider.
- `SMS_PROVIDER` — `console` (development), `msg91`, or `unconfigured`.
- `ADMIN_PHONES` — comma-separated staff numbers promoted to admin at sign-in.
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — when both are set, online payments
  become available. Only the public key id is ever sent to the browser.
- `DB_PATH`, `PORT`, `HOST`, `SERVE_STATIC`.

## Data model and data policy

`server/db/migrations/001_init.sql` defines the schema (users, addresses,
categories, products, variants, images, serviceable pincodes, coupons, orders,
order items, order events, inventory log, reviews, wishlist, contact messages,
newsletter subscribers, settings). `server/db/seed/catalog.json` is the catalogue
source of truth for the importer and mirrors the product photography that ships
in `public/images/products/`.

- Products without a product-specific photograph are seeded with
  `assetStatus = "pending_studio_shot"` and render a labelled category
  placeholder. Images are never borrowed from another product.
- Catalogue import is an explicit operator step (`npm run db:seed`); it is not
  part of the server boot path and never overwrites edited prices or stock.
- Ratings are computed from published reviews. With no reviews the average is
  `null` and the UI says so.
- Orders are priced and stock-checked on the server. The browser sends variant
  ids and quantities only; totals, payment state and order status are set by the
  API.
- Online payment success is only recorded after the provider signature is
  verified server-side. Without Razorpay keys, online methods are disabled and
  cash on delivery remains available.

## Tests

`npm test` boots the real API against a temporary SQLite database seeded from
`server/db/seed`, then exercises the catalogue, filters, serviceability, coupon
validation, OTP sessions, addresses, wishlist, order placement and cancellation,
reviews, admin authorization and payment gating over HTTP. It never touches
`server/data/desidhar.db`.

## Project layout

```
server/            API, migrations, seed importer, integration surface
server/db/seed/    catalogue, coupons, serviceable pincodes
src/               SPA (pages, components, stores, API client, types)
tests/             Node test runner suites (HTTP-level)
tools/             dev runner and admin utilities
public/images/     verified product photography + category placeholders
```
