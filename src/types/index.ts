export interface ProductVariant {
  id: string;
  weight: string;
  price: number;
  mrp: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  tags: string[];
  description: string;
  shortDescription: string;
  nutrition: Record<string, string>;
  shelfLife: string;
  storage: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isFresh?: boolean;
  isDeal?: boolean;
  dealEndsAt?: string;
  fssaiNumber?: string;
  ingredients?: string;
  faqs?: { question: string; answer: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  itemCount: number;
  tagline: string;
  description: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  brand: string;
  image: string;
  weight: string;
  price: number;
  mrp: number;
  quantity: number;
  maxStock: number;
  isVeg: boolean;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export interface DeliverySlot {
  id: string;
  title: string;
  timeWindow: string;
  date: string;
  tag?: string;
  isAvailable: boolean;
}

export type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING' | 'COD';

export interface OrderPricing {
  mrpTotal: number;
  discount: number;
  couponDiscount: number;
  deliveryFee: number;
  total: number;
  savings: number;
  couponCode?: string;
}

export interface OrderTimelineItem {
  status: 'PLACED' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  title: string;
  time: string;
  done: boolean;
  description?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  address: Address;
  deliverySlot: DeliverySlot;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PAID' | 'PENDING' | 'COD';
  status: 'PLACED' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  timeline: OrderTimelineItem[];
  pricing: OrderPricing;
  trackingNumber: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: Address[];
  isLoggedIn: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userLocation: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  validUntil: string;
}

export interface PincodeCheckResult {
  pincode: string;
  isServiceable: boolean;
  estimatedDelivery: string;
  coldChainAvailable: boolean;
  city: string;
  message: string;
}

export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'
  | 'discount';

export interface FilterState {
  category?: string;
  priceRange: [number, number];
  brands: string[];
  weights: string[];
  minRating: number;
  minDiscount: number;
  dietary: string[];
  inStockOnly: boolean;
  sortBy: SortOption;
  searchQuery?: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  buttonText: string;
  link: string;
  bgColor: string;
  bgGradient: string;
  image: string;
  highlightText: string;
}
