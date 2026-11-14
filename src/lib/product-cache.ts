import { Query } from 'appwrite';
import { databases, APPWRITE_DB_ID, APPWRITE_PRODUCTS_COLLECTION_ID } from './appwrite';
import type { ProductDoc } from './showroom';

/**
 * Short-lived in-memory cache for catalog reads.
 *
 * The shop page pulls up to 200 product documents from Appwrite on every
 * request, which puts a full network round trip in front of the first byte.
 * The catalog changes rarely, so a short TTL removes that latency from the
 * hot path.
 *
 * Disabled in development so product edits in the admin panel show up
 * immediately.
 */

const TTL_MS = 60_000;

type CacheEntry = {
  at: number;
  documents: ProductDoc[];
};

const cache = new Map<string, CacheEntry>();

/**
 * Lists product documents with the given queries, cached for `TTL_MS`.
 * `limit` is applied here so callers do not have to repeat it.
 */
export async function listProductsCached(
  queries: unknown[],
  limit = 200,
): Promise<ProductDoc[]> {
  const key = `${limit}:${JSON.stringify(queries)}`;
  const isDev = import.meta.env.DEV;

  if (!isDev) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) {
      return hit.documents;
    }
  }

  const response = await databases.listDocuments(APPWRITE_DB_ID, APPWRITE_PRODUCTS_COLLECTION_ID, [
    ...(queries as never[]),
    Query.limit(limit),
  ]);

  const documents = response.documents as unknown as ProductDoc[];

  if (!isDev) {
    cache.set(key, { at: Date.now(), documents });
  }

  return documents;
}
