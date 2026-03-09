import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    })
  ],
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  build: {
    assets: 'assets'
  },
  vite: {
    optimizeDeps: {
      exclude: ['lucide-react']
    }
  }
});
