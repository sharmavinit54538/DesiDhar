import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { config } from '../config.mjs';
import { all, closeDb, get, migrate, run, setSetting, transaction } from '../db.mjs';

/**
 * Explicit catalog import.
 *
 * This is NOT part of the production boot path: `npm run db:seed` must be run
 * deliberately by an operator. Re-running it never overwrites prices, stock or
 * merchant flags that have already been edited in the database.
 */

const force = process.argv.includes('--force');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function nowIso() {
  return new Date().toISOString();
}

function seedCategories(catalog) {
  let inserted = 0;
  for (const category of catalog.categories) {
    const existing = get('SELECT slug FROM categories WHERE slug = ?', [category.slug]);
    if (existing) continue;
    run(
      `INSERT INTO categories (id, slug, name, icon_name, image_path, tagline, description, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category.id,
        category.slug,
        category.name,
        category.iconName,
        category.imagePath,
        category.tagline,
        category.description,
        category.sortOrder,
      ]
    );
    inserted += 1;
  }
  return inserted;
}

function seedBanners(catalog) {
  if (all('SELECT id FROM banners').length > 0) return 0;
  for (const banner of catalog.banners) {
    run(
      `INSERT INTO banners (id, title, subtitle, badge, button_text, link, bg_color, bg_gradient, image_path, highlight_text, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        banner.id,
        banner.title,
        banner.subtitle,
        banner.badge,
        banner.buttonText,
        banner.link,
        banner.bgColor,
        banner.bgGradient,
        banner.imagePath,
        banner.highlightText,
        banner.sortOrder,
      ]
    );
  }
  return catalog.banners.length;
}

function upsertProduct(product, db) {
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(product.id);
  const payload = [
    product.slug,
    product.name,
    product.hindiName,
    product.brand,
    product.category,
    product.subcategory,
    product.sweetType,
    product.originRegion,
    product.shortDescription,
    product.description,
    product.ingredients,
    product.nutrition ? JSON.stringify(product.nutrition) : null,
    JSON.stringify(product.tags || []),
    JSON.stringify(product.highlights || []),
    JSON.stringify(product.faqs || []),
    product.shelfLife,
    product.storage,
    product.isVeg ? 1 : 0,
    product.isFeatured ? 1 : 0,
    product.isFresh ? 1 : 0,
    product.isDeal ? 1 : 0,
    product.dealEndsAt,
    nowIso(),
  ];

  if (!existing) {
    db.prepare(
      `INSERT INTO products (
         id, slug, name, hindi_name, brand, category_slug, subcategory, sweet_type, origin_region,
         short_description, description, ingredients, nutrition_json, tags_json, highlights_json,
         faqs_json, shelf_life, storage, is_veg, is_featured, is_fresh, is_deal, deal_ends_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(product.id, ...payload);
    return 'inserted';
  }

  if (!force) return 'skipped';

  // Re-import of descriptive content only; commercial fields are left untouched.
  db.prepare(
    `UPDATE products SET
       slug = ?, name = ?, hindi_name = ?, brand = ?, category_slug = ?, subcategory = ?, sweet_type = ?,
       origin_region = ?, short_description = ?, description = ?, ingredients = ?, nutrition_json = ?,
       tags_json = ?, highlights_json = ?, faqs_json = ?, shelf_life = ?, storage = ?, is_veg = ?,
       updated_at = ?
     WHERE id = ?`
  ).run(
    product.slug,
    product.name,
    product.hindiName,
    product.brand,
    product.category,
    product.subcategory,
    product.sweetType,
    product.originRegion,
    product.shortDescription,
    product.description,
    product.ingredients,
    product.nutrition ? JSON.stringify(product.nutrition) : null,
    JSON.stringify(product.tags || []),
    JSON.stringify(product.highlights || []),
    JSON.stringify(product.faqs || []),
    product.shelfLife,
    product.storage,
    product.isVeg ? 1 : 0,
    nowIso(),
    product.id
  );
  return 'updated';
}

function seedProducts(catalog) {
  const counts = { inserted: 0, updated: 0, skipped: 0, variants: 0, images: 0 };
  transaction((db) => {
    for (const product of catalog.products) {
      const state = upsertProduct(product, db);
      counts[state] += 1;

      const hasVariants = db
        .prepare('SELECT COUNT(*) AS count FROM product_variants WHERE product_id = ?')
        .get(product.id);
      if (Number(hasVariants.count) === 0) {
        for (const [index, variant] of product.variants.entries()) {
          db.prepare(
            `INSERT INTO product_variants
             (id, product_id, weight, price_paise, mrp_paise, stock, sku, is_default, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).run(
            variant.id,
            product.id,
            variant.weight,
            Math.round(Number(variant.price) * 100),
            Math.round(Number(variant.mrp) * 100),
            Number(variant.stock) || 0,
            variant.sku,
            variant.isDefault ? 1 : 0,
            index
          );
          counts.variants += 1;
        }
      }

      const hasImages = db
        .prepare('SELECT COUNT(*) AS count FROM product_images WHERE product_id = ?')
        .get(product.id);
      if (Number(hasImages.count) === 0) {
        for (const image of product.images) {
          db.prepare(
            `INSERT INTO product_images (id, product_id, path, srcset, alt, type, sort_order, width, height, is_verified)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).run(
            `img_${crypto.randomUUID()}`,
            product.id,
            image.path,
            image.srcset || null,
            image.alt || product.name,
            image.type || 'main',
            image.order || 1,
            image.width || 800,
            image.height || 800,
            image.isVerified ? 1 : 0
          );
          counts.images += 1;
        }
      }
    }
  });
  return counts;
}

function seedPincodes() {
  const file = path.join(path.dirname(config.catalogPath), 'serviceable-pincodes.json');
  if (!fs.existsSync(file)) return 0;
  const { pincodes } = readJson(file);
  let inserted = 0;
  for (const entry of pincodes) {
    const existing = get('SELECT pincode FROM serviceable_pincodes WHERE pincode = ?', [entry.pincode]);
    if (existing) continue;
    run(
      `INSERT INTO serviceable_pincodes (pincode, city, estimated_delivery, cold_chain_available, message, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [
        entry.pincode,
        entry.city,
        entry.estimatedDelivery,
        entry.coldChainAvailable ? 1 : 0,
        entry.message,
      ]
    );
    inserted += 1;
  }
  return inserted;
}

function seedCoupons() {
  const file = path.join(path.dirname(config.catalogPath), 'coupons.json');
  if (!fs.existsSync(file)) return 0;
  const { coupons } = readJson(file);
  let inserted = 0;
  for (const coupon of coupons) {
    const existing = get('SELECT code FROM coupons WHERE code = ?', [coupon.code]);
    if (existing) continue;
    run(
      `INSERT INTO coupons (code, discount_type, discount_value, min_order_value_paise, max_discount_paise,
                            description, valid_until, is_active, is_public)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        coupon.code,
        coupon.discountType,
        coupon.discountType === 'fixed'
          ? Math.round(Number(coupon.discountValue) * 100)
          : Math.round(Number(coupon.discountValue)),
        Math.round(Number(coupon.minOrderValue) * 100),
        coupon.maxDiscount == null ? null : Math.round(Number(coupon.maxDiscount) * 100),
        coupon.description,
        coupon.validUntil || null,
        coupon.isPublic ? 1 : 0,
      ]
    );
    inserted += 1;
  }
  return inserted;
}

export function seed({ verbose = true } = {}) {
  migrate();
  const catalog = readJson(config.catalogPath);
  const result = {
    categories: seedCategories(catalog),
    banners: seedBanners(catalog),
    products: seedProducts(catalog),
    pincodes: seedPincodes(),
    coupons: seedCoupons(),
  };

  // Seed settings that are business policy rather than catalog data.
  if (all("SELECT 1 FROM settings WHERE key = 'catalog_seeded_at'").length === 0) {
    setSetting('catalog_seeded_at', nowIso());
  }

  if (verbose) {
    console.log('[seed] catalog import complete');
    console.log(`  categories inserted: ${result.categories}`);
    console.log(`  banners inserted:    ${result.banners}`);
    console.log(
      `  products inserted:   ${result.products.inserted} (updated ${result.products.updated}, already present ${result.products.skipped})`
    );
    console.log(`  variants inserted:   ${result.products.variants}`);
    console.log(`  images inserted:     ${result.products.images}`);
    console.log(`  pincodes inserted:   ${result.pincodes}`);
    console.log(`  coupons inserted:    ${result.coupons}`);
    console.log(
      '  Catalog data is master data. Prices and stock are now owned by the database and should be maintained through the admin API.'
    );
  }

  return result;
}

if (process.argv[1] && process.argv[1].endsWith('seed.mjs')) {
  seed();
  closeDb();
}
