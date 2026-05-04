export const cartPageStyles = `
* { box-sizing: border-box; }

.cart-page {
  min-height: 100vh;
  background:
    radial-gradient(1100px 520px at 6% -8%, rgba(124, 58, 237, 0.22), transparent 45%),
    radial-gradient(900px 460px at 98% 6%, rgba(167, 139, 250, 0.18), transparent 45%),
    linear-gradient(180deg, #090a10 0%, #0d0d16 100%);
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.cart-page button,
.cart-page input,
.cart-page select {
  font: inherit;
}

.cart-page ::-webkit-scrollbar { width: 8px; height: 8px; }
.cart-page ::-webkit-scrollbar-track { background: #09090d; }
.cart-page ::-webkit-scrollbar-thumb { background: #5b46b8; border-radius: 999px; }
.cart-page ::-webkit-scrollbar-thumb:hover { background: #7c6ada; }

.cart-shell {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.cart-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 28px;
}

.cart-page-header h1 {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0 0 8px;
}

.cart-page-header p {
  color: #94a3b8;
  margin: 0;
  font-size: 14px;
}

.btn-clear-cart {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.22);
  background: rgba(239, 68, 68, 0.08);
  color: #f87171;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 32px;
}

.cart-items-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  gap: 20px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.cart-item:hover {
  border-color: rgba(139, 92, 246, 0.26);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.12);
}

.cart-item-image-wrap {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
}

.cart-item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cart-image-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.cart-item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.cart-item-name {
  margin: 0;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item-description {
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.cart-item-category {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(124, 58, 237, 0.18);
  color: #c4b5fd;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.cart-item-seller {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 12px;
}

.seller-avatar {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a78bfa, #7c3aed);
  color: #fff;
  font-size: 10px;
  font-weight: 900;
}

.cart-item-price {
  color: #fff;
  font-size: 1.15rem;
  font-weight: 900;
}

.cart-item-unit {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.quantity-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: rgba(124, 58, 237, 0.15);
  color: #c4b5fd;
}

.quantity-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-value {
  width: 44px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  border: none;
  background: none;
  outline: none;
  -moz-appearance: textfield;
}

.quantity-value::-webkit-outer-spin-button,
.quantity-value::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.cart-item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  min-width: 190px;
}

.cart-item-total {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 900;
  text-align: right;
}

.cart-action-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-remove,
.btn-save-later {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-remove {
  border: 1px solid rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.08);
  color: #f87171;
}

.btn-remove:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.35);
  transform: translateY(-1px);
}

.btn-save-later {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
}

.btn-save-later:hover {
  background: rgba(124, 58, 237, 0.1);
  border-color: rgba(124, 58, 237, 0.3);
  color: #c4b5fd;
}

.empty-cart {
  text-align: center;
  padding: 80px 24px;
  border-radius: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.empty-cart-icon {
  color: #a78bfa;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.empty-cart h2,
.empty-cart h3 {
  color: #fff;
  margin: 0 0 12px;
}

.empty-cart p {
  color: #94a3b8;
  margin: 0 auto 24px;
  max-width: 420px;
}

.order-summary {
  position: sticky;
  top: 100px;
  height: fit-content;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  padding: 24px;
}

.summary-title {
  margin: 0 0 20px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 900;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  color: #94a3b8;
  font-size: 14px;
}

.summary-row:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.summary-row.discount {
  color: #34d399;
}

.summary-row.total {
  color: #fff;
  font-size: 1.15rem;
  font-weight: 900;
  padding-top: 16px;
  margin-top: 8px;
  border-top: 2px solid rgba(124, 58, 237, 0.3);
}

.promo-section,
.shipping-section,
.payment-section,
.trust-badges {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.promo-input-row {
  display: flex;
  gap: 8px;
}

.promo-input,
.address-form-grid input,
.address-form-grid select {
  width: 100%;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #e2e8f0;
  outline: none;
  font-size: 13px;
}

.promo-input:focus,
.address-form-grid input:focus,
.address-form-grid select:focus {
  border-color: rgba(124, 58, 237, 0.45);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.12);
}

.btn-apply {
  padding: 0 16px;
  min-height: 40px;
  border-radius: 14px;
  border: 1px solid rgba(167, 139, 250, 0.44);
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  color: #f5f3ff;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 10px 22px rgba(0, 0, 0, 0.22);
}

.promo-applied {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(52, 211, 153, 0.08);
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.promo-applied span {
  color: #34d399;
  font-size: 13px;
  font-weight: 800;
}

.promo-remove {
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
}

.section-label {
  display: inline-block;
  padding: 0 0 5px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid rgba(167, 139, 250, 0.45);
  color: #d9ccff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.address-card,
.payment-option {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.25s ease;
  margin-bottom: 10px;
}

.address-card {
  padding: 14px;
}

.address-card:hover,
.payment-option:hover {
  border-color: rgba(124, 58, 237, 0.3);
  background: rgba(124, 58, 237, 0.05);
}

.address-card.selected,
.payment-option.selected {
  border-color: rgba(124, 58, 237, 0.5);
  background: rgba(124, 58, 237, 0.08);
}

.address-name,
.payment-name {
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  margin-bottom: 4px;
}

.address-text,
.payment-meta {
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
}

.address-badge {
  display: inline-block;
  margin-top: 8px;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(52, 211, 153, 0.1);
  color: #34d399;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
}

.btn-add-address {
  width: 100%;
  min-height: 44px;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.02);
  color: #94a3b8;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

.payment-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  color: #c4b5fd;
  flex-shrink: 0;
}

.payment-info {
  flex: 1;
  min-width: 0;
}

.btn-checkout,
.btn-secondary {
  min-height: 52px;
  border-radius: 16px;
  font-weight: 900;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
}

.btn-checkout {
  width: 100%;
  margin-top: 20px;
  border: 1px solid rgba(167, 139, 250, 0.44);
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  color: #f5f3ff;
  font-size: 15px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(124, 58, 237, 0.2);
}

.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(196, 181, 253, 0.68);
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.16), rgba(124, 58, 237, 0.08)), #211830;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22);
}

.btn-checkout:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  border: 1px solid rgba(167, 139, 250, 0.28);
  background: rgba(255, 255, 255, 0.025);
  color: #e9d5ff;
  padding: 0 24px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  transform: translateY(-2px);
  border-color: rgba(167, 139, 250, 0.5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 16px 34px rgba(0, 0, 0, 0.24);
}

.trust-badges {
  display: flex;
  gap: 16px;
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
}

.trust-badge svg {
  width: 16px;
  height: 16px;
  color: #34d399;
}

.saved-later-section,
.recommended-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.saved-later-title,
.recommended-title {
  color: #fff;
  font-size: 1.15rem;
  font-weight: 900;
  margin: 0 0 20px;
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
}

.recommended-card {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
}

.recommended-card img {
  width: 100%;
  height: 110px;
  object-fit: cover;
}

.recommended-card-body {
  padding: 12px;
}

.address-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-full-width {
  grid-column: 1 / -1;
}

.form-label {
  color: #a78bfa;
  font-size: 12px;
  font-weight: 800;
  display: block;
  margin-bottom: 6px;
}

.checkout-success {
  text-align: center;
  padding: 60px 24px;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  border-radius: 999px;
  background: linear-gradient(135deg, #34d399, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 16px 40px rgba(52, 211, 153, 0.3);
}

.checkout-success h2 {
  color: #fff;
  font-size: 1.75rem;
  margin: 0 0 12px;
}

.checkout-success p {
  color: #94a3b8;
  margin: 0 0 32px;
}

.order-id {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #c4b5fd;
  font-family: monospace;
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 32px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  width: min(520px, 100%);
  max-height: 90vh;
  overflow: auto;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #0d0d14;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.modal-header h2 {
  color: #fff;
  margin: 0;
  font-size: 1.15rem;
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

.modal-body {
  padding: 22px;
}

.toast-notification {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 90;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 12px 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
  font-weight: 800;
  font-size: 13px;
}

@media (max-width: 1024px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: relative;
    top: 0;
  }
}

@media (max-width: 680px) {
  .cart-page-header {
    flex-direction: column;
  }

  .cart-item {
    grid-template-columns: 84px minmax(0, 1fr);
  }

  .cart-item-image-wrap {
    width: 84px;
    height: 84px;
  }

  .cart-item-actions {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
  }

  .address-form-grid {
    grid-template-columns: 1fr;
  }
}
`;
