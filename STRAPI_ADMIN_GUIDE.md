
# Strapi Admin Configuration Guide

This guide provides step-by-step instructions for configuring your Strapi backend to work with your ecommerce platform.

## Prerequisites

- Your Strapi backend is running on `http://0.0.0.0:1337`
- You have admin access to the Strapi admin panel

## 1. Initial Setup

### Access Admin Panel
1. Navigate to `http://0.0.0.0:1337/admin`
2. Create your admin account if this is your first time
3. Log in to the admin dashboard

## 2. Content Types Configuration

Your backend already has two content types configured:
- **Products** - Individual items in your store
- **Categories** - Product categories (Accessories, Laptops, Mobile Phones)

### Product Content Type Fields:
- `name` (Text) - Product name
- `description` (Text) - Short product description
- `longDescription` (Rich Text) - Detailed product description
- `price` (Decimal) - Product price
- `originalPrice` (Decimal) - Original price (for discounts)
- `featured` (Boolean) - Whether product is featured
- `image` (Media) - Main product image
- `images` (Media, Multiple) - Additional product images
- `category` (Relation) - Link to category

### Category Content Type Fields:
- `name` (Text) - Category name
- `description` (Text) - Category description
- `image` (Media) - Category image
- `products` (Relation) - Related products

## 3. Setting Up Categories

1. Go to **Content Manager** → **Categories**
2. Click **Create new entry**
3. Create these three categories:

### Category 1: Mobile Phones
- **Name**: `Mobile Phones`
- **Description**: `Latest smartphones and mobile devices`
- **Image**: Upload a relevant category image

### Category 2: Laptops
- **Name**: `Laptops`
- **Description**: `High-performance laptops and notebooks`
- **Image**: Upload a relevant category image

### Category 3: Accessories
- **Name**: `Accessories`
- **Description**: `Computer and mobile accessories`
- **Image**: Upload a relevant category image

4. **Publish** each category after creation

## 4. Adding Products

1. Go to **Content Manager** → **Products**
2. Click **Create new entry**
3. Fill in the product details:

### Required Fields:
- **Name**: Product name (e.g., "iPhone 15 Pro")
- **Description**: Brief description
- **Price**: Product price (use decimal format)
- **Category**: Select from the dropdown (Mobile Phones, Laptops, or Accessories)

### Optional Fields:
- **Long Description**: Detailed product information
- **Original Price**: For showing discounts
- **Featured**: Check to display on homepage
- **Image**: Main product image
- **Images**: Additional product photos

### Example Products to Create:

#### Mobile Phones:
- iPhone 15 Pro - ₦850,000
- Samsung Galaxy S24 - ₦750,000
- Google Pixel 8 - ₦650,000

#### Laptops:
- MacBook Pro M3 - ₦1,500,000
- Dell XPS 13 - ₦900,000
- HP Spectre x360 - ₦800,000

#### Accessories:
- Wireless Mouse - ₦15,000
- Laptop Stand - ₦25,000
- Phone Case - ₦8,000

4. **Publish** each product after creation

## 5. Media Library Setup

1. Go to **Media Library**
2. Create folders for organization:
   - `products/`
   - `categories/`
   - `featured/`

### Image Requirements:
- **Format**: JPG, PNG, WebP
- **Size**: Recommended 800x800px for products, 1200x600px for categories
- **Quality**: High quality for best display

## 6. API Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public**
3. Enable these permissions:

### Product Permissions:
- ✅ `find` - List products
- ✅ `findOne` - Get single product

### Category Permissions:
- ✅ `find` - List categories
- ✅ `findOne` - Get single category

### Upload Permissions:
- ✅ `find` - Access media files

4. **Save** the permissions

## 7. API Configuration

Your API endpoints will be:
- **Products**: `GET /api/products?populate=*`
- **Categories**: `GET /api/categories?populate=*`
- **Single Product**: `GET /api/products/:id?populate=*`
- **Single Category**: `GET /api/categories/:id?populate=*`

The `populate=*` parameter ensures all related data (images, categories) is included.

## 8. Content Management Workflow

### Adding New Products:
1. Upload product images to Media Library
2. Create new product entry
3. Fill all required fields
4. Select appropriate category
5. Add images
6. Publish the product

### Managing Categories:
1. Keep the three main categories (Mobile Phones, Laptops, Accessories)
2. Update descriptions and images as needed
3. Don't delete categories that have products

### Bulk Operations:
- Use the checkbox selection to publish/unpublish multiple items
- Use filters to find specific products quickly

## 9. Best Practices

### Content Organization:
- Use consistent naming conventions
- Keep descriptions clear and informative
- Use high-quality images
- Set competitive prices

### SEO Optimization:
- Write descriptive product names
- Use detailed descriptions
- Include relevant keywords naturally

### Performance:
- Optimize images before uploading
- Use appropriate image sizes
- Limit the number of images per product (3-5 recommended)

## 10. Troubleshooting

### Common Issues:

**Products not showing in frontend:**
- Check if products are published
- Verify API permissions are set
- Ensure category relationships are properly set

**Images not loading:**
- Check if upload permissions are enabled
- Verify image file formats are supported
- Ensure images are properly uploaded

**Categories not displaying:**
- Confirm categories are published
- Check category API permissions
- Verify populate parameter is used in API calls

### Debug API Calls:
Test your API endpoints:
```
GET http://0.0.0.0:1337/api/products?populate=*
GET http://0.0.0.0:1337/api/categories?populate=*
```

## 11. Maintenance

### Regular Tasks:
- Review and update product information
- Add new products regularly
- Monitor API performance
- Backup your data regularly

### Content Updates:
- Update prices as needed
- Refresh product images
- Add seasonal promotions using the `featured` flag
- Update product descriptions

## Support

If you encounter issues:
1. Check the Strapi documentation
2. Review server logs for errors
3. Verify API endpoints are responding
4. Ensure your frontend is properly connected to the backend

Your ecommerce platform is now ready to manage products through the Strapi admin interface!
