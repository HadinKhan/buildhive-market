import api from "./api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface GetServicesParams {
  search?: string;
  categoryId?: string;
  subcategory?: string;
  providerId?: string;
  minPrice?: number;
  maxPrice?: number;
  priceType?: string;
  minRating?: number;
  minExperience?: number;
  location?: string;
  availability?: string;
  specialty?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ServiceQuoteData {
  serviceId: string;
  projectDetails: string;
  budget: string;
  timeline: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
}

export interface ServiceOrderMilestone {
  title: string;
  description?: string;
  dueDate?: string;
  amount?: number;
}

export interface ServiceOrderData {
  title?: string;
  description?: string;
  budget?: number;
  startDate?: string;
  deadline?: string;
  milestones?: ServiceOrderMilestone[];
  message?: string;
  scheduled_date?: string | null;
  package_id?: string | null;
}

export interface ServiceContractorProfileResponse {
  service?: any;
  contractor?: any;
  contractorProfile?: any;
  contractor_profile?: any;
  portfolioItems?: any[];
  portfolio_items?: any[];
  reviewSummary?: any;
  review_summary?: any;
  message?: string;
}

export const serviceMarketplaceService = {
  async getServices(filters?: { category?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.limit) params.append("limit", String(filters.limit));

    const query = params.toString();
    const response = await api.get(`/services${query ? `?${query}` : ""}`);
    const data = response.data?.data ?? response.data ?? [];
    const services = Array.isArray(data)
      ? data
      : Array.isArray(data?.services)
        ? data.services
        : [];
    return services;
  },

  // Public, unauthenticated services endpoint
  async getPublicServices(params?: GetServicesParams) {
    const response = await api.get<ApiResponse<any>>("/services/public", { params });
    const data = response.data.data;
    return {
      services: data?.services || data?.items || (Array.isArray(data) ? data : []),
      meta: data?.pagination || data?.meta || {},
    };
  },

  async getServiceById(id: string) {
    const response = await api.get(`/services/${id}`);
    return response.data?.data ?? response.data;
  },

  async getServiceReviews(serviceId: string) {
    const response = await api.get(`/reviews/service/${serviceId}`);
    const data = response.data?.data ?? response.data ?? [];
    return Array.isArray(data)
      ? data
      : Array.isArray(data?.reviews)
        ? data.reviews
        : [];
  },

  async getServiceContractorProfile(id: string) {
    const response = await api.get<ApiResponse<ServiceContractorProfileResponse>>(`/services/${id}/contractor-profile`);
    return response.data.data;
  },

  async createServiceOrder(id: string, data: ServiceOrderData = {}) {
    const response = await api.post<ApiResponse<any>>(`/services/${id}/order`, data);
    return response.data.data;
  },

  async getServiceProviders(params?: Record<string, any>) {
    const response = await api.get<ApiResponse<any>>("/service-providers", { params });
    const data = response.data.data;
    return {
      providers: data?.providers || data?.items || (Array.isArray(data) ? data : []),
      meta: data?.pagination || data?.meta || {},
    };
  },

  async getServiceProviderById(id: string) {
    const response = await api.get<ApiResponse<any>>(`/service-providers/${id}`);
    return response.data.data;
  },

  async requestQuote(data: ServiceQuoteData) {
    const response = await api.post<ApiResponse<any>>("/service-quotes", data);
    return response.data.data;
  },

  async createReview(data: { serviceId: string; rating: number; comment: string; contractorId: string; projectId?: string }) {
    const response = await api.post("/reviews", data);
    return response.data?.data ?? response.data;
  },
};
