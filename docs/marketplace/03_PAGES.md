# BuildHive Market - Page Specifications Deep Dive

This document catalogs every page in the marketplace app. It specifies route paths, authentication requirements, internal React states (`useState`), mount/loading side-effects (`useEffect`), visual layout structures, interactive user actions, and tips for presentations.

---

## 1. HomePage (`pages/HomePage.tsx`)

* **Route:** `/`
* **Auth required:** No
* **Purpose:** The public landing gateway. It captures visitor attention with modern visual aesthetics, lists high-level service offerings, highlights featured construction materials, and directs users towards the AI Cost Estimator tool.

### State
* `categories` (`Category[]`): Stores catalog item category objects.
* `featuredListings` (`Listing[]`): Stores high-ranking construction product listings.
* `featuredServices` (`FeaturedServiceListing[]`): Stores contractor service listings.
* `featuredContractors` (`FeaturedContractor[]`): Stores nearby contractor profile cards.
* `stats` (`Stat[]`): Numeric display values (e.g. users, completed projects).
* `searchQuery` (`string`): The search text entered into the main search input.
* `categoriesLoading`, `featuredLoading`, `featuredServicesLoading`, `allProductsLoading` (`booleans`): Tracks loading spin behaviors for each individual section.
* `homeError` (`string | null`): Captures general API connection error messages for user notification.

### Data Loading
* **On Mount (`useEffect`)**:
  - Fires five concurrent fetch actions to populate sections:
    - `GET /categories`
    - `GET /products?featured=true`
    - `GET /services?featured=true` (or fallback services endpoint)
    - `GET /contractors?limit=4`
    - `GET /stats/summary`
  - **Skeletons**: Layout uses grey pulse placeholders for cards during loading.
  - **Error handling**: Displays warning toasts on API failures. If the backend is down, it populates sections with local static array mockups.
* **Intersection Observer (`useEffect`)**:
  - Registers scroll triggers on viewport nodes with class names `.reveal` or `.reveal-scale` to execute slide-in slide-up animation overrides.

### What it Renders
* **Hero Section**: Prominent search bar input overlaying an architectural blueprint backdrop.
* **Stats Counters**: Digital dashboard grid detailing project numbers.
* **Interactive Cost Estimator CTA Card**: Highlighted container prompting users to calculate construction budgets.
* **Featured Grids**: Row cards highlighting materials, service packages, and contractors.

### User Actions
* **Adjust Category Selectors**: Clicking a category tile navigates the router to `/products?categoryId={id}`.
* **Execute Search**: Pressing enter on search navigates to `/products?search={query}`.
* **Interact with CTAs**: Clicking "Browse Products" routes to `/products`, "Browse Services" routes to `/services`, and "Cost Estimator" routes to `/cost-estimator`.

### Demo Notes
* **Highlight**: Show the smooth scroll animations (`.reveal`) and the clean, premium theme integration.
* **Known Issues**: Double scrollbar bug on this page is caused by an `overflow` setting in [homePageStyles.ts](file:///E:/2025/FYP/FYP%20V2/buildhive-market/src/styles/homePageStyles.ts) under `.home-root`.

---

## 2. ProductsPage (`pages/ProductsPage.tsx`)

* **Route:** `/products`
* **Auth required:** No
* **Purpose:** The catalog page. It allows users to browse materials, filters selections by categories/brands, compares items, and triggers search queries.

### State
* `products` (`Product[]`): Array of loaded product cards.
* `isLoadingProducts`, `productsError`: Page-level loading and connection state.
* `activeCategory` (`string`), `activeTag` (`string`): Filter tags trackers.
* `showWishlistOnly` (`boolean`): Filter modifier displaying only liked products.
* `toast` (`string | null`): Replaces generic alert windows for user actions.
* `searchQuery`, `searchDraft` (`strings`): Manages final and typing search values.
* `recentSearches` (`string[]`): Loaded user search query logs.
* `useAiSearch` (`boolean`), `aiResults` (`any[]`), `aiSearchLabel` (`string`): AI matching engine state.
* `selectedProduct`, `selectedSeller`: Controls modals for view details overlays.

### Data Loading
* **On Mount (`useEffect`)**:
  - If authenticated, fetches previous search queries from `GET /search/history`.
* **On Filter Change (`useEffect`)**:
  - Watches `activeCategory`, `activeTag`, `priceRange`, `sortBy`, `searchQuery`, and `useAiSearch`.
  - Dispatches `productService.getProducts(filters)` using the compiled filters query string.
  - If `useAiSearch` is active, dispatches `aiService.searchProducts(query)` instead.

### What it Renders
* **Filter Sidebar**: Checkboxes for categories, brands, price range slider, and clear filters link.
* **Toolbar**: Standard query input field, AI search checkbox, and grid-list layout toggles.
* **Product Grid**: Renders standard product cards with add-to-cart controls.
* **Comparison Modal**: A bottom drawer comparison matrix displaying detailed specifications.

### User Actions
* **Filter Checklist**: Toggling checkboxes updates filters and refreshes the search.
* **Compare Materials**: Clicking compare checkboxes on product cards adds them to comparison state (maximum of 3 items).
* **Toggle AI Search**: Enabling the AI Matcher checkbox changes the input placeholder to ask for natural-language descriptions.

### Demo Notes
* **Highlight**: Show the compare checklist drawer. It compares technical attributes (e.g. price per bag, weight, brand ratings) side-by-side.
* **Known Issues**: The price slider handles sometimes fail to snap back to maximum bounds when clicking "Clear Filters".

---

## 3. ProductDetailPage (`pages/ProductDetailPage.tsx`)

* **Route:** `/product-detail/:id`
* **Auth required:** No
* **Purpose:** Detailed specs, gallery, supplier information, and Q&A page.

### State
* `product` (`Product | null`): Detailed data of the current product.
* `isLoading`, `error`: Core page status.
* `selectedImageIndex` (`number`): Indexes the primary preview window in the image gallery.
* `quantity` (`number`): Local counter spinner tracking order amount.
* `activeTab` (`string`): Tab selector: Description / Specs / Reviews / Q&A / Timeline.
* `reviews`, `questions`, `timeline` (`arrays`): Collection arrays for each tab.
* `newQuestion`, `isReportingProduct`, `reportReason`: Forms state for Q&As or reports.

### Data Loading
* **On ID Change (`useEffect`)**:
  - Fetches product details: `GET /products/:id`
  - Fetches supplementary tab collections:
    - `GET /products/:id/reviews`
    - `GET /products/:id/questions`
    - `GET /products/:id/timeline`

### What it Renders
* **Image Gallery Layout**: Left-aligned column of thumbnails with a large main image preview.
* **Supplier Detail Block**: Displays seller business name, response rate, rating stars, and contact trigger button.
* **Tabs Panel**: Toggle sections displaying technical attributes, buyer reviews, answered questions, and product delivery timelines.

### User Actions
* **Quantity Spinner**: Arrow buttons increment or decrement the order quantity.
* **Add to Cart / Buy Now**: Passes values to global `addToCart` handlers in `App.tsx`.
* **Submit Review**: Buyers can select star counts (1-5) and write feedback text.
* **Submit Q&A**: Guests and buyers can submit questions directly to the supplier.
* **Message Supplier**: Clicking "Message Seller" opens the chat room.

### Demo Notes
* **Highlight**: Switch tabs (especially "Timeline" and "Q&A") to show how the page organizes complex material specifications.
* **Warning**: Review submission works only if the logged-in user has purchased this item, otherwise the API returns an error block.

---

## 4. ServicesPage (`pages/ServicesPage.tsx`)

* **Route:** `/services`
* **Auth required:** No
* **Purpose:** Services directory list where users find builders, electricians, plumbers, architects, and designers.

### State
* `services` (`Service[]`): List of active services from the database.
* `categories` (`ServiceCategory[]`): List of contractor service classifications.
* `activeCategory` (`string | null`): Filter indicator.
* `searchQuery` (`string`): Filters results by name.
* `selectedLocation` (`string`): Filters listings by Pakistan cities.
* `loading`, `error` (`states`).

### Data Loading
* **On Mount & Filter Change (`useEffect`)**:
  - Triggers requests to fetch service categories and service listings:
    - `GET /services/categories`
    - `GET /services?category={cat}&city={city}&search={query}`

### What it Renders
* **Categories Carousel**: Quick-selection category pills.
* **Filter Panel**: Dropdown filters for location (Lahore, Karachi, Islamabad) and price brackets.
* **Services Grid**: Card layouts displaying provider cover photos, experience tags, ratings, and starting rates.

### User Actions
* **View Details**: Clicking a card routes to `/services/:id`.
* **Contact Provider**: Clicking "Message" redirects the user to the Messages page with the provider's ID pre-selected.

---

## 5. ServiceDetailPage (`pages/ServiceDetailPage.tsx`)

* **Route:** `/services/:id`
* **Auth required:** No
* **Purpose:** Displays service deliverables, review history, and tier pricing models.

### State
* `service` (`any`): Holds the loaded service listing details.
* `loading`, `error` (`states`).
* `activeTab` (`string`): Toggles between Overview, Packages, and Reviews.
* `selectedTier` (`string`): Tracks selection of Silver, Gold, or Platinum pricing tiers.

### Data Loading
* **On Mount (`useEffect`)**:
  - Fetches the service details: `GET /services/:id`
  - Fetches reviews for the service: `GET /services/:id/reviews`

### What it Renders
* **Hero Image banner**: High-quality workspace photo.
* **Service Detail Overview**: Displays description, service specialties, and response rates.
* **Tier Pricing Grid**: Details deliverables, pricing (PKR), delivery duration, and revision limits for Silver, Gold, and Platinum tiers.

### User Actions
* **Select Pricing Tier**: Clicking a package card activates that tier.
* **Order Service**: Clicking "Order Now" routes the user to the checkout flow with package metadata passed in the router state.

---

## 6. ContractorProfilePage (`pages/ContractorProfilePage.tsx`)

* **Route:** `/contractors/:id`
* **Auth required:** No (Required to submit hiring form)
* **Purpose:** Portfolio, reviews list, and job booking interface for contractors.

### State
* `contractor` (`any`): Stores contractor profile details.
* `activeTab` (`string`): Toggles between Overview, Services, Portfolio, and Reviews.
* `lightboxImage` (`string | null`): Controls the fullscreen portfolio image viewer modal.
* `showHireModal` (`boolean`): Controls the visibility of the "Hire Contractor" form modal.
* `projectForm` (`object`): Stores project scope details (title, description, budget, timeline, start date).

### Data Loading
* **On Mount (`useEffect`)**:
  - Fetches profile info: `GET /contractors/:id`
  - Fetches contractor reviews: `GET /contractors/:id/reviews`
  - Fetches contractor portfolio items: `GET /contractors/:id/portfolio`

### What it Renders
* **Profile Header**: Avatar badge, city location, verified status icon, and average ratings.
* **Portfolio Showcase**: Interactive photo gallery grid of completed construction sites.
* **Hire Contractor Modal**: Form prompting for project details, start date, budget, and estimated end date.

### User Actions
* **View Gallery Fullscreen**: Clicking a portfolio thumbnail displays a lightbox modal.
* **Hire Contractor**: Clicking "Hire Me" opens the project form. Submitting the form calls `POST /projects` to register a new project.

---

## 7. CostEstimatorPage (`pages/CostEstimatorPage.tsx`)

* **Route:** `/cost-estimator`
* **Auth required:** No
* **Purpose:** AI-driven estimator tool that calculates construction costs for residential houses in Pakistan.

### State
* `form` (`EstimateFormState`): Input values for city, area (Marla), floor count, quality tier, and BHK config.
* `estimate` (`any`): Stores calculation breakdown outputs from the AI API.
* `comparison` (`any`): Array storing price comparisons across different quality tiers.
* `phases` (`PhaseItem[]`): Scheduled project phase milestones list.
* `loading`, `error` (`states`).
* `detailsOpen` (`boolean`): Toggles detailed material lists.

### Data Loading
* **On Mount (`useEffect`)**:
  - Fetches configuration models from `GET /estimator-config` (or uses local fallback rates).
* **On Calculate Button Click**:
  - Dispatches form data to `POST /estimate-cost` on the AI backend.
  - Sequentially dispatches queries to `GET /estimate-cost/compare` to fetch comparisons.

### What it Renders
* **Inputs Form Panel**: Dropdowns for cities (Lahore, Karachi, Islamabad, Peshawar), marla slider, floor selector, and quality rating cards.
* **Price Range Display**: Big bold cost ranges (in Lakhs/Crores PKR) and average cost per square foot.
* **Cost Progress Bars**: Visual breakdown of materials vs. labor split.
* **Comparison Matrix**: Side-by-side cost comparisons across Economy, Standard, and Premium tiers.

### User Actions
* **Configure House Profile**: Adjusting the Marla slider recalculates the square footage.
* **Calculate Cost**: Submitting the form triggers the AI backend calculation.

### Demo Notes
* **Highlight**: Adjusting inputs (e.g. from Economy to Premium) dynamically updates the material breakdown chart, showing how construction costs scale.
* **Known Issue**: The Render AI backend may experience a cold-start delay of up to 30 seconds on the first API call of the day.

---

## 8. RecommendationsPage (`pages/RecommendationsPage.tsx`)

* **Route:** `/recommendations`
* **Auth required:** No
* **Purpose:** Suggests matching materials based on construction phase estimates.

### State
* `description` (`string`): Search input for the user's project phase.
* `city` (`string`), `quality` (`string`): Filter parameters.
* `results` (`any[]`): Array of recommended materials.
* `loading`, `error` (`states`).

### Data Loading
* **On Submit**:
  - Calls `aiService.getRecommendations({ description, city, quality })` which hits `POST /recommendations` on the AI backend.

### What it Renders
* **Search Input Card**: Text area for natural-language descriptions (e.g., "grey structure plastering").
* **Results Panel**: Cards listing recommended materials, match confidence percentages, and direct checkout buttons.

---

## 9. CartPage (`pages/CartPage.tsx`)

* **Route:** `/cart`
* **Auth required:** Yes
* **Purpose:** Shopping cart summary page where buyers review items, adjust quantities, and apply discount codes.

### State
* `cartItems` (`CartItem[]`): Current items in the cart.
* `loading`, `error` (`states`).
* `promoCode` (`string`), `appliedPromo` (`any`): Promo code validation states.

### Data Loading
* **On Mount (`useEffect`)**:
  - Synchronizes local items with `GET /cart` to fetch active pricing and stock.

### What it Renders
* **Items Table**: List of materials, unit prices, quantity controls, and remove buttons.
* **Promo Code Card**: Coupon input field and validation check button.
* **Cart Summary**: Price breakdown displaying subtotal, tax estimation, and final totals.

### User Actions
* **Adjust Quantity**: Modifying quantity controls calls `updateQuantity` in `App.tsx`.
* **Remove Item**: Clicking the trash icon calls `removeFromCart` in `App.tsx`.
* **Checkout**: Clicking "Proceed to Checkout" routes the user to `/checkout`.

---

## 10. CheckoutPage (`pages/CheckoutPage.tsx`)

* **Route:** `/checkout`
* **Auth required:** Yes
* **Purpose:** Handles delivery details, payment gateway inputs, and order placement.

### State
* `paymentMethod` (`string`): Selection: cod / card / bank.
* `isProcessing` (`boolean`): Submission status loader.
* `orderPlaced`, `orderNumber` (`states`).
* `savedAddresses` (`any[]`): User's profile addresses list.
* `formData` (`FormData`): Delivery address form state.
* `errors` (`Record<string, string>`): Form validation error messages.

### Data Loading
* **On Mount (`useEffect`)**:
  - Fetches the user's saved addresses: `GET /users/:id/addresses`
  - Populates form fields if a default address is found.

### What it Renders
* **Address Form**: Delivery location fields (Street, City, Zip, Phone).
* **Payment Selector**: Toggle options for Cash on Delivery (COD) and Credit Card.
* **Stripe Elements Modal**: Embeds Stripe card inputs when "Card" is selected.

### User Actions
* **Place Order (COD)**: Immediately submits delivery details to `POST /orders` and routes to the success screen.
* **Place Order (Card)**: Initiates Stripe payment confirmation before submitting the order.

### Demo Notes
* **Highlight**: Select a saved address to show the auto-fill behavior, then run a COD checkout to demonstrate the instant success redirect.
* **Known Issue**: A new address record is created on the backend database on every checkout submission, even if the address matches an existing saved entry.

---

## 11. AccountPage (`pages/AccountPage.tsx`)

* **Route:** `/account`
* **Auth required:** Yes
* **Purpose:** Profile center for buyers, containing purchase histories, invoice downloads, tickets, active project milestones, and support chat portals.

### State
* `activeTab` (`string`): Track the active tab (e.g. overview, orders, projects, disputes, messages, support).
* `orders` (`any[]`), `projects` (`any[]`), `disputes` (`any[]`), `tickets` (`any[]`): Data collections populated from database endpoints.
* `modal` (`ModalState`): Controls overlays (e.g., refund form, dispute file, project creator).
* `profileForm`, `passwordForm`, `addressForm`: Input forms state for updating profile details.

### Data Loading
* **On Mount (`useEffect`)**:
  - Fires parallel queries to aggregate all buyer history in one load:
    - `GET /orders`
    - `GET /projects`
    - `GET /disputes`
    - `GET /tickets`
    - `GET /notifications`

### What it Renders
* **Sidebar Menu**: Vertical navigation panel to switch dashboard views.
* **Display Pane**: Dynamic sections based on the active tab:
  - **Orders Tab**: Purchase history list, order status badges, and PDF invoice download links.
  - **Projects Tab**: Ongoing contractor contract details and payment milestone logs.
  - **Disputes Tab**: List of active disputes and access to dispute chat threads.

### User Actions
* **File a Dispute**: Clicking "File Dispute" on an order opens a form modal, posting details to `POST /disputes`.
* **Download Invoices**: Clicking "Download PDF" generates a formatted invoice document.

---

## 12. MessagesPage (`src/pages/Messages.tsx`)

* **Route:** `/messages` (also accessible via `/account?tab=messages`)
* **Auth required:** Yes
* **Purpose:** Dedicated chat workspace where buyers communicate with contractors, service providers, and sellers.

### State
* `conversations` (`Conversation[]`): Chat thread headers.
* `selectedConversationId` (`string | null`): Highlights the active conversation.
* `messages` (`Message[]`): Text messages history of the active conversation.
* `newMessage` (`string`): Text input field state.
* `loading`, `sending` (`booleans`): Status loaders.

### Data Loading
* **On Mount (`useEffect`)**:
  - Loads all conversations: `GET /chat`
* **On Conversation Selection**:
  - Fetches message history: `GET /chat/conversations/:id/messages`

### What it Renders
* **Inbox Sidebar**: List of active conversation threads with avatar badges and unread message indicators.
* **Chat Window**: Scrollable list of text message boxes with user initials and timestamp details.

### User Actions
* **Send Message**: Typing a message and clicking send posts the text to `POST /chat/conversations/:id/messages`.

---

## 13. SupportPage (`src/pages/Support.tsx`)

* **Route:** `/support` (also accessible via `/account?tab=support`)
* **Auth required:** Yes
* **Purpose:** Support ticket tracker for filing complaints and billing reports.

### State
* `tickets` (`Ticket[]`): List of user support tickets.
* `newSubject`, `newCategory`, `newDescription` (`strings`): Ticket form fields.
* `isNewTicketOpen` (`boolean`): Controls ticket form dialog.

### Data Loading
* **On Mount (`useEffect`)**:
  - Fetches support tickets: `GET /tickets`

### What it Renders
* **Tickets List Grid**: Cards displaying ticket numbers, subjects, descriptions, and status badges (Open/In Progress/Closed).
* **Create Ticket Dialog**: Modal form with fields for subject, category dropdown, and description.

### User Actions
* **Create Ticket**: Submitting the form calls `POST /tickets` to register a new support ticket.

---

## 14. Auxiliary Pages (Public Static & Utility Pages)

* **AboutPage.tsx** (`/about`):
  - Purpose: Displays the brand history, mission statements, and developer team listings.
  - State: None.
* **BlogPage.tsx / BlogDetailPage.tsx** (`/blog` and `/blog/:id`):
  - Purpose: Renders educational construction articles and guides.
  - State: `posts` array, loaded on mount from `GET /content/posts`.
* **ContactPage.tsx** (`/contact`):
  - Purpose: Allows users to send messages to administration.
  - State: Contact form details (name, email, subject, message). Submitting calls `POST /contact-messages`.
* **EmailVerifyPage.tsx** (`/verify-email`):
  - Purpose: Verifies user accounts using tokens sent via email.
  - State: Verification status. Hits `GET /auth/verify-email?token=...` on mount.
* **ResetPasswordPage.tsx** (`/reset-password`):
  - Purpose: Renders the password recovery and password override forms.
  - State: Password input fields. Submitting calls `POST /auth/reset-password`.
* **SignInPage.tsx** (`/signin`):
  - Purpose: Login portal for buyers.
  - State: Email and password fields. Submitting calls `POST /auth/login`.
* **GetStartedPage.tsx** (`/get-started`):
  - Purpose: Sign-up portal for new buyers.
  - State: Name, email, password, and phone number fields. Submitting calls `POST /auth/register`.
* **TermsPage.tsx** (`/terms`) / **PrivacyPage.tsx** (`/privacy`):
  - Purpose: Renders corporate Terms of Service and Privacy Policy details.
  - State: None (uses static data files).
* **NotFoundPage.tsx** (404 Fallback):
  - Purpose: Friendly 404 page showing a construction roadblock icon and a homepage redirect link.
  - State: None.
