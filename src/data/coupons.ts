import type { Coupon } from '../types';

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'DESI10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 299,
    maxDiscount: 150,
    description: '10% OFF on all DesiDhar pure dairy & sweets up to ₹150',
    validUntil: '2026-12-31'
  },
  {
    code: 'FIRSTORDER',
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 399,
    description: 'Flat ₹100 instant welcome discount on your first order above ₹399',
    validUntil: '2026-12-31'
  },
  {
    code: 'FESTIVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 799,
    maxDiscount: 300,
    description: 'Festive celebration treat: 20% OFF on Mithai & Ghee orders above ₹799',
    validUntil: '2026-11-30'
  },
  {
    code: 'SHUDDH50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 249,
    description: 'Flat ₹50 OFF on cold-chain morning milk and fresh paneer',
    validUntil: '2026-12-31'
  }
];
