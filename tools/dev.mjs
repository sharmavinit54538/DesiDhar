#!/usr/bin/env node
/**
 * Development runner.
 *
 * Starts the API server and the Vite dev server together so the SPA and the
 * backend share one origin through the /api proxy. Both processes are stopped
 * when this parent exits (Ctrl+C).
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiPort = process.env.API_PORT || process.env.PORT || '8787';
const webPort = process.env.VITE_PORT || '5173';

const children = [];
let shuttingDown = false;

function run(name, command, args, env) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  children.push(child);
  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    console.log(`[dev] ${name} exited (${signal || code}). Stopping the other process.`);
    shutdown(code ?? 0);
  });
  return child;
}

function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(code), 250);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log(`[dev] API  http://localhost:${apiPort}`);
console.log(`[dev] Web  http://localhost:${webPort}`);

run('api', process.execPath, ['server/index.mjs'], { PORT: apiPort });
run('web', 'npx', ['vite', '--port', String(webPort), '--strictPort'], {
  VITE_API_PROXY_TARGET: `http://127.0.0.1:${apiPort}`,
});
