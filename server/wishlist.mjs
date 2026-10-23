import { all, get, run } from './db.mjs';
import { notFound } from './errors.mjs';
import { hydrateRows } from './catalog.mjs';

export function listWishlist(userId) {
  const rows = all(
    `SELECT p.*,
        (SELECT MIN(v.price_paise) FROM product_variants v WHERE v.product_id = p.id) AS min_price_paise,
        (SELECT COALESCE(SUM(v.stock), 0) FROM product_variants v WHERE v.product_id = p.id) AS total_stock,
        (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.id AND r.status = 'published') AS avg_rating,
        (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id AND r.status = 'published') AS review_count
     FROM wishlist w JOIN products p ON p.id = w.product_id
     WHERE w.user_id = ? AND p.is_active = 1
     ORDER BY w.created_at DESC`,
    [userId]
  );
  return hydrateRows(rows);
}

export function addToWishlist(userId, productId) {
  const product = get('SELECT id FROM products WHERE id = ? AND is_active = 1', [productId]);
  if (!product) throw notFound('Product not found.');
  run('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?) ON CONFLICT DO NOTHING', [
    userId,
    productId,
  ]);
  return listWishlist(userId);
}

export function removeFromWishlist(userId, productId) {
  run('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [userId, productId]);
  return listWishlist(userId);
}

export function clearWishlist(userId) {
  run('DELETE FROM wishlist WHERE user_id = ?', [userId]);
  return [];
}
