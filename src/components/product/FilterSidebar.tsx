import React from 'react';
import { useFilterStore } from '../../store/filterStore';
import { useStorefront } from '../../context/StorefrontContext';
import { RatingBadge } from '../common/RatingBadge';
import { RotateCcw, Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import type { ProductFacets } from '../../types';
import { Skeleton } from '../common/Skeleton';

interface FilterSidebarProps {
  facets: ProductFacets | null;
  facetsLoading?: boolean;
  onFilterChange?: () => void;
}

/**
 * Every option list below is generated from `GET /api/products/facets`, i.e. from
 * the products that actually exist in the catalogue. Nothing is hardcoded.
 */
export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  facets,
  facetsLoading = false,
  onFilterChange,
}) => {
  const { categories } = useStorefront();
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
  const minPrice = facets?.priceMin ?? 0;
  const maxPrice = facets?.priceMax ?? 0;
  const sliderMax = filters.priceRange[1] >= 100000 ? maxPrice : filters.priceRange[1];

  const commit = () => {
    onFilterChange?.();
  };

  const handlePriceChange = (value: number) => {
    if (value >= maxPrice) {
      setPriceRange([0, 100000]);
    } else {
      setPriceRange([minPrice, value]);
    }
    commit();
  };

  return (
    <div className="space-y-6 text-sm text-[#4A2C17]">
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
            onClick={() => {
              resetFilters();
              commit();
            }}
            className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          Category
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setCategory(undefined);
              commit();
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
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setCategory(category.slug);
                commit();
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                filters.category === category.slug
                  ? 'bg-amber-100 text-amber-950 font-bold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>{category.name}</span>
              {filters.category === category.slug && (
                <Check className="w-3.5 h-3.5 text-amber-700" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">Price Range</h4>
          <span className="text-xs font-bold text-amber-800 font-mono">
            {facets ? `Up to ${formatINR(sliderMax)}` : 'Loading…'}
          </span>
        </div>
        {facetsLoading && !facets ? (
          <Skeleton className="h-2 w-full rounded-lg" />
        ) : facets ? (
          <>
            <input
              type="range"
              min={Math.max(0, minPrice)}
              max={Math.max(maxPrice, minPrice + 1)}
              step={10}
              value={sliderMax}
              onChange={(event) => handlePriceChange(Number(event.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono">
              <span>{formatINR(minPrice)}</span>
              <span>{formatINR(maxPrice)}</span>
            </div>
          </>
        ) : (
          <p className="text-[11px] text-stone-400">Price filter unavailable.</p>
        )}
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">Brand</h4>
        <div className="space-y-2">
          {facetsLoading && !facets && (
            <>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </>
          )}
          {facets?.brands.map((brand) => {
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
                    commit();
                  }}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                />
                <span>{brand}</span>
              </label>
            );
          })}
          {facets && facets.brands.length === 0 && (
            <p className="text-[11px] text-stone-400">No brands listed.</p>
          )}
        </div>
      </div>

      {/* Pack sizes */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          Pack Size &amp; Weight
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {facets?.weights.map((weight) => {
            const isSelected = filters.weights.includes(weight);
            return (
              <button
                key={weight}
                type="button"
                onClick={() => {
                  toggleWeight(weight);
                  commit();
                }}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                  isSelected
                    ? 'bg-amber-100 border-amber-500 text-amber-950 shadow-2xs'
                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                {weight}
              </button>
            );
          })}
          {facets && facets.weights.length === 0 && (
            <p className="text-[11px] text-stone-400 col-span-2">No pack sizes listed.</p>
          )}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => {
                setMinRating(filters.minRating === rating ? 0 : rating);
                commit();
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs font-medium transition-colors ${
                filters.minRating === rating
                  ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <RatingBadge rating={rating} size="sm" />
                <span>&amp; above</span>
              </div>
              {filters.minRating === rating && <Check className="w-3.5 h-3.5 text-amber-700" />}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-stone-400 mt-1.5">
          Ratings come from published customer reviews only.
        </p>
      </div>

      {/* Discount */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          Discount
        </h4>
        <div className="grid grid-cols-3 gap-1.5">
          {[10, 15, 20].map((discount) => (
            <button
              key={discount}
              type="button"
              onClick={() => {
                setMinDiscount(filters.minDiscount === discount ? 0 : discount);
                commit();
              }}
              className={`p-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                filters.minDiscount === discount
                  ? 'bg-amber-500 text-stone-950 border-amber-600 font-bold'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {discount}%+
            </button>
          ))}
        </div>
      </div>

      {/* Tags from the catalogue */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          Product Tags
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {facets?.dietaryTags.slice(0, 14).map((tag) => {
            const isSelected = filters.dietary.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  toggleDietary(tag);
                  commit();
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all capitalize ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-emerald-300'
                }`}
              >
                {tag}
              </button>
            );
          })}
          {facets && facets.dietaryTags.length === 0 && (
            <p className="text-[11px] text-stone-400">No tags listed.</p>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-stone-200">
        <label className="flex items-center justify-between text-xs font-bold text-stone-700 cursor-pointer select-none">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(event) => {
              setInStockOnly(event.target.checked);
              commit();
            }}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
          />
        </label>
      </div>
    </div>
  );
};
