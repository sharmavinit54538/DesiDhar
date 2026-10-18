import {
  Product,
  Category,
  Review,
  Coupon,
  PincodeCheckResult,
  Order,
  User,
  FilterState,
  HeroBanner
} from '../types';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { HERO_BANNERS } from '../data/banners';
import { MOCK_COUPONS } from '../data/coupons';
import { SERVICEABLE_PINCODES } from '../data/pincodes';
import { MOCK_REVIEWS } from '../data/reviews';

// Artificial delay helper to simulate real HTTP latency
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

// LocalStorage helpers for mock user orders and reviews
const ORDERS_STORAGE_KEY = 'desidhar_orders';
const REVIEWS_STORAGE_KEY = 'desidhar_custom_reviews';

function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
}

function getStoredReviews(): Review[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredReviews(reviews: Review[]): void {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews', e);
  }
}

/**
 * Mock API Service
 * Can be swapped directly with Axios or Fetch calls against a real REST or GraphQL backend
 */
export const api = {
  // Products
  async getProducts(filters?: Partial<FilterState>): Promise<{ products: Product[]; total: number }> {
    await delay(180);
    let result = [...PRODUCTS];

    if (filters?.category && filters.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === filters.category?.toLowerCase());
    }

    if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (filters?.brands && filters.brands.length > 0) {
      result = result.filter(p => filters.brands?.includes(p.brand));
    }

    if (filters?.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter(p => {
        const lowestPrice = Math.min(...p.variants.map(v => v.price));
        return lowestPrice >= min && lowestPrice <= max;
      });
    }

    if (filters?.minRating && filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating!);
    }

    if (filters?.minDiscount && filters.minDiscount > 0) {
      result = result.filter(p => {
        const maxDiscount = Math.max(
          ...p.variants.map(v => Math.round(((v.mrp - v.price) / v.mrp) * 100))
        );
        return maxDiscount >= filters.minDiscount!;
      });
    }

    if (filters?.dietary && filters.dietary.length > 0) {
      result = result.filter(p =>
        filters.dietary?.some(tag =>
          p.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
        )
      );
    }

    if (filters?.inStockOnly) {
      result = result.filter(p => p.variants.some(v => v.stock > 0));
    }

    // Sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.variants[0].price - b.variants[0].price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.variants[0].price - a.variants[0].price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'discount':
          result.sort((a, b) => {
            const discA = ((a.variants[0].mrp - a.variants[0].price) / a.variants[0].mrp);
            const discB = ((b.variants[0].mrp - b.variants[0].price) / b.variants[0].mrp);
            return discB - discA;
          });
          break;
        case 'newest':
          result.reverse();
          break;
        case 'relevance':
        default:
          // Keep bestsellers first
          result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
          break;
      }
    }

    return { products: result, total: result.length };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    await delay(120);
    const product = PRODUCTS.find(p => p.slug === slug);
    return product || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(100);
    const product = PRODUCTS.find(p => p.id === id);
    return product || null;
  },

  async getRelatedProducts(productId: string, category: string, limit = 4): Promise<Product[]> {
    await delay(150);
    return PRODUCTS
      .filter(p => p.category === category && p.id !== productId)
      .slice(0, limit);
  },

  async getFrequentlyBoughtTogether(product: Product): Promise<Product[]> {
    await delay(100);
    // Suggest items from complementary dairy categories (e.g. if ghee, suggest paneer and dahi)
    const complementCategories = ['curd-dahi', 'paneer', 'butter', 'milk', 'mithai'];
    return PRODUCTS
      .filter(p => p.id !== product.id && complementCategories.includes(p.category))
      .slice(0, 2);
  },

  // Home curated sections
  async getDealOfTheDay(): Promise<Product[]> {
    await delay(100);
    return PRODUCTS.filter(p => p.isDeal || p.tags.includes('Deal of Day')).slice(0, 6);
  },

  async getBestSellers(): Promise<Product[]> {
    await delay(100);
    return PRODUCTS.filter(p => p.isBestseller).slice(0, 8);
  },

  async getFreshToday(): Promise<Product[]> {
    await delay(100);
    return PRODUCTS.filter(p => p.isFresh || p.tags.includes('Fresh Today')).slice(0, 8);
  },

  async getFestiveSweets(): Promise<Product[]> {
    await delay(100);
    return PRODUCTS.filter(p => p.category === 'mithai' || p.category === 'gift-boxes').slice(0, 8);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    await delay(80);
    return CATEGORIES;
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await delay(80);
    return CATEGORIES.find(c => c.slug === slug) || null;
  },

  // Banners
  async getBanners(): Promise<HeroBanner[]> {
    await delay(50);
    return HERO_BANNERS;
  },

  // Pincode
  async checkPincode(pincode: string): Promise<PincodeCheckResult> {
    await delay(250);
    const cleaned = pincode.trim();
    if (SERVICEABLE_PINCODES[cleaned]) {
      return SERVICEABLE_PINCODES[cleaned];
    }
    // Generic fallback for any other valid 6 digit Indian pin
    if (/^[1-9][0-9]{5}$/.test(cleaned)) {
      return {
        pincode: cleaned,
        isServiceable: true,
        estimatedDelivery: '2 Business Days via Standard Cold Cargo',
        coldChainAvailable: false,
        city: 'Serviceable Area',
        message: 'Standard delivery available for shelf-stable items (Ghee, Sweets).'
      };
    }
    return {
      pincode: cleaned,
      isServiceable: false,
      estimatedDelivery: 'Unavailable',
      coldChainAvailable: false,
      city: 'Unknown',
      message: 'Sorry! DesiDhar cold-chain is currently not serviceable at this pincode.'
    };
  },

  // Coupons
  async validateCoupon(code: string, cartTotal: number): Promise<{ isValid: boolean; coupon?: Coupon; error?: string }> {
    await delay(200);
    const upper = code.trim().toUpperCase();
    const coupon = MOCK_COUPONS.find(c => c.code === upper);

    if (!coupon) {
      return { isValid: false, error: 'Invalid coupon code. Try DESI10, FIRSTORDER, or FESTIVE20' };
    }

    if (cartTotal < coupon.minOrderValue) {
      return {
        isValid: false,
        error: `Cart total must be at least ₹${coupon.minOrderValue} to apply code ${coupon.code}`
      };
    }

    return { isValid: true, coupon };
  },

  // Reviews
  async getReviews(productId: string): Promise<Review[]> {
    await delay(100);
    const custom = getStoredReviews().filter(r => r.productId === productId);
    const base = MOCK_REVIEWS.filter(r => r.productId === productId);
    // Combine custom and base, or if base is empty for this product, provide realistic default reviews
    if (custom.length === 0 && base.length === 0) {
      return [
        {
          id: `rev-gen-1-${productId}`,
          productId,
          userName: 'Rameshwar Vyas',
          userLocation: 'Delhi NCR',
          rating: 5,
          date: '2026-10-14',
          comment: 'Outstanding quality and freshness. Pure dairy flavor you cannot find in usual stores!',
          verifiedPurchase: true,
          helpfulCount: 14
        },
        {
          id: `rev-gen-2-${productId}`,
          productId,
          userName: 'Shilpa Rao',
          userLocation: 'Mumbai',
          rating: 5,
          date: '2026-10-09',
          comment: 'Very fast delivery and well-chilled packaging. DesiDhar is our new go-to brand.',
          verifiedPurchase: true,
          helpfulCount: 9
        }
      ];
    }
    return [...custom, ...base];
  },

  async addReview(reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> {
    await delay(250);
    const newReview: Review = {
      ...reviewData,
      id: `rev-user-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0
    };
    const stored = getStoredReviews();
    saveStoredReviews([newReview, ...stored]);
    return newReview;
  },

  // Search suggestions
  async searchSuggestions(query: string): Promise<{ products: Product[]; categories: Category[] }> {
    await delay(100);
    const q = query.toLowerCase().trim();
    if (!q) return { products: [], categories: [] };

    const matchingCategories = CATEGORIES.filter(c =>
      c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchingProducts = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 6);

    return { products: matchingProducts, categories: matchingCategories };
  },

  // Auth (Mock phone + OTP)
  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    await delay(300);
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      return { success: false, message: 'Please enter a valid 10-digit Indian mobile number.' };
    }
    return {
      success: true,
      message: 'OTP sent successfully! (Demo mode: enter any 6 digits to login)'
    };
  },

  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await delay(350);
    if (!/^\d{6}$/.test(otp.trim())) {
      return { success: false, error: 'Please enter a valid 6-digit OTP.' };
    }

    const defaultAddresses = [
      {
        id: 'addr-default-1',
        name: 'Aakash Verma',
        phone: phone.trim(),
        pincode: '110001',
        addressLine1: 'Flat 402, Royal Palms Apartments',
        addressLine2: 'Barakhamba Road, Connaught Place',
        landmark: 'Near Metro Gate 2',
        city: 'New Delhi',
        state: 'Delhi',
        type: 'Home' as const,
        isDefault: true
      }
    ];

    const mockUser: User = {
      id: `user-${phone.trim()}`,
      name: 'Aakash Verma',
      phone: phone.trim(),
      email: 'aakash.desi@example.com',
      addresses: defaultAddresses,
      isLoggedIn: true
    };

    return { success: true, user: mockUser };
  },

  // Orders
  async createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber'>): Promise<Order> {
    await delay(400);
    const orderId = `DD-${Date.now().toString().slice(-6)}`;
    const trackingNumber = `TRACK-DD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      ...orderPayload,
      id: orderId,
      orderNumber: orderId,
      createdAt: new Date().toISOString(),
      trackingNumber,
      timeline: [
        {
          status: 'PLACED',
          title: 'Order Placed & Confirmed',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          done: true,
          description: 'Your pure dairy order is confirmed and scheduled for farm packing.'
        },
        {
          status: 'PACKED',
          title: 'Packed in Cold-Chain Insulated Box',
          time: 'Scheduled: 4:00 AM',
          done: false,
          description: 'Packed at 2°C with gel ice packs.'
        },
        {
          status: 'OUT_FOR_DELIVERY',
          title: 'Out for Morning Delivery',
          time: 'Scheduled: 6:00 AM',
          done: false,
          description: 'DesiDhar refrigerated electric van en route.'
        },
        {
          status: 'DELIVERED',
          title: 'Delivered at Doorstep',
          time: 'Estimated before 7:30 AM',
          done: false,
          description: 'Fresh milk and sweets delivered.'
        }
      ]
    };

    const existing = getStoredOrders();
    saveStoredOrders([newOrder, ...existing]);
    return newOrder;
  },

  async getOrders(): Promise<Order[]> {
    await delay(150);
    return getStoredOrders();
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    await delay(150);
    const orders = getStoredOrders();
    const found = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    return found || null;
  },

  async cancelOrder(orderId: string): Promise<Order | null> {
    await delay(200);
    const orders = getStoredOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = 'CANCELLED';
      orders[idx].timeline.push({
        status: 'CANCELLED',
        title: 'Order Cancelled',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        done: true,
        description: 'Order cancelled by customer. Refund initiated if prepaid.'
      });
      saveStoredOrders([...orders]);
      return orders[idx];
    }
    return null;
  }
};
