# ABKHD Store - Premium Tech Ecommerce

ABKHD Store is a high-performance, modern ecommerce platform built with **Astro 5** and **Appwrite**. It focuses on delivering a premium shopping experience for tech enthusiasts, with support for high-quality video previews, seamless card payments, and a powerful administrative dashboard.

**Development Team - [Lycan-Xx](https://github.com/Lycan-Xx) Says hi.. 👋🏽 (: 👾**

---

### 🌐 Live Preview
**Production**: [https://abkhdstores.com.ng](https://abkhdstores.com.ng)

---

## 🚀 Technical Architecture

### Core Stack
- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation with Server-Side Rendering)
- **Backend-as-a-Service**: [Appwrite](https://appwrite.io/) (Database, Storage, Authentication)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Interactions**: Vanilla JS + React Components
- **Payments**: [Squad](https://squadco.com/) (Nigerian Payment Gateway)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

### Key Features
- 🎥 **Video Support**: Products support high-quality video uploads with automatic thumbnail generation.
- 💾 **Upload Caching**: Automatic caching of uploaded media files to prevent data loss on network failures or page refreshes.
- 📤 **Sequential Uploads**: Media files upload sequentially with individual progress feedback, allowing retry of failed uploads.
- 🗑️ **Bulk Operations**: Multi-product selection for bulk delete and export to CSV.
- 🔐 **Admin Panel**: Secure administrative area for managing products and orders.
- 🛒 **Dynamic Cart**: Persistent shopping cart with real-time updates.
- 💳 **Secure Checkout**: Integrated with Squad for safe and easy transactions (Card, Bank Transfer, USSD).
- 🌓 **Dark Mode**: Premium dark mode support with system preference detection.
- 📱 **Mobile Share**: Mobile-first share button with desktop clipboard fallback.
- 🔍 **SEO Ready**: Open Graph meta tags for social media sharing.
- 🛍️ **Checkout Flow**: Multi-step checkout (Details → Payment → Confirmation) with order summary.
- 📍 **Delivery Areas**: Support for Yola and Jimeta with delivery fees.
- 💬 **WhatsApp Order**: Alternative ordering via WhatsApp for customers who prefer manual orders.

---

## 📁 Project Structure

```
ABKHD-online-store/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── shop.astro          # Product listing
│   │   ├── checkout.astro      # Multi-step checkout
│   │   ├── about.astro         # About page
│   │   ├── contact.astro       # Contact page
│   │   ├── login.astro          # Customer login
│   │   ├── products/
│   │   │   └── [id].astro      # Product detail
│   │   ├── admin/
│   │   │   ├── index.astro      # Dashboard
│   │   │   ├── products.astro  # Product management
│   │   │   ├── orders.astro     # Order management
│   │   │   └── login.astro      # Admin login
│   │   └── api/
│   │       ├── squad-initiate.ts    # Payment initiation
│   │       └── squad-webhook.ts     # Payment callback
│   ├── lib/
│   │   ├── appwrite.ts         # Appwrite client
│   │   ├── squad.ts            # Squad payment API
│   │   ├── cart.ts             # Cart utilities
│   │   ├── upload-cache.ts     # Upload caching
│   │   ├── stock-manager.ts    # Stock management
│   │   └── utils.ts            # Utility functions
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   ├── ui/                  # Reusable components
│   │   └── cart/               # Cart components
│   └── layouts/
│       ├── Layout.astro        # Main layout
│       └── AdminLayout.astro   # Admin layout
├── public/
│   └── assets/logo/            # Brand logos
├── scripts/
│   ├── setup-appwrite.ts      # Appwrite setup
│   ├── create-admin.ts         # Admin creation
│   └── verify-setup.ts        # Setup verification
└── package.json
```

---

## 🛠️ Development Setup

### Prerequisites
- Node.js v20+
- Yarn 4 (Berry)
- Appwrite Cloud account
- Cloudflare account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Lycan-Xx/ABKHD-online-store.git
   cd ABKHD-online-store
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```

### Configuration
1. Create a `.env` file in the root directory:
   ```env
   PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
   PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   PUBLIC_APPWRITE_DATABASE_ID=abkhd_db
   PUBLIC_APPWRITE_COLLECTION_PRODUCTS=products
   PUBLIC_APPWRITE_COLLECTION_ORDERS=orders
   PUBLIC_APPWRITE_BUCKET_IMAGES=product-images
   PUBLIC_SQUAD_PUBLIC_KEY=your_squad_public_key
   SQUAD_SECRET_KEY=your_squad_secret_key
   ```

2. Run the automated Appwrite setup script:
   ```bash
   npx tsx scripts/setup-appwrite.ts
   ```

3. Create your admin account:
   ```bash
   npx tsx scripts/create-admin.ts admin@yourdomain.com yourpassword "Your Name"
   ```

### Local Development
```bash
yarn dev
```

---

## 📦 Deployment

### Cloudflare Pages
This project is optimized for Cloudflare Pages.

1. Connect your repository to Cloudflare Pages.
2. Set the build command: `yarn build`
3. Set the output directory: `dist`
4. Add your environment variables in the Cloudflare Dashboard under **Settings > Environment Variables**:
   - `PUBLIC_APPWRITE_ENDPOINT`
   - `PUBLIC_APPWRITE_PROJECT_ID`
   - `PUBLIC_APPWRITE_DATABASE_ID`
   - `PUBLIC_APPWRITE_COLLECTION_PRODUCTS`
   - `PUBLIC_APPWRITE_COLLECTION_ORDERS`
   - `PUBLIC_APPWRITE_BUCKET_IMAGES`
   - `PUBLIC_SQUAD_PUBLIC_KEY`
   - `SQUAD_SECRET_KEY`

**Important**: Do NOT include a `wrangler.toml` file in your repository. Including it will lock the Dashboard's Environment Variables section and prevent you from adding plain text variables. If you need Wrangler functionality, add secrets via the CLI instead.

---

## 💳 Squad Payment Integration

This project uses Squad as the payment gateway for Nigerian customers. Squad supports:
- Card payments (Visa, Mastercard, Verve)
- Bank transfers
- USSD payments
- Direct bank account debits

### Configuration
1. Get your API keys from [Squad Dashboard](https://dashboard.squadco.com)
2. Add `SQUAD_SECRET_KEY` as a plain text environment variable in Cloudflare Dashboard
3. The public key is used client-side for the checkout UI

---

## 🔐 Administrative Access
- **Admin Path**: `/admin`
- **Login**: Use the credentials created via the `create-admin` script.
- **Features**: 
  - Create/Edit products with support for multiple images and videos.
  - Upload caching prevents data loss on network failures.
  - Sequential uploads with individual progress feedback.
  - Bulk delete and export products to CSV.
  - View and manage customer orders.
  - Toggle product visibility and featured status.

---

## 🔄 Recent Updates

### April 2026
- 🚀 **New Checkout Flow**: Complete redesign with multi-step checkout (Details → Payment → Confirmation)
- 📍 **Delivery Areas**: Added support for Yola (₦1,000) and Jimeta (₦2,000) delivery
- 💬 **WhatsApp Orders**: Added alternative ordering via WhatsApp for customers
- 🛡️ **Dashboard Variables Fix**: Removed wrangler.toml to enable plain text environment variables in Cloudflare
- 🔧 **Payment Fix**: Resolved Squad payment initialization issues by using import.meta.env for environment variables

### Technical Improvements
- Stock management system to prevent overselling
- Improved order processing with webhook support
- Enhanced mobile responsiveness
- Better error handling and logging

---

## 🤝 Support
If you encounter any issues or have questions, feel free to reach out to the development team.

**[Lycan-Xx](https://github.com/Lycan-Xx)**

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.