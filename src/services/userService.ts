import api from './api';

// =============================================
// API Response Types
// =============================================
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// =============================================
// User/Profile Types
// =============================================
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  profile_image?: string;
  email_verified: boolean;
  phone_verified: boolean;
  role: 'buyer' | 'seller' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  address_type: 'shipping' | 'billing';
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  profile_image?: string;
}

export interface CreateAddressData {
  address_type: 'shipping' | 'billing';
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

// API expects camelCase, so we need to transform the data
interface ApiAddressData {
  addressType: 'shipping' | 'billing';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// Helper function to convert snake_case to camelCase for API
const toApiAddressData = (data: CreateAddressData | Partial<CreateAddressData>): Partial<ApiAddressData> => {
  return {
    addressType: data.address_type,
    fullName: data.full_name,
    phone: data.phone,
    addressLine1: data.address_line1,
    addressLine2: data.address_line2,
    city: data.city,
    state: data.state,
    postalCode: data.postal_code,
    country: data.country,
    isDefault: data.is_default,
  };
};

// =============================================
// User Service
// =============================================
class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    
    const response = await api.get<ApiResponse<UserProfile>>('/users/profile');
    
    
    return response.data.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfile> {

    const apiData = {
      fullName: data.full_name,
      phone: data.phone,
    };
    
    const response = await api.put<ApiResponse<UserProfile>>(`/users/${userId}`, apiData);
    
    
    return response.data.data;
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(userId: string, file: File): Promise<string> {
    
    const formData = new FormData();
    formData.append('image', file);
    
    
    const response = await api.put<ApiResponse<{ imageUrl: string }>>(`/users/${userId}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    
    return response.data.data.imageUrl;
  }

  /**
   * Delete profile image
   */
  async deleteProfileImage(userId: string): Promise<void> {
    
    await api.delete(`/users/${userId}/profile-image`);
    
  }

  /**
   * Get user addresses
   */
  async getAddresses(userId: string): Promise<Address[]> {
    
    const response = await api.get<ApiResponse<Address[]>>(`/users/${userId}/addresses`);
    
    
    return response.data.data;
  }

  /**
   * Get address by ID
   */
  async getAddressById(id: string): Promise<Address> {
    
    const response = await api.get<ApiResponse<Address>>(`/users/addresses/${id}`);
    
    
    return response.data.data;
  }

  /**
   * Create new address
   */
  async createAddress(userId: string, data: CreateAddressData): Promise<Address> {
    
    const apiData = toApiAddressData(data);
    
    const response = await api.post<ApiResponse<Address>>(`/users/${userId}/addresses`, apiData);
    
    
    return response.data.data;
  }

  /**
   * Update address
   */
  async updateAddress(userId: string, addressId: string, data: Partial<CreateAddressData>): Promise<Address> {
    
    const apiData = toApiAddressData(data);
    
    const response = await api.put<ApiResponse<Address>>(`/users/${userId}/addresses/${addressId}`, apiData);
    
    
    return response.data.data;
  }

  /**
   * Delete address
   */
  async deleteAddress(userId: string, addressId: string): Promise<void> {
    
    await api.delete(`/users/${userId}/addresses/${addressId}`);
    
  }

  /**
   * Set default address
   */
  async setDefaultAddress(userId: string, addressId: string): Promise<Address> {
    
    const response = await api.put<ApiResponse<Address>>(`/users/${userId}/addresses/${addressId}/default`);
    
    
    return response.data.data;
  }  /**
   * Get user wishlist
   */
  async getWishlist(): Promise<any[]> {
    const response = await api.get<ApiResponse<any>>('/wishlist');
    return response.data.data?.items || [];
  }  /**
   * Add to wishlist
   */
  async addToWishlist(productId: string): Promise<void> {
    await api.post('/wishlist', { productId });
  }  /**
   * Remove from wishlist
   */
  async removeFromWishlist(productId: string): Promise<void> {
    await api.delete(`/wishlist/${productId}`);
  }

  async getWishlistCount(): Promise<number> {
    const response = await api.get<ApiResponse<any>>('/wishlist/count');
    return Number(response.data.data?.count || 0);
  }

  /**
   * Get user notifications
   */
  async getNotifications(page = 1, limit = 20): Promise<{ notifications: any[]; meta: any }> {
    
    const response = await api.get<ApiResponse<{ notifications: any[]; pagination: any }>>('/notifications', {
      params: { page, limit },
    });
    
    const data = response.data.data;
    
    
    return {
      notifications: data.notifications || [],
      meta: data.pagination || {},
    };
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(id: string): Promise<void> {
    await api.put('/notifications/mark-as-read', { notificationIds: [id] });
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<void> {
    await api.put('/notifications/mark-all-as-read');
  }
}

export const userService = new UserService();

