import fs from 'node:fs';
import { config } from '../config.mjs';
import { closeDb, migrate } from '../db.mjs';

fs.mkdirSync(new URL('../data', import.meta.url).pathname, { recursive: true });
migrate();
console.log(`[db] database ready at ${config.dbPath}`);
closeDb();
