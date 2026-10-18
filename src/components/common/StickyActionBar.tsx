import React from 'react';
import { cn } from '../../utils/cn';

export interface StickyActionBarProps {
  children?: React.ReactNode;
  leftContent?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
  desktopHidden?: boolean;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  children,
  leftContent,
  rightAction,
  className,
  desktopHidden = true,
}) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_16px_rgba(74,44,23,0.08)] px-4 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]',
        desktopHidden && 'md:hidden',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {children ? (
          children
        ) : (
          <>
            <div className="min-w-0 flex-1">{leftContent}</div>
            <div className="shrink-0 flex items-center gap-2">{rightAction}</div>
          </>
        )}
      </div>
    </div>
  );
};
