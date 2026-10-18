import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
}) => {
  const variantStyles = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 w-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-stone-200/80',
        variantStyles[variant],
        className
      )}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-3 flex flex-col gap-3 shadow-xs">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <Skeleton variant="text" className="w-2/3 h-3" />
      <Skeleton variant="text" className="w-full h-4" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="text" className="w-1/3 h-5" />
        <Skeleton className="w-20 h-8 rounded-lg" />
      </div>
    </div>
  );
};
