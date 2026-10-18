import type { HeroBanner } from '../types';

export const HERO_BANNERS: HeroBanner[] = [
  {
    id: 'banner-1',
    title: 'Vedic Gir Cow A2 Bilona Ghee',
    subtitle: 'Slow churned in earthen pots over slow cow-dung flame. 100% Danedaar & Golden Aroma.',
    badge: '★ FESTIVE HARVEST SPECIAL',
    buttonText: 'Shop A2 Ghee at 20% OFF',
    link: '/category/ghee',
    bgColor: '#FFF3DC',
    bgGradient: 'from-amber-100 via-amber-50 to-orange-100',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1000&q=80',
    highlightText: 'FLAT 20% OFF'
  },
  {
    id: 'banner-2',
    title: 'Fresh Farm Milk Before 7 AM',
    subtitle: 'Chilled at source within 45 mins. Untouched by human hands. Cold-chain doorstep delivery.',
    badge: '⚡ DAILY MORNING DROP',
    buttonText: 'Order Daily Milk',
    link: '/category/milk',
    bgColor: '#EAF6FF',
    bgGradient: 'from-sky-100 via-emerald-50 to-amber-50',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
    highlightText: 'ZERO PRESERVATIVES'
  },
  {
    id: 'banner-3',
    title: 'Melt-In-Mouth Royal Kaju Katli',
    subtitle: 'Handcrafted with premium Goan cashew paste & 100% Shuddh Desi Ghee. No silver paper adulteration.',
    badge: '👑 ROYAL MITHAI COLLECTION',
    buttonText: 'Explore Pure Mithai',
    link: '/category/mithai',
    bgColor: '#FFF5F0',
    bgGradient: 'from-rose-100 via-amber-50 to-amber-100',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1000&q=80',
    highlightText: '100% DESI GHEE SWEETS'
  },
  {
    id: 'banner-4',
    title: 'Fresh Malai Paneer & Safed Makkhan',
    subtitle: 'Cut fresh on order. Ultra soft, spongey, soaking in rich natural milk fats. Never refrigerated days in advance.',
    badge: '🌿 HARVEST FRESH TODAY',
    buttonText: 'Order Fresh Paneer',
    link: '/category/paneer',
    bgColor: '#F0FDF4',
    bgGradient: 'from-emerald-100 via-green-50 to-amber-50',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1000&q=80',
    highlightText: 'CUT FRESH TODAY'
  }
];

export const PROMO_DEALS = [
  {
    id: 'deal-ghee-combo',
    title: 'Bilona Ghee 1L + Safed Makkhan 500g',
    originalPrice: 1650,
    dealPrice: 1299,
    savings: 351,
    endsInMinutes: 420,
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'deal-sweets-box',
    title: 'Assorted Shuddh Ghee Mithai Box (1kg)',
    originalPrice: 990,
    dealPrice: 799,
    savings: 191,
    endsInMinutes: 280,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=500&q=80'
  }
];
