import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.mjs';
import {
  all,
  get,
  getSettings,
  nowIso,
  run,
  settingsToPublic,
} from './db.mjs';
import {
  getCategoryBySlug,
  getDealEndsAt,
  getFrequentlyBought,
  getProductBySlug,
  getProductFacets,
  getRelatedProducts,
  listBanners,
  listCategories,
  listDeals,
  listFeatured,
  listFresh,
  listProducts,
  listSweets,
  listTrendingProducts,
  searchSuggestions,
} from './catalog.mjs';
import {
  addAddress,
  cancelOrder,
  createOrder,
  deleteAddress,
  deliverySlots,
  getOrderForUser,
  listOrdersForUser,
  listPublicCoupons,
  mapCoupon,
  paymentMethods,
  pincodeStatus,
  popularPincodes,
  priceCart,
  setDefaultAddress,
  updateAddress,
  validateCoupon,
  adminStats,
  updateOrderStatus,
  userAddresses,
  orderForPayment,
  markOrderPaid,
} from './orders.mjs';
import {
  getSessionUser,
  mapUser,
  requireAdmin,
  requireUser,
  revokeSession,
  sendOtp,
  verifyOtp,
} from './auth.mjs';
import {
  adminListReviews,
  createReview,
  featuredReviews,
  listPublishedReviews,
  moderateReview,
  reviewSummary,
} from './reviews.mjs';
import {
  addToWishlist,
  clearWishlist,
  listWishlist,
  removeFromWishlist,
} from './wishlist.mjs';
import {
  adminOverview,
  deleteProductImage,
  listAdminCoupons,
  listAdminOrders,
  listAdminProducts,
  setCouponActive,
  updateProductFlags,
  updateSettings,
  updateVariant,
  upsertCoupon,
} from './admin.mjs';
import { createContactMessage, subscribeNewsletter, resolveMessage, listContactMessages, createRazorpayOrder, verifyRazorpaySignature } from './payments.mjs';
import { ApiError, badRequest, notFound } from './errors.mjs';
import { Router, clearCookie, clientIp, parseCookies, readJson, sendJson, setCookie } from './http.mjs';
import { paiseToRupees } from './db.mjs';

/* ------------------------------------------------------------------ *
 * Lightweight in-memory rate limiting for public write endpoints
 * ------------------------------------------------------------------ */

const rateBuckets = new Map();

function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const bucket = rateBuckets.get(key) || [];
  const fresh = bucket.filter((time) => now - time < windowMs);
  if (fresh.length >= limit) {
    throw new ApiError(429, 'RATE_LIMITED', 'Too many requests. Please try a little later.');
  }
  fresh.push(now);
  rateBuckets.set(key, fresh);
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function sessionCookieFor(token) {
  return setCookie(config.sessionCookie, token, {
    maxAge: config.sessionTtlMs,
    sameSite: 'Lax',
    httpOnly: true,
    secure: config.isProduction,
  });
}

function mapAddressRow(row) {
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

// Kept for future use by admin views that need raw addresses.
export { mapAddressRow };

/* ------------------------------------------------------------------ *
 * Router
 * ------------------------------------------------------------------ */

export const router = new Router();

/* Health & public configuration */
router.get('/api/health', () => ({
  status: 'ok',
  time: nowIso(),
  database: 'sqlite',
}));

router.get('/api/settings', () => settingsToPublic(getSettings()));

router.get('/api/payment-methods', () => ({ methods: paymentMethods() }));

router.get('/api/delivery-slots', () => ({ slots: deliverySlots() }));

/* Catalog */
router.get('/api/categories', () => ({ categories: listCategories() }));
router.get('/api/categories/:slug', ({ params }) => {
  const category = getCategoryBySlug(params.slug);
  if (!category) throw notFound('Category not found.');
  return { category };
});

router.get('/api/banners', () => ({ banners: listBanners() }));

router.get('/api/products/facets', () => ({ facets: getProductFacets() }));
router.get('/api/products/deals', () => ({
  products: listDeals(6),
  endsAt: getDealEndsAt(),
}));
router.get('/api/products/featured', () => ({ products: listFeatured(8) }));
router.get('/api/products/fresh', () => ({ products: listFresh(8) }));
router.get('/api/products/sweets', () => ({ products: listSweets(8) }));

router.get('/api/products', ({ query }) => {
  const result = listProducts(query);
  return {
    ...result,
    facets: getProductFacets(),
  };
});

router.get('/api/products/:slug', ({ params }) => {
  const product = getProductBySlug(params.slug);
  if (!product) throw notFound('Product not found.');
  return { product };
});

router.get('/api/products/:slug/related', ({ params, query }) => {
  const product = getProductBySlug(params.slug);
  if (!product) throw notFound('Product not found.');
  const limit = Math.min(12, Math.max(1, Number(query.limit) || 4));
  return { products: getRelatedProducts(product, limit) };
});

router.get('/api/products/:slug/frequently-bought', ({ params, query }) => {
  const product = getProductBySlug(params.slug);
  if (!product) throw notFound('Product not found.');
  const limit = Math.min(6, Math.max(1, Number(query.limit) || 2));
  return { products: getFrequentlyBought(product, limit) };
});

router.get('/api/search/suggestions', ({ query }) => searchSuggestions(query.q, 6));
router.get('/api/search/trending', ({ query }) => ({
  products: listTrendingProducts(Math.min(10, Math.max(1, Number(query.limit) || 5))),
}));

/* Serviceability */
router.get('/api/pincodes/popular', ({ query }) => ({
  pincodes: popularPincodes(Math.min(20, Math.max(1, Number(query.limit) || 8))),
}));
router.get('/api/pincodes/:pincode', ({ params }) => pincodeStatus(params.pincode));

/* Coupons */
router.get('/api/coupons', () => ({ coupons: listPublicCoupons() }));
router.post('/api/coupons/validate', async ({ req, body }) => {
  const code = String(body?.code || '');
  const cartTotal = Number(body?.cartTotal);
  if (!code.trim()) throw badRequest('Enter a coupon code.');
  if (!Number.isFinite(cartTotal) || cartTotal < 0) {
    throw badRequest('A valid cart total is required.');
  }
  // The client-supplied total is only used for the pre-check; the amount actually
  // charged is always recalculated from database prices during checkout.
  const result = validateCoupon(code, Math.round(cartTotal * 100));
  if (!result.valid) return { isValid: false, error: result.error };
  return { isValid: true, coupon: result.coupon };
});

/* Reviews */
router.get('/api/reviews/featured', ({ query }) => ({
  reviews: featuredReviews(Math.min(12, Math.max(1, Number(query.limit) || 3))),
}));
router.get('/api/reviews/:productId/summary', ({ params }) => reviewSummary(params.productId));
router.get('/api/reviews/:productId', ({ params }) => ({
  reviews: listPublishedReviews(params.productId),
  summary: reviewSummary(params.productId),
}));
router.post('/api/reviews', async ({ req, body }) => {
  const session = requireUser(req);
  const productId = String(body?.productId || '');
  if (!productId) throw badRequest('A product is required.');
  return { review: createReview(session.user, productId, body) };
});

/* Cart validation (authoritative prices & stock) */
router.post('/api/cart/validate', async ({ body }) => {
  const result = priceCart({ items: body?.items, couponCode: body?.couponCode });
  return result;
});

/* Auth */
router.post('/api/auth/send-otp', async ({ req, body }) => {
  rateLimit(`send-otp:${clientIp(req)}`, 10, 15 * 60 * 1000);
  return sendOtp(body?.phone);
});

router.post('/api/auth/verify-otp', async ({ body }) => {
  const result = verifyOtp(body?.phone, body?.otp ?? body?.code);
  return {
    success: true,
    user: result.user,
    token: result.sessionToken,
    expiresAt: result.expiresAt,
    __cookie: sessionCookieFor(result.sessionToken),
  };
});

router.post('/api/auth/logout', async ({ req }) => {
  const session = getSessionUser(req);
  if (session) revokeSession(session.sessionId);
  return { success: true, __cookie: clearCookie(config.sessionCookie) };
});

router.get('/api/auth/me', ({ req }) => {
  const session = getSessionUser(req);
  if (!session) return { user: null };
  return {
    user: mapUser(session.user),
    addresses: userAddresses(session.user.id),
  };
});

router.patch('/api/auth/me', async ({ req, body }) => {
  const session = requireUser(req);
  const name = String(body?.name ?? session.user.name).trim().slice(0, 80);
  const email = String(body?.email ?? session.user.email).trim().slice(0, 160);
  if (name.length > 0 && name.length < 2) throw badRequest('Enter your name.');
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw badRequest('Enter a valid email address.');
  run('UPDATE users SET name = ?, email = ?, updated_at = ? WHERE id = ?', [
    name,
    email,
    nowIso(),
    session.user.id,
  ]);
  const updated = get('SELECT * FROM users WHERE id = ?', [session.user.id]);
  return { user: mapUser(updated) };
});

/* Addresses */
router.get('/api/addresses', ({ req }) => {
  const session = requireUser(req);
  return { addresses: userAddresses(session.user.id) };
});
router.post('/api/addresses', async ({ req, body }) => {
  const session = requireUser(req);
  return { address: addAddress(session.user.id, body), addresses: userAddresses(session.user.id) };
});
router.patch('/api/addresses/:id', async ({ req, params, body }) => {
  const session = requireUser(req);
  const address = updateAddress(session.user.id, params.id, body);
  return { address, addresses: userAddresses(session.user.id) };
});
router.delete('/api/addresses/:id', ({ req, params }) => {
  const session = requireUser(req);
  return { addresses: deleteAddress(session.user.id, params.id) };
});
router.post('/api/addresses/:id/default', ({ req, params }) => {
  const session = requireUser(req);
  return { addresses: setDefaultAddress(session.user.id, params.id) };
});

/* Wishlist */
router.get('/api/wishlist', ({ req }) => {
  const session = requireUser(req);
  return { products: listWishlist(session.user.id) };
});
router.post('/api/wishlist', async ({ req, body }) => {
  const session = requireUser(req);
  const productId = String(body?.productId || '');
  if (!productId) throw badRequest('A product is required.');
  return { products: addToWishlist(session.user.id, productId) };
});
router.delete('/api/wishlist/:productId', ({ req, params }) => {
  const session = requireUser(req);
  return { products: removeFromWishlist(session.user.id, params.productId) };
});
router.delete('/api/wishlist', ({ req }) => {
  const session = requireUser(req);
  return { products: clearWishlist(session.user.id) };
});

/* Orders */
router.post('/api/orders', async ({ req, body }) => {
  const session = requireUser(req);
  const order = createOrder(session.user.id, body);
  return { order };
});

router.get('/api/orders', ({ req }) => {
  const session = requireUser(req);
  return { orders: listOrdersForUser(session.user.id) };
});

router.get('/api/orders/:id', ({ req, params }) => {
  const session = requireUser(req);
  return {
    order: getOrderForUser(session.user.id, params.id, {
      isAdmin: session.user.role === 'admin',
    }),
  };
});

router.post('/api/orders/:id/cancel', async ({ req, params }) => {
  const session = requireUser(req);
  return {
    order: cancelOrder(session.user.id, params.id, { isAdmin: session.user.role === 'admin' }),
  };
});

/* Payments (Razorpay, only when configured) */
router.post('/api/payments/razorpay/order', async ({ req, body }) => {
  const session = requireUser(req);
  const orderId = String(body?.orderId || '');
  const order = orderForPayment(session.user.id, orderId);
  if (!config.razorpay.enabled) {
    throw new ApiError(503, 'PAYMENTS_NOT_CONFIGURED', 'Online payments are not configured.');
  }
  const intent = await createRazorpayOrder(order);
  run('UPDATE orders SET payment_provider = ?, payment_reference = ?, updated_at = ? WHERE id = ?', [
    'razorpay',
    intent.razorpayOrderId,
    nowIso(),
    order.id,
  ]);
  return intent;
});

router.post('/api/payments/razorpay/verify', async ({ req, body }) => {
  const session = requireUser(req);
  const orderId = String(body?.orderId || '');
  const order = orderForPayment(session.user.id, orderId);
  const razorpayOrderId = String(body?.razorpayOrderId || '');
  if (order.payment_reference && order.payment_reference !== razorpayOrderId) {
    throw badRequest('The payment does not match this order.');
  }
  verifyRazorpaySignature({
    razorpayOrderId,
    razorpayPaymentId: String(body?.razorpayPaymentId || ''),
    signature: String(body?.razorpaySignature || body?.signature || ''),
  });
  const updated = markOrderPaid(order.id, {
    reference: String(body?.razorpayPaymentId || ''),
    provider: 'razorpay',
  });
  return { order: updated };
});

/* Support & marketing */
router.post('/api/contact', async ({ req, body }) => {
  rateLimit(`contact:${clientIp(req)}`, 5, 60 * 60 * 1000);
  return createContactMessage(body);
});
router.post('/api/newsletter', async ({ req, body }) => {
  rateLimit(`newsletter:${clientIp(req)}`, 10, 60 * 60 * 1000);
  return subscribeNewsletter(body?.email, body?.source);
});

/* ------------------------------------------------------------------ *
 * Admin
 * ------------------------------------------------------------------ */

router.get('/api/admin/stats', ({ req }) => {
  requireAdmin(req);
  return { stats: adminStats() };
});

router.get('/api/admin/products', ({ req, query }) => {
  requireAdmin(req);
  return {
    products: listAdminProducts({
      q: query.q ? String(query.q) : undefined,
      lowStock: String(query.lowStock || '') === 'true',
    }),
  };
});

router.patch('/api/admin/products/:productId', async ({ req, params, body }) => {
  const session = requireAdmin(req);
  return { product: updateProductFlags(params.productId, body) };
});

router.patch('/api/admin/products/:productId/variants/:variantId', async ({ req, params, body }) => {
  const session = requireAdmin(req);
  return { variant: updateVariant(params.productId, params.variantId, body, session.user.id) };
});

router.delete('/api/admin/products/:productId/images/:imageId', ({ req, params }) => {
  requireAdmin(req);
  return deleteProductImage(params.productId, params.imageId);
});

router.get('/api/admin/orders', ({ req, query }) => {
  requireAdmin(req);
  return { orders: listAdminOrders({ status: query.status ? String(query.status) : undefined }) };
});

router.patch('/api/admin/orders/:orderId', async ({ req, params, body }) => {
  const session = requireAdmin(req);
  const status = body?.status;
  if (!status) throw badRequest('A status is required.');
  return {
    order: updateOrderStatus(params.orderId, status, session.user.id, {
      trackingNumber: body?.trackingNumber ?? undefined,
      courierName: body?.courierName ?? undefined,
      description: body?.description,
    }),
  };
});

router.get('/api/admin/coupons', ({ req }) => {
  requireAdmin(req);
  return { coupons: listAdminCoupons() };
});

router.post('/api/admin/coupons', async ({ req, body }) => {
  requireAdmin(req);
  return { coupon: upsertCoupon(body) };
});

router.patch('/api/admin/coupons/:code', async ({ req, params, body }) => {
  requireAdmin(req);
  return { coupon: setCouponActive(params.code, Boolean(body?.isActive)) };
});

router.get('/api/admin/reviews', ({ req, query }) => {
  requireAdmin(req);
  return { reviews: adminListReviews({ status: query.status ? String(query.status) : undefined }) };
});

router.patch('/api/admin/reviews/:reviewId', async ({ req, params, body }) => {
  requireAdmin(req);
  return { review: moderateReview(params.reviewId, String(body?.status || '')) };
});

router.get('/api/admin/messages', ({ req }) => {
  requireAdmin(req);
  return { messages: listContactMessages() };
});

router.patch('/api/admin/messages/:messageId', ({ req, params }) => {
  requireAdmin(req);
  return { message: resolveMessage(params.messageId) };
});

router.get('/api/admin/settings', ({ req }) => {
  requireAdmin(req);
  return { settings: getSettings(), publicSettings: settingsToPublic(getSettings()) };
});

router.patch('/api/admin/settings', async ({ req, body }) => {
  requireAdmin(req);
  return { settings: updateSettings(body) };
});

router.get('/api/admin/overview', ({ req }) => {
  requireAdmin(req);
  return adminOverview();
});

/* ------------------------------------------------------------------ *
 * Static file serving (production build)
 * ------------------------------------------------------------------ */

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function safeJoin(rootDir, requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const absolute = path.join(rootDir, normalized);
  if (!absolute.startsWith(path.resolve(rootDir))) return null;
  return absolute;
}

export function serveStatic(req, res, pathname) {
  if (!config.serveStatic) return false;
  const candidates = [config.staticDir, config.publicDir];
  for (const root of candidates) {
    const filePath = safeJoin(root, pathname);
    if (!filePath) continue;
    try {
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Content-Length': stat.size,
          'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
        });
        fs.createReadStream(filePath).pipe(res);
        return true;
      }
    } catch {
      /* try next root */
    }
  }

  if (!pathname.startsWith('/api')) {
    const indexPath = path.join(config.staticDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      const stat = fs.statSync(indexPath);
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': stat.size,
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(indexPath).pipe(res);
      return true;
    }
  }
  return false;
}

/* ------------------------------------------------------------------ *
 * Dispatch
 * ------------------------------------------------------------------ */

function buildQuery(url) {
  const query = {};
  for (const [key, value] of url.searchParams.entries()) {
    if (query[key] === undefined) {
      query[key] = value;
    } else if (Array.isArray(query[key])) {
      query[key].push(value);
    } else {
      query[key] = [query[key], value];
    }
  }
  return query;
}

export async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (!url.pathname.startsWith('/api')) {
    if (serveStatic(req, res, url.pathname)) return;
    sendJson(res, 404, { error: { code: 'NOT_FOUND', message: 'Not found.' } });
    return;
  }

  try {
    const { route, params } = router.match(req.method, url.pathname);
    const body = ['POST', 'PATCH', 'PUT'].includes(req.method) ? await readJson(req) : {};
    const result = await route.handler({
      req,
      res,
      params,
      query: buildQuery(url),
      body,
    });

    if (result && typeof result === 'object' && '__cookie' in result) {
      const { __cookie, ...payload } = result;
      sendJson(res, 200, payload, { 'Set-Cookie': __cookie });
      return;
    }
    sendJson(res, 200, result ?? {});
  } catch (error) {
    if (error instanceof ApiError) {
      sendJson(res, error.status, {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      });
      return;
    }
    console.error('[api] unhandled error', error);
    sendJson(res, 500, {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong on our side. Please try again.',
      },
    });
  }
}
