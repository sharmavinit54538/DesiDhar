import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  // ===================== GHEE (7 products) =====================
  {
    id: 'prod-ghee-1',
    slug: 'desi-a2-gir-cow-bilona-ghee',
    name: 'DesiDhar Vedic Gir Cow A2 Bilona Ghee',
    brand: 'DesiDhar Vedic',
    category: 'ghee',
    subcategory: 'A2 Cow Ghee',
    images: [
      '/images/products/ghee/desi-a2-gir-cow-bilona-ghee/main-800.webp',
      '/images/products/ghee/desi-a2-gir-cow-bilona-ghee/serving-800.webp'
    ],
    variants: [
      { id: 'v-g1-250', weight: '250ml', price: 499, mrp: 599, stock: 35, sku: 'DD-GHEE-A2-250' },
      { id: 'v-g1-500', weight: '500ml', price: 899, mrp: 1100, stock: 45, sku: 'DD-GHEE-A2-500' },
      { id: 'v-g1-1000', weight: '1 Litre', price: 1699, mrp: 2100, stock: 30, sku: 'DD-GHEE-A2-1000' },
      { id: 'v-g1-5000', weight: '5 Litres (Tin)', price: 7999, mrp: 9999, stock: 12, sku: 'DD-GHEE-A2-5000' }
    ],
    rating: 4.9,
    reviewCount: 348,
    tags: ['Bestseller', 'Deal of Day', 'A2 Pure', 'Vedic Bilona'],
    isBestseller: true,
    isFresh: true,
    isDeal: true,
    dealEndsAt: '2026-10-31T23:59:59',
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Traditional two-way curd churning in earthen pots. 100% granular texture with golden buttery aroma.',
    description: 'DesiDhar Vedic A2 Ghee is crafted using the age-old Vedic Bilona method. Fresh milk from grass-fed indigenous Gir cows is boiled and set into whole curd in clay pots. The curd is hand-churned in both directions using a wooden churner (Bilona) to extract cultured Makkhan, which is then slow-simmered over a gentle cow-dung fire. The result is pure, aromatic, highly digestible golden nectar rich in butyric acid, Vitamin A, D, E, K, and Omega-3.',
    ingredients: '100% Pure Clarified Butterfat from Cultured A2 Gir Cow Milk Curd.',
    nutrition: {
      'Energy': '897 kcal',
      'Total Fat': '99.7 g',
      'Saturated Fat': '65.2 g',
      'Monounsaturated Fat': '25.4 g',
      'Polyunsaturated Fat': '3.2 g',
      'Omega-3 Fatty Acids': '680 mg',
      'Carbohydrates': '0.0 g',
      'Protein': '0.0 g',
      'Vitamin A': '820 mcg'
    },
    shelfLife: '12 Months from packing date',
    storage: 'Store in a cool, dry place away from direct sunlight. Do not refrigerate. Use a clean, dry wooden or stainless steel spoon.',
    faqs: [
      { question: 'Is this made from cream or whole milk curd?', answer: 'It is strictly made from cultured whole curd (Vedic Bilona), never from industrial direct cream.' },
      { question: 'Why does the ghee look granular (danedaar)?', answer: 'Natural slow-cooling at room temperature without synthetic homogenizers creates authentic grainy granules, a hallmark of pure desi ghee.' }
    ]
  },
  {
    id: 'prod-ghee-2',
    slug: 'organic-desi-cow-danedaar-ghee',
    name: 'DesiDhar Shuddh Danedaar Cow Ghee',
    brand: 'DesiDhar Shuddh',
    category: 'ghee',
    subcategory: 'Cow Ghee',
    images: [
      '/images/products/ghee/organic-desi-cow-danedaar-ghee/main-800.webp',
      '/images/products/ghee/organic-desi-cow-danedaar-ghee/closeup-800.webp',
      '/images/products/ghee/organic-desi-cow-danedaar-ghee/packaging-800.webp',
      '/images/products/ghee/organic-desi-cow-danedaar-ghee/serving-800.webp'
    ],
    variants: [
      { id: 'v-g2-500', weight: '500ml', price: 449, mrp: 549, stock: 50, sku: 'DD-GHEE-COW-500' },
      { id: 'v-g2-1000', weight: '1 Litre', price: 849, mrp: 1049, stock: 40, sku: 'DD-GHEE-COW-1000' }
    ],
    rating: 4.8,
    reviewCount: 215,
    tags: ['Bestseller', 'Daily Kitchen'],
    isBestseller: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Everyday pure granular cow ghee with rich golden aroma for dal tadka and warm rotis.',
    description: 'DesiDhar Danedaar Cow Ghee is made from pure cow milk fat, slow cooked to perfection to release that irresistible nutty fragrance. Ideal for daily cooking, tempering dals, roasting spices, and spreading on phulkas.',
    ingredients: '100% Pure Milk Fat (Cow Milk).',
    nutrition: { 'Energy': '895 kcal', 'Total Fat': '99.5 g', 'Saturated Fat': '64 g', 'Carbohydrates': '0 g', 'Protein': '0 g' },
    shelfLife: '9 Months from packing date',
    storage: 'Store in an airtight container at room temperature.'
  },
  {
    id: 'prod-ghee-3',
    slug: 'pure-murrah-buffalo-ghee',
    name: 'DesiDhar Pure Murrah Buffalo Ghee (Heavy & Rich)',
    brand: 'DesiDhar Shuddh',
    category: 'ghee',
    subcategory: 'Buffalo Ghee',
    images: [
      '/images/placeholders/category-ghee.svg'
    ],
    variants: [
      { id: 'v-g3-500', weight: '500ml', price: 469, mrp: 550, stock: 25, sku: 'DD-GHEE-BUF-500' },
      { id: 'v-g3-1000', weight: '1 Litre', price: 899, mrp: 1050, stock: 35, sku: 'DD-GHEE-BUF-1000' }
    ],
    rating: 4.7,
    reviewCount: 142,
    tags: ['High Fat', 'Sweet Maker Special'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Snow-white thick buffalo ghee with high smoke point. Preferred by traditional halwais for deep frying mithai.',
    description: 'Extracted from the rich, high-fat milk of indigenous Murrah buffaloes. Boasts a crystal-white granular texture, robust body, and high smoke point (250°C), making it ideal for making Halwa, Besan Ladoos, and deep frying festive snacks.',
    ingredients: '100% Pure Buffalo Milk Fat.',
    nutrition: { 'Energy': '902 kcal', 'Total Fat': '99.8 g', 'Saturated Fat': '68 g', 'Carbohydrates': '0 g', 'Protein': '0 g' },
    shelfLife: '9 Months',
    storage: 'Store in a dry place.'
  },
  {
    id: 'prod-ghee-4',
    slug: 'vedic-cultured-grass-fed-cow-ghee',
    name: 'DesiDhar Cultured Himalayan Grass-Fed Ghee',
    brand: 'DesiDhar Vedic',
    category: 'ghee',
    subcategory: 'A2 Cow Ghee',
    images: [
      '/images/placeholders/category-ghee.svg'
    ],
    variants: [
      { id: 'v-g4-500', weight: '500ml', price: 950, mrp: 1200, stock: 20, sku: 'DD-GHEE-HIM-500' },
      { id: 'v-g4-1000', weight: '1 Litre', price: 1799, mrp: 2300, stock: 15, sku: 'DD-GHEE-HIM-1000' }
    ],
    rating: 4.9,
    reviewCount: 88,
    tags: ['Organic', 'Ayurvedic Grade', 'Grass-fed'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Free-range Pahadi cow milk grazed on wild medicinal Himalayan herbs. Rich in beta-carotene.',
    description: 'Sourced from high-altitude free-grazing Badri cows in the lower Himalayas. The cows feed on natural Himalayan medicinal herbs and wild clover, yielding milk loaded with unique phytonutrients.',
    ingredients: '100% Cultured Badri Cow Butterfat.',
    nutrition: { 'Energy': '898 kcal', 'Total Fat': '99.7 g', 'Saturated Fat': '63 g', 'Beta-Carotene': '1100 mcg' },
    shelfLife: '12 Months',
    storage: 'Keep in glass jar in dry cupboard.'
  },
  {
    id: 'prod-ghee-5',
    slug: 'brahmi-shankhpushpi-medhya-ghee',
    name: 'DesiDhar Medhya Herb Brahmi Desi Ghee',
    brand: 'DesiDhar Vedic',
    category: 'ghee',
    subcategory: 'Infused Ghee',
    images: [
      '/images/placeholders/category-ghee.svg'
    ],
    variants: [
      { id: 'v-g5-250', weight: '250ml', price: 549, mrp: 699, stock: 18, sku: 'DD-GHEE-BRM-250' },
      { id: 'v-g5-500', weight: '500ml', price: 999, mrp: 1299, stock: 14, sku: 'DD-GHEE-BRM-500' }
    ],
    rating: 4.8,
    reviewCount: 64,
    tags: ['Ayurvedic', 'Brain Booster', 'Memory'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Classical Ayurvedic medicated ghee infused with wild Brahmi, Shankhpushpi & Gotu Kola for cognitive wellness.',
    description: 'Formulated following Charaka Samhita guidelines. Pure A2 Gir Cow Ghee decocted with fresh Brahmi juice and Shankhpushpi herbs. Renowned for enhancing memory, focus, and calming the nervous system.',
    ingredients: 'A2 Gir Cow Ghee, Brahmi (Bacopa monnieri), Shankhpushpi, Jyotishmati.',
    nutrition: { 'Energy': '890 kcal', 'Total Fat': '99 g', 'Active Bacosides': 'Present' },
    shelfLife: '12 Months',
    storage: 'Store away from moisture.'
  },
  {
    id: 'prod-ghee-6',
    slug: 'garlic-himalayan-herb-ghee',
    name: 'DesiDhar Roasted Garlic & Herb Ghee Spread',
    brand: 'DesiDhar Farm',
    category: 'ghee',
    subcategory: 'Flavored Ghee',
    images: [
      '/images/placeholders/category-ghee.svg'
    ],
    variants: [
      { id: 'v-g6-250', weight: '250g', price: 349, mrp: 420, stock: 22, sku: 'DD-GHEE-GAR-250' }
    ],
    rating: 4.6,
    reviewCount: 79,
    tags: ['Gourmet', 'Spread'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Slow-roasted mountain garlic confit steeped into golden clarified butter with rosemary and black pepper.',
    description: 'A culinary delight! Spread it over sourdough toast, naan, parathas, or drizzle over roasted baby potatoes.',
    ingredients: 'Desi Cow Ghee, Roasted Himalayan Garlic, Sea Salt, Rosemary, Crushed Black Pepper.',
    nutrition: { 'Energy': '875 kcal', 'Total Fat': '96 g' },
    shelfLife: '6 Months',
    storage: 'Store in a cool dry place.'
  },
  {
    id: 'prod-ghee-7',
    slug: 'royal-kesar-elaichi-dessert-ghee',
    name: 'DesiDhar Royal Kashmiri Kesar & Elaichi Ghee',
    brand: 'DesiDhar Vedic',
    category: 'ghee',
    subcategory: 'Flavored Ghee',
    images: [
      '/images/placeholders/category-ghee.svg'
    ],
    variants: [
      { id: 'v-g7-250', weight: '250ml', price: 625, mrp: 750, stock: 19, sku: 'DD-GHEE-KSR-250' },
      { id: 'v-g7-500', weight: '500ml', price: 1150, mrp: 1400, stock: 15, sku: 'DD-GHEE-KSR-500' }
    ],
    rating: 4.9,
    reviewCount: 91,
    tags: ['Royal Mithai Secret', 'Festive Special'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Infused with Grade-A Kashmiri Mongra Saffron stigmas and green Idukki cardamom pods. The secret of royal halwas.',
    description: 'Transform any sweet dish into a royal banquet. The aroma of crushed green cardamom and pure Kashmiri saffron infused into Bilona ghee adds an ethereal depth to Sheera, Sooji Halwa, and Gajar ka Halwa.',
    ingredients: 'A2 Gir Cow Ghee, Kashmiri Mongra Saffron, Idukki Green Cardamom.',
    nutrition: { 'Energy': '895 kcal', 'Total Fat': '99.5 g' },
    shelfLife: '9 Months',
    storage: 'Cool, dark pantry shelf.'
  },

  // ===================== MILK (8 products) =====================
  {
    id: 'prod-milk-1',
    slug: 'fresh-a2-gir-cow-raw-milk',
    name: 'DesiDhar Fresh A2 Gir Cow Milk (Chilled Glass Bottle)',
    brand: 'DesiDhar Farm',
    category: 'milk',
    subcategory: 'A2 Milk',
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-m1-1000', weight: '1 Litre Bottle', price: 92, mrp: 110, stock: 120, sku: 'DD-MILK-A2-1L' },
      { id: 'v-m1-2000', weight: '2 Litres (Twin Pack)', price: 179, mrp: 220, stock: 60, sku: 'DD-MILK-A2-2L' },
      { id: 'v-m1-5000', weight: '5 Litres Family Jar', price: 435, mrp: 550, stock: 20, sku: 'DD-MILK-A2-5L' }
    ],
    rating: 4.9,
    reviewCount: 512,
    tags: ['Fresh Today', 'Bestseller', 'A2 Pure', 'Cold Chain'],
    isBestseller: true,
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Chilled within 45 mins of milking. Glass bottled, untouched by hands. Pure A2 beta-casein goodness.',
    description: 'DesiDhar Fresh A2 Milk is sourced directly from happy, free-grazing indigenous Gir cows. Unlike commercial hybrid milk containing A1 beta-casein, A2 milk is gentle on digestion and causes zero bloating. Delivered in sanitized reusable glass bottles under 4°C cold-chain logistics before 7:00 AM.',
    ingredients: '100% Raw Chilled Fresh A2 Cow Milk. No added water, hormones, or chemical preservatives.',
    nutrition: {
      'Energy': '68 kcal',
      'Fat': '4.2 g',
      'SNF': '8.6 g',
      'Protein': '3.4 g',
      'A2 Beta-Casein': '100%',
      'Calcium': '132 mg',
      'Carbohydrates': '4.8 g'
    },
    shelfLife: '3 Days from delivery (keep refrigerated below 4°C)',
    storage: 'Boil before consumption. Store in refrigerator immediately upon receipt.',
    faqs: [
      { question: 'When is this milk delivered?', answer: 'Orders placed before 9 PM are delivered next morning between 5:30 AM and 7:30 AM in temperature-insulated bags.' }
    ]
  },
  {
    id: 'prod-milk-2',
    slug: 'farm-fresh-full-cream-cow-milk',
    name: 'DesiDhar Farm Fresh Full Cream Cow Milk',
    brand: 'DesiDhar Farm',
    category: 'milk',
    subcategory: 'Cow Milk',
    images: [
      '/images/products/milk/farm-fresh-full-cream-cow-milk/main-800.webp',
      '/images/products/milk/farm-fresh-full-cream-cow-milk/serving-800.webp',
      '/images/products/milk/farm-fresh-full-cream-cow-milk/closeup-800.webp',
      '/images/products/milk/farm-fresh-full-cream-cow-milk/packaging-800.webp'
    ],
    variants: [
      { id: 'v-m2-1000', weight: '1 Litre Pouch', price: 68, mrp: 75, stock: 200, sku: 'DD-MILK-COW-1L' },
      { id: 'v-m2-2000', weight: '2 Litres', price: 132, mrp: 150, stock: 90, sku: 'DD-MILK-COW-2L' }
    ],
    rating: 4.8,
    reviewCount: 380,
    tags: ['Fresh Today', 'Daily Essential'],
    isBestseller: true,
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Pasteurized homogenized whole cow milk with 4.5% natural fat. Generates a glorious layer of sweet malai.',
    description: 'Golden tinted wholesome cow milk packed with wholesome energy, naturally occurring vitamins and rich calcium. Perfect for chai, coffee, puddings, and homemade dahi.',
    ingredients: 'Pasteurized Whole Cow Milk.',
    nutrition: { 'Energy': '72 kcal', 'Fat': '4.5 g', 'Protein': '3.3 g', 'Calcium': '125 mg' },
    shelfLife: '2 Days refrigerated',
    storage: 'Refrigerate at or below 4°C.'
  },
  {
    id: 'prod-milk-3',
    slug: 'pure-thick-buffalo-milk',
    name: 'DesiDhar Shuddh Thick Buffalo Milk (8% Fat)',
    brand: 'DesiDhar Shuddh',
    category: 'milk',
    subcategory: 'Buffalo Milk',
    images: [
      '/images/products/milk/pure-thick-buffalo-milk/main-800.webp',
      '/images/products/milk/pure-thick-buffalo-milk/serving-800.webp',
      '/images/products/milk/pure-thick-buffalo-milk/closeup-800.webp'
    ],
    variants: [
      { id: 'v-m3-1000', weight: '1 Litre Pouch', price: 78, mrp: 86, stock: 150, sku: 'DD-MILK-BUF-1L' },
      { id: 'v-m3-2000', weight: '2 Litres', price: 152, mrp: 172, stock: 70, sku: 'DD-MILK-BUF-2L' }
    ],
    rating: 4.8,
    reviewCount: 220,
    tags: ['Extra Thick', 'Best for Kheer & Paneer'],
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Heavy buffalo milk with 8.0% minimum fat. Makes thickest creamy curd and spongy homemade paneer.',
    description: 'For households that love robust, full-bodied milk! Our Murrah buffalo milk delivers maximum creaminess, high calcium, and heavy malai crust. Perfect for wrestling with creamy lassis, Rabdi, and Kheer.',
    ingredients: 'Standardized Pasteurized Buffalo Milk.',
    nutrition: { 'Energy': '108 kcal', 'Fat': '8.0 g', 'Protein': '4.1 g', 'Calcium': '185 mg' },
    shelfLife: '2 Days refrigerated',
    storage: 'Keep refrigerated.'
  },
  {
    id: 'prod-milk-4',
    slug: 'low-fat-toned-cow-milk',
    name: 'DesiDhar Slim Fit Toned Cow Milk',
    brand: 'DesiDhar Farm',
    category: 'milk',
    subcategory: 'Toned Milk',
    images: [
      '/images/placeholders/category-milk.svg'
    ],
    variants: [
      { id: 'v-m4-1000', weight: '1 Litre', price: 58, mrp: 65, stock: 80, sku: 'DD-MILK-TONED-1L' }
    ],
    rating: 4.7,
    reviewCount: 95,
    tags: ['Low Fat', 'Heart Healthy', 'Diet Friendly'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Gentle on calories, high on nutrition. Standardized to 3.0% fat with complete milk solids.',
    description: 'Designed for fitness enthusiasts and health-conscious families who prefer lighter milk without losing vital protein and micronutrients.',
    ingredients: 'Pasteurized Toned Cow Milk.',
    nutrition: { 'Energy': '58 kcal', 'Fat': '3.0 g', 'Protein': '3.2 g', 'Calcium': '120 mg' },
    shelfLife: '3 Days',
    storage: 'Refrigerate at 4°C.'
  },
  {
    id: 'prod-milk-5',
    slug: 'shuddh-masala-badam-kesar-milk',
    name: 'DesiDhar Royal Masala Badam & Kesar Milk',
    brand: 'DesiDhar Shuddh',
    category: 'milk',
    subcategory: 'Flavored Milk',
    images: [
      '/images/products/milk/shuddh-masala-badam-kesar-milk/main-800.webp'
    ],
    variants: [
      { id: 'v-m5-200', weight: '200ml Glass Bottle', price: 55, mrp: 65, stock: 110, sku: 'DD-MILK-KSR-200' },
      { id: 'v-m5-1000', weight: '1 Litre Bottle', price: 240, mrp: 290, stock: 40, sku: 'DD-MILK-KSR-1L' }
    ],
    rating: 4.9,
    reviewCount: 168,
    tags: ['Bestseller', 'Immunity', 'Dry Fruit'],
    isBestseller: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Slow-simmered whole milk infused with Mamra almonds, pistachios, Kashmiri saffron, and organic spices.',
    description: 'Drink it warm on chilly evenings or ice-cold after sports. Loaded with crunchy almond slivers, fragrant cardamom, nutmeg, and authentic saffron threads.',
    ingredients: 'Fresh Whole Milk, Crushed Almonds, Pistachios, Kashmiri Kesar, Cardamom, Cane Sugar, Nutmeg.',
    nutrition: { 'Energy': '145 kcal', 'Protein': '5.2 g', 'Fat': '6.8 g', 'Carbohydrates': '15.5 g' },
    shelfLife: '4 Days refrigerated',
    storage: 'Keep refrigerated below 4°C.'
  },
  {
    id: 'prod-milk-6',
    slug: 'golden-haldi-a2-immun-milk',
    name: 'DesiDhar Vedic Golden Turmeric (Haldi) Milk',
    brand: 'DesiDhar Vedic',
    category: 'milk',
    subcategory: 'Flavored Milk',
    images: [
      '/images/placeholders/category-milk.svg'
    ],
    variants: [
      { id: 'v-m6-500', weight: '500ml Bottle', price: 110, mrp: 135, stock: 50, sku: 'DD-MILK-HLD-500' }
    ],
    rating: 4.8,
    reviewCount: 78,
    tags: ['Immunity Booster', 'Ayurvedic Golden Milk'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Lakadong High-Curcumin Turmeric blended into fresh A2 Gir cow milk with black pepper for maximum absorption.',
    description: 'The ancient Dadi-Nani remedy elevated with certified Meghalaya Lakadong turmeric (7%+ curcumin) and Piperine.',
    ingredients: 'A2 Gir Cow Milk, Lakadong Turmeric, Black Pepper, Cinnamon, Jaggery.',
    nutrition: { 'Energy': '78 kcal', 'Fat': '4.1 g', 'Curcumin': '35 mg' },
    shelfLife: '3 Days',
    storage: 'Refrigerate immediately.'
  },
  {
    id: 'prod-milk-7',
    slug: 'farm-fresh-pasteurized-gold-milk',
    name: 'DesiDhar Gold Standard Homogenized Milk',
    brand: 'DesiDhar Farm',
    category: 'milk',
    subcategory: 'Cow Milk',
    images: [
      '/images/placeholders/category-milk.svg'
    ],
    variants: [
      { id: 'v-m7-1000', weight: '1 Litre Pouch', price: 69, mrp: 76, stock: 95, sku: 'DD-MILK-GLD-1L' }
    ],
    rating: 4.7,
    reviewCount: 110,
    tags: ['Rich Taste', 'Daily Breakfast'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Uniformly smooth milk with consistent cream dispersion. Ideal for barista-grade milk froth.',
    description: 'Specially processed for coffee and tea connoisseurs. The gentle homogenization breaks fat globules evenly, creating velvety cappuccinos and karak adrak chai.',
    ingredients: 'Pasteurized Homogenized Cow Milk.',
    nutrition: { 'Energy': '70 kcal', 'Fat': '4.5 g', 'Protein': '3.3 g' },
    shelfLife: '3 Days',
    storage: 'Refrigerate at 4°C.'
  },
  {
    id: 'prod-milk-8',
    slug: 'pure-raw-cow-colostrum-milk',
    name: 'DesiDhar Rare Cow Colostrum Milk (Cheekh)',
    brand: 'DesiDhar Vedic',
    category: 'milk',
    subcategory: 'Specialty Milk',
    images: [
      '/images/placeholders/category-milk.svg'
    ],
    variants: [
      { id: 'v-m8-500', weight: '500ml Bottle', price: 299, mrp: 399, stock: 15, sku: 'DD-MILK-COL-500' }
    ],
    rating: 4.9,
    reviewCount: 52,
    tags: ['Rare Special', 'Make Kharvas at Home'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'The first post-milking colostrum (Cheekh/Bari). Steam it with jaggery and cardamom to make authentic Kharvas / Junnu.',
    description: 'Highly nutritious, rich in natural immunoglobulins (IgG) and lactoferrin. Sourced ethically after calf has nursed to full satiety.',
    ingredients: '100% Pure First-Day Cow Colostrum Milk.',
    nutrition: { 'Energy': '130 kcal', 'Protein': '14.0 g', 'Fat': '6.5 g', 'Immunoglobulins': 'High' },
    shelfLife: '2 Days (freeze for up to 30 days)',
    storage: 'Deep freeze or steam immediately.'
  },

  // ===================== BUTTER & MAKKHAN (5 products) =====================
  {
    id: 'prod-butter-1',
    slug: 'desi-safed-makkhan',
    name: 'DesiDhar Fresh Desi Safed Makkhan (White Butter)',
    brand: 'DesiDhar Farm',
    category: 'butter',
    subcategory: 'Cultured Butter',
    images: [
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-b1-250', weight: '250g Container', price: 169, mrp: 210, stock: 45, sku: 'DD-BTR-WHT-250' },
      { id: 'v-b1-500', weight: '500g Tub', price: 319, mrp: 399, stock: 40, sku: 'DD-BTR-WHT-500' },
      { id: 'v-b1-1000', weight: '1 kg Economy Pack', price: 599, mrp: 750, stock: 25, sku: 'DD-BTR-WHT-1000' }
    ],
    rating: 4.9,
    reviewCount: 310,
    tags: ['Bestseller', 'Fresh Today', 'Cultured Curd Butter'],
    isBestseller: true,
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Just like Krishna’s favourite! Unsalted, soft, cultured white butter freshly churned from curd malai.',
    description: 'Nothing compares to a dollop of fresh Desi Safed Makkhan melting over hot aloo parathas or sarson ka saag. Cultured with traditional lactic cultures, it possesses a delicate sour note and silk-like softness. Zero added salt, coloring or chemical emulsifiers.',
    ingredients: 'Cultured Cow Milk Cream Butterfat (Unsalted).',
    nutrition: { 'Energy': '740 kcal', 'Milk Fat': '82.5 g', 'Moisture': '16.0 g', 'Salt': '0.0 g' },
    shelfLife: '15 Days refrigerated',
    storage: 'Keep refrigerated between 2°C to 4°C.',
    faqs: [
      { question: 'Does it contain any salt or yellow color?', answer: 'No, it is 100% natural white cultured butter without added salt or coloring.' }
    ]
  },
  {
    id: 'prod-butter-2',
    slug: 'golden-table-butter-salted',
    name: 'DesiDhar Golden Table Butter (Lightly Salted)',
    brand: 'DesiDhar Farm',
    category: 'butter',
    subcategory: 'Table Butter',
    images: [
      '/images/placeholders/category-butter.svg'
    ],
    variants: [
      { id: 'v-b2-100', weight: '100g Bar', price: 62, mrp: 68, stock: 90, sku: 'DD-BTR-SLT-100' },
      { id: 'v-b2-500', weight: '500g Block', price: 285, mrp: 320, stock: 65, sku: 'DD-BTR-SLT-500' }
    ],
    rating: 4.8,
    reviewCount: 198,
    tags: ['Daily Kitchen', 'Baking & Toast'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Rich golden butter made with pasteurized fresh cream and natural rock salt.',
    description: 'Smooth, creamy, and spreadable. Seasoned lightly with Himalayan rock salt for the perfect morning butter toast and baking soft cakes.',
    ingredients: 'Pasteurized Cream, Himalayan Rock Salt, Natural Annatto Color.',
    nutrition: { 'Energy': '725 kcal', 'Fat': '80.5 g', 'Sodium': '680 mg' },
    shelfLife: '60 Days refrigerated',
    storage: 'Store refrigerated.'
  },
  {
    id: 'prod-butter-3',
    slug: 'desi-garlic-coriander-butter',
    name: 'DesiDhar Garlic & Fresh Coriander Makkhan',
    brand: 'DesiDhar Farm',
    category: 'butter',
    subcategory: 'Gourmet Butter',
    images: [
      '/images/placeholders/category-butter.svg'
    ],
    variants: [
      { id: 'v-b3-200', weight: '200g Tub', price: 189, mrp: 230, stock: 35, sku: 'DD-BTR-GAR-200' }
    ],
    rating: 4.7,
    reviewCount: 84,
    tags: ['Gourmet', 'Chef Special'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Crushed roasted garlic, fresh coriander leaves, and sea salt folded into soft cultured makkhan.',
    description: 'Instant gourmet garlic bread, kulchas, and sizzling tandoori rotis! Made with hand-minced garlic and garden coriander.',
    ingredients: 'White Cultured Butter, Roasted Garlic, Fresh Coriander, Sea Salt.',
    nutrition: { 'Energy': '710 kcal', 'Fat': '78 g' },
    shelfLife: '20 Days refrigerated',
    storage: 'Refrigerate at 4°C.'
  },
  {
    id: 'prod-butter-4',
    slug: 'artisanal-unsalted-sweet-cream-butter',
    name: 'DesiDhar Artisanal Sweet Cream Unsalted Butter',
    brand: 'DesiDhar Farm',
    category: 'butter',
    subcategory: 'Baking Butter',
    images: [
      '/images/placeholders/category-butter.svg'
    ],
    variants: [
      { id: 'v-b4-250', weight: '250g Block', price: 175, mrp: 210, stock: 30, sku: 'DD-BTR-UNS-250' },
      { id: 'v-b4-500', weight: '500g Block', price: 325, mrp: 390, stock: 25, sku: 'DD-BTR-UNS-500' }
    ],
    rating: 4.8,
    reviewCount: 62,
    tags: ['Baker Choice', 'Pure Sweet Cream'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'High fat (84%) European-style unsalted butter for flaky croissants, pie crusts, and delicate pastries.',
    description: 'Crafted specifically for bakers. High butterfat and lower moisture ensures maximum puff and tender crumb.',
    ingredients: '100% Pasteurized Sweet Dairy Cream.',
    nutrition: { 'Energy': '755 kcal', 'Fat': '84 g', 'Moisture': '15 g' },
    shelfLife: '45 Days',
    storage: 'Keep refrigerated or frozen.'
  },
  {
    id: 'prod-butter-5',
    slug: 'smoked-chilli-herb-makkhan',
    name: 'DesiDhar Smoked Kashmiri Mirch & Herb Makkhan',
    brand: 'DesiDhar Farm',
    category: 'butter',
    subcategory: 'Gourmet Butter',
    images: [
      '/images/placeholders/category-butter.svg'
    ],
    variants: [
      { id: 'v-b5-200', weight: '200g Tub', price: 195, mrp: 240, stock: 28, sku: 'DD-BTR-SMK-200' }
    ],
    rating: 4.7,
    reviewCount: 46,
    tags: ['Smoky Flavour', 'Spicy'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Applewood smoked white butter blended with mild fragrant Kashmiri degi mirch and thyme.',
    description: 'Add a punch of smoky decadence to grilled corn on the cob, paneer tikka, and warm butter naan.',
    ingredients: 'White Butter, Applewood Smoke Essence, Kashmiri Red Chilli, Thyme, Pink Salt.',
    nutrition: { 'Energy': '720 kcal', 'Fat': '79 g' },
    shelfLife: '20 Days',
    storage: 'Refrigerate at 4°C.'
  },

  // ===================== PANEER (6 products) =====================
  {
    id: 'prod-paneer-1',
    slug: 'farm-fresh-malai-paneer',
    name: 'DesiDhar Farm Fresh Malai Paneer (Ultra Soft)',
    brand: 'DesiDhar Farm',
    category: 'paneer',
    subcategory: 'Malai Paneer',
    images: [
      '/images/products/paneer/farm-fresh-malai-paneer/main-800.webp',
      '/images/products/paneer/farm-fresh-malai-paneer/closeup-800.webp',
      '/images/products/paneer/farm-fresh-malai-paneer/serving-800.webp'
    ],
    variants: [
      { id: 'v-p1-200', weight: '200g Block', price: 110, mrp: 130, stock: 95, sku: 'DD-PNR-MAL-200' },
      { id: 'v-p1-500', weight: '500g Block', price: 255, mrp: 300, stock: 75, sku: 'DD-PNR-MAL-500' },
      { id: 'v-p1-1000', weight: '1 kg Big Chef Block', price: 489, mrp: 580, stock: 35, sku: 'DD-PNR-MAL-1000' }
    ],
    rating: 4.9,
    reviewCount: 440,
    tags: ['Bestseller', 'Fresh Today', 'Deal of Day', 'Cut Fresh'],
    isBestseller: true,
    isFresh: true,
    isDeal: true,
    dealEndsAt: '2026-10-31T23:59:59',
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Cottage cheese that genuinely melts in your mouth! Crafted with full cream milk, non-acidic and cloud-soft.',
    description: 'DesiDhar Malai Paneer is prepared fresh each morning from whole cow and buffalo milk curdled with natural lemon whey, never synthetic acetic acid. It absorbs rich gravies like a sponge and stays luscious even after shallow frying. Zero starch or vegetable fat fillers.',
    ingredients: 'Pasteurized Whole Milk, Natural Lemon Whey.',
    nutrition: {
      'Energy': '296 kcal',
      'Protein': '18.4 g',
      'Fat': '23.5 g',
      'Carbohydrates': '2.6 g',
      'Calcium': '540 mg',
      'Moisture': '52.0%'
    },
    shelfLife: '6 Days refrigerated (immersed in water, change water daily)',
    storage: 'Keep refrigerated at 2°C to 4°C. Submerge unused portions in cold water in an airtight container.',
    faqs: [
      { question: 'Why does supermarket paneer turn rubbery while this stays soft?', answer: 'Supermarket paneer uses chemical acidulants and stabilizers. We press fresh warm curd lightly with cloth weights, preserving natural moisture.' }
    ]
  },
  {
    id: 'prod-paneer-2',
    slug: 'pure-a2-gir-cow-paneer',
    name: 'DesiDhar Certified A2 Gir Cow Milk Paneer',
    brand: 'DesiDhar Vedic',
    category: 'paneer',
    subcategory: 'A2 Paneer',
    images: [
      '/images/products/paneer/pure-a2-gir-cow-paneer/main-800.webp'
    ],
    variants: [
      { id: 'v-p2-200', weight: '200g Block', price: 155, mrp: 185, stock: 50, sku: 'DD-PNR-A2-200' },
      { id: 'v-p2-400', weight: '400g Block', price: 295, mrp: 360, stock: 40, sku: 'DD-PNR-A2-400' }
    ],
    rating: 4.9,
    reviewCount: 175,
    tags: ['A2 Pure', 'Easy Digestion', 'Premium'],
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Made solely from pure A2 Gir cow milk. Exceptionally gentle on children and sensitive digestive systems.',
    description: 'Handcrafted in limited batches from fresh A2 milk. High in digestible protein and bioavailable calcium without causing lactose heaviness.',
    ingredients: 'Pure Fresh A2 Gir Cow Milk, Natural Whey.',
    nutrition: { 'Energy': '280 kcal', 'Protein': '19.2 g', 'Fat': '21.0 g', 'Calcium': '560 mg' },
    shelfLife: '5 Days refrigerated',
    storage: 'Store submerged in water in refrigerator.'
  },
  {
    id: 'prod-paneer-3',
    slug: 'low-fat-high-protein-diet-paneer',
    name: 'DesiDhar High-Protein Low-Fat Diet Paneer',
    brand: 'DesiDhar Farm',
    category: 'paneer',
    subcategory: 'Diet Paneer',
    images: [
      '/images/products/paneer/low-fat-high-protein-diet-paneer/main-800.webp'
    ],
    variants: [
      { id: 'v-p3-200', weight: '200g Pack', price: 115, mrp: 135, stock: 60, sku: 'DD-PNR-DIET-200' },
      { id: 'v-p3-500', weight: '500g Pack', price: 265, mrp: 310, stock: 45, sku: 'DD-PNR-DIET-500' }
    ],
    rating: 4.7,
    reviewCount: 140,
    tags: ['Gym Diet', 'High Protein 24g', 'Low Fat'],
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: '24g protein per 100g with only 4% fat. The ultimate vegetarian muscle recovery staple.',
    description: 'Specially coagulated skimmed milk curd gives a firm, grillable texture packed with natural casein protein.',
    ingredients: 'Double Toned Cow Milk, Natural Coagulant.',
    nutrition: { 'Energy': '145 kcal', 'Protein': '24.0 g', 'Fat': '4.2 g', 'Carbohydrates': '3.1 g' },
    shelfLife: '7 Days',
    storage: 'Refrigerate at 4°C.'
  },
  {
    id: 'prod-paneer-4',
    slug: 'jeera-mint-spiced-fresh-paneer',
    name: 'DesiDhar Roasted Jeera & Mint Spiced Paneer',
    brand: 'DesiDhar Farm',
    category: 'paneer',
    subcategory: 'Flavored Paneer',
    images: [
      '/images/placeholders/category-paneer.svg'
    ],
    variants: [
      { id: 'v-p4-250', weight: '250g Block', price: 145, mrp: 175, stock: 35, sku: 'DD-PNR-JRA-250' }
    ],
    rating: 4.8,
    reviewCount: 92,
    tags: ['Tandoori Ready', 'Snack Special'],
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Infused with roasted cumin seeds, mint leaves, and mild green chillies right during curd setting.',
    description: 'Dice and pan-fry directly for an instant healthy evening snack or slide onto skewers for tandoori tikka.',
    ingredients: 'Fresh Milk, Roasted Cumin (Jeera), Fresh Mint, Black Pepper, Himalayan Salt.',
    nutrition: { 'Energy': '290 kcal', 'Protein': '18.0 g', 'Fat': '22.8 g' },
    shelfLife: '5 Days',
    storage: 'Refrigerate at 4°C.'
  },
  {
    id: 'prod-paneer-5',
    slug: 'smoked-clay-oven-paneer-blocks',
    name: 'DesiDhar Smoked Clay-Oven Paneer Cubes',
    brand: 'DesiDhar Farm',
    category: 'paneer',
    subcategory: 'Gourmet Paneer',
    images: [
      '/images/placeholders/category-paneer.svg'
    ],
    variants: [
      { id: 'v-p5-250', weight: '250g Pre-cut Cubes', price: 155, mrp: 190, stock: 30, sku: 'DD-PNR-SMK-250' }
    ],
    rating: 4.7,
    reviewCount: 68,
    tags: ['Smoky Flavour', 'Pre-Cut'],
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Infused with natural aromatic firewood smoke for genuine Dhaba-style smoky Kadai Paneer flavor.',
    description: 'Pre-diced into bite sized cubes and lightly smoked. Gives your home-cooked curries that authentic rustic charcoal flavour.',
    ingredients: 'Fresh Malai Paneer, Natural Food Smoke Essence.',
    nutrition: { 'Energy': '295 kcal', 'Protein': '18.2 g', 'Fat': '23.0 g' },
    shelfLife: '6 Days',
    storage: 'Refrigerate at 4°C.'
  },
  {
    id: 'prod-paneer-6',
    slug: 'pure-buffalo-malai-paneer',
    name: 'DesiDhar Shuddh Buffalo Malai Paneer',
    brand: 'DesiDhar Shuddh',
    category: 'paneer',
    subcategory: 'Malai Paneer',
    images: [
      '/images/placeholders/category-paneer.svg'
    ],
    variants: [
      { id: 'v-p6-400', weight: '400g Block', price: 230, mrp: 275, stock: 50, sku: 'DD-PNR-BUF-400' }
    ],
    rating: 4.8,
    reviewCount: 118,
    tags: ['Extra Rich', 'Creamy Gravies'],
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Pure buffalo milk paneer with lush texture and high fat content. Supreme richness for Palak Paneer.',
    description: 'Traditional Halwai-grade paneer crafted from high-fat buffalo milk. Extremely soft, heavy, and velvety.',
    ingredients: 'Fresh Buffalo Milk, Natural Whey.',
    nutrition: { 'Energy': '312 kcal', 'Protein': '17.8 g', 'Fat': '26.0 g' },
    shelfLife: '6 Days',
    storage: 'Refrigerate in fresh water.'
  },

  // ===================== CREAM & MALAI (4 products) =====================
  {
    id: 'prod-cream-1',
    slug: 'pure-clotted-desi-malai',
    name: 'DesiDhar Pure Thick Clotted Desi Malai',
    brand: 'DesiDhar Farm',
    category: 'cream',
    subcategory: 'Desi Malai',
    images: [
      '/images/products/cream/pure-clotted-desi-malai/main-800.webp'
    ],
    variants: [
      { id: 'v-c1-250', weight: '250g Jar', price: 145, mrp: 180, stock: 40, sku: 'DD-CRM-MAL-250' },
      { id: 'v-c1-500', weight: '500g Jar', price: 275, mrp: 340, stock: 30, sku: 'DD-CRM-MAL-500' }
    ],
    rating: 4.9,
    reviewCount: 188,
    tags: ['Bestseller', 'Fresh Today', 'Heritage'],
    isBestseller: true,
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Authentic thick cream skin carefully collected from slow-boiled whole milk. Perfect for malai toast and rabdi.',
    description: 'Remember the joy of scooping sweet, thick malai from the top of the milk pot? We collect and chill layers of pure clotted malai without chemicals or thickening starches. Delicious with sugar on warm bread or blended into gravies.',
    ingredients: '100% Whole Milk Clotted Fat Skin.',
    nutrition: { 'Energy': '450 kcal', 'Milk Fat': '48 g', 'Protein': '4.5 g' },
    shelfLife: '5 Days refrigerated',
    storage: 'Keep strictly between 0°C to 4°C.'
  },
  {
    id: 'prod-cream-2',
    slug: 'fresh-dairy-cooking-cream',
    name: 'DesiDhar Fresh Cooking Cream (35% Fat)',
    brand: 'DesiDhar Farm',
    category: 'cream',
    subcategory: 'Cooking Cream',
    images: [
      '/images/placeholders/category-cream.svg'
    ],
    variants: [
      { id: 'v-c2-250', weight: '250ml Pack', price: 95, mrp: 115, stock: 65, sku: 'DD-CRM-CK-250' },
      { id: 'v-c2-500', weight: '500ml Pack', price: 180, mrp: 220, stock: 45, sku: 'DD-CRM-CK-500' },
      { id: 'v-c2-1000', weight: '1 Litre Pack', price: 340, mrp: 410, stock: 25, sku: 'DD-CRM-CK-1000' }
    ],
    rating: 4.8,
    reviewCount: 135,
    tags: ['Restaurant Richness', 'No Curdling'],
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Smooth culinary cream designed to withstand boiling without curdling. The secret to silky Dal Makhani.',
    description: 'Rich pasteurized dairy cream with optimal butterfat content. Blends smoothly into gravies, creamy pasta sauces, and tomato soups.',
    ingredients: 'Pasteurized Dairy Cream.',
    nutrition: { 'Energy': '335 kcal', 'Fat': '35 g', 'Protein': '2.4 g' },
    shelfLife: '20 Days',
    storage: 'Keep refrigerated.'
  },
  {
    id: 'prod-cream-3',
    slug: 'pure-heavy-whipping-cream',
    name: 'DesiDhar Pure Dairy Heavy Whipping Cream (38% Fat)',
    brand: 'DesiDhar Farm',
    category: 'cream',
    subcategory: 'Whipping Cream',
    images: [
      '/images/placeholders/category-cream.svg'
    ],
    variants: [
      { id: 'v-c3-500', weight: '500ml Carton', price: 220, mrp: 265, stock: 35, sku: 'DD-CRM-WHP-500' }
    ],
    rating: 4.8,
    reviewCount: 74,
    tags: ['Real Dairy Whipping', 'No Palm Oil'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: '100% natural dairy cream that whips into stiff glossy peaks. Zero hydrogenated palm oil.',
    description: 'Unlike commercial non-dairy vegetable whips, this is 100% pure cow cream that whips up into heavenly clouds for strawberry sundaes and birthday gateaux.',
    ingredients: 'Pasteurized Heavy Cream.',
    nutrition: { 'Energy': '360 kcal', 'Fat': '38.5 g', 'Protein': '2.2 g' },
    shelfLife: '15 Days',
    storage: 'Refrigerate at 2°C.'
  },
  {
    id: 'prod-cream-4',
    slug: 'royal-kesar-dessert-malai',
    name: 'DesiDhar Royal Kesar & Cardamom Dessert Malai',
    brand: 'DesiDhar Vedic',
    category: 'cream',
    subcategory: 'Flavored Malai',
    images: [
      '/images/placeholders/category-cream.svg'
    ],
    variants: [
      { id: 'v-c4-200', weight: '200g Tub', price: 175, mrp: 215, stock: 25, sku: 'DD-CRM-KSR-200' }
    ],
    rating: 4.9,
    reviewCount: 58,
    tags: ['Royal Dessert', 'Mawa Texture'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Thickened sweetened clotted cream infused with saffron and pistachios. Eat directly as a royal dessert.',
    description: 'Spoon directly over warm Gulab Jamuns, Shahi Tukda, or fresh fruit salad for an instant royal treat.',
    ingredients: 'Pure Milk Malai, Cane Sugar, Kashmiri Saffron, Green Cardamom, Crushed Pistachios.',
    nutrition: { 'Energy': '410 kcal', 'Fat': '40 g', 'Carbohydrates': '18 g' },
    shelfLife: '7 Days',
    storage: 'Keep refrigerated.'
  },

  // ===================== CURD & DAHI (5 products) =====================
  {
    id: 'prod-dahi-1',
    slug: 'traditional-matka-curd',
    name: 'DesiDhar Natural Set Clay Matka Dahi (Pot Curd)',
    brand: 'DesiDhar Farm',
    category: 'curd-dahi',
    subcategory: 'Matka Dahi',
    images: [
      '/images/products/curd-dahi/traditional-matka-curd/main-800.webp',
      '/images/products/curd-dahi/traditional-matka-curd/closeup-800.webp',
      '/images/products/curd-dahi/traditional-matka-curd/packaging-800.webp',
      '/images/products/curd-dahi/traditional-matka-curd/serving-800.webp'
    ],
    variants: [
      { id: 'v-d1-400', weight: '400g Earthen Matka', price: 65, mrp: 75, stock: 85, sku: 'DD-DAHI-MTK-400' },
      { id: 'v-d1-800', weight: '800g Family Matka', price: 120, mrp: 145, stock: 50, sku: 'DD-DAHI-MTK-800' }
    ],
    rating: 4.9,
    reviewCount: 290,
    tags: ['Bestseller', 'Fresh Today', 'Earthen Pot Set', 'Probiotic'],
    isBestseller: true,
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Cultured directly in porous earthen clay pots. The pot naturally absorbs water, leaving rich spoon-thick dahi.',
    description: 'Made using the traditional method: whole pasteurized milk inoculated with authentic desi live starter culture and set inside unglazed clay handis. Clay creates a natural cooling effect and balances acidity, yielding sweet, velvety curd packed with live friendly probiotics.',
    ingredients: 'Pasteurized Whole Milk, Active Lactic Acid Bacterial Cultures.',
    nutrition: { 'Energy': '65 kcal', 'Protein': '3.8 g', 'Fat': '4.2 g', 'Calcium': '150 mg', 'Probiotic Count': '>1 Billion CFU' },
    shelfLife: '6 Days refrigerated',
    storage: 'Keep refrigerated at 4°C.'
  },
  {
    id: 'prod-dahi-2',
    slug: 'pure-cow-milk-thick-dahi',
    name: 'DesiDhar Pure Cow Milk Probiotic Dahi (Tub)',
    brand: 'DesiDhar Farm',
    category: 'curd-dahi',
    subcategory: 'Set Dahi',
    images: [
      '/images/products/curd-dahi/pure-cow-milk-thick-dahi/main-800.webp',
      '/images/products/curd-dahi/pure-cow-milk-thick-dahi/closeup-800.webp',
      '/images/products/curd-dahi/pure-cow-milk-thick-dahi/serving-800.webp'
    ],
    variants: [
      { id: 'v-d2-400', weight: '400g Tub', price: 48, mrp: 55, stock: 110, sku: 'DD-DAHI-COW-400' },
      { id: 'v-d2-1000', weight: '1 kg Bucket', price: 105, mrp: 125, stock: 65, sku: 'DD-DAHI-COW-1000' }
    ],
    rating: 4.8,
    reviewCount: 195,
    tags: ['Daily Kitchen', 'Live Cultures'],
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Uniformly set cow milk curd. Thick, sweet, non-sour, perfect for curd rice, raita, and lassi.',
    description: 'Prepared under sterile dairy conditions with active Streptococcus thermophilus and Lactobacillus bulgaricus.',
    ingredients: 'Pasteurized Cow Milk, Active Probiotics.',
    nutrition: { 'Energy': '62 kcal', 'Protein': '3.6 g', 'Fat': '3.8 g', 'Calcium': '140 mg' },
    shelfLife: '8 Days',
    storage: 'Refrigerate at 4°C.'
  },
  {
    id: 'prod-dahi-3',
    slug: 'authentic-kolkata-baked-mishti-doi',
    name: 'DesiDhar Authentic Kolkata Baked Mishti Doi (Clay Cup)',
    brand: 'DesiDhar Shuddh',
    category: 'curd-dahi',
    subcategory: 'Mishti Doi',
    images: [
      '/images/products/curd-dahi/authentic-kolkata-baked-mishti-doi/main-800.webp',
      '/images/products/curd-dahi/authentic-kolkata-baked-mishti-doi/closeup-800.webp',
      '/images/products/curd-dahi/authentic-kolkata-baked-mishti-doi/serving-800.webp'
    ],
    variants: [
      { id: 'v-d3-200', weight: '200g Clay Handi', price: 55, mrp: 65, stock: 70, sku: 'DD-DAHI-MSH-200' },
      { id: 'v-d3-400', weight: '400g Handi', price: 105, mrp: 125, stock: 45, sku: 'DD-DAHI-MSH-400' }
    ],
    rating: 4.9,
    reviewCount: 210,
    tags: ['Bestseller', 'Kolkata Secret', 'Caramel Sweet'],
    isBestseller: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Slow-caramelized milk sweetened with palm jaggery (Nolen Gur) and baked in earthen cups.',
    description: 'The real deal from Bengal! Whole milk reduced to half volume, enriched with golden caramelized jaggery syrup and set inside terracotta pots for that authentic smoky caramel flavor.',
    ingredients: 'Reduced Milk, Nolen Gur (Date Palm Jaggery), Natural Caramel Sugar, Active Cultures.',
    nutrition: { 'Energy': '142 kcal', 'Protein': '4.2 g', 'Fat': '5.0 g', 'Carbohydrates': '20.0 g' },
    shelfLife: '10 Days refrigerated',
    storage: 'Refrigerate at 4°C.'
  },
  {
    id: 'prod-dahi-4',
    slug: 'alphonso-mango-greek-dahi',
    name: 'DesiDhar Alphonso Mango Strained Greek Dahi',
    brand: 'DesiDhar Farm',
    category: 'curd-dahi',
    subcategory: 'Flavored Dahi',
    images: [
      '/images/products/curd-dahi/alphonso-mango-greek-dahi/main-800.webp',
      '/images/products/curd-dahi/alphonso-mango-greek-dahi/closeup-800.webp',
      '/images/products/curd-dahi/alphonso-mango-greek-dahi/serving-800.webp'
    ],
    variants: [
      { id: 'v-d4-200', weight: '200g Cup', price: 65, mrp: 79, stock: 55, sku: 'DD-DAHI-MNG-200' },
      { id: 'v-d4-400', weight: '400g Tub', price: 120, mrp: 149, stock: 35, sku: 'DD-DAHI-MNG-400' }
    ],
    rating: 4.8,
    reviewCount: 95,
    tags: ['Ratnagiri Alphonso', 'High Protein Snack'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Double-strained Greek curd blended with 100% natural Ratnagiri Alphonso mango pulp.',
    description: 'Thick as soft-serve ice cream with twice the protein of normal curd and pure tropical mango sweetness.',
    ingredients: 'Strained Yogurt, Alphonso Mango Pulp (25%), Raw Cane Sugar, Probiotic Strains.',
    nutrition: { 'Energy': '115 kcal', 'Protein': '7.5 g', 'Fat': '3.2 g', 'Carbohydrates': '14.0 g' },
    shelfLife: '12 Days',
    storage: 'Refrigerate at 4°C.'
  },
  {
    id: 'prod-dahi-5',
    slug: 'desi-tadka-masala-chaas-buttermilk',
    name: 'DesiDhar Spiced Desi Masala Chaas (Buttermilk)',
    brand: 'DesiDhar Farm',
    category: 'curd-dahi',
    subcategory: 'Chaas & Buttermilk',
    images: [
      '/images/products/curd-dahi/desi-tadka-masala-chaas-buttermilk/main-800.webp',
      '/images/products/curd-dahi/desi-tadka-masala-chaas-buttermilk/closeup-800.webp',
      '/images/products/curd-dahi/desi-tadka-masala-chaas-buttermilk/serving-800.webp'
    ],
    variants: [
      { id: 'v-d5-300', weight: '300ml Bottle', price: 28, mrp: 35, stock: 120, sku: 'DD-DAHI-CHS-300' },
      { id: 'v-d5-1000', weight: '1 Litre Bottle', price: 75, mrp: 90, stock: 60, sku: 'DD-DAHI-CHS-1000' }
    ],
    rating: 4.8,
    reviewCount: 165,
    tags: ['Digestive Drink', 'Roasted Jeera'],
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'The real residual cultured buttermilk from makkhan churning, tempered with roasted cumin, mint, and black salt.',
    description: 'Cooling, digestive elixir for summer days. Authentic cultured buttermilk that aids digestion after heavy meals.',
    ingredients: 'Cultured Churned Buttermilk, Mint Paste, Roasted Jeera, Hing, Kala Namak, Ginger Juice.',
    nutrition: { 'Energy': '28 kcal', 'Protein': '1.8 g', 'Fat': '1.0 g', 'Sodium': '320 mg' },
    shelfLife: '4 Days',
    storage: 'Refrigerate at 4°C.'
  },

  // ===================== ARTISANAL CHEESE (4 products) =====================
  {
    id: 'prod-cheese-1',
    slug: 'fresh-desi-mozzarella-bocconcini',
    name: 'DesiDhar Fresh Buffalo Mozzarella Bocconcini in Whey',
    brand: 'DesiDhar Farm',
    category: 'cheese',
    subcategory: 'Fresh Mozzarella',
    images: [
      '/images/placeholders/category-cheese.svg'
    ],
    variants: [
      { id: 'v-ch1-200', weight: '200g Tub (In Whey)', price: 185, mrp: 225, stock: 35, sku: 'DD-CHS-MOZ-200' },
      { id: 'v-ch1-400', weight: '400g Tub', price: 345, mrp: 420, stock: 20, sku: 'DD-CHS-MOZ-400' }
    ],
    rating: 4.8,
    reviewCount: 112,
    tags: ['Pizza Essential', 'Veg Rennet', 'Artisanal'],
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Hand-stretched fresh mozzarella balls made from high-fat buffalo milk. Supreme pizza stretch and juicy caprese salad.',
    description: 'Crafted using Italian pasta-filata techniques using fresh Indian buffalo milk. Kept in natural sea-salt whey for optimum moisture.',
    ingredients: 'Pasteurized Buffalo Milk, Microbial Vegetarian Rennet, Starter Culture, Sea Salt.',
    nutrition: { 'Energy': '280 kcal', 'Protein': '21.0 g', 'Fat': '22.0 g', 'Calcium': '510 mg' },
    shelfLife: '14 Days in whey',
    storage: 'Refrigerate at 2°C to 4°C.'
  },
  {
    id: 'prod-cheese-2',
    slug: 'desi-cow-milk-cheddar-block',
    name: 'DesiDhar Farmhouse Aged Cow Milk Cheddar',
    brand: 'DesiDhar Farm',
    category: 'cheese',
    subcategory: 'Aged Cheese',
    images: [
      'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-ch2-200', weight: '200g Block', price: 220, mrp: 265, stock: 30, sku: 'DD-CHS-CHD-200' },
      { id: 'v-ch2-500', weight: '500g Block', price: 495, mrp: 620, stock: 20, sku: 'DD-CHS-CHD-500' }
    ],
    rating: 4.7,
    reviewCount: 78,
    tags: ['Aged 6 Months', 'Sharp Flavour'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Naturally aged for 6 months in cool cellars. Sharp, crumbly, and melts into silky cheese toasts.',
    description: '100% pure cow milk cheddar made with vegetarian microbial enzymes without preservatives.',
    ingredients: 'Pasteurized Cow Milk, Salt, Vegetarian Culture, Vegetarian Rennet.',
    nutrition: { 'Energy': '402 kcal', 'Protein': '25.0 g', 'Fat': '33.0 g' },
    shelfLife: '6 Months',
    storage: 'Keep refrigerated in wax paper.'
  },
  {
    id: 'prod-cheese-3',
    slug: 'pure-milk-cheese-slices-cubes',
    name: 'DesiDhar Pure Milk Processed Cheese Slices & Cubes',
    brand: 'DesiDhar Farm',
    category: 'cheese',
    subcategory: 'Processed Cheese',
    images: [
      '/images/placeholders/category-cheese.svg'
    ],
    variants: [
      { id: 'v-ch3-200', weight: '200g (10 Slices)', price: 135, mrp: 155, stock: 80, sku: 'DD-CHS-SLC-200' },
      { id: 'v-ch3-500', weight: '500g Cube Block', price: 310, mrp: 360, stock: 50, sku: 'DD-CHS-CUB-500' }
    ],
    rating: 4.8,
    reviewCount: 156,
    tags: ['Kid Favorite', 'Quick Melt'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Real cheese made from cheddar and cow milk, not palm oil emulsion. Super creamy melting for sandwiches.',
    description: 'Pure cheese satisfaction! Melts evenly on parathas, dosas, burgers, and Bombay toasties.',
    ingredients: 'Cheese (Pasteurized Milk, Microbial Culture, Salt), Water, Milk Solids, Emulsifying Salts.',
    nutrition: { 'Energy': '310 kcal', 'Protein': '18.0 g', 'Fat': '24.0 g' },
    shelfLife: '6 Months',
    storage: 'Refrigerate at 4°C.'
  },
  {
    id: 'prod-cheese-4',
    slug: 'artisanal-fresh-soft-chhena',
    name: 'DesiDhar Artisanal Fresh Soft Chhena',
    brand: 'DesiDhar Farm',
    category: 'cheese',
    subcategory: 'Fresh Chhena',
    images: [
      '/images/placeholders/category-cheese.svg'
    ],
    variants: [
      { id: 'v-ch4-250', weight: '250g Container', price: 125, mrp: 150, stock: 40, sku: 'DD-CHS-CHN-250' },
      { id: 'v-ch4-500', weight: '500g Container', price: 235, mrp: 285, stock: 30, sku: 'DD-CHS-CHN-500' }
    ],
    rating: 4.9,
    reviewCount: 92,
    tags: ['Fresh Today', 'Make Sweets at Home'],
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Unpressed moist curd (Chhena) freshly coagulated from sweet cow milk. The vital base for Rasgullas and Sandesh.',
    description: 'Perfect for passionate home sweetmakers and health foodies. Knead it directly into smooth chhena balls or eat with honey and fruits.',
    ingredients: 'Fresh Cow Milk, Lemon Coagulant Whey.',
    nutrition: { 'Energy': '210 kcal', 'Protein': '16.5 g', 'Fat': '14.0 g' },
    shelfLife: '4 Days',
    storage: 'Keep refrigerated.'
  },

  // ===================== PURE DESI MITHAI (9 products) =====================
  {
    id: 'prod-sweet-1',
    slug: 'shuddh-desi-ghee-kaju-katli',
    name: 'DesiDhar Shuddh Desi Ghee Diamond Kaju Katli',
    hindiName: 'काजू कतली',
    brand: 'DesiDhar Shuddh',
    category: 'mithai',
    subcategory: 'Cashew Sweets',
    sweetType: 'barfi',
    originRegion: 'Rajasthan & North India',
    images: [
      '/images/products/mithai/shuddh-desi-ghee-kaju-katli/main-800.webp',
      '/images/products/mithai/shuddh-desi-ghee-kaju-katli/serving-800.webp'
    ],
    variants: [
      { id: 'v-s1-250', weight: '250g Box (10-12 pcs)', price: 295, mrp: 350, stock: 65, sku: 'DD-SWT-KAJU-250' },
      { id: 'v-s1-500', weight: '500g Festive Box (20-24 pcs)', price: 565, mrp: 680, stock: 55, sku: 'DD-SWT-KAJU-500' },
      { id: 'v-s1-1000', weight: '1 kg Royal Gift Box (40-48 pcs)', price: 1090, mrp: 1350, stock: 35, sku: 'DD-SWT-KAJU-1000' }
    ],
    rating: 4.9,
    reviewCount: 420,
    tags: ['Bestseller', 'Festive Special', 'Pure Cashew', 'Deal of Day', 'A2 Pure Ghee'],
    highlights: [
      { text: 'Made with 75% whole premium Goan cashews' },
      { text: 'Cooked in authentic DesiDhar Bilona Cow Ghee' },
      { text: 'Genuine 100% vegetarian silver leaf vark' },
      { text: 'Zero peanut adulteration or flour mixing' },
      { text: 'Freshly batch-crafted daily' }
    ],
    isBestseller: true,
    isDeal: true,
    dealEndsAt: '2026-10-31T23:59:59',
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: '75% pure premium Goan cashew paste slow-simmered in DesiDhar Vedic Bilona Ghee. Melt-in-mouth diamond cuts.',
    description: 'Thin, melt-in-mouth diamond cuts crafted exclusively from premium whole cashew nuts, sulfur-free organic cane sugar, and pure A2 cow ghee. Finished with pristine 100% vegetarian certified silver leaf vark and garnished with pistachios. No peanuts, no flour, no artificial flavorings — just pure, silky, nutty royal indulgence.',
    ingredients: 'Whole Goan Cashews (75%), Organic Cane Sugar, DesiDhar Vedic Cow Ghee, Vegetarian Silver Leaf (Vark), Green Cardamom.',
    nutrition: {
      'Energy': '478 kcal',
      'Protein': '11.2 g',
      'Total Fat': '24.5 g',
      'Saturated Fat': '4.8 g',
      'Carbohydrates': '52.0 g',
      'Sugars': '38.2 g',
      'Sodium': '18 mg'
    },
    shelfLife: '30 Days from packing date',
    storage: 'Store in an airtight container in a cool, dry place away from sunlight. Do not refrigerate to preserve soft texture.',
    faqs: [
      { question: 'Is the silver foil (vark) vegetarian?', answer: 'Yes, 100%. We use certified machine-beaten vegetarian silver foil with zero animal involvement.' },
      { question: 'Is there any peanut or flour added?', answer: 'Strictly zero. Only pure Grade-A Goan cashew nuts and pure desi ghee.' },
      { question: 'How long does Kaju Katli stay fresh?', answer: 'Up to 30 days at room temperature when stored in an airtight box.' }
    ]
  },
  {
    id: 'prod-sweet-2',
    slug: 'desi-ghee-gulab-jamun',
    name: 'DesiDhar Shuddh Ghee Angoori Gulab Jamun',
    brand: 'DesiDhar Shuddh',
    category: 'mithai',
    subcategory: 'Mawa Sweets',
    images: [
      '/images/products/mithai/desi-ghee-gulab-jamun/main-800.webp',
      '/images/products/mithai/desi-ghee-gulab-jamun/closeup-800.webp',
      '/images/products/mithai/desi-ghee-gulab-jamun/serving-800.webp'
    ],
    variants: [
      { id: 'v-s2-500', weight: '500g Container (12 pcs)', price: 245, mrp: 295, stock: 50, sku: 'DD-SWT-GJ-500' },
      { id: 'v-s2-1000', weight: '1 kg Container (24 pcs)', price: 460, mrp: 570, stock: 40, sku: 'DD-SWT-GJ-1000' }
    ],
    rating: 4.9,
    reviewCount: 380,
    tags: ['Bestseller', 'Fresh Today', 'Fried in Pure Ghee'],
    isBestseller: true,
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Hand-rolled fresh mawa dumplings slow fried in Desi Ghee and soaked in rose-cardamom saffron syrup.',
    description: 'Super soft, feather-light gulab jamuns that soak up syrup to their very core. Made with fresh reduced mawa and fried exclusively in pure cow ghee.',
    ingredients: 'Fresh Cow Milk Mawa (Khoya), Chhena, Cow Ghee, Sugar Syrup, Rose Water, Green Cardamom, Saffron.',
    nutrition: { 'Energy': '360 kcal', 'Protein': '6.8 g', 'Fat': '14.5 g', 'Carbohydrates': '50.0 g' },
    shelfLife: '10 Days (warm before eating)',
    storage: 'Keep refrigerated once opened.'
  },
  {
    id: 'prod-sweet-3',
    slug: 'royal-kesari-rasmalai',
    name: 'DesiDhar Royal Kesari Chhena Rasmalai',
    brand: 'DesiDhar Shuddh',
    category: 'mithai',
    subcategory: 'Chhena Sweets',
    images: [
      '/images/products/mithai/royal-kesari-rasmalai/main-800.webp',
      '/images/products/mithai/royal-kesari-rasmalai/closeup-800.webp',
      '/images/products/mithai/royal-kesari-rasmalai/serving-800.webp'
    ],
    variants: [
      { id: 'v-s3-500', weight: '500g (5 Large Pcs)', price: 295, mrp: 350, stock: 45, sku: 'DD-SWT-RM-500' },
      { id: 'v-s3-1000', weight: '1 kg (10 Large Pcs)', price: 560, mrp: 680, stock: 30, sku: 'DD-SWT-RM-1000' }
    ],
    rating: 4.9,
    reviewCount: 310,
    tags: ['Bestseller', 'Fresh Today', 'Cold Chain'],
    isBestseller: true,
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Delicate spongey cottage cheese discs soaked in saffron-pistachio thickened milk (Rabdi).',
    description: 'Served chilled. Fresh soft cow chhena discs swimming in slow-reduced rabdi infused with hand-picked Kashmiri saffron, crushed pistachios, and almond slivers.',
    ingredients: 'Fresh Cow Milk Chhena, Condensed Milk, Cane Sugar, Kashmiri Saffron, Pistachios, Cardamom.',
    nutrition: { 'Energy': '245 kcal', 'Protein': '8.2 g', 'Fat': '9.5 g', 'Carbohydrates': '31.0 g' },
    shelfLife: '4 Days refrigerated',
    storage: 'Must be stored refrigerated below 4°C.'
  },
  {
    id: 'prod-sweet-4',
    slug: 'bengali-sponge-rasgulla',
    name: 'DesiDhar Traditional Bengali Sponge Rasgulla',
    brand: 'DesiDhar Shuddh',
    category: 'mithai',
    subcategory: 'Chhena Sweets',
    images: [
      '/images/products/mithai/bengali-sponge-rasgulla/main-800.webp',
      '/images/products/mithai/bengali-sponge-rasgulla/closeup-800.webp',
      '/images/products/mithai/bengali-sponge-rasgulla/serving-800.webp'
    ],
    variants: [
      { id: 'v-s4-500', weight: '500g Can (8 Pcs)', price: 185, mrp: 220, stock: 60, sku: 'DD-SWT-RSG-500' },
      { id: 'v-s4-1000', weight: '1 kg Box (16 Pcs)', price: 340, mrp: 410, stock: 45, sku: 'DD-SWT-RSG-1000' }
    ],
    rating: 4.8,
    reviewCount: 260,
    tags: ['100% Cow Milk Chhena', 'Juicy'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Spongy, snow-white chhena spheres simmered in light sugar syrup. Squeezes and bounces back gracefully.',
    description: 'Authentic recipe perfected by Bengali karigars. Pure cow milk gives it that distinct spongy bounce and juicy sweetness.',
    ingredients: 'Pure Cow Milk Chhena, Purified Water, Sugar, Rose Water.',
    nutrition: { 'Energy': '190 kcal', 'Protein': '4.5 g', 'Fat': '1.8 g', 'Carbohydrates': '39.0 g' },
    shelfLife: '30 Days sealed',
    storage: 'Store at room temperature or chilled.'
  },
  {
    id: 'prod-sweet-5',
    slug: 'shuddh-ghee-motichoor-ladoo',
    name: 'DesiDhar Shuddh Ghee Kesari Motichoor Ladoo',
    brand: 'DesiDhar Shuddh',
    category: 'mithai',
    subcategory: 'Ladoo',
    images: [
      '/images/products/mithai/shuddh-ghee-motichoor-ladoo/main-800.webp',
      '/images/products/mithai/shuddh-ghee-motichoor-ladoo/closeup-800.webp',
      '/images/products/mithai/shuddh-ghee-motichoor-ladoo/serving-800.webp'
    ],
    variants: [
      { id: 'v-s5-250', weight: '250g Box', price: 195, mrp: 235, stock: 60, sku: 'DD-SWT-MOTI-250' },
      { id: 'v-s5-500', weight: '500g Box', price: 375, mrp: 450, stock: 50, sku: 'DD-SWT-MOTI-500' },
      { id: 'v-s5-1000', weight: '1 kg Box', price: 720, mrp: 880, stock: 35, sku: 'DD-SWT-MOTI-1000' }
    ],
    rating: 4.8,
    reviewCount: 290,
    tags: ['Bestseller', 'Puja Special', 'Pure Ghee'],
    isBestseller: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Tiny besan pearls fried in pure Desi Ghee, dipped in aromatic saffron syrup and shaped with melon seeds.',
    description: 'The auspicious sweet for every temple puja and Indian festival. Made with fine gram flour boondis fried only in DesiDhar cow ghee.',
    ingredients: 'Gram Flour (Besan), Desi Cow Ghee, Sugar Syrup, Magaz (Melon Seeds), Saffron, Pistachios.',
    nutrition: { 'Energy': '430 kcal', 'Protein': '6.5 g', 'Fat': '20.0 g', 'Carbohydrates': '56.0 g' },
    shelfLife: '15 Days',
    storage: 'Cool dry place.'
  },
  {
    id: 'prod-sweet-6',
    slug: 'authentic-mathura-peda',
    name: 'DesiDhar Authentic Mathura Peda (Caramelized Mawa)',
    brand: 'DesiDhar Shuddh',
    category: 'mithai',
    subcategory: 'Peda & Barfi',
    images: [
      '/images/products/mithai/authentic-mathura-peda/main-800.webp',
      '/images/products/mithai/authentic-mathura-peda/closeup-800.webp',
      '/images/products/mithai/authentic-mathura-peda/serving-800.webp'
    ],
    variants: [
      { id: 'v-s6-250', weight: '250g Box', price: 210, mrp: 250, stock: 45, sku: 'DD-SWT-PEDA-250' },
      { id: 'v-s6-500', weight: '500g Box', price: 395, mrp: 480, stock: 40, sku: 'DD-SWT-PEDA-500' }
    ],
    rating: 4.9,
    reviewCount: 165,
    tags: ['Mathura Heritage', 'Brij Bhoomi'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Slow-roasted browned khoya dusted with boora sugar and green cardamom. The timeless prasad of Shri Krishna.',
    description: 'Milk mawa is browned slowly in brass pans until it takes on a deep roasted hazelnut shade and nutty aroma, then rolled in traditional coarse boora sugar.',
    ingredients: 'Browned Cow Milk Mawa, Desi Ghee, Boora Cane Sugar, Cardamom Powder.',
    nutrition: { 'Energy': '415 kcal', 'Protein': '9.5 g', 'Fat': '18.0 g', 'Carbohydrates': '54.0 g' },
    shelfLife: '20 Days',
    storage: 'Room temperature.'
  },
  {
    id: 'prod-sweet-7',
    slug: 'roasted-pista-khoya-barfi',
    name: 'DesiDhar Roasted Pista Khoya Barfi',
    brand: 'DesiDhar Shuddh',
    category: 'mithai',
    subcategory: 'Peda & Barfi',
    images: [
      '/images/products/mithai/roasted-pista-khoya-barfi/main-800.webp',
      '/images/products/mithai/roasted-pista-khoya-barfi/closeup-800.webp',
      '/images/products/mithai/roasted-pista-khoya-barfi/serving-800.webp'
    ],
    variants: [
      { id: 'v-s7-250', weight: '250g Box', price: 235, mrp: 280, stock: 40, sku: 'DD-SWT-BRF-250' },
      { id: 'v-s7-500', weight: '500g Box', price: 445, mrp: 540, stock: 35, sku: 'DD-SWT-BRF-500' }
    ],
    rating: 4.7,
    reviewCount: 120,
    tags: ['Rich Mawa', 'Festive'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Soft white mawa fudge generously crowned with slivered Iranian pistachios and green cardamom.',
    description: 'Creamy and satisfying, prepared from whole milk khoya cooked gently to preserve its delicate milky sweetness.',
    ingredients: 'Fresh Cow Milk Mawa, Sugar, Roasted Pistachios, Cardamom.',
    nutrition: { 'Energy': '425 kcal', 'Protein': '8.8 g', 'Fat': '19.5 g' },
    shelfLife: '12 Days',
    storage: 'Refrigerate in hot weather.'
  },
  {
    id: 'prod-sweet-8',
    slug: 'flaky-desi-ghee-soan-papdi',
    name: 'DesiDhar Flaky Patisa Soan Papdi in Desi Ghee',
    brand: 'DesiDhar Shuddh',
    category: 'mithai',
    subcategory: 'Flaky Mithai',
    images: [
      '/images/products/mithai/flaky-desi-ghee-soan-papdi/main-800.webp',
      '/images/products/mithai/flaky-desi-ghee-soan-papdi/closeup-800.webp',
      '/images/products/mithai/flaky-desi-ghee-soan-papdi/packaging-800.webp',
      '/images/products/mithai/flaky-desi-ghee-soan-papdi/serving-800.webp'
    ],
    variants: [
      { id: 'v-s8-250', weight: '250g Box', price: 165, mrp: 195, stock: 70, sku: 'DD-SWT-SOAN-250' },
      { id: 'v-s8-500', weight: '500g Box', price: 310, mrp: 380, stock: 55, sku: 'DD-SWT-SOAN-500' }
    ],
    rating: 4.7,
    reviewCount: 185,
    tags: ['Airy & Flaky', 'Crisp Threads'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Extremely delicate, melt-on-the-tongue crisp spun sugar and roasted besan threads prepared in pure cow ghee.',
    description: 'Not the dry industrial stuff! Our artisans hand-pull hot sugar syrup into thousands of gossamer threads packed with pistachios and almonds.',
    ingredients: 'Desi Cow Ghee, Gram Flour (Besan), Refined Wheat Flour, Sugar, Cardamom, Almonds, Pistachios.',
    nutrition: { 'Energy': '490 kcal', 'Protein': '5.5 g', 'Fat': '26.0 g', 'Carbohydrates': '58.0 g' },
    shelfLife: '45 Days sealed',
    storage: 'Airtight dry container.'
  },
  {
    id: 'prod-sweet-9',
    slug: 'royal-shahi-besan-ladoo',
    name: 'DesiDhar Shahi Danedaar Besan Ladoo',
    brand: 'DesiDhar Shuddh',
    category: 'mithai',
    subcategory: 'Ladoo',
    images: [
      '/images/placeholders/category-mithai.svg'
    ],
    variants: [
      { id: 'v-s9-250', weight: '250g Box', price: 195, mrp: 235, stock: 50, sku: 'DD-SWT-BSN-250' },
      { id: 'v-s9-500', weight: '500g Box', price: 375, mrp: 450, stock: 40, sku: 'DD-SWT-BSN-500' },
      { id: 'v-s9-1000', weight: '1 kg Box', price: 710, mrp: 860, stock: 25, sku: 'DD-SWT-BSN-1000' }
    ],
    rating: 4.8,
    reviewCount: 230,
    tags: ['Danedaar', 'Winter Favorite', 'Pure Ghee'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Coarse chana dal roasted for 45 minutes in Desi Ghee until fragrant, blended with boora sugar and magaz.',
    description: 'The quintessential warmth of mother’s kitchen. Doesn’t stick to the roof of your mouth because we roast coarse roasted besan patiently.',
    ingredients: 'Coarse Gram Flour, Desi Ghee, Boora Sugar, Nutmeg, Cardamom, Cashews, Almonds.',
    nutrition: { 'Energy': '470 kcal', 'Protein': '8.2 g', 'Fat': '24.0 g' },
    shelfLife: '30 Days',
    storage: 'Store in airtight box.'
  },

  // ===================== COMBO PACKS (5 products) =====================
  {
    id: 'prod-combo-1',
    slug: 'daily-morning-essentials-combo',
    name: 'DesiDhar Daily Morning Breakfast Essentials Combo',
    brand: 'DesiDhar Farm',
    category: 'combo-packs',
    subcategory: 'Daily Bundles',
    images: [
      '/images/products/combo-packs/daily-morning-essentials-combo/main-800.webp'
    ],
    variants: [
      { id: 'v-cb1-std', weight: 'Standard Bundle', price: 299, mrp: 360, stock: 50, sku: 'DD-CMB-BRK-STD' }
    ],
    rating: 4.9,
    reviewCount: 220,
    tags: ['Bestseller', 'Save ₹61', 'Daily Drop'],
    isBestseller: true,
    isFresh: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Includes: 1L Farm Fresh Milk + 400g Clay Matka Dahi + 250g Safed Makkhan. Everything for a royal Indian breakfast.',
    description: 'Your complete morning dairy delivery in one convenient click. Save 17% compared to individual items.',
    ingredients: 'Fresh Milk, Matka Curd, White Butter.',
    nutrition: { 'Complete Breakfast Nutrition': 'High Protein, Probiotics & Calcium' },
    shelfLife: '3 to 6 Days',
    storage: 'Keep refrigerated.'
  },
  {
    id: 'prod-combo-2',
    slug: 'royal-shahi-feast-combo',
    name: 'DesiDhar Shahi Curry Feast Combo (Paneer + Cream + Ghee)',
    brand: 'DesiDhar Shuddh',
    category: 'combo-packs',
    subcategory: 'Feast Bundles',
    images: [
      '/images/products/combo-packs/royal-shahi-feast-combo/main-800.webp'
    ],
    variants: [
      { id: 'v-cb2-std', weight: 'Family Feast Pack', price: 749, mrp: 940, stock: 40, sku: 'DD-CMB-SHH-STD' }
    ],
    rating: 4.9,
    reviewCount: 165,
    tags: ['Save ₹191', 'Weekend Special'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Includes: 500g Farm Fresh Malai Paneer + 250ml Fresh Cooking Cream + 500ml Shuddh Danedaar Cow Ghee.',
    description: 'Cook royal Shahi Paneer, Paneer Makhani, or Dal Makhani like a 5-star chef right at home.',
    ingredients: 'Malai Paneer, Dairy Cooking Cream, Cow Ghee.',
    nutrition: { 'Culinary Grade': '100% Pure Dairy' },
    shelfLife: 'Varied (check individual packs)',
    storage: 'Refrigerate paneer & cream.'
  },
  {
    id: 'prod-combo-3',
    slug: 'sweet-celebration-duo-combo',
    name: 'DesiDhar Sweet Celebration Duo (Kaju Katli + Gulab Jamun)',
    brand: 'DesiDhar Shuddh',
    category: 'combo-packs',
    subcategory: 'Mithai Bundles',
    images: [
      '/images/products/mithai/shuddh-desi-ghee-kaju-katli/serving-800.webp'
    ],
    variants: [
      { id: 'v-cb3-std', weight: '1 kg Total (500g + 500g)', price: 749, mrp: 975, stock: 45, sku: 'DD-CMB-SWT-STD' }
    ],
    rating: 4.9,
    reviewCount: 195,
    tags: ['Save ₹226', 'Festive Favorite'],
    isBestseller: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Includes: 500g Diamond Kaju Katli + 500g Desi Ghee Gulab Jamun. The unbeatable festive combination.',
    description: 'Delight guests or gift to family. Handcrafted sweets in 100% pure desi ghee.',
    ingredients: 'Cashews, Mawa, Ghee, Sugar.',
    nutrition: { 'Energy': 'Rich Festive Treat' },
    shelfLife: '10 to 30 Days',
    storage: 'Store in cool place.'
  },
  {
    id: 'prod-combo-4',
    slug: 'ayurvedic-wellness-a2-bundle',
    name: 'DesiDhar Ayurvedic Immunity & Vitality A2 Bundle',
    brand: 'DesiDhar Vedic',
    category: 'combo-packs',
    subcategory: 'Wellness Bundles',
    images: [
      '/images/products/combo-packs/ayurvedic-wellness-a2-bundle/main-800.webp',
      '/images/products/combo-packs/ayurvedic-wellness-a2-bundle/ghee-800.webp',
      '/images/products/combo-packs/ayurvedic-wellness-a2-bundle/milk-800.webp'
    ],
    variants: [
      { id: 'v-cb4-std', weight: 'Wellness Pack', price: 1899, mrp: 2390, stock: 25, sku: 'DD-CMB-AYU-STD' }
    ],
    rating: 4.9,
    reviewCount: 88,
    tags: ['Ayurvedic', 'Save ₹491'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Includes: 1L Gir Cow A2 Bilona Ghee + 500ml Lakadong Turmeric A2 Milk + 250ml Brahmi Medhya Ghee.',
    description: 'Nourish mind, joints, and gut with authentic Vedic dairy formulated according to Ayurvedic traditions.',
    ingredients: 'A2 Ghee, Herb Infusions, A2 Milk.',
    nutrition: { 'Ayurvedic Rasayana': 'High Ojas' },
    shelfLife: '9 Months (Ghee)',
    storage: 'Cool dry pantry.'
  },
  {
    id: 'prod-combo-5',
    slug: 'dairy-protein-fitness-pack',
    name: 'DesiDhar High-Protein Vegetarian Fitness Pack',
    brand: 'DesiDhar Farm',
    category: 'combo-packs',
    subcategory: 'Fitness Bundles',
    images: [
      '/images/products/combo-packs/dairy-protein-fitness-pack/main-800.webp',
      '/images/products/combo-packs/dairy-protein-fitness-pack/paneer-800.webp',
      '/images/products/combo-packs/dairy-protein-fitness-pack/closeup-800.webp'
    ],
    variants: [
      { id: 'v-cb5-std', weight: 'Weekly Fitness Pack', price: 449, mrp: 545, stock: 35, sku: 'DD-CMB-FIT-STD' }
    ],
    rating: 4.8,
    reviewCount: 110,
    tags: ['Fitness', 'Save ₹96', '90g+ Protein Total'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Includes: 400g Diet Paneer (96g protein) + 400g Greek Strained Curd + 1L Toned Cow Milk.',
    description: 'Fuel your active lifestyle with clean, natural vegetarian dairy protein without synthetic whey powders.',
    ingredients: 'Low-fat Paneer, Strained Greek Yogurt, Toned Milk.',
    nutrition: { 'Total Protein in Pack': '110+ grams' },
    shelfLife: '6 Days',
    storage: 'Keep refrigerated.'
  },

  // ===================== GIFT BOXES (4 products) =====================
  {
    id: 'prod-gift-1',
    slug: 'royal-shahi-heritage-brass-mithai-box',
    name: 'DesiDhar Royal Shahi Heritage Brass Box (1.2kg Assorted Sweets)',
    brand: 'DesiDhar Shuddh',
    category: 'gift-boxes',
    subcategory: 'Royal Hampers',
    images: [
      '/images/products/mithai/shuddh-desi-ghee-kaju-katli/packaging-800.webp'
    ],
    variants: [
      { id: 'v-gb1-1200', weight: '1.2 kg Heritage Box', price: 1499, mrp: 1899, stock: 30, sku: 'DD-GFT-ROY-1200' }
    ],
    rating: 4.9,
    reviewCount: 140,
    tags: ['Luxury Gifting', 'Brass Matka Keepsake', 'Diwali & Wedding'],
    isBestseller: true,
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Presented in an antique-finish handcrafted brass keepsake box. Contains Kaju Katli, Pista Barfi, Besan Ladoo, and Mathura Peda.',
    description: 'The epitome of traditional Indian gifting. The embossed brass box is reusable as an heirloom jewelry box, accompanied by a festive greeting card.',
    ingredients: 'Assorted Shuddh Ghee Sweets (Cashew, Mawa, Besan, Saffron, Pistachios).',
    nutrition: { 'Royal Assortment': 'Handcrafted in 100% Desi Ghee' },
    shelfLife: '20 Days',
    storage: 'Store in a cool dry place.'
  },
  {
    id: 'prod-gift-2',
    slug: 'vedic-a2-ghee-raw-honey-wooden-box',
    name: 'DesiDhar Vedic Wooden Treasure: A2 Bilona Ghee & Wild Forest Honey',
    brand: 'DesiDhar Vedic',
    category: 'gift-boxes',
    subcategory: 'Ayurvedic Gifts',
    images: [
      '/images/placeholders/category-gift-boxes.svg'
    ],
    variants: [
      { id: 'v-gb2-std', weight: 'Gift Box (500ml Ghee + 350g Honey)', price: 1650, mrp: 2100, stock: 25, sku: 'DD-GFT-VED-STD' }
    ],
    rating: 4.9,
    reviewCount: 95,
    tags: ['Wooden Keepsake', 'Ayurvedic Health Gift'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Pinewood engraved chest housing 500ml A2 Gir Cow Bilona Ghee in ceramic jar and 350g unfiltered Himalayan Honey with wooden dipper.',
    description: 'A thoughtful, health-first gift for grandparents, mentors, and corporate celebrations. Pure Vedic vitality packaged with timeless warmth.',
    ingredients: 'A2 Gir Cow Ghee, Raw Himalayan Flora Honey.',
    nutrition: { '100% Pure': 'Natural Vitality' },
    shelfLife: '12 Months',
    storage: 'Cool dry room.'
  },
  {
    id: 'prod-gift-3',
    slug: 'utsav-grand-festive-sweets-dryfruits-box',
    name: 'DesiDhar Utsav Grand Festive Box (Sweets + Mamra Almonds)',
    brand: 'DesiDhar Shuddh',
    category: 'gift-boxes',
    subcategory: 'Festive Hampers',
    images: [
      '/images/placeholders/category-gift-boxes.svg'
    ],
    variants: [
      { id: 'v-gb3-std', weight: '1.5 kg Grand Box', price: 1850, mrp: 2400, stock: 20, sku: 'DD-GFT-UTS-STD' }
    ],
    rating: 4.9,
    reviewCount: 112,
    tags: ['Grand Hamper', 'Corporate Favorite'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Contains 750g assorted pure ghee mithai + 250g Mamra Almonds + 250g Jumbo Cashews + 250g Afghani Kishmish.',
    description: 'Gold-foiled festive magnetic closure box that radiates grandeur. The most popular choice for corporate and family Diwali gifting.',
    ingredients: 'Pure Ghee Sweets, Mamra Almonds, Whole Cashews, Kishmish.',
    nutrition: { 'Festive Goodness': 'Nutrient Dense' },
    shelfLife: '30 Days',
    storage: 'Room temperature.'
  },
  {
    id: 'prod-gift-4',
    slug: 'bandhan-artisan-sweet-trio-box',
    name: 'DesiDhar Bandhan Artisan Sweet Trio Gift Box (750g)',
    brand: 'DesiDhar Shuddh',
    category: 'gift-boxes',
    subcategory: 'Gift Boxes',
    images: [
      '/images/placeholders/category-gift-boxes.svg'
    ],
    variants: [
      { id: 'v-gb4-750', weight: '750g Gift Box', price: 849, mrp: 1050, stock: 40, sku: 'DD-GFT-BND-750' }
    ],
    rating: 4.8,
    reviewCount: 84,
    tags: ['Rakhi & Bhai Dooj', 'Compact Elegant'],
    isVeg: true,
    fssaiNumber: '10020011002341',
    shortDescription: 'Trio of Kaju Katli (250g), Kesari Motichoor Ladoo (250g), and Mathura Peda (250g) in an embossed saffron box.',
    description: 'Sleek, budget-friendly and festive. Each compartment is sealed for freshness and flavor isolation.',
    ingredients: 'Cashew, Gram Flour, Mawa, Cow Ghee, Sugar, Saffron.',
    nutrition: { 'Authentic Indian Confectionery': '100% Vegetarian' },
    shelfLife: '20 Days',
    storage: 'Store in dry place.'
  }
];
