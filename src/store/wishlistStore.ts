import { create } from 'zustand';
import type { Product } from '../types';
import { api } from '../services/api';
import { useAuthStore } from './authStore';
import { useUiStore } from './uiStore';

/**
 * Wishlist is stored server-side per authenticated customer. Guests are asked to
 * sign in instead of having a second, local-only wishlist that would be lost.
 */

interface WishlistState {
  items: Product[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  load: () => Promise<void>;
  toggle: (product: Product) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  reset: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  status: 'idle',
  error: null,

  load: async () => {
    if (!useAuthStore.getState().user) {
      set({ items: [], status: 'ready', error: null });
      return;
    }
    set({ status: 'loading', error: null });
    try {
      const items = await api.getWishlist();
      set({ items, status: 'ready' });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unable to load your wishlist.',
      });
    }
  },

  toggle: async (product) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      useUiStore.getState().openAuthModal();
      useUiStore.getState().addToast('Sign in to save products to your wishlist.', 'info');
      return;
    }
    const wasSaved = get().items.some((item) => item.id === product.id);
    set({ status: 'loading', error: null });
    try {
      const items = wasSaved
        ? await api.removeFromWishlist(product.id)
        : await api.addToWishlist(product.id);
      set({ items, status: 'ready' });
      useUiStore
        .getState()
        .addToast(
          wasSaved ? `Removed ${product.name} from wishlist` : `Saved ${product.name} to wishlist`,
          'info'
        );
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Could not update your wishlist.',
      });
      useUiStore
        .getState()
        .addToast('Could not update your wishlist. Please try again.', 'error');
    }
  },

  remove: async (productId) => {
    try {
      const items = await api.removeFromWishlist(productId);
      set({ items, status: 'ready' });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Could not update your wishlist.' });
    }
  },

  clear: async () => {
    try {
      const items = await api.clearWishlist();
      set({ items, status: 'ready' });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Could not clear your wishlist.' });
    }
  },

  isInWishlist: (productId) => get().items.some((item) => item.id === productId),

  reset: () => set({ items: [], status: 'idle', error: null }),
}));
