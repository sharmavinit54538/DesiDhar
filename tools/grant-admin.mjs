#!/usr/bin/env node
/**
 * Promote a registered mobile number to the admin role.
 *
 *   npm run admin:grant -- 9876543210
 *
 * The account must already exist (the owner signs in once with an OTP). This is
 * an operator-only CLI; it touches the database directly and never runs in the
 * browser or in the API request path.
 */
import crypto from 'node:crypto';
import { get, run } from '../server/db.mjs';
import { config } from '../server/config.mjs';

const raw = process.argv[2];
const phone = String(raw || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');

if (!/^[6-9]\d{9}$/.test(phone)) {
  console.error('Usage: npm run admin:grant -- <10-digit mobile number>');
  process.exit(1);
}

const user = get('SELECT id, phone, name, role FROM users WHERE phone = ?', [phone]);
if (!user) {
  console.error(
    `No account exists for +91${phone}. Ask the owner to sign in once (OTP) and re-run this command.`
  );
  process.exit(1);
}

if (user.role === 'admin') {
  console.log(`+91${phone} is already an admin.`);
  process.exit(0);
}

run('UPDATE users SET role = ?, updated_at = ? WHERE id = ?', [
  'admin',
  new Date().toISOString(),
  user.id,
]);

// Audit trail for privilege changes: an order_events-style row would be
// misleading, so record it in the application log instead.
console.log(
  `Granted admin to +91${phone} (${user.name || `Customer ${phone.slice(-4)}`}) in ${config.dbPath}. ` +
    `Audit id: ${crypto.randomUUID()}`
);
