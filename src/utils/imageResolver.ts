import type { Product, ProductImage } from '../types';

const DEFAULT_FALLBACK_SVG = '/images/placeholders/product-placeholder.svg';

const KNOWN_CATEGORIES = [
  'ghee',
  'milk',
  'butter',
  'paneer',
  'cream',
  'curd-dahi',
  'cheese',
  'mithai',
  'combo-packs',
  'gift-boxes',
];

export function normalizeImagePath(src: string): string {
  if (!src) return DEFAULT_FALLBACK_SVG;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
    return src;
  }
  return `/${src}`;
}

export function getCategoryFallbackImage(category?: string): string {
  if (!category) return DEFAULT_FALLBACK_SVG;
  const clean = category.toLowerCase().trim();
  if (KNOWN_CATEGORIES.includes(clean)) {
    return `/images/placeholders/category-${clean}.svg`;
  }
  return DEFAULT_FALLBACK_SVG;
}

/**
 * Gallery images come from the API (product_images table). The API guarantees at
 * least one image per product: either a verified product-specific asset or an
 * explicit branded category placeholder. This function only normalises the data
 * for rendering — it never invents or re-maps product photos on the client.
 */
export function getProductGallery(product: Pick<Product, 'images' | 'category'>): ProductImage[] {
  const images = Array.isArray(product.images) ? product.images : [];
  const withSrc = images
    .filter((image) => image && typeof image.src === 'string' && image.src.trim() !== '')
    .map((image) => ({ ...image, src: normalizeImagePath(image.src) }));

  if (withSrc.length > 0) return withSrc;

  return [
    {
      id: 'category-fallback',
      src: getCategoryFallbackImage(product.category),
      alt: 'DesiDhar product image unavailable',
      type: 'placeholder',
      isMain: true,
      order: 1,
      width: 800,
      height: 800,
      isVerifiedSpecific: false,
      assetStatus: 'pending_studio_shot',
    },
  ];
}

export function getPrimaryProductImage(product: Pick<Product, 'images' | 'category'>): ProductImage {
  const gallery = getProductGallery(product);
  return gallery.find((image) => image.isMain) || gallery[0];
}

export function getSecondaryProductImage(
  product: Pick<Product, 'images' | 'category'>
): ProductImage | undefined {
  const gallery = getProductGallery(product);
  return gallery.length > 1 ? gallery[1] : undefined;
}

export function getProductThumbnail(product: Pick<Product, 'images' | 'category'>): string {
  return getPrimaryProductImage(product).src;
}

export function isProductAssetVerified(product: Pick<Product, 'images' | 'category'>): boolean {
  return getPrimaryProductImage(product).isVerifiedSpecific;
}

/**
 * <img> onError handler with a loop guard. It swaps to the product's category
 * placeholder — never to another product's photo.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  categoryOrFallback?: string
): void {
  const target = event.currentTarget;
  if (target.dataset.hasError === 'true') return;
  target.dataset.hasError = 'true';
  const fallback =
    categoryOrFallback && categoryOrFallback.startsWith('/')
      ? categoryOrFallback
      : getCategoryFallbackImage(categoryOrFallback);
  target.src = fallback;
}
