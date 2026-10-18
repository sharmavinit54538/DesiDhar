import React, { useState, useEffect, useRef } from 'react';
import type { ProductImage } from '../../types';
import { VegBadge } from '../common/VegBadge';
import { Badge } from '../common/Badge';
import {
  Zap,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ImageGalleryProps {
  images: (string | ProductImage)[];
  productName: string;
  isDeal?: boolean;
  isFresh?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  productName,
  isDeal,
  isFresh,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const getSrc = (img: string | ProductImage): string => {
    return typeof img === 'string' ? img : img.src;
  };

  const getAlt = (img: string | ProductImage, idx: number): string => {
    if (typeof img === 'string') return `${productName} view ${idx + 1}`;
    return img.alt || `${productName} view ${idx + 1}`;
  };

  const getAttribution = (img: string | ProductImage) => {
    if (typeof img === 'string') return null;
    return img.attribution;
  };

  const activeImage = images[activeIndex] || images[0];
  const activeSrc = getSrc(activeImage);
  const activeAlt = getAlt(activeImage, activeIndex);
  const activeAttribution = getAttribution(activeImage);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, isLightboxOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (deltaX > 45) {
        prevImage();
      } else if (deltaX < -45) {
        nextImage();
      }
      touchStartX.current = null;
    }
  };

  return (
    <div className="flex flex-col gap-3.5 select-none">
      {/* Main Image Frame with Zoom & Swipe */}
      <div
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsLightboxOpen(true)}
        className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-50 border border-stone-200/90 shadow-xs cursor-pointer group"
      >
        <img
          src={activeSrc}
          alt={activeAlt}
          className={cn(
            'w-full h-full object-cover transition-transform duration-150',
            isZoomed ? 'scale-135 origin-center' : 'scale-100'
          )}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
        />

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isDeal && (
            <Badge variant="deal" size="md">
              <Zap className="w-3.5 h-3.5 mr-1 fill-current" /> Deal of the Day
            </Badge>
          )}
          {isFresh && (
            <Badge variant="fresh" size="md">
              Fresh Morning Stock
            </Badge>
          )}
          <span className="bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
            100% Real Photo
          </span>
        </div>

        {/* Veg badge overlay */}
        <div className="absolute top-4 right-4 z-10 bg-white/90 p-1.5 rounded-lg backdrop-blur-xs shadow-xs">
          <VegBadge size="md" showLabel />
        </div>

        {/* Lightbox Trigger Hint */}
        <div className="absolute bottom-3 right-3 bg-stone-900/75 text-white text-[11px] font-semibold px-2.5 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Click for Lightbox</span>
          <span className="sm:hidden">Tap to Zoom</span>
        </div>

        {/* Mobile Swipe Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous photo"
              className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-stone-700 shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next photo"
              className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-stone-700 shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Mobile Dot Indicators */}
        {images.length > 1 && (
          <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  idx === activeIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/60'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails list (Desktop & Tablet) */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {images.map((img, idx) => {
            const src = getSrc(img);
            const isSelected = activeIndex === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  'relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0',
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xs scale-102'
                    : 'border-stone-200 opacity-70 hover:opacity-100 hover:border-amber-300'
                )}
              >
                <img src={src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Image Attribution Notice (Clean, non-intrusive) */}
      {activeAttribution && (
        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 px-1">
          <Camera className="w-3.5 h-3.5 text-stone-400" />
          <span>
            Photo by <strong>{activeAttribution.photographer}</strong> • {activeAttribution.license}
          </span>
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white pb-3 border-b border-stone-800">
            <div>
              <h3 className="text-sm sm:text-base font-bold truncate">{productName}</h3>
              <p className="text-xs text-stone-400">
                Image {activeIndex + 1} of {images.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close Lightbox"
              className="w-10 h-10 rounded-full bg-stone-800/80 hover:bg-stone-700 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central High-Res Image with Nav Arrows */}
          <div className="relative w-full max-w-4xl max-h-[75vh] flex items-center justify-center my-auto">
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous"
              className="absolute left-2 sm:-left-12 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-stone-900 flex items-center justify-center backdrop-blur-xs transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={activeSrc}
              alt={activeAlt}
              className="max-h-[72vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next"
              className="absolute right-2 sm:-right-12 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-stone-900 flex items-center justify-center backdrop-blur-xs transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 max-w-2xl">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  'w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0',
                  activeIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                    : 'border-stone-700 opacity-60 hover:opacity-100'
                )}
              >
                <img src={getSrc(img)} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
