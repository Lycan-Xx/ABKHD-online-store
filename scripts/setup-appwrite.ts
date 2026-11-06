import { Client, Databases, Permission, Role, ID, Storage } from 'node-appwrite';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

/**
 * ABKHD Appwrite Setup Script
 * 
 * This script automates the creation of:
 * 1. Database (abkhd_db)
 * 2. Collections (products, orders)
 * 3. Attributes for each collection
 * 4. Permissions (Public Read for Products, Guest Create for Orders)
 * 
 * Make sure APPWRITE_ADMIN_KEY is set in your .env file
 */

async function setup() {
  const adminKey = process.env.APPWRITE_ADMIN_KEY;
  
  if (!adminKey) {
    console.error('❌ APPWRITE_ADMIN_KEY is not set. Please add it to your .env file.');
    console.log('Example: APPWRITE_ADMIN_KEY=your_admin_api_key_here');
    process.exit(1);
  }

  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '69ae47f1002d446552b3')
    .setKey(adminKey);

  const databases = new Databases(client);
  const storage = new Storage(client);

  const DB_ID = 'abkhd_db';
  const DB_NAME = 'ABKHD Database';
  const IMAGES_BUCKET_ID = 'product-images';

  try {
    console.log('--- Starting Appwrite Setup ---');

    // 1. Ensure Database exists
    try {
      await databases.get(DB_ID);
      console.log(`ℹ️ Database "${DB_NAME}" already exists.`);
    } catch (e: any) {
      if (e.code === 404) {
        await databases.create(DB_ID, DB_NAME);
        console.log(`✅ Database "${DB_NAME}" created.`);
      } else {
        throw e;
      }
    }

    // 2. Ensure Products Collection exists
    const PRODUCTS_ID = 'products';
    try {
      await databases.getCollection(DB_ID, PRODUCTS_ID);
      console.log('ℹ️ Products collection already exists.');
    } catch (e: any) {
      if (e.code === 404) {
        await databases.createCollection(DB_ID, PRODUCTS_ID, 'Products', [
          Permission.read(Role.any()),
          Permission.write(Role.team('admin')),
        ]);
        console.log('✅ Products collection created.');
      } else {
        throw e;
      }
    }

    // Define Attributes for Products (Check if they exist first)
    const productAttributes = await databases.listAttributes(DB_ID, PRODUCTS_ID);
    const existingProductAttrs = new Set(productAttributes.attributes.map(a => a.key));

    const createProductAttr = async (key: string, type: 'string' | 'integer' | 'boolean', size?: number, required: boolean = false, defaultValue?: any, array: boolean = false) => {
      if (existingProductAttrs.has(key)) return;
      
      if (type === 'string') {
        await databases.createStringAttribute(DB_ID, PRODUCTS_ID, key, size || 255, required, defaultValue, array);
      } else if (type === 'integer') {
        await databases.createIntegerAttribute(DB_ID, PRODUCTS_ID, key, required, undefined, undefined, defaultValue, array);
      } else if (type === 'boolean') {
        await databases.createBooleanAttribute(DB_ID, PRODUCTS_ID, key, required, defaultValue, array);
      }
      console.log(`✅ Product attribute "${key}" created.`);
    };

    await createProductAttr('name', 'string', 255, true);
    await createProductAttr('price', 'integer', undefined, true);
    await createProductAttr('originalPrice', 'integer', undefined, false);
    await createProductAttr('category', 'string', 50, true);
    await createProductAttr('description', 'string', 500, true);
    await createProductAttr('longDescription', 'string', 5000, false);
    await createProductAttr('image', 'string', 500, true);
    await createProductAttr('images', 'string', 500, false, undefined, true);
    await createProductAttr('stock', 'integer', undefined, true);
    await createProductAttr('featured', 'boolean', undefined, false, false);
    await createProductAttr('tags', 'string', 50, false, undefined, true);
    await createProductAttr('isActive', 'boolean', undefined, false, true);
    await createProductAttr('isArchived', 'boolean', undefined, false, false);
    await createProductAttr('brand', 'string', 100, false);
    await createProductAttr('video', 'string', 500, false);
    await createProductAttr('videoThumbnail', 'string', 500, false);

    // 3. Ensure Orders Collection exists
    const ORDERS_ID = 'orders';
    try {
      await databases.getCollection(DB_ID, ORDERS_ID);
      console.log('ℹ️ Orders collection already exists.');
    } catch (e: any) {
      if (e.code === 404) {
        await databases.createCollection(DB_ID, ORDERS_ID, 'Orders', [
          Permission.create(Role.any()),
          Permission.read(Role.team('admin')),
          Permission.write(Role.team('admin')),
        ]);
        console.log('✅ Orders collection created.');
      } else {
        throw e;
      }
    }

    // Define Attributes for Orders
    const orderAttributes = await databases.listAttributes(DB_ID, ORDERS_ID);
    const existingOrderAttrs = new Set(orderAttributes.attributes.map(a => a.key));

    const createOrderAttr = async (key: string, type: 'string' | 'integer', size?: number, required: boolean = false, defaultValue?: any) => {
      if (existingOrderAttrs.has(key)) return;
      
      if (type === 'string') {
        await databases.createStringAttribute(DB_ID, ORDERS_ID, key, size || 255, required, defaultValue);
      } else if (type === 'integer') {
        await databases.createIntegerAttribute(DB_ID, ORDERS_ID, key, required, undefined, defaultValue);
      }
      console.log(`✅ Order attribute "${key}" created.`);
    };

    await createOrderAttr('customerEmail', 'string', 255, true);
    await createOrderAttr('customerName', 'string', 255, true);
    await createOrderAttr('customerPhone', 'string', 50, false);
    await createOrderAttr('address', 'string', 500, false);
    await createOrderAttr('city', 'string', 100, false);
    await createOrderAttr('state', 'string', 100, false);
    await createOrderAttr('postalCode', 'string', 20, false);
    await createOrderAttr('items', 'string', 5000, true);
    await createOrderAttr('totalAmount', 'integer', undefined, true);
    await createOrderAttr('status', 'string', 20, false, 'pending');
    await createOrderAttr('paymentReference', 'string', 255, false);
    await createOrderAttr('paymentMethod', 'string', 20, false);

    // 4. Ensure Storage Bucket exists
    try {
      await storage.getBucket(IMAGES_BUCKET_ID);
      console.log('ℹ️ Storage bucket already exists.');
    } catch (e: any) {
      if (e.code === 404) {
        await storage.createBucket(IMAGES_BUCKET_ID, 'Product Images', [
          Permission.read(Role.any()),
          Permission.write(Role.team('admin')),
        ], false, true, undefined, ['jpg', 'png', 'webp', 'jpeg', 'mp4', 'webm', 'ogv', 'mov']);
        console.log('✅ Product Images (and Video) bucket created.');
      } else {
        throw e;
      }
    }

    console.log('\n--- Setup Complete ---');
    console.log('Please save these IDs in your .env:');
    console.log(`PUBLIC_APPWRITE_DATABASE_ID=${DB_ID}`);
    console.log(`PUBLIC_APPWRITE_COLLECTION_PRODUCTS=${PRODUCTS_ID}`);
    console.log(`PUBLIC_APPWRITE_COLLECTION_ORDERS=${ORDERS_ID}`);
    console.log(`PUBLIC_APPWRITE_BUCKET_IMAGES=${IMAGES_BUCKET_ID}`);

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setup();
