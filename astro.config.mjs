import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

/**
 * Build-only alias for React's server renderer.
 *
 * @astrojs/cloudflare aliases "react-dom/server" -> "react-dom/server.browser".
 * React 19's browser server build evaluates `new MessageChannel()` at module
 * scope, which the Workers runtime does not implement, so the worker fails to
 * publish ("MessageChannel is not defined"). The edge build exposes the same
 * web-stream API (renderToReadableStream) without MessageChannel.
 *
 * The alias has to be applied inside `astro:build:setup` (build only) rather
 * than in the static `vite` config:
 *   - in dev the adapter does not set `ssr.noExternal`, so react-dom stays
 *     external and Node loads the CommonJS entry directly. Aliasing it in dev
 *     makes Vite inline the CommonJS file as ESM -> "require is not defined".
 *   - Astro cannot merge a callback-shaped `vite` config, so `command` is not
 *     available to the static config either.
 */
const reactEdgeServer = {
  name: 'abkhd:react-edge-server',
  hooks: {
    'astro:build:setup': ({ vite }) => {
      vite.resolve ||= {};
      const existing = Array.isArray(vite.resolve.alias)
        ? vite.resolve.alias
        : Object.entries(vite.resolve.alias ?? {}).map(([find, replacement]) => ({ find, replacement }));

      // Keep this entry first: Vite uses the first matching alias.
      vite.resolve.alias = [
        { find: 'react-dom/server', replacement: 'react-dom/server.edge' },
        ...existing.filter((entry) => entry.find !== 'react-dom/server'),
      ];
    },
  },
};

export default defineConfig({
  output: 'server',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    reactEdgeServer,
  ],
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true,
    },
  }),
  build: {
    assets: 'assets',
  },
});
