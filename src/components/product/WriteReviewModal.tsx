import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Star } from 'lucide-react';
import { api } from '../../services/api';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { ApiError } from '../../services/apiClient';
import type { Review } from '../../types';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onReviewAdded: (review: Review) => void;
}

/**
 * Reviews are tied to a signed-in customer. The server records the reviewer and
 * decides `verifiedPurchase` from real order history, so nothing here can fake it.
 */
export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  onReviewAdded,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { addToast, openAuthModal } = useUiStore();
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      onClose();
      openAuthModal();
      return;
    }
    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters so your review is useful.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const review = await api.addReview({ productId, rating, comment: comment.trim() });
      onReviewAdded(review);
      addToast('Your review has been submitted.', 'success');
      onClose();
      setComment('');
      setRating(5);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Please sign in to submit a review.');
      } else if (err instanceof ApiError && err.code === 'REVIEW_EXISTS') {
        setError('You have already reviewed this product.');
      } else {
        setError(err instanceof Error ? err.message : 'Your review could not be submitted.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div>
          <div className="text-base font-bold text-[#4A2C17]">Write a Review</div>
          <div className="text-xs font-normal text-stone-500 truncate max-w-sm">{productName}</div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!user && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            Sign in with your mobile number to publish a review. Reviews are linked to your account.
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4A2C17] mb-1.5">
            Your Rating
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} out of 5`}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-sm font-bold text-amber-800 ml-2">{rating} / 5</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4A2C17] mb-1.5">
            Review Details
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Tell other customers about the taste, packaging and delivery experience."
            className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-[#4A2C17]"
            required
            minLength={10}
            maxLength={1200}
          />
          <p className="text-[11px] text-stone-400 mt-1">{comment.trim().length} / 1200 characters</p>
        </div>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="md" isLoading={submitting} type="submit">
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};
