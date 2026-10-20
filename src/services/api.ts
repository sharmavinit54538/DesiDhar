import type {
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
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/categories';
import { HERO_BANNERS as INITIAL_BANNERS } from '../data/banners';
import { MOCK_COUPONS } from '../data/coupons';
import { SERVICEABLE_PINCODES } from '../data/pincodes';
import { getProductImagesBySlug } from '../data/productImages';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Artificial delay helper to simulate real HTTP latency when in offline dynamic fallback mode
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

// Dynamic LocalStorage keys
const STORAGE_KEYS = {
  ORDERS: 'desidhar_orders',
  REVIEWS: 'desidhar_reviews',
  USERS: 'desidhar_users',
  PRODUCTS: 'desidhar_dynamic_products',
  CATEGORIES: 'desidhar_dynamic_categories',
  BANNERS: 'desidhar_dynamic_banners',
  INITIALIZED: 'desidhar_catalog_initialized',
};

// Generic fetch wrapper to call FastAPI backend
async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) return null;
      return null;
    }
    return (await res.json()) as T;
  } catch {
    // Backend is offline or not yet connected; fallback seamlessly
    return null;
  }
}

// Local dynamic repository helpers
function getStoredItems<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveStoredItems<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save to localStorage (${key})`, e);
  }
}

// Product image enrichment
function enrichProductImages(product: Product): Product {
  const richImages = getProductImagesBySlug(product.slug);
  if (richImages.length > 0) {
    return { ...product, images: richImages };
  }
  return product;
}

function enrichProductsWithImages(products: Product[]): Product[] {
  return products.map(enrichProductImages);
}

// Dynamic catalog initialization: starts with catalog available in dynamic storage
function getDynamicProducts(): Product[] {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    // First time setup: populate dynamic storage from catalog
    saveStoredItems(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    saveStoredItems(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    saveStoredItems(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    return INITIAL_PRODUCTS;
  }
  return getStoredItems<Product[]>(STORAGE_KEYS.PRODUCTS, []);
}

function getDynamicCategories(): Category[] {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    getDynamicProducts(); // Triggers initialization
  }
  return getStoredItems<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

function getDynamicBanners(): HeroBanner[] {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    getDynamicProducts(); // Triggers initialization
  }
  return getStoredItems<HeroBanner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
}

/**
 * Dynamic API Service
 * Communicates with FastAPI REST API endpoints, with seamless dynamic database fallback
 */
export const api = {
  // Clear entire product catalog to test empty state
  clearCatalog(): void {
    saveStoredItems(STORAGE_KEYS.PRODUCTS, []);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  // Reset/seed sample dairy catalog into dynamic database
  seedCatalog(): void {
    saveStoredItems(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    saveStoredItems(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    saveStoredItems(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  // Check if database currently has no products
  isCatalogEmpty(): boolean {
    const products = getStoredItems<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    return products.length === 0;
  },

  // Products
  async getProducts(filters?: Partial<FilterState>): Promise<{ products: Product[]; total: number }> {
    // 1. Try FastAPI backend
    const queryParams = new URLSearchParams();
    if (filters?.category && filters.category !== 'all') queryParams.set('category', filters.category);
    if (filters?.searchQuery) queryParams.set('q', filters.searchQuery);
    if (filters?.sortBy) queryParams.set('sortBy', filters.sortBy);

    const apiRes = await fetchFromApi<{ products: Product[]; total: number }>(`/products?${queryParams.toString()}`);
    if (apiRes) {
      return {
        products: enrichProductsWithImages(apiRes.products),
        total: apiRes.total,
      };
    }

    // 2. Dynamic database fallback
    await delay(180);
    const stored = getDynamicProducts();
    let result = enrichProductsWithImages([...stored]);

    if (filters?.category && filters.category !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === filters.category?.toLowerCase());
    }

    if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (filters?.brands && filters.brands.length > 0) {
      result = result.filter((p) => filters.brands?.includes(p.brand));
    }

    if (filters?.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => {
        const lowestPrice = Math.min(...p.variants.map((v) => v.price));
        return lowestPrice >= min && lowestPrice <= max;
      });
    }

    if (filters?.minRating && filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating!);
    }

    if (filters?.minDiscount && filters.minDiscount > 0) {
      result = result.filter((p) => {
        const maxDiscount = Math.max(
          ...p.variants.map((v) => Math.round(((v.mrp - v.price) / v.mrp) * 100))
        );
        return maxDiscount >= filters.minDiscount!;
      });
    }

    if (filters?.dietary && filters.dietary.length > 0) {
      result = result.filter((p) =>
        filters.dietary?.some((tag) =>
          p.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
        )
      );
    }

    if (filters?.inStockOnly) {
      result = result.filter((p) => p.variants.some((v) => v.stock > 0));
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
            const discA = (a.variants[0].mrp - a.variants[0].price) / a.variants[0].mrp;
            const discB = (b.variants[0].mrp - b.variants[0].price) / b.variants[0].mrp;
            return discB - discA;
          });
          break;
        case 'newest':
          result.reverse();
          break;
        case 'relevance':
        default:
          result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
          break;
      }
    }

    return { products: result, total: result.length };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const apiRes = await fetchFromApi<Product>(`/products/${slug}`);
    if (apiRes) return enrichProductImages(apiRes);

    await delay(120);
    const stored = getDynamicProducts();
    const product = stored.find((p) => p.slug === slug);
    return product ? enrichProductImages(product) : null;
  },

  async getProductById(id: string): Promise<Product | null> {
    const apiRes = await fetchFromApi<Product>(`/products/id/${id}`);
    if (apiRes) return enrichProductImages(apiRes);

    await delay(100);
    const stored = getDynamicProducts();
    const product = stored.find((p) => p.id === id);
    return product ? enrichProductImages(product) : null;
  },

  async getRelatedProducts(productId: string, category: string, limit = 4): Promise<Product[]> {
    const apiRes = await fetchFromApi<Product[]>(`/products/related?productId=${productId}&category=${category}&limit=${limit}`);
    if (apiRes) return enrichProductsWithImages(apiRes);

    await delay(150);
    const stored = getDynamicProducts();
    return enrichProductsWithImages(
      stored
        .filter((p) => p.category === category && p.id !== productId)
        .slice(0, limit)
    );
  },

  async getFrequentlyBoughtTogether(product: Product): Promise<Product[]> {
    const apiRes = await fetchFromApi<Product[]>(`/products/frequently-bought?productId=${product.id}`);
    if (apiRes) return enrichProductsWithImages(apiRes);

    await delay(100);
    const stored = getDynamicProducts();
    const complementCategories = ['curd-dahi', 'paneer', 'butter', 'milk', 'mithai'];
    return enrichProductsWithImages(
      stored
        .filter((p) => p.id !== product.id && complementCategories.includes(p.category))
        .slice(0, 2)
    );
  },

  // Home curated sections
  async getDealOfTheDay(): Promise<Product[]> {
    const apiRes = await fetchFromApi<Product[]>('/products/deals');
    if (apiRes) return enrichProductsWithImages(apiRes);

    await delay(100);
    const stored = getDynamicProducts();
    return enrichProductsWithImages(
      stored.filter((p) => p.isDeal || p.tags.includes('Deal of Day')).slice(0, 6)
    );
  },

  async getBestSellers(): Promise<Product[]> {
    const apiRes = await fetchFromApi<Product[]>('/products/bestsellers');
    if (apiRes) return enrichProductsWithImages(apiRes);

    await delay(100);
    const stored = getDynamicProducts();
    return enrichProductsWithImages(
      stored.filter((p) => p.isBestseller).slice(0, 8)
    );
  },

  async getFreshToday(): Promise<Product[]> {
    const apiRes = await fetchFromApi<Product[]>('/products/fresh');
    if (apiRes) return enrichProductsWithImages(apiRes);

    await delay(100);
    const stored = getDynamicProducts();
    return enrichProductsWithImages(
      stored.filter((p) => p.isFresh || p.tags.includes('Fresh Today')).slice(0, 8)
    );
  },

  async getFestiveSweets(): Promise<Product[]> {
    const apiRes = await fetchFromApi<Product[]>('/products/sweets');
    if (apiRes) return enrichProductsWithImages(apiRes);

    await delay(100);
    const stored = getDynamicProducts();
    return enrichProductsWithImages(
      stored.filter((p) => p.category === 'mithai' || p.category === 'gift-boxes').slice(0, 8)
    );
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const apiRes = await fetchFromApi<Category[]>('/categories');
    if (apiRes) return apiRes;

    await delay(80);
    return getDynamicCategories();
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const apiRes = await fetchFromApi<Category>(`/categories/${slug}`);
    if (apiRes) return apiRes;

    await delay(80);
    const categories = getDynamicCategories();
    return categories.find((c) => c.slug === slug) || null;
  },

  // Banners
  async getBanners(): Promise<HeroBanner[]> {
    const apiRes = await fetchFromApi<HeroBanner[]>('/banners');
    if (apiRes) return apiRes;

    await delay(50);
    return getDynamicBanners();
  },

  // Pincode
  async checkPincode(pincode: string): Promise<PincodeCheckResult> {
    const apiRes = await fetchFromApi<PincodeCheckResult>(`/pincodes/${pincode.trim()}`);
    if (apiRes) return apiRes;

    await delay(250);
    const cleaned = pincode.trim();
    if (SERVICEABLE_PINCODES[cleaned]) {
      return SERVICEABLE_PINCODES[cleaned];
    }
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
    const apiRes = await fetchFromApi<{ isValid: boolean; coupon?: Coupon; error?: string }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal }),
    });
    if (apiRes) return apiRes;

    await delay(200);
    const upper = code.trim().toUpperCase();
    const coupon = MOCK_COUPONS.find((c) => c.code === upper);

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

  // Reviews: NO hardcoded fake reviews! Starts empty and accumulates real customer reviews.
  async getReviews(productId?: string): Promise<Review[]> {
    if (productId) {
      const apiRes = await fetchFromApi<Review[]>(`/reviews/${productId}`);
      if (apiRes) return apiRes;
    }

    await delay(100);
    const stored = getStoredItems<Review[]>(STORAGE_KEYS.REVIEWS, []);
    if (!productId) {
      return stored;
    }
    return stored.filter((r) => r.productId === productId);
  },

  async getFeaturedReviews(): Promise<Review[]> {
    const apiRes = await fetchFromApi<Review[]>('/reviews/featured');
    if (apiRes) return apiRes;

    await delay(100);
    const stored = getStoredItems<Review[]>(STORAGE_KEYS.REVIEWS, []);
    return stored.slice(0, 3);
  },

  async addReview(reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> {
    const apiRes = await fetchFromApi<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
    if (apiRes) return apiRes;

    await delay(250);
    const newReview: Review = {
      ...reviewData,
      id: `rev-user-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0
    };
    const stored = getStoredItems<Review[]>(STORAGE_KEYS.REVIEWS, []);
    saveStoredItems(STORAGE_KEYS.REVIEWS, [newReview, ...stored]);
    return newReview;
  },

  // Search suggestions
  async searchSuggestions(query: string): Promise<{ products: Product[]; categories: Category[] }> {
    const apiRes = await fetchFromApi<{ products: Product[]; categories: Category[] }>(`/search/suggestions?q=${encodeURIComponent(query)}`);
    if (apiRes) return apiRes;

    await delay(100);
    const q = query.toLowerCase().trim();
    if (!q) return { products: [], categories: [] };

    const categories = getDynamicCategories();
    const products = getDynamicProducts();

    const matchingCategories = categories.filter((c) =>
      c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchingProducts = products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 6);

    return { products: matchingProducts, categories: matchingCategories };
  },

  // Auth: Dynamic phone auth with NO hardcoded fake user name, fake email, or fake address!
  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    const apiRes = await fetchFromApi<{ success: boolean; message: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
    if (apiRes) return apiRes;

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
    const apiRes = await fetchFromApi<{ success: boolean; user?: User; error?: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
    if (apiRes) return apiRes;

    await delay(350);
    if (!/^\d{6}$/.test(otp.trim())) {
      return { success: false, error: 'Please enter a valid 6-digit OTP.' };
    }

    const cleanPhone = phone.trim();
    const storedUsers = getStoredItems<Record<string, User>>(STORAGE_KEYS.USERS, {});

    // If user already exists in storage for this phone, return their actual saved profile
    if (storedUsers[cleanPhone]) {
      return { success: true, user: storedUsers[cleanPhone] };
    }

    // Otherwise create a fresh user with empty profile and NO hardcoded addresses
    const freshUser: User = {
      id: `user-${cleanPhone}`,
      name: `User ${cleanPhone.slice(-4)}`,
      phone: cleanPhone,
      email: '',
      addresses: [],
      isLoggedIn: true
    };

    storedUsers[cleanPhone] = freshUser;
    saveStoredItems(STORAGE_KEYS.USERS, storedUsers);

    return { success: true, user: freshUser };
  },

  // Orders: Dynamic order storage; starts empty and stores real user orders
  async createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber'>): Promise<Order> {
    const apiRes = await fetchFromApi<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
    if (apiRes) return apiRes;

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

    const existing = getStoredItems<Order[]>(STORAGE_KEYS.ORDERS, []);
    saveStoredItems(STORAGE_KEYS.ORDERS, [newOrder, ...existing]);
    return newOrder;
  },

  async getOrders(): Promise<Order[]> {
    const apiRes = await fetchFromApi<Order[]>('/orders');
    if (apiRes) return apiRes;

    await delay(150);
    return getStoredItems<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const apiRes = await fetchFromApi<Order>(`/orders/${orderId}`);
    if (apiRes) return apiRes;

    await delay(150);
    const orders = getStoredItems<Order[]>(STORAGE_KEYS.ORDERS, []);
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
  },

  async cancelOrder(orderId: string): Promise<Order | null> {
    const apiRes = await fetchFromApi<Order>(`/orders/${orderId}/cancel`, { method: 'POST' });
    if (apiRes) return apiRes;

    await delay(200);
    const orders = getStoredItems<Order[]>(STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = 'CANCELLED';
      orders[idx].timeline.push({
        status: 'CANCELLED',
        title: 'Order Cancelled',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        done: true,
        description: 'Order cancelled by customer. Refund initiated if prepaid.'
      });
      saveStoredItems(STORAGE_KEYS.ORDERS, [...orders]);
      return orders[idx];
    }
    return null;
  }
};
