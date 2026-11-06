/**
 * Check Orders Collection Schema
 * 
 * This script checks what attributes exist in your orders collection
 * Run: npx tsx scripts/check-orders-schema.ts
 * 
 * Make sure APPWRITE_ADMIN_KEY is set in your .env file
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { Client, Databases } from 'node-appwrite';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

async function checkSchema() {
  const adminKey = process.env.APPWRITE_ADMIN_KEY;
  
  if (!adminKey) {
    console.error('❌ APPWRITE_ADMIN_KEY is not set. Please add it to your .env file.');
    process.exit(1);
  }

  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '69ae47f1002d446552b3')
    .setKey(adminKey);

  const databases = new Databases(client);

  try {
    console.log('🔍 Checking Orders Collection Schema...\n');

    const attributes = await databases.listAttributes('abkhd_db', 'orders');

    console.log('📋 Existing Attributes:\n');
    
    attributes.attributes.forEach((attr: any) => {
      const required = attr.required ? '✅ REQUIRED' : '⚪ Optional';
      const type = attr.type;
      const size = attr.size ? ` (size: ${attr.size})` : '';
      
      console.log(`  ${attr.key}`);
      console.log(`    Type: ${type}${size}`);
      console.log(`    ${required}`);
      console.log(`    Default: ${attr.default || 'none'}`);
      console.log();
    });

    console.log('✅ Schema check complete!\n');
    
    // Show what we're trying to send
    console.log('📤 What checkout.astro is trying to send:\n');
    const sendingFields = [
      'customerEmail',
      'customerName', 
      'customerPhone',
      'address',
      'city',
      'state',
      'postalCode',
      'items',
      'totalAmount',
      'status',
      'paymentRef',
      'paymentMethod'
    ];
    
    sendingFields.forEach(field => {
      const exists = attributes.attributes.find((a: any) => a.key === field);
      if (exists) {
        console.log(`  ✅ ${field} - EXISTS`);
      } else {
        console.log(`  ❌ ${field} - MISSING IN APPWRITE`);
      }
    });

  } catch (error) {
    console.error('❌ Failed to check schema:', error);
  }
}

checkSchema();
