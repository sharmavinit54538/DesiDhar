import React, { useState } from 'react';
import { VegBadge } from '../common/VegBadge';
import { Badge } from '../common/Badge';
import { Zap, ZoomIn } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ImageGalleryProps {
  images: string[];
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

  const activeImage = images[activeIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col gap-3.5 select-none">
      {/* Main Image Frame with Zoom */}
      <div
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-50 border border-stone-200/90 shadow-xs cursor-crosshair group"
      >
        <img
          src={activeImage}
          alt={productName}
          className={cn(
            'w-full h-full object-cover transition-transform duration-150',
            isZoomed ? 'scale-150 origin-center' : 'scale-100'
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
        </div>

        {/* Veg badge overlay */}
        <div className="absolute top-4 right-4 z-10 bg-white/90 p-1.5 rounded-lg backdrop-blur-xs shadow-xs">
          <VegBadge size="md" showLabel />
        </div>

        {/* Hover Zoom hint */}
        <div className="absolute bottom-3 right-3 bg-stone-900/70 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Hover to Zoom</span>
        </div>
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0',
                activeIndex === idx
                  ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                  : 'border-stone-200 opacity-70 hover:opacity-100'
              )}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
