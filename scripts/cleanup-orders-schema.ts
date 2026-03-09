/**
 * Cleanup Orders Schema
 * 
 * This script helps identify which fields can be removed to simplify the schema
 * Run: npx tsx scripts/cleanup-orders-schema.ts
 */

import { Client, Databases } from 'node-appwrite';

async function analyzeSchema() {
  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69ae47f1002d446552b3')
    .setKey('standard_2b0bfd9b45717491e84668aeb4f11c9b1545771cb69f5b6f3e4197a2ab945847d27f3768d496fa4fb2fde5d9ecd5941f8bd2e536cfebb3999fc12f5e689f7647face71b8d056deedadd3fd4c52ee00ff014ef4783824746955d0019aaf49b9921b8e0b22eaa1f68c5cdf456920bbead5f20a7359057c30e39678fa2816a22ac3');

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
