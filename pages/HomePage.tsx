import React, { useEffect, useRef, useState } from "react";
import { Icons } from "../components/Icons";
import api from "../src/services/api";
import { useScrollAnimation } from "../src/hooks/useScrollAnimation";
import { resolveMarketplaceImageSrc } from "../src/utils/marketplaceImage";

const ScrollSection: React.FC<{
  className: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} className={`animate-on-scroll ${className}`}>
      {children}
    </div>
  );
};
interface HomePageProps {
  onNavigate: (page: string, productId?: string) => void;
}

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Icons;
  count: number;
  color: string;
  bg: string;
  route: string;
}

interface Listing {
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

interface FeaturedServiceListing {
  id: string;
  title: string;
  creatorName: string;
  creatorRole: "Contractor" | "Seller";
  category: string;
  price: number;
  deliveryDays: number;
  rating: number;
  reviewCount: number;
}

interface ServiceProvider {
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

interface FeaturedContractor {
  id: string;
  businessId?: string;
  userId?: string;
  name: string;
  trade: string;
  bio: string;
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  servicesCount: number;
  startingPrice?: number;
  availableNow?: boolean;
  avatar?: string | null;
  image?: string | null;
  featured?: boolean;
}

interface FeaturedProductApi {
  id: string;
  name: string;
  price: number;
  compare_at_price?: number;
  average_rating?: number;
  total_reviews?: number;
  review_count?: number;
  image?: string | null;
  image_url?: string | null;
  thumbnail?: string | null;
  product_images?: Array<{ image_url: string }>;
  businesses?: { business_name: string };
  categories?: { name?: string; slug?: string };
  tags?: string[];
  is_featured?: boolean;
}

interface CategoryApi {
  id: string;
  name: string;
  slug?: string;
  image?: string;
  parent_id?: string | null;
  parentId?: string | null;
  product_count?: number;
  _count?: { products?: number };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
  meta?: any;
}

const categoryIconNames: Array<keyof typeof Icons> = [
  "Package",
  "Shield",
  "AI",
  "Calculator",
  "Users",
  "Star",
  "Message",
  "Cart",
];

const fallbackCategories: Category[] = [
  {
    id: "mat-01",
    name: "Cement & Concrete",
    icon: "Package",
    count: 1245,
    color: "#fff",
    bg: "#111",
    route: "products?category=cement",
  },
  {
    id: "mat-02",
    name: "Steel & Rebar",
    icon: "Shield",
    count: 432,
    color: "#fff",
    bg: "#111",
    route: "products?category=steel",
  },
  {
    id: "mat-03",
    name: "Tiles & Flooring",
    icon: "AI",
    count: 867,
    color: "#fff",
    bg: "#111",
    route: "products?category=tiles",
  },
  {
    id: "mat-04",
    name: "Paint & Coatings",
    icon: "Calculator",
    count: 390,
    color: "#fff",
    bg: "#111",
    route: "products?category=paint",
  },
];

const fallbackFeaturedListings: Listing[] = [
  {
    id: "p-1001",
    title: "Portland Cement (50kg)",
    seller: "Lahore Materials",
    price: 850,
    originalPrice: 920,
    rating: 4.6,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    badge: "Best Seller",
    tag: "BAGS",
  },
  {
    id: "p-1002",
    title: "TMT Rebar 16mm (Bundle)",
    seller: "Karachi Steel Co.",
    price: 12000,
    rating: 4.4,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1581094288330-6f0b0f0d8b7a?w=800&h=600&fit=crop",
    tag: "PER BUNDLE",
  },
  {
    id: "p-1003",
    title: "Porcelain Floor Tile 600x600",
    seller: "Tiles & More",
    price: 4200,
    originalPrice: 4800,
    rating: 4.8,
    reviews: 34,
    image:
      "https://images.unsplash.com/photo-1505691723518-36a6f0e4b9d5?w=800&h=600&fit=crop",
    badge: "New",
    tag: "PER BOX",
  },
];

const fallbackStats = [
  { value: "1.2K+", label: "Products" },
  { value: "3.4K+", label: "Orders" },
  { value: "980+", label: "Verified Sellers" },
];

const mapCategory = (category: CategoryApi, index: number): Category => ({
  id: category.id,
  name: category.name,
  icon: categoryIconNames[index % categoryIconNames.length],
  count: category.product_count ?? category._count?.products ?? 0,
  color: "#fff",
  bg: "#111",
  route: `products?categoryId=${category.id}`,
});

const mapProduct = (product: FeaturedProductApi): Listing => ({
  id: product.id,
  title: product.name,
  seller: product.businesses?.business_name || "BuildHive Seller",
  price: product.price,
  originalPrice: product.compare_at_price,
  rating: product.average_rating || 0,
  reviews: product.total_reviews || product.review_count || 0,
  image: resolveMarketplaceImageSrc(product) || "",
  badge: product.is_featured ? "Featured" : undefined,
  tag: product.categories?.name?.toUpperCase() || "PRODUCT",
});

const normalizeProducts = (data: any): FeaturedProductApi[] => {
  const products = Array.isArray(data)
    ? data
    : data?.data?.products || data?.data || [];
  return Array.isArray(products) ? products : [];
};

const normalizeCategories = (data: any): CategoryApi[] => {
  const categories = Array.isArray(data)
    ? data
    : data?.data?.categories || data?.data || data?.categories || [];
  return Array.isArray(categories) ? categories : [];
};

const normalizeServices = (data: any): any[] => {
  const services = Array.isArray(data)
    ? data
    : data?.data?.services || data?.data || data?.services || [];
  return Array.isArray(services) ? services : [];
};

const mapService = (service: any): FeaturedServiceListing => ({
  id: service.id,
  title: service.name || service.title || "Service",
  creatorName:
    service.creator?.full_name ||
    service.creator?.name ||
    service.contractor?.business_name ||
    service.business?.business_name ||
    service.provider?.name ||
    service.provider ||
    "BuildHive Creator",
  creatorRole:
    String(
      service.creator_role ||
        service.creator?.role ||
        (service.contractor || service.contractor_id ? "contractor" : "seller"),
    ).toLowerCase() === "contractor"
      ? "Contractor"
      : "Seller",
  category:
    service.category?.name ||
    service.category_name ||
    service.category ||
    "Other",
  price: (() => {
    const pkg = Array.isArray(service.packages) ? service.packages : [];
    if (pkg.length === 0) return Number(service.price || 0);
    const prices = pkg
      .map((item: any) => Number(item.price || 0))
      .filter((value: number) => Number.isFinite(value) && value > 0);
    return prices.length > 0 ? Math.min(...prices) : Number(service.price || 0);
  })(),
  deliveryDays: Number(service.delivery_days || service.deliveryDays || 0),
  rating: Number(service.average_rating || service.rating || 0),
  reviewCount: Number(service.total_reviews || service.review_count || 0),
});

const renderCategorySkeletons = (count: number) =>
  Array.from({ length: count }).map((_, index) => (
    <div
      key={`category-skeleton-${index}`}
      className="category-card category-pill reveal-scale opacity-70"
    >
      <div className="category-icon animate-pulse bg-slate-800" />
      <div className="category-info space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
      </div>
    </div>
  ));

const renderFeaturedSkeletons = (count: number) =>
  Array.from({ length: count }).map((_, index) => (
    <div key={`featured-skeleton-${index}`} className="listing-card reveal">
      <div className="listing-image-wrap animate-pulse bg-slate-800" />
      <div className="listing-body space-y-3">
        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-800" />
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />
          <div className="h-4 w-16 animate-pulse rounded bg-slate-800" />
        </div>
      </div>
    </div>
  ));

const renderContractorSkeletons = (count: number) =>
  Array.from({ length: count }).map((_, index) => (
    <div
      key={`contractor-skeleton-${index}`}
      className="overflow-hidden rounded-[24px] border border-white/8 bg-white/4 shadow-[0_20px_45px_rgba(0,0,0,0.16)]"
    >
      <div className="animate-pulse bg-slate-800/80 px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-700" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-2/3 rounded bg-slate-700" />
            <div className="h-3 w-1/2 rounded bg-slate-700" />
            <div className="h-3 w-28 rounded bg-slate-700" />
          </div>
        </div>
      </div>
      <div className="space-y-4 px-5 py-5">
        <div className="h-4 w-full rounded bg-slate-700" />
        <div className="h-4 w-5/6 rounded bg-slate-700" />
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/6 bg-white/4 p-4">
          <div className="h-10 rounded bg-slate-700" />
          <div className="h-10 rounded bg-slate-700" />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="h-10 rounded-[16px] bg-slate-700" />
          <div className="h-10 rounded-[16px] bg-slate-700" />
        </div>
      </div>
    </div>
  ));

const homePageStyles = `
.home-root {
  background: #0b0f12;
  color: #e2e8f0;
}

.hero-section {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 84px 24px 64px;
  overflow: hidden;
  background-image: linear-gradient(180deg, rgba(11,15,18,0.30), rgba(11,15,18,0.92)), url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1800&h=1100&fit=crop");
  background-size: cover;
  background-position: center;
}

.hero-grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(165, 140, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(165, 140, 255, 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(to bottom, black 0%, transparent 88%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 940px;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  padding: 0 0 5px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid rgba(165, 140, 255, 0.45);
  color: #d9ccff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 32px;
}

.hero-title {
  font-size: clamp(38px, 6vw, 68px);
  font-weight: 900;
  line-height: 1.08;
  color: white;
  margin: 0 0 24px;
}

.gradient-text {
  background: linear-gradient(135deg, #d8ccff, #a58cff, #7e6bc7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(16px, 2vw, 20px);
  color: #cbd5e1;
  line-height: 1.7;
  max-width: 660px;
  margin: 0 auto 40px;
}

.search-btn,
.btn-primary,
.btn-secondary {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
}

.search-btn {
  padding: 12px 24px;
  background: #1a1426;
  color: #f5f3ff;
  font-size: 14px;
  border: 1px solid rgba(167, 139, 250, 0.44);
  white-space: nowrap;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 12px 26px rgba(0, 0, 0, 0.24);
}

.search-btn:hover,
.btn-primary:hover {
  transform: translateY(-2px);
  border-color: rgba(196, 181, 253, 0.68);
  background: #211830;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22);
}

.hero-cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 56px;
}

.btn-primary,
.btn-secondary {
  min-height: 54px;
  padding: 0 30px;
  font-size: 15px;
}

.btn-primary {
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  color: #f5f3ff;
  border: 1px solid rgba(167, 139, 250, 0.44);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(124, 58, 237, 0.22);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.025);
  color: #e9d5ff;
  border: 1px solid rgba(167, 139, 250, 0.28);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  transform: translateY(-2px);
  border-color: rgba(167, 139, 250, 0.5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 16px 34px rgba(0, 0, 0, 0.24);
}

.hero-stats-bar {
  display: flex;
  justify-content: center;
  gap: 44px;
  flex-wrap: wrap;
  padding: 24px;
  background: rgba(17, 21, 29, 0.72);
  border: 1px solid rgba(126, 107, 199, 0.18);
  border-radius: 20px;
  backdrop-filter: blur(12px);
}

.hero-stat { text-align: center; }
.hero-stat-value { font-size: 24px; font-weight: 900; color: white; margin-bottom: 4px; }
.hero-stat-label { font-size: 13px; color: #94a3b8; font-weight: 700; }

.section {
  padding: 82px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.section.alt {
  max-width: none;
  background: linear-gradient(180deg, transparent, rgba(126, 107, 199, 0.04), transparent);
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-label {
  display: inline-block;
  padding: 0 0 5px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid rgba(165, 140, 255, 0.45);
  color: #d9ccff;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.section-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 900;
  color: white;
  margin: 0 0 12px;
}

.section-subtitle {
  font-size: 16px;
  color: #94a3b8;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
}

.home-about-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;
}

.home-about-copy h2 {
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.12;
  font-weight: 900;
  color: #fff;
  margin: 0 0 20px;
}

.home-about-copy h2 span { color: #a78bfa; }
.home-about-copy p {
  color: #94a3b8;
  font-size: 16px;
  line-height: 1.8;
  margin: 0 0 16px;
}

.home-about-points {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.home-about-point {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.home-about-point-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.home-about-point-icon svg { width: 22px; height: 22px; stroke: #fff; }
.home-about-point strong { display: block; color: #fff; font-size: 14px; }
.home-about-point span { color: #64748b; font-size: 12px; }

.home-about-visual {
  position: relative;
  min-height: 420px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.home-about-visual img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  display: block;
  filter: saturate(0.95) contrast(1.05);
}

.home-about-visual::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, rgba(10, 10, 15, 0.34));
  pointer-events: none;
}

.categories-grid,
.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.category-pills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.category-card,
.listing-card,
.ai-card,
.provider-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s ease, background 0.5s ease, box-shadow 0.5s ease;
  cursor: pointer;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 999px;
}

.category-pill .category-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
}

.category-pill .category-icon svg {
  width: 18px;
  height: 18px;
}

.category-pill .category-info h3 {
  margin: 0;
  font-size: 15px;
}

.category-pill .category-info p {
  margin: 2px 0 0;
  font-size: 12px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 26px;
  border-radius: 24px;
}

.category-card:hover,
.listing-card:hover,
.ai-card:hover,
.provider-card:hover {
  transform: translateY(-10px);
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.12);
  background: rgba(255, 255, 255, 0.04);
}

.category-icon {
  width: 60px;
  height: 60px;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-card:hover .category-icon,
.ai-card:hover .ai-icon { transform: rotate(8deg) scale(1.12); }
.category-icon svg { width: 27px; height: 27px; stroke: white; }
.icon-tone-0 { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.icon-tone-1 { background: linear-gradient(135deg, #f59e0b, #d97706); }
.icon-tone-2 { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.icon-tone-3 { background: linear-gradient(135deg, #f43f5e, #e11d48); }
.icon-tone-4 { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.icon-tone-5 { background: linear-gradient(135deg, #10b981, #059669); }
.icon-tone-6 { background: linear-gradient(135deg, #14b8a6, #0f766e); }
.icon-tone-7 { background: linear-gradient(135deg, #6366f1, #4f46e5); }

.category-info h3 { font-size: 18px; font-weight: 900; color: white; margin: 0 0 4px; }
.category-info p { font-size: 15px; color: #94a3b8; margin: 0; }

.listings-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 24px;
}

@media (min-width: 640px) {
  .listings-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .listings-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.listing-card {
  border-radius: 24px;
  overflow: hidden;
}

.listing-card:hover {
  transform: translateY(-8px);
  border-color: rgba(139, 92, 246, 0.28);
  box-shadow: 0 24px 50px rgba(0,0,0,0.34), 0 0 28px rgba(124, 58, 237, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.listing-image-wrap {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.listing-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.listing-badge,
.listing-tag {
  position: absolute;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
}

.listing-badge {
  top: 12px;
  left: 12px;
  padding: 5px 12px;
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.16), rgba(124, 58, 237, 0.08)), #1a1426;
  border: 1px solid rgba(167, 139, 250, 0.44);
  color: #f5f3ff;
}

.listing-tag {
  right: 12px;
  bottom: 12px;
  padding: 5px 10px;
  background: rgba(11, 15, 18, 0.82);
  color: #cbd5e1;
  backdrop-filter: blur(8px);
}

.listing-body { padding: 16px; }
.listing-title {
  font-size: 15px;
  font-weight: 800;
  color: white;
  margin: 0 0 8px;
  line-height: 1.4;
  min-height: 42px;
}
.listing-seller { font-size: 13px; color: #94a3b8; margin: 0 0 12px; }
.listing-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.listing-price { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.price-current { font-size: 18px; font-weight: 900; color: white; }
.price-original { font-size: 13px; color: #64748b; text-decoration: line-through; }

.ai-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.ai-card {
  padding: 48px 40px;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.ai-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.ai-icon svg { width: 32px; height: 32px; stroke: white; }
.ai-card h3 { font-size: 24px; font-weight: 900; color: white; margin: 0 0 16px; }
.ai-card p { font-size: 16px; color: #94a3b8; line-height: 1.7; margin: 0 0 26px; }
.ai-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #a58cff;
  font-size: 14px;
  font-weight: 800;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.ai-link:hover { gap: 10px; }

.provider-card {
  padding: 40px 18px;
  border-radius: 24px;
  text-align: center;
}

.provider-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7e6bc7, #a58cff);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
  font-weight: 900;
  color: white;
}
.provider-card h3 { font-size: 17px; font-weight: 800; color: white; margin: 0 0 4px; }
.provider-role { font-size: 13px; color: #a58cff; font-weight: 800; margin: 0 0 12px; }
.provider-meta { display: flex; justify-content: center; gap: 24px; margin-bottom: 16px; }
.provider-meta-value { font-size: 16px; font-weight: 900; color: white; }
.provider-meta-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; }
.provider-skills { display: flex; flex-wrap: nowrap; gap: 5px; justify-content: center; overflow: visible; }
.provider-skill { padding: 5px 7px; border-radius: 8px; font-size: 10px; font-weight: 800; background: rgba(126, 107, 199, 0.1); color: #cbd5e1; border: 1px solid rgba(126, 107, 199, 0.15); white-space: nowrap; }

.provider-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.provider-modal {
  width: min(1040px, 100%);
  max-height: 90vh;
  overflow: auto;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #0d0d14;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
}

.provider-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(126, 107, 199, 0.16);
}

.provider-modal-header h2 {
  color: #fff;
  margin: 0;
  font-size: 1.35rem;
  font-weight: 900;
}

.provider-modal-close {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  cursor: pointer;
}

.provider-modal-body {
  padding: 24px;
}

.provider-profile-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.provider-profile-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7e6bc7, #a58cff);
  color: #fff;
  font-size: 20px;
  font-weight: 900;
  flex-shrink: 0;
}

.provider-profile-role {
  color: #a58cff;
  margin: 4px 0 0;
  font-weight: 800;
}

.provider-profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.provider-profile-stat {
  border-radius: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  padding: 14px;
}

.provider-profile-stat strong {
  display: block;
  color: #fff;
  font-size: 1.15rem;
}

.provider-profile-stat span {
  color: #94a3b8;
  font-size: 12px;
}

.provider-profile-section {
  margin-top: 20px;
}

.provider-profile-section h3 {
  color: #fff;
  font-size: 14px;
  margin: 0 0 10px;
}

.provider-profile-section p {
  color: #cbd5e1;
  line-height: 1.7;
  margin: 0;
}

.provider-cert-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.provider-cert {
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(126, 107, 199, 0.12);
  border: 1px solid rgba(126, 107, 199, 0.2);
  color: #d8ccff;
  font-size: 12px;
  font-weight: 800;
}

.provider-services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.provider-service-mini {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 16px;
}

.provider-service-mini h4 {
  color: #fff;
  margin: 0 0 8px;
  font-size: 14px;
}

.provider-service-mini p {
  color: #94a3b8;
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.cta-section {
  padding: 96px 24px;
  text-align: center;
  background-image: linear-gradient(180deg, rgba(11,15,18,0.92), rgba(11,15,18,0.72)), url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&h=900&fit=crop");
  background-size: cover;
  background-position: center;
}

.cta-content {
  max-width: 640px;
  margin: 0 auto;
}

.cta-section h2 { font-size: clamp(32px, 5vw, 48px); font-weight: 900; color: white; margin: 0 0 16px; }
.cta-section p { font-size: 18px; color: #cbd5e1; margin: 0 0 32px; line-height: 1.7; }

.reveal,
.reveal-scale {
  opacity: 1;
  transform: none;
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal-scale { transform: none; }
.reveal.active,
.reveal-scale.active {
  opacity: 1;
  transform: none;
}

/* global scrollbar styled in index.html */

@media (max-width: 768px) {
  .hero-stats-bar { gap: 24px; padding: 16px; }
  .home-about-grid { grid-template-columns: 1fr; }
  .home-about-points { grid-template-columns: 1fr; }
  .categories-grid { grid-template-columns: 1fr; }
  .section { padding: 60px 16px; }
  .search-form { padding-left: 14px; }
  .search-btn span { display: none; }
}

.home-root {
  background: var(--bh-bg);
  color: var(--bh-text);
}

.section-title,
.home-about-copy h2,
.listing-title,
.ai-card h3,
.provider-card h3 {
  color: var(--bh-text) !important;
}

.section-subtitle,
.listing-seller,
.home-about-copy p,
.ai-card p,
.provider-role,
.provider-meta-label,
.hero-stat-label {
  color: var(--bh-muted) !important;
}

.category-card,
.listing-card,
.ai-card,
.provider-card,
.home-about-point {
  background: var(--bh-card) !important;
  border-color: var(--bh-border) !important;
  color: var(--bh-text);
}

.category-card:hover,
.listing-card:hover,
.ai-card:hover,
.provider-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 22px 50px rgba(0,0,0,.22);
  border-color: var(--bh-primary-light) !important;
}

.category-pills-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.category-pill {
  border-radius: 24px;
  min-height: 132px;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px;
  overflow: hidden;
  position: relative;
}

.category-pill::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: .22;
  background: linear-gradient(135deg, var(--bh-primary), var(--bh-accent));
  pointer-events: none;
}

.category-pill > * {
  position: relative;
  z-index: 1;
}

.category-chip {
  display: inline-flex;
  width: max-content;
  border-radius: 999px;
  padding: 4px 9px;
  background: rgba(139,92,246,.16);
  color: var(--bh-primary-light);
  font-size: 11px !important;
  font-weight: 800;
}

.estimator-banner {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--bh-primary);
  border-radius: 28px;
  background: linear-gradient(135deg, #1A1A24, #2D1B69);
  color: #F1F1F3;
  padding: 38px 28px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0,0,0,.22);
}

html.light .estimator-banner {
  background: linear-gradient(135deg, #F3F0FF, #EDE9FE);
  color: #1A1A2E;
  box-shadow: 0 20px 45px rgba(108,59,213,.14);
}

.estimator-orb {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  filter: blur(32px);
  opacity: .38;
  animation: bh-orb-drift 9s ease-in-out infinite alternate;
}

.estimator-orb-one { left: -60px; top: -70px; background: #6C3BD5; }
.estimator-orb-two { right: -70px; bottom: -90px; background: #10B981; animation-delay: 1.4s; }

@keyframes bh-orb-drift {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(24px, -16px, 0) scale(1.08); }
}

.ai-card:hover .ai-icon {
  animation: bh-icon-pop .45s ease;
}

@keyframes bh-icon-pop {
  0%, 100% { transform: translateY(0) scale(1); }
  45% { transform: translateY(-4px) scale(1.08); }
}

@media (max-width: 900px) {
  .category-pills-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .section { padding: 56px 16px; }
  .category-pills-grid {
    display: grid;
    grid-template-columns: 1fr;
  }
  .ai-card {
    padding: 32px 24px;
  }
}
`;

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Icons.Star
          key={index}
          style={{
            width: 13,
            height: 13,
            color: index < Math.floor(rating) ? "#fbbf24" : "#334155",
            fill: "currentColor",
          }}
        />
      ))}
      <span
        style={{
          color: "#94a3b8",
          fontSize: 12,
          marginLeft: 4,
          fontWeight: 800,
        }}
      >
        {rating}
      </span>
    </div>
  );
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [stats] =
    useState<Array<{ value: string; label: string }>>(fallbackStats);
  const [homeError, setHomeError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [allProductsLoading, setAllProductsLoading] = useState(true);
  const [featuredServices, setFeaturedServices] = useState<
    FeaturedServiceListing[]
  >([]);
  const [featuredServicesLoading, setFeaturedServicesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setCategoriesLoading(true);
    setFeaturedLoading(true);
    setFeaturedServicesLoading(true);
    setAllProductsLoading(true);
    setHomeError(null);

    const loadHomepageSections = async () => {
      try {
        const [
          featuredResponse,
          trendingResponse,
          categoriesResponse,
          servicesResponse,
        ] = await Promise.all([
          api.get<ApiResponse<{ products: FeaturedProductApi[] }>>(
            "/products",
            { params: { status: "approved", isActive: true, featured: true, limit: 8 } },
          ),
          api.get<ApiResponse<{ products: FeaturedProductApi[] }>>(
            "/products",
            { params: { status: "approved", isActive: true, sortBy: "created_at", sortOrder: "desc", limit: 8 } },
          ),
          api.get<ApiResponse<CategoryApi[]>>("/categories", {
            params: { limit: 10, type: "product" },
          }),
          api.get<ApiResponse<any>>("/services", { params: { limit: 6 } }),
        ]);
        if (cancelled) return;

        const featured = normalizeProducts(featuredResponse.data);
        const trending = normalizeProducts(trendingResponse.data);
        const categoriesData = normalizeCategories(categoriesResponse.data).filter(
          (category) => !category.parent_id && !category.parentId,
        );
        const servicesData = normalizeServices(servicesResponse.data);

        setFeaturedListings(
          featured.length > 0 ? featured.map(mapProduct) : [],
        );
        setAllListings(trending.length > 0 ? trending.map(mapProduct) : []);
        setFeaturedServices(
          servicesData.length > 0
            ? servicesData.map(mapService).slice(0, 6)
            : [],
        );
        setCategories(
          categoriesData.length > 0 ? categoriesData.slice(0, 8).map(mapCategory) : [],
        );
      } catch {
        if (!cancelled) {
          setCategories([]);
          setFeaturedListings([]);
          setFeaturedServices([]);
          setAllListings([]);
          setHomeError("Homepage content is unavailable right now.");
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
          setFeaturedLoading(false);
          setFeaturedServicesLoading(false);
          setAllProductsLoading(false);
        }
      }
    };

    loadHomepageSections();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealNodes = root.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-scale",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.08 },
    );

    revealNodes.forEach((node) => observer.observe(node));

    const heroReveals = root.querySelectorAll<HTMLElement>(
      ".hero-section .reveal",
    );
    const timers = Array.from(heroReveals).map((element, index) =>
      window.setTimeout(
        () => element.classList.add("active"),
        250 + index * 120,
      ),
    );

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div ref={rootRef}>
      <style>{homePageStyles}</style>
      <div className="home-root">
        <ScrollSection className="hero-section">
          <div className="hero-grid-pattern" />
          <div className="hero-content">
            <div className="hero-badge reveal">
              Pakistan's #1 Construction Marketplace
            </div>
            <h1 className="hero-title reveal">
              Build Smarter.
              <br />
              <span className="gradient-text">Build Together.</span>
            </h1>
            <p className="hero-subtitle reveal">
              Connect with verified suppliers, discover quality materials at the
              best prices, and collaborate with construction professionals in
              one powerful platform.
            </p>
            <div className="hero-cta-group reveal">
              <button
                className="btn-primary"
                onClick={() => onNavigate("products")}
              >
                <Icons.Package className="h-5 w-5" />
                Browse Products
              </button>
              <button
                className="btn-secondary"
                onClick={() => onNavigate("services")}
              >
                <Icons.Briefcase className="h-5 w-5" />
                Browse Services
              </button>
            </div>
            <div className="hero-stats-bar reveal">
              {stats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <div className="hero-stat-value">{stat.value}</div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
            {homeError && (
              <p className="hero-subtitle reveal" style={{ marginTop: 18 }}>
                {homeError}
              </p>
            )}
          </div>
        </ScrollSection>

        <ScrollSection className="section">
          <div className="estimator-banner reveal">
            <div className="estimator-orb estimator-orb-one" />
            <div className="estimator-orb estimator-orb-two" />
            <div className="relative z-10">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <Icons.Calculator className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Plan Your Construction Budget
              </h2>
              <p className="mx-auto mt-2 mb-5 max-w-2xl text-sm leading-relaxed">
                Get instant AI-powered cost estimates for any construction project
                in Pakistan. Accurate PKR rates for Lahore, Karachi, Islamabad and
                more.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => onNavigate("cost-estimator")}
                  className="rounded-xl bg-[#6C3BD5] px-6 py-3 font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:bg-[#5B21B6]"
                >
                  Try Cost Estimator <Icons.ArrowRight className="ml-2 inline h-4 w-4" />
                </button>
                <button
                  onClick={() => onNavigate("contractors")}
                  className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-inherit transition hover:bg-white/10"
                >
                  Find a Contractor
                </button>
              </div>
            </div>
          </div>
        </ScrollSection>

        <ScrollSection className="section">
          <div className="home-about-grid">
            <div className="home-about-copy reveal">
              <span className="section-label">About BuildHive</span>
              <h2>
                A smarter marketplace for <span>construction teams</span>
              </h2>
              <p>
                BuildHive connects builders, contractors, homeowners, and
                verified suppliers in one trusted platform for materials,
                services, and project support.
              </p>
              <p>
                From product discovery to professional collaboration, the
                platform is built to make sourcing faster, clearer, and more
                reliable for construction work across Pakistan.
              </p>
              <div className="home-about-points">
                <div className="home-about-point">
                  <div className="home-about-point-icon">
                    <Icons.Shield />
                  </div>
                  <div>
                    <strong>Verified sellers</strong>
                    <span>Quality-first suppliers</span>
                  </div>
                </div>
                <div className="home-about-point">
                  <div className="home-about-point-icon icon-tone-2">
                    <Icons.AI />
                  </div>
                  <div>
                    <strong>Smart tools</strong>
                    <span>AI-assisted planning</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="home-about-visual reveal-scale">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&h=700&fit=crop"
                alt="Construction professionals working on site"
                loading="lazy"
              />
            </div>
          </div>
        </ScrollSection>

        <ScrollSection className="section">
          <div className="section-header reveal">
            <span className="section-label">Categories</span>
            <h2 className="section-title">Browse by Material Type</h2>
            <p className="section-subtitle">
              Find exactly what you need from our construction materials
              catalog.
            </p>
          </div>
          <div className="category-pills-grid">
            {categoriesLoading || categories.length === 0
              ? renderCategorySkeletons(6)
              : categories.map((category, index) => {
                  const IconComp = Icons[category.icon] || Icons.Package;
                  return (
                    <div
                      key={category.id}
                      className="category-card category-pill reveal-scale"
                      style={{ transitionDelay: `${index * 50}ms` }}
                      onClick={() => onNavigate(category.route)}
                    >
                      <div className={`category-icon icon-tone-${index % 8}`}>
                        <IconComp />
                      </div>
                      <div className="category-info">
                        <h3>{category.name}</h3>
                        {category.count > 0 && (
                          <p>{category.count.toLocaleString()} products</p>
                        )}
                      </div>
                    </div>
                  );
                })}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }} className="reveal">
            <button className="btn-secondary" onClick={() => onNavigate("products")}>
              Browse All <Icons.ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </ScrollSection>

        {(featuredLoading || featuredListings.length > 0) && (
        <ScrollSection className="section alt">
          <div className="section-inner">
            <div className="section-header reveal">
              <span className="section-label">Featured</span>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">
                Hand-picked approved products from verified sellers.
              </p>
            </div>
            <div className="listings-grid">
              {featuredLoading ? (
                renderFeaturedSkeletons(8)
              ) : (
                featuredListings.map((listing, index) => (
                    <div
                      key={listing.id}
                      className="listing-card reveal"
                      style={{ transitionDelay: `${index * 80}ms` }}
                      onClick={() => onNavigate("product-detail", listing.id)}
                    >
                      <div className="listing-image-wrap">
                        <img
                          src={listing.image || "/productsplaceholder.png"}
                          alt={listing.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/productsplaceholder.png";
                          }}
                        />
                        {listing.badge && (
                          <span className="listing-badge">{listing.badge}</span>
                        )}
                        <span className="listing-tag">{listing.tag}</span>
                      </div>
                      <div className="listing-body">
                        <h3 className="listing-title">{listing.title}</h3>
                        <p className="listing-seller">by {listing.seller}</p>
                        <div className="listing-footer">
                          <div className="listing-price">
                            <span className="price-current">
                              PKR {listing.price.toLocaleString()}
                            </span>
                            {listing.originalPrice && (
                              <span className="price-original">
                                PKR {listing.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <StarRating rating={listing.rating} />
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
            <div style={{ textAlign: "center", marginTop: 36 }} className="reveal">
              <button className="btn-secondary" onClick={() => onNavigate("products")}>
                See All Products <Icons.ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </ScrollSection>
        )}

        <ScrollSection className="section">
          <div className="section-inner">
            <div className="section-header reveal">
              <span className="section-label">Browse Gigs</span>
              <h2 className="section-title">Popular Services</h2>
              <p className="section-subtitle">
                Approved gigs from sellers and contractors.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {featuredServicesLoading
                ? renderFeaturedSkeletons(6)
                : featuredServices.map((service) => (
                    <div
                      key={service.id}
                      className="listing-card reveal"
                      onClick={() => onNavigate(`services/${service.id}`)}
                    >
                      <div className="listing-body">
                        <span
                          className="listing-tag"
                          style={{
                            position: "static",
                            display: "inline-block",
                            marginBottom: 10,
                          }}
                        >
                          {service.category}
                        </span>
                        <h3
                          className="listing-title"
                          style={{ minHeight: "unset" }}
                        >
                          {service.title}
                        </h3>
                        <p className="listing-seller">
                          {service.creatorName} · {service.creatorRole}
                        </p>
                        <div
                          className="listing-footer"
                          style={{ marginTop: 8 }}
                        >
                          <div className="listing-price">
                            <span className="price-current">
                              PKR {service.price.toLocaleString()}
                            </span>
                          </div>
                          <StarRating rating={service.rating} />
                        </div>
                        <p className="listing-seller" style={{ marginTop: 10 }}>
                          Delivered in {service.deliveryDays || 0} days ·{" "}
                          {service.reviewCount} reviews
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
            <div
              style={{ textAlign: "center", marginTop: 28 }}
              className="reveal"
            >
              <button
                className="btn-secondary"
                onClick={() => onNavigate("services")}
              >
                Browse All Services
                <Icons.ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </ScrollSection>

        {(allProductsLoading || allListings.length > 0) && (
        <ScrollSection className="section">
          <div className="section-inner">
            <div className="section-header reveal">
              <span className="section-label">Trending</span>
              <h2 className="section-title">Trending Products</h2>
              <p className="section-subtitle">
                Recent approved products with marketplace activity.
              </p>
            </div>
            <div className="listings-grid">
              {allProductsLoading ? (
                renderFeaturedSkeletons(8)
              ) : (
                allListings.map((listing, index) => (
                    <div
                      key={listing.id}
                      className="listing-card reveal"
                      style={{ transitionDelay: `${index * 80}ms` }}
                      onClick={() => onNavigate("product-detail", listing.id)}
                    >
                      <div className="listing-image-wrap">
                        <img
                          src={listing.image || "/productsplaceholder.png"}
                          alt={listing.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/productsplaceholder.png";
                          }}
                        />
                        {listing.badge && (
                          <span className="listing-badge">{listing.badge}</span>
                        )}
                        <span className="listing-tag">{listing.tag}</span>
                      </div>
                      <div className="listing-body">
                        <h3 className="listing-title">{listing.title}</h3>
                        <p className="listing-seller">by {listing.seller}</p>
                        <div className="listing-footer">
                          <div className="listing-price">
                            <span className="price-current">
                              PKR {listing.price.toLocaleString()}
                            </span>
                            {listing.originalPrice && (
                              <span className="price-original">
                                PKR {listing.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <StarRating rating={listing.rating} />
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
            <div
              style={{ textAlign: "center", marginTop: 40 }}
              className="reveal"
            >
              <button
                className="btn-secondary"
                onClick={() => onNavigate("products")}
              >
                View All Products
                <Icons.ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </ScrollSection>
        )}

        <ScrollSection className="section">
          <div className="section-header reveal">
            <span className="section-label">AI-Powered</span>
            <h2 className="section-title">Smart Tools for Smart Builders</h2>
            <p className="section-subtitle">
              Use intelligent tools to plan, estimate, and source with
              confidence.
            </p>
          </div>
          <div className="ai-grid">
            {[
              {
                icon: Icons.AI,
                tone: "icon-tone-2",
                title: "AI Recommendations",
                text: "Get material suggestions based on your project, budget, and quality preferences.",
                action: "Try Recommendations",
                route: "recommendations",
              },
              {
                icon: Icons.Calculator,
                tone: "icon-tone-7",
                title: "Cost Estimation",
                text: "Generate itemized project cost estimates with cost-saving suggestions.",
                action: "Estimate Costs",
                route: "cost-estimator",
              },
              {
                icon: Icons.Message,
                tone: "icon-tone-0",
                title: "AI Assistant",
                text: "Find products, compare options, and get instant construction marketplace help.",
                action: "Chat with AI",
                route: "ai",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="ai-card reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`ai-icon ${item.tone}`}>
                  <item.icon />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <button
                  className="ai-link"
                  onClick={() => {
                    if (item.action === "Chat with AI") {
                      window.dispatchEvent(new CustomEvent("open-ai-chat"));
                    } else {
                      onNavigate(item.route);
                    }
                  }}
                >
                  {item.action} <Icons.ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </ScrollSection>

        <ScrollSection className="cta-section">
          <div className="cta-content reveal">
            <h2>Ready to Start Building?</h2>
            <p>
              Join construction professionals who trust BuildHive for material
              sourcing and project collaboration.
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn-primary"
                onClick={() => onNavigate("get-started")}
              >
                <Icons.User className="h-5 w-5" />
                Create Free Account
              </button>
              <button
                className="btn-secondary"
                onClick={() => onNavigate("about")}
              >
                Learn More
              </button>
            </div>
          </div>
        </ScrollSection>

      </div>
      </div>
  );
};







