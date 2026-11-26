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
const APPWRITE_ORDERS_COLLECTION_ID = process.env.PUBLIC_APPWRITE_COLLECTION_ORDERS || 'orders';

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

    // Add 'requiresAvailabilityCheck' attribute
    try {
      console.log('\nCreating "requiresAvailabilityCheck" attribute...');
      await databases.createBooleanAttribute(
        APPWRITE_DB_ID,
        APPWRITE_PRODUCTS_COLLECTION_ID,
        'requiresAvailabilityCheck',
        false, // required
        false  // default value
      );
      console.log('"requiresAvailabilityCheck" attribute created successfully');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('"requiresAvailabilityCheck" attribute already exists');
      } else {
        console.error('Failed to create "requiresAvailabilityCheck" attribute:', error.message);
      }
    }

    // Add 'priceIsEstimate' attribute
    try {
      console.log('\nCreating "priceIsEstimate" attribute...');
      await databases.createBooleanAttribute(
        APPWRITE_DB_ID,
        APPWRITE_PRODUCTS_COLLECTION_ID,
        'priceIsEstimate',
        false, // required
        false  // default value
      );
      console.log('"priceIsEstimate" attribute created successfully');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('"priceIsEstimate" attribute already exists');
      } else {
        console.error('Failed to create "priceIsEstimate" attribute:', error.message);
      }
    }

    // Add 'autoDeactivated' attribute (products)
    try {
      console.log('\nCreating "autoDeactivated" attribute on products...');
      await databases.createBooleanAttribute(
        APPWRITE_DB_ID,
        APPWRITE_PRODUCTS_COLLECTION_ID,
        'autoDeactivated',
        false, // required
        false  // default value
      );
      console.log('"autoDeactivated" attribute created successfully');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('"autoDeactivated" attribute already exists');
      } else {
        console.error('Failed to create "autoDeactivated" attribute:', error.message);
      }
    }

    // Add 'deliveryEstimate' attribute (products)
    try {
      console.log('\nCreating "deliveryEstimate" attribute on products...');
      await databases.createStringAttribute(
        APPWRITE_DB_ID,
        APPWRITE_PRODUCTS_COLLECTION_ID,
        'deliveryEstimate',
        32,    // size
        false, // required
        ''     // default value
      );
      console.log('"deliveryEstimate" attribute created successfully');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('"deliveryEstimate" attribute already exists');
      } else {
        console.error('Failed to create "deliveryEstimate" attribute:', error.message);
      }
    }

    // Add soft-delete attributes (orders)
    try {
      console.log('\nCreating "isDeleted" attribute on orders...');
      await databases.createBooleanAttribute(
        APPWRITE_DB_ID,
        APPWRITE_ORDERS_COLLECTION_ID,
        'isDeleted',
        false, // required
        false  // default value
      );
      console.log('"isDeleted" attribute created successfully');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('"isDeleted" attribute already exists');
      } else {
        console.error('Failed to create "isDeleted" attribute:', error.message);
      }
    }

    try {
      console.log('\nCreating "deletedAt" attribute on orders...');
      await databases.createStringAttribute(
        APPWRITE_DB_ID,
        APPWRITE_ORDERS_COLLECTION_ID,
        'deletedAt',
        64,    // size
        false, // required
        ''     // default value
      );
      console.log('"deletedAt" attribute created successfully');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('"deletedAt" attribute already exists');
      } else {
        console.error('Failed to create "deletedAt" attribute:', error.message);
      }
    }

    console.log('\n=== Attribute Creation Complete ===');
    console.log('All required attributes have been added to the products and orders collections.');
    console.log('\nNote: It may take a few moments for the attributes to be fully available.');
    console.log('You can verify them in the Appwrite Console under Databases > products > Attributes');

  } catch (error) {
    console.error('Error adding attributes:', error);
  }
}

addMissingAttributes();
