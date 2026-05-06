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
// Order Types
// =============================================
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
  product?: {
    name: string;
    slug: string;
    business_name?: string;
  };
}

export interface OrderTracking {
  order_id: string;
  tracking_number: string;
  carrier: string;
  status: string;
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
  tracking_url?: string;
  tracking_history?: Array<{
    status: string;
    location?: string;
    timestamp: string;
    description?: string;
  }>;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  business_id: string;
  status: 'pending_payment' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  subtotal: number;
  tax_amount: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  currency?: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  shipping_phone: string;
  shipping_address?: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  billing_address?: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  notes?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CreateOrderData {
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  shippingAddressId?: string;
  shipping_address?: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  billing_address?: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  paymentMethod: string; // camelCase for backend
  notes?: string;
}

export interface GetOrdersParams {
  status?: string;
  payment_status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// =============================================
// Order Service
// =============================================
class OrderService {
  /**
   * Get user's orders
   */
  async getOrders(params?: GetOrdersParams): Promise<{ orders: Order[]; meta: any }> {
    console.log('📦 [OrderService] Fetching orders with params:', params);
    
    const response = await api.get<ApiResponse<{ orders: Order[]; pagination: any }>>('/orders', {
      params,
    });
    
    const ordersData = response.data.data;
    
    console.log('✅ [OrderService] Orders fetched:', {
      count: ordersData.orders?.length,
      total: ordersData.pagination?.total,
    });
    
    return {
      orders: ordersData.orders || [],
      meta: ordersData.pagination || {},
    };
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    console.log('🔍 [OrderService] Fetching order by ID:', id);
    
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    
    console.log('✅ [OrderService] Order fetched:', response.data.data.order_number);
    
    return response.data.data;
  }

  /**
   * Create a new order (checkout)
   */
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    console.log('📦 [OrderService] Creating order...');
    console.log('📝 [OrderService] Order data:', JSON.stringify(orderData, null, 2));

    const response = await api.post<ApiResponse<any>>('/orders', orderData);

    // Map potential response shapes where order is returned inside an orders array
    const order = response.data?.orders?.[0] || response.data?.data?.orders?.[0] || response.data?.data || response.data?.orders?.[0] || response.data;
    console.log('mapped order:', order);

    // Ensure we return the order object (cast to Order for typing)
    return order as Order;
  }

  /**
   * Cancel an order
   */
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    console.log('❌ [OrderService] Cancelling order:', id);
    
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason });
    
    console.log('✅ [OrderService] Order cancelled');
    
    return response.data.data;
  }

  /**
   * Get order tracking info
   */
  async getOrderTracking(id: string): Promise<OrderTracking> {
    console.log('🚚 [OrderService] Fetching tracking for order:', id);
    
    const response = await api.get<ApiResponse<OrderTracking>>(`/orders/${id}/tracking`);
    
    console.log('✅ [OrderService] Tracking info fetched');
    
    return response.data.data;
  }

  /**
   * Get order invoice
   */
  async getOrderInvoice(id: string): Promise<Blob> {
    console.log('🧾 [OrderService] Downloading invoice for order:', id);
    
    const response = await api.get(`/orders/${id}/invoice`, {
      responseType: 'blob',
    });
    
    console.log('✅ [OrderService] Invoice downloaded');
    
    return response.data;
  }

  /**
   * Rate an order/product
   */
  async rateOrder(orderId: string, rating: number, review?: string): Promise<void> {
    console.log('⭐ [OrderService] Rating order:', orderId, rating);
    
    await api.post(`/orders/${orderId}/rate`, { rating, review });
    
    console.log('✅ [OrderService] Order rated');
  }
}

export const orderService = new OrderService();
