import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // acessível fora do container Docker
    port: 5174,
    proxy: {
      // Encaminha chamadas de API para o Laravel.
      // Em Docker define-se VITE_PROXY_TARGET=http://backend:8000
      '/api': {
        target: process.env.VITE_PROXY_TARGET ?? 'http://localhost:8001',
        changeOrigin: true,
      },
    },
    watch: { usePolling: true }, // deteção de alterações fiável em Docker/macOS
  },
})
