import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product: Product) => {
        const { items } = get();
        const exists = items.some((p) => p.id === product.id);

        if (exists) {
          set({ items: items.filter((p) => p.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((p) => p.id === productId);
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((p) => p.id !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'desidhar_wishlist_storage',
    }
  )
);
