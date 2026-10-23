import fs from 'node:fs';
import path from 'node:path';

const SERVER_DIR = path.dirname(new URL(import.meta.url).pathname);
export const ROOT_DIR = path.resolve(SERVER_DIR, '..');

/**
 * Minimal .env loader. Vite only exposes VITE_* variables to the browser, so the
 * API server needs to read the same file itself for its own configuration.
 * Real deployments should set these as environment variables instead.
 */
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(ROOT_DIR, '.env'));

const isProduction = process.env.NODE_ENV === 'production';
const bool = (value, fallback = false) => {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT || 8787),
  dbPath: process.env.DB_PATH || path.join(ROOT_DIR, 'server', 'data', 'desidhar.db'),
  catalogPath:
    process.env.CATALOG_PATH || path.join(ROOT_DIR, 'server', 'db', 'seed', 'catalog.json'),
  migrationsDir: path.join(ROOT_DIR, 'server', 'db', 'migrations'),
  staticDir: process.env.STATIC_DIR || path.join(ROOT_DIR, 'dist'),
  publicDir: path.join(ROOT_DIR, 'public'),
  serveStatic: process.env.SERVE_STATIC !== 'false',

  sessionTtlMs: Number(process.env.SESSION_TTL_HOURS || 24 * 30) * 60 * 60 * 1000,
  sessionCookie: 'dd_session',
  otpSecret: process.env.OTP_SECRET || '',
  otpTtlMs: Number(process.env.OTP_TTL_MINUTES || 5) * 60 * 1000,
  otpResendCooldownMs: 30 * 1000,
  otpMaxPerWindow: Number(process.env.OTP_MAX_PER_WINDOW || 5),
  otpWindowMs: 15 * 60 * 1000,
  otpDevEcho: bool(process.env.OTP_DEV_ECHO, !isProduction),
  smsProvider: process.env.SMS_PROVIDER || (isProduction ? 'unconfigured' : 'console'),
  msg91: {
    authKey: process.env.MSG91_AUTH_KEY || '',
    templateId: process.env.MSG91_TEMPLATE_ID || '',
    senderId: process.env.MSG91_SENDER_ID || 'DESIDH',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    get enabled() {
      return Boolean(this.keyId && this.keySecret);
    },
  },

  adminPhones: (process.env.ADMIN_PHONES || '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean),
};

// A stable, deployment-specific secret is required to sign OTP codes. If none is
// configured we generate an ephemeral one at boot: OTPs issued before a restart
// become invalid, which is safe (never a fabricated success), just stricter.
if (!config.otpSecret) {
  config.otpSecret = process.env.NODE_ENV === 'test' ? 'test-otp-secret' : `ephemeral-${Math.random().toString(36).slice(2)}`;
  if (!isProduction) {
    console.warn(
      '[desidhar] OTP_SECRET is not configured. Generated an ephemeral secret; issued OTPs will not survive a server restart.'
    );
  }
}

/** Business policy defaults. Values live in the settings table and are admin-editable. */
export const DEFAULT_SETTINGS = {
  currency: 'INR',
  delivery_free_threshold_paise: '49900',
  delivery_fee_paise: '4000',
  cod_enabled: 'true',
  fssai_license_number: '',
  support_email: '',
  support_phone: '',
  support_whatsapp: '',
  support_hours: 'Mon – Sun, 9:00 AM – 9:00 PM IST',
  company_legal_name: '',
  company_address: '',
  company_gstin: '',
  order_number_prefix: 'DD',
  delivery_slot_windows: JSON.stringify([
    {
      id: 'morning',
      title: 'Early Morning Milk Run',
      start: '06:00',
      end: '08:00',
      note: 'Cold-chain insulated box',
    },
    { id: 'mid-morning', title: 'Mid-Morning Slot', start: '08:00', end: '11:00' },
    { id: 'evening', title: 'Evening Slot', start: '17:00', end: '20:00' },
  ]),
  slot_booking_cutoff_hour_ist: '21',
};
