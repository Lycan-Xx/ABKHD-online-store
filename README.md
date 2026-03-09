# ABKHD Store - Premium Tech Ecommerce

ABKHD Store is a high-performance, modern ecommerce platform built with **Astro 5** and **Appwrite**. It focuses on delivering a premium shopping experience for tech enthusiasts, with support for high-quality video previews, seamless card payments, and a powerful administrative dashboard.

**Development Team - [Lycan-Xx](https://github.com/Lycan-Xx) Says hi.. 👋🏽 (: 👾**

---

### 🌐 Live Preview
**Production**: [https://abkhd-store-astro.pages.dev](https://abkhd-store-astro.pages.dev)

---

## 🚀 Technical Architecture

### Core Stack
- **Framework**: [Astro 5](https://astro.build/) (Static Side Generation with Client-side Hydration)
- **Backend-as-a-Service**: [Appwrite](https://appwrite.io/) (Database, Storage, Authentication)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Interactions**: Vanilla JS + React Components
- **Payments**: [Squad](https://squadco.com/) (Nigerian Payment Gateway)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

### Key Features
- 🎥 **Video Support**: Products support high-quality video uploads with automatic thumbnail generation.
- 🔐 **Admin Panel**: Secure administrative area for managing products and orders.
- 🛒 **Dynamic Cart**: Persistent shopping cart with real-time updates.
- 💳 **Secure Checkout**: Integrated with Squad for safe and easy transactions (Card, Bank Transfer, USSD).
- 🌓 **Dark Mode**: Premium dark mode support with system preference detection.

---

## 🛠️ Development Setup

### Prerequisites
- Node.js v20+
- Yarn 4 (Berry)
- Appwrite Cloud account

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
4. Add your `.env` variables in the Cloudflare Dashboard under **Settings > Environment Variables**.

---

## 💳 Squad Payment Integration

This project uses Squad as the payment gateway for Nigerian customers. Squad supports:
- Card payments (Visa, Mastercard, Verve)
- Bank transfers
- USSD payments
- Direct bank account debits

### Quick Start
See `SQUAD_QUICK_START.md` for a 5-minute setup guide.

### Complete Documentation
- **Master Guide:** `SQUAD_MASTER_GUIDE.md` - Complete documentation index
- **Integration Guide:** `SQUAD_INTEGRATION.md` - Full integration details
- **Debugging Guide:** `SQUAD_DEBUGGING.md` - Troubleshooting help
- **Deployment Guide:** `DEPLOYMENT_GUIDE.md` - Production deployment
- **Quick Reference:** `QUICK_REFERENCE.md` - Common commands & URLs

### Testing
```bash
# Verify complete setup
npx tsx scripts/verify-setup.ts

# Test Squad API connection
npx tsx scripts/test-squad.ts

# Visit test page
http://localhost:4321/test-squad
```

---

## 🔐 Administrative Access
- **Admin Path**: `/admin`
- **Login**: Use the credentials created via the `create-admin` script.
- **Features**: 
  - Create/Edit products with support for multiple images and videos.
  - View and manage customer orders.
  - Toggle product visibility and featured status.

---

## 🤝 Support
If you encounter any issues or have questions, feel free to reach out to the development team.

**[Lycan-Xx](https://github.com/Lycan-Xx)**

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
