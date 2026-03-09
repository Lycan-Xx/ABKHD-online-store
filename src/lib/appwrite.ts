import { Client, Account, Databases, Storage, Teams } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1")
    .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID || "69ae47f1002d446552b3");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const teams = new Teams(client);

// Constants for IDs
export const APPWRITE_DB_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE_ID;
export const APPWRITE_PRODUCTS_COLLECTION_ID = import.meta.env.PUBLIC_APPWRITE_COLLECTION_PRODUCTS;
export const APPWRITE_ORDERS_COLLECTION_ID = import.meta.env.PUBLIC_APPWRITE_COLLECTION_ORDERS;
export const APPWRITE_IMAGES_BUCKET_ID = import.meta.env.PUBLIC_APPWRITE_BUCKET_IMAGES;

// Ping the backend to verify setup
if (typeof window !== "undefined") {
    client.ping().then(() => {
        console.log("Appwrite connection verified");
    }).catch((err) => {
        console.error("Appwrite connection failed:", err);
    });
}

export { client, account, databases, storage, teams };
