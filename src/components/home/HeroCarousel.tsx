import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HERO_BANNERS } from '../../data/banners';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = HERO_BANNERS.length;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (isPaused) return;

    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, isPaused, total]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 select-none"
    >
      <div className="relative rounded-3xl overflow-hidden shadow-soft border border-amber-200/60 aspect-[21/9] min-h-[260px] sm:min-h-[340px] md:min-h-[380px]">
        {HERO_BANNERS.map((banner, index) => {
          const isActive = index === current;

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background with custom gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} transition-colors`}
              />

              {/* Decorative dairy shapes */}
              <div className="absolute right-0 top-0 bottom-0 w-2/3 md:w-1/2 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent pointer-events-none" />

              <div className="relative h-full max-w-6xl mx-auto px-6 sm:px-12 flex items-center justify-between gap-6">
                {/* Banner Text Content */}
                <div className="max-w-lg space-y-2 sm:space-y-4 py-6 z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-600/30 text-amber-900 text-[11px] sm:text-xs font-black tracking-wider uppercase backdrop-blur-xs">
                    {banner.badge}
                  </div>

                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#4A2C17] font-heading tracking-tight leading-tight">
                    {banner.title}
                  </h2>

                  <p className="text-xs sm:text-base text-stone-700 line-clamp-2 leading-relaxed">
                    {banner.subtitle}
                  </p>

                  <div className="pt-2">
                    <Link to={banner.link}>
                      <Button
                        variant="gold"
                        size="md"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="shadow-md text-xs sm:text-sm"
                      >
                        {banner.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Banner Hero Image */}
                <div className="hidden sm:flex items-center justify-center shrink-0 w-1/3 md:w-2/5 h-4/5 relative">
                  <div className="relative w-full h-full max-h-[300px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Floating Highlight Tag */}
                    <div className="absolute bottom-3 right-3 bg-stone-900/90 text-amber-300 text-xs font-black px-2.5 py-1 rounded-lg backdrop-blur-xs shadow-md">
                      {banner.highlightText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Next/Prev Controls */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 shadow-md flex items-center justify-center transition-all opacity-75 hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 shadow-md flex items-center justify-center transition-all opacity-75 hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_BANNERS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? 'w-7 bg-amber-600' : 'w-2 bg-stone-400/60 hover:bg-stone-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
