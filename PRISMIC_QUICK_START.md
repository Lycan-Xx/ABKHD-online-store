# Prismic Migration Quick Start Guide

## 📋 Overview
This guide will help you migrate from Strapi to Prismic CMS in a few hours. All your product data has been exported and is ready to copy-paste into Prismic.

---

## 🎯 Step 1: Create Prismic Account (5 minutes)

1. Go to https://prismic.io/dashboard/signup
2. Sign up with your email
3. Create a new repository
   - **Repository name**: `abkhd-store` (or your preferred name)
   - **Plan**: Free (4M API calls/month)
4. Save your repository name - you'll need it later

---

## 🏗️ Step 2: Create Custom Types (10 minutes)

### Create Category Type

1. In Prismic Dashboard, go to **Custom Types**
2. Click **Create New** → **Repeatable Type**
3. Name: `Category`, API ID: `category`
4. Click **JSON editor** (top right)
5. **Copy and paste this entire JSON:**

```json
{
  "Main": {
    "uid": {
      "type": "UID",
      "config": {
        "label": "Category Slug",
        "placeholder": "mobile-phones"
      }
    },
    "name": {
      "type": "Text",
      "config": {
        "label": "Category Name",
        "placeholder": "Mobile Phones"
      }
    },
    "description": {
      "type": "StructuredText",
      "config": {
        "multi": "paragraph, strong, em",
        "label": "Category Description"
      }
    },
    "image": {
      "type": "Image",
      "config": {
        "label": "Category Image"
      }
    }
  }
}
```

6. Click **Save**

### Create Product Type

1. Click **Create New** → **Repeatable Type**
2. Name: `Product`, API ID: `product`
3. Click **JSON editor**
4. **Copy and paste this entire JSON:**

```json
{
  "Main": {
    "uid": {
      "type": "UID",
      "config": {
        "label": "Product Slug"
      }
    },
    "name": {
      "type": "Text",
      "config": {
        "label": "Product Name"
      }
    },
    "description": {
      "type": "Text",
      "config": {
        "label": "Short Description"
      }
    },
    "long_description": {
      "type": "StructuredText",
      "config": {
        "multi": "paragraph, preformatted, strong, em, list-item, o-list-item",
        "label": "Long Description"
      }
    },
    "price": {
      "type": "Number",
      "config": {
        "label": "Price"
      }
    },
    "original_price": {
      "type": "Number",
      "config": {
        "label": "Original Price"
      }
    },
    "featured": {
      "type": "Boolean",
      "config": {
        "default_value": false,
        "label": "Featured Product"
      }
    },
    "category": {
      "type": "Link",
      "config": {
        "select": "document",
        "customtypes": ["category"],
        "label": "Category"
      }
    }
  },
  "Images": {
    "main_image": {
      "type": "Image",
      "config": {
        "label": "Main Product Image"
      }
    },
    "additional_images": {
      "type": "Group",
      "config": {
        "fields": {
          "image": {
            "type": "Image",
            "config": {
              "label": "Additional Image"
            }
          }
        },
        "label": "Additional Images"
      }
    }
  }
}
```

5. Click **Save**

---

## 📦 Step 3: Create Categories (5 minutes)

### Category 1: Mobile Phones

1. Go to **Documents** → **Category**
2. Click **Create New**
3. Fill in:
   - **UID**: `mobile-phones`
   - **Name**: `Mobile Phones`
   - **Description**: `Latest smartphones and mobile devices`
4. Click **Save** then **Publish**

### Category 2: Computer

1. Click **Create New** (Category)
2. Fill in:
   - **UID**: `computer`
   - **Name**: `Computer`
   - **Description**: `Desktop and laptop computers`
3. Click **Save** then **Publish**

---

## 📸 Step 4: Download Product Images (10 minutes)

Download these images from your Strapi (right-click → Save As):

### Apple iPhone 11 (4 images)
- https://grounded-triumph-14beb219e4.media.strapiapp.com/Whats_App_Image_2025_11_28_at_21_40_14_dd7cdfd9_4e98914b32.jpg
- https://grounded-triumph-14beb219e4.media.strapiapp.com/Whats_App_Image_2025_11_28_at_21_40_15_1a2f1466_84ed738330.jpg
- https://grounded-triumph-14beb219e4.media.strapiapp.com/Whats_App_Image_2025_11_28_at_21_40_15_a73441b2_d0df2a1803.jpg
- https://grounded-triumph-14beb219e4.media.strapiapp.com/Whats_App_Image_2025_11_28_at_21_40_16_81d6c073_277a01ebd8.jpg

### Dell Latitude 3189 (1 image)
- https://grounded-triumph-14beb219e4.media.strapiapp.com/Whats_App_Image_2026_01_02_at_01_16_30_6d3539ed33.jpeg

### Redmi 14C (4 images)
- https://grounded-triumph-14beb219e4.media.strapiapp.com/Whats_App_Image_2025_11_27_at_21_54_33_c5e5d744_d55fb82659.jpg
- https://grounded-triumph-14beb219e4.media.strapiapp.com/Whats_App_Image_2025_11_27_at_21_54_35_63929317_b0ad9e3996.jpg
- https://grounded-triumph-14beb219e4.media.strapiapp.com/Whats_App_Image_2025_11_27_at_21_54_33_58dbea58_d7032000ae.jpg
- https://grounded-triumph-14beb219e4.media.strapiapp.com/Whats_App_Image_2025_11_27_at_21_54_34_3534e0fd_c6c35d0452.jpg

### HP EliteBook 840 (1 image)
- https://grounded-triumph-14beb219e4.media.strapiapp.com/IMG_20251201_WA_0008_350da44aa5.jpg

### iPhone XR (1 image)
- https://grounded-triumph-14beb219e4.media.strapiapp.com/IMG_20260101_WA_0138_68ae0b7347.jpg

**Tip**: Organize downloaded images in folders by product name for easy reference.

---

## 🛍️ Step 5: Create Products (30 minutes)

### Product 1: Apple iPhone 11

1. Go to **Documents** → **Product** → **Create New**
2. **Main Tab:**
   - **UID**: `apple-iphone-11`
   - **Name**: `Apple iPhone 11`
   - **Description**: `Used But Super clean`
   - **Long Description**: 
     ```
     RAM : 4GB
     STORAGE : 64GB
     COLOR : White
     SENSOR : Face ID
     BUILD : Glass back and Front, Aluminium frame
     CONDITION : Used
     ```
   - **Price**: `180000`
   - **Original Price**: `220000`
   - **Featured**: ✅ Check this box
   - **Category**: Select "Mobile Phones"

3. **Images Tab:**
   - **Main Image**: Upload the first iPhone 11 image
   - **Additional Images**: Click "Add item" and upload the other 3 images

4. Click **Save** then **Publish**

---

### Product 2: DELL LATITUDE 3189 X360

1. **Create New** Product
2. **Main Tab:**
   - **UID**: `dell-latitude-3189-x360`
   - **Name**: `DELL LATITUDE 3189 X360`
   - **Description**: `Clean Grade A Dell Latitude 11 inches Convertible Touchscreen`
   - **Long Description**:
     ```
     NAME: Dell Latitude 3189
     RAM: 8GB
     STORAGE : 128GB
     PROCESSOR: Intel Pentium Silver 4 Cores
     TYPE: Convertible Laptop
     SIZE: 11 inches
     ```
   - **Price**: `180000`
   - **Original Price**: `200000`
   - **Featured**: ✅ Check this box
   - **Category**: Select "Computer"

3. **Images Tab:**
   - **Main Image**: Upload Dell image
   - **Additional Images**: Upload same image (or leave empty)

4. **Save** and **Publish**

---

### Product 3: Redmi 14C

1. **Create New** Product
2. **Main Tab:**
   - **UID**: `redmi-14c`
   - **Name**: `Redmi 14C`
   - **Description**: `Direct UK used Redmi 14C with excellent battery`
   - **Long Description**:
     ```
     NAME: Redmi 14C
     RAM: 6GB
     ROM: 128GB
     BATTERY : 5000mAh
     CONDITION: None
     ```
   - **Price**: `130000`
   - **Original Price**: `160000`
   - **Featured**: ❌ Leave unchecked
   - **Category**: Select "Mobile Phones"

3. **Images Tab:**
   - **Main Image**: Upload first Redmi image
   - **Additional Images**: Upload the other 3 images

4. **Save** and **Publish**

---

### Product 4: HP ELITEBOOK 840 G6

1. **Create New** Product
2. **Main Tab:**
   - **UID**: `hp-elitebook-840-g6`
   - **Name**: `HP ELITEBOOK 840 G6`
   - **Description**: `Direct London Use as Clean as Used with Charger`
   - **Long Description**:
     ```
     NAME: HP ELITEBOOK 840 G6
     RAM: 8GB
     STORAGE: 256GB SSD
     PROCESSOR : Intel Core i5 11th Gen.
     CONDITION: None
     COLOR: Ash
     ```
   - **Price**: `340000`
   - **Original Price**: `360000`
   - **Featured**: ❌ Leave unchecked
   - **Category**: Select "Computer"

3. **Images Tab:**
   - **Main Image**: Upload HP image

4. **Save** and **Publish**

---

### Product 5: Apple iPhone XR 128GB

1. **Create New** Product
2. **Main Tab:**
   - **UID**: `apple-iphone-xr-128gb`
   - **Name**: `Apple iPhone XR 128GB`
   - **Description**: `Clean Grade B iPhone XR`
   - **Long Description**:
     ```
     NAME: iPhone XR
     RAM: 4GB
     ROM: 128GB
     CONDITION: None
     ```
   - **Price**: `180000`
   - **Original Price**: `190000`
   - **Featured**: ❌ Leave unchecked
   - **Category**: Select "Mobile Phones"

3. **Images Tab:**
   - **Main Image**: Upload iPhone XR image

4. **Save** and **Publish**

---

## 💻 Step 6: Update Your Code (15 minutes)

### 1. Install Prismic SDK

```bash
npm install @prismicio/client @prismicio/react
```

### 2. Update .env file

Add these lines to your `.env` file:

```env
VITE_PRISMIC_REPO_NAME=abkhd-store
# VITE_PRISMIC_ACCESS_TOKEN=  (only if you set one)
```

Replace `abkhd-store` with your actual repository name.

### 3. Update ProductContext.jsx

Open `src/contexts/ProductContext.jsx` and change line 2:

**FROM:**
```javascript
import { fetchProducts, fetchCategories } from '../services/strapi'
```

**TO:**
```javascript
import { fetchProducts, fetchCategories } from '../services/prismic'
```

That's it! The prismic.js service file is already created.

---

## 🧪 Step 7: Test Locally (10 minutes)

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 (or your dev URL)

3. Check the browser console for:
   - ✅ "Prismic Client initialized"
   - ✅ "Fetching products from Prismic..."
   - ✅ "Mapped products: 5"

4. Verify:
   - [ ] Homepage shows 2 featured products
   - [ ] Shop page shows all 5 products
   - [ ] Category filtering works
   - [ ] Product detail pages load
   - [ ] All images display correctly

---

## 🚀 Step 8: Deploy to Production (10 minutes)

### Update Environment Variables

In your hosting platform (Vercel/Netlify/etc):

1. Go to **Settings** → **Environment Variables**
2. Add:
   - `VITE_PRISMIC_REPO_NAME` = `abkhd-store` (your repo name)
3. Remove (optional):
   - `VITE_STRAPI_API_URL`
   - `VITE_STRAPI_MEDIA_URL`

### Deploy

```bash
npm run build
# Then deploy using your platform's method
```

---

## 📊 Step 9: Monitor API Usage

1. Go to Prismic Dashboard → **Settings** → **Usage**
2. Monitor your API calls
3. With optimization, you should see ~5,000 calls/month (well under 4M limit)

---

## 🎓 Train Your Content Manager (15 minutes)

### Adding a New Product

1. Go to **Documents** → **Product** → **Create New**
2. Fill in all fields (UID, Name, Description, etc.)
3. Upload images
4. Select category
5. Check "Featured" if you want it on homepage
6. Click **Save** then **Publish**

### Editing a Product

1. Find product in **Documents** list
2. Click to open
3. Make changes
4. Click **Save** then **Publish**

### Key Benefits for Content Manager

- ✅ Simpler, cleaner interface than Strapi
- ✅ Automatic image optimization
- ✅ No need to manage API permissions
- ✅ Built-in preview functionality
- ✅ Easier content scheduling

---

## 🔧 Optimization (Optional - 30 minutes)

### Add Caching to Reduce API Calls

Update `src/contexts/ProductContext.jsx`:

```javascript
// Add at the top
const CACHE_KEY = 'products_cache'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

// In fetchData function, before fetching:
const cachedData = localStorage.getItem(CACHE_KEY)
if (cachedData) {
  const { data, timestamp } = JSON.parse(cachedData)
  if (Date.now() - timestamp < CACHE_TTL) {
    setProducts(data.products)
    setCategories(data.categories)
    setDataSource('cache')
    setLoading(false)
    return
  }
}

// After successful fetch:
localStorage.setItem(CACHE_KEY, JSON.stringify({
  data: { products: productsData, categories: categoriesData },
  timestamp: Date.now()
}))
```

### Change Refresh Interval

In `ProductContext.jsx`, change line ~70:

**FROM:**
```javascript
const interval = setInterval(fetchData, 300000) // 5 minutes
```

**TO:**
```javascript
const interval = setInterval(fetchData, 1800000) // 30 minutes
```

---

## ✅ Success Checklist

- [ ] Prismic account created
- [ ] Custom types created (Category & Product)
- [ ] 2 categories created and published
- [ ] 5 products created and published
- [ ] All images uploaded
- [ ] Prismic SDK installed
- [ ] Environment variables updated
- [ ] ProductContext updated to use Prismic
- [ ] Local testing successful
- [ ] Deployed to production
- [ ] Content manager trained
- [ ] API usage monitored

---

## 🆘 Troubleshooting

### Products not showing

- Check browser console for errors
- Verify repository name in .env is correct
- Ensure all products are **Published** (not just saved)
- Check that ProductContext is importing from prismic service

### Images not loading

- Verify images were uploaded to Prismic
- Check that main_image field is filled
- Look for image URLs in browser console logs

### Category filtering not working

- Ensure products have category relationships set
- Verify both categories are published
- Check console for category data

---

## 📞 Need Help?

- **Prismic Docs**: https://prismic.io/docs
- **Prismic Community**: https://community.prismic.io
- **Your Migration Files**: Check `prismic-content-export.json` for all your data

---

## 🎉 You're Done!

Your migration is complete! You now have:

- ✅ 4M API calls/month (vs 2,500 with Strapi)
- ✅ Simpler content management
- ✅ Better image optimization
- ✅ Same functionality for your users
- ✅ Room to grow

**Estimated API usage**: ~5,000 calls/month (with optimization)
**Headroom**: 799x your current usage

Enjoy your new CMS! 🚀
