/**
 * Complete Setup Verification Script
 * 
 * This script verifies your entire ABKHD Store setup
 * Run: npx tsx scripts/verify-setup.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: CheckResult[] = [];

function check(name: string, condition: boolean, passMsg: string, failMsg: string) {
  results.push({
    name,
    status: condition ? 'pass' : 'fail',
    message: condition ? passMsg : failMsg
  });
}

function warn(name: string, message: string) {
  results.push({
    name,
    status: 'warning',
    message
  });
}

async function verifySetup() {
  console.log('🔍 Verifying ABKHD Store Setup...\n');

  // Check Environment Variables
  console.log('📋 Checking Environment Variables...');
  
  const requiredEnvVars = [
    'PUBLIC_APPWRITE_ENDPOINT',
    'PUBLIC_APPWRITE_PROJECT_ID',
    'PUBLIC_APPWRITE_DATABASE_ID',
    'PUBLIC_APPWRITE_COLLECTION_PRODUCTS',
    'PUBLIC_APPWRITE_COLLECTION_ORDERS',
    'PUBLIC_APPWRITE_BUCKET_IMAGES',
    'PUBLIC_SQUAD_PUBLIC_KEY',
    'PUBLIC_SQUAD_SECRET_KEY'  // Primary for Cloudflare Pages
  ];
  
  // Also check for SQUAD_SECRET_KEY for backward compatibility
  const optionalEnvVars = ['SQUAD_SECRET_KEY'];

  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    check(
      varName,
      !!value && value.length > 0,
      `✓ ${varName} is set`,
      `✗ ${varName} is missing or empty`
    );
  });

  // Check Squad Keys Format
  const squadPublicKey = process.env.PUBLIC_SQUAD_PUBLIC_KEY;
  const squadSecretKey = process.env.PUBLIC_SQUAD_SECRET_KEY || process.env.SQUAD_SECRET_KEY;

  if (squadPublicKey) {
    const isSandbox = squadPublicKey.startsWith('sandbox_pk_');
    const isLive = squadPublicKey.startsWith('live_pk_');
    
    if (isSandbox) {
      warn('Squad Public Key', '⚠ Using SANDBOX key (for testing only)');
    } else if (isLive) {
      check('Squad Public Key', true, '✓ Using LIVE key (production ready)', '');
    } else {
      check('Squad Public Key', false, '', '✗ Invalid key format (should start with sandbox_pk_ or live_pk_)');
    }
  }

  if (squadSecretKey) {
    const isSandbox = squadSecretKey.startsWith('sandbox_sk_');
    const isLive = squadSecretKey.startsWith('live_sk_');
    
    if (isSandbox) {
      warn('Squad Secret Key', '⚠ Using SANDBOX key (for testing only)');
    } else if (isLive) {
      check('Squad Secret Key', true, '✓ Using LIVE key (production ready)', '');
    } else {
      check('Squad Secret Key', false, '', '✗ Invalid key format (should start with sandbox_sk_ or live_sk_)');
    }
  }

  // Test Squad API Connection
  console.log('\n🌐 Testing Squad API Connection...');
  
  if (squadSecretKey) {
    try {
      const apiUrl = squadSecretKey.startsWith('sandbox_') 
        ? 'https://sandbox-api-d.squadco.com/transaction/initiate'
        : 'https://api-d.squadco.com/transaction/initiate';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${squadSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@abkhd.com',
          amount: 100000,
          currency: 'NGN',
          initiate_type: 'inline',
          transaction_ref: `VERIFY-${Date.now()}`
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        check('Squad API', true, '✓ Squad API connection successful', '');
      } else {
        check('Squad API', false, '', `✗ Squad API error: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      check('Squad API', false, '', `✗ Failed to connect to Squad API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Test Appwrite Connection
  console.log('\n🗄️  Testing Appwrite Connection...');
  
  const appwriteEndpoint = process.env.PUBLIC_APPWRITE_ENDPOINT;
  const appwriteProjectId = process.env.PUBLIC_APPWRITE_PROJECT_ID;

  if (appwriteEndpoint && appwriteProjectId) {
    try {
      const response = await fetch(`${appwriteEndpoint}/health`, {
        method: 'GET',
        headers: {
          'X-Appwrite-Project': appwriteProjectId
        }
      });

      if (response.ok) {
        check('Appwrite Health', true, '✓ Appwrite server is reachable', '');
      } else {
        check('Appwrite Health', false, '', `✗ Appwrite returned status ${response.status}`);
      }
    } catch (error) {
      check('Appwrite Health', false, '', `✗ Failed to connect to Appwrite: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Check File Structure
  console.log('\n📁 Checking File Structure...');
  
  const fs = await import('fs');
  const requiredFiles = [
    'src/pages/checkout.astro',
    'src/pages/api/squad-webhook.ts',
    'src/pages/api/verify-payment.ts',
    'src/pages/test-squad.astro',
    'src/lib/appwrite.ts',
    'scripts/test-squad.ts',
    'SQUAD_INTEGRATION.md',
    'DEPLOYMENT_GUIDE.md'
  ];

  requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    check(
      file,
      exists,
      `✓ ${file} exists`,
      `✗ ${file} is missing`
    );
  });

  // Print Results
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION RESULTS');
  console.log('='.repeat(60) + '\n');

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warning').length;

  results.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
    console.log(`${icon} ${result.message}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${results.length} checks`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log('='.repeat(60) + '\n');

  if (failed === 0) {
    console.log('🎉 All critical checks passed!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Run: yarn dev');
    console.log('   2. Visit: http://localhost:4321/test-squad');
    console.log('   3. Test the checkout flow');
    console.log('   4. Review DEPLOYMENT_GUIDE.md for production deployment\n');
  } else {
    console.log('⚠️  Some checks failed. Please fix the issues above before proceeding.\n');
    console.log('💡 Tips:');
    console.log('   - Check your .env file for missing variables');
    console.log('   - Verify your Squad API keys are correct');
    console.log('   - Ensure Appwrite credentials are valid');
    console.log('   - Run: npx tsx scripts/test-squad.ts to test Squad connection\n');
  }

  if (warnings > 0) {
    console.log('ℹ️  Warnings detected:');
    results
      .filter(r => r.status === 'warning')
      .forEach(r => console.log(`   - ${r.message}`));
    console.log();
  }
}

// Run verification
verifySetup().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
