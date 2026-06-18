# BuildHive Market - File-by-File Codebase Inventory

This document provides a catalog of every file in the `buildhive-market` repository, detailing its purpose, exports, logic, and notes for presentations.

---

## Root Configuration & Entry Files

### 1. [index.html](file:///E:/2025/FYP/FYP%20V2/buildhive-market/index.html)
* **Purpose:** The main HTML template.
* **Core Logic:** Loads the Tailwind CSS CDN script and sets up the Google Fonts Inter link. Includes an inline theme script that reads `buildhive-theme` from `localStorage` to initialize dark or light mode before the React app renders to prevent screen flashing. Sets up the container div with ID `#root` and defines clean scrollbar styling.

### 2. [index.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/index.tsx)
* **Purpose:** The entry point for the React application.
* **Core Logic:** Mounts the `<App>` component inside React's `StrictMode` and React Router's `BrowserRouter`. Implements a global listener for the `unhandledrejection` window event to catch and suppress storage-related errors thrown by browser extensions.

### 3. [App.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/App.tsx)
* **Purpose:** Defines the main application router and manages the global shopping cart state.
* **Core Logic:** Wraps the app in the `AuthProvider` context. It manages cart synchronization using functions like `addToCart`, `removeFromCart`, `updateQuantity`, and `clearCart`, which communicate with `cartService.ts` and update local state. Uses a `ProtectedRoute` wrapper to restrict access to pages like `/cart`, `/checkout`, and `/account`.

### 4. [vite.config.ts](file:///E:/2025/FYP/FYP%20V2/buildhive-market/vite.config.ts)
* **Purpose:** Configuration file for the Vite build tool.
* **Core Logic:** Configures the React compiler plugin and registers a path alias mapping `@/*` to the project root directory `.`. Sets the development port to run on `5173`.

### 5. [tsconfig.json](file:///E:/2025/FYP/FYP%20V2/buildhive-market/tsconfig.json)
* **Purpose:** TypeScript compiler options.
* **Core Logic:** Configures strict type-checking, sets target compilation to modern ESNext, handles ReactJSX parsing, and configures path aliases matching the Vite config.

### 6. [package.json](file:///E:/2025/FYP/FYP%20V2/buildhive-market/package.json)
* **Purpose:** Project dependency and script manager.
* **Core Logic:** Lists dependencies including React 19, Axios, Lucide React, React Icons, React Toastify, and Stripe React Elements. Defines standard npm run scripts: `dev`, `build`, `preview`, and type-checking scripts.

### 7. [types.ts](file:///E:/2025/FYP/FYP%20V2/buildhive-market/types.ts)
* **Purpose:** Centralized type declarations for core business entities.
* **Core Logic:** Declares TypeScript interfaces for objects like `Product`, `Category`, `User`, `CartItem`, `Address`, `ContractorProfile`, and `Order`.

---

## Page Components (`pages/`)

All page files are located under the root `pages/` directory:

### 8. [AboutPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/AboutPage.tsx)
* **Purpose:** Renders the company story, mission statement, values, and developer profiles.
* **Core Logic:** A static UI page that maps content from `aboutPageData.ts` and styling from `aboutPageStyles.ts`.

### 9. [AccountPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/AccountPage.tsx)
* **Purpose:** The main dashboard for buyers.
* **Core Logic:** Consumes the global `AuthContext` to get user details. Loads purchase history, active projects, notification logs, support tickets, and disputes. Users can update their name/avatar, change passwords, select active tabs, and download PDF receipts.

### 10. [BlogPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/BlogPage.tsx)
* **Purpose:** Displays dynamic blogs and tutorials.
* **Core Logic:** Mounts dynamic blogs list fetched on mount from `contentService.getBlog()`. Renders category tabs and search inputs.

### 11. [BlogDetailPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/BlogDetailPage.tsx)
* **Purpose:** Displays individual blog articles.
* **Core Logic:** Reads the slug from the URL parameters on mount and loads the blog content by calling `contentService.getBlogDetail(slug)`.

### 12. [CartPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/CartPage.tsx)
* **Purpose:** Displays items in the shopping cart and total prices.
* **Core Logic:** Receives cart items and handlers as props from `App.tsx`. Allows users to adjust item counts, apply discount coupons, and verify quantities before proceeding to checkout.

### 13. [CheckoutPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/CheckoutPage.tsx)
* **Purpose:** Handles delivery details and payment options.
* **Core Logic:** Loads saved addresses on mount and handles the transition between Cash on Delivery (COD) and Credit Card payments. If "Card" is selected, it wraps elements in a Stripe context to confirm card charges.

### 14. [ContactPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ContactPage.tsx)
* **Purpose:** Inquiry submission form page.
* **Core Logic:** Captures inputs (name, email, message) and dispatches them to `contactService.sendContactMessage(data)`.

### 15. [ContractorProfilePage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ContractorProfilePage.tsx)
* **Purpose:** Detailed profile page for individual contractors.
* **Core Logic:** Loads contractor profiles, reviews, and portfolio galleries. Renders a hire modal form that calls `POST /projects` to initiate a contract request.

### 16. [CostEstimatorPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/CostEstimatorPage.tsx)
* **Purpose:** Renders the AI cost estimator form and results dashboard.
* **Core Logic:** Captures form inputs (area, floors, city, quality) and dispatches them to `POST /estimate-cost` on the AI backend. Renders total price ranges, material breakdown charts, and quality comparisons.

### 17. [DisputeDetailPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/DisputeDetailPage.tsx)
* **Purpose:** Renders the chat portal for order disputes.
* **Core Logic:** Fetches the dispute status and chat history using the URL ID param: `GET /disputes/:id`. Allows buyers to message support staff and upload evidence attachments.

### 18. [EmailVerifyPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/EmailVerifyPage.tsx)
* **Purpose:** Handshakes with verification email links.
* **Core Logic:** Reads the token parameter from the URL on mount and calls `authService.verifyEmail(token)` to verify the user's email address.

### 19. [GetStartedPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/GetStartedPage.tsx)
* **Purpose:** Buyer registration page.
* **Core Logic:** Collects form inputs and dispatches registration requests to `authService.register(data)`.

### 20. [HomePage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/HomePage.tsx)
* **Purpose:** The main landing page.
* **Core Logic:** Fetches material categories, featured products, services, and contractor lists on mount. It uses an Intersection Observer to trigger scroll animations.

### 21. [NotFoundPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/NotFoundPage.tsx)
* **Purpose:** 404 fallback page.
* **Core Logic:** Renders a simple warning message and a homepage redirect link.

### 22. [NotificationPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/NotificationPage.tsx)
* **Purpose:** List page for notifications.
* **Core Logic:** Fetches recent user alerts from `GET /notifications` and provides mark-as-read and delete controls.

### 23. [OrderConfirmationPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/OrderConfirmationPage.tsx)
* **Purpose:** Successful order checkout page.
* **Core Logic:** Displays the created order reference ID and payment confirmation message.

### 24. [PrivacyPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/PrivacyPage.tsx) / [TermsPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/TermsPage.tsx)
* **Purpose:** Policy content pages.
* **Core Logic:** Standard static layout matching data lists.

### 25. [ProductDetailPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ProductDetailPage.tsx)
* **Purpose:** Detailed page for individual products.
* **Core Logic:** Fetches details, reviews, questions, and timelines. Handles adding items to the cart and review/question submissions.

### 26. [ProductsPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ProductsPage.tsx)
* **Purpose:** Directory grid for browsing products.
* **Core Logic:** Coordinates sidebar filters, searches, and semantic queries. Contains modal logic for product comparison grids.

### 27. [RecommendationsPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/RecommendationsPage.tsx)
* **Purpose:** Renders AI material suggestions based on construction phases.
* **Core Logic:** Dispatches natural-language phase descriptions to the AI recommendations API (`POST /recommend`).

### 28. [ResetPasswordPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ResetPasswordPage.tsx)
* **Purpose:** Password reset page.
* **Core Logic:** Validates query tokens and dispatches new passwords to the password reset endpoint (`POST /auth/reset-password`).

### 29. [ServiceDetailPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ServiceDetailPage.tsx)
* **Purpose:** Detailed page for individual services.
* **Core Logic:** Displays package pricing tiers and deliverables. Sets service configuration parameters in router state when initiating an order.

### 30. [ServicesPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ServicesPage.tsx)
* **Purpose:** Directory grid for construction services.
* **Core Logic:** Fetches categories and services list, filtering results by city and search query.

### 31. [SettingsPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/SettingsPage.tsx)
* **Purpose:** Profile security settings page.
* **Core Logic:** Updates profile preferences, toggles email notifications, and manages password changes.

### 32. [SignInPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/SignInPage.tsx)
* **Purpose:** Login portal for buyers.
* **Core Logic:** Authenticates buyer credentials. Displays a "Join as Seller / Contractor" button that redirects suppliers and builders to port `5000`.

---

## Nested Page Scripts (`src/pages/`)

### 33. [Messages.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/pages/Messages.tsx)
* **Purpose:** Dedicated messaging workspace.
* **Core Logic:** Loads active buyer conversations list (`GET /chat`). Selecting a contact loads the message history for that thread.

### 34. [Support.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/pages/Support.tsx)
* **Purpose:** Helpdesk ticketing center.
* **Core Logic:** Displays registered support tickets and status badges. Includes a form modal to create new tickets.

---

## Common Components (`components/`)

### 35. [AIChatWidget.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/AIChatWidget.tsx)
* **Purpose:** Floating chatbot widget for user queries.
* **Core Logic:** Renders the chat floating bubble and handles thread history and suggested follow-up chips.

### 36. [Button.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/Button.tsx)
* **Purpose:** Custom global theme button.
* **Core Logic:** Standard button mapping variant and size styles.

### 37. [ContractorCard.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/ContractorCard.tsx)
* **Purpose:** Reusable summary card for contractors.
* **Core Logic:** Renders rating stars, locations, daily rates, and profile details.

### 38. [Icons.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/Icons.tsx)
* **Purpose:** Exports SVG icons mapped to semantic system names.

### 39. [Layout.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/Layout.tsx)
* **Purpose:** Layout container rendering the header and footer.
* **Core Logic:** Fetches unread message and notification counts on mount and updates the header badges.

### 40. [ProductCard.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/ProductCard.tsx)
* **Purpose:** Reusable item card displaying material details.
* **Core Logic:** Uses `resolveMarketplaceImageSrc` to load images. Implements an `onError` handler to load [productsplaceholder.png](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/assets/productsplaceholder.png) if the image path is broken or missing.

---

## Stripe Components (`src/components/`)

### 41. [StripeCardForm.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/components/StripeCardForm.tsx)
* **Purpose:** Renders Stripe card input elements.
* **Core Logic:** Submits card details to Stripe and runs payment callbacks.

### 42. [StripeProviderWrapper.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/components/StripeProviderWrapper.tsx)
* **Purpose:** Stripe provider context wrapper.
* **Core Logic:** Loads the Stripe SDK, caching the instance to prevent multiple initialization triggers.

---

## App Contexts (`src/context/`)

### 43. [AuthContext.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/context/AuthContext.tsx)
* **Purpose:** Manages the user session.
* **Core Logic:** Checks if the authenticated user is a buyer. If not, it clears local storage and cookies, throws an error, and redirects to dashboard portal.

---

## Custom Hooks (`src/hooks/`)

### 44. [useFilters.ts](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/hooks/useFilters.ts)
* **Purpose:** State manager for sorting and catalog filtering.

### 45. [useScrollAnimation.ts](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/hooks/useScrollAnimation.ts)
* **Purpose:** Trigger animations when elements scroll into view.

### 46. [useStripePayment.ts](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/hooks/useStripePayment.ts)
* **Purpose:** Wrapper hook coordinating payment client endpoints.

### 47. [useWishlist.ts](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/hooks/useWishlist.ts)
* **Purpose:** Syncs favorites list with user settings.

---

## App Utilities (`src/utils/`)

### 48. [cookies.ts](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/utils/cookies.ts)
* **Purpose:** Helper utility to manage cookies.
* **Core Logic:** Reads, sets, and deletes session tokens with a 7-day expiration.

### 49. [marketplaceImage.ts](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/utils/marketplaceImage.ts)
* **Purpose:** Image path normalization utility.
* **Core Logic:** Formats relative URLs, absolute external paths, and Supabase storage bucket URLs into correct absolute image paths.

### 50. [storage.ts](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/utils/storage.ts)
* **Purpose:** LocalStorage wrapper utility.
* **Core Logic:** Provides an in-memory storage fallback if `localStorage` access is blocked.

---

## App Styles (`src/styles/`)

These files contain page-specific CSS strings dynamically injected on mount and cleaned up on unmount:
* 51. **aboutPageStyles.ts**: Styles for the about page.
* 52. **authPageStyles.ts**: Styles for authentication pages.
* 53. **blogDetailStyles.ts** & 54. **blogPageStyles.ts**: Styles for blog views.
* 55. **cartPageStyles.ts**: Styles for the cart page.
* 56. **checkoutPageStyles.ts**: Styles for the checkout page.
* 57. **contactPageStyles.ts**: Styles for the contact page.
* 58. **legalPageStyles.ts**: Styles for terms and privacy pages.
* 59. **servicesPageStyles.ts**: Styles for service listings.
* 60. **settingsPageStyles.ts**: Styles for settings panels.
* 61. **homePageStyles.ts**: Styles for the homepage.
  - **Double Scrollbar Bug:** Note the bug caused by `.home-root { overflow-x: hidden; overflow-y: visible; }` (line 33), which creates a nested container scrollbar alongside the main browser scrollbar under certain viewport configurations.

---

## Static Data Files (`src/data/`)

These files export static lists used to populate UI text:
* 62. **aboutPageData.ts**: Milestones and team profiles.
* 63. **blogDetailData.ts** & 64. **blogPageData.ts**: Blog articles.
* 65. **checkoutPageData.ts**: Form structures, payment methods, and the 5% tax rate.
* 66. **getStartedPageData.ts**: Registration form configurations.
* 67. **homePageData.ts**: Slogans and statistics counters.
* 68. **privacyPageData.ts** & 69. **termsPageData.ts**: Legal copy.
* 70. **settingsPageData.ts**: User notification checklist options.
* 71. **signInPageData.ts**: Form sign-in configurations.

---

## Miscellaneous Files

* 72. [index.css](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/index.css): Sets base variables and imports Tailwind directions.
* 73. [vite-env.d.ts](file:///E:/2025/FYP/FYP%20V2/buildhive-market/vite-env.d.ts): TypeScript declarations for Vite env properties.
