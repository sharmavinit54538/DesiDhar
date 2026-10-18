import React from 'react';
import { cn } from '../../utils/cn';

interface VegBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const VegBadge: React.FC<VegBadgeProps> = ({
  className,
  size = 'sm',
  showLabel = false,
}) => {
  const boxSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <div className={cn('inline-flex items-center gap-1.5 shrink-0', className)} title="100% Vegetarian">
      <div
        className={cn(
          'border border-emerald-600 rounded-[3px] flex items-center justify-center p-[2px] bg-white',
          boxSize
        )}
      >
        <div className={cn('rounded-full bg-emerald-600', dotSize)} />
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold text-emerald-800 tracking-wide uppercase">
          100% Pure Veg
        </span>
      )}
    </div>
  );
};
