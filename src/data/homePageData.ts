export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
  bg: string;
  route: string;
}

export interface Listing {
  id: string;
  title: string;
  seller: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  tag: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  role: string;
  rating: number;
  projects: number;
  avatar: string;
  skills: string[];
  location: string;
  responseTime: string;
  description: string;
  phone: string;
  email: string;
  certifications: string[];
}

export const categories: Category[] = [
  { id: "construction-materials", name: "Cement & Concrete", icon: "Package", count: 1240, color: "#60a5fa", bg: "rgba(96, 165, 250, 0.12)", route: "products?categoryId=construction-materials" },
  { id: "tools-equipment", name: "Tools & Equipment", icon: "Tools", count: 856, color: "#a78bfa", bg: "rgba(167, 139, 250, 0.12)", route: "products?categoryId=tools-equipment" },
  { id: "doors-windows", name: "Doors & Windows", icon: "Home", count: 643, color: "#34d399", bg: "rgba(52, 211, 153, 0.12)", route: "products?categoryId=doors-windows" },
  { id: "interior-assets", name: "Tiles & Flooring", icon: "Grid", count: 489, color: "#fb7185", bg: "rgba(251, 113, 133, 0.12)", route: "products?categoryId=interior-assets" },
  { id: "plumbing-sanitary", name: "Plumbing", icon: "Plumbing", count: 367, color: "#38bdf8", bg: "rgba(56, 189, 248, 0.12)", route: "products?categoryId=plumbing-sanitary" },
  { id: "electrical-safety", name: "Electrical", icon: "Electrical", count: 412, color: "#fbbf24", bg: "rgba(251, 191, 36, 0.12)", route: "products?categoryId=electrical-safety" },
  { id: "exterior-landscape", name: "Exterior & Landscape", icon: "Globe", count: 298, color: "#10b981", bg: "rgba(16, 185, 129, 0.12)", route: "products?categoryId=exterior-landscape" },
  { id: "architectural-resources", name: "Blueprints & CAD", icon: "Ruler", count: 244, color: "#818cf8", bg: "rgba(129, 140, 248, 0.12)", route: "products?categoryId=architectural-resources" },
];

export const featuredListings: Listing[] = [
  {
    id: "1",
    title: "Premium Portland Cement (50kg)",
    seller: "Lucky Cement Ltd",
    price: 1450,
    originalPrice: 1650,
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1596386461350-326ea77d337b?w=700&h=520&fit=crop",
    badge: "Best Seller",
    tag: "Cement",
  },
  {
    id: "2",
    title: "Deformed Steel Bars Grade 60 (12mm)",
    seller: "Amreli Steels",
    price: 185,
    rating: 4.9,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&h=520&fit=crop",
    badge: "Verified",
    tag: "Steel",
  },
  {
    id: "3",
    title: "Ceramic Wall Tiles (12x18)",
    seller: "Master Tiles",
    price: 890,
    originalPrice: 1200,
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=700&h=520&fit=crop",
    tag: "Tiles",
  },
  {
    id: "4",
    title: "PVC Pipes Schedule 40 (4 inch)",
    seller: "Pak Arab Pipes",
    price: 320,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=700&h=520&fit=crop",
    tag: "Plumbing",
  },
];

export const topProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "Ali Construction",
    role: "General Contractor",
    rating: 4.9,
    projects: 127,
    avatar: "AC",
    skills: ["Residential", "Commercial", "Renovation"],
    location: "Lahore, Punjab",
    responseTime: "< 2 hours",
    description: "Verified general contractor for residential, commercial, and renovation projects with strong site management experience.",
    phone: "+92-42-111-222-333",
    email: "projects@aliconstruction.pk",
    certifications: ["PEC Registered", "Safety Certified", "BuildHive Verified"],
  },
  {
    id: "2",
    name: "Karachi Builders",
    role: "Construction Firm",
    rating: 4.8,
    projects: 89,
    avatar: "KB",
    skills: ["High-Rise", "Industrial", "Infrastructure"],
    location: "Karachi, Sindh",
    responseTime: "< 4 hours",
    description: "Construction firm focused on high-rise, industrial, and infrastructure work across Sindh.",
    phone: "+92-21-111-444-555",
    email: "hello@karachibuilders.pk",
    certifications: ["ISO 9001", "PEC Registered", "Quality Certified"],
  },
  {
    id: "3",
    name: "Lahore Architects",
    role: "Design Studio",
    rating: 4.7,
    projects: 64,
    avatar: "LA",
    skills: ["Architecture", "Interior", "3D Modeling"],
    location: "Lahore, Punjab",
    responseTime: "< 6 hours",
    description: "Design studio delivering architecture, interiors, visualization, and construction documentation.",
    phone: "+92-42-111-777-888",
    email: "studio@lahorearchitects.pk",
    certifications: ["PCATP Registered", "Green Design Certified"],
  },
  {
    id: "4",
    name: "Islamabad Engineers",
    role: "Structural Engineers",
    rating: 4.9,
    projects: 45,
    avatar: "IE",
    skills: ["Structural", "MEP", "Consulting"],
    location: "Islamabad",
    responseTime: "< 3 hours",
    description: "Engineering consultancy for structural design, MEP coordination, inspections, and technical review.",
    phone: "+92-51-111-999-000",
    email: "consult@islamabadengineers.pk",
    certifications: ["PEC Registered", "LEED Accredited", "Structural Excellence"],
  },
];

export const stats = [
  { value: "15,000+", label: "Products Listed" },
  { value: "8,500+", label: "Verified Sellers" },
  { value: "PKR 2.4B", label: "Transactions" },
  { value: "99.2%", label: "Satisfaction Rate" },
];

export default {
  categories,
  featuredListings,
  topProviders,
  stats,
};
