import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { config, DEFAULT_SETTINGS, ROOT_DIR } from './config.mjs';

let db = null;

export function getDb() {
  if (db) return db;
  fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
  db = new DatabaseSync(config.dbPath);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;');
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

export function all(sql, params = []) {
  return getDb().prepare(sql).all(...params);
}

export function get(sql, params = []) {
  return getDb().prepare(sql).get(...params) ?? null;
}

export function run(sql, params = []) {
  return getDb().prepare(sql).run(...params);
}

export function exec(sql) {
  return getDb().exec(sql);
}

export function transaction(fn) {
  const database = getDb();
  database.exec('BEGIN IMMEDIATE');
  try {
    const result = fn(database);
    database.exec('COMMIT');
    return result;
  } catch (error) {
    try {
      database.exec('ROLLBACK');
    } catch {
      /* ignore rollback errors */
    }
    throw error;
  }
}

export function migrate() {
  const database = getDb();
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const applied = new Set(
    database.prepare('SELECT name FROM schema_migrations').all().map((row) => row.name)
  );

  if (!fs.existsSync(config.migrationsDir)) {
    throw new Error(`Migrations directory not found: ${config.migrationsDir}`);
  }

  const files = fs
    .readdirSync(config.migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(config.migrationsDir, file), 'utf8');
    database.exec('BEGIN IMMEDIATE');
    try {
      database.exec(sql);
      database.prepare('INSERT INTO schema_migrations (name) VALUES (?)').run(file);
      database.exec('COMMIT');
      console.log(`[db] applied migration ${file}`);
    } catch (error) {
      database.exec('ROLLBACK');
      throw new Error(`Migration ${file} failed: ${error.message}`);
    }
  }

  ensureDefaultSettings();
}

function ensureDefaultSettings() {
  const insert = getDb().prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO NOTHING'
  );
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    insert.run(key, value);
  }
}

export function getSettings() {
  const rows = all('SELECT key, value FROM settings');
  const settings = { ...DEFAULT_SETTINGS };
  for (const row of rows) settings[row.key] = row.value;
  return settings;
}

export function setSetting(key, value) {
  run(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
    [key, String(value)]
  );
}

export function settingsToPublic(settings) {
  return {
    currency: settings.currency || 'INR',
    freeDeliveryThreshold: paiseToRupees(settings.delivery_free_threshold_paise),
    deliveryFee: paiseToRupees(settings.delivery_fee_paise),
    codEnabled: settings.cod_enabled === 'true',
    onlinePaymentsEnabled: config.razorpay.enabled,
    paymentProvider: config.razorpay.enabled ? 'razorpay' : null,
    fssaiLicenseNumber: settings.fssai_license_number?.trim() || null,
    supportEmail: settings.support_email?.trim() || null,
    supportPhone: settings.support_phone?.trim() || null,
    supportWhatsapp: settings.support_whatsapp?.trim() || null,
    supportHours: settings.support_hours?.trim() || null,
    companyName: settings.company_legal_name?.trim() || null,
    companyAddress: settings.company_address?.trim() || null,
    companyGstin: settings.company_gstin?.trim() || null,
  };
}

export function paiseToRupees(paise) {
  return Math.round(Number(paise || 0)) / 100;
}

export function rupeesToPaise(rupees) {
  return Math.round(Number(rupees || 0) * 100);
}

export function nowIso() {
  return new Date().toISOString();
}

export function istDateString(date = new Date(), offsetDays = 0) {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const shifted = new Date(date.getTime() + IST_OFFSET_MS + offsetDays * 24 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
}

export function istHour(date = new Date()) {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  return new Date(date.getTime() + IST_OFFSET_MS).getUTCHours();
}

export function resolveProjectPath(relativeOrAbsolute) {
  if (!relativeOrAbsolute) return null;
  if (path.isAbsolute(relativeOrAbsolute)) return relativeOrAbsolute;
  return path.join(ROOT_DIR, relativeOrAbsolute);
}
