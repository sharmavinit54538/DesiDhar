import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import type { Product, Review } from '../types';
import { formatINR, calculateDiscountPercent } from '../utils/formatters';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUiStore } from '../store/uiStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
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
import { NutritionFactsTable } from '../components/product/NutritionFactsTable';
import { AllergenBadgeRow } from '../components/product/AllergenBadgeRow';
import { ProductSpecificationsTable } from '../components/product/ProductSpecificationsTable';
import { StickyActionBar } from '../components/common/StickyActionBar';
import { getProductImagesBySlug } from '../data/productImages';
import {
  Heart,
  ShoppingBag,
  Zap,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Plus,
  ArrowRight,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [frequentlyBought, setFrequentlyBought] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'desc' | 'nutrition' | 'storage' | 'reviews' | 'faqs'>('desc');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { items, addItem, updateQuantity } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToast } = useUiStore();

  useEffect(() => {
    let mounted = true;
    const loadProductData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const p = await api.getProductBySlug(slug);
        if (p && mounted) {
          setProduct(p);
          setSelectedVariantIndex(0);
          setQuantity(1);

          const [revs, rel, freq] = await Promise.all([
            api.getReviews(p.id),
            api.getRelatedProducts(p.id, p.category, 4),
            api.getFrequentlyBoughtTogether(p),
          ]);

          if (mounted) {
            setReviews(revs);
            setRelatedProducts(rel);
            setFrequentlyBought(freq);
          }
        }
      } catch (err) {
        console.error('Failed to load PDP data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProductData();
    return () => {
      mounted = false;
    };
  }, [slug]);

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

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold font-heading mb-2">Product Not Found</h2>
        <p className="text-stone-500 mb-6">The requested dairy item is unavailable or moved.</p>
        <Link to="/category/all">
          <Button variant="primary">Browse All Dairy Items</Button>
        </Link>
      </div>
    );
  }

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(activeVariant.mrp, activeVariant.price);

  const cartItem = items.find((i) => i.variantId === activeVariant.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const productImages = getProductImagesBySlug(product.slug);
  const displayImages = productImages.length > 0 ? productImages : product.images;

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        variantId: activeVariant.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        image: typeof displayImages[0] === 'string' ? displayImages[0] : displayImages[0].src,
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

  const handleReviewAdded = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
  };

  const breadcrumbs = [
    { label: 'Shop', path: '/category/all' },
    { label: product.category, path: `/category/${product.category}` },
    { label: product.name },
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} {product.hindiName ? `(${product.hindiName})` : ''} | DesiDhar Dairy</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />

        {/* Main Product Showcase (Left Media, Right Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Gallery + Quick Action Buttons */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <ImageGallery
              images={displayImages}
              productName={product.name}
              isDeal={product.isDeal}
              isFresh={product.isFresh}
            />

            {/* Desktop Action Buttons under image */}
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

          {/* Right Column: Product Specs & Options */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
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
                  onClick={() => toggleWishlist(product)}
                  className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-red-600 p-2 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
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

              {/* Highlights pills */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {product.highlights.map((hl) => (
                    <span
                      key={hl}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {hl}
                    </span>
                  ))}
                </div>
              )}

              {/* Rating link */}
              <div className="flex items-center gap-3 mt-3">
                <RatingBadge
                  rating={product.rating}
                  reviewCount={product.reviewCount}
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
                  Read all {product.reviewCount} reviews
                </button>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 font-medium">
                  FSSAI #{product.fssaiNumber || '10020011002341'}
                </span>
              </div>
            </div>

            {/* Price block */}
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
                    You Save {formatINR(activeVariant.mrp - activeVariant.price)} (Inclusive of all taxes)
                  </span>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Variant Selector (e.g. 250g / 500g / 1kg / 5L) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2C17]">
                  Select Pack Size / Weight:
                </label>
                <span className="text-xs text-stone-500">
                  Selected: <strong className="text-stone-800">{activeVariant.weight}</strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all flex flex-col items-start ${
                      selectedVariantIndex === idx
                        ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-500/10 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    <span className="text-sm">{v.weight}</span>
                    <span className="text-[11px] font-mono text-stone-500">
                      {formatINR(v.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A2C17]">
                Quantity:
              </span>
              <QuantityStepper
                quantity={quantity}
                max={activeVariant.stock}
                onIncrement={() => setQuantity((q) => Math.min(q + 1, activeVariant.stock))}
                onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                size="md"
              />
              <span className="text-xs text-stone-400">
                {activeVariant.stock > 0 ? (
                  <span className="text-emerald-700 font-semibold">● In Stock ({activeVariant.stock} available)</span>
                ) : (
                  <span className="text-red-600 font-bold">Out of stock</span>
                )}
              </span>
            </div>

            {/* Mobile Action Buttons (Visible only on mobile) */}
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

            {/* Offers Box */}
            <OffersBox />

            {/* Pincode & Delivery Box */}
            <PincodeDeliveryBox />
          </div>
        </div>

        {/* Frequently Bought Together Box */}
        {frequentlyBought.length > 0 && (
          <div className="my-12 p-6 rounded-3xl bg-amber-50/50 border border-amber-200">
            <h3 className="font-bold text-lg text-[#4A2C17] font-heading mb-1">
              Frequently Bought Together
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Customers who ordered {product.name} also added these fresh dairy staples:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-stone-200">
                <img
                  src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.src}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-xl shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#4A2C17] truncate">{product.name}</div>
                  <div className="text-xs font-extrabold text-amber-800">{formatINR(activeVariant.price)}</div>
                </div>
              </div>

              {frequentlyBought.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-200 text-stone-800 flex items-center justify-center font-bold text-xs shrink-0">
                    +
                  </div>
                  <Link
                    to={`/product/${item.slug}`}
                    className="flex-1 flex items-center gap-3 p-3 bg-white rounded-2xl border border-stone-200 hover:border-amber-400 transition-colors"
                  >
                    <img
                      src={typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.src}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#4A2C17] truncate">{item.name}</div>
                      <div className="text-xs font-extrabold text-amber-800">
                        {formatINR(item.variants[0].price)}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Tabs Area */}
        <div id="pdp-tabs" className="mt-14 scroll-mt-24">
          {/* Tab Navigation Strip */}
          <div className="flex border-b border-stone-200 overflow-x-auto no-scrollbar gap-2 sm:gap-6">
            {[
              { id: 'desc', label: 'Description & Heritage' },
              { id: 'nutrition', label: 'Ingredients & Nutrition' },
              { id: 'storage', label: 'Storage & Shelf Life' },
              { id: 'reviews', label: `Reviews (${reviews.length})` },
              { id: 'faqs', label: 'FAQs' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

          {/* Tab Content Panes */}
          <div className="py-6 sm:py-8">
            {/* Description Tab */}
            {activeTab === 'desc' && (
              <div className="space-y-6 max-w-4xl text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div>
                  <h3 className="text-lg font-bold text-[#4A2C17] font-heading mb-2">
                    The DesiDhar Authenticity Standard
                  </h3>
                  <p className="text-stone-700 leading-relaxed">{product.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                    <h4 className="font-bold text-[#4A2C17] mb-1">Untouched by Hands</h4>
                    <p className="text-xs text-stone-600">
                      Extracted via automated hygienic milking parlors and glass-bottled under strict cleanroom conditions.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                    <h4 className="font-bold text-[#4A2C17] mb-1">FSSAI Certified Pure</h4>
                    <p className="text-xs text-stone-600">
                      Standardized for optimal natural milk fat, solids-not-fat (SNF), and zero antibiotic residue.
                    </p>
                  </div>
                </div>

                {/* Flipkart/Amazon-style full specifications */}
                <ProductSpecificationsTable product={product} activeVariant={activeVariant} />
              </div>
            )}

            {/* Ingredients & Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-1">
                    Ingredients
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-800 font-medium">
                    {product.ingredients || '100% Pure Natural Farm Dairy.'}
                  </p>
                </div>

                {/* Allergen Badge Row */}
                <AllergenBadgeRow allergens={product.allergens} ingredientsText={product.ingredients} />

                {/* Nutrition Facts Table */}
                <NutritionFactsTable
                  nutrition={product.nutrition}
                  servingSize={product.category === 'milk' ? '100ml' : '100g'}
                  isSampleData={false}
                />
              </div>
            )}

            {/* Storage & Shelf Life Tab */}
            {activeTab === 'storage' && (
              <div className="space-y-4 max-w-2xl text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-[#4A2C17] mb-1">Shelf Life</h4>
                  <p className="text-stone-600">{product.shelfLife}</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-[#4A2C17] mb-1">Storage Guidelines</h4>
                  <p className="text-stone-600">{product.storage}</p>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <RatingBreakdown
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  onWriteReview={() => setIsReviewModalOpen(true)}
                />

                <div className="space-y-4 divide-y divide-stone-100">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="pt-4 first:pt-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <RatingBadge rating={rev.rating} size="sm" />
                          <span className="font-bold text-xs text-[#4A2C17]">
                            {rev.userName}
                          </span>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {rev.date}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                        {rev.comment}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-1">{rev.userLocation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
              <div className="space-y-3 max-w-3xl">
                {(product.faqs || [
                  {
                    question: 'How is this product delivered fresh?',
                    answer: 'All DesiDhar items are packed in 4°C temperature-insulated cold carriers with food-grade gel ice pads and delivered directly via our electric vans.',
                  },
                  {
                    question: 'Does this contain any preservatives or artificial colors?',
                    answer: 'No. All DesiDhar products are 100% natural, free from chemical stabilizers, thickeners, adulterants, or synthetic flavoring.',
                  },
                ]).map((faq, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <h4 className="font-bold text-xs sm:text-sm text-[#4A2C17]">
                      {faq.question}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <h3 className="text-xl font-bold font-heading text-[#4A2C17] mb-6">
              Similar Pure Dairy Products
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Action Bar */}
      <StickyActionBar
        leftContent={
          <div>
            <div className="text-[11px] text-stone-500 font-medium truncate">{activeVariant.weight}</div>
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

      {/* Write Review Modal */}
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
