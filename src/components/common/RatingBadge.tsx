import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RatingBadgeProps {
  rating: number;
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
