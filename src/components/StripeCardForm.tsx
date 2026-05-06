import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/Button";
import { FaLock, FaRegCreditCard } from "react-icons/fa";

interface StripeCardFormProps {
  clientSecret: string;
  paymentIntentId: string;
  onPaymentSuccess: (paymentIntentId: string) => Promise<void> | void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a202c",
      "::placeholder": { color: "#9ca3af" },
      fontFamily: "inherit",
      letterSpacing: "0.025em",
    },
    invalid: {
      color: "#ef4444",
    },
  },
};

const cardLogos = [
  { name: "Visa", src: "/payment/visa.svg" },
  { name: "Mastercard", src: "/payment/mastercard.svg" },
  { name: "American Express", src: "/payment/amex.svg" },
];

export const StripeCardForm: React.FC<StripeCardFormProps> = ({
  clientSecret,
  paymentIntentId,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError("Card element not found.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardNumberElement,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        await onPaymentSuccess(paymentIntentId);
      } else {
        setError("Payment was not successful. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-slate-200 bg-white/95 backdrop-blur p-7 sm:p-10 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
      <div className="mb-7 flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-100 p-3">
            <FaRegCreditCard color="#5b21b6" size="1.25rem" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Secure Checkout
            </p>
            <h2 className="text-2xl font-bold text-slate-900">Card Payment</h2>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <FaLock size="0.75rem" /> Encrypted by Stripe
        </span>
      </div>

      <p className="mb-5 text-sm text-slate-500">
        Enter your card details below to complete your order. Test mode uses
        Stripe sandbox cards.
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Card Number
            </label>
            <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 transition-all focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200">
              <CardNumberElement options={cardElementOptions} />
            </div>
          </div>

          {/* Expiry and CVC in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Expiry Date
              </label>
              <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 transition-all focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200">
                <CardExpiryElement options={cardElementOptions} />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                CVC
              </label>
              <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 transition-all focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200">
                <CardCvcElement options={cardElementOptions} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isProcessing || !stripe}
          className="w-full rounded-xl bg-violet-900 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-150 hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Pay Now"
          )}
        </Button>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Accepted Cards
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {cardLogos.map((logo) => (
              <img
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                className="h-8 w-auto rounded-md border border-slate-200 bg-white px-1"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
