import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/virtual-dojo/frontend/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  env: {
    VITE_API_URL: process.env.VITE_API_URL,
  }
})
