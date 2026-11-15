/**
 * Add receipt fields to the Appwrite orders collection.
 *
 * Adds:
 *   receiptId           (string, 255, optional)
 *   receiptGeneratedAt  (datetime, optional)
 *
 * Run: npx tsx scripts/add-order-receipt-attributes.ts
 *
 * Make sure APPWRITE_ADMIN_KEY is set in your .env file.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { Client, Databases } from 'node-appwrite';

config({ path: resolve(process.cwd(), '.env') });

const DB_ID = process.env.PUBLIC_APPWRITE_DATABASE_ID || 'abkhd_db';
const ORDERS_ID = process.env.PUBLIC_APPWRITE_COLLECTION_ORDERS || 'orders';

const NEW_ATTRIBUTES = [
  { key: 'receiptId', type: 'string', size: 255 },
  { key: 'receiptGeneratedAt', type: 'datetime' },
] as const;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const adminKey = process.env.APPWRITE_ADMIN_KEY;
  if (!adminKey) {
    console.error('APPWRITE_ADMIN_KEY is not set. Add it to .env and retry.');
    process.exit(1);
  }

  const client = new Client()
    .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '69ae47f1002d446552b3')
    .setKey(adminKey);

  const databases = new Databases(client);

  const existing = await databases.listAttributes(DB_ID, ORDERS_ID);
  const keys = new Set(existing.attributes.map((a: any) => a.key));

  for (const attr of NEW_ATTRIBUTES) {
    if (keys.has(attr.key)) {
      console.log(`= ${attr.key} already exists`);
      continue;
    }
    console.log(`+ creating ${attr.key} (${attr.type})`);
    if (attr.type === 'datetime') {
      await databases.createDatetimeAttribute(DB_ID, ORDERS_ID, attr.key, false);
    } else {
      await databases.createStringAttribute(DB_ID, ORDERS_ID, attr.key, attr.size, false);
    }
  }

  // Appwrite builds attributes asynchronously; wait until they are usable.
  for (let attempt = 0; attempt < 30; attempt++) {
    const attrs = await databases.listAttributes(DB_ID, ORDERS_ID);
    const pending = attrs.attributes.filter(
      (a: any) =>
        NEW_ATTRIBUTES.some((n) => n.key === a.key) && a.status !== 'available'
    );
    if (pending.length === 0) {
      const ready = attrs.attributes
        .filter((a: any) => NEW_ATTRIBUTES.some((n) => n.key === a.key))
        .map((a: any) => `${a.key}:${a.status}`);
      console.log('OK attributes available:', ready.join(', '));
      return;
    }
    console.log(`... waiting for ${pending.length} attribute(s)`);
    await sleep(2000);
  }

  console.warn('Timed out waiting for attributes to become available.');
  process.exit(1);
}

main().catch((error) => {
  console.error('Failed to add receipt attributes:', error);
  process.exit(1);
});
