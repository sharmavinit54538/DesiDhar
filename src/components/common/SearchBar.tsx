import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import type { Category, Product } from '../../types';
import { formatINR } from '../../utils/formatters';
import { RatingBadge } from './RatingBadge';
import { getProductThumbnail, handleImageError } from '../../utils/imageResolver';
import { cn } from '../../utils/cn';
import { useStorefront } from '../../context/StorefrontContext';

const RECENT_SEARCHES_KEY = 'desidhar_recent_searches';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearchSubmit?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className,
  placeholder = 'Search for ghee, paneer, mithai…',
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{
    products: Product[];
    categories: Category[];
  }>({ products: [], categories: [] });
  const [trending, setTrending] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');
  const { categories } = useStorefront();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((term) => typeof term === 'string').slice(0, 5));
        }
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    api
      .getTrendingProducts(5)
      .then((products) => {
        if (active) setTrending(products);
      })
      .catch(() => {
        if (active) setTrending([]);
      });
    return () => {
      active = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions({ products: [], categories: [] });
      setIsLoading(false);
      setSuggestionError('');
      return;
    }

    let active = true;
    setIsLoading(true);
    setSuggestionError('');
    const timer = setTimeout(async () => {
      try {
        const res = await api.searchSuggestions(query);
        if (active) setSuggestions(res);
      } catch (error) {
        if (active) {
          setSuggestions({ products: [], categories: [] });
          setSuggestionError(
            error instanceof Error ? error.message : 'Search suggestions are unavailable.'
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }, 180);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [
      trimmed,
      ...recentSearches.filter((entry) => entry.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Storage is a convenience only; ignore quota/privacy-mode failures.
    }
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    saveRecentSearch(searchTerm);
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    if (onSearchSubmit) onSearchSubmit();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchSubmit(query);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions({ products: [], categories: [] });
    setSuggestionError('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search products and categories"
          className="w-full h-11 pl-11 pr-24 rounded-xl bg-white border border-stone-200 text-[#4A2C17] placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-xs transition-all duration-150"
        />

        <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSearchSubmit(query)}
            className="h-8 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold text-xs flex items-center gap-1 transition-colors shadow-xs"
            aria-label="Submit search"
          >
            Search
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden z-50 animate-in fade-in-50 duration-150">
          {!query.trim() ? (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem(RECENT_SEARCHES_KEY);
                      }}
                      className="text-[11px] text-stone-400 hover:text-amber-700 capitalize"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          handleSearchSubmit(term);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100/70 text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Shop by Category
                </div>
                {categories.length === 0 ? (
                  <p className="text-xs text-stone-400 py-1">Categories are loading…</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {categories.slice(0, 8).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/category/${cat.slug}`);
                        }}
                        className="p-2 rounded-xl border border-stone-100 bg-[#FFFDF9] hover:bg-amber-50 text-left text-xs font-medium text-[#4A2C17] hover:border-amber-200 transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">{cat.name}</span>
                        <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {trending.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Most ordered
                  </div>
                  <div className="divide-y divide-stone-100">
                    {trending.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/product/${product.slug}`);
                        }}
                        className="w-full flex items-center gap-3 py-2 text-left hover:bg-amber-50/50 rounded-lg px-1"
                      >
                        <img
                          src={getProductThumbnail(product)}
                          alt={product.name}
                          onError={(event) => handleImageError(event, product.category)}
                          className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="block text-xs font-semibold text-[#4A2C17] truncate">
                            {product.name}
                          </span>
                          <span className="block text-[11px] text-stone-500">
                            From {formatINR(product.variants[0]?.price ?? 0)}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {suggestions.categories.length > 0 && (
                <div className="px-4 py-2.5 bg-amber-50/50 border-b border-stone-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-stone-500 font-medium">In Categories:</span>
                  {suggestions.categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/category/${cat.slug}`);
                      }}
                      className="px-2.5 py-1 rounded-md bg-white border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-2xs"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}

              {suggestions.products.length > 0 ? (
                <div className="py-2 divide-y divide-stone-100 max-h-80 overflow-y-auto">
                  {suggestions.products.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        saveRecentSearch(prod.name);
                        setIsOpen(false);
                        navigate(`/product/${prod.slug}`);
                      }}
                      className="px-4 py-2.5 hover:bg-amber-50/60 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <img
                        src={getProductThumbnail(prod)}
                        alt={prod.name}
                        onError={(event) => handleImageError(event, prod.category)}
                        className="w-12 h-12 object-cover rounded-lg border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-stone-500 uppercase">{prod.brand}</div>
                        <div className="text-sm font-semibold text-[#4A2C17] truncate">
                          {prod.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-[#4A2C17]">
                            {formatINR(prod.variants[0]?.price ?? 0)}
                          </span>
                          {prod.variants[0] && prod.variants[0].mrp > prod.variants[0].price && (
                            <span className="text-[11px] text-stone-400 line-through">
                              {formatINR(prod.variants[0].mrp)}
                            </span>
                          )}
                          {prod.rating !== null && <RatingBadge rating={prod.rating} size="sm" />}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-300 shrink-0" />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleSearchSubmit(query)}
                    className="w-full px-4 py-3 text-center text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>See all results for &ldquo;{query}&rdquo;</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : isLoading ? (
                <div className="p-6 text-center text-xs text-stone-400">Searching products…</div>
              ) : suggestionError ? (
                <div className="p-4 text-center text-xs text-red-600">{suggestionError}</div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-stone-600 mb-2">
                    No products found matching &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-stone-400 mb-4">
                    Check the spelling or browse our categories.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {categories.slice(0, 3).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/category/${cat.slug}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 text-xs font-medium"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
