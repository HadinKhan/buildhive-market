import React, { useEffect, useMemo, useState } from "react";
import { Icons } from "../components/Icons";
import { CartItem as AppCartItem } from "../types";
import { commerceService } from "../src/services/commerceService";
import { addressService } from "../src/services/addressService";
import { useAuth } from "../src/context/AuthContext";
import { cartPageStyles } from "../src/styles/cartPageStyles";
import {
  getMarketplaceInitials,
  resolveMarketplaceImageSrc,
} from "../src/utils/marketplaceImage";

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
  businessId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string | null;
  unit: string;
  seller: string;
  verified: boolean;
  category: string;
  subcategory: string;
  maxQuantity?: number;
  requiresShipping: boolean;
}

interface CartSellerGroup {
  businessId: string;
  sellerName: string;
  items: CartViewItem[];
  subtotal: number;
}

interface PromoCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrder?: number;
  maxDiscount?: number;
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

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

const TAX_RATE = 0.05;

const getCartViewItem = (item: AppCartItem): CartViewItem => {
  const product = item.product;
  const firstImage = product?.images?.[0] as any;
  const imageSrc = resolveMarketplaceImageSrc({
    images: (product as any)?.images,
    product_images: (product as any)?.product_images,
    image_url: (product as any)?.image_url,
    image: (product as any)?.image,
    thumbnail: (product as any)?.thumbnail,
  });

  return {
    id: item.id,
    productId: item.product_id || product?.id || item.id,
    businessId:
      (product as any)?.business_id || (product as any)?.businessId || item.id,
    name: product?.name || "Product",
    description: product?.description || "Construction marketplace item.",
    price: product?.price || 0,
    quantity: item.quantity,
    image: imageSrc || firstImage || null,
    unit: product?.weight_unit || "piece",
    seller:
      product?.author || (product as any)?.business_name || "BuildHive Seller",
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
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<
    RecommendedProduct[]
  >([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    commerceService
      .getPaymentMethods()
      .then((methods) => {
        const next = methods.map((method: any) => ({
          id: method.id,
          type: method.type || method.payment_method || "cod",
          name: method.name,
          last4: method.last4,
          expiry: method.expiry,
          isDefault: Boolean(method.isDefault ?? method.is_default),
          icon: method.icon || method.type || "cash",
        }));
        setPaymentMethods(next);
        setSelectedPayment(
          (current) =>
            current ||
            next.find((method: PaymentMethod) => method.isDefault)?.id ||
            next[0]?.id ||
            "",
        );
      })
      .catch((error) => {
        console.error("Failed to load payment methods:", error);
        setPaymentMethods([]);
      });

    commerceService
      .getCartRecommendations()
      .then((products) => {
        setRecommendedProducts(
          products.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price || 0,
            image:
              resolveMarketplaceImageSrc(product) ||
              product.image ||
              product.product_images?.[0]?.image_url ||
              "",
          })),
        );
      })
      .catch((error) => {
        console.error("Failed to load cart recommendations:", error);
        setRecommendedProducts([]);
      });
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    addressService
      .getAddresses(user.id)
      .then((apiAddresses) => {
        const next = apiAddresses.map((address: any) => ({
          id: address.id,
          fullName: address.full_name || address.fullName || "",
          phone: address.phone || "",
          address: address.address_line1 || address.addressLine1 || "",
          city: address.city || "",
          province: address.state || "",
          postalCode: address.postal_code || address.postalCode || "",
          isDefault: Boolean(address.is_default ?? address.isDefault),
        }));
        setAddresses(next);
        setSelectedAddress(
          (current) =>
            current ||
            next.find((address: ShippingAddress) => address.isDefault)?.id ||
            next[0]?.id ||
            "",
        );
      })
      .catch((error) => {
        console.error("Failed to load addresses:", error);
        setAddresses([]);
      });
  }, [user?.id]);

  const items = useMemo(() => cartItems.map(getCartViewItem), [cartItems]);

  const visibleCartItems = items.filter((item) => !savedIds.includes(item.id));
  const savedForLater = items.filter((item) => savedIds.includes(item.id));
  const sellerGroups = useMemo<CartSellerGroup[]>(() => {
    const grouped = new Map<string, CartSellerGroup>();

    visibleCartItems.forEach((item) => {
      const key = item.businessId || item.seller;
      const existing = grouped.get(key);
      if (existing) {
        existing.items.push(item);
        existing.subtotal += item.price * item.quantity;
        return;
      }

      grouped.set(key, {
        businessId: item.businessId || key,
        sellerName: item.seller,
        items: [item],
        subtotal: item.price * item.quantity,
      });
    });

    return Array.from(grouped.values());
  }, [visibleCartItems]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2000);
  };

  const orderSummary = useMemo(() => {
    const subtotal = visibleCartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const itemCount = visibleCartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const shipping = 0;
    const taxAmount = subtotal * TAX_RATE;
    const total = subtotal + shipping + taxAmount;
    let discount = 0;

    if (appliedPromo) {
      if (appliedPromo.type === "percentage") {
        discount = (subtotal * appliedPromo.discount) / 100;
        if (appliedPromo.maxDiscount)
          discount = Math.min(discount, appliedPromo.maxDiscount);
      } else {
        discount = appliedPromo.discount;
      }
    }

    return {
      subtotal,
      shipping,
      tax: taxAmount,
      discount,
      total: Math.max(0, total - discount),
      itemCount,
    };
  }, [appliedPromo, visibleCartItems]);

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    try {
      const promo = await commerceService.validatePromoCode({
        code,
        cartTotal: orderSummary.subtotal,
      });
      setAppliedPromo(promo);
      setPromoCode("");
      showToast(`Promo ${promo.code || code} applied`);
    } catch (error) {
      console.error("Failed to validate promo:", error);
      setPromoError("Invalid promo code");
      window.setTimeout(() => setPromoError(""), 3000);
    }
  };

  const handleCheckout = () => {
    if (visibleCartItems.length === 0) return;
    onNavigate("checkout");
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

  return (
    <div className="cart-page">
      <style>{cartPageStyles}</style>
      <div className="cart-shell">
        <div className="cart-page-header">
          <div>
            <h1>Shopping Cart</h1>
            <p>
              {visibleCartItems.length}{" "}
              {visibleCartItems.length === 1 ? "item" : "items"} ready for
              checkout
            </p>
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
            <p>
              Looks like you have not added any items yet. Explore the
              marketplace to find what you need.
            </p>
            <button
              className="btn-checkout"
              style={{ maxWidth: 280, margin: "0 auto" }}
              onClick={() => onNavigate("products")}
            >
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
                  <button
                    className="btn-checkout"
                    style={{ maxWidth: 240, margin: "0 auto" }}
                    onClick={() => onNavigate("products")}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                sellerGroups.map((group) => (
                  <div key={group.businessId} className="seller-group">
                    <div className="seller-group-header">
                      <h3 className="seller-group-title">
                        Items from {group.sellerName}
                      </h3>
                      <div className="seller-group-subtotal">
                        Subtotal: PKR {group.subtotal.toLocaleString()}
                      </div>
                    </div>

                    {group.items.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div
                          className="cart-item-image-wrap"
                          onClick={() =>
                            onNavigate("product-detail", item.productId)
                          }
                        >
                          {(() => {
                            const imageSrc = item.image ? resolveMarketplaceImageSrc({ image: item.image }) : null;
                            if (imageSrc) {
                              return (
                                <>
                                  <img
                                    src={imageSrc}
                                    alt={item.name}
                                    className="cart-item-image"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      const placeholder = e.currentTarget
                                        .nextElementSibling as HTMLElement | null;
                                      if (placeholder) {
                                        placeholder.style.display = "flex";
                                      }
                                    }}
                                  />
                                  <div className="hidden h-full w-full items-center justify-center rounded-2xl bg-gray-200 text-gray-500">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-600">
                                      {getMarketplaceInitials(item.name)}
                                    </div>
                                  </div>
                                </>
                              );
                            } else {
                              return (
                                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-200 text-gray-500">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-600">
                                    {getMarketplaceInitials(item.name)}
                                  </div>
                                </div>
                              );
                            }
                          })()}
                        </div>

                        <div className="cart-item-details">
                          <h3 className="cart-item-name">{item.name}</h3>
                          <p className="cart-item-description">
                            {item.description}
                          </p>
                          <div className="cart-item-meta">
                            <span className="cart-item-category">
                              {item.subcategory}
                            </span>
                            <span className="cart-item-seller">
                              <span className="seller-avatar">
                                {item.seller.charAt(0)}
                              </span>
                              {item.seller}
                              {item.verified && (
                                <Icons.Check
                                  className="h-4 w-4"
                                  style={{ color: "#34d399" }}
                                />
                              )}
                            </span>
                          </div>
                          <div className="cart-item-price">
                            PKR {item.price.toLocaleString()}
                            <span className="cart-item-unit">
                              {" "}
                              / {item.unit}
                            </span>
                          </div>
                          <div className="quantity-control">
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                onUpdateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
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
                                onUpdateQuantity(
                                  item.id,
                                  Math.min(max, Math.max(1, value)),
                                );
                              }}
                            />
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={
                                item.maxQuantity
                                  ? item.quantity >= item.maxQuantity
                                  : false
                              }
                              aria-label="Increase quantity"
                            >
                              <Icons.Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-actions">
                          <div className="cart-item-total">
                            PKR {(item.price * item.quantity).toLocaleString()}
                          </div>
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
                    ))}
                  </div>
                ))
              )}

              {savedForLater.length > 0 && (
                <div className="saved-later-section">
                  <h3 className="saved-later-title">
                    Saved for Later ({savedForLater.length})
                  </h3>
                  {savedForLater.map((item) => (
                    <div
                      key={item.id}
                      className="cart-item"
                      style={{ opacity: 0.72 }}
                    >
                      <div className="cart-item-image-wrap">
                        {(() => {
                          const imageSrc = item.image ? resolveMarketplaceImageSrc({ image: item.image }) : null;
                          if (imageSrc) {
                            return (
                              <>
                                <img
                                  src={imageSrc}
                                  alt={item.name}
                                  className="cart-item-image"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    const placeholder = e.currentTarget
                                      .nextElementSibling as HTMLElement | null;
                                    if (placeholder) {
                                      placeholder.style.display = "flex";
                                    }
                                  }}
                                />
                                <div className="hidden h-full w-full items-center justify-center rounded-2xl bg-gray-200 text-gray-500">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-600">
                                    {getMarketplaceInitials(item.name)}
                                  </div>
                                </div>
                              </>
                            );
                          } else {
                            return (
                              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-200 text-gray-500">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-600">
                                  {getMarketplaceInitials(item.name)}
                                </div>
                              </div>
                            );
                          }
                        })()}
                      </div>
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <div className="cart-item-meta">
                          <span className="cart-item-category">
                            {item.subcategory}
                          </span>
                        </div>
                        <div className="cart-item-price">
                          PKR {item.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="cart-item-actions">
                        <button
                          className="btn-checkout"
                          style={{
                            padding: "0 16px",
                            minHeight: 38,
                            fontSize: 12,
                            marginTop: 0,
                          }}
                          onClick={() => {
                            setSavedIds((current) =>
                              current.filter((id) => id !== item.id),
                            );
                            showToast("Moved to cart");
                          }}
                        >
                          Move to Cart
                        </button>
                        <button
                          className="btn-remove"
                          onClick={() => {
                            onRemoveFromCart(item.id);
                            setSavedIds((current) =>
                              current.filter((id) => id !== item.id),
                            );
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


            </div>

            <aside className="order-summary">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal ({orderSummary.itemCount} items)</span>
                <span>PKR {orderSummary.subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {orderSummary.shipping === 0 ? (
                    <span style={{ color: "#34d399" }}>Free</span>
                  ) : (
                    `PKR ${orderSummary.shipping.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>PKR {orderSummary.tax.toFixed(2)}</span>
              </div>
              {orderSummary.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>
                    - PKR {Math.round(orderSummary.discount).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>PKR {orderSummary.total.toFixed(2)}</span>
              </div>



              <div className="payment-section">
                <span className="section-label">Payment Method</span>
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`payment-option ${selectedPayment === method.id ? "selected" : ""}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="payment-icon">
                      {renderPaymentIcon(method.icon)}
                    </div>
                    <div className="payment-info">
                      <div className="payment-name">{method.name}</div>
                      {method.last4 && (
                        <div className="payment-meta">
                          **** {method.last4} - Exp {method.expiry}
                        </div>
                      )}
                    </div>
                    {selectedPayment === method.id && (
                      <Icons.Check
                        className="h-4 w-4"
                        style={{ color: "#34d399" }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                className="btn-checkout"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                <Icons.Lock className="h-4 w-4" />
                Proceed to Checkout
                <span
                  style={{ marginLeft: "auto", fontSize: 13, opacity: 0.9 }}
                >
                  PKR {Math.round(orderSummary.total).toLocaleString()}
                </span>
              </button>

              <div className="trust-badges">
                <span className="trust-badge">
                  <Icons.Shield />
                  Secure Checkout
                </span>
                <span className="trust-badge">
                  <Icons.Truck />
                  {orderSummary.shipping === 0
                    ? "Free Shipping"
                    : "Fast Delivery"}
                </span>
              </div>
            </aside>
          </div>
        )}
      </div>

      {showAddressModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAddressModal(false)}
        >
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Add New Address</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddressModal(false)}
              >
                x
              </button>
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
                    <input
                      type="text"
                      placeholder="House #, Street, Area"
                      required
                    />
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
                <button type="submit" className="btn-checkout">
                  Save Address
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast-notification">{toast}</div>}
    </div>
  );
};
