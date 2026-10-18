export const DESIDHAR_VERSION = '1.0.0';

export interface ProductVariant {
  id: string;
  weight: string;
  price: number;
  mrp: number;
  stock: number;
  sku: string;
  piecesPerPack?: number;
  weightInGrams?: number;
  isDefault?: boolean;
}

export interface ProductImage {
  id: string;
  src: string;
  srcset?: string;
  sizes?: string;
  alt: string;
  type: 'main' | 'closeup' | 'packaging' | 'serving' | 'size-reference' | 'placeholder';
  isMain: boolean;
  order: number;
  width: number;
  height: number;
  attribution?: ImageAttribution;
}

export interface ImageAttribution {
  source: 'unsplash' | 'pexels' | 'pixabay' | 'local';
  photographer: string;
  photographerUrl?: string;
  license: string;
  originalUrl: string;
  downloadedAt: string;
}

export interface NutritionalInfo {
  energyKcal: number;
  protein: number;
  carbohydrates: number;
  sugars: number;
  fat: number;
  saturatedFat: number;
  transFat: number;
  sodium: number;
  fiber?: number;
  cholesterol?: number;
  servingSize: string;
  servingSizeGrams: number;
  isSampleData: boolean;
}

export interface Ingredient {
  name: string;
  percentage?: number;
  isAllergen: boolean;
  allergenType?: 'milk' | 'nuts' | 'gluten' | 'egg' | 'soy' | 'sulphites' | 'mustard' | 'sesame' | 'celery' | 'lupin' | 'molluscs' | 'crustaceans' | 'fish';
}

export interface AllergenInfo {
  contains: string[];
  mayContain: string[];
  freeFrom: string[];
}

export interface DietaryTags {
  isVeg: boolean;
  isEggless: boolean;
  isSugarFree: boolean;
  isLowSugar: boolean;
  isJainFriendly: boolean;
  isFastingFriendly: boolean;
  isOrganic: boolean;
  isA2: boolean;
  isHandmade: boolean;
  isNoAddedSugar: boolean;
  badges: string[];
}

export interface RegulatoryInfo {
  fssaiLicenseNumber: string;
  fssaiLicenseNumberIsSample: boolean;
  manufacturerName: string;
  manufacturerAddress: string;
  packedBy?: string;
  marketedBy?: string;
  countryOfOrigin: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  netWeight: string;
  grossWeight: string;
  packagingType: 'box' | 'tin' | 'pouch' | 'jar' | 'bottle' | 'handi' | 'can' | 'carton';
  vegSymbol: boolean;
  mrpInclusiveOfTaxes: boolean;
  hsnCode: string;
  gstRate: number;
  gstRateIsSample: boolean;
}

export interface StorageInfo {
  shelfLifeDays: number;
  shelfLifeText: string;
  bestBeforeDaysFromManufacture: number;
  storageInstructions: string;
  servingSuggestion: string;
  temperatureMin?: number;
  temperatureMax?: number;
  requiresRefrigeration: boolean;
  coldChainRequired: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
  category?: string;
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
  reviewImages?: string[];
}

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  ogImage: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface DeliveryInfo {
  isPerishable: boolean;
  coldChainRequired: boolean;
  estimatedDeliveryDays: string;
  returnPolicy: string;
  nonReturnableOnceOpened: boolean;
}

export interface ProductHighlight {
  text: string;
  icon?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  hindiName: string;
  brand: string;
  category: string;
  subcategory: string;
  sweetType?: 'barfi' | 'ladoo' | 'bengali-sweet' | 'halwa' | 'peda' | 'roll' | 'chhena-sweet' | 'mawa-sweet' | 'flaky' | 'dry-fruit' | 'festival-combo' | 'gift-box';
  originRegion?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  tags: string[];
  highlights: ProductHighlight[];
  shortDescription: string;
  description: string;
  ingredients: Ingredient[];
  allergens: AllergenInfo;
  nutrition: NutritionalInfo;
  dietaryTags: DietaryTags;
  regulatory: RegulatoryInfo;
  storage: StorageInfo;
  faqs: FAQ[];
  delivery: DeliveryInfo;
  reviews: Review[];
  seo: SEOData;
  isVeg: boolean;
  isBestseller?: boolean;
  isFresh?: boolean;
  isDeal?: boolean;
  dealEndsAt?: string;
  fssaiNumber?: string;
  isSampleData: boolean;
  createdAt: string;
  updatedAt: string;
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