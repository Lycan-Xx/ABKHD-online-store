import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '69ae47f1002d446552b3')
  .setKey(process.env.APPWRITE_API_KEY || ''); // You'll need an API key

const databases = new Databases(client);

const APPWRITE_DB_ID = process.env.PUBLIC_APPWRITE_DATABASE_ID!;
const APPWRITE_PRODUCTS_COLLECTION_ID = process.env.PUBLIC_APPWRITE_COLLECTION_PRODUCTS!;

/**
 * This script documents the required schema updates for the products collection.
 * 
 * You need to manually add these attributes in the Appwrite Console:
 * 
 * 1. verified (Boolean)
 *    - Type: Boolean
 *    - Required: No
 *    - Default: false
 *    - Description: Shows verified badge on product
 * 
 * 2. isUnique (Boolean)
 *    - Type: Boolean
 *    - Required: No
 *    - Default: false
 *    - Description: Marks item as unique (auto-deactivates on purchase)
 * 
 * Steps to add in Appwrite Console:
 * 1. Go to your Appwrite Console
 * 2. Navigate to Databases > Your Database > products collection
 * 3. Click "Attributes" tab
 * 4. Click "Create Attribute"
 * 5. Select "Boolean" type
 * 6. Add each attribute with the settings above
 * 
 * Note: The 'stock' attribute should already exist from previous setup.
 * If not, add it as:
 *    - Type: Integer
 *    - Required: No
 *    - Default: 0
 *    - Min: 0
 */

async function checkSchema() {
  try {
    console.log('Checking products collection schema...');
    
    const collection = await databases.getCollection(
      APPWRITE_DB_ID,
      APPWRITE_PRODUCTS_COLLECTION_ID
    );
    
    console.log('\nCurrent attributes:');
    collection.attributes.forEach((attr: any) => {
      console.log(`- ${attr.key} (${attr.type})`);
    });
    
    const requiredAttributes = ['verified', 'isUnique', 'stock'];
    const existingKeys = collection.attributes.map((attr: any) => attr.key);
    
    console.log('\n=== Schema Check ===');
    requiredAttributes.forEach(attr => {
      if (existingKeys.includes(attr)) {
        console.log(`✓ ${attr} - EXISTS`);
      } else {
        console.log(`✗ ${attr} - MISSING (needs to be added manually)`);
      }
    });
    
    console.log('\n=== Instructions ===');
    console.log('If any attributes are missing, add them manually in Appwrite Console:');
    console.log('1. Go to Databases > Your Database > products collection');
    console.log('2. Click "Attributes" tab');
    console.log('3. Add missing attributes as documented in this script');
    
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkSchema();
