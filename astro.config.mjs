import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true
    }
  }),
  build: {
    assets: 'assets'
  },
  vite: {
    resolve: {
      // @astrojs/cloudflare aliases "react-dom/server" -> "react-dom/server.browser".
      // React 19's browser server build evaluates `new MessageChannel()` at module
      // scope, which the Workers runtime does not implement -> worker fails to
      // publish ("MessageChannel is not defined"). The edge build provides the
      // same web-stream API (renderToReadableStream) without MessageChannel.
      alias: [
        {
          find: 'react-dom/server',
          replacement: 'react-dom/server.edge'
        }
      ]
    }
  }
});
