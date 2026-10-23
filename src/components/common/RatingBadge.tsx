import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RatingBadgeProps {
  /** `null` means the product has no published reviews yet — never invent a score. */
  rating: number | null;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  reviewCount,
  size = 'sm',
  showCount = false,
  className,
}) => {
  if (rating === null || Number.isNaN(rating)) {
    return (
      <div className={cn('inline-flex items-center gap-1.5', className)}>
        <span
          className={cn(
            'inline-flex items-center gap-1 font-semibold rounded border border-stone-200 bg-stone-50 text-stone-500',
            size === 'lg'
              ? 'text-sm px-2.5 py-1'
              : size === 'md'
              ? 'text-xs px-2 py-0.5'
              : 'text-[11px] px-1.5 py-0.5'
          )}
          title="No published customer reviews yet"
        >
          <Star className="w-3 h-3" />
          <span>New</span>
        </span>
      </div>
    );
  }

  const isHigh = rating >= 4.0;
  const isMedium = rating >= 3.0 && rating < 4.0;

  const bgClass = isHigh
    ? 'bg-emerald-700 text-white'
    : isMedium
    ? 'bg-amber-600 text-white'
    : 'bg-red-600 text-white';

  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-0.5',
    md: 'text-xs px-2 py-0.5 gap-1',
    lg: 'text-sm px-2.5 py-1 gap-1',
  };

  const starSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'inline-flex items-center font-bold rounded shadow-xs',
          bgClass,
          sizeClasses[size]
        )}
      >
        <span>{rating.toFixed(1)}</span>
        <Star className={cn('fill-current', starSizes[size])} />
      </span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-stone-500 font-medium">
          ({reviewCount.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
};
