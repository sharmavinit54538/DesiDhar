import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-xs text-stone-500 overflow-x-auto py-2 no-scrollbar', className)}
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-amber-700 transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-stone-400 shrink-0" />
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="hover:text-amber-700 transition-colors truncate max-w-[150px] shrink-0"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'truncate max-w-[200px] shrink-0 font-medium',
                  isLast ? 'text-[#4A2C17]' : 'text-stone-500'
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
