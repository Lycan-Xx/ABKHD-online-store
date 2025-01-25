import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ABKHD-online-store/',
  server: {
    port: 10000,
    host: true
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})

