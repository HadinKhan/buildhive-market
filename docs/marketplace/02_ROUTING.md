# BuildHive Market - Routing and Cart State Structure

This document outlines the routing mechanism, authentication gates, page structure, and the global cart state management located in `App.tsx`.

---

## Route Map

The application uses **React Router DOM 7** to define client-side page routing. The following table maps all active routes in the application:

| Path | Component | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `/` | [HomePage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/HomePage.tsx) | No | Landing page with animated hero, featured segments, and AI CTA. |
| `/products` | [ProductsPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ProductsPage.tsx) | No | Catalog search directory with filter sidebars and AI Search functionality. |
| `/product-detail/:id` | `ProductDetailWrapper` rendering [ProductDetailPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ProductDetailPage.tsx) | No | Product details, specification details, QA, review metrics. |
| `/services` | [ServicesPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ServicesPage.tsx) | No | Marketplace listing page for construction services (masonry, electrical, etc.). |
| `/services/:id` | [ServiceDetailPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ServiceDetailPage.tsx) | No | Detailed package descriptions (Silver/Gold/Platinum tiers) for booking services. |
| `/contractors/:id` | [ContractorProfilePage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ContractorProfilePage.tsx) | No | Contractor portfolio history and request hiring details modal. |
| `/cost-estimator` | [CostEstimatorPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/CostEstimatorPage.tsx) | No | Input-driven construction cost estimator powered by Render AI backend. |
| `/recommendations` | [RecommendationsPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/RecommendationsPage.tsx) | No | Recommends products/materials needed for specific phases based on AI estimates. |
| `/about` | [AboutPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/AboutPage.tsx) | No | Mission statement, milestones, and developer team listings. |
| `/contact` | [ContactPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ContactPage.tsx) | No | Buyer/Guest general support and messaging contact form. |
| `/terms` | [TermsPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/TermsPage.tsx) | No | Public Terms and Conditions document page. |
| `/privacy` | [PrivacyPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/PrivacyPage.tsx) | No | Public Privacy policy page. |
| `/signin` | [SignInPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/SignInPage.tsx) | No | User login portal (only accepts buyers on this port). |
| `/reset-password` | [ResetPasswordPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ResetPasswordPage.tsx) | No | Initiates pass recovery requests and password overrides. |
| `/verify-email` | [EmailVerifyPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/EmailVerifyPage.tsx) | No | Handshake verification route mapping email tokens. |
| `/auth/verify-email` | [EmailVerifyPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/EmailVerifyPage.tsx) | No | Alias redirect route mapped for email verifications. |
| `/get-started` | [GetStartedPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/GetStartedPage.tsx) | No | Buyer-only account registration portal. |
| `/cart` | [CartPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/CartPage.tsx) | **Yes** | Displays current cart inventory, totals, and quantity selectors. |
| `/checkout` | [CheckoutPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/CheckoutPage.tsx) | **Yes** | Delivery addresses selection and payment inputs forms (Stripe/COD). |
| `/order-confirmation/:orderId` | [OrderConfirmationPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/OrderConfirmationPage.tsx) | **Yes** | Final purchase success screen detailing order reference numbers. |
| `/account` | `AccountRoute` wrapper rendering [AccountPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/AccountPage.tsx) | **Yes** | Hub for viewing past orders, chat threads, and dispute panels. |
| `/disputes/:id` | [DisputeDetailPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/DisputeDetailPage.tsx) | **Yes** | Communication portal with administrators regarding order disputes. |
| `/notifications` | [NotificationPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/NotificationPage.tsx) | **Yes** | History list of order milestones and system notices. |
| `/settings` | [SettingsPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/SettingsPage.tsx) | **Yes** | Updates name, email address, password, or deletes profile. |
| `/support` | [SupportPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/pages/Support.tsx) | **Yes** | Helpdesk dashboard for creating and tracking ticket status. |
| `/messages` | [MessagesPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/pages/Messages.tsx) | **Yes** | Direct messaging center with contractors, sellers, and services staff. |
| `*` | [NotFoundPage](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/NotFoundPage.tsx) | No | 404 Fallback error display. |

---

## Public Routes

Public routes require no authentication and can be browsed freely by guest users:
* **Guests Can Browse**:
  - The entire material catalog (`/products`) and detailed specs (`/product-detail/:id`).
  - Available construction services (`/services` and `/services/:id`).
  - Professional directory of contractors (`/contractors/:id`).
  - General CMS pages: Blog archives, contact forms, terms pages, and about pages.
* **Guests Can Calculate**:
  - The AI Cost Estimator is fully functional for anonymous guests. Estimator outputs are generated directly, and they can navigate to the AI Recommendations page to inspect items needed for construction phases.
* **Interceptions & Gates**:
  - Unauthenticated guests can click buttons to view details. However, attempting to perform actions such as `Add to Cart`, `Book Service`, `Hire Contractor`, or accessing `/account` instantly triggers a redirect gate.

---

## Protected Routes

Protected routes are shielded using the `<ProtectedRoute>` component declared in `App.tsx` (lines 48-101):
* **Redirect Behavior**:
  - If a user is not authenticated and the hook `loading` state resolves to `false`, they are redirected to `/signin`.
* **returnUrl Handling**:
  - The gate captures the path the user attempted to access using `location.pathname` and `location.search` (lines 95-97).
  - It appends this string to the redirect path as a URL query parameter: `/signin?returnUrl=...`.
  - When the user successfully signs in on `SignInPage`, the sign-in logic extracts `returnUrl` and redirects the user back to their intended page, preventing them from losing their path (e.g. going straight back to check out a configured cart).

---

## Cart State in App.tsx

The shopping cart state is managed in [App.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/App.tsx) and shared as props down to routing components.

### 1. Cart Initialization
* When the application mounts, `AppContent` checks the `isAuthenticated` state.
* If authenticated, it triggers a `loadCart` routine inside a `useEffect` hook (lines 270-333):
  - Fetches fresh database cart items from `cartService.getCartItems()`.
  - Transforms database fields (mapping nested product details, fallback fields, and matching type expectations).
  - Populates the local state `cart` array (`CartItem[]`).
* If unauthenticated, it retains empty local arrays but does not wipe remote carts.

### 2. Synchronization Mechanisms
* The frontend synchronizes cart actions directly with the server database endpoints, keeping them in lockstep:
  * **Add to Cart (`addToCart`)**:
    - Checks if the user is authenticated. If not, it displays a toast notice and redirects to `/signin` with `returnUrl`.
    - Triggers `cartService.addToCart({ productId, quantity })` to sync with the database.
    - Updates local `cart` state. If the item already exists in the local state, it increments the local count. If not, it appends the new item structure.
  * **Remove From Cart (`removeFromCart`)**:
    - Dispatches a delete request via `cartService.removeFromCart(cartItemId)`.
    - Reloads the entire cart from the backend using `cartService.getCartItems()` to ensure item IDs are fresh and accurate, updating the state.
  * **Update Quantity (`updateQuantity`)**:
    - Employs an **optimistic update pattern**:
      - Wires the new quantity into the local `cart` array immediately for zero-latency UI response.
      - Dispatches `cartService.updateCartItem(cartItemId, { quantity })` asynchronously.
      - If the database request fails, the local state reverts to its previous state, and a warning toast is shown.
  * **Clear Cart (`clearCart`)**:
    - Saves the previous state, sets the local state to an empty array `[]` instantly, and calls `cartService.clearCart()`.
    - If the backend request fails, the local cart array is restored to prevent loss of data.

### 3. Why Logic Lives in App.tsx
Managing this state inside `App.tsx` instead of isolating it inside a separate page or a service class is a deliberate architectural decision:
- **Shared Layout Access**: The `<Header>` is rendered at the root level in `App.tsx` and requires a `cartItemCount` number badge. If cart logic lived inside `CartPage.tsx`, the header would have no way to reactively display updated numbers when items are added from the `ProductsPage`.
- **Global Context Alternative**: Rather than adding complex context boilerplate, simple prop drilling was chosen because the application's checkout pipeline is small and direct.

---

## Layout Wrapper

All page components are wrapped by a consistent layout structure declared inside [App.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/App.tsx) lines 505-696.

### Layout Container Components
The layout consists of a wrapper container containing three persistent elements:
1. **Header Component** (`<Header>`):
   - Background colors are dark grey `#111827` (Tailwind `bg-gray-900`) and the header logo matches corporate branding.
   - Includes navigation links to Home, Products, Services, AI (dropdown containing Cost Estimator and Recommendations), About, and Contact.
   - Displays unread badges: Cart count, unread Chat Message counts (polling `/chat/unread-count`), and System notifications counts (polling `/notifications/unread-count`).
   - Renders a dropdown menu for logged-in buyers containing links to `/account` and `/settings`, alongside a **Log out** button.
   - For guest users, displays **Sign In** and **Sign up free** buttons.
2. **Footer Component** (`<Footer>`):
   - Custom styling features a dark background (`#080a0c`) and purple borders.
   - Divided into Brand Description, Quick Links, AI Tools, Company Info, and Social Links.
   - Contains physical address metadata (pointing to Department of Computer Science, COMSATS Lahore campus) and contact details.
3. **AI Chat Widget** (`<AIChatWidget>`):
   - A floating widget button that overlays in the bottom right corner of all pages.
   - Provides an interactive chat container for buyers and guests to ask construction-related questions.

### Nav Link Variations
The header layout changes dynamically depending on whether a session is detected:
* **Guest State**: Shows sign-in/sign-up triggers. The desktop nav offers dropdown items, and the mobile view replaces active links with direct authentication CTAs.
* **Auth State**: Renders unread badges for Cart, Messages, and Notifications, along with a profile circle containing the user's initials (e.g. "AA") and a green online dot indicator. It also shows a dropdown menu for account administration.
