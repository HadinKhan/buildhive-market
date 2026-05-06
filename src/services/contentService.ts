import api from "./api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

export const contentService = {
  async getAbout() {
    return unwrap(await api.get<ApiResponse<any>>("/content/about"));
  },

  async getBlog(params?: { category?: string; search?: string; page?: number; limit?: number }) {
    return unwrap(await api.get<ApiResponse<any>>("/content/blog", { params }));
  },

  async getBlogDetail(idOrSlug: string) {
    return unwrap(await api.get<ApiResponse<any>>(`/content/blog/${idOrSlug}`));
  },

  async getTerms() {
    return unwrap(await api.get<ApiResponse<any>>("/content/legal/terms"));
  },

  async getPrivacy() {
    return unwrap(await api.get<ApiResponse<any>>("/content/legal/privacy"));
  },

  async getGetStarted() {
    return unwrap(await api.get<ApiResponse<any>>("/content/get-started"));
  },

  async getSignIn() {
    return unwrap(await api.get<ApiResponse<any>>("/content/sign-in"));
  },

  async getCheckoutConfig() {
    return unwrap(await api.get<ApiResponse<any>>("/content/checkout-config"));
  },

  async getContact() {
    return unwrap(await api.get<ApiResponse<any>>("/content/contact"));
  },
};
