import type {
  Address,
  CartItem,
  CartValidationResult,
  Category,
  Coupon,
  DeliverySlot,
  FilterState,
  HeroBanner,
  Order,
  PaymentMethod,
  PaymentMethodOption,
  PincodeCheckResult,
  Product,
  ProductFacets,
  PublicSettings,
  Review,
  ReviewSummary,
  ServerProductList,
  User,
} from '../types';
import { buildQuery, request } from './apiClient';

/**
 * Typed client for the DesiDhar API.
 *
 * Every method performs a real HTTP request. There are no local fallbacks, no
 * seeded demo records and no simulated success paths: if the API fails, the
 * error is surfaced to the caller so the UI can show an honest error state.
 */

export interface ProductQuery extends Partial<Omit<FilterState, 'priceRange'>> {
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
  deal?: boolean;
}

export interface CartLineInput {
  variantId: string;
  quantity: number;
}

export interface AddressInput extends Omit<Address, 'id'> {
  id?: string;
}

export interface OrderInput {
  items: CartLineInput[];
  addressId?: string;
  address?: Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean };
  slotId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export const api = {
  /* Catalog */
  async getSettings(): Promise<PublicSettings> {
    return request<PublicSettings>('/settings');
  },

  async getCategories(): Promise<Category[]> {
    const { categories } = await request<{ categories: Category[] }>('/categories');
    return categories;
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const { category } = await request<{ category: Category }>(`/categories/${encodeURIComponent(slug)}`);
      return category;
    } catch {
      return null;
    }
  },

  async getBanners(): Promise<HeroBanner[]> {
    const { banners } = await request<{ banners: HeroBanner[] }>('/banners');
    return banners;
  },

  async getProducts(query: ProductQuery = {}): Promise<ServerProductList> {
    const params = buildQuery({
      category: query.category && query.category !== 'all' ? query.category : undefined,
      q: query.searchQuery,
      sortBy: query.sortBy,
      brands: query.brands && query.brands.length > 0 ? query.brands.join(',') : undefined,
      weights: query.weights && query.weights.length > 0 ? query.weights.join(',') : undefined,
      dietary: query.dietary && query.dietary.length > 0 ? query.dietary.join(',') : undefined,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      minRating: query.minRating || undefined,
      minDiscount: query.minDiscount || undefined,
      inStock: query.inStockOnly || undefined,
      deal: query.deal || undefined,
      page: query.page,
      pageSize: query.pageSize,
    });
    return request<ServerProductList>(`/products${params}`);
  },

  async getFacets(): Promise<ProductFacets> {
    const { facets } = await request<{ facets: ProductFacets }>('/products/facets');
    return facets;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { product } = await request<{ product: Product }>(
        `/products/${encodeURIComponent(slug)}`
      );
      return product;
    } catch (error) {
      if ((error as { status?: number }).status === 404) return null;
      throw error;
    }
  },

  async getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
    const { products } = await request<{ products: Product[] }>(
      `/products/${encodeURIComponent(slug)}/related${buildQuery({ limit })}`
    );
    return products;
  },

  async getFrequentlyBought(slug: string, limit = 2): Promise<Product[]> {
    const { products } = await request<{ products: Product[] }>(
      `/products/${encodeURIComponent(slug)}/frequently-bought${buildQuery({ limit })}`
    );
    return products;
  },

  async getDeals(): Promise<{ products: Product[]; endsAt: string | null }> {
    return request<{ products: Product[]; endsAt: string | null }>('/products/deals');
  },

  async getFeatured(): Promise<Product[]> {
    const { products } = await request<{ products: Product[] }>('/products/featured');
    return products;
  },

  async getFreshToday(): Promise<Product[]> {
    const { products } = await request<{ products: Product[] }>('/products/fresh');
    return products;
  },

  async getFestiveSweets(): Promise<Product[]> {
    const { products } = await request<{ products: Product[] }>('/products/sweets');
    return products;
  },

  async searchSuggestions(query: string): Promise<{ products: Product[]; categories: Category[] }> {
    return request<{ products: Product[]; categories: Category[] }>(
      `/search/suggestions${buildQuery({ q: query })}`
    );
  },

  async getTrendingProducts(limit = 5): Promise<Product[]> {
    const { products } = await request<{ products: Product[] }>(
      `/search/trending${buildQuery({ limit })}`
    );
    return products;
  },

  /* Delivery */
  async checkPincode(pincode: string): Promise<PincodeCheckResult> {
    return request<PincodeCheckResult>(`/pincodes/${encodeURIComponent(pincode.trim())}`);
  },

  async getPopularPincodes(): Promise<{ pincode: string; city: string }[]> {
    const { pincodes } = await request<{ pincodes: { pincode: string; city: string }[] }>(
      '/pincodes/popular'
    );
    return pincodes;
  },

  async getDeliverySlots(): Promise<DeliverySlot[]> {
    const { slots } = await request<{ slots: DeliverySlot[] }>('/delivery-slots');
    return slots;
  },

  async getPaymentMethods(): Promise<PaymentMethodOption[]> {
    const { methods } = await request<{ methods: PaymentMethodOption[] }>('/payment-methods');
    return methods;
  },

  /* Coupons */
  async getPublicCoupons(): Promise<Coupon[]> {
    const { coupons } = await request<{ coupons: Coupon[] }>('/coupons');
    return coupons;
  },

  async validateCoupon(
    code: string,
    cartTotal: number
  ): Promise<{ isValid: boolean; coupon?: Coupon; error?: string }> {
    return request<{ isValid: boolean; coupon?: Coupon; error?: string }>('/coupons/validate', {
      method: 'POST',
      body: { code, cartTotal },
    });
  },

  /**
   * POST /api/cart/validate returns authoritative prices, stock and coupon math.
   * The server reports the sellable quantity as `stock`, which is mapped onto the
   * client-side `maxStock` field so the cart UI can clamp quantity steppers.
   */
  async validateCart(items: CartLineInput[], couponCode?: string): Promise<CartValidationResult> {
    const result = await request<
      Omit<CartValidationResult, 'items'> & {
        items: (Omit<CartItem, 'maxStock'> & { stock: number })[];
      }
    >('/cart/validate', {
      method: 'POST',
      body: { items, couponCode },
    });

    return {
      ...result,
      items: (result.items || []).map((line) => {
        const { stock, ...rest } = line;
        return { ...rest, maxStock: stock };
      }),
    };
  },

  /* Reviews */
  async getReviews(productId: string): Promise<{ reviews: Review[]; summary: ReviewSummary }> {
    return request<{ reviews: Review[]; summary: ReviewSummary }>(
      `/reviews/${encodeURIComponent(productId)}`
    );
  },

  async getFeaturedReviews(limit = 3): Promise<Review[]> {
    const { reviews } = await request<{ reviews: Review[] }>(
      `/reviews/featured${buildQuery({ limit })}`
    );
    return reviews;
  },

  async addReview(payload: { productId: string; rating: number; comment: string }): Promise<Review> {
    const { review } = await request<{ review: Review }>('/reviews', {
      method: 'POST',
      body: payload,
    });
    return review;
  },

  /* Auth */
  async sendOtp(
    phone: string
  ): Promise<{ success: boolean; message: string; devMode?: boolean; devCode?: string }> {
    return request('/auth/send-otp', { method: 'POST', body: { phone } });
  },

  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; user: User }> {
    const result = await request<{ success: boolean; user: User; token: string }>('/auth/verify-otp', {
      method: 'POST',
      body: { phone, otp },
    });
    return { success: result.success, user: result.user };
  },

  async logout(): Promise<void> {
    await request('/auth/logout', { method: 'POST' });
  },

  async getSession(): Promise<{ user: User | null; addresses: Address[] }> {
    return request<{ user: User | null; addresses?: Address[] }>('/auth/me').then((result) => ({
      user: result.user,
      addresses: result.addresses || [],
    }));
  },

  async updateProfile(payload: { name?: string; email?: string }): Promise<User> {
    const { user } = await request<{ user: User }>('/auth/me', {
      method: 'PATCH',
      body: payload,
    });
    return user;
  },

  /* Addresses */
  async getAddresses(): Promise<Address[]> {
    const { addresses } = await request<{ addresses: Address[] }>('/addresses');
    return addresses;
  },

  async addAddress(payload: AddressInput): Promise<Address[]> {
    const { addresses } = await request<{ addresses: Address[] }>('/addresses', {
      method: 'POST',
      body: payload,
    });
    return addresses;
  },

  async updateAddress(id: string, payload: AddressInput): Promise<Address[]> {
    const { addresses } = await request<{ addresses: Address[] }>(`/addresses/${id}`, {
      method: 'PATCH',
      body: payload,
    });
    return addresses;
  },

  async deleteAddress(id: string): Promise<Address[]> {
    const { addresses } = await request<{ addresses: Address[] }>(`/addresses/${id}`, {
      method: 'DELETE',
    });
    return addresses;
  },

  async setDefaultAddress(id: string): Promise<Address[]> {
    const { addresses } = await request<{ addresses: Address[] }>(`/addresses/${id}/default`, {
      method: 'POST',
    });
    return addresses;
  },

  /* Wishlist */
  async getWishlist(): Promise<Product[]> {
    const { products } = await request<{ products: Product[] }>('/wishlist');
    return products;
  },

  async addToWishlist(productId: string): Promise<Product[]> {
    const { products } = await request<{ products: Product[] }>('/wishlist', {
      method: 'POST',
      body: { productId },
    });
    return products;
  },

  async removeFromWishlist(productId: string): Promise<Product[]> {
    const { products } = await request<{ products: Product[] }>(
      `/wishlist/${encodeURIComponent(productId)}`,
      { method: 'DELETE' }
    );
    return products;
  },

  async clearWishlist(): Promise<Product[]> {
    const { products } = await request<{ products: Product[] }>('/wishlist', { method: 'DELETE' });
    return products;
  },

  /* Orders */
  async createOrder(payload: OrderInput): Promise<Order> {
    const { order } = await request<{ order: Order }>('/orders', {
      method: 'POST',
      body: payload,
    });
    return order;
  },

  async getOrders(): Promise<Order[]> {
    const { orders } = await request<{ orders: Order[] }>('/orders');
    return orders;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { order } = await request<{ order: Order }>(`/orders/${encodeURIComponent(orderId)}`);
      return order;
    } catch (error) {
      if ((error as { status?: number }).status === 404) return null;
      throw error;
    }
  },

  async cancelOrder(orderId: string): Promise<Order> {
    const { order } = await request<{ order: Order }>(
      `/orders/${encodeURIComponent(orderId)}/cancel`,
      { method: 'POST' }
    );
    return order;
  },

  /* Payments */
  async createRazorpayOrder(orderId: string) {
    return request<{
      provider: string;
      keyId: string;
      razorpayOrderId: string;
      amount: number;
      currency: string;
      orderNumber: string;
    }>('/payments/razorpay/order', { method: 'POST', body: { orderId } });
  },

  async verifyRazorpayPayment(payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<Order> {
    const { order } = await request<{ order: Order }>('/payments/razorpay/verify', {
      method: 'POST',
      body: payload,
    });
    return order;
  },

  /* Support */
  async submitContact(payload: {
    name: string;
    email?: string;
    phone: string;
    subject?: string;
    message: string;
  }): Promise<{ id: string; receivedAt: string }> {
    return request('/contact', { method: 'POST', body: payload });
  },

  async subscribeNewsletter(email: string): Promise<{ email: string; subscribedAt?: string }> {
    return request('/newsletter', { method: 'POST', body: { email } });
  },

  /* Admin */
  async adminGetStats() {
    const { stats } = await request<{ stats: import('../types/admin').AdminStats }>('/admin/stats');
    return stats;
  },

  async adminGetOverview() {
    return request<Record<string, unknown>>('/admin/overview');
  },

  async adminDeleteProductImage(productId: string, imageId: string) {
    return request(`/admin/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}`, {
      method: 'DELETE',
    });
  },

  async adminGetProducts(params: { q?: string; lowStock?: boolean } = {}) {
    const { products } = await request<{ products: import('../types/admin').AdminProduct[] }>(
      `/admin/products${buildQuery({ q: params.q, lowStock: params.lowStock })}`
    );
    return products;
  },

  async adminUpdateVariant(
    productId: string,
    variantId: string,
    payload: { stock?: number; price?: number; mrp?: number }
  ) {
    const { variant } = await request<{ variant: import('../types/admin').AdminVariantUpdate }>(
      `/admin/products/${encodeURIComponent(productId)}/variants/${encodeURIComponent(variantId)}`,
      { method: 'PATCH', body: payload }
    );
    return variant;
  },

  async adminUpdateProduct(
    productId: string,
    payload: Partial<{
      isActive: boolean;
      isFeatured: boolean;
      isFresh: boolean;
      isDeal: boolean;
      dealEndsAt: string | null;
    }>
  ) {
    return request(`/admin/products/${encodeURIComponent(productId)}`, {
      method: 'PATCH',
      body: payload,
    });
  },

  async adminGetOrders(status?: string) {
    const { orders } = await request<{ orders: import('../types/admin').AdminOrder[] }>(
      `/admin/orders${buildQuery({ status })}`
    );
    return orders;
  },

  async adminUpdateOrder(
    orderId: string,
    payload: { status: string; trackingNumber?: string | null; courierName?: string | null }
  ) {
    const { order } = await request<{ order: Order }>(
      `/admin/orders/${encodeURIComponent(orderId)}`,
      { method: 'PATCH', body: payload }
    );
    return order;
  },

  async adminGetCoupons() {
    return (await request<{ coupons: import('../types/admin').AdminCoupon[] }>('/admin/coupons'))
      .coupons;
  },

  async adminSaveCoupon(payload: Record<string, unknown>) {
    const { coupon } = await request<{ coupon: import('../types/admin').AdminCoupon }>(
      '/admin/coupons',
      { method: 'POST', body: payload }
    );
    return coupon;
  },

  async adminToggleCoupon(code: string, isActive: boolean) {
    const { coupon } = await request<{ coupon: import('../types/admin').AdminCoupon }>(
      `/admin/coupons/${encodeURIComponent(code)}`,
      { method: 'PATCH', body: { isActive } }
    );
    return coupon;
  },

  async adminGetReviews(status?: string) {
    return (
      await request<{ reviews: import('../types/admin').AdminReview[] }>(
        `/admin/reviews${buildQuery({ status })}`
      )
    ).reviews;
  },

  async adminModerateReview(reviewId: string, status: 'published' | 'pending' | 'hidden') {
    return request(`/admin/reviews/${encodeURIComponent(reviewId)}`, {
      method: 'PATCH',
      body: { status },
    });
  },

  async adminGetMessages() {
    return (
      await request<{ messages: import('../types/admin').AdminMessage[] }>('/admin/messages')
    ).messages;
  },

  async adminResolveMessage(messageId: string) {
    return request(`/admin/messages/${encodeURIComponent(messageId)}`, { method: 'PATCH' });
  },

  async adminGetSettings() {
    return request<{ settings: Record<string, string>; publicSettings: PublicSettings }>(
      '/admin/settings'
    );
  },

  async adminUpdateSettings(payload: Record<string, string>) {
    const { settings } = await request<{ settings: Record<string, string> }>('/admin/settings', {
      method: 'PATCH',
      body: payload,
    });
    return settings;
  },
};

export type ApiClient = typeof api;
export type { CartItem, Order, Product, User };
