import React from 'react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-dashed border-amber-200/80 my-4',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4 ring-8 ring-amber-50/50">
          {icon}
        </div>
      )}
      <h3 className="text-lg sm:text-xl font-bold text-[#4A2C17] font-heading mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-stone-500 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
};
