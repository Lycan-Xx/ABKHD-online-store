/**
 * Squad Payment Integration Test Script
 * 
 * This script helps you test your Squad API credentials
 * Run: npx tsx scripts/test-squad.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY;
const SQUAD_PUBLIC_KEY = process.env.PUBLIC_SQUAD_PUBLIC_KEY;

async function testSquadConnection() {
  console.log('🔍 Testing Squad API Connection...\n');

  // Check if keys are set
  if (!SQUAD_SECRET_KEY) {
    console.error('❌ SQUAD_SECRET_KEY not found in environment variables');
    console.log('   Add it to your .env file\n');
    return;
  }

  if (!SQUAD_PUBLIC_KEY) {
    console.error('❌ PUBLIC_SQUAD_PUBLIC_KEY not found in environment variables');
    console.log('   Add it to your .env file\n');
    return;
  }

  console.log('✅ Environment variables found');
  console.log(`   Public Key: ${SQUAD_PUBLIC_KEY.substring(0, 20)}...`);
  console.log(`   Secret Key: ${SQUAD_SECRET_KEY.substring(0, 20)}...\n`);

  // Test API connection by initiating a test transaction
  try {
    console.log('🚀 Testing Squad API endpoint...');
    
    const response = await fetch('https://sandbox-api-d.squadco.com/transaction/initiate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SQUAD_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@abkhd.com',
        amount: 100000, // NGN 1,000 in kobo
        currency: 'NGN',
        initiate_type: 'inline',
        transaction_ref: `TEST-${Date.now()}`
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ Squad API connection successful!');
      console.log('   Status:', data.message);
      console.log('   Checkout URL:', data.data?.checkout_url || 'N/A');
      console.log('\n🎉 Your Squad integration is ready to use!\n');
    } else {
      console.error('❌ Squad API returned an error:');
      console.error('   Status:', response.status);
      console.error('   Message:', data.message || 'Unknown error');
      console.log('\n💡 Tips:');
      console.log('   - Verify your secret key is correct');
      console.log('   - Check if you\'re using sandbox keys for testing');
      console.log('   - Visit https://dashboard.squadco.com to verify your account\n');
    }
  } catch (error) {
    console.error('❌ Failed to connect to Squad API:');
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('\n💡 Tips:');
    console.log('   - Check your internet connection');
    console.log('   - Verify the API endpoint is correct');
    console.log('   - Try again in a few moments\n');
  }
}

// Run the test
testSquadConnection();
