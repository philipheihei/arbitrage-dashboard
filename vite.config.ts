/// <reference types="node" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load .env so process.env is available for server-side proxy configuration
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api/polymarket': {
          target: 'https://gamma-api.polymarket.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/polymarket/, ''),
        },
        '/api/yahoo': {
          target: 'https://query1.finance.yahoo.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
        },
        '/api/predictfun': {
          target: 'https://api.predict.fun',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/predictfun/, ''),
          headers: {
            // Key is injected server-side – never reaches the browser bundle
            'x-api-key': env.PREDICTFUN_API_KEY ?? '',
          },
        },
      },
    },
  }
})
