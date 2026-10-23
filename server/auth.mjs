import crypto from 'node:crypto';
import { config } from './config.mjs';
import { all, get, run, transaction, nowIso } from './db.mjs';
import { ApiError, badRequest, unauthorized, validationFailed } from './errors.mjs';
import { parseCookies } from './http.mjs';

const PHONE_RE = /^[6-9]\d{9}$/;
const OTP_RE = /^\d{6}$/;

export function normalizePhone(input) {
  return String(input || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
}

export function assertPhone(phone) {
  if (!PHONE_RE.test(phone)) {
    throw validationFailed(
      [{ field: 'phone', message: 'Enter a valid 10-digit Indian mobile number.' }],
      'Enter a valid 10-digit Indian mobile number.'
    );
  }
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function hmac(value) {
  return crypto.createHmac('sha256', config.otpSecret).update(value).digest('hex');
}

function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    phone: row.phone,
    name: row.name || '',
    email: row.email || '',
    role: row.role,
    isLoggedIn: true,
  };
}

export function getUserById(id) {
  return get('SELECT * FROM users WHERE id = ?', [id]);
}

/* ------------------------------------------------------------------ *
 * OTP delivery
 * ------------------------------------------------------------------ */

async function deliverOtp(phone, code) {
  if (config.smsProvider === 'console') {
    if (config.isProduction) {
      throw new ApiError(
        503,
        'OTP_DELIVERY_NOT_CONFIGURED',
        'OTP delivery is not configured. Set SMS_PROVIDER and its credentials before using mobile login in production.'
      );
    }
    console.log(`[auth] Development OTP for +91${phone}: ${code}`);
    return { channel: 'console' };
  }

  if (config.smsProvider === 'msg91') {
    const { authKey, templateId, senderId } = config.msg91;
    if (!authKey || !templateId) {
      throw new ApiError(
        503,
        'OTP_DELIVERY_NOT_CONFIGURED',
        'MSG91 is selected but MSG91_AUTH_KEY / MSG91_TEMPLATE_ID are missing.'
      );
    }
    const response = await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authkey: authKey },
      body: JSON.stringify({
        template_id: templateId,
        mobile: `91${phone}`,
        authkey: authKey,
        sender: senderId,
        otp: code,
      }),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('[auth] MSG91 delivery failed', response.status, text.slice(0, 300));
      throw new ApiError(502, 'OTP_DELIVERY_FAILED', 'Could not deliver the OTP right now. Please try again.');
    }
    return { channel: 'sms' };
  }

  throw new ApiError(
    503,
    'OTP_DELIVERY_NOT_CONFIGURED',
    'No OTP delivery provider is configured. Set SMS_PROVIDER=msg91 with credentials, or SMS_PROVIDER=console for local development.'
  );
}

export async function sendOtp(rawPhone) {
  const phone = normalizePhone(rawPhone);
  assertPhone(phone);

  const windowStart = new Date(Date.now() - config.otpWindowMs).toISOString();
  const recent = all(
    'SELECT created_at FROM otp_challenges WHERE phone = ? AND created_at > ? ORDER BY created_at DESC',
    [phone, windowStart]
  );
  if (recent.length >= config.otpMaxPerWindow) {
    throw new ApiError(429, 'OTP_RATE_LIMITED', 'Too many OTP requests. Please try again in 15 minutes.');
  }
  if (recent.length > 0) {
    const last = new Date(recent[0].created_at.replace(' ', 'T') + 'Z').getTime();
    const waitMs = config.otpResendCooldownMs - (Date.now() - last);
    if (Number.isFinite(last) && waitMs > 0) {
      throw new ApiError(429, 'OTP_COOLDOWN', `Please wait ${Math.ceil(waitMs / 1000)}s before requesting another OTP.`);
    }
  }

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  const id = `otp_${crypto.randomUUID()}`;
  const expiresAt = new Date(Date.now() + config.otpTtlMs).toISOString();
  run(
    'INSERT INTO otp_challenges (id, phone, code_hash, expires_at) VALUES (?, ?, ?, ?)',
    [id, phone, hmac(`${phone}:${code}`), expiresAt]
  );

  const delivery = await deliverOtp(phone, code);

  const payload = {
    success: true,
    message: 'Verification code sent.',
    expiresInSeconds: Math.round(config.otpTtlMs / 1000),
    deliveryChannel: delivery.channel,
  };
  // Development convenience: echo the code so the local UI is usable without an SMS
  // gateway. Never enabled by default in production.
  if (config.otpDevEcho && delivery.channel === 'console') {
    payload.devMode = true;
    payload.devCode = code;
    payload.message = 'Development mode: use the code shown in the verification step.';
  }
  return payload;
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const id = `sess_${crypto.randomUUID()}`;
  const expiresAt = new Date(Date.now() + config.sessionTtlMs).toISOString();
  run('INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)', [
    id,
    userId,
    sha256(token),
    expiresAt,
  ]);
  return { token, id, expiresAt };
}

function ensureAdminRole(user) {
  if (user.role !== 'admin' && config.adminPhones.includes(user.phone)) {
    run('UPDATE users SET role = ?, updated_at = ? WHERE id = ?', ['admin', nowIso(), user.id]);
    user.role = 'admin';
  }
  return user;
}

export function verifyOtp(rawPhone, rawCode) {
  const phone = normalizePhone(rawPhone);
  const code = String(rawCode || '').trim();
  assertPhone(phone);
  if (!OTP_RE.test(code)) {
    throw validationFailed(
      [{ field: 'otp', message: 'Enter the 6-digit verification code.' }],
      'Enter the 6-digit verification code.'
    );
  }

  const challenge = get(
    `SELECT * FROM otp_challenges
     WHERE phone = ? AND consumed_at IS NULL
     ORDER BY created_at DESC LIMIT 1`,
    [phone]
  );
  if (!challenge) {
    throw new ApiError(400, 'OTP_NOT_FOUND', 'Request a new verification code to continue.');
  }
  if (new Date(challenge.expires_at).getTime() < Date.now()) {
    throw new ApiError(400, 'OTP_EXPIRED', 'This code has expired. Request a new one.');
  }
  if (challenge.attempts >= 5) {
    throw new ApiError(429, 'OTP_ATTEMPTS_EXCEEDED', 'Too many incorrect attempts. Request a new code.');
  }

  const matches = safeEqual(challenge.code_hash, hmac(`${phone}:${code}`));
  if (!matches) {
    run('UPDATE otp_challenges SET attempts = attempts + 1 WHERE id = ?', [challenge.id]);
    throw new ApiError(400, 'OTP_INVALID', 'Incorrect verification code.');
  }

  const result = transaction((db) => {
    db.prepare('UPDATE otp_challenges SET consumed_at = ? WHERE id = ?').run(nowIso(), challenge.id);
    let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    if (!user) {
      const id = `user_${crypto.randomUUID()}`;
      db.prepare('INSERT INTO users (id, phone, name, email) VALUES (?, ?, ?, ?)').run(id, phone, '', '');
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }
    return user;
  });

  ensureAdminRole(result);
  const session = createSession(result.id);
  return { user: mapUser(result), sessionToken: session.token, expiresAt: session.expiresAt };
}

/* ------------------------------------------------------------------ *
 * Session handling
 * ------------------------------------------------------------------ */

export function getSessionUser(req) {
  const cookies = parseCookies(req);
  const authHeader = req.headers.authorization || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const token = bearer || cookies[config.sessionCookie] || '';
  if (!token) return null;

  const row = get(
    `SELECT s.id AS session_id, s.expires_at, u.*
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.revoked_at IS NULL`,
    [sha256(token)]
  );
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    run('UPDATE sessions SET revoked_at = ? WHERE id = ?', [nowIso(), row.session_id]);
    return null;
  }
  return { user: ensureAdminRole(row), sessionId: row.session_id, token };
}

export function requireUser(req) {
  const session = getSessionUser(req);
  if (!session) throw unauthorized();
  return session;
}

export function requireAdmin(req) {
  const session = requireUser(req);
  if (session.user.role !== 'admin') {
    throw new ApiError(403, 'ADMIN_ONLY', 'Administrator access is required for this operation.');
  }
  return session;
}

export function revokeSession(sessionId) {
  run('UPDATE sessions SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL', [nowIso(), sessionId]);
}

export function userIdForPhone(phone) {
  const row = get('SELECT id FROM users WHERE phone = ?', [normalizePhone(phone)]);
  return row?.id || null;
}

export function promoteAdminByPhone(phone) {
  const normalized = normalizePhone(phone);
  if (!PHONE_RE.test(normalized)) throw badRequest('Enter a valid 10-digit mobile number.');
  const row = get('SELECT id FROM users WHERE phone = ?', [normalized]);
  if (!row) {
    throw badRequest('No registered user has that phone number. The user must sign in once before being promoted.');
  }
  run('UPDATE users SET role = ?, updated_at = ? WHERE id = ?', ['admin', nowIso(), row.id]);
  return normalized;
}
