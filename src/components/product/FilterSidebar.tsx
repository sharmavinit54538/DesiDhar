import React from 'react';
import { useFilterStore } from '../../store/filterStore';
import { CATEGORIES } from '../../data/categories';
import { RatingBadge } from '../common/RatingBadge';
import { RotateCcw, Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface FilterSidebarProps {
  onFilterChange?: () => void;
}

const BRANDS = ['DesiDhar Farm', 'DesiDhar Vedic', 'DesiDhar Shuddh'];
const WEIGHT_OPTIONS = ['200g', '250g', '400g', '500g', '1 kg', '1 Litre', '2 Litres', '5 Litres'];
const DIETARY_TAGS = ['A2 Pure', 'Organic', 'Grass-fed', 'Vedic Bilona', 'Fresh Today', 'High Protein', 'Bestseller'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const {
    filters,
    setCategory,
    setPriceRange,
    toggleBrand,
    toggleWeight,
    setMinRating,
    setMinDiscount,
    toggleDietary,
    setInStockOnly,
    resetFilters,
    getActiveFilterCount,
  } = useFilterStore();

  const activeCount = getActiveFilterCount();

  const handlePriceChange = (val: number) => {
    setPriceRange([filters.priceRange[0], val]);
    if (onFilterChange) onFilterChange();
  };

  return (
    <div className="space-y-6 text-sm text-[#4A2C17]">
      {/* Title & Clear Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base font-heading">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          Category
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setCategory(undefined);
              if (onFilterChange) onFilterChange();
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
              !filters.category
                ? 'bg-amber-100 text-amber-950 font-bold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>All Categories</span>
            {!filters.category && <Check className="w-3.5 h-3.5 text-amber-700" />}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategory(cat.slug);
                if (onFilterChange) onFilterChange();
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                filters.category === cat.slug
                  ? 'bg-amber-100 text-amber-950 font-bold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>{cat.name}</span>
              {filters.category === cat.slug && (
                <Check className="w-3.5 h-3.5 text-amber-700" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">
            Price Range
          </h4>
          <span className="text-xs font-bold text-amber-800 font-mono">
            Up to {formatINR(filters.priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="8000"
          step="50"
          value={filters.priceRange[1]}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono">
          <span>₹50</span>
          <span>₹8,000</span>
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          DesiDhar Heritage Lines
        </h4>
        <div className="space-y-2">
          {BRANDS.map((brand) => {
            const isChecked = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 text-xs font-medium text-stone-700 cursor-pointer select-none hover:text-stone-900"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    toggleBrand(brand);
                    if (onFilterChange) onFilterChange();
                  }}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Pack Size / Weight Filter */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          Pack Size &amp; Weight
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {WEIGHT_OPTIONS.map((w) => {
            const isSelected = filters.weights.includes(w);
            return (
              <button
                key={w}
                type="button"
                onClick={() => {
                  toggleWeight(w);
                  if (onFilterChange) onFilterChange();
                }}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                  isSelected
                    ? 'bg-amber-100 border-amber-500 text-amber-950 shadow-2xs'
                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setMinRating(filters.minRating === r ? 0 : r);
                if (onFilterChange) onFilterChange();
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs font-medium transition-colors ${
                filters.minRating === r
                  ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <RatingBadge rating={r} size="sm" />
                <span>&amp; above</span>
              </div>
              {filters.minRating === r && <Check className="w-3.5 h-3.5 text-amber-700" />}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Discount */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          Discount
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {[10, 15, 20].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setMinDiscount(filters.minDiscount === d ? 0 : d);
                if (onFilterChange) onFilterChange();
              }}
              className={`p-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                filters.minDiscount === d
                  ? 'bg-amber-500 text-stone-950 border-amber-600 font-bold'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {d}% or more
            </button>
          ))}
        </div>
      </div>

      {/* Dietary & Ayurvedic Tags */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          Purity &amp; Dietary Tags
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {DIETARY_TAGS.map((tag) => {
            const isSelected = filters.dietary.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  toggleDietary(tag);
                  if (onFilterChange) onFilterChange();
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-emerald-300'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* In stock only toggle */}
      <div className="pt-3 border-t border-stone-200">
        <label className="flex items-center justify-between text-xs font-bold text-stone-700 cursor-pointer select-none">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              if (onFilterChange) onFilterChange();
            }}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
          />
        </label>
      </div>
    </div>
  );
};
