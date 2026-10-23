import http from 'node:http';
import { config } from './config.mjs';
import { closeDb, migrate } from './db.mjs';
import { handleRequest } from './routes.mjs';

export function createServer() {
  migrate();
  return http.createServer((req, res) => {
    const startedAt = Date.now();
    res.on('finish', () => {
      if (req.url?.startsWith('/api')) {
        console.log(
          `[api] ${req.method} ${req.url} -> ${res.statusCode} (${Date.now() - startedAt}ms)`
        );
      }
    });
    handleRequest(req, res).catch((error) => {
      console.error('[api] fatal request error', error);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error.' } }));
    });
  });
}

if (process.argv[1] && process.argv[1].endsWith('index.mjs')) {
  migrate();
  const server = createServer();
  server.listen(config.port, config.host, () => {
    console.log(`[desidhar] API listening on http://${config.host}:${config.port}`);
    console.log(`[desidhar] database: ${config.dbPath}`);
    console.log(
      `[desidhar] OTP delivery: ${config.smsProvider}${config.otpDevEcho ? ' (development echo enabled)' : ''}`
    );
    console.log(
      `[desidhar] online payments: ${config.razorpay.enabled ? 'razorpay configured' : 'not configured (COD only)'}`
    );
    console.log(`[desidhar] static assets: ${config.serveStatic ? config.staticDir : 'disabled'}`);
  });

  const shutdown = () => {
    console.log('\n[desidhar] shutting down…');
    server.close(() => {
      closeDb();
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 3000).unref();
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
