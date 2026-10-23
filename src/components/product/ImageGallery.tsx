import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import type { ProductImage } from '../../types';
import { handleImageError } from '../../utils/imageResolver';
import { cn } from '../../utils/cn';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
  category?: string;
  isDeal?: boolean;
  isFresh?: boolean;
}

/**
 * Product gallery. Photos come straight from product_images; the badge tells the
 * shopper when a tile is a category placeholder rather than a photo of this
 * exact product.
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  productName,
  category,
  isDeal = false,
  isFresh = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [brokenIds, setBrokenIds] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const safeImages = images.length > 0 ? images : [];
  const activeImage = safeImages[Math.min(activeIndex, safeImages.length - 1)];

  useEffect(() => {
    setActiveIndex(0);
  }, [productName]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullscreen(false);
      if (event.key === 'ArrowLeft') {
        setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((i) => (i + 1) % safeImages.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen, safeImages.length]);

  if (!activeImage) {
    return (
      <div className="aspect-square rounded-3xl bg-stone-100 flex items-center justify-center text-sm text-stone-500">
        No image available for this product.
      </div>
    );
  }

  const isPlaceholder =
    brokenIds[activeImage.id] === true ||
    activeImage.isVerifiedSpecific === false ||
    activeImage.type === 'placeholder';

  const goTo = (index: number) => {
    if (safeImages.length === 0) return;
    setActiveIndex((index + safeImages.length) % safeImages.length);
  };

  return (
    <>
      <div className="space-y-3">
        <div
          className="relative aspect-square bg-white rounded-3xl border border-stone-200 overflow-hidden group"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
            if (Math.abs(delta) > 50) {
              goTo(delta > 0 ? activeIndex - 1 : activeIndex + 1);
            }
            touchStartX.current = null;
          }}
        >
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {isDeal && (
              <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wide shadow">
                Deal
              </span>
            )}
            {isFresh && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wide shadow">
                Fresh
              </span>
            )}
          </div>

          {isPlaceholder && (
            <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-stone-800/85 text-white text-[10px] font-semibold">
              {brokenIds[activeImage.id]
                ? 'Image unavailable'
                : 'Category representative image'}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="w-full h-full cursor-zoom-in"
            aria-label={`Open larger image of ${productName}`}
          >
            <img
              key={activeImage.id}
              src={activeImage.src}
              srcSet={activeImage.srcset || undefined}
              sizes={activeImage.sizes || '(min-width: 1024px) 40vw, 100vw'}
              alt={activeImage.alt || productName}
              width={activeImage.width || 800}
              height={activeImage.height || 800}
              loading="eager"
              onError={(event) => {
                setBrokenIds((prev) => ({ ...prev, [activeImage.id]: true }));
                handleImageError(event, category);
              }}
              className={cn(
                'w-full h-full object-cover transition-transform duration-300',
                isZoomed ? 'scale-125' : 'group-hover:scale-[1.03]'
              )}
            />
          </button>

          <button
            type="button"
            onClick={() => setIsZoomed((value) => !value)}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 border border-stone-200 text-stone-600 hover:text-amber-700"
            aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
          >
            <Expand className="w-4 h-4" />
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border border-stone-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border border-stone-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {safeImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {safeImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'w-16 h-16 shrink-0 rounded-xl overflow-hidden border bg-white',
                  index === activeIndex
                    ? 'border-amber-500 ring-2 ring-amber-200'
                    : 'border-stone-200'
                )}
                aria-label={`View image ${index + 1} of ${safeImages.length}`}
              >
                <img
                  src={image.src}
                  alt=""
                  loading="lazy"
                  onError={(event) => handleImageError(event, category)}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white"
            aria-label="Close image viewer"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={activeImage.src}
            alt={activeImage.alt || productName}
            onError={(event) => handleImageError(event, category)}
            className="max-h-[85vh] max-w-full object-contain"
          />
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-4 p-3 rounded-full bg-white/10 text-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-4 p-3 rounded-full bg-white/10 text-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};
