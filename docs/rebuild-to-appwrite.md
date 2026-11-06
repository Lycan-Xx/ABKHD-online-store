# 📱 Project ABKHD: Complete Rebuild Master Plan (Astro Edition)

**Stack: Astro (Current) + Appwrite Cloud (Backend/DB/Storage) + Flutterwave (Payments)**

---

## 📊 Current Codebase Overview (Post-Migration)

### 1. Unified Data Model
- **Products**: Defined in `src/data/products.ts`.
- **Categories**: Defined in `src/data/products.ts` (Computers, Mobile Phones, Accessories).
- **Static Assets**: Images currently referenced via external URLs or local paths.

### 2. Architecture
- **Framework**: Astro 5.0 with React Islands.
- **Styling**: Tailwind CSS.
- **Client-side Logic**: Shopping cart persisted in `localStorage`.
- **Admin**: Multi-page Astro Layout (`/admin`) with simulated CRUD operations.

---

## 🏗️ Appwrite Integration Plan (Scoped & Phase-Based)

### Phase 1: Infrastructure Setup (Manual)
1. **Database**: Create `abkhd_db`.
2. **Collections**:
   - `products`: Attributes mapped from `src/data/products.ts` (id, name, price, originalPrice, category, stock, featured, image, images, tags).
   - `orders`: Attributes for paymentReference, customerData, itemsBlob, totalAmount, status.
3. **Storage**: Create `product-images` bucket.
4. **Auth**: Enable Email/Password for Admin login.

### Phase 2: Core SDK Integration (In Progress)
- [x] Install `appwrite` SDK.
- [x] Configure `src/lib/appwrite.ts` with Project ID and Endpoint.
- [x] Implement connection verification (Ping).
- [ ] Move IDs to `.env` for security.

### Phase 3: Data Migration
- **Script**: Create `scripts/migrate.ts` to push all current static products to Appwrite.
- **Automation**: Ensure unique IDs are preserved or mapped to Appwrite Document IDs.

### Phase 4: Dynamic Frontend (The "Hiccup-Free" Integration)
- **Shop Page**: Replace hardcoded `<script>` products in `shop.astro` with a server-side fetch from Appwrite.
- **Product Details**: Create dynamic routing fetching directly from Appwrite `databases.getDocument()`.
- **Categories**: Fetch category list dynamically to allow adding new categories without code changes.

### Phase 5: Admin Panel & Storage
- **Image Uploads**: Replace Base64/Local paths with `storage.createFile()`.
- **Live Inventory**: Admin dashboard stats (Total Revenue, Stock Alerts) to query Appwrite real-time.

### Phase 6: Live Payments (Flutterwave)
- **Checkout**: Replace simulated processing with Flutterwave Inline Script.
- **Verification**: Post-payment order creation in Appwrite `orders` collection.

---

## 🔄 Final Verification Checklist
- [ ] No hardcoded product data in any `.astro` or `<script>` tags.
- [ ] Admin panel successfully uploads images to Appwrite Storage.
- [ ] Flutterwave sandbox payment creates a 'completed' order in Appwrite.
- [ ] Public users can read products; only Admin can write/delete.

---

## 🔑 Required Environment Variables
```env
PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
PUBLIC_APPWRITE_PROJECT_ID=69ae47f1002d446552b3
PUBLIC_APPWRITE_DATABASE_ID= (to be provided)
PUBLIC_APPWRITE_COLLECTION_PRODUCTS= (to be provided)
PUBLIC_APPWRITE_COLLECTION_ORDERS= (to be provided)
PUBLIC_APPWRITE_BUCKET_IMAGES= (to be provided)
```
