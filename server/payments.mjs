import crypto from 'node:crypto';
import { config } from './config.mjs';
import { all, get, run } from './db.mjs';
import { ApiError, badRequest, notFound, validationFailed } from './errors.mjs';

/**
 * Razorpay integration.
 *
 * Nothing here runs unless RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are present.
 * The payment status of an order is only changed after the provider's signature
 * has been verified server-side; the browser can never self-declare success.
 */

const RAZORPAY_API = 'https://api.razorpay.com/v1';

function authHeader() {
  const token = Buffer.from(`${config.razorpay.keyId}:${config.razorpay.keySecret}`).toString('base64');
  return `Basic ${token}`;
}

export async function createRazorpayOrder(order) {
  if (!config.razorpay.enabled) {
    throw new ApiError(503, 'PAYMENTS_NOT_CONFIGURED', 'Online payments are not configured.');
  }
  const response = await fetch(`${RAZORPAY_API}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      amount: order.total_paise,
      currency: 'INR',
      receipt: order.order_number,
      notes: { desidhar_order_id: order.id },
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('[payments] Razorpay order creation failed', response.status, body);
    throw new ApiError(502, 'PAYMENT_PROVIDER_ERROR', 'Could not start the online payment. Please try again.');
  }
  return {
    provider: 'razorpay',
    keyId: config.razorpay.keyId,
    razorpayOrderId: body.id,
    amount: body.amount,
    currency: body.currency,
    orderNumber: order.order_number,
  };
}

export function verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, signature }) {
  if (!config.razorpay.enabled) {
    throw new ApiError(503, 'PAYMENTS_NOT_CONFIGURED', 'Online payments are not configured.');
  }
  const expected = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature || ''));
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!valid) {
    throw badRequest('Payment signature verification failed.');
  }
  return true;
}

/* ------------------------------------------------------------------ *
 * Support inbox / newsletter (real persistence, no fake success)
 * ------------------------------------------------------------------ */

export function createContactMessage(payload) {
  const name = String(payload?.name || '').trim();
  const phone = String(payload?.phone || '').replace(/\D/g, '');
  const email = String(payload?.email || '').trim();
  const subject = String(payload?.subject || 'General Inquiry').trim();
  const message = String(payload?.message || '').trim();
  const errors = [];
  if (name.length < 2) errors.push({ field: 'name', message: 'Enter your name.' });
  if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.push({ field: 'phone', message: 'Enter a valid 10-digit mobile number.' });
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Enter a valid email address.' });
  }
  if (message.length < 10) errors.push({ field: 'message', message: 'Please describe your query.' });
  if (errors.length > 0) {
    throw validationFailed(errors, 'Please correct the highlighted fields.');
  }
  const id = `msg_${crypto.randomUUID()}`;
  run(
    `INSERT INTO contact_messages (id, name, email, phone, subject, message)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, email || null, phone, subject, message]
  );
  return { id, receivedAt: new Date().toISOString() };
}

export function subscribeNewsletter(email, source = 'footer') {
  const value = String(email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
    throw validationFailed([{ field: 'email', message: 'Enter a valid email address.' }], 'Enter a valid email address.');
  }
  run(
    `INSERT INTO newsletter_subscribers (email, source) VALUES (?, ?)
     ON CONFLICT(email) DO NOTHING`,
    [value, source]
  );
  const row = get('SELECT created_at FROM newsletter_subscribers WHERE email = ?', [value]);
  return { email: value, subscribedAt: row?.created_at };
}

export function listContactMessages() {
  return all('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 200').map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export function resolveMessage(id) {
  const row = get('SELECT id FROM contact_messages WHERE id = ?', [id]);
  if (!row) throw notFound('Message not found.');
  run("UPDATE contact_messages SET status = 'resolved' WHERE id = ?", [id]);
  return { id, status: 'resolved' };
}
