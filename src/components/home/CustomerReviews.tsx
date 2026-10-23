import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Review } from '../../types';
import { RatingBadge } from '../common/RatingBadge';
import { Skeleton } from '../common/Skeleton';
import { CheckCircle2, Quote, ThumbsUp } from 'lucide-react';

/**
 * Shows the most recent customer-submitted reviews. Until real customers review a
 * product this section displays an honest empty state — no testimonial content is
 * fabricated.
 */
export const CustomerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api
      .getFeaturedReviews(3)
      .then((items) => {
        if (!active) return;
        setReviews(items);
        setStatus('ready');
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Reviews could not be loaded.');
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Verified Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-[#4A2C17] mt-1.5">
            What our customers say
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Reviews are published by customers after signing in. Nothing is written on their behalf.
          </p>
        </div>
      </div>

      {status === 'loading' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-56 w-full rounded-3xl" />
          ))}
        </div>
      ) : status === 'error' ? (
        <div className="p-6 rounded-2xl bg-white border border-stone-200 text-sm text-stone-600">
          {error}
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#FFF8EC] border border-dashed border-amber-200 text-center">
          <h3 className="font-bold text-[#4A2C17] font-heading">No customer reviews yet</h3>
          <p className="text-xs text-stone-500 mt-1">
            Once customers receive their orders they can share a review from the product page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-soft-hover transition-all flex flex-col justify-between relative"
            >
              <div>
                <Quote className="w-8 h-8 text-amber-200/70 mb-2" />
                <div className="flex items-center justify-between mb-3">
                  <RatingBadge rating={review.rating} size="sm" />
                  <span className="text-[11px] text-stone-400 font-medium">
                    {new Date(review.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
                {review.productName && (
                  <p className="text-[11px] text-stone-400 mt-2">on {review.productName}</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#4A2C17] flex items-center gap-1">
                    <span>{review.userName}</span>
                    {review.verifiedPurchase && (
                      <span title="Verified purchase" className="inline-flex">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    )}
                  </h4>
                  {review.userLocation && (
                    <p className="text-[11px] text-stone-400">{review.userLocation}</p>
                  )}
                </div>

                {review.helpfulCount > 0 && (
                  <div className="flex items-center gap-1 text-[11px] text-stone-400">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{review.helpfulCount}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
