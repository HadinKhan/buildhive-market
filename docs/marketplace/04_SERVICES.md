# BuildHive Market - API Services Catalog

This document details all API services located under [src/services/](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/services/). It explains base configurations, Axios and fetch request structures, security token interceptors, fallback arrays, and mapping functions.

---

## 1. Core API Client (`api.ts`)

* **Purpose:** The centralized Axios wrapper instance. It configures default headers, injects session security headers, catches authentication failures (401), and handles refresh token requests.
* **Base Configuration:**
  - `baseURL`: `import.meta.env.VITE_API_URL || "http://localhost:3000"` post-fixed with `/api`.
  - `timeout`: `30000` ms.
  - `headers`: `Content-Type: application/json`.
* **Request Interceptor:**
  - Automatically queries the cookie store for an active access token using the `cookies.ts` utility.
  - If a token exists, it appends it to the headers: `Authorization: Bearer {accessToken}`.
* **Response Interceptor & 401 Handler:**
  - If a request returns `401 Unauthorized`, it pauses the queue and attempts a refresh token transaction:
    1. Sets a `_retry` flag on the request to prevent infinite retry loops.
    2. Sends a `POST /auth/refresh` request containing the refresh token retrieved from cookies.
    3. If the refresh request succeeds, it saves the new access and refresh tokens. It then updates the `Authorization` header and re-runs the original request.
    4. If the refresh request fails (e.g. the refresh token has expired), it clears local session storage, removes auth cookies, and redirects the browser window to `/signin?returnUrl=...`.

---

## 2. Address Service (`addressService.ts`)

* **Purpose:** Handles the creation and retrieval of user shipping and billing addresses.
* **Methods:**
  * `getAddresses(userId: string)`:
    - **Endpoint:** `GET /users/:userId/addresses`
    - **Returns:** `Promise<Address[]>`
    - **Error Fallback:** Catches exceptions and returns an empty array `[]`.
  * `createAddress(userId: string, data: CreateAddressData)`:
    - **Endpoint:** `POST /users/:userId/addresses`
    - **Returns:** `Promise<Address>`

---

## 3. AI Service (`aiService.ts`)

* **Purpose:** Handles integration with Hamad's AI backend, enabling chatbot messaging, cost estimations, and recommendations.
* **Base Configuration:**
  - Direct connection URL: `https://ai-backend-b3yd.onrender.com` (not routed through the main Express backend).
  - Uses native `fetch` requests with JSON payloads (bypasses Axios and authorization headers).
* **Methods:**
  * `chat(query: string, conversationId?: string)`:
    - **Endpoint:** `POST /chat`
    - **Payload:** `{ query, user_role: "buyer", conversation_id: conversationId, use_llm: true }`
    - **Returns:** `Promise<{ answer: string; suggestedFollowUps: string[]; responseId: string }>`
    - **Offline Fallback:** If the endpoint is down, it returns a friendly error message and suggested follow-ups: `"The AI assistant is temporarily offline. Please try again in a few moments."`
  * `estimateCost(params: EstimateParams)`:
    - **Endpoint:** `POST /estimate-cost`
    - **Payload:** `{ city, projectType, area, floors, quality, bhk }`
    - **Returns:** `Promise<EstimateResponse>` (pricing structures and phase schedules).
  * `compareQualities(sqft: number, floors: number, city: string)`:
    - **Endpoint:** `GET /estimate-cost/compare`
    - **Returns:** `Promise<ComparisonRow[]>`
  * `getRecommendations(params: RecommendParams)`:
    - **Endpoint:** `POST /recommend`
    - **Payload:** `{ description, city, quality, budget }`
    - **Returns:** `Promise<Recommendation[]>`
  * `getPhases()`:
    - **Endpoint:** `GET /phases`
    - **Returns:** `Promise<PhaseItem[]>`
    - **Offline Fallback:** Returns a hardcoded list of standard Pakistani construction phases.
  * `getEstimatorConfig()`:
    - **Endpoint:** `GET /estimator-config`
    - **Returns:** `Promise<Config>`

---

## 4. Auth Service (`authService.ts`)

* **Purpose:** Handles account registration, login sessions, email verification, and password recovery.
* **Methods:**
  * `register(data: RegisterData)`:
    - **Endpoint:** `POST /auth/register`
    - **Returns:** `Promise<AuthResponse>`
  * `login(credentials: LoginCredentials)`:
    - **Endpoint:** `POST /auth/login`
    - **Returns:** `Promise<AuthResponse>`
    - **Session Storage:** Saves the user profile object in local storage and sets session cookies (`accessToken` and `refreshToken`).
  * `logout()`:
    - **Endpoint:** `POST /auth/logout`
    - **Cleanups:** Clears local storage keys (`user`, `wishlist`, `cart`) and deletes session cookies.
  * `getCurrentUser()`:
    - **Endpoint:** `GET /auth/me`
    - **Returns:** `Promise<User>`
  * `forgotPassword(data: ForgotPasswordData)`:
    - **Endpoint:** `POST /auth/forgot-password`
  * `resetPassword(data: ResetPasswordData)`:
    - **Endpoint:** `POST /auth/reset-password`
  * `changePassword(oldPassword, newPassword)`:
    - **Endpoint:** `PUT /auth/change-password`
  * `verifyEmail(token: string)`:
    - **Endpoint:** `POST /auth/verify-email`
  * `resendVerification(email: string)`:
    - **Endpoint:** `POST /auth/resend-verification`

---

## 5. Business Service (`businessService.ts`)

* **Purpose:** Manages business profiles and vendor inventory listings.
* **Methods:**
  * `getBusinesses(params?: GetBusinessesParams)`:
    - **Endpoint:** `GET /businesses`
    - **Returns:** `Promise<{ businesses: Business[], meta: any }>`
  * `getBusinessById(id: string)`:
    - **Endpoint:** `GET /businesses/:id`
    - **Returns:** `Promise<Business>`
  * `getMyBusiness()`:
    - **Endpoint:** `GET /businesses/me`
    - **Returns:** `Promise<Business>` (business profile for the current user).
  * `getBusinessProducts(businessId: string, params?: any)`:
    - **Endpoint:** `GET /businesses/:businessId/products`
    - **Returns:** `Promise<{ products: Product[], meta: any }>`

---

## 6. Cart Service (`cartService.ts`)

* **Purpose:** Syncs shopping cart state between the frontend and database.
* **Methods:**
  * `getCartItems()`:
    - **Endpoint:** `GET /cart`
    - **Returns:** `Promise<CartItem[]>`
    - **Normalization:** Maps API fields to ensure consistency. It uses a fallback of `[]` if the API returns an empty response.
  * `addToCart(data: AddToCartData)`:
    - **Endpoint:** `POST /cart`
    - **Returns:** `Promise<CartItem>`
  * `updateCartItem(cartItemId: string, data: { quantity: number })`:
    - **Endpoint:** `PUT /cart/:cartItemId`
    - **Returns:** `Promise<CartItem>`
  * `removeFromCart(cartItemId: string)`:
    - **Endpoint:** `DELETE /cart/:cartItemId`
  * `clearCart()`:
    - **Endpoint:** `DELETE /cart/clear/all`

---

## 7. Category Service (`categoryService.ts`)

* **Purpose:** Resolves and returns available material categories.
* **Methods:**
  * `getCategories()`:
    - **Endpoint:** `GET /categories`
    - **Returns:** `Promise<Category[]>`
  * `getCategoryById(id: string)`:
    - **Endpoint:** `GET /categories/:id`
    - **Returns:** `Promise<Category>`

---

## 8. Commerce Service (`commerceService.ts`)

* **Purpose:** Validates promo codes and retrieves active payment methods.
* **Methods:**
  * `validatePromoCode(payload: { code: string; subtotal: number })`:
    - **Endpoint:** `POST /promo-codes/validate`
    - **Returns:** `Promise<PromoCodeValidationResult>`
  * `getPaymentMethods()`:
    - **Endpoint:** `GET /payment-methods`
    - **Returns:** `Promise<PaymentMethod[]>`

---

## 9. Contact Service (`contactService.ts`)

* **Purpose:** Submits general contact form inquiries.
* **Methods:**
  * `sendContactMessage(data: ContactFormData)`:
    - **Endpoint:** `POST /contact`
    - **Returns:** `Promise<{ message: string }>`

---

## 10. Content Service (`contentService.ts`)

* **Purpose:** Fetches static content pages, legal documents, and blog posts.
* **Methods:**
  * `getBlog(params?: any)`:
    - **Endpoint:** `GET /content/blog`
    - **Returns:** `Promise<{ posts: BlogPost[], meta: any }>`
  * `getBlogDetail(idOrSlug: string)`:
    - **Endpoint:** `GET /content/blog/:idOrSlug`
    - **Returns:** `Promise<BlogPost>`
  * `getTerms()`:
    - **Endpoint:** `GET /content/legal/terms`
  * `getPrivacy()`:
    - **Endpoint:** `GET /content/legal/privacy`

---

## 11. Contractor Service (`contractorService.ts`)

* **Purpose:** Coordinates search queries and profiles aggregation for contractor listings.
* **Base Configuration:**
  - Uses a standalone Axios client instance named `publicClient`. This instance points to the same API baseURL but omits authorization headers by default to support guest access.
* **Methods:**
  * `getContractors(filters?: any)`:
    - **Endpoint:** `GET /business?role=contractor` (falls back to `GET /users?role=contractor` on database errors).
    - **Returns:** `Promise<{ contractors: ContractorSummary[], meta: any }>`
  * `getContractorById(id: string)`:
    - Runs parallel queries using `Promise.all` to fetch contractor details and portfolio items:
      - `GET /users/:id`
      - `GET /portfolio/:id`
      - `GET /reviews/contractor/:id`
      - `GET /services/public?contractorId=:id`
    - **Returns:** `Promise<ContractorProfile>` (normalized profile object).

---

## 12. Order Service (`orderService.ts`)

* **Purpose:** Coordinates order creation, status tracking, cancellations, and invoice retrieval.
* **Methods:**
  * `createOrder(orderData: CreateOrderData)`:
    - **Endpoint:** `POST /orders`
    - **Returns:** `Promise<Order>`
  * `getOrders(params?: any)`:
    - **Endpoint:** `GET /orders`
    - **Returns:** `Promise<{ orders: Order[], meta: any }>`
  * `getOrderById(id: string)`:
    - **Endpoint:** `GET /orders/:id`
    - **Returns:** `Promise<Order>`
  * `getOrderTracking(id: string)`:
    - **Endpoint:** `GET /orders/:id/tracking`
    - **Returns:** `Promise<TrackingMilestone[]>`
  * `getOrderReceipt(id: string)`:
    - **Endpoint:** `GET /orders/:id/receipt`
    - **Axios Configuration:** `{ responseType: 'blob' }`
    - **Returns:** `Promise<Blob>` (raw PDF binary stream for invoice downloads).

---

## 13. Product Service (`productService.ts`)

* **Purpose:** Coordinates product queries, featured rows, timeline schedules, reviews, and Q&A threads.
* **Methods:**
  * `getProducts(params?: any)`:
    - **Endpoint:** `GET /products`
    - **Returns:** `Promise<{ products: Product[], meta: any }>`
  * `getProductById(id: string)`:
    - **Endpoint:** `GET /products/:id`
    - **Returns:** `Promise<Product>`
  * `getProductReviews(productId: string)`:
    - **Endpoint:** `GET /products/:productId/reviews`
  * `getProductQuestions(productId: string)`:
    - **Endpoint:** `GET /products/:productId/questions`
  * `askProductQuestion(productId: string, questionText: string)`:
    - **Endpoint:** `POST /products/:productId/questions`
    - **Payload:** `{ question: questionText }`
  * `createReview(productId: string, data: any)`:
    - **Endpoint:** `POST /products/:productId/reviews`
  * `reportProduct(productId: string, reason: string)`:
    - **Endpoint:** `POST /products/:productId/report`
    - **Payload:** `{ reason }`

---

## 14. Service Marketplace Service (`serviceMarketplaceService.ts`)

* **Purpose:** Handles queries and order placement for contractor service listings.
* **Methods:**
  * `getPublicServices(params?: any)`:
    - **Endpoint:** `GET /services/public`
    - **Returns:** `Promise<{ services: Service[], meta: any }>`
  * `getServiceById(id: string)`:
    - **Endpoint:** `GET /services/:id`
    - **Returns:** `Promise<Service>`
  * `createServiceOrder(serviceId: string, data: CreateServiceOrderData)`:
    - **Endpoint:** `POST /services/:serviceId/order`
    - **Returns:** `Promise<ServiceOrder>`
  * `requestQuote(data: QuoteRequestData)`:
    - **Endpoint:** `POST /service-quotes`
    - **Returns:** `Promise<Quote>`

---

## 15. Settings Service (`settingsService.ts`)

* **Purpose:** Handles settings preferences for buyer accounts.
* **Methods:**
  * `getSettings()`:
    - **Endpoint:** `GET /settings`
    - **Returns:** `Promise<Settings>`
  * `updateSettings(settings: any)`:
    - **Endpoint:** `PUT /settings`
    - **Returns:** `Promise<Settings>`

---

## 16. User Service (`userService.ts`)

* **Purpose:** Manages profile updates, wishlist favorites, and system notifications.
* **Methods:**
  * `updateProfile(userId: string, data: UpdateProfileData)`:
    - **Endpoint:** `PUT /users/:userId`
    - **Returns:** `Promise<User>`
  * `uploadProfileImage(userId: string, file: File)`:
    - **Endpoint:** `PUT /users/:userId/profile-image`
    - **Axios Configuration:** `{ headers: { 'Content-Type': 'multipart/form-data' } }`
    - **Returns:** `Promise<{ imageUrl: string }>`
  * `getWishlist()`:
    - **Endpoint:** `GET /users/wishlist`
    - **Returns:** `Promise<WishlistItem[]>`
  * `addToWishlist(productId: string)`:
    - **Endpoint:** `POST /users/wishlist`
    - **Payload:** `{ productId }`
  * `removeFromWishlist(productId: string)`:
    - **Endpoint:** `DELETE /users/wishlist/:productId`
  * `getNotifications()`:
    - **Endpoint:** `GET /notifications`
    - **Returns:** `Promise<Notification[]>`
  * `markNotificationRead(id: string)`:
    - **Endpoint:** `PUT /notifications/mark-as-read`
    - **Payload:** `{ notificationIds: [id] }`
