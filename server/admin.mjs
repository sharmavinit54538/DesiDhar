import crypto from 'node:crypto';
import { all, get, getSettings, nowIso, paiseToRupees, run, setSetting } from './db.mjs';
import { badRequest, conflict, notFound, validationFailed } from './errors.mjs';
import { mapCoupon } from './orders.mjs';
import { listContactMessages } from './payments.mjs';
import { adminListReviews } from './reviews.mjs';

const PRODUCT_FLAGS = new Set(['isActive', 'isFeatured', 'isFresh', 'isDeal']);

export function listAdminProducts({ q, lowStock } = {}) {
  const clauses = [];
  const values = [];
  if (q) {
    clauses.push('(LOWER(p.name) LIKE ? OR LOWER(p.slug) LIKE ? OR LOWER(p.brand) LIKE ?)');
    values.push(`%${String(q).toLowerCase()}%`, `%${String(q).toLowerCase()}%`, `%${String(q).toLowerCase()}%`);
  }
  if (lowStock) clauses.push('EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = p.id AND v.stock <= 10)');
  const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  const products = all(
    `SELECT p.id, p.slug, p.name, p.brand, p.category_slug, p.is_active, p.is_featured, p.is_fresh,
            p.is_deal, p.deal_ends_at
     FROM products p ${where} ORDER BY p.name ASC`,
    values
  );
  const ids = products.map((product) => product.id);
  const variants =
    ids.length > 0
      ? all(
          `SELECT * FROM product_variants WHERE product_id IN (${ids.map(() => '?').join(',')})
           ORDER BY product_id, sort_order`,
          ids
        )
      : [];
  const variantsByProduct = new Map();
  for (const variant of variants) {
    if (!variantsByProduct.has(variant.product_id)) variantsByProduct.set(variant.product_id, []);
    variantsByProduct.get(variant.product_id).push({
      id: variant.id,
      weight: variant.weight,
      sku: variant.sku,
      price: paiseToRupees(variant.price_paise),
      mrp: paiseToRupees(variant.mrp_paise),
      stock: variant.stock,
      isDefault: Boolean(variant.is_default),
    });
  }
  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category_slug,
    isActive: Boolean(product.is_active),
    isFeatured: Boolean(product.is_featured),
    isFresh: Boolean(product.is_fresh),
    isDeal: Boolean(product.is_deal),
    dealEndsAt: product.deal_ends_at,
    variants: variantsByProduct.get(product.id) || [],
  }));
}

export function updateVariant(productId, variantId, payload, actorUserId) {
  const variant = get('SELECT * FROM product_variants WHERE id = ? AND product_id = ?', [
    variantId,
    productId,
  ]);
  if (!variant) throw notFound('Product variant not found.');

  const updates = {};
  if (payload.stock !== undefined) {
    const stock = Number(payload.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      throw validationFailed([{ field: 'stock', message: 'Stock must be a whole number, 0 or greater.' }]);
    }
    updates.stock = stock;
  }
  if (payload.price !== undefined) {
    const price = Number(payload.price);
    if (!Number.isFinite(price) || price <= 0) {
      throw validationFailed([{ field: 'price', message: 'Price must be greater than zero.' }]);
    }
    updates.price_paise = Math.round(price * 100);
  }
  if (payload.mrp !== undefined) {
    const mrp = Number(payload.mrp);
    if (!Number.isFinite(mrp) || mrp <= 0) {
      throw validationFailed([{ field: 'mrp', message: 'MRP must be greater than zero.' }]);
    }
    updates.mrp_paise = Math.round(mrp * 100);
  }
  const nextPrice = updates.price_paise ?? variant.price_paise;
  const nextMrp = updates.mrp_paise ?? variant.mrp_paise;
  if (nextMrp < nextPrice) {
    throw validationFailed([{ field: 'mrp', message: 'MRP cannot be lower than the selling price.' }]);
  }
  if (Object.keys(updates).length === 0) throw badRequest('No supported fields were provided.');

  const sets = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
  run(`UPDATE product_variants SET ${sets}, updated_at = ? WHERE id = ?`, [
    ...Object.values(updates),
    nowIso(),
    variantId,
  ]);

  if (updates.stock !== undefined) {
    const delta = updates.stock - variant.stock;
    if (delta !== 0) {
      run(
        `INSERT INTO inventory_log (id, variant_id, delta, reason, actor_user_id)
         VALUES (?, ?, ?, 'admin-adjustment', ?)`,
        [`inv_${crypto.randomUUID()}`, variantId, delta, actorUserId]
      );
    }
  }

  return {
    id: variantId,
    productId,
    stock: updates.stock ?? variant.stock,
    price: paiseToRupees(updates.price_paise ?? variant.price_paise),
    mrp: paiseToRupees(updates.mrp_paise ?? variant.mrp_paise),
  };
}

export function updateProductFlags(productId, payload) {
  const product = get('SELECT * FROM products WHERE id = ?', [productId]);
  if (!product) throw notFound('Product not found.');

  const updates = {};
  const flags = {};
  for (const key of Object.keys(payload)) {
    if (PRODUCT_FLAGS.has(key)) {
      const column = key === 'isActive' ? 'is_active' : key === 'isFeatured' ? 'is_featured' : key === 'isFresh' ? 'is_fresh' : 'is_deal';
      updates[column] = payload[key] ? 1 : 0;
      flags[key] = Boolean(payload[key]);
    }
  }
  if ('dealEndsAt' in payload) {
    const value = payload.dealEndsAt ? new Date(payload.dealEndsAt) : null;
    if (payload.dealEndsAt && Number.isNaN(value.getTime())) {
      throw validationFailed([{ field: 'dealEndsAt', message: 'Enter a valid date/time.' }]);
    }
    updates.deal_ends_at = payload.dealEndsAt ? value.toISOString() : null;
  }
  if (Object.keys(updates).length === 0) throw badRequest('No supported fields were provided.');

  const dealEnabled = updates.is_deal ?? product.is_deal;
  const dealEndsAt = updates.deal_ends_at !== undefined ? updates.deal_ends_at : product.deal_ends_at;
  if (dealEnabled && !dealEndsAt) {
    throw validationFailed([
      { field: 'dealEndsAt', message: 'A deal must have an end date so the storefront never shows an open-ended sale.' },
    ]);
  }
  if (dealEndsAt && new Date(dealEndsAt).getTime() <= Date.now()) {
    throw validationFailed([{ field: 'dealEndsAt', message: 'The deal end date must be in the future.' }]);
  }

  const sets = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
  run(`UPDATE products SET ${sets}, updated_at = ? WHERE id = ?`, [
    ...Object.values(updates),
    nowIso(),
    productId,
  ]);
  return { id: productId, ...updates };
}

export function listAdminOrders({ status } = {}) {
  const clauses = [];
  const values = [];
  if (status) {
    clauses.push('o.status = ?');
    values.push(status);
  }
  const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = all(
    `SELECT o.*, u.phone AS customer_phone, u.name AS customer_name,
       (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS line_count
     FROM orders o JOIN users u ON u.id = o.user_id
     ${where} ORDER BY o.created_at DESC LIMIT 200`,
    values
  );
  return rows.map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    total: paiseToRupees(row.total_paise),
    customerName: row.customer_name || null,
    customerPhone: row.customer_phone,
    lineCount: Number(row.line_count),
    trackingNumber: row.tracking_number,
    courierName: row.courier_name,
    slotDate: row.slot_date,
    slotWindow: row.slot_window,
  }));
}

export function listAdminCoupons() {
  return all('SELECT * FROM coupons ORDER BY code ASC').map((row) => ({
    ...mapCoupon(row),
    isActive: Boolean(row.is_active),
    isPublic: Boolean(row.is_public),
  }));
}

export function upsertCoupon(payload) {
  const code = String(payload?.code || '').trim().toUpperCase();
  const errors = [];
  if (!/^[A-Z0-9]{3,24}$/.test(code)) {
    errors.push({ field: 'code', message: 'Use 3–24 letters/numbers.' });
  }
  const discountType = payload?.discountType === 'fixed' ? 'fixed' : 'percentage';
  const discountValue = Number(payload?.discountValue);
  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    errors.push({ field: 'discountValue', message: 'Discount must be greater than zero.' });
  }
  if (discountType === 'percentage' && discountValue > 100) {
    errors.push({ field: 'discountValue', message: 'Percentage discounts cannot exceed 100.' });
  }
  if (errors.length > 0) throw validationFailed(errors);

  const minOrder = Number(payload?.minOrderValue || 0);
  const maxDiscount = payload?.maxDiscount === null || payload?.maxDiscount === undefined || payload?.maxDiscount === ''
    ? null
    : Number(payload.maxDiscount);
  const validUntil = payload?.validUntil ? String(payload.validUntil) : null;

  run(
    `INSERT INTO coupons (code, discount_type, discount_value, min_order_value_paise, max_discount_paise,
                          description, valid_until, is_active, is_public)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(code) DO UPDATE SET discount_type = excluded.discount_type,
       discount_value = excluded.discount_value, min_order_value_paise = excluded.min_order_value_paise,
       max_discount_paise = excluded.max_discount_paise, description = excluded.description,
       valid_until = excluded.valid_until, is_active = excluded.is_active, is_public = excluded.is_public`,
    [
      code,
      discountType,
      discountType === 'fixed' ? Math.round(discountValue * 100) : Math.round(discountValue),
      Math.round(Number.isFinite(minOrder) ? minOrder * 100 : 0),
      maxDiscount === null ? null : Math.round(maxDiscount * 100),
      String(payload?.description || '').slice(0, 240),
      validUntil,
      payload?.isActive === false ? 0 : 1,
      payload?.isPublic === false ? 0 : 1,
    ]
  );
  return listAdminCoupons().find((coupon) => coupon.code === code);
}

export function setCouponActive(code, isActive) {
  const row = get('SELECT code FROM coupons WHERE code = ?', [String(code || '').toUpperCase()]);
  if (!row) throw notFound('Coupon not found.');
  run('UPDATE coupons SET is_active = ? WHERE code = ?', [isActive ? 1 : 0, row.code]);
  return listAdminCoupons().find((coupon) => coupon.code === row.code);
}

const EDITABLE_SETTINGS = new Set([
  'delivery_free_threshold_paise',
  'delivery_fee_paise',
  'cod_enabled',
  'fssai_license_number',
  'support_email',
  'support_phone',
  'support_whatsapp',
  'support_hours',
  'company_legal_name',
  'company_address',
  'company_gstin',
]);

export function updateSettings(payload) {
  const accepted = {};
  for (const [key, value] of Object.entries(payload || {})) {
    if (!EDITABLE_SETTINGS.has(key)) continue;
    setSetting(key, value);
    accepted[key] = value;
  }
  if (Object.keys(accepted).length === 0) {
    throw badRequest('No supported settings were provided.');
  }
  return getSettings();
}

export function adminOverview() {
  return {
    reviews: adminListReviews({}),
    messages: listContactMessages(),
  };
}

export function deleteProductImage(productId, imageId) {
  const image = get('SELECT * FROM product_images WHERE id = ? AND product_id = ?', [imageId, productId]);
  if (!image) throw notFound('Image not found.');
  const remaining = all('SELECT COUNT(*) AS count FROM product_images WHERE product_id = ?', [productId]);
  if (Number(remaining[0].count) <= 1) {
    throw conflict('A product must keep at least one image. Upload a replacement before deleting this one.');
  }
  run('DELETE FROM product_images WHERE id = ?', [imageId]);
  return { id: imageId, deleted: true };
}
