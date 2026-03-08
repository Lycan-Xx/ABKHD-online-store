/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_WHATSAPP_PHONE_NUMBER: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_FLUTTERWAVE_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}