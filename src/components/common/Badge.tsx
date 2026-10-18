import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  variant?: 'bestseller' | 'deal' | 'fresh' | 'pure' | 'discount' | 'neutral' | 'festive';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className,
  size = 'sm',
}) => {
  const variants = {
    bestseller: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
    deal: 'bg-red-50 text-red-700 border-red-200 font-bold',
    fresh: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
    pure: 'bg-orange-50 text-orange-800 border-orange-200 font-semibold',
    discount: 'bg-emerald-600 text-white font-bold',
    festive: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center border transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
