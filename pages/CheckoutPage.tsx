import React, { useEffect, useMemo, useState, useRef } from "react";
import { StripeProviderWrapper } from "../src/components/StripeProviderWrapper";
import { StripeCardForm } from "../src/components/StripeCardForm";
import { useStripePayment } from "../src/hooks/useStripePayment";
import { toast } from "react-toastify";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { CartItem } from "../types";
import {
  orderService,
  type CreateOrderData,
} from "../src/services/orderService";
import { addressService } from "../src/services/addressService";
import { useAuth } from "../src/context/AuthContext";
import { useLocation } from "react-router-dom";
import {
  INITIAL_FORM_DATA,
  PAYMENT_METHODS,
  REQUIRED_FIELDS,
  TAX_RATE,
  type FormData,
} from "../src/data/checkoutPageData";
import { serviceMarketplaceService } from "../src/services/serviceMarketplaceService";
import { checkoutPageStyles } from "../src/styles/checkoutPageStyles";
import api from "../src/services/api";

interface CheckoutPageProps {
  cartItems: CartItem[];
  onNavigate: (page: string) => void;
  onPlaceOrder: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  onNavigate,
  onPlaceOrder,
}) => {
  // Inject styles
  useEffect(() => {
    const styleId = "checkout-page-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = checkoutPageStyles;
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const { user } = useAuth();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [placedOrdersCount, setPlacedOrdersCount] = useState(0);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [serviceCheckout, setServiceCheckout] = useState<any | null>(null);
  const [serviceLoading, setServiceLoading] = useState(false);
  const stripePayment = useStripePayment();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState("");

  const paymentSucceededRef = useRef(false);
  const createdOrderIdRef = useRef<string | null>(null);

  useEffect(() => {
    createdOrderIdRef.current = createdOrderId;
  }, [createdOrderId]);

  useEffect(() => {
    return () => {
      if (createdOrderIdRef.current && paymentMethod === "card" && !paymentSucceededRef.current) {
        console.log("Cleanup: cancelling unpaid order on unmount:", createdOrderIdRef.current);
        api.post(`/orders/${createdOrderIdRef.current}/cancel`, { reason: "Payment abandoned or failed" })
          .catch(err => console.error("Failed to cancel unpaid order on unmount:", err));
      }
    };
  }, [paymentMethod]);

  useEffect(() => {
    const serviceIdFromQuery = new URLSearchParams(location.search).get(
      "serviceId",
    );
    const serviceIdFromState = (location.state as any)?.serviceId;
    const serviceId = serviceIdFromQuery || serviceIdFromState;

    if (!serviceId) {
      setServiceCheckout(null);
      setServiceLoading(false);
      return;
    }

    let cancelled = false;
    setServiceLoading(true);
    serviceMarketplaceService
      .getServiceById(serviceId)
      .then((service) => {
        if (!cancelled) {
          setServiceCheckout(service);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setServiceCheckout(null);
          toast.error("Unable to load the selected service checkout.");
        }
      })
      .finally(() => {
        if (!cancelled) setServiceLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [location.search, location.state]);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const loadAddresses = async () => {
      try {
        const res = await api.get(`/users/${user.id}/addresses`);
        const addrs = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const next = addrs.map((address: any) => ({
          id: address.id,
          full_name: address.full_name || address.fullName || "",
          phone: address.phone || "",
          address_line1: address.address_line1 || address.addressLine1 || "",
          address_line2: address.address_line2 || address.addressLine2 || "",
          city: address.city || "",
          state: address.state || "",
          postal_code: address.postal_code || address.postalCode || "",
          country: address.country || "Pakistan",
          is_default: Boolean(address.is_default ?? address.isDefault),
        }));

        if (cancelled) return;

        setSavedAddresses(next);
        const defaultAddress =
          next.find((address: any) => address.is_default) || next[0];
        if (defaultAddress) {
          setSelectedSavedAddressId(defaultAddress.id);
          setFormData((prev) => ({
            ...prev,
            full_name: defaultAddress.full_name,
            phone: defaultAddress.phone,
            address_line1: defaultAddress.address_line1,
            address_line2: defaultAddress.address_line2,
            city: defaultAddress.city,
            state: defaultAddress.state,
            postal_code: defaultAddress.postal_code,
            country: defaultAddress.country,
          }));
        }
      } catch (error) {
        if (!cancelled) {
          setSavedAddresses([]);
        }
      }
    };

    loadAddresses();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const applySavedAddress = (addressId: string) => {
    const address = savedAddresses.find((item) => item.id === addressId);
    if (!address) return;
    setSelectedSavedAddressId(addressId);
    setFormData((prev) => ({
      ...prev,
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
    }));
  };

  const subtotal = serviceCheckout
    ? Number(serviceCheckout.price || 0)
    : cartItems.reduce(
        (acc: number, item: CartItem) =>
          acc + (item.product?.price || 0) * item.quantity,
        0,
      );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const cartGroups = useMemo(() => {
    const groups = new Map<
      string,
      {
        businessId: string;
        sellerName: string;
        items: CartItem[];
      }
    >();

    cartItems.forEach((item) => {
      const businessId =
        item.product?.business_id || (item.product as any)?.businessId || "";
      const sellerName =
        item.product?.author ||
        (item.product as any)?.business_name ||
        "BuildHive Seller";
      const key = businessId || sellerName;

      const existing = groups.get(key);
      if (existing) {
        existing.items.push(item);
        return;
      }

      groups.set(key, {
        businessId: businessId || key,
        sellerName,
        items: [item],
      });
    });

    return Array.from(groups.values());
  }, [cartItems]);

  const orderedPaymentMethods = useMemo(
    () => [
      ...PAYMENT_METHODS.filter((method) => method.id === "cod"),
      ...PAYMENT_METHODS.filter((method) => method.id !== "cod"),
    ],
    [],
  );

  const formIsValid = useMemo(() => {
    const addressIsFilled = REQUIRED_FIELDS.every((field) => {
      const value = formData[field as keyof FormData];
      return Boolean(value && String(value).trim());
    });

    return addressIsFilled && Boolean(paymentMethod);
  }, [formData, paymentMethod]);

  const selectedAddress = selectedSavedAddressId || formData.full_name || "";

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    REQUIRED_FIELDS.forEach((field) => {
      const value = formData[field as keyof FormData];
      if (!value || !String(value).trim()) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!serviceCheckout && cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      if (!serviceCheckout) {
        // Validate cart items have product data
        const invalidItems = cartItems.filter(
          (item: CartItem) => !item.product || !item.product.price,
        );
        if (invalidItems.length > 0) {
          toast.error(
            "Cart data is incomplete. Please refresh the page and try again.",
          );
          return;
        }
      }

      // Step 1: Create address first
      if (!user?.id) {
        toast.error("User not found. Please sign in again.");
        return;
      }
      const addressPayload = {
        fullName: formData.full_name,
        addressLine1: formData.address_line1,
        addressLine2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postal_code,
        country: formData.country,
        phone: formData.phone,
        isDefault: false,
      };
      const address = await addressService.createAddress(
        user.id,
        addressPayload,
      );

      if (serviceCheckout) {
        const serviceOrder = await serviceMarketplaceService.createServiceOrder(
          serviceCheckout.id,
          {
            message: formData.notes || "",
            scheduled_date: null,
            package_id: null,
          },
        );

        const serviceOrderNumber =
          serviceOrder.order_number ||
          serviceOrder.orderNumber ||
          serviceOrder.id?.substring(0, 8)?.toUpperCase() ||
          "See your account for order details";
        setCreatedOrderId(String(serviceOrder.id || serviceCheckout.id));
        setOrderNumber(String(serviceOrderNumber));
        toast.success("Service booked successfully!");
        onNavigate(`order-confirmation/${serviceOrder.id || serviceCheckout.id}`);
        return;
      }

      if (paymentMethod === "card") {
        stripePayment.resetStripeState();
        const stripeConfigData = await stripePayment.fetchStripeConfig();
        const intentData = await stripePayment.createPaymentIntent({
          shippingAddressId: address.id,
          notes: formData.notes,
        });

        if (
          stripeConfigData.publishableKey &&
          intentData.clientSecret &&
          intentData.paymentIntentId
        ) {
          setShowStripeForm(true);
          setPlacedOrdersCount(cartGroups.length);
        } else {
          toast.error("Failed to start card payment. Please try again.");
        }
        setIsProcessing(false);
        return;
      }

      // The backend creates one order per seller group and clears the cart once (COD flow).
      const orderData: CreateOrderData = {
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product!.price,
        })),
        shippingAddressId: address.id,
        paymentMethod: paymentMethod,
        notes: formData.notes,
      };

      const orderResponse: any = await orderService.createOrder(orderData);

      const firstOrder =
        orderResponse?.orders?.[0] ||
        orderResponse?.data?.orders?.[0] ||
        orderResponse;
      const orderId = firstOrder?.id;
      setCreatedOrderId(orderId);
      setPlacedOrdersCount(cartGroups.length);

      const fallbackOrderNumber =
        firstOrder?.order_number ||
        firstOrder?.orderNumber ||
        firstOrder?.id?.substring(0, 8)?.toUpperCase() ||
        "See your account for order details";
      setOrderNumber(String(fallbackOrderNumber));
      toast.success("Order placed successfully! Pay on delivery.");
      onPlaceOrder();
      onNavigate(`order-confirmation/${orderId}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCancelStripePayment = async () => {
    if (!createdOrderId) {
      setShowStripeForm(false);
      stripePayment.resetStripeState();
      return;
    }
    setIsProcessing(true);
    try {
      await api.post(`/orders/${createdOrderId}/cancel`, { reason: "Payment abandoned or failed" });
      toast.info("Order cancelled. Your items are still in your cart.");
      setShowStripeForm(false);
      setCreatedOrderId(null);
      createdOrderIdRef.current = null;
      paymentSucceededRef.current = false;
      stripePayment.resetStripeState();
    } catch (err) {
      console.error("Failed to cancel order on user action:", err);
      // Fallback: Reset state anyway to let user retry or select COD
      setShowStripeForm(false);
      setCreatedOrderId(null);
      createdOrderIdRef.current = null;
      paymentSucceededRef.current = false;
      stripePayment.resetStripeState();
    } finally {
      setIsProcessing(false);
    }
  };

  if (
    showStripeForm &&
    stripePayment.stripeConfig &&
    stripePayment.clientSecret &&
    stripePayment.paymentIntentId
  ) {
    return (
      <div className="stripe-form-container">
        <h1 className="stripe-form-title">Enter Card Details</h1>
        <p className="stripe-form-subtitle">
          Complete your payment securely using Stripe test card.
        </p>
        <StripeProviderWrapper
          publishableKey={stripePayment.stripeConfig.publishableKey}
        >
          <StripeCardForm
            clientSecret={stripePayment.clientSecret}
            paymentIntentId={stripePayment.paymentIntentId}
            onPaymentSuccess={async (paymentIntentId: string) => {
              paymentSucceededRef.current = true;
              const confirmResponse = await stripePayment.confirmPaymentToBackend(paymentIntentId);
              setShowStripeForm(false);
              stripePayment.resetStripeState();
              toast.success("Payment successful! Order confirmed.");
              onPlaceOrder();
              const confirmedOrderId = confirmResponse.orderId || confirmResponse.data?.orderId;
              onNavigate(`order-confirmation/${confirmedOrderId}`);
            }}
          />
        </StripeProviderWrapper>
        <div style={{ marginTop: "1.5rem" }}>
          <button
            type="button"
            onClick={handleCancelStripePayment}
            disabled={isProcessing}
            className="success-button-outline"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.875rem",
              transition: "all 0.2s ease",
            }}
          >
            Cancel & Go Back
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-success-container">
        <div className="success-icon-wrapper">
          <Icons.Check className="success-icon" />
        </div>
        <h1 className="success-title">
          {serviceCheckout
            ? "Service Checkout Completed!"
            : placedOrdersCount > 1
              ? "Orders Placed Successfully!"
              : "Order Placed Successfully!"}
        </h1>
        <p className="success-message">
          {serviceCheckout
            ? `Thank you for booking ${serviceCheckout.name}. Your service order `
            : placedOrdersCount > 1
              ? `Thank you for shopping with BuildHive. Your ${placedOrdersCount} orders `
              : "Thank you for shopping with BuildHive. Your order "}
          <span className="success-order-number">
            #{orderNumber || "See your account for order details"}
          </span>{" "}
          {serviceCheckout
            ? "has been confirmed and the provider will contact you shortly."
            : "has been confirmed and will be shipped shortly."}
        </p>
        <div className="success-buttons">
          <Button
            onClick={() => onNavigate("home")}
            variant="outline"
            className="success-button-outline"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => onNavigate("products")}
            className="success-button-primary"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb-nav">
          <span
            className="breadcrumb-link"
            onClick={() => onNavigate(serviceCheckout ? "services" : "cart")}
          >
            {serviceCheckout ? "Services" : "Cart"}
          </span>
          <Icons.ChevronRight className="breadcrumb-separator" />
          <span className="breadcrumb-active">Checkout</span>
          <Icons.ChevronRight className="breadcrumb-separator" />
          <span className="breadcrumb-link">Confirmation</span>
        </nav>

        <form onSubmit={handlePlaceOrder} className="checkout-form-wrapper">
          {/* Left Column - Form */}
          <div className="checkout-form-main">
            {/* Contact Info */}
            <div className="checkout-form-section">
              <h2 className="section-title">
                <Icons.User className="section-title-icon" /> Contact
                Information
              </h2>
              <div className="form-group">
                <div className="form-field">
                  <label className="form-label">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Phone Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="0300 1234567"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="checkout-form-section">
              <h2 className="section-title">
                <Icons.MapPin className="section-title-icon" /> Shipping Address
              </h2>
              <div className="space-y-4">
                {savedAddresses.length > 0 && (
                  <div className="form-field">
                    <label className="form-label">Select saved address</label>
                    <select
                      className="form-input"
                      aria-label="Select saved address"
                      value={selectedSavedAddressId}
                      onChange={(event) =>
                        applySavedAddress(event.target.value)
                      }
                    >
                      <option value="">Manual entry</option>
                      {savedAddresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.full_name} - {address.address_line1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <div className="form-field">
                    <label className="form-label">Full Name *</label>
                    <input
                      required
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      aria-label="Full Name"
                      className={`form-input ${
                        errors.full_name ? "error" : ""
                      }`}
                    />
                    {errors.full_name && (
                      <p className="form-error">{errors.full_name}</p>
                    )}
                  </div>
                  <div className="form-field">
                    <label className="form-label">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0300 1234567"
                      aria-label="Phone"
                      className={`form-input ${errors.phone ? "error" : ""}`}
                    />
                    {errors.phone && (
                      <p className="form-error">{errors.phone}</p>
                    )}
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label">Street Address *</label>
                  <input
                    required
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    placeholder="House # 123, Street Name"
                    aria-label="Address Line 1"
                    className={`form-input ${
                      errors.address_line1 ? "error" : ""
                    }`}
                  />
                  {errors.address_line1 && (
                    <p className="form-error">{errors.address_line1}</p>
                  )}
                </div>
                <div className="form-field">
                  <label className="form-label">
                    Apartment, Suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleInputChange}
                    placeholder="Apartment 4B"
                    aria-label="Address Line 2"
                    className="form-input"
                  />
                </div>
                <div className="form-group-3col">
                  <div className="form-field">
                    <label className="form-label">City *</label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Karachi"
                      aria-label="City"
                      className={`form-input ${errors.city ? "error" : ""}`}
                    />
                    {errors.city && <p className="form-error">{errors.city}</p>}
                  </div>
                  <div className="form-field">
                    <label className="form-label">State/Province *</label>
                    <input
                      required
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Sindh"
                      aria-label="State"
                      className={`form-input ${errors.state ? "error" : ""}`}
                    />
                    {errors.state && (
                      <p className="form-error">{errors.state}</p>
                    )}
                  </div>
                  <div className="form-field">
                    <label className="form-label">Postal Code *</label>
                    <input
                      required
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      placeholder="75500"
                      aria-label="Postal Code"
                      className={`form-input ${
                        errors.postal_code ? "error" : ""
                      }`}
                    />
                    {errors.postal_code && (
                      <p className="form-error">{errors.postal_code}</p>
                    )}
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label">Order Notes (optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special instructions for delivery..."
                    className="form-textarea"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-form-section">
              <h2 className="section-title">
                <Icons.CreditCard className="section-title-icon" /> Payment
                Method
              </h2>
              <div className="payment-methods">
                {orderedPaymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`payment-method-label ${
                      paymentMethod === method.id ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-radio"
                    />
                    <div className="payment-method-icon-wrapper">
                      {method.id === "cod" ? (
                        <Icons.Cash className="payment-method-icon" />
                      ) : (
                        <Icons.CreditCard className="payment-method-icon" />
                      )}
                    </div>
                    <div className="payment-method-content">
                      <div className="payment-method-name">{method.name}</div>
                      <div className="payment-method-desc">{method.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary-container">
            <div className="order-summary-sticky">
              <h2 className="order-summary-title">Order Summary</h2>

              <div className="order-items-scroll no-scrollbar">
                {serviceLoading && !serviceCheckout ? (
                  <div className="order-item">
                    <div className="order-item-details">
                      <h4 className="order-item-title">Loading service...</h4>
                    </div>
                  </div>
                ) : serviceCheckout ? (
                  <div className="order-item">
                    <div className="order-item-image-wrapper">
                      <img
                        src={serviceCheckout.image || "/Build-Hive-Logo.png"}
                        alt={serviceCheckout.name}
                        className="order-item-image"
                      />
                    </div>
                    <div className="order-item-details">
                      <h4 className="order-item-title">
                        {serviceCheckout.name}
                      </h4>
                      <div className="order-item-meta">
                        <span>
                          {serviceCheckout.provider || "Service provider"}
                        </span>
                        <span className="order-item-price">
                          PKR{" "}
                          {Number(serviceCheckout.price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const product = item.product;
                    const itemImage =
                      product?.images?.[0]?.image_url || "/Build-Hive-Logo.png";
                    const itemTitle = product?.name || "Cart item";
                    const itemPrice = product?.price || 0;

                    return (
                      <div key={item.id} className="order-item">
                        <div className="order-item-image-wrapper">
                          <img
                            src={itemImage}
                            alt={itemTitle}
                            className="order-item-image"
                          />
                        </div>
                        <div className="order-item-details">
                          <h4 className="order-item-title">{itemTitle}</h4>
                          <div className="order-item-meta">
                            <span>Qty: {item.quantity}</span>
                            <span className="order-item-price">
                              PKR {(itemPrice * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="order-summary-divider">
                <div className="order-summary-row">
                  <span>Subtotal</span>
                  <span className="order-summary-row-amount">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="order-summary-row">
                  <span>Tax (5%)</span>
                  <span className="order-summary-row-amount">
                    PKR {tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="order-total">
                <span>Total</span>
                <span>PKR {total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isProcessing || !formIsValid}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>

              <div className="terms-text">
                By placing this order, you agree to our{" "}
                <a href="#" className="terms-link">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

