import React from 'react';
import { Link } from 'react-router-dom';
import { useStorefront } from '../../context/StorefrontContext';
import { Skeleton } from '../common/Skeleton';
import { handleImageError } from '../../utils/imageResolver';
import {
  Milk,
  Flame,
  Cookie,
  Layers,
  Droplet,
  CupSoda,
  Disc,
  Sparkles,
  PackageCheck,
  Gift,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Milk,
  Flame,
  Cookie,
  Layers,
  Droplet,
  CupSoda,
  Disc,
  Sparkles,
  PackageCheck,
  Gift,
};

/**
 * Category shortcuts rendered from `GET /api/categories`. Counts and imagery are
 * database values; nothing here is a static list.
 */
export const CategoryStrip: React.FC = () => {
  const { categories, status } = useStorefront();

  if (status === 'loading') {
    return (
      <div className="bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <Skeleton key={index} className="h-16 w-16 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="bg-white border-b border-stone-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex lg:grid lg:grid-cols-10 items-center justify-start lg:justify-items-center gap-3.5 sm:gap-6 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory px-1 py-1">
          {categories.map((category) => {
            const Icon = ICON_MAP[category.iconName] || Sparkles;

            return (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="flex flex-col items-center group shrink-0 select-none py-1 transition-all snap-start"
              >
                <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-[#FFF8EC] group-hover:bg-amber-100 border border-amber-200/70 group-hover:border-amber-400 group-hover:shadow-xs group-hover:-translate-y-1 transition-all duration-200 flex items-center justify-center text-amber-700 relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    onError={(event) => handleImageError(event, category.slug)}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end justify-center pb-1">
                    <Icon className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                </div>

                <span className="text-[11px] sm:text-xs font-bold text-[#4A2C17] group-hover:text-amber-700 transition-colors mt-1.5 text-center whitespace-nowrap">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
