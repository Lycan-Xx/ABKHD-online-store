import { Client, Databases, ID } from 'node-appwrite';
import { products } from '../src/data/products';
import * as dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  const client = new Client()
    .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || 'standard_2b0bfd9b45717491e84668aeb4f11c9b1545771cb69f5b6f3e4197a2ab945847d27f3768d496fa4fb2fde5d9ecd5941f8bd2e536cfebb3999fc12f5e689f7647face71b8d056deedadd3fd4c52ee00ff014ef4783824746955d0019aaf49b9921b8e0b22eaa1f68c5cdf456920bbead5f20a7359057c30e39678fa2816a22ac3');

  const databases = new Databases(client);

  const DB_ID = process.env.PUBLIC_APPWRITE_DATABASE_ID || 'abkhd_db';
  const COLLECTION_ID = process.env.PUBLIC_APPWRITE_COLLECTION_PRODUCTS || 'products';

  console.log(`--- Starting Migration: ${products.length} products ---`);

  for (const product of products) {
    try {
      // Prepare data (convert number ID to string for Appwrite Document ID)
      const { id, ...data } = product;
      const documentId = id.toString();

      // Ensure price is an integer
      data.price = Math.round(data.price);
      if (data.originalPrice) data.originalPrice = Math.round(data.originalPrice);

      try {
        await databases.createDocument(DB_ID, COLLECTION_ID, documentId, data);
        console.log(`✅ Migrated: ${product.name} (ID: ${documentId})`);
      } catch (e: any) {
        if (e.code === 409) {
          console.log(`ℹ️ Skipping: ${product.name} (Already exists)`);
          // Optional: Update existing document
          // await databases.updateDocument(DB_ID, COLLECTION_ID, documentId, data);
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
