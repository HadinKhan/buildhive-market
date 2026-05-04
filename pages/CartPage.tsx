import React, { useMemo, useState } from "react";
import { Icons } from "../components/Icons";
import { CartItem as AppCartItem } from "../types";
import {
  paymentMethods,
  promoCodes,
  recommendedProducts,
  sampleAddresses,
  PromoCode,
} from "../src/data/cartPageData";import { cartPageStyles } from "../src/styles/cartPageStyles";

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
