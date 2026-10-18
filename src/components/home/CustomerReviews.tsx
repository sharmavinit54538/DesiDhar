import React from 'react';
import { MOCK_REVIEWS } from '../../data/reviews';
import { RatingBadge } from '../common/RatingBadge';
import { CheckCircle2, Quote, ThumbsUp } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Real Kitchen Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-[#4A2C17] mt-1.5">
            Loved by 50,000+ Desi Families
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            From daily breakfast teas in Delhi to Diwali celebrations in Bengaluru.
          </p>
        </div>

        {/* Aggregate score */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs self-start sm:self-auto">
          <div className="text-3xl font-black text-[#4A2C17] font-heading">
            4.9
          </div>
          <div className="border-l border-stone-200 pl-3">
            <RatingBadge rating={4.9} size="md" />
            <div className="text-[11px] text-stone-500 mt-0.5 font-medium">
              Over 12,400+ Verified Ratings
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MOCK_REVIEWS.slice(0, 3).map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-soft-hover transition-all flex flex-col justify-between relative"
          >
            <div>
              <Quote className="w-8 h-8 text-amber-200/70 mb-2" />
              <div className="flex items-center justify-between mb-3">
                <RatingBadge rating={review.rating} size="sm" />
                <span className="text-[11px] text-stone-400 font-medium">
                  {review.date}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#4A2C17] flex items-center gap-1">
                  <span>{review.userName}</span>
                  {review.verifiedPurchase && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Customer" />
                  )}
                </h4>
                <p className="text-[11px] text-stone-400">{review.userLocation}</p>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-stone-400">
                <ThumbsUp className="w-3 h-3" />
                <span>{review.helpfulCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
