import { Client, Databases } from 'node-appwrite';
import 'dotenv/config';

/**
 * Create indexes for the products collection
 * This is required for efficient querying of isActive, isArchived, category, featured, etc.
 * 
 * Usage: npx tsx scripts/create-product-indexes.ts
 * Make sure APPWRITE_ADMIN_KEY is set in your .env file
 */

async function createIndexes() {
  const adminKey = process.env.APPWRITE_ADMIN_KEY;
  
  if (!adminKey) {
    console.error('❌ APPWRITE_ADMIN_KEY is not set. Please add it to your .env file.');
    console.log('Example: APPWRITE_ADMIN_KEY=your_admin_api_key_here');
    process.exit(1);
  }

  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69ae47f1002d446552b3')
    .setKey(adminKey);

  const databases = new Databases(client);

  const DB_ID = 'abkhd_db';
  const PRODUCTS_COLLECTION = 'products';

  try {
    console.log('--- Creating Product Collection Indexes ---');

    // List existing indexes first
    const existingIndexes = await databases.listIndexes(DB_ID, PRODUCTS_COLLECTION);
    const existingKeys = new Set(existingIndexes.indexes.map(idx => idx.key));
    console.log('Existing indexes:', existingIndexes.indexes.map(idx => idx.key));

    // Indexes to create
    const indexesToCreate = [
      { key: 'isActive', type: 'key' as const, attributes: ['isActive'], orders: ['ASC'] },
      { key: 'isArchived', type: 'key' as const, attributes: ['isArchived'], orders: ['ASC'] },
      { key: 'isActive_isArchived', type: 'key' as const, attributes: ['isActive', 'isArchived'], orders: ['ASC', 'ASC'] },
      { key: 'category', type: 'key' as const, attributes: ['category'], orders: ['ASC'] },
      { key: 'featured', type: 'key' as const, attributes: ['featured'], orders: ['ASC'] },
      { key: 'isActive_isArchived_category', type: 'key' as const, attributes: ['isActive', 'isArchived', 'category'], orders: ['ASC', 'ASC', 'ASC'] },
      { key: 'isActive_isArchived_featured', type: 'key' as const, attributes: ['isActive', 'isArchived', 'featured'], orders: ['ASC', 'ASC', 'ASC'] },
    ];

    for (const idx of indexesToCreate) {
      if (existingKeys.has(idx.key)) {
        console.log(`ℹ️ Index "${idx.key}" already exists, skipping.`);
        continue;
      }

      try {
        await databases.createIndex(
          DB_ID,
          PRODUCTS_COLLECTION,
          idx.key,
          idx.type,
          idx.attributes,
          idx.orders
        );
        console.log(`✅ Index "${idx.key}" created successfully.`);
      } catch (e: any) {
        if (e.code === 409) {
          console.log(`ℹ️ Index "${idx.key}" already exists.`);
        } else {
          console.error(`❌ Failed to create index "${idx.key}":`, e.message);
        }
      }
    }

    console.log('\n--- Index Creation Complete ---');
    console.log('Your product queries should now work correctly.');

  } catch (error) {
    console.error('❌ Index creation failed:', error);
  }
}

createIndexes();
