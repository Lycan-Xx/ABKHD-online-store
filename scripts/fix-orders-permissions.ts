/**
 * Fix Appwrite Orders Collection Permissions
 * 
 * This script updates the orders collection to allow guest users
 * to create orders during checkout.
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';

async function fixPermissions() {
  console.log('🔧 Fixing Appwrite Orders Collection Permissions...\n');

  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69ae47f1002d446552b3')
    .setKey('standard_2b0bfd9b45717491e84668aeb4f11c9b1545771cb69f5b6f3e4197a2ab945847d27f3768d496fa4fb2fde5d9ecd5941f8bd2e536cfebb3999fc12f5e689f7647face71b8d056deedadd3fd4c52ee00ff014ef4783824746955d0019aaf49b9921b8e0b22eaa1f68c5cdf456920bbead5f20a7359057c30e39678fa2816a22ac3');

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
