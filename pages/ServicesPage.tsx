import React, { useMemo, useState } from "react";
import { Icons } from "../components/Icons";

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  priceType: "fixed" | "hourly" | "per-sqft" | "project-based";
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  provider: string;
  verified: boolean;
  description: string;
  tags: string[];
  experience: number;
  completedProjects: number;
  location: string;
  availability: "immediate" | "1-week" | "2-weeks" | "custom";
  portfolioImages?: string[];
  certifications?: string[];
  specialties?: string[];
}

export interface ServiceProviderProfile {
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  responseTime: string;
  location: string;
  established: string;
  description: string;
  phone: string;
  email: string;
  website?: string;
  certifications: string[];
  teamSize?: string;
  coverageArea?: string[];
}

export interface ServiceCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tone: string;
  description: string;
  subcategories: string[];
}

type QuoteForm = {
  projectDetails: string;
  budget: string;
  timeline: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
};

const servicesPageStyles = `
* { box-sizing: border-box; }

.services-page {
  min-height: 100vh;
  background: #07070b;
  color: #e2e8f0;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.services-page button,
.services-page input,
.services-page select,
.services-page textarea {
  font: inherit;
}

.services-page ::-webkit-scrollbar { width: 8px; height: 8px; }
.services-page ::-webkit-scrollbar-track { background: #09090d; }
.services-page ::-webkit-scrollbar-thumb { background: #4338ca; border-radius: 999px; }

.services-shell {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.category-nav-row {
  display: flex;
  gap: 14px;
  align-items: center;
  padding-top: 20px;
}

.category-search,
.services-search,
.filter-search {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #94a3b8;
}

.category-search {
  min-width: 240px;
  min-height: 42px;
  border-radius: 999px;
  padding: 0 14px;
}

.category-search input,
.services-search input,
.filter-search input {
  width: 100%;
  border: none;
  background: transparent;
  color: #e2e8f0;
  outline: none;
}

.services-layout {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.sidebar {
  position: sticky;
  top: 90px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  border: 1px solid rgba(124, 58, 237, 0.24);
  background: rgba(124, 58, 237, 0.12);
  color: #c4b5fd;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
}

.filter-chip button,
.btn-reset {
  border: none;
  color: inherit;
  background: transparent;
  cursor: pointer;
}

.btn-reset {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 800;
}

.filter-group {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 14px 0;
}

.filter-group-title {
  width: 100%;
  border: none;
  background: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 14px;
  font-weight: 900;
}

.filter-search {
  margin: 12px 0;
  min-height: 38px;
  border-radius: 12px;
  padding: 0 12px;
}

.filter-options {
  display: grid;
  gap: 8px;
  max-height: 250px;
  overflow: auto;
  padding-right: 4px;
}

.filter-subgroup-title {
  color: #a78bfa;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  margin: 10px 0 6px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #94a3b8;
  font-size: 13px;
}

.filter-checkbox input {
  accent-color: #7c3aed;
}

.filter-checkbox label {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
}

.filter-badge { color: #64748b; }

.price-inputs {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 8px;
  align-items: center;
  margin-top: 12px;
}

.price-inputs input,
.rating-control input {
  width: 100%;
  min-height: 38px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
  padding: 0 10px;
  outline: none;
}

.range-helper {
  margin-top: 8px;
  color: #64748b;
  font-size: 12px;
}

.services-main {
  min-width: 0;
}

.services-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.services-search {
  flex: 1;
  min-height: 48px;
  border-radius: 14px;
  padding: 0 14px;
}

.results-summary {
  color: #94a3b8;
  font-size: 13px;
  white-space: nowrap;
}

.comparison-bar {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  border: 1px solid rgba(52, 211, 153, 0.18);
  background: rgba(5, 150, 105, 0.1);
  border-radius: 16px;
  padding: 12px 14px;
  margin-bottom: 18px;
}

.btn-compare {
  border: 1px solid rgba(167, 139, 250, 0.44);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  color: #f5f3ff;
  min-height: 36px;
  padding: 0 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 10px 22px rgba(0, 0, 0, 0.22);
}

.btn-compare:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.service-card {
  height: 100%;
  padding: 0;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}

.service-card:hover {
  transform: translateY(-8px);
  border-color: rgba(139, 92, 246, 0.28);
  box-shadow: 0 24px 50px rgba(0,0,0,0.34), 0 0 28px rgba(124, 58, 237, 0.1);
}

.service-image-wrap {
  position: relative;
  overflow: hidden;
}

.service-card img {
  display: block;
  width: 100%;
  height: 204px;
  object-fit: cover;
}

.service-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.floating-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
}

.icon-pill {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.38);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.service-card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.subcategory-pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(124, 58, 237, 0.18);
  color: #c4b5fd;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.service-card h3 {
  margin: 0 0 8px;
  color: #fff;
  font-size: 1.03rem;
  line-height: 1.35;
  min-height: 2.8rem;
}

.service-card p {
  margin: 0 0 16px;
  color: #7f8da6;
  font-size: 13px;
  line-height: 1.6;
  min-height: 4.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  min-height: 74px;
}

.service-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
}

.service-price-type {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.2);
  color: #34d399;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.price-rating-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
  margin-top: auto;
}

.service-price {
  color: #fff;
  font-weight: 900;
  font-size: 1.18rem;
}

.rating-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fbbf24;
  font-size: 13px;
  font-weight: 800;
}

.rating-pill span { color: #7f8da6; font-weight: 600; }

.availability-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 12px;
}

.availability-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.availability-immediate { background: #34d399; }
.availability-1-week { background: #fbbf24; }
.availability-2-weeks { background: #f97316; }
.availability-custom { background: #94a3b8; }

.btn-request-quote {
  width: 100%;
  min-height: 42px;
  margin-bottom: 14px;
  border: 1px solid rgba(167, 139, 250, 0.44);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  color: #f5f3ff;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(124, 58, 237, 0.2);
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.btn-request-quote:hover {
  transform: translateY(-2px);
  border-color: rgba(196, 181, 253, 0.68);
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.16), rgba(124, 58, 237, 0.08)), #211830;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22);
}

.provider-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  min-height: 60px;
}

.provider-avatar,
.seller-profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 900;
  background: linear-gradient(135deg, #a78bfa, #7c3aed);
  flex-shrink: 0;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 32px 0 8px;
}

.pagination-controls button {
  min-height: 44px;
  padding: 0 18px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  font-weight: 900;
  cursor: pointer;
}

.pagination-controls button:disabled {
  color: #64748b;
  cursor: not-allowed;
}

.pagination-info { color: #bfdbfe; }

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  width: min(1040px, 100%);
  max-height: 90vh;
  overflow: auto;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #0d0d14;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.5);
}

.modal-header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(13, 13, 20, 0.96);
}

.modal-header h2 {
  color: #fff;
  margin: 0;
  font-size: 1.2rem;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  cursor: pointer;
}

.modal-body { padding: 22px; }

.service-detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 24px;
}

.main-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.thumbnail-gallery {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin-top: 12px;
}

.thumbnail {
  width: 86px;
  height: 70px;
  border-radius: 10px;
  overflow: hidden;
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
  padding: 0;
  cursor: pointer;
  opacity: 0.78;
  transition: opacity 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.thumbnail:hover,
.thumbnail.active {
  opacity: 1;
  border-color: rgba(52, 211, 153, 0.75);
  transform: translateY(-1px);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info h3 {
  margin: 0 0 8px;
  color: #fff;
  font-size: 1.5rem;
}

.detail-price {
  color: #fff;
  font-size: 1.55rem;
  font-weight: 900;
  margin-bottom: 8px;
}

.experience-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  font-size: 12px;
  font-weight: 900;
}

.seller-certifications {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.seller-cert-tag {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 700;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0 18px;
}

.specs-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  padding: 10px 0;
  font-size: 13px;
}

.provider-card {
  padding: 16px;
  border-radius: 14px;
  background: rgba(124, 58, 237, 0.08);
  border: 1px solid rgba(124, 58, 237, 0.15);
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  align-items: stretch;
}

.modal-actions button {
  flex: 1;
  min-height: 52px;
  margin-bottom: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary {
  min-height: 42px;
  border-radius: 16px;
  border: 1px solid rgba(167, 139, 250, 0.28);
  background: rgba(255, 255, 255, 0.025);
  color: #e9d5ff;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  border-color: rgba(167, 139, 250, 0.5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 16px 34px rgba(0, 0, 0, 0.24);
}

.seller-profile-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.seller-profile-avatar {
  width: 58px;
  height: 58px;
  font-size: 20px;
}

.seller-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.seller-stat-card {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 14px;
}

.seller-stat-value {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 900;
}

.seller-stat-label {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 4px;
}

.seller-section {
  margin-top: 20px;
}

.seller-section h3,
.detail-info h4 {
  color: #fff;
  font-size: 14px;
  margin: 0 0 12px;
}

.quote-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.quote-form-grid input,
.quote-form-grid textarea,
.quote-form-grid select {
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #e2e8f0;
  outline: none;
  font-size: 13px;
}

.quote-form-grid textarea {
  padding: 12px 14px;
  min-height: 120px;
  resize: vertical;
}

.quote-form-grid label {
  color: #a78bfa;
  font-size: 12px;
  font-weight: 900;
  display: block;
  margin-bottom: 6px;
}

.form-full-width {
  grid-column: 1 / -1;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 54px 18px;
  border-radius: 24px;
  border: 1px dashed rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.02);
}

@media (max-width: 980px) {
  .services-layout,
  .service-detail-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .category-nav-row,
  .services-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  .quote-form-grid,
  .modal-actions {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .category-search {
    min-width: 0;
  }
}
`;

const serviceCategories: ServiceCategory[] = [
  {
    id: "contractors",
    title: "Contractors",
    subtitle: "Licensed builders",
    icon: <Icons.Building style={{ width: 22, height: 22 }} />,
    tone: "amber",
    description: "Verified construction contractors for residential, commercial, and industrial projects across Pakistan.",
    subcategories: ["Residential Construction", "Commercial Construction", "Renovation & Remodeling", "Grey Structure Specialists", "Finishing & Fit-out", "Turnkey Solutions", "Project Management", "Labor Contracting"],
  },
  {
    id: "interior-designers",
    title: "Interior Designers",
    subtitle: "Spaces that inspire",
    icon: <Icons.Sofa style={{ width: 22, height: 22 }} />,
    tone: "purple",
    description: "Professional interior designers for homes, offices, and commercial spaces.",
    subcategories: ["Residential Interior", "Commercial Interior", "Kitchen Design", "Bathroom Design", "Space Planning", "3D Visualization", "Furniture Selection", "Lighting Design"],
  },
  {
    id: "engineers",
    title: "Engineers",
    subtitle: "Structural experts",
    icon: <Icons.Calculator style={{ width: 22, height: 22 }} />,
    tone: "blue",
    description: "Licensed structural, civil, MEP, and geotechnical engineers.",
    subcategories: ["Structural Engineer", "Civil Engineer", "MEP Engineer", "Geotechnical Engineer", "Project Engineer", "Site Engineer", "Building Inspector", "Quantity Surveyor"],
  },
  {
    id: "architects",
    title: "Architects",
    subtitle: "Design to build",
    icon: <Icons.Ruler style={{ width: 22, height: 22 }} />,
    tone: "emerald",
    description: "Registered architects for design, planning, and construction supervision.",
    subcategories: ["Residential Architect", "Commercial Architect", "Landscape Architect", "Urban Planner", "CAD Drafting", "3D Modeling", "Building Permits", "Construction Supervision"],
  },
];

const serviceSpecialtiesTaxonomy: Record<string, { label: string; options: string[] }[]> = {
  contractors: [
    { label: "Project Type", options: ["3 marla house", "5 marla house", "7 marla house", "10 marla house", "1 kanal house", "Apartment building", "Commercial plaza", "Office renovation", "Shop fit-out"] },
    { label: "Service Scope", options: ["Full construction", "Grey structure only", "Finishing only", "Renovation", "Extension", "Roofing", "Foundation repair", "Waterproofing"] },
    { label: "Construction Stage", options: ["Foundation", "Structure", "Brickwork", "Plaster", "Flooring", "Electrical", "Plumbing", "Complete turnkey"] },
  ],
  "interior-designers": [
    { label: "Space Type", options: ["Living room", "Bedroom", "Kitchen", "Bathroom", "Home office", "Commercial office", "Retail store", "Restaurant"] },
    { label: "Design Style", options: ["Modern", "Contemporary", "Traditional Pakistani", "Minimalist", "Luxury", "Industrial", "Islamic/Arabic", "Fusion"] },
    { label: "Deliverables", options: ["2D Layouts", "3D Renders", "Material board", "Shopping list", "Construction drawings", "Supervision", "Full implementation"] },
  ],
  engineers: [
    { label: "Engineering Discipline", options: ["Structural analysis", "Foundation design", "Load calculations", "Seismic design", "MEP design", "HVAC design", "Electrical load", "Plumbing design", "Soil testing", "Site inspection"] },
    { label: "Project Phase", options: ["Pre-construction", "Design phase", "Construction phase", "Post-construction", "Renovation assessment", "Compliance audit"] },
    { label: "Documentation", options: ["Structural drawings", "MEP drawings", "BOQ preparation", "Technical specifications", "Progress reports", "Completion certificates"] },
  ],
  architects: [
    { label: "Design Services", options: ["Concept design", "Schematic design", "Design development", "Construction documents", "3D visualization", "Landscape design", "Master planning"] },
    { label: "House Size", options: ["3 marla", "5 marla", "7 marla", "10 marla", "1 kanal", "2 kanal", "Custom size", "Commercial building"] },
    { label: "Additional Services", options: ["Building permits", "NOC assistance", "Construction supervision", "Material selection", "Contractor coordination", "Project management", "Renovation design"] },
  ],
};

const serviceProviderProfiles: Record<string, ServiceProviderProfile> = {
  "BuildMaster Construction": {
    name: "BuildMaster Construction",
    avatar: "B",
    verified: true,
    rating: 4.9,
    responseTime: "< 2 hours",
    location: "Lahore, Punjab",
    established: "2008",
    description: "Full-service construction company specializing in residential and commercial projects across Punjab.",
    phone: "+92-42-111-222-333",
    email: "info@buildmaster.pk",
    website: "www.buildmaster.pk",
    certifications: ["PEC Registered", "ISO 9001", "Safety Certified", "BuildHive Verified"],
    teamSize: "50-100",
    coverageArea: ["Lahore", "Faisalabad", "Sheikhupura", "Kasur"],
  },
  "Elite Interior Studio": {
    name: "Elite Interior Studio",
    avatar: "E",
    verified: true,
    rating: 4.8,
    responseTime: "< 4 hours",
    location: "Karachi, Sindh",
    established: "2015",
    description: "Award-winning interior design firm specializing in luxury residential and hospitality projects.",
    phone: "+92-21-111-444-555",
    email: "design@eliteinterior.pk",
    certifications: ["PCATP Registered", "IIID Member", "Best Design Award 2023"],
    teamSize: "15-25",
    coverageArea: ["Karachi", "Hyderabad", "Thatta"],
  },
  "Structura Engineering": {
    name: "Structura Engineering",
    avatar: "S",
    verified: true,
    rating: 4.7,
    responseTime: "< 6 hours",
    location: "Islamabad",
    established: "2010",
    description: "Structural and MEP engineering consultancy with expertise in seismic design and sustainable buildings.",
    phone: "+92-51-111-777-888",
    email: "consult@structura.pk",
    certifications: ["PEC Registered", "ISO 9001", "LEED Accredited", "Structural Excellence Award"],
    coverageArea: ["Islamabad", "Rawalpindi", "Taxila", "Wah"],
  },
  "ArcVision Architects": {
    name: "ArcVision Architects",
    avatar: "A",
    verified: true,
    rating: 4.9,
    responseTime: "< 12 hours",
    location: "Lahore, Punjab",
    established: "2005",
    description: "Architectural design studio focused on residential and commercial architecture with sustainable practices.",
    phone: "+92-42-111-999-000",
    email: "studio@arcvision.pk",
    website: "www.arcvision.pk",
    certifications: ["PCATP Registered", "RAIBA Affiliated", "Green Building Certified"],
    teamSize: "20-30",
    coverageArea: ["Lahore", "Gujranwala", "Sialkot", "Gujrat"],
  },
  "Prime Contractors": {
    name: "Prime Contractors",
    avatar: "P",
    verified: true,
    rating: 4.6,
    responseTime: "< 5 hours",
    location: "Rawalpindi, Punjab",
    established: "2012",
    description: "Residential renovation and grey-structure teams for compact and mid-size builds.",
    phone: "+92-51-111-333-222",
    email: "projects@primecontractors.pk",
    certifications: ["PEC Registered", "Safety Certified"],
    teamSize: "25-50",
    coverageArea: ["Rawalpindi", "Islamabad", "Jhelum"],
  },
  "MEP Pro Consultants": {
    name: "MEP Pro Consultants",
    avatar: "M",
    verified: true,
    rating: 4.5,
    responseTime: "< 8 hours",
    location: "Karachi, Sindh",
    established: "2014",
    description: "MEP design, load calculations, HVAC planning, and site inspection services.",
    phone: "+92-21-111-222-909",
    email: "hello@meppro.pk",
    certifications: ["PEC Registered", "ASHRAE Member"],
    coverageArea: ["Karachi", "Hyderabad", "Sukkur"],
  },
};

const sampleServices: Service[] = [
  {
    id: "s1",
    name: "Complete House Construction - 5 Marla Turnkey",
    category: "contractors",
    subcategory: "Residential Construction",
    price: 4500000,
    priceType: "project-based",
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop",
    badge: "Top Rated",
    provider: "BuildMaster Construction",
    verified: true,
    description: "Turnkey construction from foundation to finishing with electrical, plumbing, and premium finishing supervision.",
    tags: ["turnkey", "residential", "5 marla house", "complete turnkey", "full construction"],
    experience: 16,
    completedProjects: 500,
    location: "Lahore",
    availability: "2-weeks",
    portfolioImages: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop"],
    certifications: ["PEC Registered", "ISO 9001"],
    specialties: ["Foundation", "Structure", "Finishing", "Electrical", "Plumbing"],
  },
  {
    id: "s2",
    name: "Luxury Villa Interior Design",
    category: "interior-designers",
    subcategory: "Residential Interior",
    price: 2500,
    priceType: "per-sqft",
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop",
    badge: "Featured",
    provider: "Elite Interior Studio",
    verified: true,
    description: "Full-service interior design with 3D visualization, material selection, furniture planning, and supervision.",
    tags: ["luxury", "interior", "residential", "3D Renders", "material board"],
    experience: 9,
    completedProjects: 200,
    location: "Karachi",
    availability: "1-week",
    portfolioImages: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop"],
    certifications: ["PCATP Registered", "IIID Member"],
    specialties: ["3D Rendering", "Material Selection", "Furniture Design", "Lighting Design"],
  },
  {
    id: "s3",
    name: "Structural Engineering Consultation",
    category: "engineers",
    subcategory: "Structural Engineer",
    price: 15000,
    priceType: "fixed",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop",
    provider: "Structura Engineering",
    verified: true,
    description: "Structural analysis and design for residential and commercial buildings with load calculations and seismic checks.",
    tags: ["structural analysis", "foundation design", "seismic design", "load calculations"],
    experience: 14,
    completedProjects: 350,
    location: "Islamabad",
    availability: "immediate",
    certifications: ["PEC Registered", "LEED Accredited"],
    specialties: ["Structural Analysis", "Foundation Design", "Seismic Design", "MEP Design"],
  },
  {
    id: "s4",
    name: "Architectural Design - 10 Marla Modern House",
    category: "architects",
    subcategory: "Residential Architect",
    price: 180000,
    priceType: "fixed",
    rating: 4.9,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&h=600&fit=crop",
    badge: "Featured",
    provider: "ArcVision Architects",
    verified: true,
    description: "Complete architectural design package including plans, elevations, 3D views, construction drawings, and permit support.",
    tags: ["architecture", "modern", "residential", "10 marla", "3D visualization"],
    experience: 19,
    completedProjects: 400,
    location: "Lahore",
    availability: "1-week",
    certifications: ["PCATP Registered", "Green Building Certified"],
    specialties: ["Concept Design", "3D Visualization", "Construction Documents", "Permit Assistance"],
  },
  {
    id: "s5",
    name: "Grey Structure Contractor for 10 Marla Homes",
    category: "contractors",
    subcategory: "Grey Structure Specialists",
    price: 2900000,
    priceType: "project-based",
    rating: 4.6,
    reviews: 74,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
    badge: "Verified Pro",
    provider: "Prime Contractors",
    verified: true,
    description: "Grey structure team for foundation, structure, brickwork, plaster, roofing, and waterproofing.",
    tags: ["grey structure only", "10 marla house", "foundation", "structure", "brickwork"],
    experience: 12,
    completedProjects: 240,
    location: "Rawalpindi",
    availability: "2-weeks",
    certifications: ["PEC Registered", "Safety Certified"],
    specialties: ["Foundation", "Brickwork", "Plaster", "Roofing", "Waterproofing"],
  },
  {
    id: "s6",
    name: "Office Renovation and Commercial Fit-out",
    category: "contractors",
    subcategory: "Renovation & Remodeling",
    price: 850000,
    priceType: "project-based",
    rating: 4.5,
    reviews: 61,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    provider: "BuildMaster Construction",
    verified: true,
    description: "Office renovation, shop fit-out, partitions, ceiling, flooring, paint, electrical, and final handover.",
    tags: ["office renovation", "shop fit-out", "commercial office", "finishing only"],
    experience: 16,
    completedProjects: 180,
    location: "Lahore",
    availability: "1-week",
    specialties: ["Partitions", "Ceiling", "Flooring", "Electrical", "Paint & polish"],
  },
  {
    id: "s7",
    name: "Kitchen Design with 3D Visualization",
    category: "interior-designers",
    subcategory: "Kitchen Design",
    price: 65000,
    priceType: "fixed",
    rating: 4.7,
    reviews: 48,
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
    provider: "Elite Interior Studio",
    verified: true,
    description: "Kitchen layout, cabinet planning, material board, 3D renders, and shopping list.",
    tags: ["Kitchen", "3D Renders", "shopping list", "material board", "modern"],
    experience: 9,
    completedProjects: 120,
    location: "Karachi",
    availability: "immediate",
    specialties: ["2D Layouts", "3D Renders", "Material Selection", "Cabinet Design"],
  },
  {
    id: "s8",
    name: "MEP Design Package for Residential Building",
    category: "engineers",
    subcategory: "MEP Engineer",
    price: 95000,
    priceType: "fixed",
    rating: 4.5,
    reviews: 93,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop",
    provider: "MEP Pro Consultants",
    verified: true,
    description: "Electrical load, plumbing design, HVAC planning, MEP drawings, BOQ, and site coordination notes.",
    tags: ["MEP design", "HVAC design", "electrical load", "plumbing design", "MEP drawings"],
    experience: 10,
    completedProjects: 210,
    location: "Karachi",
    availability: "1-week",
    certifications: ["PEC Registered", "ASHRAE Member"],
    specialties: ["Electrical Load", "HVAC Design", "Plumbing Design", "BOQ Preparation"],
  },
  {
    id: "s9",
    name: "Building Permit Drawings and NOC Assistance",
    category: "architects",
    subcategory: "Building Permits",
    price: 120000,
    priceType: "fixed",
    rating: 4.6,
    reviews: 52,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop",
    provider: "ArcVision Architects",
    verified: true,
    description: "Authority-compliant drawings, NOC assistance, revision support, and contractor coordination.",
    tags: ["Building permits", "NOC assistance", "construction documents", "contractor coordination"],
    experience: 19,
    completedProjects: 160,
    location: "Lahore",
    availability: "custom",
    certifications: ["PCATP Registered"],
    specialties: ["Building Permits", "NOC Assistance", "Construction Documents"],
  },
  {
    id: "s10",
    name: "Site Inspection and Progress Reporting",
    category: "engineers",
    subcategory: "Site Engineer",
    price: 12000,
    priceType: "hourly",
    rating: 4.4,
    reviews: 39,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop",
    provider: "Structura Engineering",
    verified: true,
    description: "On-site construction inspection, quality checks, progress reports, and compliance notes.",
    tags: ["site inspection", "progress reports", "construction phase", "compliance audit"],
    experience: 14,
    completedProjects: 300,
    location: "Rawalpindi",
    availability: "immediate",
    specialties: ["Site Inspection", "Progress Reports", "Compliance Audit"],
  },
  {
    id: "s11",
    name: "Retail Store Interior and Lighting Plan",
    category: "interior-designers",
    subcategory: "Commercial Interior",
    price: 1800,
    priceType: "per-sqft",
    rating: 4.6,
    reviews: 43,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    provider: "Elite Interior Studio",
    verified: true,
    description: "Retail store planning, lighting design, display zones, material board, and supervision.",
    tags: ["Retail store", "lighting design", "commercial interior", "supervision"],
    experience: 9,
    completedProjects: 88,
    location: "Karachi",
    availability: "2-weeks",
    specialties: ["Space Planning", "Lighting Design", "Material Board", "Full Implementation"],
  },
  {
    id: "s12",
    name: "Landscape Concept and Outdoor Planning",
    category: "architects",
    subcategory: "Landscape Architect",
    price: 75000,
    priceType: "fixed",
    rating: 4.5,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&h=600&fit=crop",
    provider: "ArcVision Architects",
    verified: true,
    description: "Outdoor planning, softscape, hardscape, driveway layout, lighting, and irrigation concept.",
    tags: ["landscape design", "master planning", "material selection", "concept design"],
    experience: 19,
    completedProjects: 95,
    location: "Gujranwala",
    availability: "custom",
    specialties: ["Landscape Design", "Master Planning", "Material Selection"],
  },
];

const defaultQuoteForm: QuoteForm = {
  projectDetails: "",
  budget: "",
  timeline: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  location: "",
};

const availabilityLabels: Record<Service["availability"], string> = {
  immediate: "Available Now",
  "1-week": "Within 1 Week",
  "2-weeks": "Within 2 Weeks",
  custom: "Custom Schedule",
};

const formatPriceType = (priceType: Service["priceType"]) =>
  priceType.replace("-", " ");

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate: _onNavigate }) => {
  const [searchParams, setSearchParams] = useState({
    query: "",
    categorySearch: "",
    specialtySearch: "",
    providerSearch: "",
  });
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<Service["availability"][]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [rating, setRating] = useState<number | null>(null);
  const [experienceMin, setExperienceMin] = useState(0);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [likedServices, setLikedServices] = useState<string[]>([]);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [comparisonItems, setComparisonItems] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedServiceImage, setSelectedServiceImage] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProviderProfile | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [quoteService, setQuoteService] = useState<Service | null>(null);
  const [quoteForm, setQuoteForm] = useState<QuoteForm>(defaultQuoteForm);
  const [toast, setToast] = useState<string | null>(null);

  const visibleCategories = useMemo(() => {
    const query = searchParams.categorySearch.trim().toLowerCase();
    if (!query) return serviceCategories;
    return serviceCategories.filter((category) =>
      [category.title, category.subtitle, category.description, ...category.subcategories]
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [searchParams.categorySearch]);

  const activeSpecialtyGroups = useMemo(() => {
    const sourceGroups =
      activeCategory === "all"
        ? Object.values(serviceSpecialtiesTaxonomy).flat()
        : serviceSpecialtiesTaxonomy[activeCategory] || [];
    const query = searchParams.specialtySearch.trim().toLowerCase();
    return sourceGroups
      .map((group) => ({
        ...group,
        options: group.options.filter((option) =>
          !query ||
          option.toLowerCase().includes(query) ||
          group.label.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [activeCategory, searchParams.specialtySearch]);

  const visibleProviders = useMemo(() => {
    const query = searchParams.providerSearch.trim().toLowerCase();
    return Array.from(new Set(sampleServices.map((service) => service.provider)))
      .filter((provider) => {
        const inCategory = sampleServices.some(
          (service) =>
            service.provider === provider &&
            (activeCategory === "all" || service.category === activeCategory)
        );
        return inCategory && (!query || provider.toLowerCase().includes(query));
      })
      .sort();
  }, [activeCategory, searchParams.providerSearch]);

  const serviceMatchesSpecialty = (service: Service, specialty: string) => {
    const needle = specialty.toLowerCase();
    return [
      service.subcategory,
      ...service.tags,
      ...(service.specialties || []),
      ...(service.certifications || []),
    ].some((value) => value.toLowerCase().includes(needle));
  };

  const filteredServices = useMemo(() => {
    const query = searchParams.query.trim().toLowerCase();
    return sampleServices
      .filter((service) => activeCategory === "all" || service.category === activeCategory)
      .filter((service) =>
        !query ||
        [
          service.name,
          service.description,
          service.provider,
          service.location,
          service.subcategory,
          ...service.tags,
          ...(service.specialties || []),
        ].some((value) => value.toLowerCase().includes(query))
      )
      .filter((service) =>
        selectedSpecialties.length === 0 ||
        selectedSpecialties.some((specialty) => serviceMatchesSpecialty(service, specialty))
      )
      .filter((service) => selectedProviders.length === 0 || selectedProviders.includes(service.provider))
      .filter((service) => selectedAvailability.length === 0 || selectedAvailability.includes(service.availability))
      .filter((service) => !showLikedOnly || likedServices.includes(service.id))
      .filter((service) => service.price >= priceRange[0] && service.price <= priceRange[1])
      .filter((service) => rating === null || service.rating >= rating)
      .filter((service) => service.experience >= experienceMin);
  }, [
    activeCategory,
    experienceMin,
    priceRange,
    rating,
    searchParams.query,
    selectedAvailability,
    selectedProviders,
    selectedSpecialties,
    showLikedOnly,
    likedServices,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / itemsPerPage));
  const displayedServices = filteredServices.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const comparedServices = comparisonItems
    .map((serviceId) => sampleServices.find((service) => service.id === serviceId))
    .filter((service): service is Service => Boolean(service));

  const activeFilterCount =
    selectedSpecialties.length +
    selectedProviders.length +
    selectedAvailability.length +
    (rating !== null ? 1 : 0) +
    (experienceMin > 0 ? 1 : 0) +
    (showLikedOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 5000000 ? 1 : 0) +
    (searchParams.query.trim() ? 1 : 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    scrollToTop();
    requestAnimationFrame(scrollToTop);
    window.setTimeout(scrollToTop, 80);
  };

  const setCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSelectedSpecialties([]);
    setSelectedProviders([]);
    setPage(1);
  };

  const toggleValue = <T,>(value: T, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
    setPage(1);
  };

  const toggleComparison = (serviceId: string) => {
    setComparisonItems((current) => {
      if (current.includes(serviceId)) return current.filter((id) => id !== serviceId);
      if (current.length >= 3) return [current[1], current[2], serviceId];
      return [...current, serviceId];
    });
  };

  const showToast = (message: string, timeout = 2200) => {
    setToast(message);
    window.setTimeout(() => setToast(null), timeout);
  };

  const openQuoteModal = (service: Service) => {
    setQuoteService(service);
    setQuoteForm(defaultQuoteForm);
  };

  const clearAllFilters = () => {
    setSearchParams({ query: "", categorySearch: "", specialtySearch: "", providerSearch: "" });
    setActiveCategory("all");
    setSelectedSpecialties([]);
    setSelectedProviders([]);
    setSelectedAvailability([]);
    setShowLikedOnly(false);
    setPriceRange([0, 5000000]);
    setRating(null);
    setExperienceMin(0);
    setPage(1);
  };

  const renderStar = () => <Icons.Star style={{ width: 16, height: 16, fill: "currentColor" }} />;

  const renderServiceCard = (service: Service) => (
    <article
      key={service.id}
      className="service-card"
      onClick={() => {
        setSelectedService(service);
        setSelectedServiceImage(service.image);
      }}
    >
      <div className="service-image-wrap">
        <img src={service.image} alt={service.name} />
        {service.badge && <span className="service-badge">{service.badge}</span>}
        <div className="floating-actions">
          <button
            className="icon-pill"
            aria-label={likedServices.includes(service.id) ? "Remove from liked services" : "Like service"}
            onClick={(event) => {
              event.stopPropagation();
              setLikedServices((current) =>
                current.includes(service.id)
                  ? current.filter((id) => id !== service.id)
                  : [...current, service.id]
              );
              showToast(likedServices.includes(service.id) ? "Removed from liked services" : "Added to liked services");
            }}
          >
            <Icons.Heart
              style={{
                width: 18,
                height: 18,
                fill: likedServices.includes(service.id) ? "currentColor" : "none",
              }}
            />
          </button>
          <label className="icon-pill" onClick={(event) => event.stopPropagation()}>
            <input
              type="checkbox"
              checked={comparisonItems.includes(service.id)}
              onChange={() => toggleComparison(service.id)}
              style={{ width: 16, height: 16, accentColor: "#a78bfa", cursor: "pointer" }}
              aria-label="Compare service"
            />
          </label>
        </div>
      </div>

      <div className="service-card-body">
        <span className="subcategory-pill">{service.subcategory}</span>
        <h3>{service.name}</h3>
        <p>{service.description}</p>

        <div className="service-meta-row">
          <span className="service-meta-item"><Icons.Award style={{ width: 14, height: 14 }} />{service.experience} years</span>
          <span className="service-meta-item"><Icons.Folder style={{ width: 14, height: 14 }} />{service.completedProjects} projects</span>
          <span className="service-meta-item"><Icons.MapPin style={{ width: 14, height: 14 }} />{service.location}</span>
        </div>

        <div className="price-rating-row">
          <div>
            <div className="service-price">Rs. {service.price.toLocaleString()}</div>
            <span className="service-price-type">{formatPriceType(service.priceType)}</span>
          </div>
          <div className="rating-pill">
            {renderStar()}
            {service.rating.toFixed(1)}
            <span>({service.reviews})</span>
          </div>
        </div>

        <div className="availability-indicator">
          <span className={`availability-dot availability-${service.availability}`} />
          {availabilityLabels[service.availability]}
        </div>

        <button
          type="button"
          className="btn-request-quote"
          onClick={(event) => {
            event.stopPropagation();
            openQuoteModal(service);
          }}
        >
          <Icons.Message style={{ width: 16, height: 16 }} />
          Request Quote
        </button>

        <div
          className="provider-row"
          onClick={(event) => {
            event.stopPropagation();
            setSelectedProvider(serviceProviderProfiles[service.provider]);
          }}
        >
          <div className="provider-avatar">{service.provider.charAt(0)}</div>
          <span style={{ color: "#9aa9c2", fontSize: 13 }}>{service.provider}</span>
          {service.verified && <Icons.Check style={{ width: 16, height: 16, color: "#34d399" }} />}
        </div>
      </div>
    </article>
  );

  return (
    <div className="services-page">
      <style>{servicesPageStyles}</style>

      <div className="services-shell" style={{ paddingBottom: 0 }}>
        <div className="category-nav-row">
          <div className="category-search">
            <Icons.Search style={{ width: 18, height: 18 }} />
            <input
              type="search"
              placeholder="Search service categories"
              value={searchParams.categorySearch}
              onChange={(event) => setSearchParams((current) => ({ ...current, categorySearch: event.target.value }))}
            />
          </div>
          <nav style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 0 14px", scrollbarWidth: "none", flex: 1 }}>
            <button
              onClick={() => setCategory("all")}
              style={{
                minHeight: 42,
                padding: "0 18px",
                borderRadius: 999,
                border: activeCategory === "all" ? "1px solid rgba(167, 139, 250, 0.44)" : "1px solid rgba(255,255,255,0.08)",
                background: activeCategory === "all" ? "linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426" : "rgba(255,255,255,0.03)",
                color: activeCategory === "all" ? "#f5f3ff" : "#94a3b8",
                boxShadow: activeCategory === "all" ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 22px rgba(0,0,0,0.22)" : "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              All Services
            </button>
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategory(category.id)}
                style={{
                  minHeight: 42,
                  padding: "0 18px",
                  borderRadius: 999,
                  border: activeCategory === category.id ? "1px solid rgba(167, 139, 250, 0.44)" : "1px solid rgba(255,255,255,0.08)",
                  background: activeCategory === category.id ? "linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426" : "rgba(255,255,255,0.03)",
                  color: activeCategory === category.id ? "#f5f3ff" : "#94a3b8",
                  boxShadow: activeCategory === category.id ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 22px rgba(0,0,0,0.22)" : "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {category.icon}
                {category.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="services-shell">
        <div className="services-layout">
          <aside className="sidebar">
            <div className="active-filters">
              {selectedSpecialties.map((specialty) => (
                <div key={specialty} className="filter-chip">
                  {specialty}
                  <button onClick={() => toggleValue(specialty, setSelectedSpecialties)}>x</button>
                </div>
              ))}
              {selectedProviders.map((provider) => (
                <div key={provider} className="filter-chip">
                  {provider}
                  <button onClick={() => toggleValue(provider, setSelectedProviders)}>x</button>
                </div>
              ))}
              {selectedAvailability.map((availability) => (
                <div key={availability} className="filter-chip">
                  {availabilityLabels[availability]}
                  <button onClick={() => toggleValue(availability, setSelectedAvailability)}>x</button>
                </div>
              ))}
              {showLikedOnly && (
                <div className="filter-chip">
                  Liked Services Only
                  <button
                    onClick={() => {
                      setShowLikedOnly(false);
                      setPage(1);
                    }}
                  >
                    x
                  </button>
                </div>
              )}
              {activeFilterCount > 0 && <button className="btn-reset" onClick={clearAllFilters}>Reset Filters ({activeFilterCount})</button>}
            </div>

            <div className="filter-group">
              <button className="filter-group-title">Specialties</button>
              <div className="filter-search">
                <Icons.Search style={{ width: 16, height: 16 }} />
                <input
                  type="search"
                  placeholder="Search specialties"
                  value={searchParams.specialtySearch}
                  onChange={(event) => setSearchParams((current) => ({ ...current, specialtySearch: event.target.value }))}
                />
              </div>
              <div className="filter-options">
                {activeSpecialtyGroups.map((group) => (
                  <div key={group.label}>
                    <div className="filter-subgroup-title">{group.label}</div>
                    {group.options.map((specialty) => (
                      <div key={specialty} className="filter-checkbox">
                        <input
                          id={`specialty-${specialty}`}
                          type="checkbox"
                          checked={selectedSpecialties.includes(specialty)}
                          onChange={() => toggleValue(specialty, setSelectedSpecialties)}
                        />
                        <label htmlFor={`specialty-${specialty}`}>
                          <span>{specialty}</span>
                          <span className="filter-badge">
                            ({sampleServices.filter((service) => serviceMatchesSpecialty(service, specialty)).length})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <button className="filter-group-title">Price Range</button>
              <div className="price-inputs">
                <input
                  type="number"
                  value={priceRange[0]}
                  min={0}
                  onChange={(event) => {
                    setPriceRange([Number(event.target.value), priceRange[1]]);
                    setPage(1);
                  }}
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  min={0}
                  onChange={(event) => {
                    setPriceRange([priceRange[0], Number(event.target.value)]);
                    setPage(1);
                  }}
                  placeholder="Max"
                />
              </div>
              <div className="range-helper">Prices use each service's listed price type.</div>
            </div>

            <div className="filter-group">
              <button className="filter-group-title">Providers</button>
              <div className="filter-search">
                <Icons.Search style={{ width: 16, height: 16 }} />
                <input
                  type="search"
                  placeholder="Search providers"
                  value={searchParams.providerSearch}
                  onChange={(event) => setSearchParams((current) => ({ ...current, providerSearch: event.target.value }))}
                />
              </div>
              <div className="filter-options">
                {visibleProviders.map((provider) => (
                  <div key={provider} className="filter-checkbox">
                    <input
                      id={`provider-${provider}`}
                      type="checkbox"
                      checked={selectedProviders.includes(provider)}
                      onChange={() => toggleValue(provider, setSelectedProviders)}
                    />
                    <label htmlFor={`provider-${provider}`}>
                      <span>{provider}</span>
                      <span className="filter-badge">({sampleServices.filter((service) => service.provider === provider).length})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <button className="filter-group-title">Availability</button>
              <div className="filter-options">
                {(Object.keys(availabilityLabels) as Service["availability"][]).map((availability) => (
                  <div key={availability} className="filter-checkbox">
                    <input
                      id={`availability-${availability}`}
                      type="checkbox"
                      checked={selectedAvailability.includes(availability)}
                      onChange={() => toggleValue(availability, setSelectedAvailability)}
                    />
                    <label htmlFor={`availability-${availability}`}>
                      <span>{availabilityLabels[availability]}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-checkbox">
                <input
                  id="liked-services-only"
                  type="checkbox"
                  checked={showLikedOnly}
                  onChange={() => {
                    setShowLikedOnly((current) => !current);
                    setPage(1);
                    scrollToTop();
                    requestAnimationFrame(scrollToTop);
                    window.setTimeout(scrollToTop, 80);
                  }}
                />
                <label htmlFor="liked-services-only">
                  <span>Show Liked Services Only ({likedServices.length})</span>
                </label>
              </div>
            </div>

            <div className="filter-group">
              <button className="filter-group-title">Rating & Experience</button>
              <div className="rating-control" style={{ display: "grid", gap: 10, marginTop: 12 }}>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={rating ?? 0}
                  onChange={(event) => {
                    const next = Math.min(5, Math.max(0, Number(event.target.value)));
                    setRating(next === 0 ? null : next);
                    setPage(1);
                  }}
                  placeholder="Minimum rating"
                />
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={experienceMin}
                  onChange={(event) => {
                    setExperienceMin(Math.max(0, Number(event.target.value)));
                    setPage(1);
                  }}
                  placeholder="Minimum experience"
                />
              </div>
            </div>
          </aside>

          <main className="services-main">
            <div className="services-toolbar">
              <div className="services-search">
                <Icons.Search style={{ width: 18, height: 18 }} />
                <input
                  type="search"
                  placeholder="Search services, providers, tags, or locations"
                  value={searchParams.query}
                  onChange={(event) => {
                    setSearchParams((current) => ({ ...current, query: event.target.value }));
                    setPage(1);
                  }}
                />
              </div>
              <span className="results-summary">{filteredServices.length} services found</span>
            </div>

            {comparisonItems.length > 0 && (
              <div className="comparison-bar">
                <p style={{ margin: 0 }}>{comparisonItems.length} services selected for comparison</p>
                <button className="btn-compare" disabled={comparisonItems.length < 2} onClick={() => setShowCompareModal(true)}>
                  Compare Services
                </button>
              </div>
            )}

            <div className="service-grid">
              {displayedServices.length > 0 ? (
                displayedServices.map((service) => renderServiceCard(service))
              ) : (
                <div className="empty-state">
                  <Icons.Search style={{ width: 48, height: 48, color: "#a78bfa" }} />
                  <h3 style={{ color: "#fff", margin: "14px 0 8px" }}>No services found</h3>
                  <p style={{ color: "#7f8da6", margin: 0 }}>Try adjusting search or filters.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls">
                <button disabled={page === 1} onClick={() => handlePageChange(Math.max(1, page - 1))}>Previous</button>
                <span className="pagination-info">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => handlePageChange(Math.min(totalPages, page + 1))}>Next</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedService && (
        <div className="modal-backdrop" onClick={() => setSelectedService(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedService.name}</h2>
              <button className="modal-close" onClick={() => setSelectedService(null)}>x</button>
            </div>
            <div className="modal-body">
              <div className="service-detail-grid">
                <div>
                  {(() => {
                    const galleryImages = [
                      selectedService.image,
                      ...(selectedService.portfolioImages || []),
                    ];
                    const activeImage =
                      selectedServiceImage && galleryImages.includes(selectedServiceImage)
                        ? selectedServiceImage
                        : selectedService.image;

                    return (
                      <>
                        <img src={activeImage} alt={selectedService.name} className="main-image" />
                        {galleryImages.length > 1 && (
                          <div className="thumbnail-gallery">
                            {galleryImages.map((image, index) => (
                              <button
                                key={`${image}-${index}`}
                                type="button"
                                className={`thumbnail ${activeImage === image ? "active" : ""}`}
                                onClick={() => setSelectedServiceImage(image)}
                                aria-label={`View service image ${index + 1}`}
                              >
                                <img src={image} alt={`Service image ${index + 1}`} />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                  {/* {selectedService.portfolioImages && (
                    <div className="thumbnail-gallery">
                      {selectedService.portfolioImages.map((image, index) => (
                        <div key={`${image}-${index}`} className="thumbnail">
                          <img src={image} alt={`Portfolio ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  )} */}
                </div>
                <div className="detail-info">
                  <h3>{selectedService.name}</h3>
                  <div className="detail-price">Rs. {selectedService.price.toLocaleString()}</div>
                  <span className="service-price-type">{formatPriceType(selectedService.priceType)}</span>
                  <div className="service-meta-row" style={{ marginTop: 16 }}>
                    <span className="experience-badge">{selectedService.experience}+ Years Experience</span>
                    <span className="service-meta-item">{selectedService.completedProjects} Projects Completed</span>
                    <span className="service-meta-item">{availabilityLabels[selectedService.availability]}</span>
                  </div>
                  <div className="rating-pill" style={{ marginBottom: 16 }}>
                    {renderStar()}
                    {selectedService.rating.toFixed(1)}
                    <span>({selectedService.reviews} reviews)</span>
                  </div>
                  <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>{selectedService.description}</p>

                  {selectedService.specialties && (
                    <div style={{ marginBottom: 18 }}>
                      <h4>Specialties</h4>
                      <div className="seller-certifications">
                        {selectedService.specialties.map((specialty) => (
                          <span key={specialty} className="seller-cert-tag">{specialty}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedService.certifications && (
                    <>
                      <h4>Certifications</h4>
                      <table className="specs-table">
                        <tbody>
                          {selectedService.certifications.map((certification) => (
                            <tr key={certification}>
                              <td><Icons.Check style={{ width: 14, height: 14, color: "#34d399", marginRight: 6, display: "inline" }} />{certification}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}

                  <div className="provider-card">
                    <p style={{ color: "#cbd5e1", margin: 0, fontSize: 13 }}>
                      <strong style={{ color: "#fff" }}>Provider:</strong> {selectedService.provider}
                      {selectedService.verified && <span style={{ color: "#34d399", marginLeft: 8, fontWeight: 800 }}>Verified</span>}
                    </p>
                  </div>

                  <div className="modal-actions">
                    <button className="btn-request-quote" onClick={() => openQuoteModal(selectedService)}>
                      <Icons.Message style={{ width: 16, height: 16 }} />
                      Request Quote
                    </button>
                    <button className="btn-secondary" onClick={() => setSelectedProvider(serviceProviderProfiles[selectedService.provider])}>
                      View Provider Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {quoteService && (
        <div className="modal-backdrop" onClick={() => setQuoteService(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Quote - {quoteService.name}</h2>
              <button className="modal-close" onClick={() => setQuoteService(null)}>x</button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  showToast("Quote request sent successfully!", 3000);
                  setQuoteService(null);
                }}
              >
                <div className="quote-form-grid">
                  <div className="form-full-width">
                    <label>Project Details</label>
                    <textarea
                      placeholder="Describe your project requirements, scope, and any specific needs..."
                      value={quoteForm.projectDetails}
                      onChange={(event) => setQuoteForm({ ...quoteForm, projectDetails: event.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Estimated Budget (PKR)</label>
                    <input
                      type="number"
                      placeholder="e.g., 5000000"
                      value={quoteForm.budget}
                      onChange={(event) => setQuoteForm({ ...quoteForm, budget: event.target.value })}
                    />
                  </div>
                  <div>
                    <label>Desired Timeline</label>
                    <select
                      value={quoteForm.timeline}
                      onChange={(event) => setQuoteForm({ ...quoteForm, timeline: event.target.value })}
                      required
                    >
                      <option value="">Select timeline</option>
                      <option value="urgent">Urgent (ASAP)</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="3-months">1-3 months</option>
                      <option value="6-months">3-6 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label>Your Name</label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={quoteForm.contactName}
                      onChange={(event) => setQuoteForm({ ...quoteForm, contactName: event.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+92-XXX-XXXXXXX"
                      value={quoteForm.contactPhone}
                      onChange={(event) => setQuoteForm({ ...quoteForm, contactPhone: event.target.value })}
                      required
                    />
                  </div>
                  <div className="form-full-width">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={quoteForm.contactEmail}
                      onChange={(event) => setQuoteForm({ ...quoteForm, contactEmail: event.target.value })}
                      required
                    />
                  </div>
                  <div className="form-full-width">
                    <label>Project Location</label>
                    <input
                      type="text"
                      placeholder="City, Area/Locality"
                      value={quoteForm.location}
                      onChange={(event) => setQuoteForm({ ...quoteForm, location: event.target.value })}
                      required
                    />
                  </div>
                </div>
                <div style={{ marginTop: 24 }}>
                  <button type="submit" className="btn-request-quote" style={{ width: "100%" }}>
                    <Icons.ArrowRight style={{ width: 16, height: 16 }} />
                    Send Quote Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedProvider && (
        <div className="modal-backdrop" onClick={() => setSelectedProvider(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProvider.name}</h2>
              <button className="modal-close" onClick={() => setSelectedProvider(null)}>x</button>
            </div>
            <div className="modal-body">
              <div className="seller-profile-header">
                <div className="seller-profile-avatar">{selectedProvider.avatar}</div>
                <div>
                  <h3 style={{ color: "#fff", margin: "0 0 6px", fontSize: "1.4rem" }}>
                    {selectedProvider.name}
                    {selectedProvider.verified && <span style={{ color: "#34d399", marginLeft: 10, fontSize: 14 }}>Verified</span>}
                  </h3>
                  <p style={{ color: "#94a3b8", margin: 0 }}>{selectedProvider.location} - Est. {selectedProvider.established}</p>
                </div>
              </div>

              <div className="seller-stats-grid">
                <div className="seller-stat-card">
                  <div className="seller-stat-value">{selectedProvider.rating.toFixed(1)}</div>
                  <div className="seller-stat-label">Rating</div>
                </div>
                <div className="seller-stat-card">
                  <div className="seller-stat-value">{sampleServices.filter((service) => service.provider === selectedProvider.name).length}</div>
                  <div className="seller-stat-label">Services</div>
                </div>
                <div className="seller-stat-card">
                  <div className="seller-stat-value">{selectedProvider.responseTime}</div>
                  <div className="seller-stat-label">Response</div>
                </div>
                {selectedProvider.coverageArea && (
                  <div className="seller-stat-card">
                    <div className="seller-stat-value">{selectedProvider.coverageArea.length}</div>
                    <div className="seller-stat-label">Cities Served</div>
                  </div>
                )}
              </div>

              <div className="seller-section">
                <h3>About</h3>
                <p style={{ color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>{selectedProvider.description}</p>
              </div>

              <div className="seller-section">
                <h3>Contact</h3>
                <p style={{ color: "#cbd5e1", lineHeight: 1.8, margin: 0 }}>
                  Phone: {selectedProvider.phone}<br />
                  Email: {selectedProvider.email}
                  {selectedProvider.website && <><br />Website: {selectedProvider.website}</>}
                </p>
              </div>

              <div className="seller-section">
                <h3>Certifications</h3>
                <div className="seller-certifications">
                  {selectedProvider.certifications.map((certification) => (
                    <span key={certification} className="seller-cert-tag">{certification}</span>
                  ))}
                </div>
              </div>

              {selectedProvider.coverageArea && (
                <div className="seller-section">
                  <h3>Coverage Area</h3>
                  <div className="seller-certifications">
                    {selectedProvider.coverageArea.map((city) => (
                      <span key={city} className="seller-cert-tag">{city}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProvider.teamSize && (
                <div className="seller-section">
                  <h3>Team Size</h3>
                  <p style={{ color: "#cbd5e1", margin: 0 }}>{selectedProvider.teamSize} professionals</p>
                </div>
              )}

              <div className="seller-section">
                <h3>Services</h3>
                <div className="service-grid">
                  {sampleServices
                    .filter((service) => service.provider === selectedProvider.name)
                    .slice(0, 4)
                    .map((service) => renderServiceCard(service))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCompareModal && (
        <div className="modal-backdrop" onClick={() => setShowCompareModal(false)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Service Comparison</h2>
              <button className="modal-close" onClick={() => setShowCompareModal(false)}>x</button>
            </div>
            <div className="modal-body">
              <table className="specs-table">
                <tbody>
                  <tr>
                    <td>Service</td>
                    {comparedServices.map((service) => <td key={`${service.id}-name`}>{service.name}</td>)}
                  </tr>
                  <tr>
                    <td>Price</td>
                    {comparedServices.map((service) => <td key={`${service.id}-price`}>Rs. {service.price.toLocaleString()} ({formatPriceType(service.priceType)})</td>)}
                  </tr>
                  <tr>
                    <td>Rating</td>
                    {comparedServices.map((service) => <td key={`${service.id}-rating`}>{service.rating.toFixed(1)} / 5</td>)}
                  </tr>
                  <tr>
                    <td>Experience</td>
                    {comparedServices.map((service) => <td key={`${service.id}-experience`}>{service.experience} years</td>)}
                  </tr>
                  <tr>
                    <td>Availability</td>
                    {comparedServices.map((service) => <td key={`${service.id}-availability`}>{availabilityLabels[service.availability]}</td>)}
                  </tr>
                  <tr>
                    <td>Provider</td>
                    {comparedServices.map((service) => <td key={`${service.id}-provider`}>{service.provider}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 80,
          borderRadius: 14,
          background: "rgba(15, 23, 42, 0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#fff",
          padding: "12px 16px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
          fontWeight: 800,
          fontSize: 13,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
};
