import api from "./api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    compare_at_price?: number;
    quantity: number;
    business_name?: string;
    slug: string;
    images?: Array<{ image_url?: string; display_order?: number }>;
    image_url?: string | null;
  };
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartData {
  quantity: number;
}

class CartService {
  async getCartItems(): Promise<CartItem[]> {
    const response = await api.get<ApiResponse<any>>("/cart");
    const rawItems = Array.isArray(response.data.data?.items)
      ? response.data.data.items
      : Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];

    return rawItems.map((item: any) => ({
      ...item,
      product: item.product || item.products,
    }));
  }

  async addToCart(data: AddToCartData): Promise<CartItem> {
    const response = await api.post<ApiResponse<CartItem>>("/cart", data);
    const item = response.data.data || response.data;
    if (item && typeof item === "object" && "id" in item) {
      return item as CartItem;
    }
    throw new Error("Invalid response structure from add to cart API");
  }

  async updateCartItem(
    cartItemId: string,
    data: UpdateCartData,
  ): Promise<CartItem> {
    const response = await api.put<ApiResponse<CartItem>>(
      `/cart/${cartItemId}`,
      data,
    );
    const item = response.data.data || response.data;
    if (item && typeof item === "object" && "id" in item) {
      return item as CartItem;
    }
    throw new Error("Invalid response structure from update cart API");
  }

  async removeFromCart(cartItemId: string): Promise<void> {
    await api.delete(`/cart/${cartItemId}`);
  }

  async clearCart(): Promise<void> {
    await api.delete("/cart/clear/all");
  }

  async getCartSummary(): Promise<{
    total_items: number;
    subtotal: number;
    total: number;
  }> {
    const response = await api.get<ApiResponse<any>>("/cart");
    const summary = response.data.data?.summary || {};
    return {
      total_items: Number(summary.total_items || 0),
      subtotal: Number(summary.subtotal || 0),
      total: Number(summary.subtotal || 0),
    };
  }
}

export const cartService = new CartService();
