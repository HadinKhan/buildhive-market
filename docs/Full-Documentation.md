# BuildHive Marketplace — Full Documentation

Purpose: concise, professional reference for developers and product team. Covers architecture, how to run, env, pages, components, services (API contracts inferred from frontend), payment flow, gaps, and next steps.

## 1. Project Summary

- Name: BuildHive Marketplace
- Stack: React 19 + TypeScript, Vite, Axios, Stripe Elements
- App type: Single-Page Application (SPA) for product + services marketplace

## 2. Quick Start

Prerequisites: Node.js (18+), npm

Run locally:

```bash
npm install
npm run dev
# open http://localhost:4200
```

Build:

```bash
npm run build
npm run preview
```

## 3. Environment Variables

Place values in `.env` at project root. Example in `docs/.env.example`.

- `VITE_API_URL` — backend base URL (e.g. https://api.example.com/api)
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key (pk_live or pk_test)
- `GEMINI_API_KEY` — optional AI key (if used)

Do NOT commit real secrets. Use CI secret manager for prod keys.

## 4. Project Layout (important files)

- `index.tsx` — React entry
- `App.tsx` — router + layout
- `types.ts` — shared DTO shapes used across app
- `pages/` — route-level pages (Home, Products, ProductDetail, Cart, Checkout, Account, SignIn, Services, etc.)
- `components/` — small shared UI (Button, Icons, Layout, ProductCard)
- `src/components/StripeCardForm.tsx` & `StripeProviderWrapper.tsx` — Stripe UI
- `src/services/` — API service wrappers (api.ts, authService.ts, productService.ts, cartService.ts, orderService.ts, userService.ts, addressService.ts, categoryService.ts, businessService.ts, contactService.ts, commerceService.ts, serviceMarketplaceService.ts, settingsService.ts)
- `src/hooks/` — custom hooks (`useStripePayment`, `useWishlist`, `useFilters`)

## 5. Architecture (high level)

- Client-only SPA. Backend API (config via `VITE_API_URL`) supplies auth, products, cart, orders, payments.
- Axios instance (`src/services/api.ts`) sets base URL and injects bearer token from storage/cookie.
- Stripe: client creates payment intent via backend endpoint, then confirms via Stripe Elements.

Sequence (checkout):

1. Create order on backend (POST `/orders`) → returns order id
2. Backend returns payment intent client secret (POST `/payment/create-payment-intent`)
3. Client uses Stripe Elements to confirm card payment with client secret
4. On success, client notifies backend (POST `/payment/confirm-payment`) or backend webhook validates

## 6. Pages & Components (brief)

- HomePage — landing with featured items
- ProductsPage — product listing w/ filters
- ProductDetailPage — product view and reviews
- CartPage — cart management
- CheckoutPage — checkout + Stripe
- Account/Settings/Notifications — user profile management
- ServicesPage — contractor/service marketplace

Shared components: `Button`, `ProductCard`, `Layout`, `Icons`.

## 7. Services & API Contracts (inferred)

Base URL: `VITE_API_URL` (e.g. `http://localhost:3000/api`)

Auth (src/services/authService.ts)

- POST `/auth/register` — body: `{ email, password, fullName, phone?, role? }` → returns `{ user, accessToken, refreshToken }`
- POST `/auth/login` — body: `{ email, password }` → returns `{ user, accessToken, refreshToken }`
- POST `/auth/logout` — auth
- GET `/auth/me` — returns current user
- POST `/auth/refresh` — body: `{ refreshToken }` → new tokens

Products (src/services/productService.ts)

- GET `/products` — query: `search, categoryId, page, limit, sortBy` → `{ products[], meta }`
- GET `/products/:id` — product detail
- GET `/products/slug/:slug` — by slug
  Reviews endpoints under `/products/:productId/reviews` for GET/POST/PUT/DELETE.

Cart (src/services/cartService.ts)

- GET `/cart` — user cart
- POST `/cart` — body: `{ productId, quantity }`
- PUT `/cart/:cartItemId` — update quantity
- DELETE `/cart/:cartItemId` and `/cart/clear/all`

Orders (src/services/orderService.ts)

- GET `/orders` — list (query by status)
- GET `/orders/:id` — detail
- POST `/orders` — create (body: items, addresses, paymentMethod)
- PUT `/orders/:id/cancel` — cancel
- GET `/orders/:id/invoice` — PDF

Users & Addresses (userService.ts, addressService.ts)

- GET/PUT `/users/profile`, `/users/:id`, `/users/:userId/addresses`, etc.

Payments / Stripe (useStripePayment hook)

- GET `/payment/config` — returns publishable key (optional)
- POST `/payment/create-payment-intent` — body: `{ orderId }` → `{ clientSecret }`
- POST `/payment/confirm-payment` — optional server confirmation

Contact (contactService.ts)

- POST `/contact` — `{ name, email, phone, subject, message }`

Services marketplace (serviceMarketplaceService.ts)

- GET `/services` — query filters
- POST `/services/:id/order` — to book/order a service

Notes: DTO field names derived from `types.ts` and services; verify exact shapes with backend team.

## 8. Auth & Security

- Uses JWT access + refresh tokens pattern (access token in memory/storage, refresh via cookie or storage). Axios attaches bearer token.
- AuthContext exists but is currently commented out; consider enabling or using a lightweight auth provider.
- Protect production keys; store in environment secrets / key vault.

## 9. External Integrations

- Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`) for payments.
- React Toastify for notifications.

## 10. Dev / Build / Deploy

- `npm run dev` — Vite dev server (4200)
- `npm run build` — produce static `dist/`
- `npm run preview` — preview production bundle

Deployment notes:

- Provide `VITE_API_URL` pointing to production API.
- Set `VITE_STRIPE_PUBLISHABLE_KEY` to live key in prod.
- Configure backend webhooks for Stripe to confirm payments securely.

## 11. Known Gaps & Risks

- `AuthContext.tsx` commented out — global auth flow incomplete.
- No `Dockerfile`, CI, or deployment docs.
- No OpenAPI/Swagger exported from backend; error shapes not documented.
- No `.env.example` in repo (added in `docs/.env.example`).
- No tests or lint config present.

## 12. Next Steps (recommended)

1. Provide backend repo or OpenAPI spec to generate machine-readable API docs.
2. Restore or implement `AuthContext` for centralized auth state.
3. Add `.env.example` (done) and CI secrets config steps.
4. Add basic test suite (Vitest/Jest) and linting (ESLint/Prettier).
5. Add deployment guide and Dockerfile.
6. Generate OpenAPI (manual from `src/services/`) and publish Swagger UI.

## 13. Contact / Handoff

For clarifications, provide backend repo or credential procedure. I can generate OpenAPI and curl examples once backend details available.

---

Generated from frontend codebase analysis on 2026-05-06. Caveman style option used where possible to reduce verbosity.
