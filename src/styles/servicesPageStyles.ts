export const servicesPageStyles = `
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
  text-align: justify;
  text-justify: inter-word;
  min-height: 42px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: nowrap;
  min-height: 30px;
  overflow: hidden;
}

.service-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.service-meta-item svg {
  flex-shrink: 0;
}

.service-meta-item span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
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

export default servicesPageStyles;
