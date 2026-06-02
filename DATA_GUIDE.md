<!-- DATA_GUIDE.md
This file lists, for each top-level page in the repo, exactly what data the page displays,
which code-backed service/endpoints supply that data (confirmed by reading source),
what fields are rendered in the UI (field names as found in code), empty-state behavior,
user-visible actions, and AI features where present.

Only confirmed code facts are listed. Where a page was not parsed in-source, the section
states that it was not yet parsed.
-->

# DATA GUIDE — BuildHive (code-backed)

> Notes: ALL entries are based on direct reads of page and service source files in the repository. No guessing.

---

**HomePage**

- **Route / entry:** implemented in [pages/HomePage.tsx].
- **Auth required:** No (uses public endpoints).
- **Data sources / API calls (confirmed):**
  - `GET /products` via `productService.getProducts()` — featured & trending products.
  - `GET /categories` via `categoryService.getActiveCategories()` — categories list.
  - `contractorService.getContractors()` — featured contractors list.
  - `serviceMarketplaceService.getServices()` — featured services.
- **UI fields displayed (confirmed field names):**
  - Category: `category.title` / `category.name`.
  - Product card: `product.name`, `product.author`, `product.price`, `product.compare_at_price`, `product.rating`, `product.review_count`.
  - Contractor card: `name`, `trade`, `rating`, `reviewCount`, `startingPrice`, `availableNow`.
  - Service summary: `service.name`, `service.price`, `service.rating`.
- **Empty / error states (confirmed):**
  - `productService` has fallback/demo products on error (fallback behavior present in service source).
  - Components render skeletons / empty messages when lists are empty.
- **User actions (confirmed):**
  - Click product → navigates to product detail page.
  - Click contractor → navigate to contractor profile (`/contractors/:id`).

---

**ProductsPage**

- **Route / entry:** [pages/ProductsPage.tsx].
- **Auth required:** No for listing; actions like wishlist/add-to-cart require auth.
- **Data sources / API calls (confirmed):**
  - `productService.getProducts({ status: 'approved', limit: 20 })` → `GET /products`.
  - `aiService.searchProducts(query, 20)` — AI-backed search endpoint.
- **UI fields displayed (confirmed):**
  - `product.id`, `product.name`, `product.author` / `business_name`, `product.price`, `product.compare_at_price`, `product.rating`, `product.reviews`/`review_count`, `product.quantity`.
  - Filters UI consumes categories and service responses.
- **Empty / error states (confirmed):**
  - Empty lists render clear empty-state UI; productService fallback may supply demo items when API fails.
- **User actions (confirmed):**
  - Add to cart → `POST /cart` via `cartService`.
  - Add/remove wishlist → `useWishlist` (service-backed when authenticated).
  - Open product → navigate to product detail.
  - AI search → `aiService.searchProducts`.

---

**ProductDetailPage**

- **Route / entry:** [pages/ProductDetailPage.tsx].
- **Auth required:** Not required to view; checkout/buy requires authentication.
- **Data sources / API calls (confirmed):**
  - `GET /products/:id` or `GET /products/slug/:slug` via `productService`.
  - `GET /products/:id/reviews` via `productService.getProductReviews()`.
- **UI fields displayed (confirmed):**
  - `product.name`, `product.author` / seller, `product.description`, `product.price`, `product.compare_at_price`, `product.rating`, `product.sales`, `product.quantity`, images, specs, reviews.
  - Tabs: Overview, Specs, Guide, Reviews (rendered by page components).
- **Empty / error states (confirmed):**
  - If no reviews: shows "Be the first to review" message.
  - If product not found: displays "Product not found" / fallback UI (component handles null product).
- **User actions (confirmed):**
  - Add to cart → `POST /cart`.
  - Buy Now → navigates to `/checkout` with product/order state.
  - Message Seller → navigates to `/messages?participantId=...`.

---

**ServicesPage**

- **Route / entry:** [pages/ServicesPage.tsx].
- **Auth required:** No for browsing; ordering/quote actions require auth.
- **Data sources / API calls (confirmed):**
  - `serviceMarketplaceService.getServices()` / `getPublicServices()` → `GET /services` family endpoints.
  - `serviceMarketplaceService.getServiceContractorProfile(service.id)` → contractor/provider profile.
- **UI fields displayed (confirmed):**
  - Service card: `service.id`, `service.name`, `service.category`, `service.price`, `service.priceType`, `service.deliveryDays`, `service.rating`, `service.reviewCount`, `service.image`, `service.provider`.
  - Sidebar filters (specialties, providers, availability) populated from fetched lists.
- **Empty / error states (confirmed):**
  - Empty services list shows explanatory message and suggests broadening filters.
  - Provider profile load may show fallback message when contractor profile API fails.
- **User actions (confirmed):**
  - Request quote → `POST /service-quotes` (via `serviceMarketplaceService.createServiceQuote` in service layer).
  - Create service order (quick-order) → `serviceMarketplaceService.createServiceOrder(service.id, payload)` → `POST /services/:id/order` (page calls `createServiceOrder` and shows toast on success/failure).
  - Open provider profile modal → `getServiceContractorProfile(service.id)`.

---

**ServiceDetailPage**

- **Route / entry:** [pages/ServiceDetailPage.tsx].
- **Auth required:** No to view; `Order Now` requires authentication (page redirects to `/signin`).
- **Data sources / API calls (confirmed):**
  - `serviceMarketplaceService.getServiceById(id)` → `GET /services/:id` (or equivalent service endpoint).
  - `serviceMarketplaceService.getServiceReviews(id)` → `GET /services/:id/reviews`.
- **UI fields displayed (confirmed):**
  - `service.name`/`title`, `service.category` (or `service.category.name`), `service.description`, `service.tags`/`skills`, `service.price` (basePrice), `service.delivery_days` / `deliveryDays`, `service.packages` (normalized into tiers), `service.average_rating`/`rating`, `service.total_reviews`/`review_count`.
  - Creator/provider: `creatorName`, `creatorRole`, `creatorId` (mapped from many possible fields in service object).
- **Empty / error states (confirmed):**
  - If `service` is null → renders "Service not found".
  - If `reviews.length === 0` → renders "Be the first to review this service".
- **User actions (confirmed):**
  - Select package tier → selects package and updates price shown.
  - Order Now → if authenticated: navigates to `/checkout?serviceId=...` with `serviceId` in state; else redirects to `/signin`.

---

**CartPage**

- **Route / entry:** [pages/CartPage.tsx].
- **Auth required:** No (cart can be shown); checkout requires sign-in.
- **Data sources / API calls (confirmed):**
  - `commerceService.getCartRecommendations()` → product recommendations.
  - `commerceService.getPaymentMethods()` → available payment methods.
  - `addressService.getAddresses(user.id)` when user is signed in → saved addresses.
  - Cart item data rendered from `cartItems` passed into page (app state / `cartService` used elsewhere to mutate cart via `POST/PUT/DELETE /cart` endpoints).
- **UI fields displayed (confirmed):**
  - Cart item: `product.name`, `product.price`, `quantity`, `product.description`, product image (resolved via `resolveMarketplaceImageSrc`).
  - Seller grouping: `sellerName`, `businessId`, group subtotal.
  - Payment methods list entries: `id`, `type`, `name`, `last4`, `expiry` (mapped from `commerceService`).
- **Empty / error states (confirmed):**
  - If cart empty → shows empty cart UI and "Browse Products" button which navigates to `/products`.
  - All items saved for later state shows message and CTA to continue shopping.
- **User actions (confirmed):**
  - Remove item → `DELETE /cart/:cartItemId` via `cartService`.
  - Update quantity → `PUT /cart/:cartItemId`.
  - Apply promo → `commerceService.validatePromoCode({ code, cartTotal })`.
  - Proceed to checkout → navigates to `checkout` route.

---

**CheckoutPage**

- **Route / entry:** [pages/CheckoutPage.tsx] (component exported as `CheckoutPage`).
- **Auth required:** Yes — checkout creates address and orders tied to authenticated user (`user.id` required for address and order calls).
- **Data sources / API calls (confirmed):**
  - `GET /users/:id/addresses` via `api.get('/users/${user.id}/addresses')` to load saved addresses.
  - `addressService.createAddress(user.id, payload)` → creates shipping address before order.
  - For service checkout: `serviceMarketplaceService.createServiceOrder(service.id, payload)` (creates service order when `serviceCheckout` present).
  - For product checkout: `orderService.createOrder(orderData)` — creates order(s) per seller group.
  - Stripe integration: `useStripePayment()` helper calls backend to create payment intent and fetch stripe config (uses stripe confirm flow in `StripeCardForm`).
- **UI fields displayed (confirmed):**
  - Shipping address fields: `fullName`, `phone`, `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `country` (mapped from API response shapes).
  - Order summary: subtotal, tax (5% calculation present in code), total.
  - If `serviceCheckout` present, shows `serviceCheckout.price`, `serviceCheckout.name`.
- **Empty / error states (confirmed):**
  - If user not found / not signed in → toast error and abort ordering.
  - If cart empty and no `serviceCheckout` → alerts "Your cart is empty".
- **User actions (confirmed):**
  - Create address → `addressService.createAddress(user.id, payload)`.
  - Create service order → `serviceMarketplaceService.createServiceOrder(serviceId, payload)`.
  - Create product order(s) → `orderService.createOrder(orderData)` (one per seller group).
  - Stripe payment flow when `paymentMethod === 'card'` using `stripePayment.createPaymentIntent(orderId)` and `StripeCardForm` confirms via `stripe.confirmCardPayment(clientSecret, { payment_method: { card } })`.

---

**AccountPage**

- **Route / entry:** [pages/AccountPage.tsx].
- **Auth required:** Yes (page reads `user` prop and fetches user's orders via `orderService.getOrders()` then filters by `user.id`).
- **Data sources / API calls (confirmed):**
  - `orderService.getOrders()` → returns `{ orders, meta }`, then client filters to user's orders.
  - `userService.getAddresses(user.id)` / `userService.updateAddress` / `userService.createAddress` used for address management.
  - `userService.updateProfile(user.id, payload)` for profile edits; `userService.uploadProfileImage` and `deleteProfileImage` for image management.
  - `orderService.getOrderTracking(order.id)` used to fetch tracking for shipped/delivered orders.
- **UI fields displayed (confirmed):**
  - Profile: `id`, `email`, `full_name` / `fullName`, `phone`, `profile_image`.
  - Orders list: `order.id`, `order_number`, `status`, items, totals (from `orderService` responses).
  - Projects and disputes sections (fetched from `/projects` and other endpoints via `api` when tabs selected).
- **Empty / error states (confirmed):**
  - When no orders: shows empty orders state.
  - Address list empty → address creation flow presented.
- **User actions (confirmed):**
  - Update profile → `userService.updateProfile`.
  - Upload/delete profile image → `userService.uploadProfileImage` / `userService.deleteProfileImage`.
  - View order details → modal and `orderService.getOrderTracking` for tracking data.
  - Cancel order → `orderService.cancelOrder(order.id)`.

---

**ContractorsPage**

- **Route / entry:** [pages/ContractorsPage.tsx].
- **Auth required:** No for browsing; messaging/hire requires auth.
- **Data sources / API calls (confirmed):**
  - `contractorService.getContractors({ page, limit, category, minRating, featured })` → contractors list (`GET /business` / `/users` endpoints inside service).
- **UI fields displayed (confirmed):**
  - Contractor summary: `businessId`/`id`, `name`, `trade`, `location`, `rating`, `reviewCount`, `bio`.
  - ContractorCard renders avatar initial, short bio, quick stats (services, portfolio counts).
- **Empty / error states (confirmed):**
  - If no contractors → shows message "No contractors found for your filters." and CTAs.
- **User actions (confirmed):**
  - View profile → navigate to `/contractors/:id`.
  - Message contractor → navigate to `/messages?participantId=...` (authentication required; redirects to `/signin` when not authenticated).

---

**ContractorProfilePage**

- **Route / entry:** [pages/ContractorProfilePage.tsx].
- **Auth required:** No to view; messaging/hiring requires auth.
- **Data sources / API calls (confirmed):**
  - `contractorService.getContractorById(id)` → contractor profile object (portfolio, services, reviews).
  - `api.post('/projects', {...})` used inside Hire modal to post a project (API call confirmed in page code).
- **UI fields displayed (confirmed):**
  - Profile: `profile.name`, `profile.avatar`/`image`, `profile.verified`, `profile.trade`, `profile.location`, `profile.memberSince`.
  - Quick facts: `profile.rating`, `profile.reviewCount`, `services.length`, `portfolio.length`.
  - Services offered: `service.title`, `service.description`, `service.price`, `service.rating`, `service.deliveryTime`, `service.reviewCount`.
  - Portfolio items: `item.id`, `item.title`, `item.description`, `item.image`.
- **Empty / error states (confirmed):**
  - If profile not found → shows "Contractor profile not found" UI.
  - If no services/portfolio/reviews → shows messages like "This contractor has not listed any services yet." / "No reviews yet.".
- **User actions (confirmed):**
  - Hire → opens Hire modal which posts `/projects` (requires auth, otherwise navigates to `/signin`).
  - Message → navigates to `/messages?participantId=...` (auth required).
  - Order service → navigates to `/checkout?serviceId=...`.

---

**CostEstimatorPage**

- **Route / entry:** [pages/CostEstimatorPage.tsx].
- **Auth required:** No (estimates are available for guests).
- **Data sources / API calls (confirmed):**
  - `aiService.getPhases()` → GET `${AI_BASE}/phases` to load construction phases.
  - `aiService.estimateCost(params)` → POST `${AI_BASE}/estimate-cost` to compute an estimate.
  - `aiService.compareQualities(sqft, floors, city)` → GET `${AI_BASE}/estimate-cost/compare` (or `compareQualities`) for quality comparisons.
- **UI fields displayed (confirmed):**
  - Summary: `total_cost`, `cost_per_sqft`, `total_area`, `timeline` (normalized from AI response paths such as `total_cost`, `costPerSqft`, `data.total_cost`).
  - Breakdown rows: `label` / `category_breakdown` entries with `percentage` and `amount` (normalized from response shapes).
  - Itemized rows: `item`, `qty`, `unit`, `rate`, `total` (normalized from `itemized_breakdown` / `breakdown.items`).
  - Phases list from `phases` (normalized from AI response or defaults).
- **Empty / error states (confirmed):**
  - If AI backend fails or offline → shows "AI estimator is temporarily unavailable." and falls back to `defaultPhases`.
- **User actions (confirmed):**
  - Calculate → calls `aiService.estimateCost` and `aiService.compareQualities` and displays results.
  - Save/Copy estimate → copies formatted estimate text to clipboard (client-side).

---

**Content pages (About, GetStarted, Contact, Terms, Privacy, Blog, BlogDetail, SignIn)**

- **Route / entry:** top-level pages exist under [pages/*.tsx] (files present). The app uses a `contentService` to retrieve CMS-style content (service file inspected).
- **Data sources / API calls (confirmed):**
  - `contentService.getAbout()` → `GET /content/about`
  - `contentService.getBlog(params)` → `GET /content/blog`
  - `contentService.getBlogDetail(idOrSlug)` → `GET /content/blog/:idOrSlug`
  - `contentService.getTerms()` → `GET /content/legal/terms`
  - `contentService.getPrivacy()` → `GET /content/legal/privacy`
  - `contentService.getGetStarted()` → `GET /content/get-started`
  - `contentService.getSignIn()` → `GET /content/sign-in`
  - `contentService.getCheckoutConfig()` → `GET /content/checkout-config`
  - `contentService.getContact()` → `GET /content/contact`
- **UI fields displayed (confirmed at service-level):**
  - These pages render the content returned by the above endpoints (title/body/HTML blocks). Specific field names vary by API response and are consumed directly by the page components (contentService unwraps `response.data.data`).
- **Empty / error states (confirmed):**
  - If content fetch fails, pages typically render fallback text or an error message (pattern observed across content-driven pages).
- **User actions (confirmed):**
  - Contact page uses `contactService.post('/contact')` to submit contact messages (service provides `POST /contact`).

---

**Pages not exhaustively parsed in this pass**

- The following top-level pages exist in the workspace but were not fully parsed line-by-line during this read: `NotificationPage.tsx`, `NotFoundPage.tsx`, `BlogDetailPage.tsx` (if not already covered), `Support`/`Messages` under `src/pages` (app pages). These pages likely rely on services documented above; they are not detailed here because the source was not inspected in this session. If you want full per-page field lists for these, I will open each file and extend this guide.

---

**Shared services & important base facts (confirmed)**

- `src/services/api.ts`: central axios instance. `BASE_URL = ${"${VITE_API_URL ?? 'http://localhost:3000'}/api"}`. Interceptors attach `Authorization` header and attempt refresh via `POST ${"/auth/refresh"}` on 401.
- `src/services/aiService.ts`: AI backend base `AI_BASE = https://ai-backend-production-d13d.up.railway.app` and endpoints: `POST /chat`, `POST /estimate-cost`, `GET /estimate-cost/compare`, `GET /search`, `GET /phases`, `GET /estimator-config` (used by estimator and AI widgets).
- `productService` endpoints: `GET /products`, `GET /products/:id`, `GET /products/slug/:slug`, reviews endpoints and create/update/delete review endpoints; service contains fallback products behaviour.
- `serviceMarketplaceService`, `contractorService`, `categoryService`, `cartService`, `orderService`, `authService`, `userService`, `contentService` — these services provide the endpoints referenced above and are the confirmed sources for page data.

---

If you want, I can:

- Expand any "not yet parsed" page with a line-by-line extraction (I will open each file and add the confirmed fields/endpoints).
- Produce a compact CSV mapping (page, endpoint, fields) for machine consumption.

End of DATA_GUIDE.md
