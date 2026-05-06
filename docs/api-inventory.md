# BuildHive API Inventory

Base client: `src/services/api.ts`

Default base URL: `import.meta.env.VITE_API_URL || "http://localhost:3000"`

Authenticated endpoints send `Authorization: Bearer <accessToken>` from cookie token storage.

## Connected APIs

| Area | Method | Path | Auth | Sends | Receives | Consumers | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Auth | POST | `/auth/register` | No | `{ email, password, fullName, phone?, role }` | `{ user, accessToken, refreshToken }` | `authService`, `AuthContext`, auth pages | Connected |
| Auth | POST | `/auth/login` | No | `{ email, password }` | `{ user, accessToken, refreshToken }` | `authService`, `AuthContext` | Connected |
| Auth | POST | `/auth/logout` | Yes | none | status | `authService`, `AuthContext` | Connected |
| Auth | GET | `/auth/me` | Yes | none | current user | `authService`, `AuthContext` | Connected |
| Auth | POST | `/auth/forgot-password` | No | `{ email }` | status | `authService` | Connected |
| Auth | POST | `/auth/reset-password` | No | `{ token, newPassword }` | status | `authService` | Connected |
| Auth | PUT | `/auth/change-password` | Yes | `{ currentPassword, newPassword }` | status | `authService` | Connected |
| Auth | GET | `/auth/verify-email?token=<token>` | No | token query | status | `authService` | Connected |
| Auth | POST | `/auth/refresh` | Yes | refresh cookie/token context | `{ user, accessToken, refreshToken }` | `authService` | Connected |
| Products | GET | `/products` | Optional | query: `search`, `categoryId`, `businessId`, `minPrice`, `maxPrice`, `page`, `limit`, `sortBy`, `sortOrder`, `status`, `isActive` | `{ products, pagination }` | `productService`, products/home/cart flows | Connected |
| Products | GET | `/products/:id` | Optional | path `id` | product | `productService` | Connected |
| Products | GET | `/products/slug/:slug` | Optional | path `slug` | product | `productService` | Connected |
| Reviews | GET | `/products/:productId/reviews` | Optional | path `productId` | reviews | `productService` | Connected |
| Reviews | POST | `/products/:productId/reviews` | Yes | `{ rating, comment? }` | review | `productService` | Connected |
| Reviews | PUT | `/products/:productId/reviews/:reviewId` | Yes | `{ rating?, comment? }` | review | `productService` | Connected |
| Reviews | DELETE | `/products/:productId/reviews/:reviewId` | Yes | path ids | status | `productService` | Connected |
| Cart | GET | `/cart` | Yes | none | `{ items, summary }` or array | `cartService`, `App` | Connected |
| Cart | POST | `/cart` | Yes | `{ productId, quantity }` | cart item | `cartService`, `App` | Connected |
| Cart | PUT | `/cart/:cartItemId` | Yes | `{ quantity }` | cart item | `cartService`, `App` | Connected |
| Cart | DELETE | `/cart/:cartItemId` | Yes | path id | status | `cartService`, `App` | Connected |
| Cart | DELETE | `/cart/clear/all` | Yes | none | status | `cartService`, `App` | Connected |
| Cart | GET | `/cart/summary` | Yes | none | `{ total_items, subtotal, total }` | `cartService` | Connected |
| Orders | GET | `/orders` | Yes | query: `status`, `payment_status`, `page`, `limit`, `sortBy`, `sortOrder` | `{ orders, pagination }` | `orderService`, account | Connected |
| Orders | GET | `/orders/:id` | Yes | path `id` | order | `orderService` | Connected |
| Orders | POST | `/orders` | Yes | `{ items, shippingAddressId?, shipping_address?, billing_address?, paymentMethod, notes? }` | order | `orderService`, checkout | Connected |
| Orders | PUT | `/orders/:id/cancel` | Yes | `{ reason? }` | order | `orderService` | Connected |
| Orders | GET | `/orders/:id/tracking` | Yes | path `id` | tracking | `orderService` | Connected |
| Orders | GET | `/orders/:id/invoice` | Yes | path `id` | blob | `orderService` | Connected |
| Orders | POST | `/orders/:orderId/rate` | Yes | `{ rating, review? }` | status | `orderService` | Connected |
| Users | GET | `/users/profile` | Yes | none | profile | `userService`, account | Connected |
| Users | PUT | `/users/:userId` | Yes | `{ full_name?, phone?, date_of_birth?, gender?, profile_image? }` | profile | `userService` | Connected |
| Users | PUT | `/users/:userId/profile-image` | Yes | multipart `image` | `{ imageUrl }` | `userService` | Connected |
| Users | DELETE | `/users/:userId/profile-image` | Yes | path id | status | `userService` | Connected |
| Addresses | GET | `/users/:userId/addresses` | Yes | path `userId` | addresses | `userService`, `addressService`, cart/checkout | Connected |
| Addresses | GET | `/users/addresses/:id` | Yes | path `id` | address | `userService` | Connected |
| Addresses | POST | `/users/:userId/addresses` | Yes | `{ addressType?, fullName?, label?, phone, addressLine1, addressLine2?, city, state, postalCode, country, isDefault? }` | address | `userService`, `addressService` | Connected |
| Addresses | PUT | `/users/:userId/addresses/:addressId` | Yes | same address fields | address | `userService` | Connected |
| Addresses | DELETE | `/users/:userId/addresses/:addressId` | Yes | path ids | status | `userService` | Connected |
| Addresses | PUT | `/users/:userId/addresses/:addressId/default` | Yes | path ids | address | `userService` | Connected |
| Wishlist | GET | `/users/wishlist` | Yes | none | wishlist items | `userService`, `useWishlist` | Connected |
| Wishlist | POST | `/users/wishlist` | Yes | `{ product_id }` | status | `userService`, `useWishlist` | Connected |
| Wishlist | DELETE | `/users/wishlist/:productId` | Yes | path `productId` | status | `userService`, `useWishlist` | Connected |
| Notifications | GET | `/users/notifications` | Yes | query: `page`, `limit` | `{ notifications, pagination }` | `userService`, notifications page | Connected |
| Notifications | PUT | `/users/notifications/:id/read` | Yes | path `id` | status | `userService`, notifications page | Connected |
| Notifications | PUT | `/users/notifications/read-all` | Yes | none | status | `userService`, notifications page | Connected |
| Categories | GET | `/categories` | Optional | none | categories | `categoryService` | Connected |
| Categories | GET | `/categories/:id` | Optional | path `id` | category | `categoryService` | Connected |
| Businesses | GET | `/businesses` | Optional | query: `search`, `status`, `isVerified`, `page`, `limit`, `sortBy`, `sortOrder` | `{ businesses, pagination }` | `businessService` | Connected |
| Businesses | GET | `/businesses/:id` | Optional | path `id` | business | `businessService` | Connected |
| Businesses | GET | `/businesses/me` | Yes | none | business | `businessService` | Connected |
| Businesses | POST | `/businesses` | Yes | business payload | business | `businessService` | Connected |
| Businesses | PUT | `/businesses/:id` | Yes | business payload | business | `businessService` | Connected |
| Businesses | DELETE | `/businesses/:id` | Yes | path `id` | status | `businessService` | Connected |
| Businesses | GET | `/businesses/:businessId/products` | Optional | path `businessId`, query filters | products | `businessService` | Connected |
| Contact | POST | `/contact` | No | `{ name, email, phone, subject, message }` | `{ success, message, data? }` | `contactService`, contact page | Connected through shared client |
| Payment | GET | `/payment/config` | Yes | none | `{ publishableKey, mode }` | `useStripePayment`, checkout | Connected |
| Payment | POST | `/payment/create-payment-intent` | Yes | `{ orderId }` | `{ clientSecret, paymentIntentId }` | `useStripePayment`, checkout | Connected |
| Payment | POST | `/payment/confirm-payment` | Yes | `{ paymentIntentId }` | status | `useStripePayment`, checkout | Connected |

## Required APIs Added In Frontend

| Area | Method | Path | Auth | Sends | Receives | Consumers | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Services | GET | `/services` | Optional | query: `search`, `categoryId`, `subcategory`, `providerId`, `minPrice`, `maxPrice`, `priceType`, `minRating`, `minExperience`, `location`, `availability`, `specialty`, `page`, `limit`, `sortBy`, `sortOrder` | `{ services, pagination }` | `serviceMarketplaceService`, services page | Frontend client added |
| Services | GET | `/services/:id` | Optional | path `id` | service | `serviceMarketplaceService` | Frontend client added |
| Providers | GET | `/service-providers` | Optional | query: `search`, `categoryId`, `location`, `isVerified`, `page`, `limit` | `{ providers, pagination }` | `serviceMarketplaceService`, home/services | Frontend client added |
| Providers | GET | `/service-providers/:id` | Optional | path `id` | provider | `serviceMarketplaceService` | Frontend client added |
| Quotes | POST | `/service-quotes` | Optional | `{ serviceId, projectDetails, budget, timeline, contactName, contactPhone, contactEmail, location }` | quote/request | services page | Frontend client added |
| Homepage | GET | `/homepage` | Optional | none | `{ categories, featuredListings, topProviders, stats }` | `contentService`, home page | Frontend client added |
| Cart | GET | `/cart/recommendations` | Optional | none | products/items | `commerceService`, cart page | Frontend client added |
| Payments | GET | `/payment-methods` | Yes | none | payment methods | `commerceService`, cart page | Frontend client added |
| Promo | POST | `/promo-codes/validate` | Optional | `{ code, cartTotal }` | `{ code, discount, type, minOrder?, maxDiscount? }` | `commerceService`, cart page | Frontend client added |
| Settings | GET | `/settings` | Yes | none | grouped settings | `settingsService`, settings page | Frontend client added |
| Settings | PUT | `/settings` | Yes | grouped settings | grouped settings | `settingsService`, settings page | Frontend client added |
| CMS | GET | `/content/about` | Optional | none | about page data | `contentService` | Frontend client added |
| CMS | GET | `/content/blog` | Optional | query: `category`, `search`, `page`, `limit` | blog index data | `contentService` | Frontend client added |
| CMS | GET | `/content/blog/:idOrSlug` | Optional | path id/slug | blog detail data | `contentService` | Frontend client added |
| CMS | GET | `/content/legal/terms` | Optional | none | terms page data | `contentService` | Frontend client added |
| CMS | GET | `/content/legal/privacy` | Optional | none | privacy page data | `contentService` | Frontend client added |
| CMS | GET | `/content/get-started` | Optional | none | get-started page data | `contentService` | Frontend client added |
| CMS | GET | `/content/sign-in` | Optional | none | sign-in page data | `contentService` | Frontend client added |
| CMS | GET | `/content/checkout-config` | Optional | none | checkout config | `contentService` | Frontend client added |
| CMS | GET | `/content/contact` | Optional | none | contact content/config | `contentService` | Frontend client added |

## Migration Notes

- Local record arrays should not be used as API fallbacks. If an endpoint is unavailable, pages should render loading, empty, or error UI.
- UI-only constants such as icons, field labels, section headings, and select option labels may stay local until the backend returns equivalent configuration.
- Address writes are normalized to camelCase immediately before calling the API.
