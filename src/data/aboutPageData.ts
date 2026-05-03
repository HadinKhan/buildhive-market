import { Icons } from "../../components/Icons";

export const aboutPageData = {
  stats: [
    { target: 50, label: "Products", suffix: "+" },
    { target: 3, label: "Team Members" },
    { target: 1, label: "University Campus" },
    { target: 4, label: "Core Features" },
  ],

  values: [
    {
      title: "Transparency",
      desc: "Open pricing, verified reviews, and clear communication in every transaction. No hidden costs or misleading information.",
      icon: Icons.Team,
      tone: "cyan",
    },
    {
      title: "Quality",
      desc: "Rigorous supplier verification and quality assurance for all materials, services, and digital assets listed on our platform.",
      icon: Icons.Award,
      tone: "amber",
    },
    {
      title: "Innovation",
      desc: "Leveraging AI and technology to revolutionize construction procurement with smart recommendations and accurate cost predictions.",
      icon: Icons.Electronics,
      tone: "violet",
    },
    {
      title: "Trust",
      desc: "Building lasting relationships through reliability, secure payments, and a commitment to professional excellence.",
      icon: Icons.Heart,
      tone: "rose",
    },
  ],

  offers: [
    {
      title: "Digital Marketplace",
      desc: "Comprehensive platform for buying and selling construction materials, digital assets, and professional services.",
      icon: Icons.ShoppingBag,
      tone: "amber",
    },
    {
      title: "AI Recommendations",
      desc: "Intelligent material recommendation system that analyzes project needs and suggests optimal resources with reasoning.",
      icon: Icons.Brain,
      tone: "purple",
    },
    {
      title: "Cost Estimation",
      desc: "AI-powered project cost analysis with itemized breakdowns, variation comparisons, and cost reduction suggestions.",
      icon: Icons.Calculator,
      tone: "blue",
    },
    {
      title: "Real-time Chatbot",
      desc: "24/7 intelligent assistant for platform navigation, instant queries, and personalized user guidance.",
      icon: Icons.Bot,
      tone: "green",
    },
    {
      title: "Collaboration Tools",
      desc: "Secure messaging and file sharing space for professionals to discuss projects and share updates.",
      icon: Icons.Users,
      tone: "cyan",
    },
    {
      title: "Secure Payments",
      desc: "Integrated payment gateway with transaction protection, invoice generation, and financial oversight.",
      icon: Icons.Shield,
      tone: "rose",
    },
  ],

  timeline: [
    {
      step: "Q3 2025",
      date: "Foundation",
      title: "Foundation",
      desc: "BuildHive was conceptualized as a Final Year Project at COMSATS University Islamabad, Lahore Campus, under the supervision of Mr. Usman Akram.",
    },
    {
      step: "Q4 2025",
      date: "Platform Development",
      title: "Platform Development",
      desc: "Official development began with React frontend, Node.js backend, Supabase database, and AI module integration.",
    },
    {
      step: "Q1 2026",
      date: "Feature Integration",
      title: "Feature Integration",
      desc: "Core marketplace, AI recommendation engine, cost estimation system, and real-time chatbot were developed and tested.",
    },
    {
      step: "Q2 2026",
      date: "Beta Launch",
      title: "Beta Launch",
      desc: "Platform launched for testing with role-specific dashboards for Buyers, Sellers, Service Providers, and Admins.",
      active: true,
    },
  ],

  testimonials: [
    {
      initials: "AK",
      name: "Ahmed Khan",
      role: "Contractor, Lahore",
      quote:
        '"BuildHive transformed how we source materials. The AI recommendations saved us 20% on our last project, and the verified suppliers give us complete peace of mind."',
      tone: "blue",
      stars: 5,
    },
    {
      initials: "SR",
      name: "Sarah Rahman",
      role: "Builder, Karachi",
      quote:
        '"The delivery speed is incredible. We received our cement order within 24 hours. This platform is a game-changer for small construction firms like ours."',
      tone: "green",
      stars: 5,
    },
    {
      initials: "FA",
      name: "Faisal Ali",
      role: "Supplier, Islamabad",
      quote:
        '"As a supplier, BuildHive helped us reach customers nationwide. The dashboard is intuitive and the support team is exceptional."',
      tone: "purple",
      stars: 4,
    },
  ],

  partners: [
    { left: "COMSATS", right: "University" },
    { left: "Cubic", right: "Solutions Inc." },
    { left: "HEC", right: "Pakistan" },
    { left: "Bestway", right: "Cement" },
    { left: "Attock", right: "Cement" },
  ],

  team: [
    {
      initials: "AA",
      name: "Ayaan Ahmad",
      role: "Vision Lead / Group Leader",
      desc: "Strategic direction and product vision for BuildHive's growth. Backend development, database architecture, and API implementation.",
      tone: "purple",
    },
    {
      initials: "MHQ",
      name: "Muhammad Hamad Qamar",
      role: "Operations / UI-UX Lead",
      desc: "Overseeing daily operations and user experience. Frontend development, AI-driven features, and UI/UX design.",
      tone: "violet",
    },
    {
      initials: "MHK",
      name: "Muhammad Hadin Khan",
      role: "Tech Lead / Documentation",
      desc: "Leading technical architecture and platform development. Backend APIs, system design, and project documentation.",
      tone: "blue",
    },
  ],
};
