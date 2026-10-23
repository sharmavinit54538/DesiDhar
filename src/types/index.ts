export const DESIDHAR_VERSION = '1.0.0';

export interface ProductVariant {
  id: string;
  weight: string;
  price: number;
  mrp: number;
  stock: number;
  sku: string;
  isDefault?: boolean;
}

export interface ProductImage {
  id: string;
  src: string;
  srcset?: string;
  sizes?: string;
  alt: string;
  type: string;
  isMain: boolean;
  order: number;
  width: number;
  height: number;
  isVerifiedSpecific: boolean;
  assetStatus: 'verified_authentic' | 'pending_studio_shot';
}

export interface ProductHighlight {
  text: string;
  icon?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  hindiName?: string;
  brand: string;
  category: string;
  subcategory?: string;
  sweetType?: string;
  originRegion?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number | null;
  reviewCount: number;
  tags: string[];
  highlights?: ProductHighlight[];
  shortDescription: string;
  description: string;
  ingredients?: string;
  nutrition?: Record<string, string> | null;
  shelfLife?: string;
  storage?: string;
  faqs?: FAQ[];
  isVeg: boolean;
  isFeatured: boolean;
  isFresh: boolean;
  isDeal: boolean;
  dealEndsAt?: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt?: string;
  updatedAt?: string;
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
  isoDate?: string;
  tag?: string;
  isAvailable: boolean;
  isDefault?: boolean;
}

export type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING' | 'COD';

export interface PaymentMethodOption {
  id: PaymentMethod;
  enabled: boolean;
  label: string;
  provider?: string | null;
}

export interface OrderPricing {
  mrpTotal: number;
  discount: number;
  couponDiscount: number;
  deliveryFee: number;
  total: number;
  savings: number;
  couponCode?: string;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PLACED'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type OrderPaymentStatus = 'PAID' | 'PENDING' | 'COD' | 'REFUND_PENDING';

export interface OrderTimelineItem {
  status: OrderStatus | string;
  title: string;
  time: string;
  done: boolean;
  description?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt?: string;
  items: CartItem[];
  address: Address;
  deliverySlot: DeliverySlot;
  paymentMethod: PaymentMethod;
  paymentStatus: OrderPaymentStatus;
  paymentReference?: string;
  paymentProvider?: string;
  status: OrderStatus;
  timeline: OrderTimelineItem[];
  pricing: OrderPricing;
  trackingNumber: string | null;
  courierName?: string | null;
  payment?: {
    method: PaymentMethod;
    status: string;
    onlinePaymentRequired: boolean;
    provider: string | null;
    keyId: string | null;
  };
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'customer' | 'admin';
  isLoggedIn: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  validUntil?: string;
}

export interface PincodeCheckResult {
  pincode: string;
  isServiceable: boolean;
  estimatedDelivery: string;
  coldChainAvailable: boolean;
  city: string;
  message: string;
}

export interface PublicSettings {
  currency: string;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  codEnabled: boolean;
  onlinePaymentsEnabled: boolean;
  paymentProvider: string | null;
  fssaiLicenseNumber: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  supportWhatsapp: string | null;
  supportHours: string | null;
  companyName: string | null;
  companyAddress: string | null;
  companyGstin: string | null;
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

export interface ProductFacets {
  brands: string[];
  weights: string[];
  dietaryTags: string[];
  priceMin: number;
  priceMax: number;
  categories: { slug: string; name: string; count: number }[];
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
  status?: 'published' | 'pending' | 'hidden';
  productName?: string;
  productSlug?: string;
}

export interface ReviewSummary {
  average: number | null;
  count: number;
  breakdown: Record<string, number>;
}

export interface CartValidationIssue {
  variantId?: string;
  code:
    | 'UNAVAILABLE'
    | 'OUT_OF_STOCK'
    | 'INSUFFICIENT_STOCK'
    | 'COUPON_INVALID'
    | 'INVALID_QUANTITY'
    | string;
  message: string;
  availableStock?: number;
}

export interface CartValidationResult {
  items: CartItem[];
  pricing: OrderPricing;
  issues: CartValidationIssue[];
  coupon: Coupon | null;
  freeDeliveryThreshold: number;
}

export interface ServerProductList {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  facets: ProductFacets;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: { field: string; message: string }[];
}
