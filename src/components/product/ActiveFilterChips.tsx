import React from 'react';
import { useFilterStore } from '../../store/filterStore';
import { X } from 'lucide-react';

export const ActiveFilterChips: React.FC = () => {
  const {
    filters,
    resetFilters,
    toggleBrand,
    toggleWeight,
    setMinRating,
    setMinDiscount,
    toggleDietary,
    setInStockOnly,
    setPriceRange,
  } = useFilterStore();

  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.brands.length > 0) {
    filters.brands.forEach((brand) => {
      chips.push({
        label: `Brand: ${brand}`,
        onRemove: () => toggleBrand(brand),
      });
    });
  }

  if (filters.weights.length > 0) {
    filters.weights.forEach((w) => {
      chips.push({
        label: `Size: ${w}`,
        onRemove: () => toggleWeight(w),
      });
    });
  }

  if (filters.minRating > 0) {
    chips.push({
      label: `Rating: ${filters.minRating}★ & above`,
      onRemove: () => setMinRating(0),
    });
  }

  if (filters.minDiscount > 0) {
    chips.push({
      label: `Discount: ${filters.minDiscount}%+`,
      onRemove: () => setMinDiscount(0),
    });
  }

  if (filters.dietary.length > 0) {
    filters.dietary.forEach((tag) => {
      chips.push({
        label: tag,
        onRemove: () => toggleDietary(tag),
      });
    });
  }

  if (filters.inStockOnly) {
    chips.push({
      label: 'In Stock Only',
      onRemove: () => setInStockOnly(false),
    });
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) {
    chips.push({
      label: `₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`,
      onRemove: () => setPriceRange([0, 100000]),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs font-semibold text-stone-500">Active Filters:</span>
      {chips.map((chip, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-950 border border-amber-200 text-xs font-medium"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="text-amber-700 hover:text-amber-950 p-0.5 rounded-full hover:bg-amber-100 transition-colors"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={resetFilters}
        className="text-xs font-bold text-red-600 hover:text-red-700 ml-1 underline transition-colors"
      >
        Clear All
      </button>
    </div>
  );
};
