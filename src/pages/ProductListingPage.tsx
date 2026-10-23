import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import type { Category, Product, ProductFacets } from '../types';
import { useFilterStore } from '../store/filterStore';
import { useUiStore } from '../store/uiStore';
import { FilterSidebar } from '../components/product/FilterSidebar';
import { SortBar } from '../components/product/SortBar';
import { ActiveFilterChips } from '../components/product/ActiveFilterChips';
import { ProductCard } from '../components/product/ProductCard';
import { ProductListCard } from '../components/product/ProductListCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Drawer } from '../components/common/Drawer';
import { PackageOpen, Sparkles, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 12;

export const ProductListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const isDealOnly = searchParams.get('deal') === 'true';
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);

  const { filters, setCategory, setSearchQuery, resetFilters, getActiveFilterCount } =
    useFilterStore();
  const { isMobileFilterDrawerOpen, setMobileFilterDrawerOpen } = useUiStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<ProductFacets | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [facetsLoading, setFacetsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Route params are the source of truth for category / search term.
  useEffect(() => {
    setCategory(categorySlug && categorySlug !== 'all' ? categorySlug : undefined);
    setSearchQuery(searchQuery);
  }, [categorySlug, searchQuery, setCategory, setSearchQuery]);

  useEffect(() => {
    let active = true;
    setFacetsLoading(true);
    api
      .getFacets()
      .then((nextFacets) => {
        if (active) setFacets(nextFacets);
      })
      .catch(() => {
        if (active) setFacets(null);
      })
      .finally(() => {
        if (active) setFacetsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [category, result] = await Promise.all([
          categorySlug && categorySlug !== 'all'
            ? api.getCategoryBySlug(categorySlug)
            : Promise.resolve(null),
          api.getProducts({
            category: categorySlug && categorySlug !== 'all' ? categorySlug : undefined,
            searchQuery: searchQuery || undefined,
            brands: filters.brands,
            weights: filters.weights,
            dietary: filters.dietary,
            minRating: filters.minRating,
            minDiscount: filters.minDiscount,
            inStockOnly: filters.inStockOnly,
            sortBy: filters.sortBy,
            minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
            maxPrice: filters.priceRange[1] < 100000 ? filters.priceRange[1] : undefined,
            deal: isDealOnly || undefined,
            page,
            pageSize: PAGE_SIZE,
          }),
        ]);

        if (!active) return;
        setCurrentCategory(category);
        setProducts(result.products);
        setTotal(result.total);
        if (result.facets) setFacets(result.facets);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : 'Products could not be loaded. Please try again.'
        );
        setProducts([]);
        setTotal(0);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [
    categorySlug,
    searchQuery,
    isDealOnly,
    page,
    filters.brands,
    filters.weights,
    filters.dietary,
    filters.minRating,
    filters.minDiscount,
    filters.inStockOnly,
    filters.sortBy,
    filters.priceRange,
    reloadKey,
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const goToPage = useCallback(
    (nextPage: number) => {
      const next = new URLSearchParams(searchParams);
      if (nextPage <= 1) next.delete('page');
      else next.set('page', String(nextPage));
      setSearchParams(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchParams, setSearchParams]
  );

  // Any filter change should reset pagination.
  const activeFilterCount = getActiveFilterCount();
  useEffect(() => {
    if (page !== 1 && activeFilterCount > 0) {
      const next = new URLSearchParams(searchParams);
      next.delete('page');
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilterCount, filters.sortBy]);

  const pageTitle = useMemo(() => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (isDealOnly) return "Today's Deals";
    if (currentCategory) return currentCategory.name;
    return 'All Pure Dairy & Sweets';
  }, [searchQuery, isDealOnly, currentCategory]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle} | DesiDhar Dairy &amp; Sweets</title>
        <meta
          name="description"
          content={`Browse ${pageTitle} at DesiDhar. Live prices, availability and delivery slots.`}
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-stone-700 bg-white hover:bg-amber-50 hover:text-amber-900 border border-stone-200/80 shadow-xs transition-all mb-4 cursor-pointer group"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-stone-500 group-hover:text-amber-800" />
          <span>Back</span>
        </button>

        {currentCategory && (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 border border-amber-200/80 p-6 sm:p-8 mb-6 shadow-xs">
            <div className="max-w-xl space-y-2 relative z-10">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-700" /> Category
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

        {searchQuery && (
          <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-4 mb-6">
            <h1 className="text-lg sm:text-xl font-bold text-[#4A2C17] font-heading">
              Search Results for: <span className="text-amber-800">&ldquo;{searchQuery}&rdquo;</span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {loading ? 'Searching the catalogue…' : `${total} matching items found.`}
            </p>
          </div>
        )}

        <div className="flex gap-6 items-start">
          <aside className="w-64 shrink-0 hidden lg:block bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs sticky top-28">
            <FilterSidebar facets={facets} facetsLoading={facetsLoading} />
          </aside>

          <main className="flex-1 min-w-0">
            <SortBar
              totalCount={total}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
              categoryTitle={currentCategory?.name}
            />

            <ActiveFilterChips />

            {loading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
                    : 'space-y-4'
                }
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <ErrorState
                title="We couldn’t load this catalogue"
                message={error}
                onRetry={() => setReloadKey((key) => key + 1)}
              />
            ) : products.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
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

                {pageCount > 1 && (
                  <nav
                    className="flex items-center justify-center gap-2 mt-8"
                    aria-label="Pagination"
                  >
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => goToPage(page - 1)}
                      className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 disabled:opacity-40 hover:border-amber-400 transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: pageCount }, (_, index) => index + 1)
                      .filter(
                        (pageNumber) =>
                          pageNumber === 1 ||
                          pageNumber === pageCount ||
                          Math.abs(pageNumber - page) <= 1
                      )
                      .map((pageNumber, index, list) => (
                        <React.Fragment key={pageNumber}>
                          {index > 0 && pageNumber - list[index - 1] > 1 && (
                            <span className="text-xs text-stone-400">…</span>
                          )}
                          <button
                            type="button"
                            onClick={() => goToPage(pageNumber)}
                            className={`min-w-9 h-9 px-2 rounded-xl text-xs font-bold border transition-colors ${
                              pageNumber === page
                                ? 'bg-amber-500 border-amber-600 text-stone-950'
                                : 'bg-white border-stone-200 text-stone-600 hover:border-amber-400'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        </React.Fragment>
                      ))}
                    <button
                      type="button"
                      disabled={page >= pageCount}
                      onClick={() => goToPage(page + 1)}
                      className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 disabled:opacity-40 hover:border-amber-400 transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <EmptyState
                icon={<PackageOpen className="w-8 h-8" />}
                title="No products match these filters"
                description="Try widening the price range or clearing a filter. The catalogue shows only products that are currently listed."
                actionText="Reset all filters"
                onAction={() => {
                  resetFilters();
                  const next = new URLSearchParams(searchParams);
                  next.delete('page');
                  setSearchParams(next);
                }}
              />
            )}
          </main>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-18 left-1/2 -translate-x-1/2 z-30 flex items-center bg-stone-900/90 backdrop-blur-md text-white rounded-full p-1 shadow-2xl border border-stone-700">
        <button
          type="button"
          onClick={() => setMobileFilterDrawerOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold hover:text-amber-300 transition-colors"
        >
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <span className="w-px h-4 bg-stone-600" />
        <button
          type="button"
          onClick={() => {
            const selectEl = document.getElementById('sort-select');
            if (selectEl) {
              selectEl.scrollIntoView({ behavior: 'smooth' });
              selectEl.focus();
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold hover:text-amber-300 transition-colors"
        >
          <span>Sort</span>
        </button>
      </div>

      <Drawer
        isOpen={isMobileFilterDrawerOpen}
        onClose={() => setMobileFilterDrawerOpen(false)}
        title="Filter Dairy & Sweets"
        position="left"
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                resetFilters();
                setMobileFilterDrawerOpen(false);
              }}
              className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => setMobileFilterDrawerOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-colors shadow-xs"
            >
              Show {total} {total === 1 ? 'item' : 'items'}
            </button>
          </div>
        }
      >
        <FilterSidebar facets={facets} facetsLoading={facetsLoading} />
      </Drawer>
    </>
  );
};
