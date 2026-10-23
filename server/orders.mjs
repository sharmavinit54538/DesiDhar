import crypto from 'node:crypto';
import { config } from './config.mjs';
import {
  all,
  get,
  getSettings,
  istDateString,
  istHour,
  nowIso,
  paiseToRupees,
  run,
  transaction,
} from './db.mjs';
import { getVariantsByIds } from './catalog.mjs';
import { ApiError, badRequest, conflict, forbidden, notFound, validationFailed } from './errors.mjs';

const PAYMENT_METHODS = new Set(['COD', 'UPI', 'CARD', 'NETBANKING']);
const ACTIVE_STATUSES = new Set(['PENDING_PAYMENT', 'PLACED', 'PACKED', 'OUT_FOR_DELIVERY']);

/* ------------------------------------------------------------------ *
 * Settings / payments / slots
 * ------------------------------------------------------------------ */

export function paymentMethods() {
  return [
    { id: 'COD', enabled: true, label: 'Cash / Pay on Delivery' },
    {
      id: 'UPI',
      enabled: config.razorpay.enabled,
      label: 'UPI',
      provider: config.razorpay.enabled ? 'razorpay' : null,
    },
    {
      id: 'CARD',
      enabled: config.razorpay.enabled,
      label: 'Credit / Debit Card',
      provider: config.razorpay.enabled ? 'razorpay' : null,
    },
    {
      id: 'NETBANKING',
      enabled: config.razorpay.enabled,
      label: 'Net Banking',
      provider: config.razorpay.enabled ? 'razorpay' : null,
    },
  ];
}

function formatSlotDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00+05:30`);
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`;
}

export function deliverySlots() {
  const settings = getSettings();
  let windows = [];
  try {
    windows = JSON.parse(settings.delivery_slot_windows || '[]');
  } catch {
    windows = [];
  }
  const cutoffHour = Number(settings.slot_booking_cutoff_hour_ist || 21);
  const offset = istHour() >= cutoffHour ? 2 : 1;
  const date = istDateString(new Date(), offset);
  return windows.map((window, index) => ({
    id: window.id,
    title: window.title,
    timeWindow: `${formatTime(window.start)} – ${formatTime(window.end)}`,
    date: `${formatSlotDate(date)}${offset === 2 ? ' (day after tomorrow)' : ' (tomorrow)'}`,
    isoDate: date,
    tag: window.note,
    isAvailable: true,
    isDefault: index === 0,
  }));
}

export function resolveSlot(slotId) {
  const slots = deliverySlots();
  const slot = slots.find((entry) => entry.id === slotId);
  if (!slot) {
    throw validationFailed(
      [{ field: 'slotId', message: 'Select one of the available delivery slots.' }],
      'Select one of the available delivery slots.'
    );
  }
  return slot;
}

export function pincodeStatus(rawPincode, { requireServiceable = false } = {}) {
  const pincode = String(rawPincode || '').trim();
  if (!/^[1-9]\d{5}$/.test(pincode)) {
    if (requireServiceable) {
      throw validationFailed(
        [{ field: 'pincode', message: 'Enter a valid 6-digit Indian PIN code.' }],
        'Enter a valid 6-digit Indian PIN code.'
      );
    }
    return {
      pincode,
      isServiceable: false,
      estimatedDelivery: '',
      coldChainAvailable: false,
      city: '',
      message: 'Enter a valid 6-digit Indian PIN code.',
    };
  }
  const row = get('SELECT * FROM serviceable_pincodes WHERE pincode = ? AND is_active = 1', [pincode]);
  if (!row) {
    if (requireServiceable) {
      throw validationFailed(
        [{ field: 'pincode', message: 'DesiDhar does not deliver to this PIN code yet.' }],
        'DesiDhar does not deliver to this PIN code yet.'
      );
    }
    return {
      pincode,
      isServiceable: false,
      estimatedDelivery: '',
      coldChainAvailable: false,
      city: '',
      message: 'DesiDhar does not deliver to this PIN code yet.',
    };
  }
  return {
    pincode: row.pincode,
    isServiceable: true,
    estimatedDelivery: row.estimated_delivery,
    coldChainAvailable: Boolean(row.cold_chain_available),
    city: row.city,
    message: row.message,
  };
}

export function popularPincodes(limit = 8) {
  return all(
    'SELECT pincode, city FROM serviceable_pincodes WHERE is_active = 1 ORDER BY pincode ASC LIMIT ?',
    [limit]
  ).map((row) => ({ pincode: row.pincode, city: row.city }));
}

/* ------------------------------------------------------------------ *
 * Coupons
 * ------------------------------------------------------------------ */

export function mapCoupon(row) {
  return {
    code: row.code,
    discountType: row.discount_type,
    discountValue:
      row.discount_type === 'percentage'
        ? row.discount_value
        : paiseToRupees(row.discount_value),
    minOrderValue: paiseToRupees(row.min_order_value_paise),
    maxDiscount:
      row.max_discount_paise === null || row.max_discount_paise === undefined
        ? undefined
        : paiseToRupees(row.max_discount_paise),
    description: row.description,
    validUntil: row.valid_until || undefined,
  };
}

function couponRow(code) {
  return get('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1', [String(code || '').trim()]);
}

/**
 * Server-authoritative coupon validation. Discounts are always computed from the
 * database configuration; the browser never supplies the amount.
 */
export function validateCoupon(rawCode, subtotalPaise) {
  const code = String(rawCode || '').trim().toUpperCase();
  if (!code) return { valid: false, error: 'Enter a coupon code.' };

  const row = couponRow(code);
  if (!row) return { valid: false, error: 'This coupon code is not valid.' };
  if (row.valid_until) {
    const end = new Date(`${row.valid_until}T23:59:59+05:30`);
    if (Number.isFinite(end.getTime()) && end.getTime() < Date.now()) {
      return { valid: false, error: 'This coupon has expired.' };
    }
  }
  if (subtotalPaise < row.min_order_value_paise) {
    return {
      valid: false,
      error: `This coupon requires a minimum order of ₹${paiseToRupees(row.min_order_value_paise)}.`,
    };
  }

  let discountPaise =
    row.discount_type === 'percentage'
      ? Math.round((subtotalPaise * row.discount_value) / 100)
      : Math.round(row.discount_value);
  if (row.max_discount_paise) {
    discountPaise = Math.min(discountPaise, row.max_discount_paise);
  }
  discountPaise = Math.max(0, Math.min(discountPaise, subtotalPaise));

  return { valid: true, coupon: mapCoupon(row), discountPaise };
}

export function listPublicCoupons() {
  return all(
    `SELECT * FROM coupons WHERE is_active = 1 AND is_public = 1
       AND (valid_until IS NULL OR date(valid_until) >= date('now'))
     ORDER BY code ASC`
  ).map(mapCoupon);
}

/* ------------------------------------------------------------------ *
 * Cart pricing
 * ------------------------------------------------------------------ */

export function computeDeliveryFee(subtotalPaise, settings = getSettings()) {
  if (subtotalPaise <= 0) return 0;
  const threshold = Number(settings.delivery_free_threshold_paise || 0);
  const fee = Number(settings.delivery_fee_paise || 0);
  return subtotalPaise >= threshold ? 0 : fee;
}

function normalizeCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw validationFailed([{ field: 'items', message: 'Your cart is empty.' }], 'Your cart is empty.');
  }
  if (items.length > 50) {
    throw validationFailed([{ field: 'items', message: 'Too many line items.' }], 'Too many line items.');
  }
  const merged = new Map();
  for (const item of items) {
    const variantId = String(item?.variantId || '').trim();
    const quantity = Number(item?.quantity);
    if (!variantId) {
      throw validationFailed([{ field: 'items', message: 'Every cart line needs a variant id.' }]);
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw validationFailed(
        [{ field: 'items', message: 'Quantities must be whole numbers between 1 and 99.' }],
        'Quantities must be whole numbers between 1 and 99.'
      );
    }
    merged.set(variantId, (merged.get(variantId) || 0) + quantity);
  }
  return [...merged.entries()].map(([variantId, quantity]) => ({ variantId, quantity }));
}

/**
 * Validates a cart against the live catalog: existence, active state, stock and
 * current prices. The client only ever sends variant ids + quantities.
 */
export function priceCart({ items, couponCode }) {
  const normalized = normalizeCartItems(items);
  const rows = getVariantsByIds(normalized.map((item) => item.variantId));
  const rowById = new Map(rows.map((row) => [row.id, row]));
  const settings = getSettings();
  const issues = [];
  const lines = [];

  for (const item of normalized) {
    const row = rowById.get(item.variantId);
    if (!row || !row.product_active) {
      issues.push({
        variantId: item.variantId,
        code: 'UNAVAILABLE',
        message: 'This product is no longer available.',
      });
      continue;
    }
    if (row.stock <= 0) {
      issues.push({
        variantId: item.variantId,
        code: 'OUT_OF_STOCK',
        message: `${row.name} (${row.weight}) is out of stock.`,
      });
      continue;
    }
    if (item.quantity > row.stock) {
      issues.push({
        variantId: item.variantId,
        code: 'INSUFFICIENT_STOCK',
        message: `Only ${row.stock} of ${row.name} (${row.weight}) left.`,
        availableStock: row.stock,
      });
    }
    lines.push({
      productId: row.product_id,
      variantId: row.id,
      name: row.name,
      slug: row.slug,
      brand: row.brand,
      image: row.primary_image || '/images/placeholders/product-placeholder.svg',
      weight: row.weight,
      price: paiseToRupees(row.price_paise),
      mrp: paiseToRupees(row.mrp_paise),
      stock: row.stock,
      quantity: Math.min(item.quantity, Math.max(1, row.stock)),
      isVeg: Boolean(row.is_veg),
      sku: row.sku,
    });
  }

  let mrpTotalPaise = 0;
  let subtotalPaise = 0;
  for (const line of lines) {
    mrpTotalPaise += Math.round(line.mrp * 100) * line.quantity;
    subtotalPaise += Math.round(line.price * 100) * line.quantity;
  }
  const productDiscountPaise = Math.max(0, mrpTotalPaise - subtotalPaise);
  const deliveryFeePaise = computeDeliveryFee(subtotalPaise, settings);

  let coupon = null;
  let couponDiscountPaise = 0;
  if (couponCode) {
    const result = validateCoupon(couponCode, subtotalPaise);
    if (result.valid) {
      coupon = result.coupon;
      couponDiscountPaise = result.discountPaise;
    } else {
      issues.push({ code: 'COUPON_INVALID', message: result.error });
    }
  }

  const totalPaise = Math.max(0, subtotalPaise - couponDiscountPaise + deliveryFeePaise);
  const pricing = {
    mrpTotal: paiseToRupees(mrpTotalPaise),
    discount: paiseToRupees(productDiscountPaise),
    couponDiscount: paiseToRupees(couponDiscountPaise),
    deliveryFee: paiseToRupees(deliveryFeePaise),
    total: paiseToRupees(totalPaise),
    savings: paiseToRupees(productDiscountPaise + couponDiscountPaise),
    couponCode: coupon?.code,
  };

  return {
    items: lines,
    pricing,
    issues,
    coupon: coupon || null,
    freeDeliveryThreshold: paiseToRupees(settings.delivery_free_threshold_paise),
  };
}

/* ------------------------------------------------------------------ *
 * Order helpers
 * ------------------------------------------------------------------ */

export function mapOrder(row, { items = [], events = [] } = {}) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    paymentReference: row.payment_reference || undefined,
    paymentProvider: row.payment_provider || undefined,
    items,
    address: JSON.parse(row.address_json),
    deliverySlot: {
      id: row.slot_id,
      title: row.slot_title,
      timeWindow: row.slot_window,
      date: row.slot_date,
      isAvailable: true,
    },
    pricing: {
      mrpTotal: paiseToRupees(row.mrp_total_paise),
      discount: paiseToRupees(row.discount_paise),
      couponDiscount: paiseToRupees(row.coupon_discount_paise),
      deliveryFee: paiseToRupees(row.delivery_fee_paise),
      total: paiseToRupees(row.total_paise),
      savings: paiseToRupees(row.discount_paise + row.coupon_discount_paise),
      couponCode: row.coupon_code || undefined,
    },
    trackingNumber: row.tracking_number || null,
    courierName: row.courier_name || null,
    timeline: events.map((event) => ({
      status: event.status,
      title: event.title,
      time: event.created_at,
      description: event.description || undefined,
      done: true,
    })),
  };
}

export function mapOrderItem(row) {
  return {
    productId: row.product_id,
    variantId: row.variant_id,
    name: row.name,
    slug: row.slug,
    brand: row.brand,
    image: row.image_path || '/images/placeholders/product-placeholder.svg',
    weight: row.weight,
    price: paiseToRupees(row.unit_price_paise),
    mrp: paiseToRupees(row.unit_mrp_paise),
    quantity: row.quantity,
    maxStock: row.quantity,
    isVeg: Boolean(row.is_veg),
    sku: row.sku,
  };
}

function loadOrders(rows) {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const items = all(
    `SELECT * FROM order_items WHERE order_id IN (${ids.map(() => '?').join(',')})`,
    ids
  );
  const events = all(
    `SELECT * FROM order_events WHERE order_id IN (${ids.map(() => '?').join(',')})
     ORDER BY created_at ASC`,
    ids
  );
  const itemsByOrder = new Map();
  for (const item of items) {
    if (!itemsByOrder.has(item.order_id)) itemsByOrder.set(item.order_id, []);
    itemsByOrder.get(item.order_id).push(mapOrderItem(item));
  }
  const eventsByOrder = new Map();
  for (const event of events) {
    if (!eventsByOrder.has(event.order_id)) eventsByOrder.set(event.order_id, []);
    eventsByOrder.get(event.order_id).push(event);
  }
  return rows.map((row) =>
    mapOrder(row, {
      items: itemsByOrder.get(row.id) || [],
      events: eventsByOrder.get(row.id) || [],
    })
  );
}

export function listOrdersForUser(userId) {
  const rows = all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return loadOrders(rows);
}

export function getOrderForUser(userId, orderId, { isAdmin = false } = {}) {
  const row = get('SELECT * FROM orders WHERE id = ? OR order_number = ?', [orderId, orderId]);
  if (!row) throw notFound('Order not found.');
  if (!isAdmin && row.user_id !== userId) {
    throw forbidden('This order belongs to another customer.');
  }
  return loadOrders([row])[0];
}

function nextOrderNumber(db) {
  const prefixRow = db.prepare("SELECT value FROM settings WHERE key = 'order_number_prefix'").get();
  const prefix = prefixRow?.value || 'DD';
  const datePart = istDateString(new Date()).replace(/-/g, '');
  const count = Number(
    db
      .prepare("SELECT COUNT(*) AS count FROM orders WHERE order_number LIKE ?")
      .get(`${prefix}-${datePart}-%`).count || 0
  );
  let sequence = count + 1;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = `${prefix}-${datePart}-${String(sequence).padStart(4, '0')}`;
    const exists = db.prepare('SELECT 1 FROM orders WHERE order_number = ?').get(candidate);
    if (!exists) return candidate;
    sequence += 1;
  }
  return `${prefix}-${datePart}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

function validateAddress(userId, payload) {
  if (payload?.addressId) {
    const row = get('SELECT * FROM addresses WHERE id = ?', [payload.addressId]);
    if (!row || row.user_id !== userId) throw notFound('Selected address was not found.');
    pincodeStatus(row.pincode, { requireServiceable: true });
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      pincode: row.pincode,
      addressLine1: row.line1,
      addressLine2: row.line2 || undefined,
      landmark: row.landmark || undefined,
      city: row.city,
      state: row.state,
      type: row.type,
      isDefault: Boolean(row.is_default),
    };
  }

  const address = payload?.address;
  if (!address || typeof address !== 'object') {
    throw validationFailed([{ field: 'address', message: 'A delivery address is required.' }]);
  }
  const errors = [];
  const text = (value) => String(value || '').trim();
  const fields = {
    name: text(address.name),
    phone: text(address.phone).replace(/\D/g, ''),
    pincode: text(address.pincode),
    addressLine1: text(address.addressLine1),
    city: text(address.city),
    state: text(address.state),
  };
  if (fields.name.length < 2) errors.push({ field: 'name', message: 'Enter the recipient name.' });
  if (!/^[6-9]\d{9}$/.test(fields.phone)) {
    errors.push({ field: 'phone', message: 'Enter a valid 10-digit mobile number.' });
  }
  if (!/^[1-9]\d{5}$/.test(fields.pincode)) {
    errors.push({ field: 'pincode', message: 'Enter a valid 6-digit PIN code.' });
  }
  if (fields.addressLine1.length < 5) {
    errors.push({ field: 'addressLine1', message: 'Enter the street address.' });
  }
  if (!fields.city) errors.push({ field: 'city', message: 'Enter the city.' });
  if (!fields.state) errors.push({ field: 'state', message: 'Enter the state.' });
  if (errors.length > 0) throw validationFailed(errors);

  pincodeStatus(fields.pincode, { requireServiceable: true });

  return {
    ...fields,
    addressLine2: text(address.addressLine2) || undefined,
    landmark: text(address.landmark) || undefined,
    type: ['Home', 'Work', 'Other'].includes(address.type) ? address.type : 'Home',
    isDefault: Boolean(address.isDefault),
  };
}

/**
 * Creates an order. All pricing, stock, coupon and slot decisions are made here;
 * nothing financial is trusted from the browser.
 */
export function createOrder(userId, payload) {
  const paymentMethod = String(payload?.paymentMethod || '').toUpperCase();
  if (!PAYMENT_METHODS.has(paymentMethod)) {
    throw validationFailed([{ field: 'paymentMethod', message: 'Select a payment method.' }]);
  }
  if (paymentMethod !== 'COD' && !config.razorpay.enabled) {
    throw new ApiError(
      400,
      'PAYMENT_METHOD_UNAVAILABLE',
      'Online payments are not available yet. Choose cash on delivery.'
    );
  }

  const address = validateAddress(userId, payload);
  const slot = resolveSlot(payload?.slotId);
  const priced = priceCart({ items: payload?.items, couponCode: payload?.couponCode });

  if (priced.items.length === 0) {
    throw conflict('None of the items in your cart are currently available.', priced.issues);
  }
  if (priced.issues.some((issue) => issue.code !== 'COUPON_INVALID')) {
    throw conflict('Some items changed while you were checking out. Review your cart and try again.', priced.issues);
  }

  const orderId = `ord_${crypto.randomUUID()}`;
  const isCod = paymentMethod === 'COD';
  const status = isCod ? 'PLACED' : 'PENDING_PAYMENT';
  const paymentStatus = isCod ? 'COD' : 'PENDING';

  return transaction((db) => {
    for (const line of priced.items) {
      const result = db
        .prepare('UPDATE product_variants SET stock = stock - ?, updated_at = ? WHERE id = ? AND stock >= ?')
        .run(line.quantity, nowIso(), line.variantId, line.quantity);
      if (result.changes === 0) {
        throw conflict(`${line.name} (${line.weight}) just went out of stock.`, [
          { variantId: line.variantId, code: 'INSUFFICIENT_STOCK' },
        ]);
      }
      db.prepare(
        `INSERT INTO inventory_log (id, variant_id, delta, reason, reference)
         VALUES (?, ?, ?, 'order', ?)`
      ).run(`inv_${crypto.randomUUID()}`, line.variantId, -line.quantity, orderId);
    }

    const orderNumber = nextOrderNumber(db);
    db.prepare(
      `INSERT INTO orders (
         id, order_number, user_id, status, payment_method, payment_status,
         mrp_total_paise, subtotal_paise, discount_paise, coupon_code, coupon_discount_paise,
         delivery_fee_paise, total_paise, address_json, slot_id, slot_title, slot_window, slot_date,
         created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      orderId,
      orderNumber,
      userId,
      status,
      paymentMethod,
      paymentStatus,
      Math.round(priced.pricing.mrpTotal * 100),
      Math.round((priced.pricing.mrpTotal - priced.pricing.discount) * 100),
      Math.round(priced.pricing.discount * 100),
      priced.pricing.couponCode || null,
      Math.round(priced.pricing.couponDiscount * 100),
      Math.round(priced.pricing.deliveryFee * 100),
      Math.round(priced.pricing.total * 100),
      JSON.stringify(address),
      slot.id,
      slot.title,
      slot.timeWindow,
      slot.date,
      nowIso(),
      nowIso()
    );

    for (const line of priced.items) {
      db.prepare(
        `INSERT INTO order_items (
           id, order_id, product_id, variant_id, name, slug, sku, brand, weight, image_path,
           unit_price_paise, unit_mrp_paise, quantity, is_veg
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        `oi_${crypto.randomUUID()}`,
        orderId,
        line.productId,
        line.variantId,
        line.name,
        line.slug,
        line.sku,
        line.brand,
        line.weight,
        line.image,
        Math.round(line.price * 100),
        Math.round(line.mrp * 100),
        line.quantity,
        line.isVeg ? 1 : 0
      );
    }

    db.prepare(
      `INSERT INTO order_events (id, order_id, status, title, description)
       VALUES (?, ?, ?, ?, ?)`
    ).run(
      `evt_${crypto.randomUUID()}`,
      orderId,
      status,
      isCod ? 'Order placed' : 'Awaiting payment confirmation',
      isCod
        ? 'Order received and queued for cold-chain packing.'
        : 'Order created. It will be confirmed once the payment provider confirms the transaction.'
    );

    const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
    const events = db.prepare('SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at ASC').all(orderId);
    return {
      ...mapOrder(row, { items: items.map(mapOrderItem), events }),
      payment: {
        method: paymentMethod,
        status: paymentStatus,
        onlinePaymentRequired: !isCod,
        provider: config.razorpay.enabled ? 'razorpay' : null,
        keyId: config.razorpay.enabled ? config.razorpay.keyId : null,
      },
    };
  });
}

export function cancelOrder(userId, orderId, { isAdmin = false } = {}) {
  return transaction((db) => {
    const row = db
      .prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?')
      .get(orderId, orderId);
    if (!row) throw notFound('Order not found.');
    if (!isAdmin && row.user_id !== userId) throw forbidden('This order belongs to another customer.');
    if (!['PLACED', 'PENDING_PAYMENT', 'PACKED'].includes(row.status)) {
      throw conflict('This order can no longer be cancelled.');
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(row.id);
    for (const item of items) {
      db.prepare('UPDATE product_variants SET stock = stock + ? WHERE id = ?').run(
        item.quantity,
        item.variant_id
      );
      db.prepare(
        `INSERT INTO inventory_log (id, variant_id, delta, reason, reference)
         VALUES (?, ?, ?, 'cancellation', ?)`
      ).run(`inv_${crypto.randomUUID()}`, item.variant_id, item.quantity, row.id);
    }

    const paymentStatus = row.payment_status === 'PAID' ? 'REFUND_PENDING' : row.payment_status;
    db.prepare('UPDATE orders SET status = ?, payment_status = ?, updated_at = ? WHERE id = ?').run(
      'CANCELLED',
      paymentStatus,
      nowIso(),
      row.id
    );
    const description =
      row.payment_status === 'PAID'
        ? 'Order cancelled. The refund will be processed to the original payment method.'
        : 'Order cancelled by the customer.';
    db.prepare(
      `INSERT INTO order_events (id, order_id, status, title, description) VALUES (?, ?, 'CANCELLED', ?, ?)`
    ).run(`evt_${crypto.randomUUID()}`, row.id, 'Order cancelled', description);

    const updated = getOrderForUser(row.user_id, row.id, { isAdmin: true });
    return updated;
  });
}

const STATUS_FLOW = {
  PENDING_PAYMENT: ['PLACED', 'CANCELLED'],
  PLACED: ['PACKED', 'CANCELLED'],
  PACKED: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export function updateOrderStatus(orderId, nextStatus, actorUserId, extra = {}) {
  const allowedStatuses = ['PLACED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
  const status = String(nextStatus || '').toUpperCase();
  if (!allowedStatuses.includes(status)) throw badRequest('Unknown order status.');

  return transaction((db) => {
    const row = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(orderId, orderId);
    if (!row) throw notFound('Order not found.');
    if (!STATUS_FLOW[row.status]?.includes(status)) {
      throw conflict(`Order cannot move from ${row.status} to ${status}.`);
    }

    if (status === 'CANCELLED') {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(row.id);
      for (const item of items) {
        db.prepare('UPDATE product_variants SET stock = stock + ? WHERE id = ?').run(
          item.quantity,
          item.variant_id
        );
        db.prepare(
          `INSERT INTO inventory_log (id, variant_id, delta, reason, reference)
           VALUES (?, ?, ?, 'admin-cancellation', ?)`
        ).run(`inv_${crypto.randomUUID()}`, item.variant_id, item.quantity, row.id);
      }
    }

    const paymentStatus =
      status === 'DELIVERED' && row.payment_method === 'COD' ? 'COD' : row.payment_status;
    const trackingNumber = extra.trackingNumber ?? row.tracking_number;
    const courierName = extra.courierName ?? row.courier_name;

    db.prepare(
      `UPDATE orders SET status = ?, payment_status = ?, tracking_number = ?, courier_name = ?, updated_at = ?
       WHERE id = ?`
    ).run(status, paymentStatus, trackingNumber, courierName, nowIso(), row.id);

    const titles = {
      PLACED: 'Order confirmed',
      PACKED: 'Packed for cold-chain dispatch',
      OUT_FOR_DELIVERY: 'Out for delivery',
      DELIVERED: 'Delivered',
      CANCELLED: 'Order cancelled',
    };
    db.prepare(
      `INSERT INTO order_events (id, order_id, status, title, description, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      `evt_${crypto.randomUUID()}`,
      row.id,
      status,
      titles[status] || status,
      extra.description || `Status updated by DesiDhar operations (${actorUserId}).`,
      nowIso()
    );

    return getOrderForUser(row.user_id, row.id, { isAdmin: true });
  });
}

export function markOrderPaid(orderId, { reference, provider }) {
  return transaction((db) => {
    const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!row) throw notFound('Order not found.');
    db.prepare(
      `UPDATE orders SET status = 'PLACED', payment_status = 'PAID', payment_reference = ?,
         payment_provider = ?, updated_at = ? WHERE id = ?`
    ).run(reference, provider, nowIso(), row.id);
    db.prepare(
      `INSERT INTO order_events (id, order_id, status, title, description)
       VALUES (?, ?, 'PLACED', ?, ?)`
    ).run(
      `evt_${crypto.randomUUID()}`,
      row.id,
      'Payment confirmed',
      `Payment confirmed by ${provider}.`
    );
    return getOrderForUser(row.user_id, row.id, { isAdmin: true });
  });
}

export function orderForPayment(userId, orderId) {
  const row = get('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (!row) throw notFound('Order not found.');
  if (row.user_id !== userId) throw forbidden('This order belongs to another customer.');
  if (row.status !== 'PENDING_PAYMENT') throw conflict('This order is not awaiting payment.');
  return row;
}

export function adminStats() {
  const orderAgg = get(
    `SELECT
       COUNT(*) AS total_orders,
       COALESCE(SUM(CASE WHEN payment_status = 'PAID' THEN total_paise ELSE 0 END), 0) AS paid_revenue,
       COALESCE(SUM(CASE WHEN payment_status = 'COD' AND status = 'DELIVERED' THEN total_paise ELSE 0 END), 0) AS cod_collected,
       COALESCE(SUM(CASE WHEN status IN ('PLACED','PACKED','OUT_FOR_DELIVERY') THEN 1 ELSE 0 END), 0) AS open_orders
     FROM orders`
  );
  const today = get(
    `SELECT COUNT(*) AS count, COALESCE(SUM(total_paise), 0) AS value
     FROM orders WHERE date(created_at) = date('now') AND status <> 'CANCELLED'`
  );
  const products = get(
    `SELECT COUNT(*) AS total,
       COALESCE(SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END), 0) AS inactive
     FROM products`
  );
  const stock = get(
    `SELECT
       COALESCE(SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END), 0) AS out_of_stock,
       COALESCE(SUM(CASE WHEN stock > 0 AND stock <= 10 THEN 1 ELSE 0 END), 0) AS low_stock,
       COALESCE(SUM(stock), 0) AS units
     FROM product_variants`
  );
  const customers = get("SELECT COUNT(*) AS count FROM users WHERE role = 'customer'");
  const reviews = get("SELECT COUNT(*) AS pending FROM reviews WHERE status = 'pending'");
  const messages = get("SELECT COUNT(*) AS open FROM contact_messages WHERE status = 'new'");
  const recentOrders = loadOrders(all('SELECT * FROM orders ORDER BY created_at DESC LIMIT 8'));

  return {
    orders: {
      total: Number(orderAgg.total_orders || 0),
      open: Number(orderAgg.open_orders || 0),
      todayCount: Number(today.count || 0),
      todayValue: paiseToRupees(today.value),
    },
    revenue: {
      paid: paiseToRupees(orderAgg.paid_revenue),
      codCollected: paiseToRupees(orderAgg.cod_collected),
    },
    catalog: {
      products: Number(products.total || 0),
      inactiveProducts: Number(products.inactive || 0),
      variantsOutOfStock: Number(stock.out_of_stock || 0),
      variantsLowStock: Number(stock.low_stock || 0),
      unitsInStock: Number(stock.units || 0),
    },
    customers: Number(customers.count || 0),
    pendingReviews: Number(reviews.pending || 0),
    openMessages: Number(messages.open || 0),
    recentOrders,
  };
}

export function userAddresses(userId) {
  return all('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at ASC', [
    userId,
  ]).map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    pincode: row.pincode,
    addressLine1: row.line1,
    addressLine2: row.line2 || undefined,
    landmark: row.landmark || undefined,
    city: row.city,
    state: row.state,
    type: row.type,
    isDefault: Boolean(row.is_default),
  }));
}

function validateAddressPayload(payload) {
  const errors = [];
  const text = (value) => String(value || '').trim();
  const data = {
    name: text(payload?.name),
    phone: text(payload?.phone).replace(/\D/g, ''),
    pincode: text(payload?.pincode),
    addressLine1: text(payload?.addressLine1 ?? payload?.line1),
    addressLine2: text(payload?.addressLine2 ?? payload?.line2),
    landmark: text(payload?.landmark),
    city: text(payload?.city),
    state: text(payload?.state),
    type: ['Home', 'Work', 'Other'].includes(payload?.type) ? payload.type : 'Home',
    isDefault: Boolean(payload?.isDefault),
  };
  if (data.name.length < 2) errors.push({ field: 'name', message: 'Enter the recipient name.' });
  if (!/^[6-9]\d{9}$/.test(data.phone)) {
    errors.push({ field: 'phone', message: 'Enter a valid 10-digit mobile number.' });
  }
  if (!/^[1-9]\d{5}$/.test(data.pincode)) {
    errors.push({ field: 'pincode', message: 'Enter a valid 6-digit PIN code.' });
  }
  if (data.addressLine1.length < 5) {
    errors.push({ field: 'addressLine1', message: 'Enter the street address.' });
  }
  if (!data.city) errors.push({ field: 'city', message: 'Enter the city.' });
  if (!data.state) errors.push({ field: 'state', message: 'Enter the state.' });
  if (errors.length > 0) throw validationFailed(errors);
  pincodeStatus(data.pincode, { requireServiceable: true });
  return data;
}

export function addAddress(userId, payload) {
  const data = validateAddressPayload(payload);
  return transaction((db) => {
    const existing = db.prepare('SELECT COUNT(*) AS count FROM addresses WHERE user_id = ?').get(userId);
    const makeDefault = data.isDefault || Number(existing.count) === 0;
    if (makeDefault) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(userId);
    }
    const id = `addr_${crypto.randomUUID()}`;
    db.prepare(
      `INSERT INTO addresses (id, user_id, name, phone, pincode, line1, line2, landmark, city, state, type, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      userId,
      data.name,
      data.phone,
      data.pincode,
      data.addressLine1,
      data.addressLine2 || null,
      data.landmark || null,
      data.city,
      data.state,
      data.type,
      makeDefault ? 1 : 0
    );
    return userAddresses(userId).find((address) => address.id === id);
  });
}

export function updateAddress(userId, addressId, payload) {
  const existing = get('SELECT * FROM addresses WHERE id = ?', [addressId]);
  if (!existing || existing.user_id !== userId) throw notFound('Address not found.');
  const data = validateAddressPayload(payload);
  return transaction((db) => {
    if (data.isDefault) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(userId);
    }
    db.prepare(
      `UPDATE addresses SET name = ?, phone = ?, pincode = ?, line1 = ?, line2 = ?, landmark = ?,
         city = ?, state = ?, type = ?, is_default = ?, updated_at = ? WHERE id = ?`
    ).run(
      data.name,
      data.phone,
      data.pincode,
      data.addressLine1,
      data.addressLine2 || null,
      data.landmark || null,
      data.city,
      data.state,
      data.type,
      data.isDefault ? 1 : 0,
      nowIso(),
      addressId
    );
    return userAddresses(userId).find((address) => address.id === addressId);
  });
}

export function deleteAddress(userId, addressId) {
  const existing = get('SELECT * FROM addresses WHERE id = ?', [addressId]);
  if (!existing || existing.user_id !== userId) throw notFound('Address not found.');
  run('DELETE FROM addresses WHERE id = ?', [addressId]);
  const remaining = userAddresses(userId);
  if (remaining.length > 0 && !remaining.some((address) => address.isDefault)) {
    run('UPDATE addresses SET is_default = 1 WHERE id = ?', [remaining[0].id]);
  }
  return userAddresses(userId);
}

export function setDefaultAddress(userId, addressId) {
  const existing = get('SELECT * FROM addresses WHERE id = ?', [addressId]);
  if (!existing || existing.user_id !== userId) throw notFound('Address not found.');
  run('UPDATE addresses SET is_default = 1 WHERE id = ?', [addressId]);
  run('UPDATE addresses SET is_default = 0 WHERE user_id = ? AND id <> ?', [userId, addressId]);
  return userAddresses(userId);
}

export function isActiveOrderStatus(status) {
  return ACTIVE_STATUSES.has(status);
}
