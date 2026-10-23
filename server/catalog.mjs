import { all, get, getSettings, paiseToRupees, getDb } from './db.mjs';
import { notFound } from './errors.mjs';

const PRODUCT_SELECT = `
  SELECT p.*,
    (SELECT MIN(v.price_paise) FROM product_variants v WHERE v.product_id = p.id) AS min_price_paise,
    (SELECT MAX(v.mrp_paise) FROM product_variants v WHERE v.product_id = p.id) AS max_mrp_paise,
    (SELECT COALESCE(SUM(v.stock), 0) FROM product_variants v WHERE v.product_id = p.id) AS total_stock,
    (SELECT MAX(
        CASE WHEN v.mrp_paise > 0 AND v.mrp_paise > v.price_paise
             THEN (v.mrp_paise - v.price_paise) * 100.0 / v.mrp_paise
             ELSE 0 END)
     FROM product_variants v WHERE v.product_id = p.id) AS max_discount_percent,
    (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.id AND r.status = 'published') AS avg_rating,
    (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id AND r.status = 'published') AS review_count
  FROM products p
`;

const SORT_OPTIONS = new Set(['relevance', 'price-asc', 'price-desc', 'rating', 'newest', 'discount']);

function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function variantsFor(productId) {
  return all(
    'SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order ASC, price_paise ASC',
    [productId]
  );
}

function imagesFor(productId) {
  return all(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
    [productId]
  );
}

export function mapVariant(row) {
  return {
    id: row.id,
    weight: row.weight,
    price: paiseToRupees(row.price_paise),
    mrp: paiseToRupees(row.mrp_paise),
    stock: row.stock,
    sku: row.sku,
    isDefault: Boolean(row.is_default),
  };
}

export function mapImage(row) {
  return {
    id: row.id,
    src: row.path,
    srcset: row.srcset || undefined,
    alt: row.alt,
    type: row.type,
    isMain: row.sort_order === 1,
    order: row.sort_order,
    width: row.width,
    height: row.height,
    isVerifiedSpecific: Boolean(row.is_verified),
    assetStatus: row.is_verified ? 'verified_authentic' : 'pending_studio_shot',
    attribution: undefined,
  };
}

export function mapProduct(row, { variants, images, reviewSummary } = {}) {
  const variantRows = variants ?? variantsFor(row.id);
  const imageRows = images ?? imagesFor(row.id);
  const summary = reviewSummary ?? {
    avg: row.avg_rating,
    count: row.review_count,
  };
  const totalStock = row.total_stock ?? variantRows.reduce((sum, v) => sum + v.stock, 0);
  const rating = summary.avg === null || summary.avg === undefined ? null : Number(summary.avg);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    hindiName: row.hindi_name || undefined,
    brand: row.brand,
    category: row.category_slug,
    subcategory: row.subcategory || undefined,
    sweetType: row.sweet_type || undefined,
    originRegion: row.origin_region || undefined,
    images: imageRows.map(mapImage),
    variants: variantRows.map(mapVariant),
    rating,
    reviewCount: Number(summary.count || 0),
    tags: parseJson(row.tags_json, []),
    highlights: parseJson(row.highlights_json, []).map((text) =>
      typeof text === 'string' ? { text } : text
    ),
    shortDescription: row.short_description,
    description: row.description,
    ingredients: row.ingredients || undefined,
    nutrition: parseJson(row.nutrition_json, null),
    shelfLife: row.shelf_life || undefined,
    storage: row.storage || undefined,
    faqs: parseJson(row.faqs_json, []),
    isVeg: Boolean(row.is_veg),
    isFeatured: Boolean(row.is_featured),
    isFresh: Boolean(row.is_fresh),
    isDeal: Boolean(row.is_deal) && (!row.deal_ends_at || new Date(row.deal_ends_at).getTime() > Date.now()),
    dealEndsAt: row.deal_ends_at || undefined,
    stockStatus: totalStock <= 0 ? 'out_of_stock' : totalStock <= 10 ? 'low_stock' : 'in_stock',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildWhere(params) {
  const clauses = ['p.is_active = 1'];
  const values = [];

  if (params.category && params.category !== 'all') {
    clauses.push('p.category_slug = ?');
    values.push(params.category);
  }

  if (params.q) {
    const like = `%${params.q.trim().toLowerCase()}%`;
    clauses.push(`(
      LOWER(p.name) LIKE ? OR LOWER(p.short_description) LIKE ? OR LOWER(p.description) LIKE ?
      OR LOWER(p.brand) LIKE ? OR LOWER(p.tags_json) LIKE ?
      OR EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = p.id AND LOWER(v.sku) LIKE ?)
    )`);
    values.push(like, like, like, like, like, like);
  }

  if (params.brands.length > 0) {
    clauses.push(`p.brand IN (${params.brands.map(() => '?').join(',')})`);
    values.push(...params.brands);
  }

  if (params.dietary.length > 0) {
    for (const tag of params.dietary) {
      clauses.push('LOWER(p.tags_json) LIKE ?');
      values.push(`%${tag.toLowerCase()}%`);
    }
  }

  if (Number.isFinite(params.minPrice)) {
    clauses.push(
      'EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = p.id AND v.price_paise >= ?)'
    );
    values.push(Math.round(params.minPrice * 100));
  }
  if (Number.isFinite(params.maxPrice)) {
    clauses.push(
      'EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = p.id AND v.price_paise <= ?)'
    );
    values.push(Math.round(params.maxPrice * 100));
  }
  if (params.weights.length > 0) {
    clauses.push(
      `EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = p.id AND v.weight IN (${params.weights
        .map(() => '?')
        .join(',')}))`
    );
    values.push(...params.weights);
  }
  if (Number.isFinite(params.minRating) && params.minRating > 0) {
    clauses.push(
      `(SELECT COALESCE(AVG(r.rating), 0) FROM reviews r WHERE r.product_id = p.id AND r.status = 'published') >= ?`
    );
    values.push(params.minRating);
  }
  if (Number.isFinite(params.minDiscount) && params.minDiscount > 0) {
    clauses.push(
      `(SELECT COALESCE(MAX(CASE WHEN v.mrp_paise > v.price_paise THEN (v.mrp_paise - v.price_paise) * 100.0 / v.mrp_paise ELSE 0 END), 0)
        FROM product_variants v WHERE v.product_id = p.id) >= ?`
    );
    values.push(params.minDiscount);
  }
  if (params.inStockOnly) {
    clauses.push('(SELECT COALESCE(SUM(v.stock), 0) FROM product_variants v WHERE v.product_id = p.id) > 0');
  }
  if (params.dealOnly) {
    clauses.push('p.is_deal = 1 AND (p.deal_ends_at IS NULL OR p.deal_ends_at > ?)');
    values.push(new Date().toISOString());
  }
  if (params.ids && params.ids.length > 0) {
    clauses.push(`p.id IN (${params.ids.map(() => '?').join(',')})`);
    values.push(...params.ids);
  }
  if (params.slugs && params.slugs.length > 0) {
    clauses.push(`p.slug IN (${params.slugs.map(() => '?').join(',')})`);
    values.push(...params.slugs);
  }

  return { clause: clauses.join(' AND '), values };
}

function orderBy(sortBy) {
  switch (sortBy) {
    case 'price-asc':
      return 'ORDER BY min_price_paise ASC, p.name ASC';
    case 'price-desc':
      return 'ORDER BY min_price_paise DESC, p.name ASC';
    case 'rating':
      return 'ORDER BY avg_rating IS NULL, avg_rating DESC, review_count DESC, p.name ASC';
    case 'newest':
      return 'ORDER BY p.created_at DESC, p.name ASC';
    case 'discount':
      return 'ORDER BY max_discount_percent DESC, p.name ASC';
    case 'relevance':
    default:
      return 'ORDER BY p.is_featured DESC, p.is_deal DESC, review_count DESC, p.name ASC';
  }
}

export function normalizeListParams(query) {
  const toArray = (value) => {
    if (value === undefined || value === null || value === '') return [];
    const raw = Array.isArray(value) ? value : String(value).split(',');
    return raw.map((v) => String(v).trim()).filter(Boolean);
  };
  const num = (value) => {
    if (value === undefined || value === '') return NaN;
    const n = Number(value);
    return Number.isFinite(n) ? n : NaN;
  };
  const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
  const pageSizeRaw = Number.parseInt(query.pageSize ?? '48', 10) || 48;
  return {
    category: query.category ? String(query.category) : undefined,
    q: query.q ? String(query.q) : undefined,
    sortBy: SORT_OPTIONS.has(String(query.sortBy)) ? String(query.sortBy) : 'relevance',
    brands: toArray(query.brands ?? query.brand),
    weights: toArray(query.weights ?? query.weight),
    dietary: toArray(query.dietary),
    minPrice: num(query.minPrice),
    maxPrice: num(query.maxPrice),
    minRating: num(query.minRating),
    minDiscount: num(query.minDiscount),
    inStockOnly: String(query.inStock ?? query.inStockOnly ?? '') === 'true',
    page,
    pageSize: Math.min(100, Math.max(1, pageSizeRaw)),
    ids: toArray(query.ids),
    slugs: toArray(query.slugs),
    dealOnly: String(query.deal ?? '') === 'true',
  };
}

export function listProducts(query) {
  const params = normalizeListParams(query);
  const { clause, values } = buildWhere(params);

  const total = Number(
    get(`SELECT COUNT(*) AS count FROM products p WHERE ${clause}`, values)?.count || 0
  );

  const rows = all(
    `${PRODUCT_SELECT} WHERE ${clause} ${orderBy(params.sortBy)} LIMIT ? OFFSET ?`,
    [...values, params.pageSize, (params.page - 1) * params.pageSize]
  );

  const enriched = hydrateRows(rows);
  return { products: enriched, total, page: params.page, pageSize: params.pageSize };
}

export function hydrateRows(rows) {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const variantRows = all(
    `SELECT * FROM product_variants WHERE product_id IN (${ids.map(() => '?').join(',')})
     ORDER BY sort_order ASC, price_paise ASC`,
    ids
  );
  const imageRows = all(
    `SELECT * FROM product_images WHERE product_id IN (${ids.map(() => '?').join(',')})
     ORDER BY sort_order ASC`,
    ids
  );
  const variantsByProduct = new Map();
  for (const variant of variantRows) {
    if (!variantsByProduct.has(variant.product_id)) variantsByProduct.set(variant.product_id, []);
    variantsByProduct.get(variant.product_id).push(variant);
  }
  const imagesByProduct = new Map();
  for (const image of imageRows) {
    if (!imagesByProduct.has(image.product_id)) imagesByProduct.set(image.product_id, []);
    imagesByProduct.get(image.product_id).push(image);
  }

  return rows.map((row) =>
    mapProduct(row, {
      variants: variantsByProduct.get(row.id) || [],
      images: imagesByProduct.get(row.id) || [],
      reviewSummary: { avg: row.avg_rating, count: row.review_count },
    })
  );
}

export function getProductBySlug(slug) {
  const row = get(`${PRODUCT_SELECT} WHERE p.slug = ? AND p.is_active = 1`, [slug]);
  return row ? mapProduct(row) : null;
}

export function getProductById(id) {
  const row = get(`${PRODUCT_SELECT} WHERE p.id = ? AND p.is_active = 1`, [id]);
  return row ? mapProduct(row) : null;
}

export function getProductRowBySlug(slug) {
  const row = get(`${PRODUCT_SELECT} WHERE p.slug = ?`, [slug]);
  if (!row) throw notFound('Product not found.');
  return row;
}

export function getVariantsByIds(ids) {
  if (ids.length === 0) return [];
  return all(
    `SELECT v.*, p.name, p.slug, p.brand, p.is_veg, p.is_active AS product_active,
            (SELECT path FROM product_images i WHERE i.product_id = p.id ORDER BY i.sort_order ASC LIMIT 1) AS primary_image
     FROM product_variants v JOIN products p ON p.id = v.product_id
     WHERE v.id IN (${ids.map(() => '?').join(',')})`,
    ids
  );
}

export function listCategories() {
  const rows = all(
    `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_slug = c.slug AND p.is_active = 1) AS product_count
     FROM categories c WHERE c.is_active = 1 ORDER BY c.sort_order ASC`
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    iconName: row.icon_name,
    image: row.image_path,
    itemCount: Number(row.product_count || 0),
    tagline: row.tagline,
    description: row.description,
  }));
}

export function getCategoryBySlug(slug) {
  return listCategories().find((category) => category.slug === slug) || null;
}

export function listBanners() {
  return all('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC').map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    badge: row.badge,
    buttonText: row.button_text,
    link: row.link,
    bgColor: row.bg_color,
    bgGradient: row.bg_gradient,
    image: row.image_path,
    highlightText: row.highlight_text,
  }));
}

export function getProductFacets() {
  const brands = all(
    'SELECT DISTINCT brand FROM products WHERE is_active = 1 ORDER BY brand ASC'
  ).map((row) => row.brand);
  const weights = all(
    `SELECT v.weight, COUNT(*) AS uses FROM product_variants v
     JOIN products p ON p.id = v.product_id
     WHERE p.is_active = 1 GROUP BY v.weight ORDER BY uses DESC, v.weight ASC`
  ).map((row) => row.weight);
  const tagRows = all('SELECT tags_json FROM products WHERE is_active = 1');
  const tagCounts = new Map();
  for (const row of tagRows) {
    for (const tag of parseJson(row.tags_json, [])) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }
  const priceRow = get(
    `SELECT MIN(v.price_paise) AS min_price, MAX(v.price_paise) AS max_price
     FROM product_variants v JOIN products p ON p.id = v.product_id WHERE p.is_active = 1`
  );
  return {
    brands,
    weights,
    dietaryTags: [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag),
    priceMin: priceRow?.min_price ? paiseToRupees(priceRow.min_price) : 0,
    priceMax: priceRow?.max_price ? paiseToRupees(priceRow.max_price) : 0,
    categories: listCategories().map((category) => ({
      slug: category.slug,
      name: category.name,
      count: category.itemCount,
    })),
  };
}

export function getRelatedProducts(product, limit = 4) {
  const rows = all(
    `${PRODUCT_SELECT}
     WHERE p.is_active = 1 AND p.category_slug = ? AND p.id <> ?
     ORDER BY p.is_featured DESC, p.name ASC LIMIT ?`,
    [product.category, product.id, limit]
  );
  if (rows.length > 0) return hydrateRows(rows);
  const fallback = all(
    `${PRODUCT_SELECT} WHERE p.is_active = 1 AND p.id <> ? ORDER BY p.is_featured DESC, p.name ASC LIMIT ?`,
    [product.id, limit]
  );
  return hydrateRows(fallback);
}

export function getFrequentlyBought(product, limit = 2) {
  const rows = all(
    `${PRODUCT_SELECT}
     WHERE p.is_active = 1 AND p.id <> ? AND p.category_slug <> ?
     ORDER BY p.is_featured DESC, p.name ASC LIMIT ?`,
    [product.id, product.category, limit]
  );
  return hydrateRows(rows);
}

export function listDeals(limit = 6) {
  const rows = all(
    `${PRODUCT_SELECT}
     WHERE p.is_active = 1 AND p.is_deal = 1
       AND (p.deal_ends_at IS NULL OR p.deal_ends_at > ?)
     ORDER BY p.deal_ends_at ASC, p.name ASC LIMIT ?`,
    [new Date().toISOString(), limit]
  );
  return hydrateRows(rows);
}

export function listFeatured(limit = 8) {
  return hydrateRows(
    all(
      `${PRODUCT_SELECT} WHERE p.is_active = 1 AND p.is_featured = 1
       ORDER BY p.name ASC LIMIT ?`,
      [limit]
    )
  );
}

export function listFresh(limit = 8) {
  return hydrateRows(
    all(
      `${PRODUCT_SELECT} WHERE p.is_active = 1 AND p.is_fresh = 1
       ORDER BY p.category_slug ASC, p.name ASC LIMIT ?`,
      [limit]
    )
  );
}

export function listSweets(limit = 8) {
  return hydrateRows(
    all(
      `${PRODUCT_SELECT} WHERE p.is_active = 1 AND p.category_slug IN ('mithai','gift-boxes')
       ORDER BY p.is_featured DESC, p.name ASC LIMIT ?`,
      [limit]
    )
  );
}

export function searchSuggestions(query, limit = 6) {
  const q = String(query || '').trim();
  if (!q) return { products: [], categories: [] };
  const like = `%${q.toLowerCase()}%`;
  const productRows = all(
    `${PRODUCT_SELECT}
     WHERE p.is_active = 1 AND (
       LOWER(p.name) LIKE ? OR LOWER(p.brand) LIKE ? OR LOWER(p.tags_json) LIKE ?
       OR EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = p.id AND LOWER(v.sku) LIKE ?)
     )
     ORDER BY p.is_featured DESC, p.name ASC LIMIT ?`,
    [like, like, like, like, limit]
  );
  const categories = listCategories()
    .filter(
      (category) =>
        category.name.toLowerCase().includes(q.toLowerCase()) ||
        category.slug.toLowerCase().includes(q.toLowerCase())
    )
    .slice(0, 3);
  return { products: hydrateRows(productRows), categories };
}

export function listTrendingProducts(limit = 5) {
  // "Trending" is derived from actual order history, never invented.
  const rows = all(
    `SELECT p.*, COUNT(oi.id) AS order_count
     FROM products p
     JOIN order_items oi ON oi.product_id = p.id
     JOIN orders o ON o.id = oi.order_id AND o.status <> 'CANCELLED'
     WHERE p.is_active = 1
     GROUP BY p.id
     ORDER BY order_count DESC, p.name ASC
     LIMIT ?`,
    [limit]
  );
  return hydrateRows(rows);
}

export function getDealEndsAt() {
  const row = get(
    `SELECT MIN(deal_ends_at) AS ends_at FROM products
     WHERE is_active = 1 AND is_deal = 1 AND deal_ends_at IS NOT NULL AND deal_ends_at > ?`,
    [new Date().toISOString()]
  );
  return row?.ends_at || null;
}

export function getStatusFacets() {
  const settings = getSettings();
  return { currency: settings.currency };
}

export function getPrimaryImage(product) {
  return product.images?.[0]?.src || null;
}

export function productExists(id) {
  return Boolean(get('SELECT 1 AS ok FROM products WHERE id = ? AND is_active = 1', [id]));
}

export function dbHandle() {
  return getDb();
}
