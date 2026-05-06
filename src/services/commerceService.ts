import api from "./api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface PromoValidationRequest {
  code: string;
  cartTotal: number;
}

export const commerceService = {
  async getCartRecommendations() {
    const response = await api.get<ApiResponse<any>>("/cart/recommendations");
    const data = response.data.data;
    return data?.products || data?.items || (Array.isArray(data) ? data : []);
  },

  async getPaymentMethods() {
    const response = await api.get<ApiResponse<any>>("/payment-methods");
    const data = response.data.data;
    return data?.paymentMethods || data?.items || (Array.isArray(data) ? data : []);
  },

  async validatePromoCode(payload: PromoValidationRequest) {
    const response = await api.post<ApiResponse<any>>("/promo-codes/validate", payload);
    return response.data.data;
  },
};
