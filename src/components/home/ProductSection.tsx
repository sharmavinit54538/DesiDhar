import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  products: Product[];
  viewAllLink?: string;
  className?: string;
  bgWhite?: boolean;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  icon,
  badge,
  products,
  viewAllLink,
  className,
  bgWhite = false,
}) => {
  if (products.length === 0) return null;

  return (
    <section
      className={cn(
        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10',
        bgWhite && 'bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          {badge && (
            <span className="inline-block text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider mb-1">
              {badge}
            </span>
          )}
          <div className="flex items-center gap-2">
            {icon && <span className="text-amber-600">{icon}</span>}
            <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-[#4A2C17]">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors shrink-0 group self-start sm:self-auto"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Grid: 2 cols on mobile, 3 tablet, 4 laptop, 5 large desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
