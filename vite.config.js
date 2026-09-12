import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        timeout: 120000, // 2 minutes for bulk image upload
        configure: (proxy) => {
          proxy.on("error", (err, req) => {
            console.error(`[Vite Proxy Error] ${req.method} ${req.url}:`, err.message);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[Vite Proxy -> Express] ${req.method} ${req.url}`);
          });
        },
      },
      "/uploads": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        timeout: 60000,
      },
    },
  },
})
