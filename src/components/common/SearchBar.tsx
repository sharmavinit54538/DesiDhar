import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import type { Product, Category } from '../../types';
import { formatINR } from '../../utils/formatters';
import { RatingBadge } from './RatingBadge';
import { cn } from '../../utils/cn';

const RECENT_SEARCHES_KEY = 'desidhar_recent_searches';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearchSubmit?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className,
  placeholder = 'Search "A2 Bilona Ghee", "Fresh Paneer", "Kaju Katli"...',
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{
    products: Product[];
    categories: Category[];
  }>({ products: [], categories: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        setRecentSearches(['A2 Ghee', 'Fresh Paneer', 'Matka Dahi', 'Kaju Katli']);
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions({ products: [], categories: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.searchSuggestions(query);
        setSuggestions(res);
      } catch (e) {
        console.error('Search suggestion error', e);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    saveRecentSearch(searchTerm);
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    if (onSearchSubmit) onSearchSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions({ products: [], categories: [] });
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search products and categories"
          className="w-full h-11 pl-11 pr-24 rounded-xl bg-white border border-stone-200 text-[#4A2C17] placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-xs transition-all duration-150"
        />

        {/* Search Icon */}
        <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />

        {/* Action icons right: clear or submit button */}
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

      {/* Dropdown Suggestions Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden z-50 animate-in fade-in-50 duration-150">
          {/* Query is empty: Show Recent Searches & Popular Tags */}
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
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
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

              {/* Popular categories quick jump */}
              <div>
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular Dairy Categories
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'A2 Desi Ghee', slug: 'ghee' },
                    { label: 'Fresh Paneer', slug: 'paneer' },
                    { label: 'White Makkhan', slug: 'butter' },
                    { label: 'Kaju Katli', slug: 'mithai' },
                  ].map((cat, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/category/${cat.slug}`);
                      }}
                      className="p-2 rounded-xl border border-stone-100 bg-[#FFFDF9] hover:bg-amber-50 text-left text-xs font-medium text-[#4A2C17] hover:border-amber-200 transition-colors flex items-center justify-between"
                    >
                      <span>{cat.label}</span>
                      <ArrowRight className="w-3 h-3 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Query has text: Live suggestions */
            <div>
              {/* Category suggestions */}
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

              {/* Product suggestions */}
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
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-12 h-12 object-cover rounded-lg border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-stone-500 uppercase">
                          {prod.brand}
                        </div>
                        <div className="text-sm font-semibold text-[#4A2C17] truncate">
                          {prod.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-[#4A2C17]">
                            {formatINR(prod.variants[0].price)}
                          </span>
                          <span className="text-[11px] text-stone-400 line-through">
                            {formatINR(prod.variants[0].mrp)}
                          </span>
                          <RatingBadge rating={prod.rating} size="sm" />
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
              ) : !isLoading ? (
                /* No matching products */
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-stone-600 mb-2">
                    No dairy or sweets found matching &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-stone-400 mb-4">
                    Check spelling or try popular categories like Ghee, Paneer, Milk, Mithai.
                  </p>
                  <div className="flex justify-center gap-2">
                    {['Bilona Ghee', 'Malai Paneer', 'Matka Dahi'].map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setQuery(sample);
                          handleSearchSubmit(sample);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 text-xs font-medium"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Loading state */
                <div className="p-6 text-center text-xs text-stone-400">
                  Searching dairy farms...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
