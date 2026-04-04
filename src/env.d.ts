/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APPWRITE_ENDPOINT: string;
  readonly PUBLIC_APPWRITE_PROJECT_ID: string;
  readonly PUBLIC_APPWRITE_DATABASE_ID: string;
  readonly PUBLIC_APPWRITE_COLLECTION_PRODUCTS: string;
  readonly PUBLIC_APPWRITE_COLLECTION_ORDERS: string;
  readonly PUBLIC_APPWRITE_BUCKET_IMAGES: string;
  readonly PUBLIC_SQUAD_PUBLIC_KEY: string;
  readonly SQUAD_SECRET_KEY: string;
  readonly VITE_WHATSAPP_NUMBER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
