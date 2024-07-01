import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  base: '/virtual-dojo/frontend/',
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  }
})
