import { create } from 'zustand';
import { FilterState, SortOption } from '../types';

interface FilterStoreState {
  filters: FilterState;
  setCategory: (category: string | undefined) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleBrand: (brand: string) => void;
  toggleWeight: (weight: string) => void;
  setMinRating: (rating: number) => void;
  setMinDiscount: (discount: number) => void;
  toggleDietary: (tag: string) => void;
  setInStockOnly: (inStock: boolean) => void;
  setSortBy: (sortBy: SortOption) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  getActiveFilterCount: () => number;
}

const initialFilters: FilterState = {
  category: undefined,
  priceRange: [0, 8000],
  brands: [],
  weights: [],
  minRating: 0,
  minDiscount: 0,
  dietary: [],
  inStockOnly: false,
  sortBy: 'relevance',
  searchQuery: '',
};

export const useFilterStore = create<FilterStoreState>((set, get) => ({
  filters: { ...initialFilters },

  setCategory: (category) => {
    set((state) => ({
      filters: { ...state.filters, category },
    }));
  },

  setPriceRange: (priceRange) => {
    set((state) => ({
      filters: { ...state.filters, priceRange },
    }));
  },

  toggleBrand: (brand) => {
    set((state) => {
      const exists = state.filters.brands.includes(brand);
      const brands = exists
        ? state.filters.brands.filter((b) => b !== brand)
        : [...state.filters.brands, brand];
      return { filters: { ...state.filters, brands } };
    });
  },

  toggleWeight: (weight) => {
    set((state) => {
      const exists = state.filters.weights.includes(weight);
      const weights = exists
        ? state.filters.weights.filter((w) => w !== weight)
        : [...state.filters.weights, weight];
      return { filters: { ...state.filters, weights } };
    });
  },

  setMinRating: (minRating) => {
    set((state) => ({
      filters: { ...state.filters, minRating },
    }));
  },

  setMinDiscount: (minDiscount) => {
    set((state) => ({
      filters: { ...state.filters, minDiscount },
    }));
  },

  toggleDietary: (tag) => {
    set((state) => {
      const exists = state.filters.dietary.includes(tag);
      const dietary = exists
        ? state.filters.dietary.filter((t) => t !== tag)
        : [...state.filters.dietary, tag];
      return { filters: { ...state.filters, dietary } };
    });
  },

  setInStockOnly: (inStockOnly) => {
    set((state) => ({
      filters: { ...state.filters, inStockOnly },
    }));
  },

  setSortBy: (sortBy) => {
    set((state) => ({
      filters: { ...state.filters, sortBy },
    }));
  },

  setSearchQuery: (searchQuery) => {
    set((state) => ({
      filters: { ...state.filters, searchQuery },
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        ...initialFilters,
        // preserve category if set
        category: get().filters.category,
      },
    });
  },

  getActiveFilterCount: () => {
    const f = get().filters;
    let count = 0;
    if (f.brands.length > 0) count += f.brands.length;
    if (f.weights.length > 0) count += f.weights.length;
    if (f.minRating > 0) count += 1;
    if (f.minDiscount > 0) count += 1;
    if (f.dietary.length > 0) count += f.dietary.length;
    if (f.inStockOnly) count += 1;
    if (f.priceRange[0] > 0 || f.priceRange[1] < 8000) count += 1;
    return count;
  },
}));
