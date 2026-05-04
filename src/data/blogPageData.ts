import { Icons } from "../../components/Icons";

export const blogPageData = {
  stats: {
    totalArticles: "3",
    monthlyReaders: "5K+",
    expertContributors: "25+",
  },

  categories: [
    "All",
    "Industry News",
    "Buying Guides",
    "Sustainability",
    "Technology",
    "Safety",
    "Project Management",
    "Cost Estimation",
  ],

  featured: {
    id: "featured-1",
    title: "The Complete Guide to Sustainable Construction Materials in Pakistan 2025",
    excerpt:
      "Discover how eco-friendly building materials are transforming Pakistan's construction landscape. From recycled concrete to bamboo composites, learn which sustainable options offer the best performance, cost savings, and environmental impact for your next project.",
    image:
      "https://images.unsplash.com/photo-1518005068251-37900150dfca?w=800&h=600&fit=crop",
    category: "Sustainability",
    date: "March 15, 2025",
    readTime: "12 min read",
    tags: ["Sustainability", "Materials", "Green Building", "Pakistan"],
    author: {
      name: "Ayaan Ahmad",
      role: "Co-Founder & Lead Developer",
      initials: "AA",
      tone: "purple" as const,
    },
  },

  posts: [
    {
      id: "post-1",
      title: "How to Choose the Right Cement Grade for Your Construction Project",
      excerpt:
        "Understanding cement grades is crucial for structural integrity. This guide breaks down OPC, PPC, and SRC grades with practical recommendations for residential, commercial, and infrastructure projects across Pakistan.",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
      category: "Buying Guides",
      date: "April 28, 2025",
      readTime: "8 min read",
      tags: ["Cement", "Buying Guide", "Materials"],
      author: {
        name: "Muhammad Hadin Khan",
        role: "Research Analyst",
        initials: "MH",
        tone: "blue" as const,
      },
    },
    {
      id: "post-2",
      title: "AI-Powered Cost Estimation: Reducing Budget Overruns by 30%",
      excerpt:
        "Learn how BuildHive's AI cost estimation tool analyzes market data, material prices, and labor costs to provide accurate project budgets that help contractors avoid costly overruns.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
      category: "Technology",
      date: "April 22, 2025",
      readTime: "6 min read",
      tags: ["AI", "Cost Estimation", "Technology"],
      author: {
        name: "Muhammad Hamad Qamar",
        role: "AI Systems Developer",
        initials: "HQ",
        tone: "green" as const,
      },
    },
    {
      id: "post-3",
      title: "Pakistan Construction Industry Forecast: Growth Trends for 2025-2030",
      excerpt:
        "With a market value of $16 billion in 2023 and projected 5% annual growth, Pakistan's construction sector presents massive opportunities. We analyze key drivers, challenges, and emerging market segments.",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
      category: "Industry News",
      date: "April 18, 2025",
      readTime: "10 min read",
      tags: ["Industry News", "Pakistan", "Market Analysis"],
      author: {
        name: "Ayaan Ahmad",
        role: "Co-Founder",
        initials: "AA",
        tone: "purple" as const,
      },
    },
  ],

  resources: [
    {
      id: "res-1",
      title: "Construction Cost Calculator Template",
      desc: "Excel template with built-in formulas for material, labor, and overhead cost calculations across all major Pakistani cities.",
      type: "Excel Template",
      size: "2.4 MB",
      downloads: "1,240",
      icon: Icons.Grid,
      tone: "green" as const,
    },
    {
      id: "res-2",
      title: "Material Specification Checklist",
      desc: "Comprehensive PDF checklist covering cement, steel, aggregates, bricks, and finishing materials with quality standards.",
      type: "PDF Guide",
      size: "1.8 MB",
      downloads: "856",
      icon: Icons.CheckSquare,
      tone: "purple" as const,
    },
    {
      id: "res-3",
      title: "Project Timeline Gantt Chart",
      desc: "Customizable project scheduling template with milestone tracking, resource allocation, and delay analysis features.",
      type: "Excel Template",
      size: "3.1 MB",
      downloads: "672",
      icon: Icons.Clock,
      tone: "blue" as const,
    },
    {
      id: "res-4",
      title: "Safety Audit Inspection Form",
      desc: "Digital form template for construction site safety audits covering PPE, scaffolding, electrical, and excavation checks.",
      type: "PDF Form",
      size: "890 KB",
      downloads: "534",
      icon: Icons.Shield,
      tone: "orange" as const,
    },
  ],

  topics: [
    {
      name: "Materials",
      count: 32,
      icon: Icons.Tools,
      tone: "purple" as const,
    },
    {
      name: "Technology",
      count: 24,
      icon: Icons.Electronics,
      tone: "blue" as const,
    },
    {
      name: "Sustainability",
      count: 18,
      icon: Icons.Globe,
      tone: "green" as const,
    },
    {
      name: "Safety",
      count: 15,
      icon: Icons.Shield,
      tone: "orange" as const,
    },
    {
      name: "Costing",
      count: 21,
      icon: Icons.Calculator,
      tone: "purple" as const,
    },
    {
      name: "Design",
      count: 12,
      icon: Icons.Star,
      tone: "blue" as const,
    },
    {
      name: "Management",
      count: 19,
      icon: Icons.Users,
      tone: "green" as const,
    },
    {
      name: "Legal",
      count: 8,
      icon: Icons.Briefcase,
      tone: "orange" as const,
    },
  ],
};
