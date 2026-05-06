# BuildHive Backend API Documentation

This document is the frontend-facing reference for the BuildHive backend API. It reflects the current mounted routes, auth rules, and request/response shapes used by the live server.

## Base URL

Development: `http://localhost:3000`

### 5.1 Notifications

All notification routes require authentication via the shared `verifyToken` middleware.

| Method | Path                                                | Auth | Role               | Description                      |
| ------ | --------------------------------------------------- | ---: | ------------------ | -------------------------------- |
| GET    | `/notifications`                                    |  Yes | Authenticated user | List notifications               |
| GET    | `/notifications/unread-count`                       |  Yes | Authenticated user | Count unread notifications       |
| GET    | `/notifications/announcements`                      |  Yes | Authenticated user | List announcements               |
| GET    | `/notifications/realtime`                           |  Yes | Authenticated user | Realtime updates payload         |
| GET    | `/notifications/stream`                             |  Yes | Authenticated user | SSE/stream endpoint              |
| GET    | `/notifications/push/config`                        |  Yes | Authenticated user | Push config                      |
| GET    | `/notifications/preferences`                        |  Yes | Authenticated user | Notification preferences         |
| PUT    | `/notifications/preferences`                        |  Yes | Authenticated user | Update preferences               |
| GET    | `/notifications/push/subscriptions`                 |  Yes | Authenticated user | Push subscriptions               |
| POST   | `/notifications/push/subscriptions`                 |  Yes | Authenticated user | Register push subscription       |
| DELETE | `/notifications/push/subscriptions/:subscriptionId` |  Yes | Authenticated user | Delete subscription              |
| POST   | `/notifications/push/test`                          |  Yes | Authenticated user | Send test push                   |
| PUT    | `/notifications/mark-as-read`                       |  Yes | Authenticated user | Mark one notification as read    |
| PUT    | `/notifications/mark-all-as-read`                   |  Yes | Authenticated user | Mark all notifications as read   |
| GET    | `/notifications/failed`                             |  Yes | Admin              | Failed notifications             |
| GET    | `/notifications/delivery-stats`                     |  Yes | Admin              | Delivery stats                   |
| POST   | `/notifications/retry-failed`                       |  Yes | Admin              | Retry failed notifications       |
| POST   | `/notifications/:notificationId/retry`              |  Yes | Admin              | Retry one notification           |
| DELETE | `/notifications/:notificationId`                    |  Yes | Authenticated user | Delete notification              |
| POST   | `/notifications/create-for-customer`                |  Yes | Supplier           | Create notification for customer |
| POST   | `/notifications/send-email`                         |  Yes | Admin              | Send email notification          |
| POST   | `/notifications/create`                             |  Yes | Admin              | Create notification              |
| POST   | `/notifications/send-order-confirmation`            |  Yes | Authenticated user | Send order confirmation          |

Use the validators in `src/modules/communication/validators/notificationValidator.js` for request shapes.

### 5.2 Contact Messages and Support Tickets

#### Contact submissions

| Method | Path                                 | Auth | Role   | Description                           |
| ------ | ------------------------------------ | ---: | ------ | ------------------------------------- |
| POST   | `/contact`                           |   No | Public | Submit contact form                   |
| POST   | `/contact/contact`                   |   No | Public | Alias for contact submission          |
| GET    | `/contact`                           |  Yes | Admin  | List contact submissions              |
| GET    | `/contact/contact`                   |  Yes | Admin  | Alias for listing contact submissions |
| PUT    | `/contact/:messageId/status`         |  Yes | Admin  | Update contact status                 |
| PUT    | `/contact/contact/:messageId/status` |  Yes | Admin  | Alias for update status               |
| GET    | `/contact/stats`                     |  Yes | Admin  | Contact stats                         |

#### Support tickets

Ticket endpoints are available under `/tickets` (user-facing) and `/admin/tickets` (admin).

| Method | Path                              | Auth | Role               | Description               |
| ------ | --------------------------------- | ---: | ------------------ | ------------------------- |
| POST   | `/tickets`                        |  Yes | Authenticated user | Create support ticket     |
| GET    | `/tickets`                        |  Yes | Authenticated user | List current user tickets |
| GET    | `/tickets/:ticketId`              |  Yes | Authenticated user | Ticket details            |
| POST   | `/tickets/:ticketId/messages`     |  Yes | Authenticated user | Add ticket message        |
| PUT    | `/tickets/:ticketId/close`        |  Yes | Authenticated user | Close ticket              |
| GET    | `/tickets/all`                    |  Yes | Admin              | List all tickets          |
| GET    | `/tickets/:ticketId`              |  Yes | Admin              | Admin view of ticket      |
| GET    | `/admin/tickets`                  |  Yes | Admin              | Alias / admin index       |
| GET    | `/admin/tickets/stats`            |  Yes | Admin              | Ticket stats              |
| PUT    | `/admin/tickets/:ticketId/status` |  Yes | Admin              | Update ticket status      |
| PUT    | `/admin/tickets/:ticketId/assign` |  Yes | Admin              | Assign ticket             |

`POST /tickets/:ticketId/messages` supports `multipart/form-data` attachments; the backend accepts one optional `attachment` file field. See validators in `src/modules/communication/validators/contactValidator.js`.

### 5.3 Chat

All chat routes require authentication.

| Method | Path                                           | Auth | Role               | Description               |
| ------ | ---------------------------------------------- | ---: | ------------------ | ------------------------- |
| GET    | `/chat`                                        |  Yes | Authenticated user | List conversations        |
| GET    | `/chat/unread-count`                           |  Yes | Authenticated user | Unread count              |
| GET    | `/chat/search`                                 |  Yes | Authenticated user | Search messages           |
| POST   | `/chat/conversations`                          |  Yes | Authenticated user | Create conversation       |
| DELETE | `/chat/conversations/:conversationId`          |  Yes | Authenticated user | Delete conversation       |
| GET    | `/chat/conversations/:conversationId/messages` |  Yes | Authenticated user | Conversation messages     |
| POST   | `/chat/conversations/:conversationId/messages` |  Yes | Authenticated user | Send message              |
| PUT    | `/chat/messages/:messageId/read`               |  Yes | Authenticated user | Mark message as read      |
| PUT    | `/chat/conversations/:conversationId/read`     |  Yes | Authenticated user | Mark conversation as read |

`POST /chat/conversations` requires a `participantId` UUID. Message posts accept either `messageText` or `attachment.url` (see `src/modules/communication/routes/chatRoutes.js`).

Notes:

- `role` defaults to `buyer` when omitted.
- `termsAccepted` must be `true`.
- Registration creates a user record and may trigger verification email logging if mail is not configured.

### `POST /auth/login`

Request body:

```json
{
  "email": "seller@buildhive.com",
  "password": "SellerPass@123"
}
```

Response example:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "seller@buildhive.com",
      "fullName": "Ahmed Seller",
      "phone": "+923003234567",
      "role": "supplier",
      "emailVerified": true,
      "profileImage": null
    },
    "accessToken": "jwt",
    "refreshToken": "jwt"
  }
}
```

### `POST /auth/refresh`

Request body:

```json
{
  "refreshToken": "jwt"
}
```

### `PUT /auth/change-password`

Request body:

```json
{
  "currentPassword": "OldPass@123",
  "newPassword": "NewPass@123"
}
```

### `GET /auth/me`

Returns the current session user and, for suppliers, an attached `store` object when an approved business exists.

Response example:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "email": "seller@buildhive.com",
    "fullName": "Ahmed Seller",
    "role": "supplier",
    "store": {
      "id": "uuid",
      "businessName": "Ahmed Seller Store",
      "status": "approved"
    }
  }
}
```

### `PUT /auth/users/:userId/role`

Request body:

```json
{
  "role": "admin"
}
```

Supported roles:

- `buyer`
- `supplier`
- `contractor`
- `admin`

---

## 2) User & Profile

### Endpoint Summary

| Method | Path                                      | Auth | Role           | Description                  |
| ------ | ----------------------------------------- | ---: | -------------- | ---------------------------- |
| GET    | `/users/admin/users`                      |  Yes | Admin          | List users                   |
| PUT    | `/users/admin/users/:id/status`           |  Yes | Admin          | Update account status        |
| DELETE | `/users/admin/users/:id`                  |  Yes | Admin          | Permanently delete a user    |
| GET    | `/users/:id`                              |  Yes | Owner or admin | Get a user profile           |
| PUT    | `/users/:id`                              |  Yes | Owner or admin | Update user profile          |
| PUT    | `/users/:id/profile-image`                |  Yes | Owner or admin | Upload profile image         |
| DELETE | `/users/:id/profile-image`                |  Yes | Owner or admin | Delete profile image         |
| GET    | `/users/:id/notification-preferences`     |  Yes | Owner or admin | Read notification prefs      |
| PUT    | `/users/:id/notification-preferences`     |  Yes | Owner or admin | Update notification prefs    |
| GET    | `/users/:id/export`                       |  Yes | Owner or admin | Export user data             |
| DELETE | `/users/:id/account`                      |  Yes | Owner or admin | Deactivate and scrub account |
| GET    | `/users/:id/addresses`                    |  Yes | Owner or admin | List addresses               |
| POST   | `/users/:id/addresses`                    |  Yes | Owner or admin | Add address                  |
| PUT    | `/users/:id/addresses/:addressId`         |  Yes | Owner or admin | Update address               |
| DELETE | `/users/:id/addresses/:addressId`         |  Yes | Owner or admin | Delete address               |
| PUT    | `/users/:id/addresses/:addressId/default` |  Yes | Owner or admin | Mark address as default      |

### Common profile payloads

`PUT /users/:id` accepts partial profile updates such as:

```json
{
  "fullName": "Ahmed Seller",
  "phone": "+923001234567"
}
```

`PUT /users/:id/notification-preferences` accepts the preference object defined by the backend validator and stored with the user profile.

`POST /users/:id/addresses` and `PUT /users/:id/addresses/:addressId` accept address fields such as:

```json
{
  "line1": "123 Main Road",
  "city": "Lahore",
  "postalCode": "54000",
  "country": "Pakistan"
}
```

### Profile image upload

- `PUT /users/:id/profile-image` expects `multipart/form-data`.
- Field name: `image`
- File types: image only

---

## 3) Marketplace

### 3.1 Categories

| Method | Path                            | Auth | Role   | Description           |
| ------ | ------------------------------- | ---: | ------ | --------------------- |
| GET    | `/categories`                   |   No | Public | List categories       |
| GET    | `/categories/tree`              |   No | Public | Category tree         |
| GET    | `/categories/slug/:slug`        |   No | Public | Get category by slug  |
| GET    | `/categories/:categoryId`       |   No | Public | Get category by ID    |
| POST   | `/categories`                   |  Yes | Admin  | Create category       |
| PUT    | `/categories/:categoryId`       |  Yes | Admin  | Update category       |
| PUT    | `/categories/:categoryId/image` |  Yes | Admin  | Upload category image |
| DELETE | `/categories/:categoryId/image` |  Yes | Admin  | Delete category image |
| DELETE | `/categories/:categoryId`       |  Yes | Admin  | Delete category       |

Category create/update uses the backend validator. Typical fields include `name`, `slug`, `description`, `image`, `displayOrder`, `isActive`, and `parentId` where supported.

### 3.2 Businesses

| Method | Path                           | Auth | Role          | Description                   |
| ------ | ------------------------------ | ---: | ------------- | ----------------------------- |
| GET    | `/business`                    |   No | Public        | List businesses               |
| GET    | `/business/my-business`        |  Yes | Supplier      | Get current supplier business |
| GET    | `/business/:businessId`        |   No | Public        | Get business by ID            |
| POST   | `/business`                    |  Yes | Supplier      | Create business profile       |
| PUT    | `/business/:businessId`        |  Yes | Authenticated | Update business               |
| PUT    | `/business/:businessId/logo`   |  Yes | Authenticated | Upload business logo          |
| DELETE | `/business/:businessId/logo`   |  Yes | Authenticated | Delete logo                   |
| DELETE | `/business/:businessId`        |  Yes | Authenticated | Delete business               |
| PUT    | `/business/:businessId/status` |  Yes | Admin         | Update business status        |

Important note:

- Supplier product creation expects an approved business profile.
- The backend may resolve the business automatically from the authenticated supplier when `businessId` is omitted.

#### `POST /business` (Create business payload)

Only users with the `supplier` role may create a business profile. Example request body:

```json
{
  "businessName": "Ahmed Seller Store",
  "businessType": "retail",
  "description": "Building materials supplier",
  "registrationNumber": "BR-123456",
  "taxNumber": "TX-987654",
  "addressLine1": "12 Market Road",
  "addressLine2": "Unit 4",
  "city": "Lahore",
  "state": "Punjab",
  "postalCode": "54000",
  "country": "Pakistan",
  "phone": "+923001234567",
  "email": "seller@example.com",
  "website": "https://store.example.com"
}
```

Response: `201 Created` with the created business object and `status: "pending"` until approved by an admin.

#### Business logo upload

Endpoint: `PUT /business/:businessId/logo`

- Content-Type: `multipart/form-data`
- Field name: `logo` (single file)
- Accepted file types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
- Max file size: 5 MB

Response: updated business object including `logo` public URL and a `mediaPreview` object.

### 3.3 Products

| Method | Path                                   | Auth | Role              | Description                                                                     |
| ------ | -------------------------------------- | ---: | ----------------- | ------------------------------------------------------------------------------- |
| GET    | `/products`                            |   No | Public            | List products with filtering                                                    |
| GET    | `/products/slug/:slug`                 |   No | Public            | Get product by slug                                                             |
| GET    | `/products/:productId`                 |   No | Public            | Get product by ID                                                               |
| POST   | `/products`                            |  Yes | Supplier          | Create product                                                                  |
| PUT    | `/products/:productId`                 |  Yes | Supplier          | Update own product                                                              |
| POST   | `/products/bulk-publish`               |  Yes | Supplier          | Publish many products                                                           |
| POST   | `/products/:productId/publish`         |  Yes | Supplier          | Publish a product                                                               |
| POST   | `/products/:productId/draft`           |  Yes | Supplier          | Move product back to draft                                                      |
| POST   | `/products/:productId/images`          |  Yes | Supplier          | Upload product images                                                           |
| DELETE | `/products/:productId/images/:imageId` |  Yes | Supplier          | Delete a product image                                                          |
| DELETE | `/products/:productId`                 |  Yes | Supplier          | Delete product                                                                  |
| GET    | `/products/:productId/timeline`        |  Yes | Supplier or admin | Product timeline events                                                         |
| PUT    | `/products/:productId/review-display`  |  Yes | Supplier or admin | Update review display settings (virtual response, not persisted in live schema) |
| PUT    | `/products/:productId/status`          |  Yes | Admin             | Approve / reject / pending                                                      |

#### Product images

Upload endpoint: `POST /products/:productId/images`.

- Content-Type: `multipart/form-data`
- Field name: `images` (array, up to 10 files)
- Accepted file types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
- Max file size: 5 MB per file

Response: array of uploaded image records with `id`, `image_url`, `display_order` and a generated `mediaPreview` object.

Example successful response body:

```json
{
  "success": true,
  "message": "Product images uploaded successfully",
  "data": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "image_url": "https://.../product-images/....jpg",
      "display_order": 0,
      "mediaPreview": { "url": "https://...", "width": 800, "height": 600 }
    }
  ]
}
```

#### `GET /products`

Supports query filters such as:

- `categoryId`
- `businessId`
- `status`
- `isActive`
- `minPrice`
- `maxPrice`
- `search`
- `tag` / `tags`
- `featured`
- `sortBy`
- `sortOrder`
- `page`
- `limit`

Response shape:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "products": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

Frontend note:

- Use `data.products` from the API response.
- The dashboard service already normalizes the list to `Product[]`.

#### `POST /products`

The backend accepts canonical API fields and dashboard aliases.

Canonical payload:

```json
{
  "name": "Test Product",
  "slug": "test-product",
  "description": "Product description",
  "categoryId": "uuid",
  "businessId": "uuid",
  "price": 15,
  "compareAtPrice": 20,
  "costPerItem": 10,
  "sku": "PRD-001",
  "barcode": "1234567890123",
  "trackQuantity": true,
  "quantity": 3,
  "lowStockThreshold": 5,
  "weight": 1.2,
  "weightUnit": "kg",
  "requiresShipping": true,
  "isPhysical": true,
  "tags": ["cement", "bulk"],
  "metaTitle": "Test Product",
  "metaDescription": "Short meta description",
  "isActive": true,
  "featured": false
}
```

Dashboard aliases that are accepted and normalized server-side:

- `code` is used to derive `slug` when `slug` is missing.
- `category` is resolved to a category record by name or slug.
- `sellPrice` maps to `price`.
- `discountedPrice` maps to `compareAtPrice`.
- `costPrice` maps to `costPerItem`.
- `stock` maps to `quantity`.
- `minStock` maps to `lowStockThreshold` for alert logic.
- `shortDesc` / `fullDesc` map to `description`.
- `featured` maps to the product featured flag.
- `tags` may be an array or a comma-separated string.

Important implementation notes:

- `price` is required after alias normalization.
- `slug` is optional when `code` or `name` is present.
- `categoryId` is optional when `category` is provided.
- `featured` is optional and defaults to `false`.
- `publication_status` is not persisted in the current live schema.
- `review_display_settings` is not persisted in the current live schema.

#### `PUT /products/:productId`

Partial update. The same aliases are accepted as in `POST /products`.

### 3.4 Reviews, Q&A, and Responses

| Method | Path                                                           | Auth | Role                 | Description                          |
| ------ | -------------------------------------------------------------- | ---: | -------------------- | ------------------------------------ |
| GET    | `/products/:productId/reviews`                                 |   No | Public               | List reviews for a product           |
| POST   | `/products/:productId/reviews`                                 |  Yes | Authenticated        | Create a review                      |
| PUT    | `/products/:productId/reviews/:reviewId`                       |  Yes | Authenticated        | Update review                        |
| DELETE | `/products/:productId/reviews/:reviewId`                       |  Yes | Authenticated        | Delete review                        |
| GET    | `/products/:productId/reviews/:reviewId`                       |   No | Public               | Get a single review                  |
| GET    | `/products/:productId/reviews/:reviewId/responses`             |   No | Public               | Get review responses                 |
| POST   | `/products/:productId/reviews/:reviewId/responses`             |  Yes | Seller or admin flow | Create review response               |
| DELETE | `/products/:productId/reviews/:reviewId/responses/:responseId` |  Yes | Authenticated        | Delete review response               |
| GET    | `/products/:productId/questions`                               |   No | Public               | Get product Q&A                      |
| POST   | `/products/:productId/questions`                               |  Yes | Authenticated        | Create question                      |
| POST   | `/products/:productId/questions/:questionId/answers`           |  Yes | Authenticated        | Answer a question                    |
| POST   | `/products/:productId/report`                                  |  Yes | Authenticated        | Report product content               |
| POST   | `/products/:productId/reviews/:reviewId/report`                |  Yes | Authenticated        | Report a review                      |
| PUT    | `/products/:productId/reviews/:reviewId/status`                |  Yes | Admin                | Approve / reject / set review status |

#### `POST /products/:productId/reviews` (Create review payload)

Request body example:

```json
{
  "orderId": "optional-order-uuid",
  "rating": 5,
  "title": "Excellent product",
  "reviewText": "High quality cement, delivered on time."
}
```

Notes:

- `rating` is required and should be an integer (1-5).
- If `orderId` is provided the system verifies the order belongs to the reviewer and that the order status is `delivered` or `completed` to mark `verified_purchase`.

### 3.5 Wishlist

| Method | Path                   | Auth | Role                   | Description                      |
| ------ | ---------------------- | ---: | ---------------------- | -------------------------------- |
| GET    | `/wishlist`            |  Yes | Any authenticated user | Get wishlist items               |
| GET    | `/wishlist/count`      |  Yes | Any authenticated user | Get wishlist count               |
| GET    | `/wishlist/:productId` |  Yes | Any authenticated user | Check if a product is wishlisted |
| POST   | `/wishlist`            |  Yes | Any authenticated user | Add product to wishlist          |
| DELETE | `/wishlist/:productId` |  Yes | Any authenticated user | Remove product from wishlist     |

Request body for `POST /wishlist`:

```json
{
  "productId": "uuid"
}
```

---

## 4) Commerce

### 4.1 Cart

| Method | Path                         | Auth | Role           | Description                  |
| ------ | ---------------------------- | ---: | -------------- | ---------------------------- |
| GET    | `/cart`                      |  Yes | Buyer/customer | Get current cart             |
| GET    | `/cart/count`                |  Yes | Buyer/customer | Get cart count               |
| POST   | `/cart`                      |  Yes | Buyer/customer | Add item to cart             |
| PATCH  | `/cart/bulk-update`          |  Yes | Buyer/customer | Bulk update cart items       |
| PUT    | `/cart/:cartItemId`          |  Yes | Buyer/customer | Set item quantity            |
| PATCH  | `/cart/:cartItemId/quantity` |  Yes | Buyer/customer | Increment/decrement quantity |
| DELETE | `/cart/:cartItemId`          |  Yes | Buyer/customer | Remove cart item             |
| DELETE | `/cart/clear/all`            |  Yes | Buyer/customer | Clear cart                   |

Use the backend cart validator for exact field names. The frontend should treat all cart writes as authenticated customer actions.

### 4.2 Orders

| Method | Path                                | Auth | Role               | Description              |
| ------ | ----------------------------------- | ---: | ------------------ | ------------------------ |
| GET    | `/orders`                           |  Yes | Authenticated user | List current user orders |
| GET    | `/orders/buyer/financial-summary`   |  Yes | Buyer              | Buyer financial summary  |
| GET    | `/orders/buyer/payment-methods`     |  Yes | Buyer              | Buyer payment methods    |
| GET    | `/orders/buyer/invoices`            |  Yes | Buyer              | List invoices            |
| GET    | `/orders/buyer/invoices/:invoiceId` |  Yes | Buyer              | Invoice details          |
| GET    | `/orders/:orderId/receipt`          |  Yes | Authenticated user | Get order receipt        |
| GET    | `/orders/:orderId`                  |  Yes | Authenticated user | Get order by ID          |
| POST   | `/orders`                           |  Yes | Authenticated user | Create order             |
| POST   | `/orders/:orderId/cancel`           |  Yes | Authenticated user | Cancel order             |
| GET    | `/orders/:orderId/tracking`         |  Yes | Authenticated user | Order tracking history   |
| POST   | `/orders/:orderId/tracking`         |  Yes | Supplier or admin  | Add tracking event       |
| GET    | `/orders/business/orders`           |  Yes | Supplier           | Business order list      |
| PUT    | `/orders/:orderId/status`           |  Yes | Supplier           | Update order status      |
| GET    | `/orders/admin/stats`               |  Yes | Admin              | Order stats              |

### 4.3 Payments

Base paths:

- `/payments`
- `/payment` (alias to the same router)

| Method | Path                                   | Auth | Role               | Description                      |
| ------ | -------------------------------------- | ---: | ------------------ | -------------------------------- |
| GET    | `/payments/config`                     |   No | Public             | Payment gateway config           |
| POST   | `/payments/webhook`                    |   No | Stripe webhook     | Stripe webhook handler           |
| GET    | `/payments`                            |  Yes | Authenticated user | List user payments               |
| GET    | `/payments/refunds`                    |  Yes | Authenticated user | List refund requests             |
| GET    | `/payments/refunds/:paymentId`         |  Yes | Authenticated user | Get refund request by payment ID |
| GET    | `/payments/:paymentId`                 |  Yes | Authenticated user | Get payment by ID                |
| POST   | `/payments/create-payment-intent`      |  Yes | Authenticated user | Create payment intent            |
| POST   | `/payments/confirm-payment`            |  Yes | Authenticated user | Confirm payment                  |
| POST   | `/payments/refund-request`             |  Yes | Authenticated user | Request refund                   |
| POST   | `/payments/test-confirm-payment`       |  Yes | Authenticated user | Test confirmation endpoint       |
| POST   | `/payments/refunds/:paymentId/approve` |  Yes | Admin              | Approve refund                   |
| POST   | `/payments/refunds/:paymentId/reject`  |  Yes | Admin              | Reject refund                    |
| GET    | `/payments/admin/stats`                |  Yes | Admin              | Payment stats                    |

Use the payment validators for exact request bodies. The most important frontend flow is `create-payment-intent` → payment provider → `confirm-payment`.

---

## 5) Communication

### 5.1 Notifications

All notification routes require authentication.

| Method | Path                                                | Auth | Role               | Description                      |
| ------ | --------------------------------------------------- | ---: | ------------------ | -------------------------------- |
| GET    | `/notifications`                                    |  Yes | Authenticated user | List notifications               |
| GET    | `/notifications/unread-count`                       |  Yes | Authenticated user | Count unread notifications       |
| GET    | `/notifications/announcements`                      |  Yes | Authenticated user | List announcements               |
| GET    | `/notifications/realtime`                           |  Yes | Authenticated user | Realtime updates payload         |
| GET    | `/notifications/stream`                             |  Yes | Authenticated user | SSE/stream endpoint              |
| GET    | `/notifications/push/config`                        |  Yes | Authenticated user | Push config                      |
| GET    | `/notifications/preferences`                        |  Yes | Authenticated user | Notification preferences         |
| PUT    | `/notifications/preferences`                        |  Yes | Authenticated user | Update preferences               |
| GET    | `/notifications/push/subscriptions`                 |  Yes | Authenticated user | Push subscriptions               |
| POST   | `/notifications/push/subscriptions`                 |  Yes | Authenticated user | Register subscription            |
| DELETE | `/notifications/push/subscriptions/:subscriptionId` |  Yes | Authenticated user | Delete subscription              |
| POST   | `/notifications/push/test`                          |  Yes | Authenticated user | Send test push                   |
| PUT    | `/notifications/mark-as-read`                       |  Yes | Authenticated user | Mark one notification as read    |
| PUT    | `/notifications/mark-all-as-read`                   |  Yes | Authenticated user | Mark all notifications as read   |
| GET    | `/notifications/failed`                             |  Yes | Admin              | Failed notifications             |
| GET    | `/notifications/delivery-stats`                     |  Yes | Admin              | Delivery stats                   |
| POST   | `/notifications/retry-failed`                       |  Yes | Admin              | Retry failed notifications       |
| POST   | `/notifications/:notificationId/retry`              |  Yes | Admin              | Retry one notification           |
| DELETE | `/notifications/:notificationId`                    |  Yes | Authenticated user | Delete notification              |
| POST   | `/notifications/create-for-customer`                |  Yes | Supplier           | Create notification for customer |
| POST   | `/notifications/send-email`                         |  Yes | Admin              | Send email notification          |
| POST   | `/notifications/create`                             |  Yes | Admin              | Create notification              |
| POST   | `/notifications/send-order-confirmation`            |  Yes | Authenticated user | Send order confirmation          |

### 5.2 Contact Messages and Support Tickets

#### Contact submissions

| Method | Path                                 | Auth | Role   | Description                           |
| ------ | ------------------------------------ | ---: | ------ | ------------------------------------- |
| POST   | `/contact`                           |   No | Public | Submit contact form                   |
| POST   | `/contact/contact`                   |   No | Public | Alias for contact submission          |
| GET    | `/contact`                           |  Yes | Admin  | List contact submissions              |
| GET    | `/contact/contact`                   |  Yes | Admin  | Alias for listing contact submissions |
| PUT    | `/contact/:messageId/status`         |  Yes | Admin  | Update contact status                 |
| PUT    | `/contact/contact/:messageId/status` |  Yes | Admin  | Alias for update status               |
| GET    | `/contact/stats`                     |  Yes | Admin  | Contact stats                         |

#### Support tickets

| Method | Path                              | Auth | Role               | Description               |
| ------ | --------------------------------- | ---: | ------------------ | ------------------------- |
| POST   | `/tickets`                        |  Yes | Authenticated user | Create support ticket     |
| GET    | `/tickets`                        |  Yes | Authenticated user | List current user tickets |
| GET    | `/tickets/:ticketId`              |  Yes | Authenticated user | Ticket details            |
| POST   | `/tickets/:ticketId/messages`     |  Yes | Authenticated user | Add ticket message        |
| PUT    | `/tickets/:ticketId/close`        |  Yes | Authenticated user | Close ticket              |
| GET    | `/admin/tickets`                  |  Yes | Admin              | List all tickets          |
| GET    | `/admin/tickets/stats`            |  Yes | Admin              | Ticket stats              |
| PUT    | `/admin/tickets/:ticketId/status` |  Yes | Admin              | Update ticket status      |
| PUT    | `/admin/tickets/:ticketId/assign` |  Yes | Admin              | Assign ticket             |

`POST /tickets/:ticketId/messages` supports `multipart/form-data` attachments; the backend accepts one optional `attachment` file field.

#### Ticket create payload

```json
{
  "subject": "Order payment issue",
  "description": "My payment succeeded but the order is still pending.",
  "category": "billing",
  "priority": "high"
}
```

### 5.3 Chat

All chat routes require authentication.

| Method | Path                                           | Auth | Role               | Description               |
| ------ | ---------------------------------------------- | ---: | ------------------ | ------------------------- |
| GET    | `/chat`                                        |  Yes | Authenticated user | List conversations        |
| GET    | `/chat/unread-count`                           |  Yes | Authenticated user | Unread count              |
| GET    | `/chat/search`                                 |  Yes | Authenticated user | Search messages           |
| POST   | `/chat/conversations`                          |  Yes | Authenticated user | Create conversation       |
| GET    | `/chat/conversations/:conversationId/messages` |  Yes | Authenticated user | Conversation messages     |
| POST   | `/chat/conversations/:conversationId/messages` |  Yes | Authenticated user | Send message              |
| PUT    | `/chat/messages/:messageId/read`               |  Yes | Authenticated user | Mark message as read      |
| PUT    | `/chat/conversations/:conversationId/read`     |  Yes | Authenticated user | Mark conversation as read |

`POST /chat/conversations` requires:

```json
{
  "participantId": "uuid"
}
```

`POST /chat/conversations/:conversationId/messages` accepts either `messageText` or an `attachment.url`.

---

## 6) Service Marketplace

The service marketplace uses JWT-based auth via the module-local `authenticateToken` and role authorizers.

### 6.1 Services

| Method | Path                                      | Auth | Role                     | Description                                       |
| ------ | ----------------------------------------- | ---: | ------------------------ | ------------------------------------------------- |
| GET    | `/services`                               |  Yes | Authenticated (optional) | List services (route applies `authenticateToken`) |
| GET    | `/services/my/services`                   |  Yes | Contractor / Supplier    | My services                                       |
| GET    | `/services/:id/contractor-profile`        |   No | Public                   | Service + contractor profile + portfolio summary  |
| GET    | `/services/:id`                           |   No | Public                   | Service by ID                                     |
| POST   | `/services/:id/order`                     |  Yes | Buyer                    | Create a project order from a service             |
| POST   | `/services`                               |  Yes | Contractor               | Create service                                    |
| PUT    | `/services/:id`                           |  Yes | Contractor               | Update service                                    |
| POST   | `/services/:id/submit`                    |  Yes | Contractor               | Submit service for admin review                   |
| POST   | `/services/:id/approve`                   |  Yes | Admin                    | Approve service (admin)                           |
| POST   | `/services/:id/reject`                    |  Yes | Admin                    | Reject service (admin)                            |
| POST   | `/services/:id/deactivate`                |  Yes | Contractor               | Deactivate service                                |
| POST   | `/services/:id/reactivate`                |  Yes | Contractor               | Reactivate service                                |
| POST   | `/services/:id/draft`                     |  Yes | Contractor               | Deprecated: mark draft (legacy)                   |
| POST   | `/services/:id/publish`                   |  Yes | Contractor               | Deprecated: publish (legacy)                      |
| PATCH  | `/services/:id/status`                    |  Yes | Contractor               | Toggle active/inactive (legacy)                   |
| DELETE | `/services/:id`                           |  Yes | Contractor               | Delete service                                    |
| GET    | `/services/:id/subscriptions`             |  Yes | Buyer/Contractor/Admin   | List subscriptions                                |
| POST   | `/services/:id/subscriptions`             |  Yes | Buyer/Contractor/Admin   | Create subscription                               |
| DELETE | `/services/subscriptions/:subscriptionId` |  Yes | Buyer/Contractor/Admin   | Cancel subscription                               |

`POST /services/:id/order` accepts:

```json
{
  "title": "Kitchen renovation service order",
  "description": "Need complete kitchen renovation with timeline and milestones",
  "budget": 120000,
  "startDate": "2026-05-10",
  "deadline": "2026-06-15",
  "milestones": [
    { "name": "Site visit and estimate", "dueDate": "2026-05-12" },
    { "name": "Material procurement", "dueDate": "2026-05-20" }
  ]
}
```

If `title`, `description`, or `budget` are omitted, backend falls back to service defaults where possible.

### 6.2 Projects

All project routes require authentication.

| Method | Path                                           | Auth | Role                       | Description                      |
| ------ | ---------------------------------------------- | ---: | -------------------------- | -------------------------------- |
| GET    | `/projects`                                    |  Yes | Contractor / Buyer / Admin | List projects                    |
| GET    | `/projects/available`                          |  Yes | Contractor / Admin         | Available projects (contractors) |
| GET    | `/projects/:id`                                |  Yes | Contractor / Buyer / Admin | Project details                  |
| POST   | `/projects`                                    |  Yes | Buyer                      | Create project                   |
| PUT    | `/projects/:id`                                |  Yes | Contractor / Buyer         | Update project                   |
| POST   | `/projects/:projectId/milestones`              |  Yes | Contractor/Buyer           | Create milestone                 |
| PUT    | `/projects/:projectId/milestones/:milestoneId` |  Yes | Contractor/Buyer           | Update milestone                 |

### 6.3 Proposals

| Method | Path                      | Auth | Role               | Description            |
| ------ | ------------------------- | ---: | ------------------ | ---------------------- |
| GET    | `/proposals`              |  Yes | Contractor / Buyer | List proposals         |
| POST   | `/proposals`              |  Yes | Contractor         | Create proposal        |
| PUT    | `/proposals/:id/status`   |  Yes | Buyer              | Update proposal status |
| PUT    | `/proposals/:id/withdraw` |  Yes | Contractor         | Withdraw proposal      |

### 6.4 Portfolio

| Method | Path                       | Auth | Role       | Description           |
| ------ | -------------------------- | ---: | ---------- | --------------------- |
| GET    | `/portfolio/my/items`      |  Yes | Contractor | My portfolio items    |
| GET    | `/portfolio/:contractorId` |   No | Public     | Contractor portfolio  |
| POST   | `/portfolio`               |  Yes | Contractor | Add portfolio item    |
| PUT    | `/portfolio/:id`           |  Yes | Contractor | Update portfolio item |
| DELETE | `/portfolio/:id`           |  Yes | Contractor | Delete portfolio item |

### 6.5 Service Reviews

| Method | Path                                | Auth | Role       | Description              |
| ------ | ----------------------------------- | ---: | ---------- | ------------------------ |
| GET    | `/reviews/service/:serviceId`       |   No | Public     | Reviews for a service    |
| GET    | `/reviews/contractor/:contractorId` |   No | Public     | Reviews for a contractor |
| POST   | `/reviews`                          |  Yes | Buyer      | Create review            |
| PUT    | `/reviews/:id/response`             |  Yes | Contractor | Add response to review   |

### 6.6 Disputes

| Method | Path            | Auth | Role                          | Description    |
| ------ | --------------- | ---: | ----------------------------- | -------------- |
| GET    | `/disputes`     |  Yes | Contractor / Buyer / Admin    | List disputes  |
| POST   | `/disputes`     |  Yes | Contractor / Buyer            | Create dispute |
| PUT    | `/disputes/:id` |  Yes | Admin / Supplier / Contractor | Update dispute |

---

## 7) Operations & Platform Admin

### Endpoint Summary

| Method | Path                                          |     Auth | Role                   | Description                                            |
| ------ | --------------------------------------------- | -------: | ---------------------- | ------------------------------------------------------ |
| GET    | `/`                                           |       No | Public                 | Returns a quick list of available operations endpoints |
| GET    | `/search/featured`                            |       No | Public                 | Featured content                                       |
| GET    | `/search/history`                             |      Yes | Authenticated user     | Search history                                         |
| GET    | `/search`                                     | Optional | Public / authenticated | Unified search                                         |
| GET    | `/analytics`                                  |      Yes | Authenticated user     | Dashboard analytics                                    |
| GET    | `/analytics/buyer-behavior`                   |      Yes | Authenticated user     | Buyer behavior analytics                               |
| GET    | `/analytics/ai-usage`                         |      Yes | Authenticated user     | AI usage analytics                                     |
| GET    | `/analytics/export`                           |      Yes | Authenticated user     | Export analytics                                       |
| POST   | `/analytics/events`                           |      Yes | Authenticated user     | Track analytics event                                  |
| POST   | `/analytics/ai-usage`                         |      Yes | Authenticated user     | Track AI usage                                         |
| GET    | `/inventory/alerts`                           |      Yes | Supplier / admin       | Inventory alerts                                       |
| POST   | `/broadcast`                                  |      Yes | Admin                  | Broadcast announcement                                 |
| GET    | `/admin/users`                                |      Yes | Admin                  | Admin user list                                        |
| PUT    | `/admin/users/:userId`                        |      Yes | Admin                  | Update admin-managed user                              |
| GET    | `/admin/users/:userId/transactions`           |      Yes | Admin                  | User transaction history                               |
| POST   | `/admin/businesses/:businessId/approve`       |      Yes | Admin                  | Approve business                                       |
| POST   | `/admin/businesses/:businessId/reject`        |      Yes | Admin                  | Reject business                                        |
| GET    | `/admin/sellers/analytics`                    |      Yes | Admin                  | Seller analytics                                       |
| POST   | `/admin/compliance-notices`                   |      Yes | Admin                  | Create compliance notice                               |
| GET    | `/admin/reports`                              |      Yes | Admin                  | Content reports                                        |
| PUT    | `/admin/reports/:reportId/status`             |      Yes | Admin                  | Update report status                                   |
| GET    | `/admin/violations`                           |      Yes | Admin                  | Policy violations                                      |
| POST   | `/admin/violations`                           |      Yes | Admin                  | Create policy violation                                |
| PUT    | `/seller/violations/:violationId/acknowledge` |      Yes | Supplier               | Acknowledge violation                                  |
| PUT    | `/seller/violations/:violationId/appeal`      |      Yes | Supplier               | Appeal violation                                       |
| GET    | `/seller/compliance-status`                   |      Yes | Supplier               | Seller compliance status                               |
| POST   | `/refunds/request`                            |      Yes | Authenticated user     | Request refund                                         |
| GET    | `/refunds`                                    |      Yes | Authenticated user     | List refund requests                                   |
| GET    | `/refunds/:paymentId`                         |      Yes | Authenticated user     | Refund request by payment ID                           |
| POST   | `/refunds/:paymentId/approve`                 |      Yes | Admin                  | Approve refund                                         |
| POST   | `/refunds/:paymentId/reject`                  |      Yes | Admin                  | Reject refund                                          |

### Search

`GET /search` accepts query parameters validated by the backend search validator. If no token is supplied, the route still works with `optionalAuth` and returns public search results.

### Analytics and export

The analytics routes are user-context aware and generally return aggregates tailored to the authenticated role.

### Broadcast and compliance

Broadcast, report moderation, violations, and compliance routes are admin or supplier-only as shown in the table above.

---

## 8) Frontend Integration Notes

These are the important compatibility rules for the frontend:

1. Use the `accessToken` from `POST /auth/login` for all authenticated requests.
2. Treat `GET /products` as a wrapped response and read `data.products`.
3. For product creation/update, the backend accepts these aliases:
   - `code` → derives `slug`
   - `category` → resolves `categoryId`
   - `sellPrice` → `price`
   - `discountedPrice` → `compareAtPrice`
   - `costPrice` → `costPerItem`
   - `stock` → `quantity`
   - `minStock` → `lowStockThreshold`
   - `shortDesc` / `fullDesc` → `description`
   - `featured` → featured flag
   - `tags` → array or comma-separated string
4. Keep `price` present after normalization. That is the required numeric field for product creation.
5. Do not depend on `publication_status` or `review_display_settings` being written to the live database; those are not persisted in the current schema.
6. `GET /auth/me` returns the session user and, for suppliers, a `store` object when an approved business exists.
7. `POST /payments/webhook` and `GET /payments/config` are public, but the rest of `/payments` is authenticated.
8. `/payments` and `/payment` are both mounted to the same payment router.
9. `/contact` and `/contact/contact` both exist; use `/contact` in new frontend code.
10. The frontend should handle `404` and `403` on resource ownership routes by showing user-friendly messages rather than treating them as app crashes.

## 9) Example Frontend Workflows

### Login flow

1. Call `POST /auth/login`.
2. Save `accessToken` and `refreshToken`.
3. Call `GET /auth/me` on app load to restore session state.

### Product list flow

1. Call `GET /products`.
2. Read `data.products`.
3. Map `price`, `quantity`, and category fields into the dashboard product model.

### Product create flow

1. Build the dashboard form payload.
2. Send it to `POST /products`.
3. If you already have canonical fields, use them directly. If not, the backend will normalize aliases.
4. Expect `201 Created` on success.

### Checkout flow

1. Use `POST /payments/create-payment-intent`.
2. Confirm the payment using `POST /payments/confirm-payment`.
3. Read the payment/order state from `GET /orders/:orderId` or `GET /payments/:paymentId`.

## 10) Notes for Maintainability

- Prefer the canonical backend field names for new frontend code when possible.
- Preserve route aliases only where the frontend already depends on them.
- If you add new endpoints, update this document in the same change.
- If the live database schema changes, update the product write notes here as well.
