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
// Address Types
// =============================================
export interface Address {
  id: string;
  user_id: string;
  label?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressData {
  full_name?: string;
  fullName?: string;
  label?: string;
  address_line1?: string;
  addressLine1?: string;
  address_line2?: string;
  addressLine2?: string;
  city: string;
  state: string;
  postal_code?: string;
  postalCode?: string;
  country: string;
  phone: string;
  is_default?: boolean;
  isDefault?: boolean;
}

const toApiAddressData = (data: CreateAddressData) => ({
  fullName: data.full_name ?? data.fullName,
  label: data.label,
  addressLine1: data.address_line1 ?? data.addressLine1,
  addressLine2: data.address_line2 ?? data.addressLine2,
  city: data.city,
  state: data.state,
  postalCode: data.postal_code ?? data.postalCode,
  country: data.country,
  phone: data.phone,
  isDefault: data.is_default ?? data.isDefault,
});

// =============================================
// Address Service
// =============================================
class AddressService {
  /**
   * Create a new address for a user
   */
  async createAddress(userId: string, data: CreateAddressData): Promise<Address> {
    console.log('📍 [AddressService] Creating address for user:', userId);
    const response = await api.post<ApiResponse<Address>>(`/users/${userId}/addresses`, toApiAddressData(data));
    console.log('✅ [AddressService] Address created:', response.data.data.id);
    return response.data.data;
  }

  /**
   * Get user's addresses
   */
  async getAddresses(userId: string): Promise<Address[]> {
    console.log('📍 [AddressService] Fetching addresses for user:', userId);
    const response = await api.get<ApiResponse<Address[]>>(`/users/${userId}/addresses`);
    const addresses = Array.isArray(response.data.data) ? response.data.data : [];
    console.log('✅ [AddressService] Addresses fetched:', addresses.length);
    return addresses;
  }
}

export const addressService = new AddressService();
