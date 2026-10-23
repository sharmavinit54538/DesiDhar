import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { HeroBanner } from '../../types';
import { api } from '../../services/api';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { handleImageError } from '../../utils/imageResolver';

export const HeroCarousel: React.FC = () => {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = banners.length;

  useEffect(() => {
    let active = true;
    api
      .getBanners()
      .then((items) => {
        if (!active) return;
        setBanners(items);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current, isPaused, total]);

  if (status === 'loading') {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-2 sm:mt-4">
        <Skeleton className="aspect-[16/10] sm:aspect-[21/9] w-full rounded-2xl sm:rounded-3xl" />
      </div>
    );
  }

  if (status === 'error' || banners.length === 0) {
    return null;
  }

  const activeBanner = banners[current] || banners[0];
  const nextSlide = () => setCurrent((prev) => (prev + 1) % total);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + total) % total);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-2 sm:mt-4 select-none"
    >
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-soft border border-amber-200/60 aspect-[16/10] sm:aspect-[21/9] min-h-[200px] sm:min-h-[320px] md:min-h-[380px]">
        <div key={activeBanner.id} className="absolute inset-0 animate-in fade-in duration-300">
          <div className={`absolute inset-0 bg-gradient-to-r ${activeBanner.bgGradient}`} />

          <div className="absolute right-0 top-0 bottom-0 w-2/3 md:w-1/2 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent pointer-events-none" />

          <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-12 flex items-center justify-between gap-4 sm:gap-6">
            <div className="max-w-md sm:max-w-lg space-y-1.5 sm:space-y-3.5 py-4 sm:py-6 z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 border border-amber-600/30 text-amber-900 text-[10px] sm:text-xs font-black tracking-wider uppercase backdrop-blur-xs">
                {activeBanner.badge}
              </div>

              <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-[#4A2C17] font-heading tracking-tight leading-tight">
                {activeBanner.title}
              </h2>

              <p className="text-[11px] sm:text-sm md:text-base text-stone-700 line-clamp-2 leading-relaxed">
                {activeBanner.subtitle}
              </p>

              <div className="pt-1 sm:pt-2">
                <Link to={activeBanner.link}>
                  <Button
                    variant="gold"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="shadow-md text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                  >
                    {activeBanner.buttonText}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-center shrink-0 w-28 sm:w-1/3 md:w-2/5 h-4/5 relative">
              <div className="relative w-full h-full max-h-[140px] sm:max-h-[300px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border-2 sm:border-4 border-white/80 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <img
                  src={activeBanner.image}
                  alt={activeBanner.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(event) => handleImageError(event)}
                />
                <div className="hidden sm:block absolute bottom-3 right-3 bg-stone-900/90 text-amber-300 text-xs font-black px-2.5 py-1 rounded-lg backdrop-blur-xs shadow-md">
                  {activeBanner.highlightText}
                </div>
              </div>
            </div>
          </div>
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 shadow-md items-center justify-center transition-all opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 shadow-md items-center justify-center transition-all opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    index === current ? 'w-5 sm:w-7 bg-amber-600' : 'w-1.5 sm:w-2 bg-stone-400/60 hover:bg-stone-500'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
