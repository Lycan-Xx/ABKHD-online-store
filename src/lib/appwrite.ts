import { Client, Account, Databases } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("69ae47f1002d446552b3");

const account = new Account(client);
const databases = new Databases(client);

// Ping the backend to verify setup
if (typeof window !== "undefined") {
    client.ping().then(() => {
        console.log("Appwrite connection verified");
    }).catch((err) => {
        console.error("Appwrite connection failed:", err);
    });
}

export { client, account, databases };
