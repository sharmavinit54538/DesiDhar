import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '../common/Button';

interface RatingBreakdownProps {
  rating: number;
  reviewCount: number;
  onWriteReview: () => void;
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  rating,
  reviewCount,
  onWriteReview,
}) => {
  // Approximate realistic breakdown
  const bars = [
    { stars: 5, percent: 84 },
    { stars: 4, percent: 11 },
    { stars: 3, percent: 3 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 1 },
  ];

  return (
    <div className="bg-stone-50/70 rounded-3xl p-6 border border-stone-200/80 mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Left rating summary */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left shrink-0">
        <div className="text-5xl font-extrabold text-[#4A2C17] font-heading">
          {rating.toFixed(1)}
        </div>
        <div className="flex items-center gap-1 text-amber-500 my-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 fill-current" />
          ))}
        </div>
        <div className="text-xs font-semibold text-stone-500">
          Based on {reviewCount.toLocaleString('en-IN')} verified dairy customer reviews
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onWriteReview}>
            Write a Review
          </Button>
        </div>
      </div>

      {/* Middle rating progress bars */}
      <div className="flex-1 w-full max-w-md space-y-2">
        {bars.map((item) => (
          <div key={item.stars} className="flex items-center gap-3 text-xs">
            <span className="w-8 font-bold text-stone-600 flex items-center gap-0.5 justify-end">
              <span>{item.stars}</span>
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            </span>
            <div className="flex-1 h-2.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <span className="w-10 text-stone-500 font-mono text-right">
              {item.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
