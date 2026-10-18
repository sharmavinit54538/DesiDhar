import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'left',
  className,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const positionClasses = {
    left: 'left-0 top-0 bottom-0 w-full max-w-xs sm:max-w-sm border-r animate-in slide-in-from-left duration-200',
    right: 'right-0 top-0 bottom-0 w-full max-w-xs sm:max-w-sm border-l animate-in slide-in-from-right duration-200',
    bottom: 'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl border-t animate-in slide-in-from-bottom duration-200',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          'fixed bg-white shadow-2xl flex flex-col z-10 border-stone-200',
          positionClasses[position],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-[#FFFDF9]">
          <div className="font-bold text-[#4A2C17] text-base font-heading">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
};
