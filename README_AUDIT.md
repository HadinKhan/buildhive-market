# BuildHive Marketplace Web Audit Report (`buildhive-market`)

This document provides a clean, in-depth audit of the marketplace frontend web application, detailing the system architecture, unnecessary files, unused code modules, and typescript compiler warnings/unused locals.

---

## 1. Core Architecture & Logic Used

The marketplace website is a **React single-page application (SPA)** built with TypeScript and bundled using **Vite**.

### Routing & Client Initialization
- **Entry Points (`index.html` & `src/index.tsx`)**: The HTML file serves as the single template container which loads `index.tsx` to bootstrap the React client.
- **Application Routing (`src/App.tsx`)**: Configures page routes using `react-router-dom`. It maps path paths (e.g., `/products`, `/services`, `/cart`) to page view components.
- **Global Context (`src/context/AuthContext.tsx`)**: Manages session state, stores authenticated user profiles, verifies roles, and handles persistent storage of token tokens.

### Layered Services & Logic
- **`src/services/`**: Holds API request modules. These services wrap custom `axios` request routing to query endpoints of the Node Express backend:
  - `authService.ts`: Registers new buyers/contractors/suppliers and retrieves user sessions.
  - `productService.ts`: Connects to catalog and category queries.
  - `serviceMarketplaceService.ts`: Retrieves services, contractor portfolios, and handles proposal bidding.
- **`pages/`**: View layouts containing local states for filters, categories, and checkout procedures:
  - `ProductsPage.tsx` & `ServicesPage.tsx`: Large pages implementing product search, service listing feeds, custom filtering, and page layouts.

---

## 2. Unnecessary Files & Folders

These files are not utilized by the running marketplace application and can be safely deleted to reduce repository size:

### Stray / Unused Media in Root
- `hadinkhan.png`, `ayaan.jpeg`, `hamad.png` (Obsolete local profile placeholders in root)
- `productsplaceholder.png` (~8.4MB placeholder asset sitting directly in root)
- `public/Favicon.png` (Unused high-res favicon copy)

### Redundant Texts & Temporary Logs
- `marketplace.txt` (Duplicate copy of `README.md`)
- `vite-dev.log` & `vite-dev.err.log` (Vite dev server stdout and error dumps)

---

## 3. Unused Code Files (Dead Logic)

The following files are present in the codebase but are never imported, routed, or executed:

### Unrouted Pages
- **`pages/BlogPage.tsx`**: Renders a blog list page. This file is orphaned as it is not referenced in the `App.tsx` routes.
- **`pages/BlogDetailPage.tsx`**: Renders a blog post details view, completely unrouted.

### Orphaned React Components
- **`components/ProductCard.tsx`**: A component designed to render a product. The application currently uses inline layouts inside `ProductsPage.tsx`, leaving this card unused.
- **`components/ContractorCard.tsx`**: Unused contractor card representation component.

### Orphaned API Services & Utilities
- **`src/services/businessService.ts`**: API wrapper for querying store/business data, defined but never imported.
- **`src/services/categoryService.ts`**: Service for category fetch calls, bypassed by direct inline axios queries on the search pages.
- **`src/services/contentService.ts`**: Stub services client that is completely unused.
- **`src/utils/storage.ts`**: Unused wrapper for browser LocalStorage operations.

### Unused Mock Data & Styles
- **`src/data/homePageData.ts`**: Unused home page configuration stub.
- **`src/styles/homePageStyles.ts`**, `src/styles/contactPageStyles.ts`, `src/styles/servicesPageStyles.ts`: CSS-in-JS layout definitions that are never imported.

---

## 4. Unused Local Variables & Parameters

The TypeScript compiler identified several instances where variables and parameters are declared but never read, which should be removed to improve readability:

| File Path | Line | Unused Token | Context / Details |
| :--- | :--- | :--- | :--- |
| `pages/ContractorProfilePage.tsx` | 436 | `reviews` | Query destructured property never used |
| `pages/CostEstimatorPage.tsx` | 43 | `cityOptions` | Declared drop-down options never read |
| `pages/CostEstimatorPage.tsx` | 55 | `qualityOptions` | Declared drop-down options never read |
| `pages/CostEstimatorPage.tsx` | 60 | `floorOptions` | Declared drop-down options never read |
| `pages/CostEstimatorPage.tsx` | 61 | `bedroomOptions` | Declared drop-down options never read |
| `pages/CostEstimatorPage.tsx` | 62 | `washroomOptions` | Declared drop-down options never read |
| `pages/DisputeDetailPage.tsx` | 7 | `CheckCircle2` | Lucide icon import declared but unused |
| `pages/DisputeDetailPage.tsx` | 77 | `ResolutionStatus` | Type enum declared but never used |
| `pages/DisputeDetailPage.tsx` | 235 | `aiSummary` | State variable set but never read |
| `pages/DisputeDetailPage.tsx` | 236 | `summarizing` | State variable set but never read |
| `pages/DisputeDetailPage.tsx` | 421 | `handleAiSummary` | Function defined but never called |
| `pages/HomePage.tsx` | 57 | `ServiceProvider` | Interface declared but unused |
| `pages/HomePage.tsx` | 73 | `FeaturedContractor` | Interface declared but unused |
| `pages/HomePage.tsx` | 140 | `fallbackCategories` | Stub categories array never referenced |
| `pages/HomePage.tsx` | 179 | `fallbackFeaturedListings` | Stub listings array never referenced |
| `pages/HomePage.tsx` | 335 | `renderContractorSkeletons` | Skeleton layout helper never called |
| `pages/ProductDetailPage.tsx` | 5 | `api` | Axios client import declared but unused |
| `pages/ProductDetailPage.tsx` | 44 | `onMessageSeller` | Callback argument never read |
| `pages/ProductDetailPage.tsx` | 72 | `questionLoading` | State variable declared but never read |
| `pages/ProductDetailPage.tsx` | 104 | `productQuestions` | State variable declared but never read |
| `pages/ProductDetailPage.tsx` | 107 | `productTimeline` | State variable declared but never read |
| `pages/ProductDetailPage.tsx` | 231 | `submitQuestion` | Function defined but never called |
| `pages/ProductsPage.tsx` | 4 | `useRef` | React hook import unused |
| `pages/ProductsPage.tsx` | 13 | `aiService` | AI client service import unused |
| `pages/ProductsPage.tsx` | 839 | `sellerProfiles` | State variable declared but never read |
| `pages/ProductsPage.tsx` | 1997 | `mapAiProduct` | Helper mapper function defined but unused |
| `pages/ProductsPage.tsx` | 2038 | `onNavigate` | Callback parameter declared but unused |
| `pages/ProductsPage.tsx` | 2044 | `wishlist` | Local storage state array declared but unused |
| `pages/ProductsPage.tsx` | 2062 | `toggleMaterialType` | Filter action helper defined but unused |
| `pages/ProductsPage.tsx` | 2063 | `toggleSeller` | Filter action helper defined but unused |
| `pages/ProductsPage.tsx` | 2083 | `setShowWishlistOnly` | State setter declared but never called |
| `pages/ProductsPage.tsx` | 2090 | `setCategoryNavSearch` | State setter declared but never called |
| `pages/ProductsPage.tsx` | 2091 | `setCategorySearches` | State setter declared but never called |
| `pages/ProductsPage.tsx` | 2094 | `setSellerSearch` | State setter declared but never called |
| `pages/ProductsPage.tsx` | 2095 | `filterExpanded` | Boolean state variable never read |
| `pages/ProductsPage.tsx` | 2511 | `sellerData` | Destructured data block never referenced |
| `pages/ProductsPage.tsx` | 2925 | `visibleSellers` | Array state declared but never read |
| `pages/ProductsPage.tsx` | 2940 | `activeFilterCount` | Count calculation defined but never read |
| `pages/ProductsPage.tsx` | 2945 | `currentCategoryLabel` | Derived string calculation defined but never read |
| `pages/ProductsPage.tsx` | 2950 | `visibleCategories` | Filtered list variable never read |
| `pages/ProductsPage.tsx` | 2962 | `activeMaterialGroups` | Filter helper defined but never read |
| `pages/ProductsPage.tsx` | 2998 | `getMaterialCount` | Function helper defined but never called |
| `pages/ProductsPage.tsx` | 3016-3018 | `visiblePriceMin`, `visiblePriceMax`...| Derived search bounds variables defined but never read |
| `pages/ServicesPage.tsx` | 1369 | `marketplaceCategoryButtons` | JSX button mapper defined but never rendered |
| `pages/ServicesPage.tsx` | 1609 | `featuredServicesPreview` | Category block JSX defined but never referenced |
| `pages/ServicesPage.tsx` | 1762-1764 | `selectedSpecialties`, `selectedProviders`...| Filter selection state arrays never read |
| `pages/ServicesPage.tsx` | 1769 | `experienceMin` | Number state declared but never read |
| `pages/ServicesPage.tsx` | 1773 | `showLikedOnly` | Boolean toggle state declared but never read |
| `pages/ServicesPage.tsx` | 1862 | `visibleCategories` | Variable defined but never read |
| `pages/ServicesPage.tsx` | 1875 | `activeSpecialtyGroups` | Helper list defined but never read |
| `pages/ServicesPage.tsx` | 1924 | `serviceMatchesSpecialty` | Matching validator function defined but never called |
| `pages/ServicesPage.tsx` | 2031 | `toggleValue` | Click action handler defined but never called |
| `pages/ServicesPage.tsx` | 2043 | `toggleComparison` | Toggle action handler defined but never called |
| `pages/ServicesPage.tsx` | 2124 | `placeServiceOrder` | Modal handler defined but never called |
| `src/services/contractorService.ts` | 263 | `email` | Argument declared but never reference-called |

---

## 5. TypeScript Compilation Warnings to Note

The typescript typechecker flagged several invalid type definitions that could result in runtime exceptions:

- **`src/context/AuthContext.tsx` (L117 & L124)**:
  - L117 attempts to convert `Record<string, unknown>` directly to `AuthUser`. This throws a type overlap warning because `Record` lacks required keys (`id`, `email`, `role`, `full_name`).
  - L124 assigns `string | null` to a variable expecting `string | undefined`.
- **`src/pages/Messages.tsx` (L169 & L214)**:
  - Implies implicit `any` parameter warnings on message/conversation handlers.
- **`src/services/orderService.ts` (L158)**:
  - Error: `Property 'orders' does not exist on type 'ApiResponse<any>'`. This occurs because of a fallback access `response.data?.orders?.[0]` on a type that only defines standard `success`, `message`, and `data` objects.

---

## 6. Clean-up & Mitigation Action Plan

To clean up the marketplace frontend application:
1.  **Delete Obsolete Assets**: Remove profile placeholders (`hadinkhan.png`, `ayaan.jpeg`, `hamad.png`), large placeholder images (`productsplaceholder.png`), and developer logs.
2.  **Delete Unrouted Files**: Safe-delete blog pages, unused components (`ProductCard.tsx`, `ContractorCard.tsx`), and unused services client files.
3.  **Clean up Unused Variables**: Strip out the unused local variables in `ProductsPage.tsx` and `ServicesPage.tsx` to improve compilation speed and bundle size.
4.  **Resolve TypeScript Type Warns**: Update the auth provider context typecast and resolve the typed key mismatch in `orderService.ts`.
