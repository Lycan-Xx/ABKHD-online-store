import { Client, Databases } from 'node-appwrite';
import 'dotenv/config';

/**
 * Fix isActive status for all products
 * This ensures all products have isActive field properly set
 * 
 * Usage: npx tsx scripts/fix-product-active-status.ts
 * Make sure APPWRITE_ADMIN_KEY is set in your .env file
 */

async function fixProducts() {
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
    console.log('--- Fixing Product Active Status ---');

    // Fetch all products
    let offset = 0;
    const limit = 100;
    let totalUpdated = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await databases.listDocuments(
        DB_ID,
        PRODUCTS_COLLECTION,
        []
      );

      for (const product of response.documents) {
        // Check if isActive is undefined, null, or not set
        if (product.isActive === undefined || product.isActive === null) {
          console.log(`Updating product "${product.name}" (${product.$id}) - setting isActive to true...`);
          
          try {
            await databases.updateDocument(DB_ID, PRODUCTS_COLLECTION, product.$id, {
              isActive: true
            });
            totalUpdated++;
          } catch (e: any) {
            console.error(`Failed to update ${product.$id}:`, e.message);
          }
        } else {
          console.log(`Product "${product.name}" (${product.$id}) - isActive is already: ${product.isActive}`);
        }
      }

      // Check if there are more products
      if (response.documents.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    console.log(`\n--- Fix Complete ---`);
    console.log(`Total products updated: ${totalUpdated}`);
    console.log('\nNOTE: If you\'re still seeing old products, try:');
    console.log('1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)');
    console.log('2. Clear Cloudflare cache from your Cloudflare dashboard');
    console.log('3. Wait a few minutes for changes to propagate');

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixProducts();
