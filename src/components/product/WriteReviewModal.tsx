import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Star } from 'lucide-react';
import { api } from '../../services/api';
import { useUiStore } from '../../store/uiStore';
import type { Review } from '../../types';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onReviewAdded: (review: Review) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  onReviewAdded,
}) => {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useUiStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setError('Please provide your name and review comments.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const newReview = await api.addReview({
        productId,
        userName: name.trim(),
        userLocation: location.trim() || 'Verified Buyer',
        rating,
        comment: comment.trim(),
        verifiedPurchase: true,
        helpfulCount: 0,
      });
      onReviewAdded(newReview);
      addToast('Thank you! Your review has been published.', 'success');
      onClose();
      setName('');
      setLocation('');
      setComment('');
    } catch {
      setError('Failed to submit review.');
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
          <div className="text-xs font-normal text-stone-500 truncate max-w-sm">
            {productName}
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4A2C17] mb-1.5">
            Your Rating
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-7 h-7 ${
                    s <= rating
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-stone-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-sm font-bold text-amber-800 ml-2">
              {rating} / 5 Stars
            </span>
          </div>
        </div>

        <Input
          label="Your Name"
          placeholder="e.g. Meenakshi Sundaram"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Your City & State"
          placeholder="e.g. Bengaluru, Karnataka"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4A2C17] mb-1.5">
            Review Details
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe the aroma, texture, freshness, and packaging..."
            className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-[#4A2C17]"
            required
          />
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
