import React, { useCallback, useEffect, useRef, useState } from "react";
import { Icons } from "../components/Icons";

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

const categories: Category[] = [
  { id: "construction-materials", name: "Cement & Concrete", icon: "Package", count: 1240, color: "#60a5fa", bg: "rgba(96, 165, 250, 0.12)", route: "products?categoryId=construction-materials" },
  { id: "tools-equipment", name: "Tools & Equipment", icon: "Tools", count: 856, color: "#a78bfa", bg: "rgba(167, 139, 250, 0.12)", route: "products?categoryId=tools-equipment" },
  { id: "doors-windows", name: "Doors & Windows", icon: "Home", count: 643, color: "#34d399", bg: "rgba(52, 211, 153, 0.12)", route: "products?categoryId=doors-windows" },
  { id: "interior-assets", name: "Tiles & Flooring", icon: "Grid", count: 489, color: "#fb7185", bg: "rgba(251, 113, 133, 0.12)", route: "products?categoryId=interior-assets" },
  { id: "plumbing-sanitary", name: "Plumbing", icon: "Plumbing", count: 367, color: "#38bdf8", bg: "rgba(56, 189, 248, 0.12)", route: "products?categoryId=plumbing-sanitary" },
  { id: "electrical-safety", name: "Electrical", icon: "Electrical", count: 412, color: "#fbbf24", bg: "rgba(251, 191, 36, 0.12)", route: "products?categoryId=electrical-safety" },
  { id: "exterior-landscape", name: "Exterior & Landscape", icon: "Globe", count: 298, color: "#10b981", bg: "rgba(16, 185, 129, 0.12)", route: "products?categoryId=exterior-landscape" },
  { id: "architectural-resources", name: "Blueprints & CAD", icon: "Ruler", count: 244, color: "#818cf8", bg: "rgba(129, 140, 248, 0.12)", route: "products?categoryId=architectural-resources" },
];

const featuredListings: Listing[] = [
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

const topProviders: ServiceProvider[] = [
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

const stats = [
  { value: "15,000+", label: "Products Listed" },
  { value: "8,500+", label: "Verified Sellers" },
  { value: "PKR 2.4B", label: "Transactions" },
  { value: "99.2%", label: "Satisfaction Rate" },
];

const homePageStyles = `
.home-root {
  min-height: 100vh;
  background: #0b0f12;
  color: #e2e8f0;
  overflow-x: hidden;
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
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal-scale { transform: scale(0.96); }
.reveal.active,
.reveal-scale.active {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.home-root ::-webkit-scrollbar { width: 8px; }
.home-root ::-webkit-scrollbar-track { background: #0b0f12; }
.home-root ::-webkit-scrollbar-thumb { background: rgba(126, 107, 199, 0.35); border-radius: 4px; }

@media (max-width: 768px) {
  .hero-stats-bar { gap: 24px; padding: 16px; }
  .home-about-grid { grid-template-columns: 1fr; }
  .home-about-points { grid-template-columns: 1fr; }
  .categories-grid { grid-template-columns: 1fr; }
  .section { padding: 60px 16px; }
  .search-form { padding-left: 14px; }
  .search-btn span { display: none; }
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
      <span style={{ color: "#94a3b8", fontSize: 12, marginLeft: 4, fontWeight: 800 }}>{rating}</span>
    </div>
  );
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealNodes = root.querySelectorAll<HTMLElement>(".reveal, .reveal-scale");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.08 }
    );

    revealNodes.forEach((node) => observer.observe(node));

    const heroReveals = root.querySelectorAll<HTMLElement>(".hero-section .reveal");
    const timers = Array.from(heroReveals).map((element, index) =>
      window.setTimeout(() => element.classList.add("active"), 250 + index * 120)
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
        <section className="hero-section">
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
              Connect with verified suppliers, discover quality materials at the best prices, and collaborate with construction professionals in one powerful platform.
            </p>
            <div className="hero-cta-group reveal">
              <button className="btn-primary" onClick={() => onNavigate("products")}>
                <Icons.Package className="h-5 w-5" />
                Browse Materials
              </button>
              <button className="btn-secondary" onClick={() => onNavigate("services")}>
                <Icons.Users className="h-5 w-5" />
                Find Contractors
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
          </div>
        </section>

        <section className="section">
          <div className="home-about-grid">
            <div className="home-about-copy reveal">
              <span className="section-label">About BuildHive</span>
              <h2>
                A smarter marketplace for <span>construction teams</span>
              </h2>
              <p>
                BuildHive connects builders, contractors, homeowners, and verified suppliers in one trusted platform for materials, services, and project support.
              </p>
              <p>
                From product discovery to professional collaboration, the platform is built to make sourcing faster, clearer, and more reliable for construction work across Pakistan.
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
        </section>

        <section className="section">
          <div className="section-header reveal">
            <span className="section-label">Categories</span>
            <h2 className="section-title">Browse by Material Type</h2>
            <p className="section-subtitle">Find exactly what you need from our construction materials catalog.</p>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => {
              const IconComp = Icons[category.icon];
              return (
                <div
                  key={category.id}
                  className="category-card reveal-scale"
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={() => onNavigate(category.route)}
                >
                  <div className={`category-icon icon-tone-${index % 8}`}>
                    <IconComp />
                  </div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>{category.count.toLocaleString()} products</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section alt">
          <div className="section-inner">
            <div className="section-header reveal">
              <span className="section-label">Featured</span>
              <h2 className="section-title">Trending Materials</h2>
              <p className="section-subtitle">Top-rated products with strong value from verified sellers.</p>
            </div>
            <div className="listings-grid">
              {featuredListings.map((listing, index) => (
                <div key={listing.id} className="listing-card reveal" style={{ transitionDelay: `${index * 80}ms` }} onClick={() => onNavigate("products")}>
                  <div className="listing-image-wrap">
                    <img src={listing.image} alt={listing.title} loading="lazy" />
                    {listing.badge && <span className="listing-badge">{listing.badge}</span>}
                    <span className="listing-tag">{listing.tag}</span>
                  </div>
                  <div className="listing-body">
                    <h3 className="listing-title">{listing.title}</h3>
                    <p className="listing-seller">by {listing.seller}</p>
                    <div className="listing-footer">
                      <div className="listing-price">
                        <span className="price-current">PKR {listing.price.toLocaleString()}</span>
                        {listing.originalPrice && <span className="price-original">PKR {listing.originalPrice.toLocaleString()}</span>}
                      </div>
                      <StarRating rating={listing.rating} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }} className="reveal">
              <button className="btn-secondary" onClick={() => onNavigate("products")}>
                View All Products
                <Icons.ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header reveal">
            <span className="section-label">AI-Powered</span>
            <h2 className="section-title">Smart Tools for Smart Builders</h2>
            <p className="section-subtitle">Use intelligent tools to plan, estimate, and source with confidence.</p>
          </div>
          <div className="ai-grid">
            {[
              { icon: Icons.AI, tone: "icon-tone-2", title: "AI Recommendations", text: "Get material suggestions based on your project, budget, and quality preferences.", action: "Try Recommendations", route: "ai" },
              { icon: Icons.Calculator, tone: "icon-tone-7", title: "Cost Estimation", text: "Generate itemized project cost estimates with cost-saving suggestions.", action: "Estimate Costs", route: "ai" },
              { icon: Icons.Message, tone: "icon-tone-0", title: "AI Assistant", text: "Find products, compare options, and get instant construction marketplace help.", action: "Chat with AI", route: "ai" },
            ].map((item, index) => (
              <div key={item.title} className="ai-card reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className={`ai-icon ${item.tone}`}>
                  <item.icon />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <button className="ai-link" onClick={() => onNavigate(item.route)}>
                  {item.action} <Icons.ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="section alt">
          <div className="section-inner">
            <div className="section-header reveal">
              <span className="section-label">Professionals</span>
              <h2 className="section-title">Top Service Providers</h2>
              <p className="section-subtitle">Connect with verified contractors, architects, and engineers.</p>
            </div>
            <div className="providers-grid">
              {topProviders.map((provider, index) => (
                <div key={provider.id} className="provider-card reveal-scale" style={{ transitionDelay: `${index * 80}ms` }} onClick={() => setSelectedProvider(provider)}>
                  <div className="provider-avatar">{provider.avatar}</div>
                  <h3>{provider.name}</h3>
                  <p className="provider-role">{provider.role}</p>
                  <div className="provider-meta">
                    <div>
                      <div className="provider-meta-value">{provider.rating}</div>
                      <div className="provider-meta-label">Rating</div>
                    </div>
                    <div>
                      <div className="provider-meta-value">{provider.projects}</div>
                      <div className="provider-meta-label">Projects</div>
                    </div>
                  </div>
                  <div className="provider-skills">
                    {provider.skills.map((skill) => <span key={skill} className="provider-skill">{skill}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }} className="reveal">
              <button className="btn-secondary" onClick={() => onNavigate("services")}>
                Explore All Providers
                <Icons.ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content reveal">
            <h2>Ready to Start Building?</h2>
            <p>Join construction professionals who trust BuildHive for material sourcing and project collaboration.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => onNavigate("get-started")}>
                <Icons.User className="h-5 w-5" />
                Create Free Account
              </button>
              <button className="btn-secondary" onClick={() => onNavigate("about")}>
                Learn More
              </button>
            </div>
          </div>
        </section>

        {selectedProvider && (
          <div className="provider-modal-backdrop" onClick={() => setSelectedProvider(null)}>
            <div className="provider-modal" onClick={(event) => event.stopPropagation()}>
              <div className="provider-modal-header">
                <h2>{selectedProvider.name}</h2>
                <button className="provider-modal-close" onClick={() => setSelectedProvider(null)}>x</button>
              </div>
              <div className="provider-modal-body">
                <div className="provider-profile-head">
                  <div className="provider-profile-avatar">{selectedProvider.avatar}</div>
                  <div>
                    <h3 style={{ color: "#fff", margin: 0, fontSize: "1.4rem" }}>{selectedProvider.name}</h3>
                    <p className="provider-profile-role">{selectedProvider.role}</p>
                    <p style={{ color: "#94a3b8", margin: "6px 0 0" }}>{selectedProvider.location}</p>
                  </div>
                </div>

                <div className="provider-profile-grid">
                  <div className="provider-profile-stat">
                    <strong>{selectedProvider.rating}</strong>
                    <span>Rating</span>
                  </div>
                  <div className="provider-profile-stat">
                    <strong>{selectedProvider.projects}</strong>
                    <span>Services</span>
                  </div>
                  <div className="provider-profile-stat">
                    <strong>{selectedProvider.responseTime}</strong>
                    <span>Response Time</span>
                  </div>
                  <div className="provider-profile-stat">
                    <strong>{selectedProvider.skills.length}</strong>
                    <span>Specialties</span>
                  </div>
                </div>

                <div className="provider-profile-section">
                  <h3>About</h3>
                  <p>{selectedProvider.description}</p>
                </div>

                <div className="provider-profile-section">
                  <h3>Contact</h3>
                  <p>
                    Phone: {selectedProvider.phone}<br />
                    Email: {selectedProvider.email}
                  </p>
                </div>

                <div className="provider-profile-section">
                  <h3>Skills</h3>
                  <div className="provider-cert-list">
                    {selectedProvider.skills.map((skill) => (
                      <span key={skill} className="provider-cert">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="provider-profile-section">
                  <h3>Certifications</h3>
                  <div className="provider-cert-list">
                    {selectedProvider.certifications.map((certification) => (
                      <span key={certification} className="provider-cert">{certification}</span>
                    ))}
                  </div>
                </div>

                <div className="provider-profile-section">
                  <h3>Services</h3>
                  <div className="provider-services-grid">
                    {selectedProvider.skills.map((skill) => (
                      <div key={skill} className="provider-service-mini">
                        <h4>{skill}</h4>
                        <p>Available through {selectedProvider.name}. Open Services to request a quote or compare providers.</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                  <button className="btn-primary" onClick={() => onNavigate("services")}>
                    View Services
                  </button>
                  <button className="btn-secondary" onClick={() => setSelectedProvider(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
