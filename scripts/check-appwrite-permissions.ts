/**
 * Check Appwrite Orders Collection Permissions
 * 
 * This script verifies that the orders collection has proper permissions
 * for guest users to create orders.
 * 
 * Make sure APPWRITE_ADMIN_KEY is set in your .env file
 */

import { Client, Databases } from 'node-appwrite';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

async function checkPermissions() {
  const adminKey = process.env.APPWRITE_ADMIN_KEY;
  
  if (!adminKey) {
    console.error('❌ APPWRITE_ADMIN_KEY is not set. Please add it to your .env file.');
    process.exit(1);
  }

  console.log('🔍 Checking Appwrite Orders Collection Permissions...\n');

  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '69ae47f1002d446552b3')
    .setKey(adminKey);

  const databases = new Databases(client);

  const DB_ID = 'abkhd_db';
  const ORDERS_ID = 'orders';

  try {
    // Get collection details
    const collection = await databases.getCollection(DB_ID, ORDERS_ID);
    
    console.log('✅ Orders collection found');
    console.log('   Name:', collection.name);
    console.log('   ID:', collection.$id);
    console.log('   Total Documents:', (collection as any).total);
    console.log('\n📋 Current Permissions:');
    
    if (collection.$permissions && collection.$permissions.length > 0) {
      collection.$permissions.forEach((perm, index) => {
        console.log(`   ${index + 1}. ${perm}`);
      });
    } else {
      console.log('   ⚠️  No permissions set!');
    }

    // Check if guest create permission exists
    const hasGuestCreate = collection.$permissions?.some(p => 
      p.includes('create') && (p.includes('any()') || p.includes('guests'))
    );

    console.log('\n🔐 Permission Analysis:');
    console.log('   Guest Create:', hasGuestCreate ? '✅ Enabled' : '❌ Missing');

    if (!hasGuestCreate) {
      console.log('\n⚠️  WARNING: Orders collection does not allow guest users to create orders!');
      console.log('   This will cause order creation to fail during checkout.\n');
      console.log('💡 To fix this, run:');
      console.log('   npx tsx scripts/fix-orders-permissions.ts\n');
    } else {
      console.log('\n✅ Permissions look good! Orders can be created by guests.\n');
    }

    // List attributes
    console.log('📝 Collection Attributes:');
    const attributes = await databases.listAttributes(DB_ID, ORDERS_ID);
    attributes.attributes.forEach(attr => {
      console.log(`   - ${attr.key} (${attr.type})${attr.required ? ' *required' : ''}`);
    });

  } catch (error) {
    console.error('❌ Error checking permissions:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
  }
}

checkPermissions();
