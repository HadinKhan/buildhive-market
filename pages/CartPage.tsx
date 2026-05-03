import React, { useMemo, useState } from "react";
import { Icons } from "../components/Icons";
import { CartItem as AppCartItem } from "../types";

interface CartPageProps {
  cartItems: AppCartItem[];
  onNavigate: (page: string, productId?: string) => void;
  onRemoveFromCart: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onClearCart: () => void;
}

interface CartViewItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
  seller: string;
  verified: boolean;
  category: string;
  subcategory: string;
  maxQuantity?: number;
  requiresShipping: boolean;
}

interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: "card" | "cod" | "easypaisa" | "jazzcash" | "bank_transfer";
  name: string;
  last4?: string;
  expiry?: string;
  isDefault: boolean;
  icon: string;
}

interface PromoCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrder?: number;
  maxDiscount?: number;
}

const sampleAddresses: ShippingAddress[] = [
  {
    id: "addr1",
    fullName: "Ayaan Ahmad",
    phone: "+92-300-1234567",
    address: "House 123, Street 4, Sector C",
    city: "Lahore",
    province: "Punjab",
    postalCode: "54000",
    isDefault: true,
  },
  {
    id: "addr2",
    fullName: "Ayaan Ahmad",
    phone: "+92-300-1234567",
    address: "Flat 5B, Gulberg Heights",
    city: "Lahore",
    province: "Punjab",
    postalCode: "54000",
    isDefault: false,
  },
];

const paymentMethods: PaymentMethod[] = [
  { id: "pm1", type: "cod", name: "Cash on Delivery", isDefault: true, icon: "cash" },
  { id: "pm2", type: "card", name: "Visa ending in 4242", last4: "4242", expiry: "12/26", isDefault: false, icon: "visa" },
  { id: "pm3", type: "easypaisa", name: "Easypaisa", isDefault: false, icon: "easypaisa" },
  { id: "pm4", type: "jazzcash", name: "JazzCash", isDefault: false, icon: "jazzcash" },
  { id: "pm5", type: "bank_transfer", name: "Bank Transfer", isDefault: false, icon: "bank" },
];

const promoCodes: PromoCode[] = [
  { code: "BUILDHIVE10", discount: 10, type: "percentage", minOrder: 5000, maxDiscount: 5000 },
  { code: "WELCOME500", discount: 500, type: "fixed", minOrder: 10000 },
  { code: "FREESHIP", discount: 0, type: "percentage" },
];

const cartPageStyles = `
* { box-sizing: border-box; }

.cart-page {
  min-height: 100vh;
  background: #07070b;
  color: #e2e8f0;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.cart-page button,
.cart-page input,
.cart-page select {
  font: inherit;
}

.cart-page ::-webkit-scrollbar { width: 8px; height: 8px; }
.cart-page ::-webkit-scrollbar-track { background: #09090d; }
.cart-page ::-webkit-scrollbar-thumb { background: #4338ca; border-radius: 999px; }
.cart-page ::-webkit-scrollbar-thumb:hover { background: #6366f1; }

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
  color: #7f8da6;
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
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.08);
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
  color: #7f8da6;
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
  color: #7887a2;
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
  color: #7f8da6;
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
  color: #7f8da6;
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

const recommendedProducts = [
  {
    id: "r1",
    name: "Premium Safety Helmet",
    price: 2400,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
  },
  {
    id: "r2",
    name: "Heavy Duty Work Gloves",
    price: 950,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop",
  },
  {
    id: "r3",
    name: "Measuring Tape 30m",
    price: 1350,
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop",
  },
];

const getCartViewItem = (item: AppCartItem): CartViewItem => {
  const product = item.product;
  return {
    id: item.id,
    productId: item.product_id || product?.id || item.id,
    name: product?.name || "Product",
    description: product?.description || "Construction marketplace item.",
    price: product?.price || 0,
    quantity: item.quantity,
    image: product?.images?.[0]?.image_url || "",
    unit: product?.weight_unit || "piece",
    seller: product?.author || "BuildHive Seller",
    verified: true,
    category: product?.category_id || "products",
    subcategory: product?.is_physical ? "Physical Product" : "Digital Product",
    maxQuantity: product?.track_quantity ? product.quantity : undefined,
    requiresShipping: product?.requires_shipping ?? true,
  };
};

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onNavigate,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("addr1");
  const [selectedPayment, setSelectedPayment] = useState("pm1");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const normalizedItems = useMemo(() => cartItems.map(getCartViewItem), [cartItems]);
  const visibleCartItems = normalizedItems.filter((item) => !savedIds.includes(item.id));
  const savedForLater = normalizedItems.filter((item) => savedIds.includes(item.id));

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2000);
  };

  const orderSummary = useMemo(() => {
    const subtotal = visibleCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = visibleCartItems.reduce((sum, item) => sum + item.quantity, 0);
    let shipping = visibleCartItems.some((item) => item.requiresShipping) ? 500 : 0;
    if (subtotal > 50000 || appliedPromo?.code === "FREESHIP") shipping = 0;

    const tax = subtotal * 0.18;
    let discount = 0;

    if (appliedPromo) {
      if (appliedPromo.type === "percentage") {
        discount = (subtotal * appliedPromo.discount) / 100;
        if (appliedPromo.maxDiscount) discount = Math.min(discount, appliedPromo.maxDiscount);
      } else {
        discount = appliedPromo.discount;
      }
    }

    return {
      subtotal,
      shipping,
      tax,
      discount,
      total: Math.max(0, subtotal + shipping + tax - discount),
      itemCount,
    };
  }, [appliedPromo, visibleCartItems]);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    const promo = promoCodes.find((item) => item.code === code);

    if (!promo) {
      setPromoError("Invalid promo code");
      window.setTimeout(() => setPromoError(""), 3000);
      return;
    }

    if (promo.minOrder && orderSummary.subtotal < promo.minOrder) {
      setPromoError(`Min order Rs. ${promo.minOrder.toLocaleString()} required`);
      window.setTimeout(() => setPromoError(""), 3000);
      return;
    }

    setAppliedPromo(promo);
    setPromoCode("");
    showToast(`Promo ${promo.code} applied`);
  };

  const handleCheckout = () => {
    if (visibleCartItems.length === 0) return;
    setOrderId(`BH-${Date.now().toString(36).toUpperCase()}`);
    setShowCheckoutSuccess(true);
  };

  const renderPaymentIcon = (icon: string) => {
    switch (icon) {
      case "cash":
        return <Icons.Cash className="h-5 w-5" />;
      case "visa":
        return <Icons.CreditCard className="h-5 w-5" />;
      case "easypaisa":
      case "jazzcash":
        return <Icons.Phone className="h-5 w-5" />;
      case "bank":
        return <Icons.Bank className="h-5 w-5" />;
      default:
        return <Icons.CreditCard className="h-5 w-5" />;
    }
  };

  if (showCheckoutSuccess) {
    return (
      <div className="cart-page">
        <style>{cartPageStyles}</style>
        <div className="cart-shell" style={{ maxWidth: 650 }}>
          <div className="checkout-success">
            <div className="success-icon">
              <Icons.Check className="h-9 w-9" />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. A confirmation email will be sent shortly.</p>
            <div className="order-id">Order ID: {orderId}</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-checkout" style={{ width: "auto", padding: "0 24px", marginTop: 0 }} onClick={() => onNavigate("account")}>
                View Orders
              </button>
              <button className="btn-secondary" onClick={() => onNavigate("products")}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <style>{cartPageStyles}</style>
      <div className="cart-shell">
        <div className="cart-page-header">
          <div>
            <h1>Shopping Cart</h1>
            <p>{visibleCartItems.length} {visibleCartItems.length === 1 ? "item" : "items"} ready for checkout</p>
          </div>
          {cartItems.length > 0 && (
            <button className="btn-clear-cart" onClick={onClearCart}>
              <Icons.Trash className="h-4 w-4" />
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <Icons.Cart style={{ width: 64, height: 64 }} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you have not added any items yet. Explore the marketplace to find what you need.</p>
            <button className="btn-checkout" style={{ maxWidth: 280, margin: "0 auto" }} onClick={() => onNavigate("products")}>
              <Icons.Search className="h-4 w-4" />
              Browse Products
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-container">
              {visibleCartItems.length === 0 ? (
                <div className="empty-cart" style={{ padding: "42px 24px" }}>
                  <h3>All items saved for later</h3>
                  <p>Move items back to cart or continue shopping.</p>
                  <button className="btn-checkout" style={{ maxWidth: 240, margin: "0 auto" }} onClick={() => onNavigate("products")}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                visibleCartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image-wrap" onClick={() => onNavigate("product-detail", item.productId)}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                      ) : (
                        <div className="cart-image-placeholder">
                          <Icons.Image className="h-9 w-9" />
                        </div>
                      )}
                    </div>

                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-description">{item.description}</p>
                      <div className="cart-item-meta">
                        <span className="cart-item-category">{item.subcategory}</span>
                        <span className="cart-item-seller">
                          <span className="seller-avatar">{item.seller.charAt(0)}</span>
                          {item.seller}
                          {item.verified && <Icons.Check className="h-4 w-4" style={{ color: "#34d399" }} />}
                        </span>
                      </div>
                      <div className="cart-item-price">
                        Rs. {item.price.toLocaleString()}
                        <span className="cart-item-unit"> / {item.unit}</span>
                      </div>
                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Icons.Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          className="quantity-value"
                          value={item.quantity}
                          min={1}
                          max={item.maxQuantity || 99}
                          onChange={(event) => {
                            const value = Number(event.target.value) || 1;
                            const max = item.maxQuantity || 99;
                            onUpdateQuantity(item.id, Math.min(max, Math.max(1, value)));
                          }}
                        />
                        <button
                          className="quantity-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.maxQuantity ? item.quantity >= item.maxQuantity : false}
                          aria-label="Increase quantity"
                        >
                          <Icons.Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="cart-item-total">Rs. {(item.price * item.quantity).toLocaleString()}</div>
                      <div className="cart-action-row">
                        <button
                          className="btn-save-later"
                          onClick={() => {
                            setSavedIds((current) => [...current, item.id]);
                            showToast("Saved for later");
                          }}
                        >
                          <Icons.Heart className="h-4 w-4" />
                          Save for Later
                        </button>
                        <button
                          className="btn-remove"
                          onClick={() => {
                            onRemoveFromCart(item.id);
                            showToast("Item removed from cart");
                          }}
                        >
                          <Icons.Trash className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {savedForLater.length > 0 && (
                <div className="saved-later-section">
                  <h3 className="saved-later-title">Saved for Later ({savedForLater.length})</h3>
                  {savedForLater.map((item) => (
                    <div key={item.id} className="cart-item" style={{ opacity: 0.72 }}>
                      <div className="cart-item-image-wrap">
                        {item.image ? <img src={item.image} alt={item.name} className="cart-item-image" /> : <div className="cart-image-placeholder"><Icons.Image className="h-9 w-9" /></div>}
                      </div>
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <div className="cart-item-meta">
                          <span className="cart-item-category">{item.subcategory}</span>
                        </div>
                        <div className="cart-item-price">Rs. {item.price.toLocaleString()}</div>
                      </div>
                      <div className="cart-item-actions">
                        <button
                          className="btn-checkout"
                          style={{ padding: "0 16px", minHeight: 38, fontSize: 12, marginTop: 0 }}
                          onClick={() => {
                            setSavedIds((current) => current.filter((id) => id !== item.id));
                            showToast("Moved to cart");
                          }}
                        >
                          Move to Cart
                        </button>
                        <button
                          className="btn-remove"
                          onClick={() => {
                            onRemoveFromCart(item.id);
                            setSavedIds((current) => current.filter((id) => id !== item.id));
                            showToast("Removed from saved");
                          }}
                        >
                          <Icons.Trash className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {visibleCartItems.length > 0 && (
                <div className="recommended-section">
                  <h3 className="recommended-title">Frequently Bought Together</h3>
                  <div className="recommended-grid">
                    {recommendedProducts.map((product) => (
                      <div key={product.id} className="recommended-card">
                        <img src={product.image} alt={product.name} />
                        <div className="recommended-card-body">
                          <div style={{ color: "#fff", fontWeight: 800, fontSize: 13, marginBottom: 6 }}>{product.name}</div>
                          <div style={{ color: "#c4b5fd", fontWeight: 900 }}>Rs. {product.price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="order-summary">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal ({orderSummary.itemCount} items)</span>
                <span>Rs. {orderSummary.subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{orderSummary.shipping === 0 ? <span style={{ color: "#34d399" }}>Free</span> : `Rs. ${orderSummary.shipping.toLocaleString()}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (18% GST)</span>
                <span>Rs. {Math.round(orderSummary.tax).toLocaleString()}</span>
              </div>
              {orderSummary.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>- Rs. {Math.round(orderSummary.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>Rs. {Math.round(orderSummary.total).toLocaleString()}</span>
              </div>

              <div className="promo-section">
                {!appliedPromo ? (
                  <>
                    <div className="promo-input-row">
                      <input
                        type="text"
                        className="promo-input"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(event) => setPromoCode(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && handleApplyPromo()}
                      />
                      <button className="btn-apply" onClick={handleApplyPromo}>Apply</button>
                    </div>
                    {promoError && <p style={{ color: "#f87171", fontSize: 12, margin: "8px 0 0" }}>{promoError}</p>}
                  </>
                ) : (
                  <div className="promo-applied">
                    <span>{appliedPromo.code} applied</span>
                    <button className="promo-remove" onClick={() => { setAppliedPromo(null); showToast("Promo removed"); }}>Remove</button>
                  </div>
                )}
              </div>

              <div className="shipping-section">
                <span className="section-label">Shipping Address</span>
                {sampleAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`address-card ${selectedAddress === address.id ? "selected" : ""}`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div className="address-name">{address.fullName}</div>
                    <div className="address-text">{address.address}, {address.city}, {address.province} {address.postalCode}</div>
                    <div className="address-text" style={{ marginTop: 4 }}>{address.phone}</div>
                    {address.isDefault && <span className="address-badge">Default</span>}
                  </div>
                ))}
                <button className="btn-add-address" onClick={() => setShowAddressModal(true)}>
                  <Icons.Plus className="h-4 w-4" />
                  Add New Address
                </button>
              </div>

              <div className="payment-section">
                <span className="section-label">Payment Method</span>
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`payment-option ${selectedPayment === method.id ? "selected" : ""}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="payment-icon">{renderPaymentIcon(method.icon)}</div>
                    <div className="payment-info">
                      <div className="payment-name">{method.name}</div>
                      {method.last4 && <div className="payment-meta">**** {method.last4} - Exp {method.expiry}</div>}
                    </div>
                    {selectedPayment === method.id && <Icons.Check className="h-4 w-4" style={{ color: "#34d399" }} />}
                  </div>
                ))}
              </div>

              <button className="btn-checkout" onClick={handleCheckout} disabled={visibleCartItems.length === 0}>
                <Icons.Lock className="h-4 w-4" />
                Proceed to Checkout
                <span style={{ marginLeft: "auto", fontSize: 13, opacity: 0.9 }}>
                  Rs. {Math.round(orderSummary.total).toLocaleString()}
                </span>
              </button>

              <div className="trust-badges">
                <span className="trust-badge"><Icons.Shield />Secure Checkout</span>
                <span className="trust-badge"><Icons.Truck />{orderSummary.shipping === 0 ? "Free Shipping" : "Fast Delivery"}</span>
              </div>
            </aside>
          </div>
        )}
      </div>

      {showAddressModal && (
        <div className="modal-backdrop" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Address</h2>
              <button className="modal-close" onClick={() => setShowAddressModal(false)}>x</button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setShowAddressModal(false);
                  showToast("Address added successfully");
                }}
              >
                <div className="address-form-grid">
                  <div className="form-full-width">
                    <label className="form-label">Full Name</label>
                    <input type="text" placeholder="Enter full name" required />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input type="tel" placeholder="+92-XXX-XXXXXXX" required />
                  </div>
                  <div>
                    <label className="form-label">Postal Code</label>
                    <input type="text" placeholder="54000" required />
                  </div>
                  <div className="form-full-width">
                    <label className="form-label">Street Address</label>
                    <input type="text" placeholder="House #, Street, Area" required />
                  </div>
                  <div>
                    <label className="form-label">City</label>
                    <input type="text" placeholder="Lahore" required />
                  </div>
                  <div>
                    <label className="form-label">Province</label>
                    <select required defaultValue="">
                      <option value="">Select</option>
                      <option value="punjab">Punjab</option>
                      <option value="sindh">Sindh</option>
                      <option value="kpk">KPK</option>
                      <option value="balochistan">Balochistan</option>
                      <option value="gilgit">Gilgit-Baltistan</option>
                      <option value="ajk">Azad Kashmir</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-checkout">Save Address</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast-notification">{toast}</div>}
    </div>
  );
};
