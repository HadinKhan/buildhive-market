import api from './api';

// =============================================
// API Response Types
// =============================================
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

// =============================================
// Product Types
// =============================================
export interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary?: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  business_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  sku?: string;
  barcode?: string;
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  track_quantity: boolean;
  quantity: number;
  weight?: number;
  weight_unit: string;
  requires_shipping: boolean;
  is_physical: boolean;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  status: 'approved' | 'pending' | 'rejected';
  is_active: boolean;
  is_featured: boolean;
  rejection_reason?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  average_rating?: number;
  total_reviews?: number;
  rating_1_count?: number;
  rating_2_count?: number;
  rating_3_count?: number;
  rating_4_count?: number;
  rating_5_count?: number;
  categories?: {
    name: string;
    slug: string;
  };
  businesses?: {
    business_name: string;
  };
  product_images?: ProductImage[];
}

// =============================================
// Query Parameters
// =============================================
export interface GetProductsParams {
  search?: string;
  categoryId?: string;
  businessId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: 'approved' | 'pending' | 'rejected';
  isActive?: boolean;
}

// =============================================
// Product Service
// =============================================
class ProductService {
  /**
   * Get all products with filters
   */
  async getProducts(params?: GetProductsParams): Promise<{ products: Product[]; meta: any }> {
    try {
      const response = await api.get<ApiResponse<{ products: Product[]; pagination: any }>>('/products', {
        params,
      });
    
      // Backend returns data: { products: [], pagination: {} }
      const productsData = response.data.data;
    
      return {
        products: productsData.products || [],
        meta: productsData.pagination || {},
      };
    } catch (error) {
      console.error('Products fetch failed:', error);
      return {
        products: [],
        meta: {
          total: 0,
          page: 1,
          limit: params?.limit ?? 0,
          totalPages: 0,
        },
      };
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Product fetch failed:', error);
      throw error;
    }
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/slug/${slug}`);
    
    return response.data.data;
  }

  /**
   * Search products
   */
  async searchProducts(searchTerm: string, filters?: Omit<GetProductsParams, 'search'>): Promise<{ products: Product[]; meta: any }> {
    return this.getProducts({
      search: searchTerm,
      ...filters,
    });
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string, params?: Omit<GetProductsParams, 'categoryId'>): Promise<{ products: Product[]; meta: any }> {
    return this.getProducts({
      categoryId,
      ...params,
    });
  }

  /**
   * Get products by supplier/business
   */
  async getProductsByBusiness(businessId: string, params?: Omit<GetProductsParams, 'businessId'>): Promise<{ products: Product[]; meta: any }> {
    return this.getProducts({
      businessId,
      ...params,
    });
  }

  /**
   * Get featured/recommended products (most recent approved products)
   */
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const response = await this.getProducts({
      status: 'approved',
      isActive: true,
      limit,
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
    
    return response.products;
  }

  /**
   * Get product reviews
   */
  async getProductReviews(productId: string): Promise<any[]> {
    const response = await api.get<ApiResponse<any[]>>(`/products/${productId}/reviews`);
    
    return response.data.data;
  }

  /**
   * Create product review
   */
  async createReview(productId: string, reviewData: { rating: number; comment?: string }): Promise<any> {
    const response = await api.post<ApiResponse<any>>(`/products/${productId}/reviews`, reviewData);
    
    return response.data.data;
  }

  /**
   * Update product review
   */
  async updateReview(productId: string, reviewId: string, reviewData: { rating?: number; comment?: string }): Promise<any> {
    const response = await api.put<ApiResponse<any>>(`/products/${productId}/reviews/${reviewId}`, reviewData);
    
    return response.data.data;
  }

  /**
   * Delete product review
   */
  async deleteReview(productId: string, reviewId: string): Promise<void> {
    await api.delete(`/products/${productId}/reviews/${reviewId}`);
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService;
