import { defineMiddleware } from 'astro:middleware';
import { setRuntimeEnv } from './lib/runtime-env';

/** Expose Cloudflare's runtime bindings (secrets / variables) to server helpers. */
export const onRequest = defineMiddleware((context, next) => {
  setRuntimeEnv((context.locals as { runtime?: { env?: unknown } }).runtime?.env);
  return next();
});
