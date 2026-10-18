import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface QuantityStepperProps {
  quantity: number;
  max?: number;
  min?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTrashOnOne?: boolean;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  max = 99,
  min = 1,
  onIncrement,
  onDecrement,
  size = 'md',
  className,
  showTrashOnOne = false,
}) => {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  const sizeClasses = {
    sm: 'h-7 text-xs',
    md: 'h-9 text-sm',
    lg: 'h-11 text-base',
  };

  const btnPadding = {
    sm: 'w-7',
    md: 'w-8',
    lg: 'w-10',
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'inline-flex items-center bg-white border border-amber-500/40 rounded-xl shadow-xs overflow-hidden select-none',
        sizeClasses[size],
        className
      )}
    >
      <button
        type="button"
        disabled={isMin && !showTrashOnOne}
        onClick={(e) => {
          e.stopPropagation();
          onDecrement();
        }}
        aria-label="Decrease quantity"
        className={cn(
          'flex items-center justify-center h-full text-stone-700 hover:bg-amber-50 active:bg-amber-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors',
          btnPadding[size]
        )}
      >
        {quantity === 1 && showTrashOnOne ? (
          <Trash2 className="w-3.5 h-3.5 text-red-600" />
        ) : (
          <Minus className="w-3.5 h-3.5" />
        )}
      </button>

      <div
        className={cn(
          'flex items-center justify-center font-bold text-[#4A2C17] px-2 min-w-[28px]',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}
      >
        {quantity}
      </div>

      <button
        type="button"
        disabled={isMax}
        onClick={(e) => {
          e.stopPropagation();
          onIncrement();
        }}
        aria-label="Increase quantity"
        className={cn(
          'flex items-center justify-center h-full text-stone-700 hover:bg-amber-50 active:bg-amber-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors',
          btnPadding[size]
        )}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
