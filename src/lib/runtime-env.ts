/**
 * Runtime environment for server code on Cloudflare.
 *
 * `import.meta.env.X` is replaced at BUILD time. A variable that only exists
 * at runtime (e.g. an encrypted Cloudflare secret, which is not exposed to the
 * build) compiles to `undefined`, and every call that needs it fails in
 * production while working locally from `.env`.
 *
 * The middleware hands us the worker's runtime bindings on each request; read
 * from them first and fall back to the build-time value.
 */

let runtimeEnv: Record<string, unknown> = {};

export function setRuntimeEnv(env: unknown): void {
  if (env && typeof env === 'object') runtimeEnv = env as Record<string, unknown>;
}

/** First non-empty string among the runtime binding and the build-time value. */
export function pickEnv(name: string, buildTime?: unknown): string {
  for (const value of [runtimeEnv[name], buildTime]) {
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  }
  return '';
}
