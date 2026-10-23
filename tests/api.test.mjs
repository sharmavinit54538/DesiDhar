import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * API integration tests.
 *
 * They run against a throwaway SQLite database in the OS temp directory, seeded
 * from server/db/seed + server/db/seed/catalog.json. The developer database in
 * server/data/ is never touched.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8900 + Math.floor(Math.random() * 90);
const BASE = `http://127.0.0.1:${PORT}/api`;
const DB_PATH = path.join(os.tmpdir(), `desidhar-test-${process.pid}-${Date.now()}.db`);
const ADMIN_PHONE = '9000000001';
const CUSTOMER_PHONE = '9000000002';

let server;
let cookie = '';
let orderId = '';
let variantId = '';
let productSlug = '';
let productId = '';
let addressId = '';
let slotId = '';
let stockBefore = 0;

const env = {
  ...process.env,
  NODE_ENV: 'test',
  DB_PATH,
  PORT: String(PORT),
  HOST: '127.0.0.1',
  SERVE_STATIC: 'false',
  OTP_DEV_ECHO: '1',
  OTP_SECRET: 'test-otp-secret',
  ADMIN_PHONES: ADMIN_PHONE,
  SMS_PROVIDER: 'console',
  RAZORPAY_KEY_ID: '',
  RAZORPAY_KEY_SECRET: '',
};

async function api(pathname, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (options.auth !== false && cookie) headers.Cookie = cookie;
  const response = await fetch(`${BASE}${pathname}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }
  return { status: response.status, body: payload };
}

function runNode(script) {
  execFileSync(process.execPath, [script], { cwd: ROOT, env, stdio: 'pipe' });
}

before(async () => {
  runNode('server/db/migrate.mjs');
  runNode('server/db/seed.mjs');

  server = spawn(process.execPath, ['server/index.mjs'], {
    cwd: ROOT,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stderr.on('data', (chunk) => {
    const text = String(chunk);
    if (/Error|error/.test(text) && !/ExperimentalWarning/.test(text)) {
      process.stderr.write(`[api] ${text}`);
    }
  });

  const deadline = Date.now() + 20000;
  for (;;) {
    try {
      const response = await fetch(`${BASE}/health`);
      if (response.ok) break;
    } catch {
      /* server still starting */
    }
    if (Date.now() > deadline) throw new Error('API server did not start in time');
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
});

after(() => {
  server?.kill('SIGTERM');
  for (const suffix of ['', '-wal', '-shm']) {
    try {
      fs.rmSync(`${DB_PATH}${suffix}`, { force: true });
    } catch {
      /* best effort cleanup */
    }
  }
});

test('health reports a live database', async () => {
  const { status, body } = await api('/health', { auth: false });
  assert.equal(status, 200);
  assert.equal(body.status, 'ok');
});

test('public settings expose storefront configuration, never secrets', async () => {
  const { status, body } = await api('/settings', { auth: false });
  assert.equal(status, 200);
  assert.ok(body.freeDeliveryThreshold >= 0);
  assert.ok(body.deliveryFee >= 0);
  assert.equal(body.razorpayKeyId ?? null, null);
  const slots = await api('/delivery-slots', { auth: false });
  assert.ok(slots.body.slots.length > 0);
});

test('catalogue lists only seeded products with pagination and facets', async () => {
  const { status, body } = await api('/products?page=1&pageSize=5', { auth: false });
  assert.equal(status, 200);
  assert.equal(body.products.length, 5);
  assert.equal(body.total, 57);
  assert.equal(body.facets.brands.length > 0, true);

  const second = await api('/products?page=2&pageSize=5', { auth: false });
  assert.equal(second.body.page, 2);
  const firstIds = body.products.map((product) => product.id);
  const secondIds = second.body.products.map((product) => product.id);
  assert.equal(
    firstIds.some((id) => secondIds.includes(id)),
    false,
    'paginated pages must not repeat products'
  );
});

test('filters and search operate on real catalogue data', async () => {
  const ghee = await api('/products?category=ghee', { auth: false });
  assert.equal(ghee.status, 200);
  assert.ok(ghee.body.products.length > 0);
  assert.equal(
    ghee.body.products.every((product) => product.category === 'ghee'),
    true
  );

  const search = await api('/products?q=milk', { auth: false });
  assert.equal(search.status, 200);
  assert.ok(search.body.products.length > 0);

  const price = await api('/products?minPrice=100&maxPrice=100000&sortBy=price-asc', { auth: false });
  const prices = price.body.products.map((product) => product.variants[0]?.price ?? 0);
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
});

test('product detail returns category placeholders where no studio photo exists', async () => {
  const list = await api('/products?pageSize=3', { auth: false });
  const product = list.body.products[0];
  const { status, body } = await api(`/products/${product.slug}`, { auth: false });
  assert.equal(status, 200);
  assert.ok(body.product.images.length >= 1);
  for (const image of body.product.images) {
    assert.ok(image.assetStatus === 'verified_authentic' || image.assetStatus === 'pending_studio_shot');
    assert.ok(image.src.startsWith('/'));
  }
  productSlug = body.product.slug;
  productId = body.product.id;
  variantId = body.product.variants[0].id;
  stockBefore = body.product.variants[0].stock;

  const missing = await api('/products/this-product-does-not-exist', { auth: false });
  assert.equal(missing.status, 404);
});

test('serviceability reflects configured pincodes only', async () => {
  const serviceable = await api('/pincodes/302001', { auth: false });
  assert.equal(serviceable.status, 200);
  assert.equal(serviceable.body.isServiceable, true);
  assert.ok(serviceable.body.estimatedDelivery.length > 0);

  const unknown = await api('/pincodes/799999', { auth: false });
  assert.equal(unknown.body.isServiceable, false);
  assert.equal(unknown.body.message.length > 0, true);
});

test('cart validation is server priced and flags stock and coupon problems', async () => {
  const valid = await api('/cart/validate', {
    method: 'POST',
    auth: false,
    body: { items: [{ variantId, quantity: 1 }] },
  });
  assert.equal(valid.status, 200);
  assert.equal(valid.body.issues.length, 0);
  assert.equal(valid.body.items[0].variantId, variantId);
  assert.ok(valid.body.pricing.total > 0);

  const tooMany = await api('/cart/validate', {
    method: 'POST',
    auth: false,
    body: { items: [{ variantId, quantity: Math.min(99, stockBefore + 1) }] },
  });
  assert.equal(tooMany.status, 200);
  assert.ok(tooMany.body.issues.some((issue) => issue.code === 'INSUFFICIENT_STOCK'));

  const badCoupon = await api('/cart/validate', {
    method: 'POST',
    auth: false,
    body: { items: [{ variantId, quantity: 1 }], couponCode: 'NOT-A-COUPON' },
  });
  assert.ok(badCoupon.body.issues.some((issue) => issue.code === 'COUPON_INVALID'));
});

test('OTP sign-in issues a session cookie and returns the customer record', async () => {
  const sent = await api('/auth/send-otp', {
    method: 'POST',
    auth: false,
    body: { phone: CUSTOMER_PHONE },
  });
  assert.equal(sent.status, 200);
  assert.ok(sent.body.devCode, 'development echo must expose the generated OTP');

  const verified = await api('/auth/verify-otp', {
    method: 'POST',
    auth: false,
    body: { phone: CUSTOMER_PHONE, otp: sent.body.devCode },
  });
  assert.equal(verified.status, 200);
  assert.ok(cookie.startsWith('dd_session='));
  assert.equal(verified.body.user.phone, CUSTOMER_PHONE);

  const me = await api('/auth/me');
  assert.equal(me.status, 200);
  assert.equal(me.body.user.phone, CUSTOMER_PHONE);
  assert.deepEqual(me.body.addresses, []);
});

test('address creation is persisted with its pincode and can be defaulted', async () => {
  const created = await api('/addresses', {
    method: 'POST',
    body: {
      name: 'Test Customer',
      phone: CUSTOMER_PHONE,
      pincode: '302001',
      addressLine1: '12 Test Street',
      city: 'Jaipur',
      state: 'Rajasthan',
      isDefault: true,
    },
  });
  assert.equal(created.status, 200);
  assert.equal(created.body.addresses.length, 1);
  addressId = created.body.address.id;

  const invalid = await api('/addresses', {
    method: 'POST',
    body: {
      name: 'X',
      phone: '123',
      pincode: '0000',
      addressLine1: '',
      city: '',
      state: '',
    },
  });
  assert.equal(invalid.status, 422);
});

test('wishlist persists server-side for the signed-in customer', async () => {
  const added = await api('/wishlist', { method: 'POST', body: { productId } });
  assert.equal(added.status, 200);
  assert.equal(added.body.products.some((product) => product.id === productId), true);

  const list = await api('/wishlist');
  assert.equal(list.body.products.some((product) => product.id === productId), true);
});

test('addresses and orders require a serviceable pincode', async () => {
  const address = await api('/addresses', {
    method: 'POST',
    body: {
      name: 'Out of Area',
      phone: CUSTOMER_PHONE,
      pincode: '799999',
      addressLine1: '1 Nowhere Road',
      city: 'Remote',
      state: 'Nowhere',
    },
  });
  assert.equal(address.status, 422);
  assert.equal(address.body.error.details[0].field, 'pincode');
});

test('order is created from server pricing and decrements real stock', async () => {
  const slots = await api('/delivery-slots', { auth: false });
  assert.ok(slots.body.slots.length > 0);
  slotId = slots.body.slots[0].id;

  const placed = await api('/orders', {
    method: 'POST',
    body: {
      items: [{ variantId, quantity: 2 }],
      addressId,
      slotId,
      paymentMethod: 'COD',
      // A malicious client cannot influence the amount or the payment state.
      pricing: { total: 1 },
      paymentStatus: 'PAID',
      status: 'DELIVERED',
    },
  });
  assert.equal(placed.status, 200);
  orderId = placed.body.order.id;
  assert.equal(placed.body.order.status, 'PLACED');
  assert.equal(placed.body.order.paymentStatus, 'COD');
  assert.equal(placed.body.order.payment.onlinePaymentRequired, false);
  assert.ok(placed.body.order.pricing.total > 1, 'server total must win over the client payload');
  assert.equal(placed.body.order.items[0].quantity, 2);

  const detail = await api(`/products/${productSlug}`, { auth: false });
  assert.equal(detail.body.product.variants[0].stock, stockBefore - 2);

  const list = await api('/orders');
  assert.equal(list.body.orders.some((order) => order.id === orderId), true);
});

test('cancelling an order restores stock and records the timeline', async () => {
  const cancelled = await api(`/orders/${orderId}/cancel`, { method: 'POST' });
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.body.order.status, 'CANCELLED');
  assert.ok(cancelled.body.order.timeline.length >= 2);

  const detail = await api(`/products/${productSlug}`, { auth: false });
  assert.equal(detail.body.product.variants[0].stock, stockBefore);
});

test('reviews require a session and feed the public rating summary', async () => {
  const anonymous = await fetch(`${BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, rating: 5, comment: 'Excellent quality, will order again.' }),
  });
  assert.equal(anonymous.status, 401);

  const created = await api('/reviews', {
    method: 'POST',
    body: { productId, rating: 5, comment: 'Excellent quality, will order again.' },
  });
  assert.equal(created.status, 200);
  assert.equal(created.body.review.rating, 5);

  const duplicate = await api('/reviews', {
    method: 'POST',
    body: { productId, rating: 4, comment: 'Trying to post a second review for the same item.' },
  });
  assert.equal(duplicate.status, 409);

  const summary = await api(`/reviews/${productId}`, { auth: false });
  assert.equal(summary.body.summary.count, 1);
  assert.equal(summary.body.summary.average, 5);
  assert.equal(summary.body.summary.breakdown['5'], 1);
});

test('admin routes reject customers and serve real metrics to administrators', async () => {
  const denied = await api('/admin/stats');
  assert.equal(denied.status, 403);

  cookie = '';
  const sent = await api('/auth/send-otp', {
    method: 'POST',
    auth: false,
    body: { phone: ADMIN_PHONE },
  });
  await api('/auth/verify-otp', {
    method: 'POST',
    auth: false,
    body: { phone: ADMIN_PHONE, otp: sent.body.devCode },
  });

  const me = await api('/auth/me');
  assert.equal(me.body.user.role, 'admin');

  const stats = await api('/admin/stats');
  assert.equal(stats.status, 200);
  assert.equal(stats.body.stats.orders.total, 1);
  assert.equal(stats.body.stats.orders.open, 0);
  assert.equal(stats.body.stats.revenue.paid, 0);
  assert.equal(typeof stats.body.stats.customers, 'number');

  const inventory = await api('/admin/products');
  assert.ok(inventory.body.products.length > 0);

  const orders = await api('/admin/orders');
  assert.equal(orders.body.orders.length, 1);
});

test('contact and newsletter endpoints persist or reject with validation', async () => {
  const contact = await api('/contact', {
    method: 'POST',
    auth: false,
    body: {
      name: 'Test Customer',
      phone: CUSTOMER_PHONE,
      email: 'test@example.com',
      subject: 'Order question',
      message: 'Please share the delivery window for my order.',
    },
  });
  assert.equal(contact.status, 200);
  assert.ok(contact.body.ticketId ?? contact.body.id);

  const newsletter = await api('/newsletter', {
    method: 'POST',
    auth: false,
    body: { email: 'test@example.com', source: 'footer' },
  });
  assert.equal(newsletter.status, 200);

  const invalid = await api('/newsletter', {
    method: 'POST',
    auth: false,
    body: { email: 'not-an-email' },
  });
  assert.equal(invalid.status, 422);
});

test('online payments fail closed when Razorpay is not configured', async () => {
  const methods = await api('/payment-methods', { auth: false });
  assert.equal(methods.status, 200);
  assert.equal(
    methods.body.methods.find((method) => method.id === 'COD').enabled,
    true
  );
  assert.equal(
    methods.body.methods.filter((method) => method.id !== 'COD').every((method) => !method.enabled),
    true
  );
});
