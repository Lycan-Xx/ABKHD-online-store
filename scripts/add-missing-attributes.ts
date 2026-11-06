import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '69ae47f1002d446552b3')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

const APPWRITE_DB_ID = process.env.PUBLIC_APPWRITE_DATABASE_ID!;
const APPWRITE_PRODUCTS_COLLECTION_ID = process.env.PUBLIC_APPWRITE_COLLECTION_PRODUCTS!;

async function addMissingAttributes() {
  try {
    console.log('Adding missing attributes to products collection...\n');

    // Add 'verified' attribute
    try {
      console.log('Creating "verified" attribute...');
      await databases.createBooleanAttribute(
        APPWRITE_DB_ID,
        APPWRITE_PRODUCTS_COLLECTION_ID,
        'verified',
        false, // required
        false  // default value
      );
      console.log('✓ "verified" attribute created successfully');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('✓ "verified" attribute already exists');
      } else {
        console.error('✗ Failed to create "verified" attribute:', error.message);
      }
    }

    // Add 'isUnique' attribute
    try {
      console.log('\nCreating "isUnique" attribute...');
      await databases.createBooleanAttribute(
        APPWRITE_DB_ID,
        APPWRITE_PRODUCTS_COLLECTION_ID,
        'isUnique',
        false, // required
        false  // default value
      );
      console.log('✓ "isUnique" attribute created successfully');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('✓ "isUnique" attribute already exists');
      } else {
        console.error('✗ Failed to create "isUnique" attribute:', error.message);
      }
    }

    console.log('\n=== Attribute Creation Complete ===');
    console.log('All required attributes have been added to the products collection.');
    console.log('\nNote: It may take a few moments for the attributes to be fully available.');
    console.log('You can verify them in the Appwrite Console under Databases > products > Attributes');

  } catch (error) {
    console.error('Error adding attributes:', error);
  }
}

addMissingAttributes();
