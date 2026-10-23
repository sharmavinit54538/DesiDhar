import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import type { Product, Review, ReviewSummary } from '../types';
import { formatINR, calculateDiscountPercent } from '../utils/formatters';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { useStorefront } from '../context/StorefrontContext';
import { ImageGallery } from '../components/product/ImageGallery';
import { RatingBadge } from '../components/common/RatingBadge';
import { VegBadge } from '../components/common/VegBadge';
import { QuantityStepper } from '../components/common/QuantityStepper';
import { Button } from '../components/common/Button';
import { OffersBox } from '../components/product/OffersBox';
import { PincodeDeliveryBox } from '../components/product/PincodeDeliveryBox';
import { RatingBreakdown } from '../components/product/RatingBreakdown';
import { WriteReviewModal } from '../components/product/WriteReviewModal';
import { ProductCard } from '../components/product/ProductCard';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { NutritionFactsTable } from '../components/product/NutritionFactsTable';
import { AllergenBadgeRow } from '../components/product/AllergenBadgeRow';
import { ProductSpecificationsTable } from '../components/product/ProductSpecificationsTable';
import { StickyActionBar } from '../components/common/StickyActionBar';
import { getPrimaryProductImage } from '../utils/imageResolver';
import {
  Heart,
  ShoppingBag,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

const EMPTY_SUMMARY: ReviewSummary = { average: null, count: 0, breakdown: {} };

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useStorefront();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>(EMPTY_SUMMARY);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [frequentlyBought, setFrequentlyBought] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'desc' | 'nutrition' | 'storage' | 'reviews' | 'faqs'>(
    'desc'
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { items, addItem, updateQuantity } = useCartStore();
  const { isInWishlist, toggle: toggleWishlist, status: wishlistStatus } = useWishlistStore();
  const { addToast, openAuthModal } = useUiStore();
  const user = useAuthStore((state) => state.user);

  const loadProduct = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const nextProduct = await api.getProductBySlug(slug);
      if (!nextProduct) {
        setProduct(null);
        setError('NOT_FOUND');
        return;
      }
      setProduct(nextProduct);
      setSelectedVariantIndex(0);
      setQuantity(1);

      const [reviewResult, related, frequent] = await Promise.all([
        api.getReviews(nextProduct.id).catch(() => ({ reviews: [], summary: EMPTY_SUMMARY })),
        api.getRelatedProducts(slug, 4).catch(() => []),
        api.getFrequentlyBought(slug, 2).catch(() => []),
      ]);

      setReviews(reviewResult.reviews);
      setSummary(reviewResult.summary);
      setRelatedProducts(related);
      setFrequentlyBought(frequent);
    } catch (err) {
      setProduct(null);
      setError(err instanceof Error ? err.message : 'This product could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error === 'NOT_FOUND') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold font-heading mb-2">Product Not Found</h2>
        <p className="text-stone-500 mb-6">
          This product is not in the live catalogue. It may have been removed by the kitchen.
        </p>
        <Link to="/category/all">
          <Button variant="primary">Browse the catalogue</Button>
        </Link>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorState
          title="This product could not be loaded"
          message={error || 'Unknown error.'}
          onRetry={() => void loadProduct()}
        />
      </div>
    );
  }

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  if (!activeVariant) return null;

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(activeVariant.mrp, activeVariant.price);
  const cartItem = items.find((item) => item.variantId === activeVariant.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const primaryImage = getPrimaryProductImage(product);

  const handleAddToCart = () => {
    addItem(
      {
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
      },
      quantity
    );
    addToast(`Added ${quantity} × ${product.name} (${activeVariant.weight}) to cart`, 'success');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleReviewAdded = (review: Review) => {
    setReviews((previous) => [review, ...previous]);
    setSummary((previous) => {
      const breakdown = { ...previous.breakdown };
      const key = String(review.rating);
      breakdown[key] = (Number(breakdown[key]) || 0) + 1;
      const count = previous.count + 1;
      const weighted = (previous.average ?? 0) * previous.count + review.rating;
      return {
        count,
        breakdown,
        average: Number((weighted / count).toFixed(1)),
      };
    });
  };

  const handleWriteReview = () => {
    if (!user) {
      openAuthModal();
      addToast('Sign in to write a review.', 'info');
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(`/category/${product.category}`);
  };

  const tabs = [
    { id: 'desc' as const, label: 'Description' },
    { id: 'nutrition' as const, label: 'Ingredients & Nutrition' },
    { id: 'storage' as const, label: 'Storage & Shelf Life' },
    { id: 'reviews' as const, label: `Reviews (${summary.count})` },
    { id: 'faqs' as const, label: 'FAQs' },
  ];

  return (
    <>
      <Helmet>
        <title>
          {product.name} {product.hindiName ? `(${product.hindiName})` : ''} | DesiDhar Dairy
        </title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-stone-700 bg-white hover:bg-amber-50 hover:text-amber-900 border border-stone-200/80 shadow-xs transition-all mb-4 cursor-pointer group"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-stone-500 group-hover:text-amber-800" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <ImageGallery
              images={product.images}
              productName={product.name}
              category={product.category}
              isDeal={product.isDeal}
              isFresh={product.isFresh}
            />

            <div className="hidden sm:grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<ShoppingBag className="w-5 h-5" />}
                onClick={handleAddToCart}
                disabled={activeVariant.stock <= 0}
              >
                {quantityInCart > 0 ? `In Cart (${quantityInCart})` : 'Add to Cart'}
              </Button>

              <Button
                variant="gold"
                size="lg"
                leftIcon={<Zap className="w-5 h-5 fill-current" />}
                onClick={handleBuyNow}
                disabled={activeVariant.stock <= 0}
              >
                Buy Now
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <VegBadge size="md" showLabel />
                  <span className="text-stone-300">|</span>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  {product.sweetType && (
                    <>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                        {product.sweetType}
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => void toggleWishlist(product)}
                  disabled={wishlistStatus === 'loading'}
                  className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-red-600 p-2 rounded-xl hover:bg-stone-100 transition-colors disabled:opacity-60"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Save'}</span>
                </button>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-[#4A2C17] font-heading tracking-tight leading-tight">
                {product.name}
                {product.hindiName && (
                  <span className="ml-2 font-medium text-stone-500 text-lg sm:text-2xl font-serif">
                    ({product.hindiName})
                  </span>
                )}
              </h1>

              {product.highlights && product.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {product.highlights.map((highlight, index) => (
                    <span
                      key={`${highlight.text}-${index}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {highlight.text}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <RatingBadge
                  rating={summary.average}
                  reviewCount={summary.count}
                  showCount={true}
                  size="md"
                />
                <span className="text-stone-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reviews');
                    document.getElementById('pdp-tabs')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline"
                >
                  {summary.count > 0 ? `Read all ${summary.count} reviews` : 'Be the first to review'}
                </button>
                {settings?.fssaiLicenseNumber && (
                  <>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      FSSAI {settings.fssaiLicenseNumber}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-[#4A2C17] font-heading">
                {formatINR(activeVariant.price)}
              </span>
              {activeVariant.mrp > activeVariant.price && (
                <>
                  <span className="text-base text-stone-400 line-through">
                    {formatINR(activeVariant.mrp)}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {discountPercent}% OFF
                  </span>
                  <span className="text-xs font-bold text-stone-600">
                    You save {formatINR(activeVariant.mrp - activeVariant.price)}
                  </span>
                </>
              )}
              <span className="text-[11px] text-stone-500">Inclusive of all taxes</span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.shortDescription}
            </p>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2C17]">
                  Pack size / weight
                </label>
                <span className="text-xs text-stone-500">
                  Selected: <strong className="text-stone-800">{activeVariant.weight}</strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantIndex(index);
                      setQuantity(1);
                    }}
                    className={`px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all flex flex-col items-start ${
                      selectedVariantIndex === index
                        ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-500/10 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    <span className="text-sm">{variant.weight}</span>
                    <span className="text-[11px] font-mono text-stone-500">
                      {formatINR(variant.price)}
                    </span>
                    {variant.stock <= 0 && (
                      <span className="text-[10px] text-red-600 font-bold">Out of stock</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A2C17]">
                Quantity:
              </span>
              <QuantityStepper
                quantity={quantity}
                max={activeVariant.stock}
                onIncrement={() => setQuantity((value) => Math.min(value + 1, activeVariant.stock))}
                onDecrement={() => setQuantity((value) => Math.max(1, value - 1))}
                size="md"
              />
              <span className="text-xs text-stone-400">
                {activeVariant.stock > 0 ? (
                  <span className="text-emerald-700 font-semibold">
                    ● In stock ({activeVariant.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-bold">Out of stock</span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:hidden pt-2">
              <Button
                variant="outline"
                size="md"
                leftIcon={<ShoppingBag className="w-4 h-4" />}
                onClick={handleAddToCart}
                disabled={activeVariant.stock <= 0}
              >
                Add to Cart
              </Button>
              <Button
                variant="gold"
                size="md"
                leftIcon={<Zap className="w-4 h-4 fill-current" />}
                onClick={handleBuyNow}
                disabled={activeVariant.stock <= 0}
              >
                Buy Now
              </Button>
            </div>

            <OffersBox />
            <PincodeDeliveryBox />
          </div>
        </div>

        {frequentlyBought.length > 0 && (
          <div className="my-12 p-6 rounded-3xl bg-amber-50/50 border border-amber-200">
            <h3 className="font-bold text-lg text-[#4A2C17] font-heading mb-1">
              Often bought with this
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Other products from the live catalogue that pair well with {product.name}.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-stone-200">
                <img
                  src={primaryImage.src}
                  alt={primaryImage.alt}
                  className="w-14 h-14 object-cover rounded-xl shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#4A2C17] truncate">{product.name}</div>
                  <div className="text-xs font-extrabold text-amber-800">
                    {formatINR(activeVariant.price)}
                  </div>
                </div>
              </div>

              {frequentlyBought.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-200 text-stone-800 flex items-center justify-center font-bold text-xs shrink-0">
                    +
                  </div>
                  <Link
                    to={`/product/${item.slug}`}
                    className="flex-1 flex items-center gap-3 p-3 bg-white rounded-2xl border border-stone-200 hover:border-amber-400 transition-colors"
                  >
                    <img
                      src={getPrimaryProductImage(item).src}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#4A2C17] truncate">{item.name}</div>
                      <div className="text-xs font-extrabold text-amber-800">
                        {item.variants[0] ? formatINR(item.variants[0].price) : '—'}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div id="pdp-tabs" className="mt-14 scroll-mt-24">
          <div className="flex border-b border-stone-200 overflow-x-auto no-scrollbar gap-2 sm:gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-600 text-amber-900 font-heading'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6 sm:py-8">
            {activeTab === 'desc' && (
              <div className="space-y-6 max-w-4xl text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div>
                  <h3 className="text-lg font-bold text-[#4A2C17] font-heading mb-2">
                    About this product
                  </h3>
                  <p className="text-stone-700 leading-relaxed">{product.description}</p>
                </div>
                <ProductSpecificationsTable product={product} activeVariant={activeVariant} />
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-1">
                    Ingredients
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-800 font-medium">
                    {product.ingredients || 'Ingredient declaration is not published for this item yet.'}
                  </p>
                </div>

                <AllergenBadgeRow ingredientsText={product.ingredients} />

                {product.nutrition && Object.keys(product.nutrition).length > 0 ? (
                  <NutritionFactsTable
                    nutrition={product.nutrition}
                    servingSize={product.category === 'milk' ? '100 ml' : '100 g'}
                  />
                ) : (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-500 text-xs">
                    Nutrition values are printed on the pack. This product has no published
                    nutrition record yet.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="space-y-4 max-w-2xl text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-[#4A2C17] mb-1">Shelf Life</h4>
                  <p className="text-stone-600">
                    {product.shelfLife || 'Refer to the date printed on the pack.'}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-[#4A2C17] mb-1">Storage Guidelines</h4>
                  <p className="text-stone-600">
                    {product.storage || 'Follow the storage instructions printed on the pack.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <RatingBreakdown summary={summary} onWriteReview={handleWriteReview} />

                {reviews.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-600">
                    No customer has reviewed this product yet. Reviews appear here only after a
                    signed-in customer submits one.
                  </div>
                ) : (
                  <div className="space-y-4 divide-y divide-stone-100">
                    {reviews.map((review) => (
                      <div key={review.id} className="pt-4 first:pt-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <RatingBadge rating={review.rating} size="sm" />
                            <span className="font-bold text-xs text-[#4A2C17]">
                              {review.userName}
                            </span>
                            {review.verifiedPurchase && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                                purchase
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {new Date(review.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                          {review.comment}
                        </p>
                        {review.userLocation && (
                          <p className="text-[11px] text-stone-400 mt-1">{review.userLocation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'faqs' && (
              <div className="space-y-3 max-w-3xl">
                {(product.faqs || []).length === 0 ? (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                    No FAQs have been published for this product. Contact customer care if you have
                    a question.
                  </div>
                ) : (
                  (product.faqs || []).map((faq) => (
                    <div
                      key={faq.question}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1"
                    >
                      <h4 className="font-bold text-xs sm:text-sm text-[#4A2C17]">{faq.question}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <h3 className="text-xl font-bold font-heading text-[#4A2C17] mb-6">
              More from this category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      <StickyActionBar
        leftContent={
          <div>
            <div className="text-[11px] text-stone-500 font-medium truncate">
              {activeVariant.weight}
            </div>
            <div className="text-base font-extrabold text-[#4A2C17] font-heading leading-tight">
              {formatINR(activeVariant.price)}
              {activeVariant.mrp > activeVariant.price && (
                <span className="text-xs text-stone-400 line-through ml-1.5 font-normal">
                  {formatINR(activeVariant.mrp)}
                </span>
              )}
            </div>
          </div>
        }
        rightAction={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
              onClick={handleAddToCart}
              disabled={activeVariant.stock <= 0}
            >
              Add
            </Button>
            <Button
              variant="gold"
              size="sm"
              leftIcon={<Zap className="w-3.5 h-3.5 fill-current" />}
              onClick={handleBuyNow}
              disabled={activeVariant.stock <= 0}
            >
              Buy Now
            </Button>
          </div>
        }
      />

      {isReviewModalOpen && (
        <WriteReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productId={product.id}
          productName={product.name}
          onReviewAdded={handleReviewAdded}
        />
      )}
    </>
  );
};
