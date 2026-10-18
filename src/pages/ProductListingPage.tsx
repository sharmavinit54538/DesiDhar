import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import type { Product, Category } from '../types';
import { useFilterStore } from '../store/filterStore';
import { useUiStore } from '../store/uiStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FilterSidebar } from '../components/product/FilterSidebar';
import { SortBar } from '../components/product/SortBar';
import { ActiveFilterChips } from '../components/product/ActiveFilterChips';
import { ProductCard } from '../components/product/ProductCard';
import { ProductListCard } from '../components/product/ProductListCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Drawer } from '../components/common/Drawer';
import { PackageOpen, Sparkles } from 'lucide-react';

export const ProductListingPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const isDealOnly = searchParams.get('deal') === 'true';

  const {
    filters,
    setCategory,
    setSearchQuery,
    resetFilters,
  } = useFilterStore();

  const {
    isMobileFilterDrawerOpen,
    setMobileFilterDrawerOpen,
  } = useUiStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sync route params with filter store
  useEffect(() => {
    if (categorySlug && categorySlug !== 'all') {
      setCategory(categorySlug);
    } else {
      setCategory(undefined);
    }

    if (searchQuery) {
      setSearchQuery(searchQuery);
    } else {
      setSearchQuery('');
    }
  }, [categorySlug, searchQuery, setCategory, setSearchQuery]);

  // Fetch category info and products whenever filters change
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        if (categorySlug && categorySlug !== 'all') {
          const cat = await api.getCategoryBySlug(categorySlug);
          if (mounted) setCurrentCategory(cat);
        } else {
          if (mounted) setCurrentCategory(null);
        }

        const res = await api.getProducts({
          ...filters,
          category: categorySlug === 'all' ? undefined : categorySlug || filters.category,
          searchQuery: searchQuery || filters.searchQuery,
        });

        if (mounted) {
          let filteredList = res.products;
          if (isDealOnly) {
            filteredList = filteredList.filter((p) => p.isDeal);
          }
          setProducts(filteredList);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [categorySlug, searchQuery, isDealOnly, filters]);

  // Page title and breadcrumbs
  const pageTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : isDealOnly
    ? "Today's Special Deals"
    : currentCategory
    ? currentCategory.name
    : 'All Pure Dairy & Sweets';

  const breadcrumbs = [
    { label: 'Shop', path: '/category/all' },
    ...(currentCategory ? [{ label: currentCategory.name }] : []),
    ...(searchQuery ? [{ label: `Search: "${searchQuery}"` }] : []),
    ...(isDealOnly ? [{ label: 'Deals of the Day' }] : []),
  ];

  return (
    <>
      <Helmet>
        <title>{pageTitle} | DesiDhar Dairy &amp; Sweets</title>
        <meta
          name="description"
          content={`Browse ${pageTitle} at DesiDhar. 100% pure authentic dairy, chilled A2 milk, Vedic Bilona Ghee, fresh paneer, and sweets delivered cold-chain to your door.`}
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />

        {/* Category Header Banner (if browsing a specific category) */}
        {currentCategory && (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 border border-amber-200/80 p-6 sm:p-8 mb-6 shadow-xs">
            <div className="max-w-xl space-y-2 relative z-10">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-700" /> Farm Sourced Category
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#4A2C17] font-heading tracking-tight">
                {currentCategory.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {currentCategory.description}
              </p>
            </div>
          </div>
        )}

        {/* Search Header Banner */}
        {searchQuery && (
          <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-4 mb-6">
            <h1 className="text-lg sm:text-xl font-bold text-[#4A2C17] font-heading">
              Search Results for: <span className="text-amber-800">&ldquo;{searchQuery}&rdquo;</span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Found {products.length} matching pure dairy and mithai items.
            </p>
          </div>
        )}

        {/* Main Grid: Left Filter Sidebar + Right Products List */}
        <div className="flex gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="w-64 shrink-0 hidden lg:block bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs sticky top-28">
            <FilterSidebar />
          </aside>

          {/* Right Results Content */}
          <main className="flex-1 min-w-0">
            {/* Sort & View Bar */}
            <SortBar
              totalCount={products.length}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
              categoryTitle={currentCategory?.name}
            />

            {/* Active filter chips */}
            <ActiveFilterChips />

            {/* Products Listing Area */}
            {loading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4'
                    : 'space-y-4'
                }
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4'
                    : 'space-y-4'
                }
              >
                {products.map((product) =>
                  viewMode === 'grid' ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <ProductListCard key={product.id} product={product} />
                  )
                )}
              </div>
            ) : (
              /* Empty state */
              <EmptyState
                icon={<PackageOpen className="w-8 h-8" />}
                title="No Products Found Matching Filters"
                description="We couldn't find any dairy or sweet items that match your active criteria. Try broadening your price range or clearing filters."
                actionText="Reset All Filters"
                onAction={resetFilters}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={isMobileFilterDrawerOpen}
        onClose={() => setMobileFilterDrawerOpen(false)}
        title="Filter Dairy & Sweets"
        position="left"
      >
        <FilterSidebar onFilterChange={() => setMobileFilterDrawerOpen(false)} />
      </Drawer>
    </>
  );
};
