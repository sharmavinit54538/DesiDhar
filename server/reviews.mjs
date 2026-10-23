import crypto from 'node:crypto';
import { all, get, run } from './db.mjs';
import { ApiError, forbidden, notFound, validationFailed } from './errors.mjs';

function mapReview(row) {
  return {
    id: row.id,
    productId: row.product_id,
    userName: row.user_name,
    userLocation: row.user_location || '',
    rating: row.rating,
    date: row.created_at,
    comment: row.comment,
    verifiedPurchase: Boolean(row.verified_purchase),
    helpfulCount: row.helpful_count,
    status: row.status,
    productName: row.product_name,
    productSlug: row.product_slug,
  };
}

export function listPublishedReviews(productId) {
  return all(
    `SELECT r.*, p.name AS product_name, p.slug AS product_slug
     FROM reviews r JOIN products p ON p.id = r.product_id
     WHERE r.product_id = ? AND r.status = 'published'
     ORDER BY r.created_at DESC`,
    [productId]
  ).map(mapReview);
}

export function reviewSummary(productId) {
  const rows = all(
    `SELECT rating, COUNT(*) AS count FROM reviews
     WHERE product_id = ? AND status = 'published' GROUP BY rating`,
    [productId]
  );
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;
  let weighted = 0;
  for (const row of rows) {
    const count = Number(row.count);
    breakdown[row.rating] = count;
    total += count;
    weighted += row.rating * count;
  }
  return {
    average: total > 0 ? Number((weighted / total).toFixed(1)) : null,
    count: total,
    breakdown,
  };
}

export function featuredReviews(limit = 3) {
  return all(
    `SELECT r.*, p.name AS product_name, p.slug AS product_slug
     FROM reviews r JOIN products p ON p.id = r.product_id
     WHERE r.status = 'published'
     ORDER BY r.verified_purchase DESC, r.rating DESC, r.created_at DESC
     LIMIT ?`,
    [limit]
  ).map(mapReview);
}

export function hasPurchased(userId, productId) {
  return Boolean(
    get(
      `SELECT 1 AS ok FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       WHERE o.user_id = ? AND oi.product_id = ? AND o.status <> 'CANCELLED'
       LIMIT 1`,
      [userId, productId]
    )
  );
}

export function createReview(user, productId, payload) {
  const product = get('SELECT id, name FROM products WHERE id = ? AND is_active = 1', [productId]);
  if (!product) throw notFound('Product not found.');

  const rating = Number(payload?.rating);
  const comment = String(payload?.comment || '').trim();
  const errors = [];
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push({ field: 'rating', message: 'Choose a rating between 1 and 5 stars.' });
  }
  if (comment.length < 10) {
    errors.push({ field: 'comment', message: 'Please write at least 10 characters.' });
  }
  if (comment.length > 2000) {
    errors.push({ field: 'comment', message: 'Reviews are limited to 2000 characters.' });
  }
  if (errors.length > 0) throw validationFailed(errors);

  const existing = get(
    'SELECT id FROM reviews WHERE product_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 1',
    [productId, user.id]
  );
  if (existing) {
    throw new ApiError(409, 'REVIEW_EXISTS', 'You have already reviewed this product.');
  }

  const verified = hasPurchased(user.id, productId);
  const id = `rev_${crypto.randomUUID()}`;
  run(
    `INSERT INTO reviews (id, product_id, user_id, user_name, user_location, rating, comment,
                          verified_purchase, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
    [
      id,
      productId,
      user.id,
      user.name?.trim() || `Customer ${user.phone.slice(-4)}`,
      payload?.userLocation ? String(payload.userLocation).slice(0, 120) : '',
      rating,
      comment,
      verified ? 1 : 0,
    ]
  );
  const row = get('SELECT * FROM reviews WHERE id = ?', [id]);
  return mapReview(row);
}

export function requireOwnReview(user, reviewId) {
  const row = get('SELECT * FROM reviews WHERE id = ?', [reviewId]);
  if (!row) throw notFound('Review not found.');
  if (row.user_id !== user.id && user.role !== 'admin') throw forbidden();
  return row;
}

/* Admin moderation */

export function adminListReviews({ status } = {}) {
  const clauses = [];
  const values = [];
  if (status) {
    clauses.push('r.status = ?');
    values.push(status);
  }
  const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  return all(
    `SELECT r.*, p.name AS product_name, p.slug AS product_slug, u.phone AS user_phone
     FROM reviews r
     JOIN products p ON p.id = r.product_id
     LEFT JOIN users u ON u.id = r.user_id
     ${where}
     ORDER BY r.created_at DESC LIMIT 200`,
    values
  ).map((row) => ({ ...mapReview(row), userPhone: row.user_phone || null }));
}

export function moderateReview(reviewId, status) {
  if (!['published', 'pending', 'hidden'].includes(status)) {
    throw validationFailed([{ field: 'status', message: 'Unknown review status.' }]);
  }
  const row = get('SELECT id FROM reviews WHERE id = ?', [reviewId]);
  if (!row) throw notFound('Review not found.');
  run('UPDATE reviews SET status = ? WHERE id = ?', [status, reviewId]);
  return { id: reviewId, status };
}
