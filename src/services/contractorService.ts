import axios from "axios";
import api from "./api";
import type {
  ContractorPortfolioEntry,
  ContractorProfile,
  ContractorReviewEntry,
  ContractorServiceOffer,
  ContractorSummary,
} from "../../types";

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const BASE_URL = `${rawBaseUrl.replace(/\/$/, "").replace(/\/api$/, "")}/api`;

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: Record<string, any>;
}

interface ContractorFilters {
  category?: string;
  minRating?: number;
  location?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

const publicClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const toArray = (value: any): any[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return (
    value?.data?.items ||
    value?.data?.businesses ||
    value?.data?.users ||
    value?.data?.services ||
    value?.data?.reviews ||
    value?.data?.portfolio ||
    value?.data?.portfolio_items ||
    value?.items ||
    value?.businesses ||
    value?.users ||
    value?.services ||
    value?.reviews ||
    value?.portfolio ||
    value?.portfolio_items ||
    []
  );
};

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const safeString = (value: unknown, fallback = ""): string => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const text = String(value).trim();
  return text || fallback;
};

const cityOnly = (value: unknown): string => {
  const text = safeString(value);
  if (!text) {
    return "";
  }

  return text.split(",")[0].trim();
};

const normaliseTrade = (item: Record<string, any>): string => {
  return (
    safeString(item.category || item.trade || item.business_type || item.type || item.specialty) ||
    "Contractor"
  );
};

const normaliseContractorSummary = (item: Record<string, any>): ContractorSummary => {
  const services = toArray(item.services || item.service || item.service_list);
  const skills = toArray(item.skills || item.specialties || item.tags).map((skill) => safeString(skill)).filter(Boolean);
  const businessId = safeString(item.business_id || item.businessId || item.id || item.business?.id || item.business?.business_id);
  const userId = safeString(item.user_id || item.userId || item.user?.id || item.user?.user_id);
  const name =
    safeString(
      item.business_name ||
        item.name ||
        item.full_name ||
        item.fullName ||
        item.user?.full_name ||
        item.user?.fullName,
      "Contractor",
    ) || "Contractor";
  const rating = toNumber(item.average_rating ?? item.rating ?? item.review_rating, 0);
  const reviewCount = toNumber(item.total_reviews ?? item.review_count ?? item.reviews_count, 0);
  const startingPrice = toNumber(
    item.starting_price ?? item.min_price ?? item.lowest_service_price ?? services?.[0]?.price,
    0,
  );

  return {
    id: businessId || userId || name,
    userId: userId || undefined,
    businessId: businessId || undefined,
    name,
    trade: normaliseTrade(item),
    category: safeString(item.category || item.trade || item.business_type) || undefined,
    bio: safeString(item.bio || item.description || item.about || item.summary),
    rating,
    reviewCount,
    location: cityOnly(item.city || item.location || item.address?.city || item.business?.city || item.business?.location),
    city: cityOnly(item.city || item.address?.city || item.business?.city),
    verified:
      Boolean(item.verified ?? item.is_verified ?? item.approved ?? item.isApproved) ||
      safeString(item.status || item.business_status).toLowerCase() === "approved",
    servicesCount: toNumber(item.services_count ?? item.total_services ?? item.service_count ?? services.length, services.length),
    startingPrice: startingPrice > 0 ? startingPrice : undefined,
    availableNow: Boolean(item.available_now ?? item.is_available ?? item.availableNow),
    memberSince: safeString(item.created_at || item.createdAt) || undefined,
    responseTime: safeString(item.avg_response_time || item.response_time || item.responseTime) || undefined,
    avatar: item.logo || item.profile_image || item.profileImage || item.avatar || null,
    image: item.image || item.photo || item.avatar || null,
    featured: Boolean(item.featured ?? item.is_featured ?? item.isFeatured),
    skills,
  };
};

const normalisePortfolioEntry = (item: Record<string, any>): ContractorPortfolioEntry => ({
  id: safeString(item.id || item.portfolio_id || item.slug || item.title),
  title: safeString(item.title || item.name || "Portfolio item"),
  description: safeString(item.description || item.caption || item.summary) || undefined,
  image: item.image || item.image_url || item.imageUrl || item.photo || null,
  createdAt: safeString(item.created_at || item.createdAt) || undefined,
  category: safeString(item.category || item.tag || item.discipline || ""),
  projectBudget: item.project_budget !== undefined ? toNumber(item.project_budget, 0) : (item.projectBudget !== undefined ? toNumber(item.projectBudget, 0) : undefined),
});

const normaliseServiceOffer = (item: Record<string, any>): ContractorServiceOffer => ({
  id: safeString(item.id || item.service_id || item.slug || item.title),
  title: safeString(item.title || item.name || item.service_name || "Service"),
  description: safeString(item.description || item.short_description || item.summary || ""),
  price: toNumber(item.price ?? item.amount ?? item.starting_price, 0),
  deliveryTime: safeString(item.delivery_time || item.deliveryTime || item.timeline) || undefined,
  rating: toNumber(item.rating ?? item.average_rating ?? item.review_rating, 0),
  reviewCount: toNumber(item.review_count ?? item.total_reviews ?? item.reviews_count, 0),
  image: item.image || item.image_url || item.thumbnail || null,
});

const normaliseReviewEntry = (item: Record<string, any>): ContractorReviewEntry => ({
  id: safeString(item.id || item.review_id || item.slug || item.created_at),
  reviewerName: safeString(item.reviewer_name || item.reviewerName || item.reviewer?.full_name || item.user_name || item.name || "Anonymous"),
  rating: toNumber(item.rating ?? item.stars ?? item.score, 0),
  comment: safeString(item.comment || item.body || item.message || item.review || ""),
  response: safeString(item.response || item.contractor_response || item.reply || ""),
  createdAt: safeString(item.created_at || item.createdAt) || undefined,
});

const unwrapResponse = <T,>(response: ApiResponse<T> | any): T | any => {
  if (!response) {
    return null;
  }

  return response.data?.data ?? response.data ?? response;
};

const tryRequest = async <T,>(path: string, params?: Record<string, any>): Promise<T | null> => {
  try {
    const response = await publicClient.get<ApiResponse<T>>(path, { params });
    return unwrapResponse(response) as T;
  } catch {
    return null;
  }
};

const getCollection = (payload: any): any[] => {
  const items = toArray(payload);
  return Array.isArray(items) ? items : [];
};

const contractorService = {
  async getContractors(filters: ContractorFilters = {}): Promise<{ contractors: ContractorSummary[]; meta: Record<string, any> }> {
    const params = {
      type: "contractor",
      category: filters.category,
      minRating: filters.minRating,
      location: filters.location,
      page: filters.page,
      limit: filters.limit,
      featured: filters.featured,
    };

    const businessResponse = await tryRequest<any>("/business", params);
    const businessItems = getCollection(businessResponse);

    const rawItems =
      businessItems.length > 0
        ? businessItems
        : getCollection(await tryRequest<any>("/users", { ...params, role: "contractor" }));

    const contractors = rawItems.map((item) => normaliseContractorSummary(item));
    const meta =
      businessResponse?.pagination ||
      businessResponse?.meta ||
      businessResponse?.data?.pagination ||
      businessResponse?.data?.meta ||
      {};

    return { contractors, meta };
  },

  async getContractorPortfolio(contractorId: string): Promise<ContractorPortfolioEntry[]> {
    const response = await tryRequest<any>(`/portfolio/${contractorId}`);
    return getCollection(response).map((item) => normalisePortfolioEntry(item));
  },

  async getContractorReviews(contractorId: string): Promise<ContractorReviewEntry[]> {
    const response = await tryRequest<any>(`/reviews/contractor/${contractorId}`);
    return getCollection(response).map((item) => normaliseReviewEntry(item));
  },

  async getContractorServices(contractorId: string): Promise<ContractorServiceOffer[]> {
    const response = await tryRequest<any>("/services/public", { contractorId });
    return getCollection(response).map((item) => normaliseServiceOffer(item));
  },

  async getContractorById(id: string): Promise<ContractorProfile> {
    // Fetch business profile list and find the one belonging to this user ID
    const businessResponse = await tryRequest<any>("/business", { limit: 100 });
    const businessItems = getCollection(businessResponse);
    const business = businessItems.find((b: any) => b.user_id === id);

    // Fetch portfolio, reviews, and raw services in parallel
    const [portfolio, reviews, rawServicesResponse] = await Promise.all([
      this.getContractorPortfolio(id),
      this.getContractorReviews(id),
      tryRequest<any>("/services/public", { contractorId: id }),
    ]);

    const rawServices = getCollection(rawServicesResponse);
    const services = rawServices.map((item) => normaliseServiceOffer(item));

    // Fallbacks from raw services data
    const rawContractorInfo = rawServices[0]?.contractor || {};
    const rawCity = rawServices[0]?.city || "";

    const contractorName = business?.business_name || rawContractorInfo.full_name || "Contractor";
    const trade = business?.business_type || (rawServices[0]?.category?.name || rawServices[0]?.category || "Contractor");
    const phone = business?.phone || rawContractorInfo.phone || "";
    const email = business?.email || rawContractorInfo.email || "";
    const location = business?.city || business?.location || rawCity || "Location available on request";
    const bio = business?.description || "Professional contractor service.";

    // Calculate rating and reviewCount
    const rating = business?.rating || (reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0);
    const reviewCount = reviews.length;
    const verified = business ? (business.status === "approved") : (rawServices[0]?.verified || false);

    const skills = Array.from(new Set(rawServices.flatMap((s: any) => s.skills || s.tags || []))).map((skill) => safeString(skill)).filter(Boolean);

    const base: ContractorProfile = {
      id: business?.id || id, // businessId or userId
      userId: id,
      businessId: business?.id || undefined,
      name: contractorName,
      trade: trade,
      bio: bio,
      rating: rating,
      reviewCount: reviewCount,
      location: location,
      city: business?.city || location.split(",")[0].trim() || "",
      verified: verified,
      servicesCount: services.length,
      availableNow: true,
      avatar: business?.logo || rawContractorInfo.profile_image || null,
      image: business?.logo || rawContractorInfo.profile_image || null,
      featured: false,
      skills: skills,
      portfolio: portfolio,
      services: services,
      reviews: reviews,
      phone: phone,
      businessName: business?.business_name || "",
      about: bio,
      responseRate: business?.response_rate || undefined,
      avgResponseTime: business?.avg_response_time || undefined,
      memberSince: business?.created_at || undefined,
    };

    return base;
  },
};

export default contractorService;
export { contractorService };
