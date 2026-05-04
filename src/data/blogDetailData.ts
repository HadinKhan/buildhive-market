export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "image"; src: string; caption?: string }
  | { type: "list"; items: string[] }
  | { type: "tip"; title?: string; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface BlogPostDetail {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  views: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    initials: string;
    tone: "blue" | "purple" | "green" | "orange";
  };
  content: ContentBlock[];
}

export interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

const posts: Record<string, BlogPostDetail> = {
  "post-1": {
    id: "post-1",
    title: "How to Choose the Right Cement Grade for Your Construction Project",
    excerpt:
      "Understanding cement grades is crucial for structural integrity. This guide breaks down OPC, PPC, and SRC grades with practical recommendations for residential, commercial, and infrastructure projects across Pakistan.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=600&fit=crop",
    category: "Buying Guides",
    date: "April 28, 2025",
    readTime: "8 min read",
    views: "3.2K",
    tags: ["Cement", "Buying Guide", "Materials", "OPC", "PPC", "SRC"],
    author: {
      name: "Muhammad Hadin Khan",
      role: "Research Analyst",
      initials: "MH",
      tone: "blue",
    },
    content: [
      {
        type: "paragraph",
        text: "Cement is the backbone of every construction project in Pakistan. Whether you are building a small home in Lahore or a high-rise in Karachi, selecting the correct cement grade directly impacts the strength, durability, and longevity of your structure. Yet, many builders and homeowners remain confused about the differences between OPC, PPC, and SRC grades.",
      },
      {
        type: "paragraph",
        text: "In this comprehensive guide, we break down each cement type, explain the PSQCA standards, and provide actionable recommendations based on project type, environmental exposure, and budget constraints.",
      },
      { type: "heading", text: "Understanding Cement Grades in Pakistan" },
      {
        type: "paragraph",
        text: "Pakistan follows the Pakistan Standards Quality Control Authority (PSQCA) specifications, which align closely with ASTM and BS standards. The most commonly available grades are OPC 33, OPC 43, OPC 53, PPC (Blended), and SRC (Sulphate Resistant Cement).",
      },
      { type: "subheading", text: "Ordinary Portland Cement (OPC)" },
      {
        type: "paragraph",
        text: "OPC is the most widely used cement type in Pakistan. It offers high early strength and is ideal for projects requiring rapid construction schedules. OPC 53 is preferred for high-strength concrete, precast elements, and bridges.",
      },
      {
        type: "tip",
        title: "When to Use OPC 53",
        text: "Use OPC 53 for RCC structures, high-rise buildings, and precast concrete where early formwork removal is needed. It achieves 27 MPa in just 3 days.",
      },
      { type: "subheading", text: "Portland Pozzolana Cement (PPC)" },
      {
        type: "paragraph",
        text: "PPC contains fly ash or volcanic ash, making it more environmentally friendly and resistant to chemical attacks. It generates less heat of hydration, reducing thermal cracking in mass concrete pours.",
      },
      {
        type: "table",
        headers: ["Property", "OPC 53", "PPC", "SRC"],
        rows: [
          ["Early Strength", "Very High", "Moderate", "Moderate"],
          ["Heat of Hydration", "High", "Low", "Low"],
          ["Sulphate Resistance", "Poor", "Good", "Excellent"],
          ["Best For", "High-rise, RCC", "Dams, Mass Concrete", "Coastal, Sewage"],
          ["Price (per bag)", "Rs. 1,350", "Rs. 1,280", "Rs. 1,450"],
        ],
      },
      { type: "heading", text: "Regional Climate Considerations" },
      {
        type: "paragraph",
        text: "Pakistan's diverse climate zones demand careful cement selection. In coastal areas like Karachi and Gwadar, sulphate attack from saline groundwater is a major concern. SRC or PPC with high fly ash content is strongly recommended here.",
      },
      {
        type: "paragraph",
        text: "In northern regions with freeze-thaw cycles, air-entrained concrete using OPC 43 or PPC provides better durability. Always consult a structural engineer for projects in seismic zones.",
      },
      { type: "heading", text: "Practical Buying Checklist" },
      {
        type: "list",
        items: [
          "Verify PSQCA certification mark on every bag",
          "Check manufacturing date because cement loses strength after extended storage",
          "Store cement on raised pallets in a dry, ventilated area",
          "Buy from authorized dealers to avoid counterfeit products",
          "Request test certificates for bulk orders above 500 bags",
        ],
      },
      {
        type: "paragraph",
        text: "By following these guidelines, you can ensure your construction project stands the test of time while optimizing material costs effectively.",
      },
    ],
  },
  "post-2": {
    id: "post-2",
    title: "AI-Powered Cost Estimation: Reducing Budget Overruns by 30%",
    excerpt:
      "Learn how BuildHive's AI cost estimation tool analyzes market data, material prices, and labor costs to provide accurate project budgets that help contractors avoid costly overruns.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop",
    category: "Technology",
    date: "April 22, 2025",
    readTime: "6 min read",
    views: "4.8K",
    tags: ["AI", "Cost Estimation", "Technology", "Budgeting", "Machine Learning"],
    author: {
      name: "Muhammad Hamad Qamar",
      role: "AI Systems Developer",
      initials: "HQ",
      tone: "green",
    },
    content: [
      {
        type: "paragraph",
        text: "Construction budget overruns are an industry-wide problem. In Pakistan, many residential projects exceed their initial budgets because of inaccurate material takeoffs, volatile steel prices, and undocumented change orders. Artificial intelligence can help make those assumptions visible earlier.",
      },
      {
        type: "paragraph",
        text: "At BuildHive, the AI-powered cost estimation engine processes market signals, historical project patterns, and project specifications to generate practical budget ranges within minutes.",
      },
      { type: "heading", text: "The Problem with Traditional Estimation" },
      {
        type: "paragraph",
        text: "Manual estimation relies on experience, spreadsheets, and static price lists. This approach often misses real-time market fluctuations, regional price variations, and the hidden costs of material wastage.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
        caption: "Digital estimation workflows make assumptions easier to review and update.",
      },
      { type: "subheading", text: "Key Pain Points" },
      {
        type: "list",
        items: [
          "Static price lists updated monthly instead of daily",
          "No accounting for seasonal labor rate fluctuations",
          "Material wastage calculated as a flat percentage",
          "Change orders tracked manually, leading to billing disputes",
          "No historical benchmarking against similar completed projects",
        ],
      },
      { type: "heading", text: "How BuildHive AI Works" },
      {
        type: "paragraph",
        text: "The system ingests drawings, BOQs, and project specifications to generate itemized cost breakdowns, then flags high-risk items where price movement or wastage could affect the budget.",
      },
      {
        type: "tip",
        title: "Machine Learning Pipeline",
        text: "The estimate improves as new supplier prices, user adjustments, and completed project outcomes are fed back into the model.",
      },
      {
        type: "table",
        headers: ["Feature", "Traditional Method", "BuildHive AI"],
        rows: [
          ["Time to Estimate", "3-5 days", "5-10 minutes"],
          ["Price Data Freshness", "Monthly", "Real-time"],
          ["Accuracy Range", "Wide variance", "Narrower project-specific range"],
          ["Wastage Prediction", "Flat percentage", "Project-specific"],
          ["Change Order Tracking", "Manual", "Automated alerts"],
        ],
      },
      { type: "heading", text: "Real-World Results" },
      {
        type: "paragraph",
        text: "A commercial plaza team in Islamabad used BuildHive AI to compare a manual estimate with a live market estimate. The AI-backed plan helped them identify overpriced line items, adjust specifications, and keep the project budget more stable.",
      },
      { type: "heading", text: "Getting Started" },
      {
        type: "list",
        items: [
          "Upload drawings via the web dashboard",
          "Select project type and location",
          "Review the AI-generated BOQ",
          "Adjust finishes and specifications in real time",
          "Export the estimate or share it with stakeholders",
        ],
      },
    ],
  },
  "post-3": {
    id: "post-3",
    title: "Pakistan Construction Industry Forecast: Growth Trends for 2025-2030",
    excerpt:
      "With a market value of $16 billion in 2023 and projected 5% annual growth, Pakistan's construction sector presents massive opportunities. We analyze key drivers, challenges, and emerging market segments.",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=600&fit=crop",
    category: "Industry News",
    date: "April 18, 2025",
    readTime: "10 min read",
    views: "6.1K",
    tags: ["Industry News", "Pakistan", "Market Analysis", "Forecast", "Infrastructure"],
    author: {
      name: "Ayaan Ahmad",
      role: "Co-Founder",
      initials: "AA",
      tone: "purple",
    },
    content: [
      {
        type: "paragraph",
        text: "Pakistan's construction industry stands at an important point. Infrastructure investment, urbanization, and demand for affordable housing continue to create opportunities for contractors, suppliers, and technology platforms.",
      },
      {
        type: "paragraph",
        text: "The industry also faces pressure from material price volatility, regulatory delays, energy constraints, and shortages in skilled labor. Understanding both sides of the market is essential for the next wave of construction businesses.",
      },
      { type: "heading", text: "Market Size and Growth Trajectory" },
      {
        type: "paragraph",
        text: "The residential segment remains the largest driver, while commercial, infrastructure, and industrial projects are expanding as cities modernize and logistics networks improve.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop",
        caption: "Infrastructure and urban development projects continue to shape demand.",
      },
      {
        type: "table",
        headers: ["Segment", "Current Position", "2030 Outlook", "Opportunity"],
        rows: [
          ["Residential", "Largest share", "Steady growth", "Affordable housing"],
          ["Commercial", "Recovering demand", "Strong urban growth", "Mixed-use projects"],
          ["Infrastructure", "Public investment", "Expanded networks", "Roads and logistics"],
          ["Industrial", "Emerging base", "Higher demand", "Special economic zones"],
        ],
      },
      { type: "heading", text: "Key Growth Drivers" },
      { type: "subheading", text: "1. Infrastructure Expansion" },
      {
        type: "paragraph",
        text: "Transport, energy, and industrial projects are creating demand for cement, steel, aggregates, machinery, and specialized construction services.",
      },
      { type: "subheading", text: "2. Affordable Housing" },
      {
        type: "paragraph",
        text: "Pakistan's housing shortage continues to stimulate demand for cost-efficient materials, faster construction methods, and stronger supplier coordination.",
      },
      { type: "subheading", text: "3. Smart Cities and Urban Renewal" },
      {
        type: "paragraph",
        text: "Urban renewal projects are pushing the market toward better planning, sustainable materials, transparent procurement, and digital project workflows.",
      },
      {
        type: "tip",
        title: "Emerging Opportunity",
        text: "Prefabricated and modular construction can reduce build times and help teams manage labor shortages more effectively.",
      },
      { type: "heading", text: "Challenges and Risk Factors" },
      {
        type: "list",
        items: [
          "Currency volatility increasing import costs",
          "Energy constraints affecting site productivity",
          "Shortage of skilled workers in key trades",
          "Complex approval processes across jurisdictions",
          "Climate-related delays from floods and heat waves",
        ],
      },
      { type: "heading", text: "Technology Adoption Trends" },
      {
        type: "paragraph",
        text: "Digital transformation is accelerating through BIM, drone surveying, IoT monitoring, and marketplace procurement. The firms that adopt these tools early will be better positioned to control cost, quality, and timelines.",
      },
      { type: "heading", text: "Outlook and Recommendations" },
      {
        type: "paragraph",
        text: "Despite challenges, Pakistan's construction sector offers strong opportunities for investors, contractors, and material suppliers. Focus on affordable housing, sustainable materials, and digital tools to capture growth in this evolving market.",
      },
    ],
  },
};

const relatedPosts: RelatedPost[] = Object.values(posts).map((post) => ({
  id: post.id,
  title: post.title,
  excerpt: post.excerpt,
  image: post.image.replace("w=1200&h=600", "w=600&h=400"),
  category: post.category,
  date: post.date,
  readTime: post.readTime,
}));

export const blogDetailData = {
  posts,
  relatedPosts,
};
