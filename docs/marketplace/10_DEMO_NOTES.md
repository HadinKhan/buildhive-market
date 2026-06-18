# Presentation Day Guide - BuildHive Market

This document serves as a guide for presenting the BuildHive public marketplace and buyer portal (running on port `5173`).

---

## 1. Demo Accounts Grid

Ensure these test accounts are configured in the database before starting the demonstration:

| Role | Mapped Role | Test Email | Test Password | Redirection / Onboarding Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Buyer** | `buyer` | `buyer@buildhive.com` | `password123` | **Buyer Marketplace Hub**: Logs in on port `5173` and remains in the marketplace at `/account`. |
| **Admin** | `admin` | `admin@buildhive.com` | `admin123` | **Redirection Guard**: Instantly redirected to the admin panel on port `5000`. |
| **Seller** | `seller` | `seller@buildhive.com` | `password123` | **Redirection Guard**: Instantly redirected to the seller console on port `5000`. |
| **Contractor** | `provider` | `contractor@buildhive.com` | `password123` | **Redirection Guard**: Instantly redirected to the contractor dashboard on port `5000`. |

---

## 2. Pre-Demo Diagnostics Checklist

Perform these verification checks 15 minutes before the presentation:

1. **Start the Express Backend:** Verify the main Node/Express backend is running on port `3000`.
2. **Ping the AI Backend:** Test that the AI service on Render (`https://ai-backend-b3yd.onrender.com`) is responsive by opening the cost estimator page and running a test calculation to wake up the service.
3. **Verify the Frontend Port:** Ensure the marketplace app is running on `http://localhost:5173`.
4. **Verify the Dashboard Port:** Ensure the dashboard app is running on `http://localhost:5000` (handles admin, seller, and contractor dashboards).
5. **Clear Browser Storage:** Clear cookies and local storage or use an incognito window to prevent stale session conflicts.

---

## 3. Homepage Demo Talking Points

Use these talking points when presenting the landing page:
* **Featured Materials Grid:** *"BuildHive aggregates physical materials from approved local vendors, providing builders with real-time pricing and stock information."*
* **Featured Services Grid:** *"Our services section lists contractor-developed packages, allowing buyers to book services with pre-negotiated deliverables and tiers."*
* **Featured Contractors Board:** *"We showcase local contractors, highlighting user reviews, city location, and Daily labor rates."*
* **AI Cost Estimator CTA:** *"We provide an AI Cost Estimator that calculates residential construction costs based on Pakistan market rates."*
* **AI Chat Widget:** *"Our floating AI Assistant is available on all pages to answer construction-related questions and provide material recommendations."*

---

## 4. Page-by-Page Demo Script

### 1. Landing Page
* **URL:** `http://localhost:5173/`
* **What to click:** Scroll down to the featured sections and click the AI chat widget.
* **What to say:** *"This is the public portal. Unauthenticated guests can browse the catalog, view contractor profiles, and use our AI tools."*
* **What to highlight:** Renders featured cards and smooth scrolling reveal animations.

### 2. Products Catalog
* **URL:** `http://localhost:5173/products`
* **What to click:** Toggle category checkboxes, select two products for comparison, and open the comparison drawer.
* **What to say:** *"Buyers can filter products by price, category, and brand. The comparison drawer allows users to compare technical specifications side-by-side."*
* **What to highlight:** Side-by-side specification comparison table.

### 3. Product Details Page
* **URL:** `http://localhost:5173/product-detail/:id`
* **What to click:** Toggle the specs, reviews, and project stages timeline tabs.
* **What to say:** *"The details page displays product images, stock status, answered questions, and product delivery timelines."*
* **What to highlight:** Interactive project stages timeline.

### 4. Services Catalog
* **URL:** `http://localhost:5173/services`
* **What to click:** Select cities from the location dropdown (e.g. Lahore, Karachi).
* **What to say:** *"The directory lists local service providers. Buyers can filter listings by location, contractor trade, and budget."*

### 5. Service Details Page
* **URL:** `http://localhost:5173/services/:id`
* **What to click:** Switch between Silver, Gold, and Platinum package tiers.
* **What to say:** *"Each service listing defines deliverables across pricing tiers, ensuring transparency in project scope."*

### 6. Contractor Profile Page
* **URL:** `http://localhost:5173/contractors/:id`
* **What to click:** Browse the portfolio tab and click "Hire Me" to view the booking form.
* **What to say:** *"Contractor profiles aggregate ratings, portfolio galleries, and reviews. Buyers can hire them directly by submitting project scopes."*

---

## 5. Buyer Purchase Demo Flow

1. Open `http://localhost:5173/signin` and log in as `buyer@buildhive.com`.
2. Navigate to the products catalog (`/products`).
3. Click "Add to Cart" on a material (e.g. cement).
4. Click the cart icon in the header to open `/cart`. Adjust quantities and click "Proceed to Checkout".
5. On the `/checkout` page:
   - Select a saved delivery address.
   - Choose **Card Payment** (uses test card `4242 4242 4242 4242`).
   - Enter card details in the Stripe modal and click "Pay".
6. Verify redirect to the `/order-confirmation/:id` screen.
7. Navigate to `/account` and select the **Orders** tab to show the pending order status and download the PDF invoice.

---

## 6. AI Cost Estimation Demo Flow

1. Navigate to `/cost-estimator`.
2. Input project details: **5 Marla**, **Lahore**, **Standard Quality**, **2 Floors**.
3. Click **Calculate**.
4. Show the cost breakdown range (PKR), labor vs. material splits, and the comparison table.
5. Click **View Recommended Products** to transition to `/recommendations` and view matching materials suggested by the AI.

---

## 7. 20 Panel Questions & Answers

### Q1: How does the AI Cost Estimator work?
> **Answer:** *"The estimator uses regression models trained on regional construction datasets, processing factors like area size, floor count, location, and quality tier to estimate project costs."*

### Q2: Where does the construction pricing data come from?
> **Answer:** *"Pricing data is sourced from real-time seller listings and periodically updated Pakistani construction market index sheets."*

### Q3: How accurate is the AI estimator?
> **Answer:** *"It provides estimates within a 5-10% variance of actual market rates, serving as a budget planning tool. Final costs vary based on site conditions and brand selections."*

### Q4: How does the AI recommendation system work?
> **Answer:** *"The system takes natural-language descriptions of project phases (e.g., 'grey structure plastering'), generates semantic vector embeddings, and matches them to relevant catalog products."*

### Q5: How does Stripe process payments in Pakistan?
> **Answer:** *"For the demonstration, we process payments in PKR by setting the currency code to `pkr` in the Stripe API payload. In a production environment, transactions would route through an authorized Stripe merchant account."*

### Q6: Why is the cart state managed in App.tsx?
> **Answer:** *"It ensures the cart count badge in the header updates reactively across pages without requiring a complex state management library."*

### Q7: How does guest browsing work?
> **Answer:** *"Guests have read-only access to browse products, services, and contractor profiles. They are prompted to log in only when initiating a transaction, such as checking out or booking a service."*

### Q8: How does the contractor hiring flow work?
> **Answer:** *"A buyer submits a project proposal to a contractor. The contractor reviews the details and bids on the job. Once the buyer accepts a bid, the project moves to 'In Progress' and billing milestones are tracked."*

### Q9: How do service orders differ from product orders?
> **Answer:** *"Product orders involve physical goods shipped by sellers. Service orders represent contracts with defined deliverables, pricing tiers, and completion schedules."*

### Q10: How is the marketplace different from the dashboard?
> **Answer:** *"The marketplace is the public storefront for buyers and guests. The dashboard is the restricted portal on port 5000 for admins, sellers, and contractors."*

### Q11: Why was the frontend built using React instead of Next.js?
> **Answer:** *"Vite with React provides a lightweight, performant single-page application structure. This fits our modular architecture where the buyer portal and dashboard are deployed independently."*

### Q12: How does image fallback work?
> **Answer:** *"We use an `onError` listener on the image tag. If an image path is broken or missing, the handler automatically swaps the source with `src/assets/productsplaceholder.png`."*

### Q13: How does the search work (AI vs. regular)?
> **Answer:** *"Regular search uses exact keyword string matching against product names. AI search uses semantic vector matching to identify conceptually similar products from natural-language descriptions."*

### Q14: How does checkout handle orders with multiple sellers?
> **Answer:** *"The buyer checks out once. The backend API groups items by seller, creates separate sub-orders for each supplier, and returns them as a combined package."*

### Q15: What happens if a card payment fails?
> **Answer:** *"The Stripe SDK catches the error (e.g., insufficient funds), displays the warning message in the card form modal, and keeps the checkout session active so the user can try again."*

### Q16: How are product reviews verified?
> **Answer:** *"The review submission endpoint checks the user's purchase history. Users can submit reviews and ratings only for items they have purchased."*

### Q17: How does real-time messaging work?
> **Answer:** *"The messaging client polls the chat endpoints on an 8-second cycle to retrieve conversation updates, keeping conversations synced without the complexity of WebSocket connections."*

### Q18: How does the notification system work?
> **Answer:** *"Notifications are generated by backend triggers during key events (e.g., order status updates) and retrieved by the client via HTTP polling."*

### Q19: What is the tech stack and why?
> **Answer:** *"We use React for the frontend, Node/Express for the main backend, PostgreSQL (via Supabase) for data storage, and Python for the AI service. This stack provides a balance of development speed, type safety, and modularity."*

### Q20: What features would you add next?
> **Answer:** *"We would implement WebSockets for instant messaging updates, add support for automated contractor milestone payouts, and expand the AI engine to generate detailed materials quantity takeoffs."*

---

## 8. Known Issues to Avoid

* **Double Scrollbar on Homepage:** Avoid vertical resizing on the homepage, as the overflow setting in `homePageStyles.ts` can trigger a nested scrollbar under certain layout configurations.
* **Cart Endpoint Inconsistency:** Do not manually edit endpoints, as the database uses specific structures to sync local carts.
* **Address Proliferation:** Avoid clicking the checkout button repeatedly, as a new address record is created on every submission.
* **Service Checkout Cart Wipe:** Inform the panel that the cart is cleared after checkout. Avoid having unrelated items in the cart during a service checkout demo.
* **Render AI Backend Cold Start:** Open the cost estimator and run a test calculation before the presentation to wake up the Render service.

---

## 9. Contingency Talking Points

### If the Backend is Unreachable:
> *"The frontend is configured with cache handlers that display cached information and fallback to local mock data if the API is offline."*

### If the AI Backend is Slow or Offline:
> *"The cost estimator falls back to calculated rates based on city averages. The assistant remains active in offline mode to provide preset answers."*

### If a Test Payment Fails:
> *"This indicates a Stripe test gateway timeout. The checkout session remains active, allowing us to resubmit the transaction."*

### If the Products Catalog is Empty:
> *"The system is filtering for approved listings. We can log in as an Admin on port 5000 to approve new products and update the catalog."*
