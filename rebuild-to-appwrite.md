📱 Project ABKHD: Rebuild Master Plan
Stack: Astro (Frontend) + Appwrite Cloud (Backend/DB/Functions) + Flutterwave (Payments)

🚀 Phase 0: The "Safe" Migration (React/Vite → Astro)
Goal: Move your existing React work into Astro without rewriting logic or breaking the UI.

The Strategy: "Islands Architecture"
Think of Astro as the Container (HTML shell) and your existing React components as Islands inside it.

Static Content (Header, Footer, Hero): Rendered by Astro (Zero JavaScript sent to browser).

Interactive Content (Cart, Product Filters, Admin Forms): Rendered by React (Hydrated on the client).

Step-by-Step Migration Guide
Initialize Astro:
Do not delete your old project yet. Create a new folder next to it.

Bash
npm create astro@latest abkhd-store
cd abkhd-store
npx astro add react tailwindcss
Move Assets:

Copy your src/assets (images, fonts) from the Vite project to src/assets in Astro.

Copy your global CSS (if any) to src/styles.

Migrate Components (The "Lift & Shift"):

Copy your entire components folder from the Vite project to src/components in Astro.

Note: You do not need to change the React code (JSX hooks, state) inside these files. They will work "as is".

Rebuild Pages (The Router):
Astro uses file-based routing (like Next.js).

Create src/pages/index.astro.

Import your React Home component and wrap it.

Code snippet
---
// src/pages/index.astro
import Navbar from '../components/Navbar.jsx';
import HeroSection from '../components/HeroSection.jsx';
import FeaturedGadgets from '../components/FeaturedGadgets.jsx';
import Footer from '../components/Footer.jsx';
---

<html lang="en">
  <head>
    <title>ABKHD Gadgets</title>
  </head>
  <body>
    <Navbar />

    <HeroSection />

    <FeaturedGadgets client:visible />

    <Footer />
  </body>
</html>
Fixing Global State (Context API):
If you used useContext for your Cart:

Create a wrapper component (e.g., AppWrapper.jsx) that contains your Providers.

Wrap the specific islands in Astro that need access to that context.

Pro Tip: For Astro, it is often easier to switch simple state (like a Cart) to Nano Stores (super lightweight, works across framework boundaries), but standard React Context works if you wrap the entire "Page Content" island.

🏃 Phase 1: Foundation & Database (Appwrite Setup)
Goal: Establish the data structure for Gadgets and secure Admin access.

1. Database Schema
Create a Database named abkhd_db and the following Collections:

A. Products (products)

name (String, 128)

brand (String, 64) - Index this for filtering

category (Enum: "laptop", "phone", "accessory")

condition (Enum: "new", "open_box", "used")

price (Integer) - Store in Kobo (e.g., 5000000 for ₦50,000.00)

specs (String) - Store specific details as a stringified JSON object (RAM, Storage, Processor)

images (String Array) - Array of File IDs

is_unique (Boolean) - True for specific used items

stock (Integer)

Permissions: Read: Any, Write: Admin Team.

B. Orders (orders)

customer_name (String)

customer_email (String)

customer_phone (String)

delivery_method (Enum: "pickup", "delivery")

delivery_address (String, nullable)

items (String) - JSON string of cart items

total_amount (Integer)

payment_status (Enum: "pending", "paid", "failed")

payment_ref (String) - Flutterwave Transaction Ref

Permissions: Create: Any, Read/Update: Admin Team.

2. Admin Authentication
Enable Google OAuth in Appwrite Console.

Security Rule: In your Admin Panel code (React), check the user's email after login.

JavaScript
const allowedAdmins = ['ceo@abkhd.com', 'manager@abkhd.com'];
if (!allowedAdmins.includes(user.email)) {
   // Force logout or show "Access Denied"
}
💻 Phase 2: Frontend Implementation (REST API)
Goal: Connect Astro to Appwrite using raw fetch (No SDK headaches).

1. The Helper Function
Create src/lib/api.js to handle your calls securely.

JavaScript
// src/lib/api.js
const PROJECT_ID = import.meta.env.PUBLIC_APPWRITE_PROJECT_ID;
const ENDPOINT = 'https://cloud.appwrite.io/v1';

export const dbFetch = async (path, options = {}) => {
  const headers = {
    'X-Appwrite-Project': PROJECT_ID,
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(`${ENDPOINT}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return await response.json();
};

// Example: Fetch Gadgets
export const getGadgets = async () => {
  return await dbFetch(`/databases/${DB_ID}/collections/products/documents`);
};
2. Product Pages (SEO Optimized)
Use Astro's dynamic routing (src/pages/gadgets/[id].astro).

Server-Side Fetching: Astro fetches the gadget data at build time (or request time) to generate the HTML.

Meta Tags: Inject the data directly into the <head>.

Code snippet
---
// src/pages/gadgets/[id].astro
import { getGadgetById } from '../../lib/api';
const { id } = Astro.params;
const gadget = await getGadgetById(id);

const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${gadget.images[0]}/view?project=${PROJECT_ID}`;
---

<head>
  <title>{gadget.name} | ABKHD</title>
  <meta property="og:title" content={gadget.name} />
  <meta property="og:description" content={`Buy this ${gadget.condition} ${gadget.name} for ₦${gadget.price/100}`} />
  <meta property="og:image" content={imageUrl} />
</head>
💳 Phase 3: The Payment "Backend" (Appwrite Functions)
Goal: Secure server-side logic for Flutterwave without managing a VPS.

1. Setup
In Appwrite Console > Functions > Create Function.

Name: payment-handler.

Runtime: Node.js (latest).

Environment Variables:

FLW_SECRET_KEY: Your Flutterwave Secret Key.

FLW_SECRET_HASH: A random string you create (e.g., "abkhd_secure_hash_123").

2. Function Logic (src/main.js)
This function handles both initialization and webhooks to save resources.

JavaScript
const sdk = require("node-appwrite");
const axios = require("axios");

module.exports = async ({ req, res, log, error }) => {
  const client = new sdk.Client();
  // Initialize Appwrite SDK (Admin Mode)
  client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const db = new sdk.Databases(client);

  // ROUTE 1: INITIATE PAYMENT (Called by your Frontend)
  if (req.path === '/initiate' && req.method === 'POST') {
    const { email, amount, cartItems } = JSON.parse(req.body);
    
    // 1. Create "Pending" Order in DB
    const order = await db.createDocument('DB_ID', 'orders', sdk.ID.unique(), {
        customer_email: email,
        total_amount: amount,
        items: JSON.stringify(cartItems),
        payment_status: 'pending'
    });

    // 2. Call Flutterwave
    const flwResponse = await axios.post('https://api.flutterwave.com/v3/payments', {
        tx_ref: order.$id, // Use Order ID as Ref
        amount: amount,
        currency: "NGN",
        redirect_url: "https://abkhd.com/success",
        customer: { email },
        meta: { consumer_id: order.$id }
    }, { headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` }});

    return res.json({ link: flwResponse.data.data.link });
  }

  // ROUTE 2: WEBHOOK (Called by Flutterwave)
  if (req.path === '/webhook' && req.method === 'POST') {
    // 1. Verify Hash Security
    const signature = req.headers['verif-hash'];
    if (!signature || signature !== process.env.FLW_SECRET_HASH) {
      return res.json({ status: "error", message: "Invalid Signature" }, 401);
    }

    const payload = JSON.parse(req.body);
    
    if (payload.status === "successful") {
      // 2. Update Order to "Paid"
      await db.updateDocument('DB_ID', 'orders', payload.txRef, {
        payment_status: 'paid',
        payment_ref: payload.id.toString()
      });
      
      // 3. Decrease Stock (Optional Logic here)
    }
    return res.json({ status: "success" });
  }

  return res.json({ error: "Invalid Route" }, 404);
};
🛠 Phase 4: Admin Panel & Optimization
Goal: A fast, secure dashboard for managing gadget inventory.

1. Image Compression (Client-Side)
In your Admin "Add Product" form (React component):

JavaScript
import imageCompression from 'browser-image-compression';

async function handleImageUpload(event) {
  const imageFile = event.target.files[0];
  
  const options = {
    maxSizeMB: 0.5, // Compress to ~500KB
    maxWidthOrHeight: 1200, // Resize if huge
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    // Now upload `compressedFile` to Appwrite Storage using REST
    uploadToAppwrite(compressedFile);
  } catch (error) {
    console.log(error);
  }
}
2. Order Management UI
Create a protected route /admin/orders.

Fetch orders sorted by $createdAt (descending).

Add a visual badge for status:

Pending: Yellow (Wait for payment).

Paid: Green (Ready to ship).

Shipped: Blue.

🏁 Summary of Agile Sprints
Sprint 1 (Migration): Initialize Astro, move React components, ensure the site loads locally with static data.

Sprint 2 (Data): Set up Appwrite Cloud, write the API helper, connect the Product Listing page to real data.

Sprint 3 (Admin): Build the Admin "Add Gadget" form with Image Compression and Google OAuth.

Sprint 4 (Checkout): Build the Cart, Guest Checkout Form, and Appwrite Function for Flutterwave.

Sprint 5 (Deploy): Connect to GitHub, Deploy Frontend to Vercel/Netlify, Deploy Functions to Appwrite.