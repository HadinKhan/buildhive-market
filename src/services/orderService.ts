import api from "./api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

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
  status:
    | "pending_payment"
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
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
  paymentMethod: string;
  notes?: string;
}

export interface GetOrdersParams {
  status?: string;
  payment_status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

class OrderService {
  async getOrders(params?: GetOrdersParams): Promise<{ orders: Order[]; meta: any }> {
    const response = await api.get<ApiResponse<{ orders: Order[]; pagination: any }>>(
      "/orders",
      { params },
    );
    const data = response.data.data || { orders: [], pagination: {} };
    return {
      orders: data.orders || [],
      meta: data.pagination || {},
    };
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<any>>(`/orders/${id}`);
    return (response.data.data?.order || response.data.data) as Order;
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await api.post<ApiResponse<any>>("/orders", orderData);
    return (
      response.data?.data?.orders?.[0] ||
      response.data?.orders?.[0] ||
      response.data?.data ||
      response.data
    ) as Order;
  }

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/cancel`, {
      reason,
    });
    return response.data.data;
  }

  async getOrderTracking(id: string): Promise<OrderTracking> {
    const response = await api.get<ApiResponse<OrderTracking>>(
      `/orders/${id}/tracking`,
    );
    return response.data.data;
  }

  async getOrderReceipt(id: string): Promise<Blob> {
    const response = await api.get(`/orders/${id}/receipt`, {
      responseType: "blob",
    });
    return response.data;
  }

  async getOrderInvoice(id: string): Promise<Blob> {
    return this.getOrderReceipt(id);
  }
}

export const orderService = new OrderService();
