import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatINR, calculateDiscountPercent } from '../../utils/formatters';
import { RatingBadge } from '../common/RatingBadge';
import { VegBadge } from '../common/VegBadge';
import { Badge } from '../common/Badge';
import { QuantityStepper } from '../common/QuantityStepper';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useUiStore } from '../../store/uiStore';
import { Heart, ShoppingBag, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ProductListCardProps {
  product: Product;
}

export const ProductListCard: React.FC<ProductListCardProps> = ({ product }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const { items, addItem, updateQuantity } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToast } = useUiStore();

  const isWishlisted = isInWishlist(product.id);
  const cartItem = items.find((i) => i.variantId === activeVariant.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const discountPercent = calculateDiscountPercent(activeVariant.mrp, activeVariant.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      image: product.images[0],
      weight: activeVariant.weight,
      price: activeVariant.price,
      mrp: activeVariant.mrp,
      maxStock: activeVariant.stock,
      isVeg: product.isVeg,
    });
    addToast(`Added ${product.name} to cart`, 'success');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 hover:border-amber-300 hover:shadow-soft-hover transition-all p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      {/* Thumbnail */}
      <div className="relative w-full sm:w-44 h-44 sm:h-36 rounded-xl overflow-hidden bg-stone-50 shrink-0">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {product.isDeal ? (
            <Badge variant="deal" size="sm">
              <Zap className="w-3 h-3 mr-0.5 fill-current" /> Deal
            </Badge>
          ) : product.isFresh ? (
            <Badge variant="fresh" size="sm">
              Fresh
            </Badge>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-xs flex items-center justify-center text-stone-400 hover:text-red-500"
        >
          <Heart className={cn('w-4 h-4', isWishlisted ? 'fill-red-500 text-red-500' : '')} />
        </button>
      </div>

      {/* Middle details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <VegBadge size="sm" />
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
            {product.brand}
          </span>
          <RatingBadge rating={product.rating} reviewCount={product.reviewCount} showCount={true} />
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="text-base font-bold text-[#4A2C17] hover:text-amber-700 transition-colors line-clamp-1 font-heading"
        >
          {product.name}
        </Link>

        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Variant chips */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-stone-400">Pack:</span>
          {product.variants.map((v, idx) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVariantIndex(idx)}
              className={cn(
                'px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all whitespace-nowrap',
                selectedVariantIndex === idx
                  ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
              )}
            >
              {v.weight}
            </button>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-3 text-[11px] text-emerald-800 font-medium">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Shelf Life: {product.shelfLife}
          </span>
          <span>•</span>
          <span>{product.storage}</span>
        </div>
      </div>

      {/* Right Pricing & Actions */}
      <div className="sm:border-l sm:border-stone-100 sm:pl-5 sm:w-48 flex sm:flex-col justify-between sm:justify-center items-center sm:items-start gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-[#4A2C17]">
              {formatINR(activeVariant.price)}
            </span>
            {activeVariant.mrp > activeVariant.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatINR(activeVariant.mrp)}
              </span>
            )}
          </div>
          {discountPercent > 0 && (
            <div className="text-xs text-emerald-800 font-bold mt-0.5">
              {discountPercent}% OFF • Save {formatINR(activeVariant.mrp - activeVariant.price)}
            </div>
          )}
        </div>

        <div>
          {quantityInCart > 0 ? (
            <QuantityStepper
              quantity={quantityInCart}
              max={activeVariant.stock}
              onIncrement={() => updateQuantity(activeVariant.id, quantityInCart + 1)}
              onDecrement={() => updateQuantity(activeVariant.id, quantityInCart - 1)}
              size="md"
              showTrashOnOne
            />
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={activeVariant.stock <= 0}
              className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{activeVariant.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
