export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "cod" | "easypaisa" | "jazzcash" | "bank_transfer";
  name: string;
  last4?: string;
  expiry?: string;
  isDefault: boolean;
  icon: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrder?: number;
  maxDiscount?: number;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const sampleAddresses: ShippingAddress[] = [
  {
    id: "addr1",
    fullName: "Ayaan Ahmad",
    phone: "+92-300-1234567",
    address: "House 123, Street 4, Sector C",
    city: "Lahore",
    province: "Punjab",
    postalCode: "54000",
    isDefault: true,
  },
  {
    id: "addr2",
    fullName: "Ayaan Ahmad",
    phone: "+92-300-1234567",
    address: "Flat 5B, Gulberg Heights",
    city: "Lahore",
    province: "Punjab",
    postalCode: "54000",
    isDefault: false,
  },
];

export const paymentMethods: PaymentMethod[] = [
  { id: "pm1", type: "cod", name: "Cash on Delivery", isDefault: true, icon: "cash" },
  { id: "pm2", type: "card", name: "Visa ending in 4242", last4: "4242", expiry: "12/26", isDefault: false, icon: "visa" },
  { id: "pm3", type: "easypaisa", name: "Easypaisa", isDefault: false, icon: "easypaisa" },
  { id: "pm4", type: "jazzcash", name: "JazzCash", isDefault: false, icon: "jazzcash" },
  { id: "pm5", type: "bank_transfer", name: "Bank Transfer", isDefault: false, icon: "bank" },
];

export const promoCodes: PromoCode[] = [
  { code: "BUILDHIVE10", discount: 10, type: "percentage", minOrder: 5000, maxDiscount: 5000 },
  { code: "WELCOME500", discount: 500, type: "fixed", minOrder: 10000 },
  { code: "FREESHIP", discount: 0, type: "percentage" },
];

export const recommendedProducts: RecommendedProduct[] = [
  {
    id: "r1",
    name: "Premium Safety Helmet",
    price: 2400,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
  },
  {
    id: "r2",
    name: "Heavy Duty Work Gloves",
    price: 950,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop",
  },
  {
    id: "r3",
    name: "Measuring Tape 30m",
    price: 1350,
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop",
  },
];
