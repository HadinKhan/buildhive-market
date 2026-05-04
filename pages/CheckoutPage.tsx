import React, { useState, useEffect } from "react";
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
import {
  INITIAL_FORM_DATA,
  PAYMENT_METHODS,
  REQUIRED_FIELDS,
  TAX_RATE,
  type FormData,
} from "../src/data/checkoutPageData";
import { checkoutPageStyles } from "../src/styles/checkoutPageStyles";

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
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [stripeConfig, setStripeConfig] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const stripePayment = useStripePayment();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

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
      alert("Please fill in all required fields");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      console.log("📦 [Checkout] Cart items before order:", cartItems);

      // Validate cart items have product data
      const invalidItems = cartItems.filter(
        (item) => !item.product || !item.product.price
      );
      if (invalidItems.length > 0) {
        console.error("❌ [Checkout] Invalid cart items:", invalidItems);
        toast.error(
          "Cart data is incomplete. Please refresh the page and try again."
        );
        return;
      }

      // Step 1: Create address first
      console.log("📍 [Checkout] Creating shipping address...");
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
      console.log("📤 [Checkout] Address payload:", addressPayload);
      const address = await addressService.createAddress(
        user.id,
        addressPayload
      );
      console.log("✅ [Checkout] Address created:", address.id);

      // Step 2: Create order with address ID
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

      console.log("==== ORDER CREATION DEBUG ====");
      console.log("Order payload:", JSON.stringify(orderData, null, 2));
      console.log("Payment method:", orderData.paymentMethod);
      console.log("Shipping Address ID:", orderData.shippingAddressId);
      console.log("Items:", orderData.items);

      let orderResponse;
      try {
        orderResponse = await orderService.createOrder(orderData);
        console.log("✅ [OrderService] Order response:", orderResponse);
      } catch (orderError) {
        console.error("❌ [OrderService] Order creation error:", orderError);
        throw orderError;
      }































      // Extract order from array if needed
      const order = orderResponse.orders
        ? orderResponse.orders[0]
        : orderResponse;
      setCreatedOrderId(order.id);
      console.log("[Checkout] Extracted order:", order);

      if (paymentMethod === "card") {
        // Stripe payment flow
         // Stripe payment flow
        console.log(
          "[Checkout] Starting Stripe payment flow for order:",
          order.id
        );
        const configRes = await stripePayment.fetchStripeConfig();
        const intentRes = await stripePayment.createPaymentIntent(order.id);
        
        // Extract nested data correctly - API returns {success, message, data: {...}}
        const newStripeConfig = configRes?.data || configRes;
        const newClientSecret = intentRes?.data?.clientSecret || intentRes?.clientSecret;
        const newPaymentIntentId = intentRes?.data?.paymentIntentId || intentRes?.paymentIntentId;
        
        console.log("[Checkout] Extracted Stripe data:", {
          configRes,
          intentRes,
          newStripeConfig,
          newClientSecret,
          newPaymentIntentId,
        });
        
        setStripeConfig(newStripeConfig);
        setClientSecret(newClientSecret);
        setPaymentIntentId(newPaymentIntentId);
        console.log("[Checkout] Stripe local state after payment intent:", {
          newStripeConfig,
          newClientSecret,
          newPaymentIntentId,
        });
        if (newStripeConfig && newClientSecret && newPaymentIntentId) {
          setShowStripeForm(true);
          console.log("[Checkout] Stripe form should now be shown.");
        } else {
          console.error("[Checkout] Stripe payment intent creation failed.");
          toast.error("Failed to start card payment. Please try again.");
        }
        setIsProcessing(false);
        return;
      }

      setOrderNumber(order.order_number);
      setOrderPlaced(true);
      onPlaceOrder(); // Clear cart
      toast.success(`Order placed successfully! Order #${order.order_number}`);
    } catch (error: any) {
      console.error("Failed to place order:", error);
      console.error(
        "❌ [Checkout] Backend error response:",
        error.response?.data
      );








































      // Log detailed validation errors
      if (error.response?.data?.errors) {
        console.error(
          "🔴 [Checkout] Validation errors:",
          error.response.data.errors
        );
        if (Array.isArray(error.response.data.errors)) {
          error.response.data.errors.forEach((err: any, index: number) => {
            console.error(`   Error ${index + 1}:`, err);
            if (typeof err === "object") {
              console.error(
                `     - Field:`,
                err.field || err.path || "unknown"
              );
              console.error(`     - Message:`, err.message || err.msg || err);
            }
          });
        } else {
          // errors is a string
          console.error("   Error:", error.response.data.errors);
        }
      }

      console.log(
        "📋 Full error response object:",
        JSON.stringify(error.response?.data, null, 2)
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (showStripeForm && stripeConfig && clientSecret && paymentIntentId) {
    return (
      <div className="stripe-form-container">
        <h1 className="stripe-form-title">Enter Card Details</h1>
        <p className="stripe-form-subtitle">
          Complete your payment securely using Stripe test card.
        </p>
        <StripeProviderWrapper publishableKey={stripeConfig.publishableKey}>
          <StripeCardForm
            clientSecret={clientSecret}
            paymentIntentId={paymentIntentId}
            onPaymentSuccess={async (paymentIntentId) => {
              await stripePayment.confirmPaymentToBackend(paymentIntentId);
              setOrderPlaced(true);
              setShowStripeForm(false);
              onPlaceOrder();
              toast.success("Payment successful! Your order is confirmed.");
            }}
          />
        </StripeProviderWrapper>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-success-container">
        <div className="success-icon-wrapper">
          <Icons.Check className="success-icon" />
        </div>
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for shopping with BuildHive. Your order{" "}
          <span className="success-order-number">
            #BH-{Math.floor(Math.random() * 100000)}
          </span>{" "}
          has been confirmed and will be shipped shortly.
        </p>
        <div className="success-buttons">
          <Button
            onClick={() => onNavigate("home")}
            variant="outline"
            className="success-button-outline"
          >
            Back to Home
          </Button>
          <Button onClick={() => onNavigate("products")} className="success-button-primary">
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
            onClick={() => onNavigate("cart")}
          >
            Cart
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
                    {errors.city && (
                      <p className="form-error">{errors.city}</p>
                    )}
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
                  <label className="form-label">
                    Order Notes (optional)
                  </label>
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
                {PAYMENT_METHODS.map((method) => (
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
                      <div className="payment-method-name">
                        {method.name}
                      </div>
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
                {cartItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-image-wrapper">
                      <img
                        src={item.image}
                        alt=""
                        className="order-item-image"
                      />
                    </div>
                    <div className="order-item-details">
                      <h4 className="order-item-title">{item.title}</h4>
                      <div className="order-item-meta">
                        <span>Qty: {item.quantity}</span>
                        <span className="order-item-price">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                    PKR {tax.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="order-total">
                <span>Total</span>
                <span>PKR {total.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isProcessing}
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
