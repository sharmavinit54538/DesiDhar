import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  className?: string;
  fullScreenOnMobile?: boolean;
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'md',
  showCloseButton = true,
  className,
  fullScreenOnMobile = false,
}) => {
  const touchStartY = useRef<number | null>(null);

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

  const maxWidthClasses = {
    sm: 'md:max-w-sm',
    md: 'md:max-w-md',
    lg: 'md:max-w-lg',
    xl: 'md:max-w-xl',
    '2xl': 'md:max-w-2xl',
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current !== null) {
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      // If user swiped down more than 75px, close the bottom sheet
      if (deltaY > 75) {
        onClose();
      }
      touchStartY.current = null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet (Mobile) / Dialog (Desktop) Container */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          // Mobile: Bottom sheet sliding from bottom
          'relative w-full z-10 bg-white border-t border-stone-200 md:border md:border-amber-100 shadow-2xl flex flex-col',
          fullScreenOnMobile
            ? 'h-[100dvh] rounded-none'
            : 'max-h-[88dvh] rounded-t-3xl md:rounded-2xl',
          'animate-in slide-in-from-bottom duration-250 md:duration-200 md:zoom-in-95',
          // Desktop: Centered box
          'md:mx-auto md:max-h-[85vh] md:w-full',
          maxWidthClasses[maxWidth],
          className
        )}
      >
        {/* Swipe drag handle (visible only on mobile bottom sheet) */}
        {!fullScreenOnMobile && (
          <div
            className="md:hidden pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1.5 rounded-full bg-stone-300" />
          </div>
        )}

        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-stone-100 bg-[#FFFDF9] shrink-0">
            <div className="min-w-0 pr-2">
              {title && (
                <h3 className="text-base sm:text-lg font-bold text-[#4A2C17] font-heading truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{subtitle}</p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 overscroll-contain">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-5 sm:px-6 py-3.5 bg-stone-50/80 border-t border-stone-100 pb-[calc(0.875rem+env(safe-area-inset-bottom))] md:pb-3.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
