export interface ApiContractor {
  id: string;
  name: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  bio?: string;
  servicesCount?: number;
  startingPrice?: number;
  isVerified?: boolean;
  avatar?: string;
}

export interface ApiService {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  contractorId: string;
  contractorName?: string;
  rating?: number;
  deliveryDays?: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ApiProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  images?: string[];
  stock?: number;
  sellerId?: string;
  rating?: number;
  reviewCount?: number;
}

export interface ApiCartItem {
  id: string;
  productId: string;
  productTitle: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ApiOrder {
  id: string;
  buyerId?: string;
  items?: ApiOrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface ApiOrderItem {
  id: string;
  productId: string;
  productTitle: string;
  quantity: number;
  price: number;
}

export interface ApiDispute {
  id: string;
  filedBy?: string;
  filedAgainst?: string;
  reason: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  projectId?: string;
  orderId?: string;
  resolution?: string;
  createdAt: string;
}