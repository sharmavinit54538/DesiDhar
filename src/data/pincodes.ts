import { PincodeCheckResult } from '../types';

export const SERVICEABLE_PINCODES: Record<string, PincodeCheckResult> = {
  // Delhi NCR
  '110001': {
    pincode: '110001',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 7:00 AM',
    coldChainAvailable: true,
    city: 'New Delhi (Connaught Place)',
    message: 'Express Cold-Chain Active. Insulated delivery guaranteed.'
  },
  '110019': {
    pincode: '110019',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 7:00 AM',
    coldChainAvailable: true,
    city: 'South Delhi (Kalkaji / CR Park)',
    message: 'Express Cold-Chain Active. Fresh morning milk available.'
  },
  '201301': {
    pincode: '201301',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 7:00 AM',
    coldChainAvailable: true,
    city: 'Noida Sector 18 & Central',
    message: 'Direct farm milk run delivered before dawn.'
  },
  '122001': {
    pincode: '122001',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 7:30 AM',
    coldChainAvailable: true,
    city: 'Gurugram Central',
    message: 'Cold-chain van service active.'
  },
  // Mumbai & Pune
  '400001': {
    pincode: '400001',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 7:30 AM',
    coldChainAvailable: true,
    city: 'South Mumbai (Fort / Colaba)',
    message: 'Chilled insulated box delivery before breakfast.'
  },
  '400050': {
    pincode: '400050',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 7:00 AM',
    coldChainAvailable: true,
    city: 'Mumbai (Bandra West)',
    message: 'Full service active. Artisanal sweets & A2 Milk.'
  },
  '411001': {
    pincode: '411001',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 8:00 AM',
    coldChainAvailable: true,
    city: 'Pune Camp',
    message: 'Direct dispatch from Western Ghats dairy farm.'
  },
  // Bengaluru
  '560001': {
    pincode: '560001',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 7:00 AM',
    coldChainAvailable: true,
    city: 'Bengaluru (MG Road / Central)',
    message: 'Eco-friendly refrigerated early delivery.'
  },
  '560034': {
    pincode: '560034',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 7:00 AM',
    coldChainAvailable: true,
    city: 'Bengaluru (Koramangala)',
    message: 'Early morning slot available.'
  },
  // Hyderabad
  '500001': {
    pincode: '500001',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 8:00 AM',
    coldChainAvailable: true,
    city: 'Hyderabad (Abids)',
    message: 'Insulated milk van delivery active.'
  },
  // Jaipur
  '302001': {
    pincode: '302001',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 6:30 AM',
    coldChainAvailable: true,
    city: 'Jaipur (C-Scheme / M.I. Road)',
    message: 'Local Bilona Ghee & Dairy hub.'
  },
  // Lucknow
  '226001': {
    pincode: '226001',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 7:00 AM',
    coldChainAvailable: true,
    city: 'Lucknow (Hazratganj)',
    message: 'Fresh dairy and Malai dispatch center nearby.'
  },
  // Kolkata
  '700001': {
    pincode: '700001',
    isServiceable: true,
    estimatedDelivery: 'Tomorrow, before 7:30 AM',
    coldChainAvailable: true,
    city: 'Kolkata (BBD Bagh / Central)',
    message: 'Fresh Mishti Doi and Chhena cold storage active.'
  }
};

export const DEFAULT_PINCODE = '110001';
