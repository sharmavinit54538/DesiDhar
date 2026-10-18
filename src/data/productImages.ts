import type { ProductImage } from '../types';

/**
 * PRODUCT_IMAGES mapping table
 * Maps product slug -> verified local ProductImage[]
 * Replace any photo anytime by dropping a file in the folder with the same name.
 */
export const PRODUCT_IMAGES: Record<string, ProductImage[]> = {
  'shuddh-desi-ghee-kaju-katli': [
    {
      id: 'kaju-katli-main',
      src: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/main-800.webp',
      srcset: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/main-400.webp 400w, /images/products/mithai/shuddh-desi-ghee-kaju-katli/main-800.webp 800w, /images/products/mithai/shuddh-desi-ghee-kaju-katli/main-1200.webp 1200w',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
      alt: 'Diamond-shaped authentic Kaju Katli cashew fudge with pure silver leaf vark and pistachio crown',
      type: 'main',
      isMain: true,
      order: 1,
      width: 800,
      height: 800,
      attribution: {
        source: 'local',
        photographer: 'DesiDhar Artisan Mithai Studio',
        license: 'DesiDhar Authentic Kitchen Photo (Proprietary)',
        originalUrl: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/main-1200.webp',
        downloadedAt: '2026-10-18T14:15:00Z',
      },
    },
    {
      id: 'kaju-katli-closeup',
      src: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/closeup-800.webp',
      srcset: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/closeup-400.webp 400w, /images/products/mithai/shuddh-desi-ghee-kaju-katli/closeup-800.webp 800w, /images/products/mithai/shuddh-desi-ghee-kaju-katli/closeup-1200.webp 1200w',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
      alt: 'Extreme macro closeup showing fine cashew paste texture and shimmering silver leaf vark',
      type: 'closeup',
      isMain: false,
      order: 2,
      width: 800,
      height: 800,
      attribution: {
        source: 'local',
        photographer: 'DesiDhar Artisan Mithai Studio',
        license: 'DesiDhar Authentic Kitchen Photo',
        originalUrl: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/closeup-1200.webp',
        downloadedAt: '2026-10-18T14:15:00Z',
      },
    },
    {
      id: 'kaju-katli-packaging',
      src: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/packaging-800.webp',
      srcset: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/packaging-400.webp 400w, /images/products/mithai/shuddh-desi-ghee-kaju-katli/packaging-800.webp 800w, /images/products/mithai/shuddh-desi-ghee-kaju-katli/packaging-1200.webp 1200w',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
      alt: 'Open luxury royal blue and gold embossed Diwali sweet gift box with aligned diamond Kaju Katli',
      type: 'packaging',
      isMain: false,
      order: 3,
      width: 800,
      height: 800,
      attribution: {
        source: 'local',
        photographer: 'DesiDhar Artisan Mithai Studio',
        license: 'DesiDhar Authentic Kitchen Photo',
        originalUrl: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/packaging-1200.webp',
        downloadedAt: '2026-10-18T14:15:00Z',
      },
    },
    {
      id: 'kaju-katli-serving',
      src: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/serving-800.webp',
      srcset: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/serving-400.webp 400w, /images/products/mithai/shuddh-desi-ghee-kaju-katli/serving-800.webp 800w, /images/products/mithai/shuddh-desi-ghee-kaju-katli/serving-1200.webp 1200w',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
      alt: 'Carved silver dessert thali with Kaju Katli diamonds, raw whole cashews and hot kulhad chai',
      type: 'serving',
      isMain: false,
      order: 4,
      width: 800,
      height: 800,
      attribution: {
        source: 'local',
        photographer: 'DesiDhar Artisan Mithai Studio',
        license: 'DesiDhar Authentic Kitchen Photo',
        originalUrl: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/serving-1200.webp',
        downloadedAt: '2026-10-18T14:15:00Z',
      },
    },
    {
      id: 'kaju-katli-size-ref',
      src: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/size-reference-800.webp',
      srcset: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/size-reference-400.webp 400w, /images/products/mithai/shuddh-desi-ghee-kaju-katli/size-reference-800.webp 800w',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
      alt: 'DesiDhar Kaju Katli pack size comparison guide for 250g, 500g, and 1kg boxes',
      type: 'size-reference',
      isMain: false,
      order: 5,
      width: 800,
      height: 800,
      attribution: {
        source: 'local',
        photographer: 'DesiDhar Standards Bureau',
        license: 'DesiDhar Proprietary',
        originalUrl: '/images/products/mithai/shuddh-desi-ghee-kaju-katli/size-reference-800.webp',
        downloadedAt: '2026-10-18T14:15:00Z',
      },
    },
  ],
};

export function getProductImagesBySlug(slug: string): ProductImage[] {
  return PRODUCT_IMAGES[slug] || [];
}

export function getMainProductImage(slug: string): ProductImage | undefined {
  const list = PRODUCT_IMAGES[slug];
  if (!list || list.length === 0) return undefined;
  return list.find((img) => img.isMain) || list[0];
}
