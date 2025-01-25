import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ABKHD-online-store/',
  server: {
    port: process.env.PORT || 10000, // Use PORT from environment or default to 10000
    host: '0.0.0.0', // Bind to all network interfaces
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
