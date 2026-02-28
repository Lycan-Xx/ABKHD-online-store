# Technical Implementation Plan: Appwrite + Flutterwave for Your E-Commerce Store

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Product   │  │    Cart     │  │   OG Meta Tags      │ │
│  │   Pages     │  │   Context   │  │   (react-helmet)    │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                     │            │
│         └────────────────┼─────────────────────┘            │
│                          ▼                                  │
│              ┌───────────────────────┐                      │
│              │   Appwrite REST API   │                      │
│              │   (src/lib/appwrite.ts)│                     │
│              └───────────┬───────────┘                      │
└──────────────────────────┼──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  Database     │  │   Storage    │  │    Auth       │
│  Collections  │  │  (Images)    │  │  (Users)      │
└───────────────┘  └───────────────┘  └───────────────┘

        │                                          │
        ▼                                          ▼
┌─────────────────────────────┐    ┌─────────────────────────────┐
│   FLUTTERWAVE SERVER       │    │    APPWRITE CLOUD          │
│   (Node.js/Express)        │    │    (or Self-hosted)        │
│   - Payment initiation     │    │    - Database              │
│   - Webhook handling      │    │    - Storage               │
│   - Verify payments       │    │    - Auth                  │
└─────────────────────────────┘    └─────────────────────────────┘
```

---

## 1. Appwrite Database Schema

### Collections

```javascript
// products collection
{
  id: "unique",
  name: "Vintage Band T-Shirt",
  description: "Limited edition...",
  price: 5000, // in kobo (Flutterwave format)
  images: ["file-id-1", "file-id-2"], // Appwrite file IDs
  category_id: "category-document-id",
  stock: 1, // Important: 1 = unique item
  is_unique: true, // boolean flag
  sizes: [], // empty for unique items
  colors: [], // empty for unique items
  created_at: "2024-01-15T10:00:00Z"
}

// categories collection
{
  id: "unique",
  name: "T-Shirts",
  slug: "t-shirts",
  image: "file-id" // for category OG tags
}

// orders collection
{
  id: "unique",
  user_id: "appwrite-user-id",
  items: [{ product_id, quantity, price }],
  total: 5000,
  status: "pending|paid|completed",
  flutterwave_ref: "FLW-xxxxx",
  delivery_method: "pickup|delivery",
  delivery_address: "Hostel Room 204",
  customer_phone: "+2348123456789",
  created_at: "2024-01-15T10:00:00Z"
}

// users (built-in Appwrite auth)
// Appwrite handles this
```

---

## 2. Unique Products Accommodation

```javascript
// In your product display component
const ProductCard = ({ product }) => {
  // If stock is 1 and is_unique is true, show "One of a Kind"
  const isUnique = product.is_unique && product.stock === 1;
  
  return (
    <div className="product-card">
      <img src={previewUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>₦{product.price.toLocaleString()}</p>
      
      {isUnique && (
        <span className="badge-unique">✨ One of a Kind</span>
      )}
      
      {product.stock === 0 && (
        <span className="badge-sold-out">Sold Out</span>
      )}
    </div>
  );
};

// In admin panel - unique item input
const ProductEditor = () => {
  const [isUnique, setIsUnique] = useState(false);
  
  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={isUnique}
          onChange={(e) => setIsUnique(e.target.checked)}
        />
        This is a unique/one-of-a-kind item
      </label>
      
      {isUnique && (
        <p className="text-sm text-gray-500">
          Stock will automatically be set to 1
        </p>
      )}
    </div>
  );
};
```

---

## 3. Flutterwave Integration

### Server-Side (Node.js/Express)

```javascript
// server/index.js
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const FLUTTERWAVE_SECRET = process.env.FLUTTERWAVE_SECRET_KEY;

// 1. Initialize Payment
app.post('/api/payment/initiate', async (req, res) => {
  const { amount, email, phone, orderId, items } = req.body;
  
  const txRef = `JALO-${Date.now()}-${orderId}`;
  
  const payload = {
    tx_ref: txRef,
    amount: amount, // in Naira (multiply kobo by 100)
    currency: 'NGN',
    redirect_url: 'https://your-site.com/success',
    customer: {
      email,
      phone_number: phone,
    },
    customizations: {
      title: 'Jalo Links Campus Market',
      logo: 'https://your-site.com/logo.png',
    },
    meta: {
      order_id: orderId,
      items: JSON.stringify(items),
    }
  };

  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      payload,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET}`
        }
      }
    );
    
    res.json({ 
      link: response.data.data.link,
      tx_ref: txRef 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Verify Payment (Webhook)
app.post('/api/payment/verify', async (req, res) => {
  const { transaction_id, tx_ref } = req.body;
  
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET}`
        }
      }
    );
    
    const { status, amount, meta } = response.data.data;
    
    if (status === 'successful') {
      // Update order in Appwrite
      await updateOrderInAppwrite(tx_ref, 'paid', transaction_id);
      
      // Decrement stock for each item
      for (const item of JSON.parse(meta.items)) {
        await decrementStock(item.product_id);
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Frontend Checkout Flow

```javascript
// src/services/flutterwave.js
export const initiatePayment = async (orderData) => {
  const response = await fetch('/api/payment/initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  
  const { link, tx_ref } = await response.json();
  
  // Redirect to Flutterwave
  window.location.href = link;
};

// In CheckoutPage.jsx - handle success return
useEffect(() => {
  const query = new URLSearchParams(window.location.search);
  const tx_ref = query.get('tx_ref');
  const status = query.get('status');
  
  if (status === 'successful' && tx_ref) {
    // Verify with your server
    verifyPayment(tx_ref);
  }
}, []);
```

---

## 4. OG Meta Tags for Social Sharing

### Using react-helmet-async

```bash
yarn add react-helmet-async
```

### Product Detail Page

```javascript
// src/pages/ProductDetailPage.jsx
import { Helmet } from 'react-helmet-async';

const ProductDetailPage = ({ product }) => {
  // Get first image URL from Appwrite
  const ogImage = product.images?.[0] 
    ? `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID}/files/${product.images[0]}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`
    : 'https://your-site.com/default-og-image.jpg';

  const ogDescription = product.description?.slice(0, 160) + '...';
  const ogPrice = `₦${product.price.toLocaleString()}`;
  
  const canonicalUrl = `https://your-site.com/products/${product.$id}`;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{product.name} | Jalo Links</title>
        <meta name="title" content={`${product.name} | Jalo Links Campus Market`} />
        <meta name="description" content={ogDescription} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:price:amount" content={product.price} />
        <meta property="og:price:currency" content="NGN" />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="NGN" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={product.name} />
        <meta property="twitter:description" content={ogDescription} />
        <meta property="twitter:image" content={ogImage} />
        
        {/* WhatsApp / Messaging Apps */}
        <meta property="og:site_name" content="Jalo Links Campus Market" />
      </Helmet>
      
      {/* Rest of your product page */}
    </>
  );
};
```

### Dynamic Meta Tags for Different Categories

```javascript
// For category pages
const CategoryPage = ({ category, products }) => {
  const ogImage = category.image 
    ? getAppwriteFileUrl(category.image)
    : 'https://your-site.com/default-category.jpg';

  return (
    <Helmet>
      <title>{category.name} | Jalo Links Campus Market</title>
      <meta property="og:title" content={`Shop ${category.name} | Jalo Links`} />
      <meta property="og:description" content={`Explore our collection of ${category.name}. ${products.length} items available.`} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};
```

---

## 5. Environment Variables Needed

```env
# Appwrite (Frontend)
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_BUCKET_ID=your-bucket-id
VITE_APPWRITE_DATABASE_ID=your-database-id

# Flutterwave (Server)
FLUTTERWAVE_SECRET_KEY=FLW_SECRET_KEY
FLUTTERWAVE_PUBLIC_KEY=FLW_PUBLIC_KEY

# Your Server
SERVER_URL=https://your-server.onrender.com  # or localhost for dev
```

---

## 6. Key Differences from Your Current Stack

| Feature | Current (Strapi/Prismic/Amplify) | New (Appwrite/Flutterwave) |
|---------|----------------------------------|----------------------------|
| Database | Strapi | Appwrite |
| CMS | Prismic | Appwrite + Static pages |
| Auth | AWS Cognito | Appwrite Auth |
| Storage | AWS S3 | Appwrite Storage |
| Payments | OPay | Flutterwave |
| Deployment | Vercel + AWS | Vercel + (Render/Railway for server) |

---

## 7. Migration Checklist

- [ ] Set up Appwrite Cloud account
- [ ] Create database and collections
- [ ] Configure storage bucket for product images
- [ ] Set up authentication methods
- [ ] Create Node.js server for Flutterwave
- [ ] Migrate products from Strapi to Appwrite
- [ ] Migrate categories from Strapi to Appwrite
- [ ] Update frontend to use Appwrite REST API
- [ ] Implement Flutterwave checkout flow
- [ ] Add OG meta tags to product pages
- [ ] Test payment flow end-to-end
- [ ] Deploy payment server to production
