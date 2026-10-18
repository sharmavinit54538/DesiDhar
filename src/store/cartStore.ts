import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Coupon, OrderPricing } from '../types';

interface CartState {
  items: CartItem[];
  savedForLater: CartItem[];
  appliedCoupon: Coupon | null;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  saveForLater: (variantId: string) => void;
  moveToCart: (variantId: string) => void;
  removeSavedForLater: (variantId: string) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;

  // Calculations
  getItemCount: () => number;
  getPricing: () => OrderPricing;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      appliedCoupon: null,

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.variantId === item.variantId
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            const newQty = Math.min(
              updated[existingIndex].quantity + quantity,
              item.maxStock
            );
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: newQty,
            };
            return { items: updated };
          } else {
            return {
              items: [
                ...state.items,
                { ...item, quantity: Math.min(quantity, item.maxStock) },
              ],
            };
          }
        });
      },

      removeItem: (variantId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.maxStock) }
              : i
          ),
        }));
      },

      saveForLater: (variantId: string) => {
        const item = get().items.find((i) => i.variantId === variantId);
        if (!item) return;

        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
          savedForLater: [
            ...state.savedForLater.filter((i) => i.variantId !== variantId),
            item,
          ],
        }));
      },

      moveToCart: (variantId: string) => {
        const item = get().savedForLater.find((i) => i.variantId === variantId);
        if (!item) return;

        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i.variantId !== variantId),
          items: [
            ...state.items.filter((i) => i.variantId !== variantId),
            { ...item, quantity: 1 },
          ],
        }));
      },

      removeSavedForLater: (variantId: string) => {
        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i.variantId !== variantId),
        }));
      },

      applyCoupon: (coupon: Coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getPricing: (): OrderPricing => {
        const { items, appliedCoupon } = get();

        let mrpTotal = 0;
        let itemTotal = 0;

        items.forEach((item) => {
          mrpTotal += item.mrp * item.quantity;
          itemTotal += item.price * item.quantity;
        });

        const productDiscount = mrpTotal - itemTotal;

        // Delivery fee: Free above ₹499, otherwise ₹40
        const deliveryFee = itemTotal === 0 || itemTotal >= 499 ? 0 : 40;

        let couponDiscount = 0;
        if (appliedCoupon && itemTotal >= appliedCoupon.minOrderValue) {
          if (appliedCoupon.discountType === 'percentage') {
            const rawDiscount = (itemTotal * appliedCoupon.discountValue) / 100;
            couponDiscount = appliedCoupon.maxDiscount
              ? Math.min(rawDiscount, appliedCoupon.maxDiscount)
              : rawDiscount;
          } else {
            couponDiscount = appliedCoupon.discountValue;
          }
        }

        const total = Math.max(0, itemTotal - couponDiscount + deliveryFee);
        const totalSavings = productDiscount + couponDiscount;

        return {
          mrpTotal,
          discount: productDiscount,
          couponDiscount: Math.round(couponDiscount),
          deliveryFee,
          total: Math.round(total),
          savings: Math.round(totalSavings),
          couponCode: appliedCoupon?.code,
        };
      },
    }),
    {
      name: 'desidhar_cart_storage',
    }
  )
);
