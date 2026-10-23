import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { Heart, Trash2, LogIn } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, status, error, load, clear } = useWishlistStore();
  const user = useAuthStore((state) => state.user);
  const sessionChecked = useAuthStore((state) => state.sessionChecked);
  const { openAuthModal } = useUiStore();

  useEffect(() => {
    if (!user) return;
    void load();
  }, [user, load]);

  const breadcrumbs = [{ label: 'My Wishlist' }];

  if (sessionChecked && !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 text-center shadow-xs">
          <LogIn className="w-10 h-10 text-amber-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold font-heading text-[#4A2C17]">
            Sign in to see your wishlist
          </h1>
          <p className="text-sm text-stone-500 mt-2 mb-6">
            Your wishlist is saved to your account and available on any device.
          </p>
          <Button variant="gold" onClick={() => openAuthModal()}>
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Wishlist | DesiDhar</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between pb-3 border-b border-stone-200 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-heading text-[#4A2C17] flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <span>My Wishlist</span>
              <span className="text-xs sm:text-sm font-semibold text-stone-500">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">Products you have saved for later.</p>
          </div>

          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-600" />}
              onClick={() => void clear()}
            >
              Clear All
            </Button>
          )}
        </div>

        {status === 'loading' && items.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <Skeleton key={index} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        ) : status === 'error' ? (
          <ErrorState
            title="Your wishlist could not be loaded"
            message={error || 'Please try again.'}
            onRetry={() => void load()}
          />
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="w-10 h-10 text-stone-400" />}
            title="Your wishlist is empty"
            description="Tap the heart on any product to save it here."
            actionText="Browse the catalogue"
            onAction={() => navigate('/category/all')}
          />
        )}
      </div>
    </>
  );
};
