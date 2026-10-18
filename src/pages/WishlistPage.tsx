import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useWishlistStore } from '../store/wishlistStore';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Heart, Trash2 } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearWishlist } = useWishlistStore();

  const breadcrumbs = [{ label: 'My Wishlist' }];

  return (
    <>
      <Helmet>
        <title>My Wishlist ({items.length}) | DesiDhar Pure Dairy</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-heading text-[#4A2C17] flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <span>My Wishlist</span>
              <span className="text-xs sm:text-sm font-semibold text-stone-500">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Saved pure dairy essentials and festive sweets to order anytime.
            </p>
          </div>

          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-600" />}
              onClick={clearWishlist}
            >
              Clear All
            </Button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="w-10 h-10 text-stone-400" />}
            title="Your Wishlist is Empty"
            description="Explore our authentic Gir cow A2 milk, Vedic Bilona Ghee, fresh paneer, and sweets to save your favorites."
            actionText="Explore Marketplace"
            onAction={() => navigate('/category/all')}
          />
        )}
      </div>
    </>
  );
};
