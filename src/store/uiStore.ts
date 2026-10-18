import { create } from 'zustand';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UiState {
  isAuthModalOpen: boolean;
  authModalInitialPhone: string;
  isPincodeModalOpen: boolean;
  isMobileFilterDrawerOpen: boolean;
  toasts: ToastItem[];

  // Actions
  openAuthModal: (phone?: string) => void;
  closeAuthModal: () => void;
  openPincodeModal: () => void;
  closePincodeModal: () => void;
  setMobileFilterDrawerOpen: (open: boolean) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  isAuthModalOpen: false,
  authModalInitialPhone: '',
  isPincodeModalOpen: false,
  isMobileFilterDrawerOpen: false,
  toasts: [],

  openAuthModal: (phone = '') => {
    set({ isAuthModalOpen: true, authModalInitialPhone: phone });
  },

  closeAuthModal: () => {
    set({ isAuthModalOpen: false, authModalInitialPhone: '' });
  },

  openPincodeModal: () => {
    set({ isPincodeModalOpen: true });
  },

  closePincodeModal: () => {
    set({ isPincodeModalOpen: false });
  },

  setMobileFilterDrawerOpen: (open: boolean) => {
    set({ isMobileFilterDrawerOpen: open });
  },

  addToast: (message: string, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastItem = { id, message, type };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 3500);
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
