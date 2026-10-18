import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className,
  showTagline = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link
      to="/"
      className={cn('inline-flex items-center gap-2.5 group select-none', className)}
      aria-label="DesiDhar Home"
    >
      {/* Original SVG Logo: Stylized Dairy Matka & Milk Drop with Fresh Leaf */}
      <div className={cn('relative shrink-0 transition-transform group-hover:scale-105 duration-200', iconSizes[size])}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          <defs>
            <linearGradient id="logoMatkaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F59E0B" />
              <stop offset="100%" stop-color="#B45309" />
            </linearGradient>
            <linearGradient id="logoCreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="100%" stop-color="#FFF8EC" />
            </linearGradient>
          </defs>
          {/* Matka pot */}
          <ellipse cx="50" cy="30" rx="16" ry="4" fill="#4A2C17" />
          <path
            d="M38 30 C38 42 22 50 22 68 C22 84 34 88 50 88 C66 88 78 84 78 68 C78 50 62 42 62 30 Z"
            fill="url(#logoMatkaGrad)"
          />
          {/* Traditional dairy curve band */}
          <path d="M26 62 Q50 72 74 62" stroke="#FFF8EC" strokeWidth="2.5" fill="none" strokeDasharray="3,3" />
          <circle cx="50" cy="54" r="3" fill="#FFF8EC" />
          {/* Milk droplet / cream crown */}
          <path
            d="M50 14 C50 14 42 24 42 30 C42 34 45.6 37 50 37 C54.4 37 58 34 58 30 C58 24 50 14 50 14 Z"
            fill="url(#logoCreamGrad)"
            stroke="#4A2C17"
            strokeWidth="1.5"
          />
          {/* Green leaf for pure & veg freshness */}
          <path d="M64 26 C66 20 74 20 74 20 C74 20 74 28 67 29 Z" fill="#2E7D32" />
        </svg>
      </div>

      {/* Brand Wordmark & Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none">
          <span className={cn('font-heading font-extrabold text-[#4A2C17]', textSizes[size])}>
            Desi
          </span>
          <span className={cn('font-heading font-extrabold text-amber-500', textSizes[size])}>
            Dhar
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 ml-1 mb-1" />
        </div>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] font-medium text-amber-800 tracking-wide mt-0.5 whitespace-nowrap">
            Khaalis Desi, Seedha Ghar Tak
          </span>
        )}
      </div>
    </Link>
  );
};
