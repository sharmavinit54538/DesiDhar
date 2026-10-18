import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
  className?: string;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'left',
  className,
  footer,
}) => {
  const touchStartCoord = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = {
    left: 'left-0 top-0 bottom-0 w-full max-w-[85vw] sm:max-w-sm border-r animate-in slide-in-from-left duration-200',
    right: 'right-0 top-0 bottom-0 w-full max-w-[85vw] sm:max-w-sm border-l animate-in slide-in-from-right duration-200',
    bottom: 'bottom-0 left-0 right-0 max-h-[88dvh] rounded-t-3xl border-t animate-in slide-in-from-bottom duration-200',
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartCoord.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartCoord.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartCoord.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartCoord.current.y;

    if (position === 'bottom' && deltaY > 60) {
      onClose();
    } else if (position === 'left' && deltaX < -60) {
      onClose();
    } else if (position === 'right' && deltaX > 60) {
      onClose();
    }

    touchStartCoord.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          'fixed bg-white shadow-2xl flex flex-col z-10 border-stone-200',
          positionClasses[position],
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag pill for bottom drawer */}
        {position === 'bottom' && (
          <div className="pt-3 pb-1 flex justify-center">
            <div className="w-12 h-1.5 rounded-full bg-stone-300" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 bg-[#FFFDF9] shrink-0 pt-safe">
          <div className="font-bold text-[#4A2C17] text-base font-heading">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>

        {/* Optional Footer with safe-area padding */}
        {footer && (
          <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
