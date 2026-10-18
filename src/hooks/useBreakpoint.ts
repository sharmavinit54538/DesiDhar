import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface BreakpointInfo {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean; // < 768px
  isTablet: boolean; // >= 768px && < 1024px
  isLaptop: boolean; // >= 1024px && < 1280px
  isDesktop: boolean; // >= 1024px
  isWide: boolean; // >= 1440px
  isTouch: boolean;
}

function getBreakpoint(width: number): Breakpoint {
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  if (width < 1440) return 'xl';
  return '2xl';
}

export function useBreakpoint(): BreakpointInfo {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const width = dimensions.width;
  const height = dimensions.height;
  const bp = getBreakpoint(width);
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return {
    width,
    height,
    breakpoint: bp,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isLaptop: width >= 1024 && width < 1280,
    isDesktop: width >= 1024,
    isWide: width >= 1440,
    isTouch,
  };
}
