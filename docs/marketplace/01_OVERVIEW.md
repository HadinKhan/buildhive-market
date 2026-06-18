# BuildHive Market - System Overview & Architecture

## Plain English Description
BuildHive Market is the public-facing marketplace and buyer portal for BuildHive. It is designed as an open e-commerce platform for home builders, contractors, and general buyers to browse, compare, and order construction materials, book services, hire contractors, and run AI-based cost estimations for house construction in Pakistan. 

## Target Users
* **Guests**: Unauthenticated users who can browse products, services, and contractors, view detail pages, read blogs, submit contact messages, and run AI cost calculations.
* **Buyers**: Authenticated customers who can manage a shopping cart, submit product orders, request custom quotes, complete payments (COD or Card), manage messages, file disputes, and track order milestones.
* **Contractors/Sellers (Browsers)**: Authenticators browse and use the public site but are redirected to the dashboard portal for managing their listings and profiles.

## Differences: Marketplace vs. Dashboard
| Feature | BuildHive Market (Public Port 5173) | DashboardBuildhive (Private Port 5000) |
| :--- | :--- | :--- |
| **Primary Audience** | Buyers, Guest users, Public browsers | Sellers, Contractors, Administrators |
| **Authentication** | Optional for browsing; Required for checkout | Mandatory for all actions |
| **Core Functions** | Catalog browsing, Cart, Cost Estimation, Checkout | Listing inventory, Order fulfillment, Approvals |
| **Account Pages** | Buyer account pages are self-contained here | Seller/Contractor settings and admin panels |

## Tech Stack
* **Core**: React 19, TypeScript, Vite 6
* **Styling**: Tailwind CSS (CDN-delivered in `index.html`), custom CSS strings dynamically injected via CSS-in-JS style files under `src/styles/`
* **Router**: React Router DOM 7
* **Payment Gateway**: Stripe React Elements (`@stripe/react-stripe-js`)
* **Icons**: Lucide React, React Icons
* **HTTP Client**: Axios

---

## Local Development Configuration
### Running Locally
To run the marketplace application locally, execute the following commands:
```bash
# 1. Install dependencies
npm install

# 2. Run the development server (runs on port 5173 by default)
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

### Environment Variables
Variables are configured via `.env` (or `.env.example` as a template):
* `VITE_API_URL`: The Base URL of the main Express backend API. Defaults to `http://localhost:3000` if not set. Interceptors suffix this with `/api` for requests.
* `VITE_STRIPE_PUBLISHABLE_KEY`: The Stripe public key token used to initialize Stripe Elements in `CheckoutPage` (e.g. `pk_test_...`).

### Port and Connectors
* **Marketplace Port**: Runs on port `5173`.
* **Main Backend Connection**: Connects to the Express backend via `api.ts` Axios instance pointing to `VITE_API_URL + "/api"`. Request interceptors inject bearer tokens, and response interceptors handle 401 token refresh mechanisms.
* **AI Backend Connection**: Connects directly from the client frontend to Hamad's independently deployed AI service on Render at `https://ai-backend-b3yd.onrender.com` using native `fetch` requests inside `aiService.ts`.

---

## Folder Structure
* `buildhive-market/`
  * `components/` — Core layout shell, cards, icons, and chat widgets.
    * `AIChatWidget.tsx` — Persistent AI chatbot widget.
    * `Button.tsx` — Styled theme button.
    * `ContractorCard.tsx` — Reusable contractor card.
    * `Icons.tsx` — SVG icon maps.
    * `Layout.tsx` — Core layout container (Header & Footer).
    * `ProductCard.tsx` — Reusable product item card with fallback placeholder.
  * `docs/`
    * `marketplace/` — Public documentation folder.
  * `pages/` — Main page containers.
    * `AboutPage.tsx` — General story and team list.
    * `AccountPage.tsx` — Buyer personal profile (orders, messages, disputes).
    * `BlogDetailPage.tsx` / `BlogPage.tsx` — CMS construction guides pages.
    * `CartPage.tsx` — Shopping cart item quantities editor.
    * `CheckoutPage.tsx` — Checkout billing address and card payment forms.
    * `ContactPage.tsx` — Admin inquiry submission form.
    * `ContractorProfilePage.tsx` — Contractor portfolio, services, and hiring modal.
    * `CostEstimatorPage.tsx` — AI cost breakdown calculator page.
    * `DisputeDetailPage.tsx` — Project dispute logs chat.
    * `EmailVerifyPage.tsx` — Handles auth verify email hooks.
    * `GetStartedPage.tsx` — User registration form page.
    * `HomePage.tsx` — Landings page, animations, categories.
    * `NotFoundPage.tsx` — 404 page.
    * `NotificationPage.tsx` — Notification alerts feed list.
    * `OrderConfirmationPage.tsx` — Post-checkout success message page.
    * `PrivacyPage.tsx` / `TermsPage.tsx` — Policy pages.
    * `ProductDetailPage.tsx` — Product details, reviews, Q&As, timeline.
    * `ProductsPage.tsx` — Directory grid with filters sidebar and AI Search.
    * `RecommendationsPage.tsx` — LLM-based construction items recommendations.
    * `ResetPasswordPage.tsx` — Triggers account password resets.
    * `ServiceDetailPage.tsx` — Services descriptions and package selections.
    * `ServicesPage.tsx` — Services directory layout.
    * `SettingsPage.tsx` — Security setting configurations.
    * `SignInPage.tsx` — User logins form page.
  * `public/` — Public asset files.
    * `productsplaceholder.png` — Fallback image for missing product images.
    * `Build-Hive-Logo.png` — Corporate branding logo.
  * `src/`
    * `components/` — Payment specific Stripe components.
      * `StripeCardForm.tsx` — Stripe card credit inputs details.
      * `StripeProviderWrapper.tsx` — Stripe Elements client context.
    * `context/`
      * `AuthContext.tsx` — Global login/logout session states, role gate checking.
    * `data/` — Static text blocks mapping pages UI text.
    * `hooks/` — Custom React hooks (useWishlist, useFilters, useScrollAnimation).
    * `pages/` — Messages and support pages.
      * `Messages.tsx` — Chat inbox UI.
      * `Support.tsx` — Tickets list and creation forms.
    * `services/` — Axios endpoint triggers (productService, aiService, cartService).
    * `styles/` — CSS strings mapping page-specific styles.
    * `types/` — Global TypeScript interface structures.
    * `utils/` — Helpers (cookies, storage fallbacks, image normalizers).
    * `index.css` — Basic stylesheet setup.
  * `App.tsx` — App router map, layout wrapper, global cart states.
  * `index.html` — HTML document setup, CDN Tailwind scripts, theme loader.
  * `index.tsx` — Mounts App and sets unhandled promise checks.
  * `package.json` — Dependency and script manager.
  * `tsconfig.json` — TS configuration settings.
  * `vite.config.ts` — Vite alias resolver and server port mappings.

---

## Key Architectural Decisions

### 1. Cart State in App.tsx
The shopping cart state (`cart` array, `addToCart`, `removeFromCart`, `updateQuantity`, and `clearCart` operations) is declared globally in `App.tsx` and passed as props down to pages. This decision was made to:
- Persist the cart count badge value in the header across all navigation page changes.
- Prevent race conditions where adding an item on `ProductDetailPage` fails to reflect instantly when navigating to `CartPage`.

### 2. Buyer Account Page inside Marketplace
Unlike Sellers and Contractors who get redirected to port `5000` (DashboardBuildhive) to perform active operations, Buyer operations (viewing past orders, updating billing addresses, sending messages to sellers, and filing dispute reports) are completely self-contained within this marketplace app at `/account`. This prevents general buyers from ever having to interface with the complicated dashboard code, keeping their user experience streamlined.

### 3. Role Validation Gate in AuthContext
Although the API login route accepts credentials for any user, the marketplace's `AuthContext` contains a hard gate blocking non-buyers:
```typescript
if (user && user.role !== 'buyer') {
  // Disallow login, clear cookie, throw error warning
}
```
This forces Sellers, Contractors, and Admins to stay in their specialized portal at port `5000` while preserving port `5173` solely for buyers and guest traffic.

### 4. Guest vs. Authenticated Users
Guests are allowed to browse products, read blogs, view details, use the cost estimator, and get recommendations. However, the moment they attempt to add an item to the cart, write a review, hire a contractor, order a service, or access personal messages/tickets, they are intercepted by the `ProtectedRoute` wrapper or inline handlers and redirected to `/signin` with a `returnUrl` parameter.
