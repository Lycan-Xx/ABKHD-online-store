import { Client, Databases, Storage, Teams, Account, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID || '');

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const teams = new Teams(client);

// Constants
export const APPWRITE_DB_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE_ID || 'abkhd_db';
export const APPWRITE_PRODUCTS_COLLECTION_ID = import.meta.env.PUBLIC_APPWRITE_COLLECTION_PRODUCTS || 'products';
export const APPWRITE_ORDERS_COLLECTION_ID = import.meta.env.PUBLIC_APPWRITE_COLLECTION_ORDERS || 'orders';
export const APPWRITE_IMAGES_BUCKET_ID = import.meta.env.PUBLIC_APPWRITE_BUCKET_IMAGES || 'product-images';

// Development-only connection check
if (import.meta.env.DEV && typeof window !== 'undefined') {
  client.ping()
    .then(() => console.log('✅ Appwrite connected'))
    .catch((err: unknown) => console.error('❌ Appwrite connection failed:', err));
}

export { client, account, databases, storage, teams, ID };
