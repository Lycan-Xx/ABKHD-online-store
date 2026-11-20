/**
 * Minimal Appwrite REST client for server-only routes.
 *
 * The browser SDK cannot carry an API key and node-appwrite is not
 * worker-friendly, so server routes call the REST API directly. Only import
 * this module from server code (API routes) so keys never reach the client.
 */

import { pickEnv } from './runtime-env';

const ENDPOINT =
  import.meta.env.PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT = import.meta.env.PUBLIC_APPWRITE_PROJECT_ID || '';

/** Resolved per call: a runtime secret is not available when the build runs. */
function apiKey(): string {
  return (
    pickEnv('APPWRITE_API_KEY', import.meta.env.APPWRITE_API_KEY) ||
    pickEnv('APPWRITE_ADMIN_KEY', import.meta.env.APPWRITE_ADMIN_KEY)
  );
}

const DB_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE_ID || 'abkhd_db';
const ORDERS_ID = import.meta.env.PUBLIC_APPWRITE_COLLECTION_ORDERS || 'orders';

export interface ServerOrder {
  $id: string;
  [key: string]: any;
}

export function hasServerKey(): boolean {
  return apiKey().length > 0;
}

function headers(): Record<string, string> {
  return {
    'X-Appwrite-Project': PROJECT,
    'X-Appwrite-Key': apiKey(),
    'Content-Type': 'application/json',
  };
}

function ordersUrl(): string {
  return `${ENDPOINT}/databases/${DB_ID}/collections/${ORDERS_ID}/documents`;
}

/** Find orders by their Squad payment reference. Requires a server API key. */
export async function findOrdersByPaymentRef(
  paymentRef: string
): Promise<ServerOrder[]> {
  // Appwrite 1.7+/2.x expects JSON query objects in the REST API.
  const query = JSON.stringify({
    method: 'equal',
    attribute: 'paymentRef',
    values: [paymentRef],
  });
  const url = `${ordersUrl()}?queries[]=${encodeURIComponent(query)}`;

  const response = await fetch(url, { headers: headers() });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Appwrite list failed (${response.status}): ${text.slice(0, 300)}`
    );
  }

  const data = JSON.parse(text);
  return Array.isArray(data?.documents) ? data.documents : [];
}

/** Patch a single order document. Requires a server API key. */
export async function updateOrder(
  orderId: string,
  data: Record<string, any>
): Promise<void> {
  const response = await fetch(`${ordersUrl()}/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Appwrite update failed (${response.status}): ${text.slice(0, 300)}`
    );
  }
}

/* ------------------------------------------------------------------ */
/* Generic collection helpers (used by the promo event feature).       */
/* They return the HTTP status so callers can act on 404 / 409.        */
/* ------------------------------------------------------------------ */

export interface DbResult<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
}

function docsUrl(collection: string): string {
  return `${ENDPOINT}/databases/${DB_ID}/collections/${collection}/documents`;
}

async function call<T>(url: string, init: RequestInit): Promise<DbResult<T>> {
  const response = await fetch(url, { ...init, headers: headers() });
  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return { ok: response.ok, status: response.status, data };
}

/** `queries` are Appwrite JSON query objects, e.g. { method: 'equal', ... }. */
export async function dbList<T = any>(
  collection: string,
  queries: Array<Record<string, unknown>> = []
): Promise<T[]> {
  const qs = queries
    .map((q) => `queries[]=${encodeURIComponent(JSON.stringify(q))}`)
    .join('&');
  const res = await call<{ documents: T[] }>(`${docsUrl(collection)}${qs ? `?${qs}` : ''}`, {});
  if (!res.ok) {
    // Status + Appwrite's error type/message only (never the key) so the
    // Cloudflare log says *why*: 401 = no/invalid key, 404 = missing collection.
    const detail = (res.data as any)?.message ? `: ${String((res.data as any).message).slice(0, 160)}` : '';
    throw new Error(`Appwrite list ${collection} failed (${res.status})${detail}`);
  }
  return res.data?.documents ?? [];
}

export function dbGet<T = any>(collection: string, id: string): Promise<DbResult<T>> {
  return call<T>(`${docsUrl(collection)}/${encodeURIComponent(id)}`, {});
}

export function dbCreate<T = any>(
  collection: string,
  id: string,
  data: Record<string, any>
): Promise<DbResult<T>> {
  return call<T>(docsUrl(collection), {
    method: 'POST',
    body: JSON.stringify({ documentId: id, data }),
  });
}

export function dbUpdate<T = any>(
  collection: string,
  id: string,
  data: Record<string, any>
): Promise<DbResult<T>> {
  return call<T>(`${docsUrl(collection)}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ data }),
  });
}

export function dbDelete(collection: string, id: string): Promise<DbResult> {
  return call(`${docsUrl(collection)}/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/** Query builders so route code stays readable. */
export const q = {
  equal: (attribute: string, ...values: unknown[]) => ({ method: 'equal', attribute, values }),
  limit: (n: number) => ({ method: 'limit', values: [n] }),
  orderAsc: (attribute: string) => ({ method: 'orderAsc', attribute }),
};

export { ORDERS_ID };
