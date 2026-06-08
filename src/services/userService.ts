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
    console.log('👤 [UserService] Fetching user profile');
    
    const response = await api.get<ApiResponse<UserProfile>>('/users/profile');
    
    console.log('✅ [UserService] Profile fetched:', response.data.data.full_name);
    
    return response.data.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfile> {
    console.log('✏️ [UserService] Updating profile:', userId, data);

    const apiData = {
      fullName: data.full_name,
      phone: data.phone,
    };
    
    const response = await api.put<ApiResponse<UserProfile>>(`/users/${userId}`, apiData);
    
    console.log('✅ [UserService] Profile updated');
    
    return response.data.data;
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(userId: string, file: File): Promise<string> {
    console.log('📸 [UserService] Uploading profile image for user:', userId);
    console.log('📸 [UserService] File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    const formData = new FormData();
    formData.append('image', file);
    
    console.log('📸 [UserService] FormData created, sending request...');
    
    const response = await api.put<ApiResponse<{ imageUrl: string }>>(`/users/${userId}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ [UserService] Full response:', response.data);
    console.log('✅ [UserService] Image uploaded, URL:', response.data.data?.imageUrl);
    
    return response.data.data.imageUrl;
  }

  /**
   * Delete profile image
   */
  async deleteProfileImage(userId: string): Promise<void> {
    console.log('🗑️ [UserService] Deleting profile image for user:', userId);
    
    await api.delete(`/users/${userId}/profile-image`);
    
    console.log('✅ [UserService] Profile image deleted');
  }

  /**
   * Get user addresses
   */
  async getAddresses(userId: string): Promise<Address[]> {
    console.log('📍 [UserService] Fetching user addresses:', userId);
    
    const response = await api.get<ApiResponse<Address[]>>(`/users/${userId}/addresses`);
    
    console.log('✅ [UserService] Addresses fetched:', response.data.data.length);
    
    return response.data.data;
  }

  /**
   * Get address by ID
   */
  async getAddressById(id: string): Promise<Address> {
    console.log('🔍 [UserService] Fetching address by ID:', id);
    
    const response = await api.get<ApiResponse<Address>>(`/users/addresses/${id}`);
    
    console.log('✅ [UserService] Address fetched');
    
    return response.data.data;
  }

  /**
   * Create new address
   */
  async createAddress(userId: string, data: CreateAddressData): Promise<Address> {
    console.log('📝 [UserService] Creating address for user:', userId, data);
    
    const apiData = toApiAddressData(data);
    console.log('📝 [UserService] Transformed to API format:', apiData);
    
    const response = await api.post<ApiResponse<Address>>(`/users/${userId}/addresses`, apiData);
    
    console.log('✅ [UserService] Address created');
    
    return response.data.data;
  }

  /**
   * Update address
   */
  async updateAddress(userId: string, addressId: string, data: Partial<CreateAddressData>): Promise<Address> {
    console.log('✏️ [UserService] Updating address:', userId, addressId, data);
    
    const apiData = toApiAddressData(data);
    console.log('✏️ [UserService] Transformed to API format:', apiData);
    
    const response = await api.put<ApiResponse<Address>>(`/users/${userId}/addresses/${addressId}`, apiData);
    
    console.log('✅ [UserService] Address updated');
    
    return response.data.data;
  }

  /**
   * Delete address
   */
  async deleteAddress(userId: string, addressId: string): Promise<void> {
    console.log('🗑️ [UserService] Deleting address:', userId, addressId);
    
    await api.delete(`/users/${userId}/addresses/${addressId}`);
    
    console.log('✅ [UserService] Address deleted');
  }

  /**
   * Set default address
   */
  async setDefaultAddress(userId: string, addressId: string): Promise<Address> {
    console.log('⭐ [UserService] Setting default address:', userId, addressId);
    
    const response = await api.put<ApiResponse<Address>>(`/users/${userId}/addresses/${addressId}/default`);
    
    console.log('✅ [UserService] Default address set');
    
    return response.data.data;
  }

  /**
   * Get user wishlist
   */
  async getWishlist(): Promise<any[]> {
    console.log('💝 [UserService] Fetching wishlist');
    
    const response = await api.get<ApiResponse<any[]>>('/users/wishlist');
    
    console.log('✅ [UserService] Wishlist fetched:', response.data.data.length);
    
    return response.data.data;
  }

  /**
   * Add to wishlist
   */
  async addToWishlist(productId: string): Promise<void> {
    console.log('➕ [UserService] Adding to wishlist:', productId);
    
    await api.post('/users/wishlist', { product_id: productId });
    
    console.log('✅ [UserService] Added to wishlist');
  }

  /**
   * Remove from wishlist
   */
  async removeFromWishlist(productId: string): Promise<void> {
    console.log('➖ [UserService] Removing from wishlist:', productId);
    
    await api.delete(`/users/wishlist/${productId}`);
    
    console.log('✅ [UserService] Removed from wishlist');
  }

  /**
   * Get user notifications
   */
  async getNotifications(page = 1, limit = 20): Promise<{ notifications: any[]; meta: any }> {
    console.log('🔔 [UserService] Fetching notifications');
    
    const response = await api.get<ApiResponse<{ notifications: any[]; pagination: any }>>('/users/notifications', {
      params: { page, limit },
    });
    
    const data = response.data.data;
    
    console.log('✅ [UserService] Notifications fetched:', data.notifications?.length);
    
    return {
      notifications: data.notifications || [],
      meta: data.pagination || {},
    };
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(id: string): Promise<void> {
    console.log('✅ [UserService] Marking notification as read:', id);
    
    await api.put(`/users/notifications/${id}/read`);
    
    console.log('✅ [UserService] Notification marked as read');
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<void> {
    console.log('✅ [UserService] Marking all notifications as read');
    
    await api.put('/users/notifications/read-all');
    
    console.log('✅ [UserService] All notifications marked as read');
  }
}

export const userService = new UserService();
