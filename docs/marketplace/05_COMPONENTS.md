# BuildHive Market - Components Catalog

This document catalogues all frontend UI components in the marketplace repository under `components/` and `src/components/`.

---

## 1. AIChatWidget

* **Location:** [components/AIChatWidget.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/AIChatWidget.tsx)
* **Purpose:** A floating, overlay chatbot widget located in the bottom-right corner of all pages. It allows guest and authenticated users to ask construction-related questions, calculate costs, and get material suggestions.
* **Props:** None (self-contained global mount).
* **State:**
  - `isOpen` (`boolean`): Tracks whether the chat container window is expanded or collapsed.
  - `messages` (`ChatMessage[]`): Array of chat message bubbles (containing `sender`, `text`, and `timestamp` keys).
  - `inputValue` (`string`): The current text typing inside the input bar.
  - `isTyping` (`boolean`): Controls the visibility of the "AI is typing..." three-dot loader.
  - `conversationId` (`string | null`): Tracks the active conversation session ID returned by the AI backend for context management.
  - `quickReplies` (`string[]`): Dynamically populated array of suggestion chips (e.g. "Calculate construction cost", "Compare plaster quality").
  - `hasClickedChat` (`boolean`): Persists clicked status in localStorage (`buildhive-ai-chat-clicked`) to turn off the button's pulse ring animation.
* **What it Renders:**
  - **Floating Action Button:** Fixed-position circle in the bottom right featuring a robot logo and a notification pulse ring.
  - **Chat Panel:** A slide-up window containing:
    - **Header:** Title bar with "AI Assistant" label, developer credit, and close button.
    - **Messages Feed:** Scrollable area display with user vs. AI message bubbles.
    - **Quick Replies Grid:** Multi-row chips containing quick-action suggestions.
    - **Input Form Bar:** Form with input field, emoji popover, and send button.
* **Key Behavior:**
  - Listens to global window event `"open-ai-chat"` to automatically expand itself.
  - Checks localStorage for `buildhive-ai-chat-clicked` to skip showing the pulse ring animation.
  - Submits queries directly to the Render AI service `https://ai-backend-b3yd.onrender.com/chat`.
  - Captures returned suggested follow-up chips and updates the `quickReplies` state.
* **Used by:** Rendered at the bottom of the layout wrapper inside `App.tsx`, appearing on all pages.

---

## 2. Button

* **Location:** [components/Button.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/Button.tsx)
* **Purpose:** The global styled button component.
* **Props:**
  | Prop | Type | Required | Description |
  | :--- | :--- | :---: | :--- |
  | `children` | `React.ReactNode` | Yes | Label text or nested elements. |
  | `variant` | `'primary' \| 'outline' \| 'ghost' \| 'gradient'` | No | Color theme class maps. Defaults to `'primary'`. |
  | `size` | `'sm' \| 'md' \| 'lg'` | No | Standard sizes. Defaults to `'md'`. |
  | `className` | `string` | No | Overrides or custom class extensions. |
* **State:** None.
* **What it Renders:** Standard HTML `<button>` with custom Tailwind visual classes.
* **Used by:** Almost all pages and forms.

---

## 3. ContractorCard

* **Location:** [components/ContractorCard.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/ContractorCard.tsx)
* **Purpose:** Displays contractor summary info on category dashboards and contractor directory grids.
* **Props:**
  | Prop | Type | Required | Description |
  | :--- | :--- | :---: | :--- |
  | `contractor` | `ContractorSummary` | Yes | Contractor information data model. |
  | `onViewProfile` | `(c: ContractorSummary) => void` | Yes | Callback routing user to detailed profile page. |
  | `onMessage` | `(c: ContractorSummary) => void` | Yes | Callback opening chat thread with this contractor. |
* **State:** None.
* **What it Renders:**
  - Card header: Display photo, verification badge, and location metadata.
  - Details list: Full name, contractor trade classification (mason, electrician, etc.), average rating stars, and total review count.
  - Details footer: Completed projects count, base daily/project rate, and "View Profile" action button.
* **Used by:** `ServicesPage.tsx`, `HomePage.tsx`.

---

## 4. Icons

* **Location:** [components/Icons.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/Icons.tsx)
* **Purpose:** Consolidates and exports specific SVG icons from the `lucide-react` and `react-icons` libraries under semantic names.
* **Props:** None.
* **Used by:** Virtually all pages and layouts.

---

## 5. Layout (Header & Footer)

* **Location:** [components/Layout.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/Layout.tsx)
* **Purpose:** Contains the persistent structure for all pages, providing navigation menus, unread counters, and footer widgets.
* **Props:**
  | Prop | Type | Required | Description |
  | :--- | :--- | :---: | :--- |
  | `children` | `React.ReactNode` | Yes | Nested page elements. |
  | `activePage` | `string` | No | Nav link highlighting token. |
  | `onNavigate` | `(page: string) => void` | No | Main routing trigger. |
* **State (Header):**
  - `isMobileMenuOpen` (`boolean`): Controls mobile menu visibility.
  - `isUserMenuOpen` (`boolean`): Controls the avatar settings dropdown modal.
  - `openDropdown` (`string | null`): Controls nested menu cards.
  - `unreadCount` (`number`): Counts unread messages.
  - `notificationUnreadCount` (`number`): Counts unread system alerts.
  - `notifications` (`any[]`): Array containing the 8 most recent notification alerts.
  - `isNotificationsOpen` (`boolean`): Controls notification feed drawer.
* **What it Renders:**
  - **Header:** Sticky top navbar featuring logo, search input, dropdown menus, unread badge counters, system notifications drawer, and user profile links.
  - **Footer:** Four-column layout containing information, quick links to services/cost calculators, social media buttons, and university campus address details.
* **Key Behavior:**
  - Automatically queries the backend for unread messages and notifications count on mount and update cycles.
  - Listens to outside click events via React refs to automatically close dropdown panels.
* **Used by:** `App.tsx` (routing wrapper shell).

---

## 6. ProductCard

* **Location:** [components/ProductCard.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/ProductCard.tsx)
* **Purpose:** Renders a product listing card, displaying price, stock availability, ratings, and add-to-cart controls.
* **Props:**
  | Prop | Type | Required | Description |
  | :--- | :--- | :---: | :--- |
  | `product` | `Product` | Yes | Product data model. |
  | `variant` | `'light' \| 'dark' \| 'grid'` | No | Style themes. Defaults to `'light'`. |
  | `showPlaceholder` | `boolean` | No | Forces the fallback image. Defaults to `false`. |
  | `onNavigate` | `(p: string, id?: string) => void` | Yes | Callback for product detail page routing. |
* **State:** None.
* **What it Renders:**
  - Thumbnail container with hover scale animations and custom status labels (e.g. In Stock, Low Stock, Out of Stock).
  - Material information details: Product title, category tag, supplier business name, average rating stars, and total units sold.
  - Price label (PKR) and action buttons: "Explore" (routes to detailed view) and "Contact" (opens direct supplier chat thread).
* **Key Behavior:**
  - **Image Fallback:** Uses an `onError` handler on the image tag to automatically swap missing or broken image paths with `src/assets/productsplaceholder.png`. It also displays the placeholder if the `showPlaceholder` prop is set to `true`.
  - Integrates with `useWishlist` hook to toggle the product wishlist status.
* **Used by:** `ProductsPage.tsx`, `HomePage.tsx`, `ProductDetailPage.tsx`.

---

## 7. StripeCardForm

* **Location:** [src/components/StripeCardForm.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/components/StripeCardForm.tsx)
* **Purpose:** Embeds credit card input fields using Stripe React Elements, coordinating payment details submission.
* **Props:**
  | Prop | Type | Required | Description |
  | :--- | :--- | :---: | :--- |
  | `clientSecret` | `string` | Yes | Payment Intent secret key returned by the API. |
  | `paymentIntentId` | `string` | Yes | Payment intent identifier. |
  | `onPaymentSuccess` | `(intentId: string) => void` | Yes | Callback triggered on successful card charging. |
* **State:**
  - `isProcessing` (`boolean`): Controls processing spinner on checkout button click.
  - `error` (`string | null`): Capture validation alerts from Stripe (e.g. invalid card number, expired date).
* **What it Renders:**
  - Stripe React elements fields: Card Number, Card Expiry, and Card CVC.
  - Form submit button displaying PKR prices.
  - Grid highlighting accepted payment card providers.
* **Key Behavior:**
  - Interfaces with the Stripe SDK through the `useStripe` and `useElements` hooks.
  - Dispatches card details directly to Stripe's payment gateways via `confirmCardPayment()`.
* **Used by:** `CheckoutPage.tsx`.

---

## 8. StripeProviderWrapper

* **Location:** [src/components/StripeProviderWrapper.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/components/StripeProviderWrapper.tsx)
* **Purpose:** Standard context provider initializing and wrapping payment forms in the Stripe Elements context.
* **Props:**
  | Prop | Type | Required | Description |
  | :--- | :--- | :---: | :--- |
  | `publishableKey` | `string` | Yes | Stripe public developer key. |
  | `children` | `React.ReactNode` | Yes | Form components that require payment input fields. |
* **State:** None.
* **What it Renders:** Renders the Stripe `<Elements stripe={stripePromise}>` wrapper. It uses `useMemo` to load the Stripe SDK, caching the instance to prevent multiple initialization triggers.
* **Used by:** `CheckoutPage.tsx`.
