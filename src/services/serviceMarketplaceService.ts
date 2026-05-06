import api from "./api";
import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const BASE_URL = `${rawBaseUrl.replace(/\/$/, "").replace(/\/api$/, "")}/api`;

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
  async getServices(params?: GetServicesParams) {
    const response = await api.get<ApiResponse<any>>("/services", { params });
    const data = response.data.data;
    return {
      services: data?.services || data?.items || (Array.isArray(data) ? data : []),
      meta: data?.pagination || data?.meta || {},
    };
  },

  // Public, unauthenticated services endpoint
  async getPublicServices(params?: GetServicesParams) {
    const client = axios.create({ baseURL: BASE_URL, timeout: 30000, headers: { "Content-Type": "application/json" } });
    const response = await client.get<ApiResponse<any>>("/services/public", { params });
    const data = response.data.data;
    return {
      services: data?.services || data?.items || (Array.isArray(data) ? data : []),
      meta: data?.pagination || data?.meta || {},
    };
  },

  async getServiceById(id: string) {
    const response = await api.get<ApiResponse<any>>(`/services/${id}`);
    return response.data.data;
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
};
