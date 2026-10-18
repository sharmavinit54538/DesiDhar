import React from 'react';
import { useFilterStore } from '../../store/filterStore';
import { SortOption } from '../../types';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

interface SortBarProps {
  totalCount: number;
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
  categoryTitle?: string;
}

export const SortBar: React.FC<SortBarProps> = ({
  totalCount,
  viewMode,
  onToggleViewMode,
  categoryTitle,
}) => {
  const { filters, setSortBy, getActiveFilterCount } = useFilterStore();
  const { setMobileFilterDrawerOpen } = useUiStore();
  const activeFilterCount = getActiveFilterCount();

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Customer Rating', value: 'rating' },
    { label: 'Biggest Discount', value: 'discount' },
    { label: 'Newest First', value: 'newest' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 mb-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Result Count & Category Title */}
      <div className="flex items-center justify-between">
        <div className="text-xs sm:text-sm font-semibold text-stone-600">
          Showing <span className="font-bold text-[#4A2C17]">{totalCount}</span> {totalCount === 1 ? 'item' : 'items'}
          {categoryTitle && (
            <span> in <span className="font-bold text-amber-800">{categoryTitle}</span></span>
          )}
        </div>

        {/* Mobile Filter Button trigger */}
        <button
          type="button"
          onClick={() => setMobileFilterDrawerOpen(true)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Sorting & Grid/List controls */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-semibold text-stone-500 whitespace-nowrap hidden md:inline">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs font-bold text-[#4A2C17] bg-[#FFFDF9] border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid/List View Toggle */}
        <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 p-0.5">
          <button
            type="button"
            onClick={() => onToggleViewMode('grid')}
            aria-label="Grid view"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-amber-700 shadow-2xs font-bold'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleViewMode('list')}
            aria-label="List view"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-amber-700 shadow-2xs font-bold'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
