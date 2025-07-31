# Strapi Collection Schemas for ABKHD E-commerce Store

This directory contains the collection type schemas for your Strapi backend based on your React app structure.

## Collections Included

### 1. Product Collection (`product.json`)
- **Fields:**
  - `name` (string, required): Product name
  - `price` (decimal, required): Current price
  - `originalPrice` (decimal, optional): Original price for discount display
  - `description` (text, required): Short product description
  - `longDescription` (richtext, optional): Detailed product description
  - `stock` (integer, required): Available stock quantity
  - `featured` (boolean): Whether product is featured
  - `tags` (json): Array of product tags
  - `image` (media, single): Main product image
  - `images` (media, multiple): Additional product images
  - `category` (relation): Many-to-one relation with Category
  - `slug` (uid): Auto-generated from name for SEO-friendly URLs

### 2. Category Collection (`category.json`)
- **Fields:**
  - `name` (string, required, unique): Category name
  - `description` (text): Category description
  - `image` (media, single): Category image
  - `subcategories` (json): Array of subcategory names
  - `products` (relation): One-to-many relation with Products
  - `slug` (uid): Auto-generated from name for SEO-friendly URLs

## Installation Instructions

### Method 1: Manual Creation in Strapi Admin
1. Start your Strapi development server
2. Go to Content-Types Builder in the admin panel
3. Create new Collection Types using the field definitions above
4. Configure each field according to the specifications

### Method 2: Direct Schema Import (Advanced)
1. Copy the JSON files to your Strapi project:
   ```
   your-strapi-project/
   ├── src/
   │   └── api/
   │       ├── product/
   │       │   └── content-types/
   │       │       └── product/
   │       │           └── schema.json
   │       └── category/
   │           └── content-types/
   │               └── category/
   │                   └── schema.json
   ```

2. Restart your Strapi server to apply the changes

## Sample Data Structure

### Product Example:
```json
{
  "name": "Acme X1 Mobile Phone",
  "price": 120000.00,
  "originalPrice": 135000.00,
  "description": "A powerful smartphone with a stunning display and long battery life.",
  "longDescription": "The Acme X1 features a 6.5-inch AMOLED display, 128GB storage, and a 5000mAh battery.",
  "stock": 30,
  "featured": true,
  "tags": ["smartphone", "android", "mobile"],
  "category": "mobile-phones"
}
```

### Category Example:
```json
{
  "name": "Mobile Phones",
  "description": "Latest smartphones and mobile devices",
  "subcategories": ["smartphones", "feature-phones", "accessories"]
}
```

## API Endpoints

After creating these collections, your Strapi API will provide:

- `GET /api/products?populate=*` - Get all products with relations
- `GET /api/products/:id?populate=*` - Get single product with relations
- `GET /api/categories?populate=*` - Get all categories with relations
- `GET /api/categories/:id?populate=*` - Get single category with relations

## Notes

1. **Media Fields**: The `image` and `images` fields are configured to accept only image files
2. **Relations**: Products are linked to categories via a many-to-one relationship
3. **JSON Fields**: `tags` and `subcategories` use JSON type for flexibility
4. **Slugs**: Auto-generated for SEO-friendly URLs
5. **Draft & Publish**: Both collections support draft/publish workflow

## Troubleshooting

If you encounter issues:

1. **Validation Errors**: Ensure required fields are populated
2. **Relation Issues**: Make sure both collections are created before establishing relations
3. **Media Upload**: Configure your media upload settings in Strapi
4. **CORS Issues**: Update your Strapi CORS settings for your React app domain

## Environment Variables

Make sure your React app has the correct Strapi URLs:
```env
VITE_STRAPI_API_URL=http://localhost:1337/api
VITE_STRAPI_MEDIA_URL=http://localhost:1337
