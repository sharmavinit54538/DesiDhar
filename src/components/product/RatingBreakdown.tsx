import React from 'react';
import { Star } from 'lucide-react';
import type { ReviewSummary } from '../../types';
import { Button } from '../common/Button';

interface RatingBreakdownProps {
  summary: ReviewSummary;
  onWriteReview: () => void;
}

/**
 * Ratings come from published reviews only. When there are none yet we say so
 * instead of seeding an average or a review count.
 */
export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ summary, onWriteReview }) => {
  const rows = [5, 4, 3, 2, 1];
  const total = summary.count;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 rounded-2xl bg-[#FFF8EC] border border-amber-200/70">
      <div className="text-center sm:border-r border-amber-200/70 sm:pr-4">
        <div className="text-4xl font-black font-heading text-[#4A2C17]">
          {summary.average === null ? '—' : summary.average.toFixed(1)}
        </div>
        <div className="flex items-center justify-center gap-0.5 mt-1">
          {rows.map((rating) => (
            <Star
              key={rating}
              className={`w-3.5 h-3.5 ${
                summary.average !== null && rating <= Math.round(summary.average)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-stone-300'
              }`}
            />
          ))}
        </div>
        <p className="text-[11px] text-stone-500 mt-1">
          {total === 0
            ? 'No reviews yet'
            : `${total} customer review${total === 1 ? '' : 's'}`}
        </p>
        <Button variant="outline" size="sm" className="mt-3" onClick={onWriteReview}>
          Write a review
        </Button>
      </div>

      <div className="sm:col-span-2 space-y-1.5">
        {rows.map((rating) => {
          const count = summary.breakdown[String(rating)] ?? 0;
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={rating} className="flex items-center gap-2 text-xs">
              <span className="w-8 font-bold text-stone-700">{rating}★</span>
              <div className="flex-1 h-2 rounded-full bg-white border border-amber-200/70 overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${percent}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className="w-8 text-right text-stone-500">{count}</span>
            </div>
          );
        })}
        {total === 0 && (
          <p className="text-[11px] text-stone-500 pt-2">
            Be the first to review this product. Reviews are written by signed-in customers.
          </p>
        )}
      </div>
    </div>
  );
};
