import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const API_TARGET = process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8787'

// The SPA talks to the API on the same origin under /api. In development Vite
// proxies those requests to the local API server so cookies (dd_session) stay
// first-party and the frontend never needs hardcoded hostnames.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_PORT || 5173),
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_PORT || 4173),
  },
  build: {
    sourcemap: false,
  },
})
