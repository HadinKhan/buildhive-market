// =============================================
// USER TYPES
// =============================================
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'buyer' | 'contractor' | 'supplier' | 'admin';
  password_hash?: string;
  profile_image?: string;
  email_verified: boolean;
  status: 'active' | 'inactive' | 'suspended';
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserAddress {
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

export interface Business {
  id: string;
  user_id: string;
  business_name: string;
  business_type?: string;
  description?: string;
  logo?: string;
  registration_number?: string;
  tax_number?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rejection_reason?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// PRODUCT TYPES
// =============================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Frontend display props (not in DB)
  icon?: React.ReactNode;
  count?: number;
  color?: string;
}

export interface Product {
  id: string;
  business_id: string;
  seller_id?: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
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
  status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  is_featured: boolean;
  rejection_reason?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  images?: ProductImage[];
  variants?: ProductVariant[];
  // Frontend display props
  author?: string; // business_name for display
  rating?: number;
  sales?: number; // total_orders count
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  sku?: string;
  price: number;
  stock_quantity: number;
  attributes?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =============================================
// CART TYPES
// =============================================
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Relations
  product?: Product;
}

// =============================================
// ORDER TYPES
// =============================================
export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  business_id: string;
  // Shipping Address
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  shipping_phone: string;
  // Order Totals
  subtotal: number;
  tax_amount: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  // Order Status
  status: 'pending_payment' | 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  // Notes
  customer_notes?: string;
  admin_notes?: string;
  // Tracking
  tracking_number?: string;
  carrier?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  // Relations
  items?: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  variant_name?: string;
  sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method: 'cod' | 'jazzcash' | 'easypaisa' | 'stripe' | 'bank_transfer' | 'wallet';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  gateway_response?: Record<string, any>;
  failure_reason?: string;
  paid_at?: string;
  refunded_at?: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// CONTACT & SUPPORT TYPES
// =============================================
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  replied_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  ticket_number: string;
  subject: string;
  category: 'order' | 'payment' | 'product' | 'account' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}

// =============================================
// SERVICE PROVIDER TYPES (Contractors)
// =============================================
export interface Service {
  id: string;
  contractor_id: string;
  category_id?: string;
  title: string;
  description: string;
  short_description?: string;
  price: number;
  price_type: 'fixed' | 'hourly' | 'daily';
  delivery_time?: string;
  status: 'draft' | 'active' | 'paused' | 'inactive';
  image?: string;
  rating: number;
  total_reviews: number;
  total_orders: number;
  skills?: string[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  contractor_id: string;
  client_id: string;
  service_id?: string;
  title: string;
  description: string;
  budget: number;
  start_date?: string;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'pending_approval' | 'disputed' | 'cancelled';
  progress: number;
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  contractor_id: string;
  client_id: string;
  job_title: string;
  job_description?: string;
  amount: number;
  delivery_time?: string;
  cover_letter: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  sent_date: string;
  response_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  contractor_id: string;
  title: string;
  description?: string;
  category?: string;
  image: string;
  completion_date?: string;
  client_name?: string;
  project_url?: string;
  skills_used?: string[];
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// =============================================
// LEGACY COMPATIBILITY TYPES (for existing components)
// =============================================
// Keep these for backward compatibility with existing UI components
export interface Address extends UserAddress {
  // Alias for backward compatibility
  name?: string;
  street?: string;
  zip?: string;
  isDefault?: boolean;
}
