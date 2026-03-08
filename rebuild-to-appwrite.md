# 📱 Project ABKHD: Complete Rebuild Master Plan

**Stack: React/Vite (Current) → Astro (Migration) + Appwrite Cloud (Backend/DB/Functions) + Flutterwave (Payments)**

---

## 📊 Current Codebase Analysis

### 1. Data Model

#### Categories (3 Total)
```javascript
// src/data/products.js
export const categories = [
  { id: "computers", name: "Computers", description: "Laptops, desktops..." },
  { id: "mobile phones", name: "Mobile Phones", description: "Smartphones..." },
  { id: "accessories", name: "Accessories", description: "Cases, chargers..." }
]
```

#### Products Schema
```javascript
{
  id: number,
  name: string,
  price: number,
  originalPrice: number | null,
  category: string, // "computers" | "mobile phones" | "accessories"
  description: string,
  longDescription: string,
  image: string (URL),
  images: string[] (array of URLs),
  stock: number,
  featured: boolean,
  tags: string[]
}
```

---

### 2. Context Architecture

#### ProductContext (`src/contexts/ProductContext.jsx`)
- Loads products from local `src/data/products.js`
- Manages: `products`, `categories`, `loading`, `error`, `dataSource`
- Auto-refreshes every 5 minutes
- Provides `refetchProducts()` function

#### AdminProductContext (`src/contexts/AdminProductContext.jsx`)
- Wraps ProductContext data
- Adds admin-specific fields: `isActive`, `isArchived`, `createdAt`, `updatedAt`
- Methods: `addProduct()`, `updateProduct()`, `deleteProduct()`, `toggleProductActive()`, `getProduct()`, `getStats()`
- Dashboard stats: `totalProducts`, `activeProducts`, `featuredProducts`, `archivedProducts`, `totalCategories`, `productsByCategory`

#### CartContext (`src/contexts/CartContext.jsx`)
- Uses React useReducer for state management
- Persists to localStorage (`cart` key)
- Methods: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`, `getCartTotal()`, `getCartCount()`
- Each item gets unique `cartId`: `${product.id}-${size}-${color}-${timestamp}`

#### OrderContext (`src/contexts/OrderContext.jsx`)
- Stores orders in localStorage (`orders` key)
- Auto-generates order IDs: `ORD-{timestamp}-{random}`
- Auto-generates payment references: `PAY-{timestamp}-{random}`
- Methods: `createOrder()`, `getCompletedOrders()`, `getTotalRevenue()`, `getOrderCount()`, `generateReceipt()`, `copyReceipt()`

---

### 3. Page Structure

#### ShopPage (`src/pages/ShopPage.jsx`)
- Displays products in grid layout
- Category filter sidebar (desktop) / drawer (mobile)
- 3 categories: Computers, Mobile Phones, Accessories
- Product count display
- Responsive design with Tailwind

#### ProductDetailPage (`src/pages/ProductDetailPage.jsx`)
- Image gallery with thumbnail navigation
- Price display with original price (if discounted)
- Description rendering (supports rich text)
- Add to Cart / Buy Now buttons
- Category badge display
- Related products section (same category)
- RichTextRenderer component for formatted descriptions

#### CheckoutPage (`src/pages/CheckoutPage.jsx`)
**Two Checkout Methods:**

1. **WhatsApp Checkout** (Primary)
   - Generates pre-filled order message
   - Opens WhatsApp with order details
   - Configurable via `VITE_WHATSAPP_PHONE_NUMBER`

2. **Online Payment** (Card)
   - Shipping form with validation
   - Payment processing (simulated - ready for Flutterwave integration)
   - Creates order record on completion

**Shipping Details Collected:**
- Email, Phone, Full Name, Address, City, State, Postal Code

---

### 4. Admin Panel

#### DashboardPage (`src/pages/admin/DashboardPage.jsx`)
**Two Tabs:**

1. **Overview Tab**
   - Stats cards: Total Products, Active Products, Total Revenue, Completed Orders
   - Products by Category chart
   - Recent Products list

2. **Orders Tab**
   - Revenue stats: Total Revenue, Order Count, Average Order Value
   - Orders list with: Order ID, Customer Info, Items, Payment Reference, Total
   - Copy Receipt button (copies formatted receipt to clipboard)

#### ProductsListPage (`src/pages/admin/ProductsListPage.jsx`)
- Search functionality
- Category filter dropdown
- Status filter (Active/Inactive/Archived)
- Pagination (10 items per page)
- Table display with toggle active/delete actions

#### ProductEditorPage (`src/pages/admin/ProductEditorPage.jsx`)
**Features:**
- Image upload with compression (automatic)
- Form sections: Images, Basic Info, Description, Settings
- Categories populated from ProductContext
- Validation: Name, Price, Category, Description required
- Save as Draft / Save & Publish options
- Edit mode with delete option

---

### 5. Image Compression (`src/lib/utils.js`)

```javascript
// Exported functions:
compressImage(file, config)     // Canvas-based image compression
compressVideo(file)              // Video thumbnail generation
formatFileSize(bytes)            // Human-readable file sizes
needsCompression(file, thresholdMB) // Check if compression needed
```

**Configuration:**
- Max dimensions: 1920x1920
- Quality: 80% JPEG
- High-quality image smoothing
- Maintains aspect ratio

---

## 🗄️ Appwrite Database Schema

### A. Products Collection (`products`)

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Unique ID (UUID) |
| name | string | Yes | Product name |
| price | integer | Yes | Price in Kobo |
| originalPrice | integer | No | Original price for discounts |
| category | enum | Yes | computers, mobile phones, accessories |
| description | string | Yes | Short description |
| longDescription | string | No | Detailed description |
| image | string | Yes | Main image URL |
| images | string[] | No | Additional images |
| stock | integer | Yes | Available quantity |
| featured | boolean | No | Featured flag |
| tags | string[] | No | Product tags |
| isActive | boolean | Yes | Active status |
| isArchived | boolean | Yes | Archive flag |
| createdAt | datetime | Yes | Creation timestamp |
| updatedAt | datetime | Yes | Last update timestamp |

**Permissions:**
- Read: Public
- Write: Admin only

### B. Orders Collection (`orders`)

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Unique order ID |
| paymentRef | string | Yes | Payment reference |
| customer | object | Yes | Customer details |
| items | object[] | Yes | Order items |
| subtotal | integer | Yes | Subtotal in Kobo |
| shipping | integer | Yes | Shipping cost |
| total | integer | Yes | Total in Kobo |
| status | string | Yes | completed, pending, failed |
| paymentMethod | string | No | whatsapp, card |
| createdAt | datetime | Yes | Order timestamp |

**Customer Object:**
```javascript
{
  email: string,
  phone: string,
  fullName: string,
  address: string,
  city: string,
  state: string,
  postalCode: string
}
```

**Item Object:**
```javascript
{
  id: string,
  name: string,
  price: number,
  quantity: number,
  size: string | null,
  color: string | null,
  image: string
}
```

**Permissions:**
- Create: Public (for guest checkout)
- Read/Update: Admin only

---

## 🔄 Migration Steps

### Phase 1: Appwrite Setup

1. **Create Database**: `abkhd_db`

2. **Create Collections**:
   - `products` (with above schema)
   - `orders` (with above schema)

3. **Setup Storage**:
   - Create bucket: `product-images`
   - Set permissions: Read Public, Write Admin

4. **Setup Authentication**:
   - Enable Email/Password
   - Optionally enable Google OAuth for admin

### Phase 2: API Layer

Create `src/lib/appwrite.js`:

```javascript
import { Client, Databases, Storage, ID } from 'appwrite'

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const db = new Databases(client)
export const storage = new Storage(client)

export const DB_ID = 'abkhd_db'
export const PRODUCTS_COLLECTION = 'products'
export const ORDERS_COLLECTION = 'orders'
export const IMAGES_BUCKET = 'product-images'
```

### Phase 3: Update Contexts

1. **ProductContext**: Fetch from Appwrite instead of local file

2. **AdminProductContext**: Save to Appwrite on add/update/delete

3. **OrderContext**: Save to Appwrite with proper permissions

### Phase 4: Update Admin Panel

1. **ImageUploader**: Upload to Appwrite Storage instead of base64

2. **ProductEditor**: Save images to storage, get URLs for product

### Phase 5: Payment Integration

**Flutterwave Integration:**

```javascript
// In CheckoutPage handlePayment():
import { FlutterwaveCheckout } from 'flutterwave-button-vue'

const config = {
  public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
  tx_ref: `ORD-${Date.now()}`,
  amount: getCartTotal(),
  currency: 'NGN',
  customer: {
    email: shippingDetails.email,
    phone: shippingDetails.phone,
    name: shippingDetails.fullName
  },
  callback: (response) => {
    // Verify payment and create order
  }
}
```

### Phase 6: Webhook Handler

Create Appwrite Function for Flutterwave webhook:

```javascript
// Verify payment
// Update order status to 'completed'
// Optionally decrease stock
```

---

## 📁 File Structure Summary

```
src/
├── contexts/
│   ├── ProductContext.jsx      # Product data management
│   ├── AdminProductContext.jsx # Admin CRUD operations
│   ├── CartContext.jsx         # Shopping cart
│   ├── OrderContext.jsx       # Order management
│   └── ToastContext.jsx      # Notifications
├── components/
│   ├── admin/
│   │   ├── ImageUploader.jsx  # With compression
│   │   ├── ProductTable.jsx
│   │   ├── ProductToggle.jsx
│   │   ├── StatsCard.jsx
│   │   └── SimpleChart.jsx
│   └── ui/
│       ├── BackButton.jsx
│       ├── Breadcrumb.jsx
│       └── Toast.jsx
├── pages/
│   ├── ShopPage.jsx           # Product listing with filters
│   ├── ProductDetailPage.jsx  # Product details + Add to Cart
│   ├── CheckoutPage.jsx       # WhatsApp + Card checkout
│   ├── AboutPage.jsx          # About with team
│   ├── ContactPage.jsx
│   ├── HomePage.jsx
│   ├── CategoryPage.jsx
│   ├── SuccessPage.jsx
│   └── admin/
│       ├── DashboardPage.jsx  # Overview + Orders tabs
│       ├── ProductsListPage.jsx
│       └── ProductEditorPage.jsx
├── data/
│   └── products.js            # Local product data
├── lib/
│   ├── utils.js               # formatPrice, compression functions
│   └── compression.js         # Standalone compression
└── contexts/
    └── OrderContext.jsx       # Order management
```

---

## 🔑 Environment Variables (Current)

```
VITE_APP_NAME=ABKHD Store
VITE_WHATSAPP_PHONE_NUMBER=+2347062284169
VITE_APPWRITE_PROJECT_ID= (to be added)
VITE_FLUTTERWAVE_PUBLIC_KEY= (to be added)
```

---

## ✅ Completed Features (Ready for Backend Integration)

1. ✅ Product listing with category filters
2. ✅ Product detail page with image gallery
3. ✅ Shopping cart with localStorage persistence
4. ✅ WhatsApp checkout
5. ✅ Card checkout (simulated - needs Flutterwave)
6. ✅ Order creation and tracking
7. ✅ Admin dashboard with revenue stats
8. ✅ Order management with receipts
9. ✅ Product CRUD in admin panel
10. ✅ Image compression on upload
11. ✅ 3 categories: Computers, Mobile Phones, Accessories
12. ✅ Stock management - decreases on purchase
13. ✅ Customer data captured in orders

---

## 🔄 Complete Purchase Flow Scenario

### Scenario: Unique Item Purchase (Used Phone)

**Step 1: Admin Uploads a Unique Used Phone**

1. Admin logs into `/admin`
2. Clicks "Add Product"
3. Fills in product details:
   - Name: "iPhone 13 Pro - Used (Excellent Condition)"
   - Category: "Mobile Phones"
   - Price: ₦450,000
   - Original Price: ₦550,000 (to show discount)
   - Description: "Single owner, battery health 89%, no scratches"
   - Long Description: Full condition report...
4. Uploads product images (automatically compressed)
5. Sets stock: **1** (unique item)
6. Marks as "Featured"
7. Clicks "Save & Publish"

**Product saved with:**
```javascript
{
  id: "unique-001",
  name: "iPhone 13 Pro - Used (Excellent Condition)",
  category: "mobile phones",
  price: 450000,
  originalPrice: 550000,
  stock: 1,  // Only 1 available!
  featured: true,
  images: ["https://..."],
  isActive: true,
  isArchived: false
}
```

---

**Step 2: Customer Browses Shop**

1. Customer visits `/shop`
2. Sees "iPhone 13 Pro" in the Mobile Phones category (featured)
3. Clicks on product to see details
4. Views image gallery, description, price
5. Clicks "Add to Cart"
6. Item added to cart with cartId: `unique-001-null-null-1709876543210`

---

**Step 3: Customer Proceeds to Checkout**

1. Customer goes to `/checkout`
2. Reviews order summary:
   - iPhone 13 Pro - Used
   - Qty: 1
   - Total: ₦450,000
3. Chooses payment method:
   - **Option A: WhatsApp** - Opens WhatsApp with order details
   - **Option B: Card Payment** - Fills shipping form

---

**Step 4: Card Payment Flow**

1. Customer fills shipping form:
   - Email: john@example.com
   - Phone: +2348012345678
   - Full Name: John Doe
   - Address: 123 Lagos Street
   - City: Lagos
   - State: Lagos
   - Postal Code: 101001

2. Clicks "Pay ₦450,000"
3. System:
   - Simulates payment processing (2 seconds)
   - Creates order with customer data:
   ```javascript
   {
     id: "ORD-m1709876543-ABC123",
     paymentRef: "PAY-m1709876543-DEF456",
     status: "completed",
     customer: {
       email: "john@example.com",
       phone: "+2348012345678",
       fullName: "John Doe",
       address: "123 Lagos Street",
       city: "Lagos",
       state: "Lagos",
       postalCode: "101001"
     },
     items: [{
       id: "unique-001",
       name: "iPhone 13 Pro - Used (Excellent Condition)",
       price: 450000,
       quantity: 1,
       size: null,
       color: null,
       image: "https://..."
     }],
     subtotal: 450000,
     shipping: 0,
     total: 450000,
     createdAt: "2024-03-08T04:30:00.000Z"
   }
   ```
   - **Decreases product stock from 1 to 0**
   - Clears cart
   - Shows success message
   - Redirects to `/success`

---

**Step 5: Admin Views Order**

1. Admin visits `/admin`
2. Sees new order in Orders tab:
   - Order ID: ORD-m1709876543-ABC123
   - Customer: John Doe
   - Payment Ref: PAY-m1709876543-DEF456
   - Total: ₦450,000
   - Status: Completed (green badge)
3. Can click "Copy Receipt" to get formatted receipt
4. Can view customer details for shipping

---

**Step 6: Stock Updated**

- Product stock now shows **0**
- Product remains visible but shows "Out of Stock" (if implemented)
- For unique items, this prevents overselling

---

### Order Data Structure (Complete)

```javascript
{
  // Order Identification
  id: string,           // "ORD-timestamp-random"
  paymentRef: string,   // "PAY-timestamp-random" - Flutterwave reference
  status: string,        // "completed" | "pending" | "failed"
  createdAt: string,     // ISO timestamp

  // Customer Information
  customer: {
    email: string,
    phone: string,
    fullName: string,
    address: string,
    city: string,
    state: string,
    postalCode: string
  },

  // Order Items
  items: [{
    id: string,
    name: string,
    price: number,
    quantity: number,
    size: string | null,
    color: string | null,
    image: string
  }],

  // Payment Summary
  subtotal: number,
  shipping: number,
  total: number,

  // Payment Method (for reference)
  paymentMethod: string  // "whatsapp" | "card"
}
```

---

## 🚀 Next Steps for Backend Integration

1. Set up Appwrite Cloud account
2. Create database and collections
3. Migrate product data to Appwrite
4. Implement Appwrite authentication for admin
5. Integrate Flutterwave for payments
6. Set up webhook for payment verification
7. Deploy to production
