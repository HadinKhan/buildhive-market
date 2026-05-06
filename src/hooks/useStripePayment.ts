import { useCallback, useState } from "react";
import api from "../services/api";

export interface StripeConfig {
  publishableKey: string;
  mode: string;
}

export interface StripePaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

const normalizeResponseData = <T,>(payload: any): T => payload?.data ?? payload;

export function useStripePayment() {
  const [stripeConfig, setStripeConfig] = useState<StripeConfig | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetStripeState = useCallback(() => {
    setStripeConfig(null);
    setClientSecret(null);
    setPaymentIntentId(null);
    setError(null);
  }, []);

  const fetchStripeConfig = useCallback(async (): Promise<StripeConfig> => {
    console.log("[Stripe] Fetching config...");
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/payment/config");
      console.log("[Stripe] Config response:", res.data);
      const data = normalizeResponseData<Partial<StripeConfig> & { publishable_key?: string }>(res.data);
      const normalizedConfig: StripeConfig = {
        publishableKey: data.publishableKey || data.publishable_key || "",
        mode: data.mode || "test",
      };

      if (!normalizedConfig.publishableKey) {
        throw new Error("Stripe publishable key was not returned by the backend.");
      }

      setStripeConfig(normalizedConfig);
      return normalizedConfig;
    } catch (err: any) {
      console.error("[Stripe] Config error:", err);
      setError("Failed to fetch Stripe config");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPaymentIntent = useCallback(async (orderId: string): Promise<StripePaymentIntent> => {
    console.log("[Stripe] Creating payment intent for orderId:", orderId);
    if (!orderId) {
      throw new Error("Order ID missing");
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/payment/create-payment-intent", { orderId });
      console.log("[Stripe] Payment intent response:", res.data);
      const data = normalizeResponseData<Partial<StripePaymentIntent> & { client_secret?: string; payment_intent_id?: string }>(res.data);
      const normalizedIntent: StripePaymentIntent = {
        clientSecret: data.clientSecret || data.client_secret || "",
        paymentIntentId: data.paymentIntentId || data.payment_intent_id || "",
      };

      if (!normalizedIntent.clientSecret || !normalizedIntent.paymentIntentId) {
        throw new Error("Stripe payment intent response was missing required fields.");
      }

      setClientSecret(normalizedIntent.clientSecret);
      setPaymentIntentId(normalizedIntent.paymentIntentId);
      return normalizedIntent;
    } catch (err: any) {
      console.error("[Stripe] Payment intent error:", err);
      if (err.response) {
        console.error("[Stripe] Error response data:", err.response.data);
      }
      setError("Failed to create payment intent");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmPaymentToBackend = useCallback(async (paymentIntentId: string) => {
    console.log("[Stripe] Confirming payment to backend for paymentIntentId:", paymentIntentId);
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/payment/confirm-payment", { paymentIntentId });
      console.log("[Stripe] Confirm payment response:", res.data);
      return normalizeResponseData(res.data);
    } catch (err: any) {
      console.error("[Stripe] Confirm payment error:", err);
      if (err.response) {
        console.error("[Stripe] Error response data:", err.response.data);
      }
      setError("Failed to confirm payment");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stripeConfig,
    clientSecret,
    paymentIntentId,
    loading,
    error,
    resetStripeState,
    fetchStripeConfig,
    createPaymentIntent,
    confirmPaymentToBackend,
  };
}
