import type { Product, ProductImage } from '../types';
import { PRODUCT_IMAGES, type EnrichedProductImage } from '../data/productImages';

export interface ResolvedProductImage {
  id: string;
  src: string;
  srcset?: string;
  sizes?: string;
  alt: string;
  type: 'main' | 'closeup' | 'packaging' | 'serving' | 'size-reference' | 'category-fallback' | 'placeholder';
  isMain: boolean;
  order: number;
  width?: number;
  height?: number;
  isVerifiedSpecific: boolean;
  assetStatus: 'verified_authentic' | 'pending_studio_shot';
  source: 'local' | 'remote' | 'fallback';
}

const DEFAULT_FALLBACK_SVG = '/images/placeholders/product-placeholder.svg';

/**
 * Normalizes an image path or URL safely
 */
export function normalizeImagePath(src: string): string {
  if (!src) return DEFAULT_FALLBACK_SVG;
  // If it's already a full remote URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  // If it starts with slash, ensure clean formatting
  if (src.startsWith('/')) {
    return src;
  }
  // If relative path without slash, prepend slash
  return `/${src}`;
}

/**
 * Returns the fallback SVG path for a given category
 */
export function getCategoryFallbackImage(category?: string): string {
  if (!category) return DEFAULT_FALLBACK_SVG;
  const cleanCat = category.toLowerCase().trim();
  const known = ['ghee', 'milk', 'butter', 'paneer', 'cream', 'curd-dahi', 'cheese', 'mithai', 'combo-packs', 'gift-boxes'];
  if (known.includes(cleanCat)) {
    return `/images/placeholders/category-${cleanCat}.svg`;
  }
  return DEFAULT_FALLBACK_SVG;
}

/**
 * Extracts slug from either Product object or string
 */
function extractSlug(productOrSlug: Product | string): string {
  if (typeof productOrSlug === 'string') {
    return productOrSlug;
  }
  return productOrSlug?.slug || '';
}

/**
 * Centralized function to resolve all gallery images for a product.
 * Returns consistent ResolvedProductImage array.
 * Never returns empty array (always returns at least one resolved image).
 */
export function getProductGallery(productOrSlug: Product | string, _variantId?: string): ResolvedProductImage[] {
  const slug = extractSlug(productOrSlug);
  const mapped = PRODUCT_IMAGES[slug];

  if (mapped && mapped.length > 0) {
    return mapped.map((img, idx) => ({
      id: img.id || `${slug}-img-${idx + 1}`,
      src: normalizeImagePath(img.src),
      srcset: img.srcset,
      sizes: img.sizes,
      alt: img.alt || `${slug} image ${idx + 1}`,
      type: img.type as any,
      isMain: img.isMain ?? idx === 0,
      order: img.order || idx + 1,
      width: img.width || 800,
      height: img.height || 800,
      isVerifiedSpecific: img.isVerifiedSpecific ?? true,
      assetStatus: img.assetStatus || (img.isVerifiedSpecific ? 'verified_authentic' : 'pending_studio_shot'),
      source: (img.attribution?.source as any) || (img.src.startsWith('http') ? 'remote' : 'local'),
    }));
  }

  // If passed a Product object with embedded images array
  if (typeof productOrSlug === 'object' && productOrSlug !== null) {
    const p = productOrSlug as Product;
    if (Array.isArray(p.images) && p.images.length > 0) {
      const validImages = p.images.filter((img) => {
        if (!img) return false;
        const src = typeof img === 'string' ? img : img.src;
        return typeof src === 'string' && src.trim() !== '';
      });

      if (validImages.length > 0) {
        return validImages.map((rawImg, idx) => {
          const isStr = typeof rawImg === 'string';
          const src = normalizeImagePath(isStr ? (rawImg as string) : (rawImg as ProductImage).src);
          const isLocal = src.startsWith('/images/products/');
          const isFallback = src.includes('/placeholders/');
          return {
            id: isStr ? `${p.slug}-img-${idx + 1}` : ((rawImg as ProductImage).id || `${p.slug}-${idx + 1}`),
            src,
            srcset: !isStr ? (rawImg as ProductImage).srcset : undefined,
            sizes: !isStr ? (rawImg as ProductImage).sizes : undefined,
            alt: !isStr && (rawImg as ProductImage).alt ? (rawImg as ProductImage).alt : `${p.name} view ${idx + 1}`,
            type: !isStr ? (rawImg as ProductImage).type : (idx === 0 ? 'main' : 'closeup'),
            isMain: !isStr ? ((rawImg as ProductImage).isMain ?? idx === 0) : idx === 0,
            order: idx + 1,
            width: 800,
            height: 800,
            isVerifiedSpecific: isLocal && !isFallback,
            assetStatus: isLocal && !isFallback ? 'verified_authentic' : 'pending_studio_shot',
            source: src.startsWith('http') ? 'remote' : 'local',
          };
        });
      }
    }

    // Fallback to category representation
    const catSrc = getCategoryFallbackImage(p.category);
    return [
      {
        id: `${p.slug || 'product'}-cat-rep`,
        src: catSrc,
        alt: `${p.name || 'Product'} (DesiDhar Category Representation — Studio Shot Pending)`,
        type: 'category-fallback',
        isMain: true,
        order: 1,
        width: 800,
        height: 800,
        isVerifiedSpecific: false,
        assetStatus: 'pending_studio_shot',
        source: 'fallback',
      },
    ];
  }

  // Ultimate fallback
  return [
    {
      id: `${slug || 'product'}-fallback`,
      src: DEFAULT_FALLBACK_SVG,
      alt: 'DesiDhar Authentic Dairy Product',
      type: 'placeholder',
      isMain: true,
      order: 1,
      width: 800,
      height: 800,
      isVerifiedSpecific: false,
      assetStatus: 'pending_studio_shot',
      source: 'fallback',
    },
  ];
}

/**
 * Returns the primary (main) resolved image for a product.
 * Guaranteed to return a valid ResolvedProductImage.
 */
export function getPrimaryProductImage(productOrSlug: Product | string, variantId?: string): ResolvedProductImage {
  const gallery = getProductGallery(productOrSlug, variantId);
  return gallery.find((img) => img.isMain) || gallery[0];
}

/**
 * Returns the secondary/hover image for product cards, if available.
 */
export function getSecondaryProductImage(productOrSlug: Product | string): ResolvedProductImage | undefined {
  const gallery = getProductGallery(productOrSlug);
  return gallery.length > 1 ? gallery[1] : undefined;
}

/**
 * Returns thumbnail image src string for cart, checkout, search dropdown.
 */
export function getProductThumbnail(productOrSlug: Product | string, variantId?: string): string {
  const primary = getPrimaryProductImage(productOrSlug, variantId);
  return primary.src;
}

/**
 * Checks whether the product has a verified product-specific asset
 */
export function isProductAssetVerified(productOrSlug: Product | string): boolean {
  const primary = getPrimaryProductImage(productOrSlug);
  return primary.isVerifiedSpecific;
}

/**
 * Safe error handler for <img> onError events to prevent infinite loops
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  categoryOrFallback?: string
) {
  const target = e.currentTarget;
  if (target.dataset.hasError === 'true') {
    return; // Already triggered, avoid loop
  }
  target.dataset.hasError = 'true';
  const fallback = categoryOrFallback?.startsWith('/') || categoryOrFallback?.startsWith('http')
    ? categoryOrFallback
    : getCategoryFallbackImage(categoryOrFallback);
  target.src = fallback;
}
