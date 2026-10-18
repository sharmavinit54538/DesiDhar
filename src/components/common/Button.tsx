import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

    const variants = {
      primary:
        'bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold shadow-sm hover:shadow focus:ring-amber-400 border border-amber-600/20',
      secondary:
        'bg-stone-100 hover:bg-stone-200 text-[#4A2C17] focus:ring-stone-300 border border-stone-200',
      outline:
        'border-2 border-amber-500 text-amber-700 hover:bg-amber-50 focus:ring-amber-400 font-semibold',
      ghost:
        'text-[#4A2C17] hover:bg-amber-50 hover:text-amber-800 focus:ring-amber-200',
      danger:
        'bg-red-600 hover:bg-red-700 text-white font-medium focus:ring-red-400 shadow-sm',
      gold:
        'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 font-bold shadow-md hover:shadow-lg hover:brightness-105 focus:ring-amber-400 border border-amber-300',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
