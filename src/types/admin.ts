export interface AdminVariant {
  id: string;
  weight: string;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  isDefault: boolean;
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  isFresh: boolean;
  isDeal: boolean;
  dealEndsAt: string | null;
  variants: AdminVariant[];
}

export interface AdminVariantUpdate {
  id: string;
  productId: string;
  stock: number;
  price: number;
  mrp: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  customerName: string | null;
  customerPhone: string;
  lineCount: number;
  trackingNumber: string | null;
  courierName: string | null;
  slotDate: string;
  slotWindow: string;
}

export interface AdminStats {
  orders: { total: number; open: number; todayCount: number; todayValue: number };
  revenue: { paid: number; codCollected: number };
  catalog: {
    products: number;
    inactiveProducts: number;
    variantsOutOfStock: number;
    variantsLowStock: number;
    unitsInStock: number;
  };
  customers: number;
  pendingReviews: number;
  openMessages: number;
  recentOrders: import('../types').Order[];
}

export interface AdminCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  validUntil?: string;
  isActive: boolean;
  isPublic: boolean;
}

export interface AdminReview {
  id: string;
  productId: string;
  productName?: string;
  productSlug?: string;
  userName: string;
  userLocation: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  status: 'published' | 'pending' | 'hidden';
  date: string;
  userPhone?: string | null;
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}
