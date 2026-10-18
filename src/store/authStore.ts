import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Address } from '../types';

interface AuthState {
  user: User | null;
  selectedPincode: string;
  selectedCity: string;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => void;
  setPincode: (pincode: string, city?: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => Address;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      selectedPincode: '110001',
      selectedCity: 'New Delhi',

      login: (user: User) => {
        set({ user });
      },

      logout: () => {
        set({ user: null });
      },

      updateProfile: (profile: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : null,
        }));
      },

      setPincode: (pincode: string, city = 'New Delhi') => {
        set({ selectedPincode: pincode, selectedCity: city });
      },

      addAddress: (newAddrData: Omit<Address, 'id'>) => {
        const id = `addr-${Date.now()}`;
        const newAddress: Address = {
          ...newAddrData,
          id,
        };

        const { user } = get();
        if (user) {
          let updatedAddresses = [...user.addresses];
          if (newAddress.isDefault) {
            updatedAddresses = updatedAddresses.map((a) => ({
              ...a,
              isDefault: false,
            }));
          }
          updatedAddresses.push(newAddress);
          set({ user: { ...user, addresses: updatedAddresses } });
        }

        return newAddress;
      },

      updateAddress: (id: string, updatedFields: Partial<Address>) => {
        const { user } = get();
        if (!user) return;

        let addresses = user.addresses.map((addr) => {
          if (addr.id === id) {
            return { ...addr, ...updatedFields };
          }
          if (updatedFields.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        });

        set({ user: { ...user, addresses } });
      },

      deleteAddress: (id: string) => {
        const { user } = get();
        if (!user) return;

        const remaining = user.addresses.filter((a) => a.id !== id);
        // If default was deleted, set first as default
        if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
          remaining[0].isDefault = true;
        }

        set({ user: { ...user, addresses: remaining } });
      },

      setDefaultAddress: (id: string) => {
        const { user } = get();
        if (!user) return;

        const updated = user.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }));

        set({ user: { ...user, addresses: updated } });
      },
    }),
    {
      name: 'desidhar_auth_storage',
    }
  )
);
