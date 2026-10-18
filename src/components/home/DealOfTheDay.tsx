import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { Flame, Clock, ArrowRight } from 'lucide-react';

interface DealOfTheDayProps {
  products: Product[];
}

export const DealOfTheDay: React.FC<DealOfTheDayProps> = ({ products }) => {
  // Countdown timer: ends at midnight or 7 hours from now
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-4 sm:p-6 shadow-deal text-white">
        {/* Deal Header with Live Countdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-amber-200">
              <Flame className="w-7 h-7 fill-current animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-red-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Limited Time
                </span>
                <span className="text-xs text-amber-100 font-semibold">
                  Up to 25% OFF
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white mt-0.5">
                Deal of the Day
              </h2>
            </div>
          </div>

          {/* Countdown timer pill */}
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-200">
              <Clock className="w-4 h-4" />
              <span>Ends in:</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-sm">
              <span className="bg-white/20 px-2 py-1 rounded-md">
                {formatDigit(timeLeft.hours)}
              </span>
              <span>:</span>
              <span className="bg-white/20 px-2 py-1 rounded-md">
                {formatDigit(timeLeft.minutes)}
              </span>
              <span>:</span>
              <span className="bg-white/20 px-2 py-1 rounded-md text-amber-300">
                {formatDigit(timeLeft.seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Deals Footer Link */}
        <div className="mt-5 text-center">
          <Link
            to="/category/all?deal=true"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white hover:text-amber-200 transition-colors bg-white/15 hover:bg-white/25 px-5 py-2 rounded-xl backdrop-blur-xs"
          >
            <span>View All Today&apos;s Deals &amp; Steals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
