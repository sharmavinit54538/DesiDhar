import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCartStore } from '../store/cartStore';
import { CartItemRow } from '../components/cart/CartItemRow';
import { FreeDeliveryBar } from '../components/cart/FreeDeliveryBar';
import { CouponBox } from '../components/cart/CouponBox';
import { PriceBreakdown } from '../components/cart/PriceBreakdown';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ShoppingBag, ArrowLeft, Bookmark, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    savedForLater,
    updateQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    removeSavedForLater,
    getItemCount,
    getPricing,
  } = useCartStore();

  const cartCount = getItemCount();
  const pricing = getPricing();

  const breadcrumbs = [{ label: 'Shopping Cart' }];

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10" />}
          title="Your Dairy Cart is Empty"
          description="Looks like you haven't added any fresh A2 milk, Vedic Bilona Ghee, or Shuddh Mithai yet. Explore our morning fresh batches!"
          actionText="Explore Fresh Dairy"
          onAction={() => navigate('/category/all')}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart ({cartCount} Items) | DesiDhar</title>
        <meta
          name="description"
          content="Review items in your DesiDhar cart. Enjoy free cold-chain delivery on orders above ₹499."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />

        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <h1 className="text-xl sm:text-2xl font-black font-heading text-[#4A2C17] flex items-center gap-2">
            <span>My Shopping Cart</span>
            <span className="text-sm font-semibold text-stone-500">
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </h1>

          <Link
            to="/category/all"
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* 2-Column Layout: Left Line Items + Right Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free delivery progress bar */}
            {items.length > 0 && (
              <FreeDeliveryBar currentTotal={pricing.mrpTotal - pricing.discount} />
            )}

            {/* Active Items Card */}
            {items.length > 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 bg-stone-50/60 border-b border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600 uppercase tracking-wider">
                  <span>Farm Items</span>
                  <span>Quantity &amp; Subtotal</span>
                </div>

                <div className="divide-y divide-stone-100">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.variantId}
                      item={item}
                      onUpdateQuantity={(qty) => updateQuantity(item.variantId, qty)}
                      onRemove={() => removeItem(item.variantId)}
                      onSaveForLater={() => saveForLater(item.variantId)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white rounded-3xl border border-stone-200 text-center text-xs text-stone-500">
                All active items have been moved to &ldquo;Saved for Later&rdquo;.
              </div>
            )}

            {/* Saved For Later Section */}
            {savedForLater.length > 0 && (
              <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-4 mt-6">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-bold text-sm text-[#4A2C17] font-heading">
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  <span>Saved for Later ({savedForLater.length})</span>
                </div>

                <div className="divide-y divide-stone-100">
                  {savedForLater.map((item) => (
                    <div
                      key={item.variantId}
                      className="py-3.5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-[#4A2C17]">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-stone-500">
                            {item.weight} • {formatINR(item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveToCart(item.variantId)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-colors"
                        >
                          Move to Cart
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSavedForLater(item.variantId)}
                          className="text-stone-400 hover:text-red-600 text-xs font-semibold p-1.5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Coupon & Price Details */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            {/* Coupon Box */}
            <CouponBox />

            {/* Price Breakdown */}
            <PriceBreakdown
              pricing={pricing}
              itemCount={cartCount}
              onCheckout={() => navigate('/checkout')}
              isCheckoutDisabled={items.length === 0}
            />
          </div>
        </div>
      </div>
    </>
  );
};
