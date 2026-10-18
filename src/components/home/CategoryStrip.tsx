import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
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

export const CategoryStrip: React.FC = () => {
  return (
    <div className="bg-white border-b border-stone-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex lg:grid lg:grid-cols-10 items-center justify-start lg:justify-items-center gap-3.5 sm:gap-6 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory px-1 py-1">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || Sparkles;

            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="flex flex-col items-center group shrink-0 select-none py-1 transition-all snap-start"
              >
                {/* Circular Icon with Warm Dairy Gradient Ring */}
                <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-[#FFF8EC] group-hover:bg-amber-100 border border-amber-200/70 group-hover:border-amber-400 group-hover:shadow-xs group-hover:-translate-y-1 transition-all duration-200 flex items-center justify-center text-amber-700 relative overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end justify-center pb-1">
                    <Icon className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                </div>

                {/* Category Name */}
                <span className="text-[11px] sm:text-xs font-bold text-[#4A2C17] group-hover:text-amber-700 transition-colors mt-1.5 text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
