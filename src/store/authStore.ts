import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address, User } from '../types';
import { api, type AddressInput } from '../services/api';

/**
 * Session state is owned by the server (HttpOnly session cookie). This store only
 * mirrors the profile that the API confirms via /auth/me — it is never a source of
 * truth for authentication.
 */

type AuthStatus = 'idle' | 'loading' | 'ready';

interface AuthState {
  user: User | null;
  addresses: Address[];
  status: AuthStatus;
  sessionChecked: boolean;
  selectedPincode: string;
  selectedCity: string;
  error: string | null;

  bootstrap: () => Promise<void>;
  setSessionUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: { name?: string; email?: string }) => Promise<void>;
  refreshAddresses: () => Promise<void>;
  addAddress: (address: AddressInput) => Promise<Address[]>;
  updateAddress: (id: string, address: AddressInput) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  setPincode: (pincode: string, city?: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      status: 'idle',
      sessionChecked: false,
      selectedPincode: '',
      selectedCity: '',
      error: null,

      bootstrap: async () => {
        if (get().status === 'loading') return;
        set({ status: 'loading', error: null });
        try {
          const { user, addresses } = await api.getSession();
          set({
            user,
            addresses,
            status: 'ready',
            sessionChecked: true,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            addresses: [],
            status: 'ready',
            sessionChecked: true,
            error: error instanceof Error ? error.message : 'Unable to restore your session.',
          });
        }
      },

      setSessionUser: async (user) => {
        set({ user, status: 'ready', sessionChecked: true, error: null });
        try {
          const addresses = await api.getAddresses();
          set({ addresses });
        } catch {
          set({ addresses: [] });
        }
      },

      logout: async () => {
        try {
          await api.logout();
        } finally {
          set({ user: null, addresses: [], error: null });
        }
      },

      updateProfile: async (payload) => {
        const user = await api.updateProfile(payload);
        set({ user });
      },

      refreshAddresses: async () => {
        if (!get().user) return;
        const addresses = await api.getAddresses();
        set({ addresses });
      },

      addAddress: async (address) => {
        const addresses = await api.addAddress(address);
        set({ addresses });
        return addresses;
      },

      updateAddress: async (id, address) => {
        const addresses = await api.updateAddress(id, address);
        set({ addresses });
      },

      deleteAddress: async (id) => {
        const addresses = await api.deleteAddress(id);
        set({ addresses });
      },

      setDefaultAddress: async (id) => {
        const addresses = await api.setDefaultAddress(id);
        set({ addresses });
      },

      setPincode: (pincode, city = '') => {
        set({ selectedPincode: pincode, selectedCity: city });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'desidhar_auth_storage',
      // Only the delivery PIN preference is cached locally. The user profile and
      // addresses always come back from the server.
      partialize: (state) => ({
        selectedPincode: state.selectedPincode,
        selectedCity: state.selectedCity,
      }),
    }
  )
);
