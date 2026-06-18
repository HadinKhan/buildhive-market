# BuildHive Market - AI Integrations & Services

This document details the AI architecture. The marketplace connects directly from the browser frontend client to an independent AI backend, bypassing the main database backend.

---

## AI Backend Overview

* **Base URL:** `https://ai-backend-b3yd.onrender.com`
* **Developer:** Hamad (deployed independently on Render).
* **Integration Architecture:** The React app utilizes native `fetch` requests inside `aiService.ts` to connect directly to the Render service. This bypasses the main Node/Express API to prevent processing delays and isolate AI computation.

---

## EVERY AI ENDPOINT USED

The following sections catalogue all active AI endpoints, including payloads, responses, and UI renders.

### 1. Cost Estimation (`POST /estimate-cost`)
* **Purpose:** Calculates residential home building costs based on geographical, quality, and architectural parameters.
* **Called by:** [CostEstimatorPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/CostEstimatorPage.tsx).
* **Request Payload:**
  ```json
  {
    "sqft": 1125,
    "floors": 2,
    "quality": "Standard",
    "city": "Lahore",
    "bhk": 3,
    "bedrooms": 3,
    "washrooms": 2,
    "kitchens": 1,
    "area": "5 Marla",
    "project_type": "residential",
    "use_llm": false
  }
  ```
* **Response Shape:**
  ```json
  {
    "total_estimated_cost": 4500000,
    "cost_range": "Rs. 4,200,000 - Rs. 4,800,000",
    "cost_per_sqft": 4000,
    "material_cost": 2700000,
    "labor_cost": 1800000,
    "breakdown": [
      { "label": "Cement", "percentage": 18, "amount": 810000 },
      { "label": "Steel", "percentage": 22, "amount": 990000 },
      { "label": "Bricks", "percentage": 15, "amount": 675000 }
    ],
    "duration_months": 8
  }
  ```
* **What is Renders:** Displays cost range labels, labor vs. material splits, cost metrics, and interactive progress bars for construction materials.

### 2. Quality Cost Comparisons (`GET /estimate-cost/compare`)
* **Purpose:** Retrieves price comparison metrics across different quality tiers.
* **Called by:** [CostEstimatorPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/CostEstimatorPage.tsx).
* **Request URL Format:** `GET /estimate-cost/compare?sqft=1125&floors=2&city=Lahore`
* **Response Shape:**
  ```json
  [
    { "tier": "Economy", "rate": 3200, "total": 3600000 },
    { "tier": "Standard", "rate": 4000, "total": 4500000 },
    { "tier": "Premium", "rate": 5500, "total": 6187500 }
  ]
  ```
* **What it Renders:** Renders a comparison table detailing cost projections and rate changes across Economy, Standard, and Premium tiers.

### 3. Construction Milestones Phases (`GET /phases`)
* **Purpose:** Retrieves the timeline of construction phases.
* **Called by:** [CostEstimatorPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/CostEstimatorPage.tsx).
* **Response Shape:**
  ```json
  [
    { "id": 1, "name": "Excavation & Layout", "duration": "2 weeks" },
    { "id": 2, "name": "Foundation & Plinth", "duration": "4 weeks" }
  ]
  ```
* **What it Renders:** Populates the schedule list showing estimated milestones.

### 4. Phase Material Recommendations (`POST /recommend`)
* **Purpose:** Suggests matching catalog materials for specific construction descriptions.
* **Called by:** [RecommendationsPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/RecommendationsPage.tsx).
* **Request Payload:**
  ```json
  {
    "text": "grey structure plastering",
    "city": "Lahore",
    "quality": "Standard",
    "area": "5 Marla",
    "budget": null,
    "finishing_tier": "standard",
    "top_n_per_cat": 8,
    "use_llm": true
  }
  ```
* **Response Shape:**
  ```json
  [
    {
      "id": "prod_11",
      "name": "Maple Leaf Cement",
      "price": 1550,
      "relevance_score": 0.96,
      "reason": "Highly matching material for plastering plastering grey structures."
    }
  ]
  ```
* **What it Renders:** Lists matching materials ranked by relevance percentages with direct add-to-cart buttons.

### 5. Semantic Product Search (`GET /search`)
* **Purpose:** Semantic matcher matching conversational descriptions to products.
* **Called by:** [ProductsPage.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/pages/ProductsPage.tsx).
* **Request URL Format:** `GET /search?q=waterproof%20cement%20for%20basement&limit=10`
* **Response Shape:**
  ```json
  [
    {
      "id": "prod_45",
      "name": "Sika Waterproofing Compound",
      "price": 2800,
      "confidence": 0.94
    }
  ]
  ```
* **What it Renders:** Displays matched items in the product directory grid.

### 6. Conversational Chat Assistant (`POST /chat`)
* **Purpose:** Handles the conversational interface for the floating chat widget.
* **Called by:** [AIChatWidget.tsx](file:///E:/2025/FYP/FYP%20V2/buildhive-market/components/AIChatWidget.tsx).
* **Request Payload:**
  ```json
  {
    "query": "How many cement bags do I need for 5 marla gray structure?",
    "user_role": "buyer",
    "conversation_id": "conv_2234",
    "use_llm": true
  }
  ```
* **Response Shape:**
  ```json
  {
    "answer": "For a standard 5 marla double-story grey structure, you will require approximately 1,200 bags of cement.",
    "suggested_follow_ups": [
      "Calculate total cost",
      "Compare cement brands"
    ],
    "response_id": "res_8891"
  }
  ```
* **What it Renders:** Displays the conversational response bubbles and follow-up suggestion chips.

---

## AI Chatbot Widget

* **Global Mount:** The floating chat widget is rendered in the root layout in `App.tsx` and is available across all pages.
* **Thread State Management:**
  - Active messages are stored in local state (`messages`).
  - Tracks `conversationId` across requests to maintain chat history on the LLM server.
* **Follow-up Chips:** Clicking a suggestion chip submits the text query, enabling quick interactions without typing.

---

## AI Search on Products Page

* **How it Differs:**
  - **Regular Search:** Uses simple SQL string matching (`LIKE %query%`) against names and categories.
  - **AI Semantic Search:** Uses vector embeddings to match conversational queries (e.g., "moisture prevention blocks") to conceptually similar products even if the exact keyword is missing.
* **UI Trigger:** Users toggle the "Ask AI Matcher" checkbox, shifting the search input into semantic mode.
* **The AI Match Badge:** Items matched via semantic queries display a purple **AI Match** badge detailing the relevance score.

---

## Offline Fallback

If the AI backend is unreachable, the client catches the connection exception and applies local fallbacks:
* **Chat Widget:** Renders a warning message: `"The AI assistant is temporarily offline. Please try again in a few moments."`
* **Cost Estimator:** Falls back to manual calculations based on hardcoded rates for Pakistani cities.
* **Default Phases List:** If `GET /phases` fails, it loads a hardcoded list of standard Pakistani construction phases.
  ```typescript
  const defaultPhases = [
    { name: "Structure & Masonry", description: "Foundations, walls, and slabs" },
    { name: "Plumbing & Electrical", description: "Piping, wiring, and utilities" },
    { name: "Finishing & Plaster", description: "Plastering, painting, and tiling" }
  ];
  ```
