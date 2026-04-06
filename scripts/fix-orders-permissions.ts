/**
 * Fix Appwrite Orders Collection Permissions
 * 
 * This script updates the orders collection to allow guest users
 * to create orders during checkout.
 * 
 * Make sure APPWRITE_ADMIN_KEY is set in your .env file
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

async function fixPermissions() {
  const adminKey = process.env.APPWRITE_ADMIN_KEY;
  
  if (!adminKey) {
    console.error('❌ APPWRITE_ADMIN_KEY is not set. Please add it to your .env file.');
    process.exit(1);
  }

  console.log('🔧 Fixing Appwrite Orders Collection Permissions...\n');

  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '69ae47f1002d446552b3')
    .setKey(adminKey);

  const databases = new Databases(client);

  const DB_ID = 'abkhd_db';
  const ORDERS_ID = 'orders';

  try {
    console.log('📋 Current permissions:');
    const collection = await databases.getCollection(DB_ID, ORDERS_ID);
    collection.$permissions?.forEach((perm, index) => {
      console.log(`   ${index + 1}. ${perm}`);
    });

    console.log('\n🔄 Updating permissions...');
    
    // Update collection with proper permissions
    await databases.updateCollection(
      DB_ID,
      ORDERS_ID,
      collection.name,
      [
        Permission.create(Role.any()),      // Allow anyone to create orders
        Permission.read(Role.team('admin')), // Only admins can read
        Permission.update(Role.team('admin')), // Only admins can update
        Permission.delete(Role.team('admin'))  // Only admins can delete
      ]
    );

    console.log('✅ Permissions updated successfully!\n');
    
    console.log('📋 New permissions:');
    const updatedCollection = await databases.getCollection(DB_ID, ORDERS_ID);
    updatedCollection.$permissions?.forEach((perm, index) => {
      console.log(`   ${index + 1}. ${perm}`);
    });

    console.log('\n✅ Orders collection is now configured to accept guest orders!');
    console.log('   Customers can now create orders during checkout.\n');

  } catch (error) {
    console.error('❌ Error fixing permissions:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
  }
}

fixPermissions();
