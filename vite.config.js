import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // redireciona todas as requisiçoes que começam com /api
      // para http://localhost:3000 (onde o Express está rodando)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})