import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { calculateDiscountPercent } from '../../utils/formatters';

interface DealOfTheDayProps {
  products: Product[];
  endsAt: string | null;
}

function getRemaining(endsAt: string | null) {
  if (!endsAt) return null;
  const diff = new Date(endsAt).getTime() - Date.now();
  if (!Number.isFinite(diff) || diff <= 0) return null;
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

/**
 * The countdown is driven by the earliest `deal_ends_at` stored in the database.
 * When the promotion window closes the section disappears — no resetting or
 * invented urgency.
 */
export const DealOfTheDay: React.FC<DealOfTheDayProps> = ({ products, endsAt }) => {
  const [remaining, setRemaining] = useState(() => getRemaining(endsAt));

  useEffect(() => {
    setRemaining(getRemaining(endsAt));
    if (!endsAt) return;
    const timer = setInterval(() => setRemaining(getRemaining(endsAt)), 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const maxDiscount = useMemo(() => {
    let best = 0;
    for (const product of products) {
      for (const variant of product.variants) {
        best = Math.max(best, calculateDiscountPercent(variant.mrp, variant.price));
      }
    }
    return best;
  }, [products]);

  if (products.length === 0 || !remaining) return null;

  const formatDigit = (value: number) => String(value).padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-4 sm:p-6 shadow-deal text-white">
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
                {maxDiscount > 0 && (
                  <span className="text-xs text-amber-100 font-semibold">
                    Up to {maxDiscount}% OFF
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white mt-0.5">
                Deal of the Day
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-200">
              <Clock className="w-4 h-4" />
              <span>Ends in:</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-sm">
              <span className="bg-white/20 px-2 py-1 rounded-md">{formatDigit(remaining.hours)}</span>
              <span>:</span>
              <span className="bg-white/20 px-2 py-1 rounded-md">
                {formatDigit(remaining.minutes)}
              </span>
              <span>:</span>
              <span className="bg-white/20 px-2 py-1 rounded-md text-amber-300">
                {formatDigit(remaining.seconds)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-5 text-center">
          <Link
            to="/category/all?deal=true"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white hover:text-amber-200 transition-colors bg-white/15 hover:bg-white/25 px-5 py-2 rounded-xl backdrop-blur-xs"
          >
            <span>View all current deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
