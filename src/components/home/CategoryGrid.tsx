import React from 'react';
import { Link } from 'react-router-dom';
import { useStorefront } from '../../context/StorefrontContext';
import { Skeleton } from '../common/Skeleton';
import { handleImageError } from '../../utils/imageResolver';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { categories, status, error } = useStorefront();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3 text-amber-600" /> Shop by Category
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-[#4A2C17]">
          Explore DesiDhar
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Live catalogue counts, straight from our product database.
        </p>
      </div>

      {status === 'loading' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <Skeleton key={index} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : status === 'error' ? (
        <p className="text-center text-sm text-stone-500">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-sm text-stone-500">
          No categories are available yet. Please check back shortly.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-stone-200/80 bg-white hover:border-amber-400 hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={(event) => handleImageError(event, cat.slug)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                  <span className="text-[10px] font-bold bg-amber-500/90 text-stone-950 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {cat.itemCount} {cat.itemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-bold text-sm text-[#4A2C17] group-hover:text-amber-700 transition-colors font-heading truncate">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{cat.tagline}</p>

                <div className="mt-2 flex items-center text-xs font-bold text-amber-600 group-hover:text-amber-700 transition-colors gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
