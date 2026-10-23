import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatINR, calculateDiscountPercent } from '../../utils/formatters';
import { RatingBadge } from '../common/RatingBadge';
import { VegBadge } from '../common/VegBadge';
import { Badge } from '../common/Badge';
import { QuantityStepper } from '../common/QuantityStepper';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useUiStore } from '../../store/uiStore';
import { Heart, ShoppingBag, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';

import {
  getPrimaryProductImage,
  getSecondaryProductImage,
  handleImageError,
  isProductAssetVerified,
} from '../../utils/imageResolver';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  // The API returns variants ordered by the catalogue's sort order.
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const primaryImage = getPrimaryProductImage(product);
  const secondaryImage = getSecondaryProductImage(product);

  const { items, addItem, updateQuantity } = useCartStore();
  const { isInWishlist, toggle: toggleWishlist, status: wishlistStatus } = useWishlistStore();
  const { addToast } = useUiStore();

  const isWishlisted = isInWishlist(product.id);

  const cartItem = activeVariant
    ? items.find((i) => i.variantId === activeVariant.id)
    : undefined;
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  if (!activeVariant) {
    return null;
  }

  const discountPercent = calculateDiscountPercent(activeVariant.mrp, activeVariant.price);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      image: primaryImage.src,
      weight: activeVariant.weight,
      price: activeVariant.price,
      mrp: activeVariant.mrp,
      maxStock: activeVariant.stock,
      isVeg: product.isVeg,
    });
    addToast(`Added ${product.name} (${activeVariant.weight}) to cart`, 'success');
  };

  const handleWishlistToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    void toggleWishlist(product);
  };

  return (
    <div
      className={cn(
        'group relative bg-white rounded-2xl border border-stone-200/80 hover:border-amber-300 hover:shadow-soft-hover transition-all duration-200 flex flex-col justify-between overflow-hidden',
        className
      )}
    >
      {/* Top Media Area */}
      <div className="relative aspect-square overflow-hidden bg-stone-50">
        <Link to={`/product/${product.slug}`} className="block w-full h-full relative">
          <img
            src={primaryImage.src}
            srcSet={primaryImage.srcset}
            sizes={primaryImage.sizes}
            alt={primaryImage.alt}
            onError={(event) => handleImageError(event, product.category)}
            loading="lazy"
            className={cn(
              'w-full h-full object-cover transition-all duration-300',
              secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
            )}
          />
          {secondaryImage && (
            <img
              src={secondaryImage.src}
              srcSet={secondaryImage.srcset}
              sizes={secondaryImage.sizes}
              alt={secondaryImage.alt}
              onError={(event) => handleImageError(event, product.category)}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.isDeal ? (
            <Badge variant="deal" size="sm">
              <Zap className="w-3 h-3 mr-0.5 fill-current" /> Deal
            </Badge>
          ) : product.isFresh ? (
            <Badge variant="fresh" size="sm">
              Fresh Today
            </Badge>
          ) : null}

          {discountPercent > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              {discountPercent}% OFF
            </span>
          )}

          {activeVariant.stock <= 0 && (
            <span className="bg-stone-900/85 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              Out of stock
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={wishlistStatus === 'loading'}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs shadow-xs flex items-center justify-center text-stone-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all z-10 disabled:opacity-60"
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-colors',
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-400'
            )}
          />
        </button>

        <div className="absolute bottom-2 left-2 z-10">
          <VegBadge size="sm" />
        </div>

        {!isProductAssetVerified(product) && (
          <span className="absolute bottom-2 right-2 z-10 text-[9px] font-semibold text-stone-500 bg-white/90 rounded px-1.5 py-0.5">
            Photo coming soon
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-stone-600 uppercase tracking-wider text-[10px]">
              {product.brand}
            </span>
            <RatingBadge rating={product.rating} reviewCount={product.reviewCount} showCount={false} />
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="block text-sm font-bold text-[#4A2C17] hover:text-amber-700 line-clamp-2 leading-snug transition-colors min-h-[38px]"
            title={product.name}
          >
            {product.name}
          </Link>

          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {product.variants.map((variant, index) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantIndex(index)}
                className={cn(
                  'px-2 py-0.5 text-[11px] rounded-md font-semibold border transition-all whitespace-nowrap',
                  selectedVariantIndex === index
                    ? 'bg-amber-100/80 border-amber-500 text-amber-950 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                )}
              >
                {variant.weight}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="mt-2.5 sm:mt-3.5 pt-2.5 sm:pt-3 border-t border-stone-100 flex items-center justify-between gap-1 sm:gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-[#4A2C17] whitespace-nowrap">
                {formatINR(activeVariant.price)}
              </span>
              {activeVariant.mrp > activeVariant.price && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through whitespace-nowrap">
                  {formatINR(activeVariant.mrp)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[9px] sm:text-[10px] text-emerald-800 font-bold truncate">
                Save {formatINR(activeVariant.mrp - activeVariant.price)}
              </span>
            )}
          </div>

          <div className="shrink-0">
            {quantityInCart > 0 ? (
              <QuantityStepper
                quantity={quantityInCart}
                max={activeVariant.stock}
                onIncrement={() => updateQuantity(activeVariant.id, quantityInCart + 1)}
                onDecrement={() => updateQuantity(activeVariant.id, quantityInCart - 1)}
                size="sm"
                showTrashOnOne
              />
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={activeVariant.stock <= 0}
                className="h-8 px-2.5 sm:px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-[11px] sm:text-xs flex items-center gap-1 shadow-xs transition-all disabled:opacity-50 disabled:bg-stone-200"
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>{activeVariant.stock > 0 ? 'ADD' : 'Out'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
