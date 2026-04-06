/**
 * Cleanup Orders Schema
 * 
 * This script helps identify which fields can be removed to simplify the schema
 * Run: npx tsx scripts/cleanup-orders-schema.ts
 * 
 * Make sure APPWRITE_ADMIN_KEY is set in your .env file
 */

import { Client, Databases } from 'node-appwrite';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

async function analyzeSchema() {
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

  console.log('🔍 Analyzing Orders Schema...\n');

  const attributes = await databases.listAttributes('abkhd_db', 'orders');

  console.log('📊 Current Schema Analysis:\n');
  console.log('REQUIRED fields:');
  attributes.attributes
    .filter((a: any) => a.required)
    .forEach((a: any) => {
      console.log(`  ✅ ${a.key} (${a.type})`);
    });

  console.log('\nOPTIONAL fields:');
  attributes.attributes
    .filter((a: any) => !a.required)
    .forEach((a: any) => {
      console.log(`  ⚪ ${a.key} (${a.type})`);
    });

  console.log('\n💡 Recommendations:\n');
  console.log('REDUNDANT FIELDS (can be removed):');
  console.log('  ❌ paymentReference - We use paymentRef instead');
  console.log('  ❌ customer (JSON string) - Individual fields are better');
  console.log('     (We already have: customerEmail, customerName, customerPhone, address, city, state, postalCode)');
  
  console.log('\nDUPLICATE FIELDS (keep one):');
  console.log('  ⚠️  total vs totalAmount - Keep totalAmount, remove total');
  
  console.log('\n✅ RECOMMENDED SCHEMA:');
  console.log('Required:');
  console.log('  - customerEmail');
  console.log('  - customerName');
  console.log('  - items (JSON array of products)');
  console.log('  - totalAmount');
  console.log('  - paymentRef');
  
  console.log('\nOptional:');
  console.log('  - customerPhone');
  console.log('  - address');
  console.log('  - city');
  console.log('  - state');
  console.log('  - postalCode');
  console.log('  - status (default: "pending")');
  console.log('  - paymentMethod');

  console.log('\n⚠️  WARNING:');
  console.log('Removing attributes will delete data in those fields!');
  console.log('Make sure to backup your data first.');
  console.log('\nTo remove an attribute, go to Appwrite Console:');
  console.log('Database → abkhd_db → orders → Attributes → Delete');
}

analyzeSchema().catch(console.error);
