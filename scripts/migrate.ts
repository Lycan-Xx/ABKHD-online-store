import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

// Define product data inline or load from a JSON file
// The original import from src/data/products no longer exists
const products: any[] = [];

async function migrate() {
  if (products.length === 0) {
    console.log('No products to migrate. Add product data to this script or import from a JSON file.');
    return;
  }

  const client = new Client()
    .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

  const databases = new Databases(client);

  const DB_ID = process.env.PUBLIC_APPWRITE_DATABASE_ID || 'abkhd_db';
  const COLLECTION_ID = process.env.PUBLIC_APPWRITE_COLLECTION_PRODUCTS || 'products';

  console.log(`--- Starting Migration: ${products.length} products ---`);

  for (const product of products) {
    try {
      const { id, ...data } = product;
      const documentId = id.toString();

      data.price = Math.round(data.price);
      if (data.originalPrice) data.originalPrice = Math.round(data.originalPrice);

      try {
        await databases.createDocument(DB_ID, COLLECTION_ID, documentId, data);
        console.log(`✅ Migrated: ${product.name} (ID: ${documentId})`);
      } catch (e: any) {
        if (e.code === 409) {
          console.log(`ℹ️ Skipping: ${product.name} (Already exists)`);
        } else {
          throw e;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to migrate ${product.name}:`, error);
    }
  }

  console.log('--- Migration Complete ---');
}

migrate();
