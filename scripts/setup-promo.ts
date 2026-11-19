/**
 * Create the Appwrite resources for the promo event feature.
 *
 *   collections: promo_events, promo_items, promo_claims  (admin-only)
 *
 * Promo photos reuse the store's existing images bucket (no new bucket, so it
 * works within the free plan's bucket limit).
 *
 * Idempotent: safe to run repeatedly. Run with:  yarn setup-promo
 * Needs APPWRITE_ADMIN_KEY (or APPWRITE_API_KEY) with databases + storage scopes.
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

const key = process.env.APPWRITE_ADMIN_KEY || process.env.APPWRITE_API_KEY;
if (!key) {
  console.error('APPWRITE_ADMIN_KEY (or APPWRITE_API_KEY) is not set in .env');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(key);

const databases = new Databases(client);

const DB_ID = process.env.PUBLIC_APPWRITE_DATABASE_ID || 'abkhd_db';
const EVENTS = 'promo_events';
const ITEMS = 'promo_items';
const CLAIMS = 'promo_claims';

const adminOnly = [
  Permission.read(Role.team('admin')),
  Permission.write(Role.team('admin')),
  Permission.read(Role.label('admin')),
  Permission.write(Role.label('admin')),
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ensureCollection(id: string, name: string) {
  try {
    await databases.getCollection(DB_ID, id);
    console.log(`= collection ${id} exists`);
  } catch (e: any) {
    if (e.code !== 404) throw e;
    await databases.createCollection(DB_ID, id, name, adminOnly);
    console.log(`+ collection ${id} created`);
  }
}

type Attr =
  | { key: string; type: 'string'; size: number; required?: boolean; array?: boolean }
  | { key: string; type: 'integer'; required?: boolean; def?: number }
  | { key: string; type: 'boolean'; required?: boolean; def?: boolean }
  | { key: string; type: 'datetime'; required?: boolean };

async function ensureAttributes(collection: string, attrs: Attr[]) {
  const existing = new Set(
    (await databases.listAttributes(DB_ID, collection)).attributes.map((a: any) => a.key)
  );

  for (const a of attrs) {
    if (existing.has(a.key)) continue;
    const required = a.required ?? false;
    if (a.type === 'string') {
      await databases.createStringAttribute(DB_ID, collection, a.key, a.size, required, undefined, a.array ?? false);
    } else if (a.type === 'integer') {
      await databases.createIntegerAttribute(DB_ID, collection, a.key, required, undefined, undefined, required ? undefined : a.def);
    } else if (a.type === 'boolean') {
      await databases.createBooleanAttribute(DB_ID, collection, a.key, required, required ? undefined : a.def);
    } else {
      await databases.createDatetimeAttribute(DB_ID, collection, a.key, required);
    }
    console.log(`+ ${collection}.${a.key}`);
  }

  // Indexes can only be built once every attribute is available.
  for (let i = 0; i < 60; i++) {
    const list = (await databases.listAttributes(DB_ID, collection)).attributes as any[];
    if (list.every((a) => a.status === 'available')) return;
    await sleep(1000);
  }
  throw new Error(`Attributes of ${collection} did not become available in time`);
}

async function ensureIndex(collection: string, indexKey: string, type: 'key' | 'unique', attributes: string[]) {
  const existing = (await databases.listIndexes(DB_ID, collection)).indexes.map((i: any) => i.key);
  if (existing.includes(indexKey)) return;
  await databases.createIndex(DB_ID, collection, indexKey, type as any, attributes);
  console.log(`+ index ${collection}.${indexKey}`);
}

async function main() {
  await ensureCollection(EVENTS, 'Promo Events');
  await ensureAttributes(EVENTS, [
    { key: 'title', type: 'string', size: 120, required: true },
    { key: 'token', type: 'string', size: 64, required: true },
    { key: 'startsAt', type: 'datetime' },
    { key: 'endsAt', type: 'datetime' },
    { key: 'active', type: 'boolean', def: true },
  ]);
  await ensureIndex(EVENTS, 'token_unique', 'unique', ['token']);

  await ensureCollection(ITEMS, 'Promo Items');
  await ensureAttributes(ITEMS, [
    { key: 'eventId', type: 'string', size: 36, required: true },
    { key: 'name', type: 'string', size: 255, required: true },
    { key: 'category', type: 'string', size: 50, required: true },
    { key: 'description', type: 'string', size: 1000 },
    { key: 'image', type: 'string', size: 500, required: true },
    { key: 'images', type: 'string', size: 500, array: true },
    { key: 'originalPrice', type: 'integer', required: true },
    { key: 'promoPrice', type: 'integer', required: true },
    { key: 'sortOrder', type: 'integer', def: 0 },
  ]);
  await ensureIndex(ITEMS, 'event_idx', 'key', ['eventId']);

  await ensureCollection(CLAIMS, 'Promo Claims');
  await ensureAttributes(CLAIMS, [
    { key: 'itemId', type: 'string', size: 36, required: true },
    { key: 'eventId', type: 'string', size: 36, required: true },
    { key: 'gen', type: 'integer', required: true },
    { key: 'status', type: 'string', size: 20, required: true },
    { key: 'reservedUntil', type: 'datetime', required: true },
    { key: 'paymentRef', type: 'string', size: 255, required: true },
    { key: 'email', type: 'string', size: 255 },
  ]);
  await ensureIndex(CLAIMS, 'event_idx', 'key', ['eventId']);
  await ensureIndex(CLAIMS, 'item_idx', 'key', ['itemId']);
  await ensureIndex(CLAIMS, 'ref_idx', 'key', ['paymentRef']);

  console.log('\nPromo setup complete.');
}

main().catch((error) => {
  console.error('Promo setup failed:', error);
  process.exit(1);
});
