-- The first catalogue importer stored fixed-amount coupon discounts in rupees
-- while the rest of the schema (and the admin API) stores them in paise.
-- Correct only the two seeded fixed coupons, and only if they still hold the
-- old rupee values, so merchant-edited coupons are never overwritten.
UPDATE coupons SET discount_value = 10000
WHERE code = 'FIRSTORDER' AND discount_type = 'fixed' AND discount_value = 100;

UPDATE coupons SET discount_value = 5000
WHERE code = 'SHUDDH50' AND discount_type = 'fixed' AND discount_value = 50;
