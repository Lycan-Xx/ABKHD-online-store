<<<<<<< HEAD
# Frontend Context Documentation

## Project Overview
- React application using Vite
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Axios for API requests
- Integration with Strapi backend

## Key Fixes Implemented

### 1. Strapi Response Handling
Fixed incorrect mapping of Strapi v4 response structure in `src/services/strapi.js`:

```javascript
// Before (incorrect)
const attributes = item?.attributes || {};
return {
  id: item.id,
  ...attributes
};

// After (correct)
const { id, attributes } = item;
return {
  id: id,
  name: attributes.name || '',
  // ... other fields
};
```

### 2. Product Context Optimization
Added deep state comparison in `src/contexts/ProductContext.jsx` to prevent unnecessary re-renders:

```javascript
setProducts(prev => 
  JSON.stringify(prev) !== JSON.stringify(productsData) 
    ? productsData 
    : prev
);
```

### 3. Product Matching Logic
Improved product matching in `src/pages/ProductDetailPage.jsx`:
```javascript
// Before (strict equality)
const product = products.find(p => 
  p.id === parseInt(id) || p.id === id || p.documentId === id
);

// After (loose equality)
const product = products.find(p => 
  p.id == id || p.documentId === id
);
```

### 4. Category Comparison
Simplified category handling by removing unnecessary type checks:
```javascript
// Before
const productCategory = typeof product.category === 'object' 
  ? product.category?.data?.attributes?.name 
  : product.category;

// After
return p.id !== product.id && p.category === product.category;
```

## Environment Configuration
The application uses these environment variables (in `.env`):
```env
VITE_STRAPI_API_URL=http://localhost:1337/api
VITE_STRAPI_MEDIA_URL=http://localhost:1337
```

## Current File Structure
```
src/
├── components/
├── contexts/
│   ├── CartContext.jsx
│   ├── ProductContext.jsx
│   └── ToastContext.jsx
├── pages/
│   ├── ProductDetailPage.jsx
│   ├── CategoryPage.jsx
│   └── InventoryPage.jsx
└── services/
    └── strapi.js
```

## Known Issues
1. Product data might still be empty if:
   - Strapi API is not running
   - Environment variables are misconfigured
   - CORS is not properly set up in Strapi
   
2. Image URLs might not resolve if:
   - Media URL is incorrect in environment variables
   - Strapi media permissions are not set

## Next Steps for Debugging
1. Verify Strapi API is running and accessible
2. Check network requests for 404 errors
3. Validate environment variables in `.env`
4. Ensure CORS is configured in Strapi's `config/middlewares.js`:
   ```javascript
   module.exports = [
     'strapi::errors',
     'strapi::security',
     'strapi::cors',
     'strapi::logger',
     // ...
   ];
   ```
5. Confirm media permissions in Strapi's content-type settings
=======

# Ecommerce Platform Context

## Project Overview
This is a modern ecommerce platform built with React (Vite) frontend and Strapi CMS backend. The platform focuses on simplicity and clean product categorization.

## Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **Routing**: React Router v6
- **UI Components**: Custom components with consistent design

### Backend (Strapi CMS)
- **CMS**: Strapi v4
- **Database**: SQLite (development) / PostgreSQL (production)
- **API**: RESTful API with auto-generated endpoints
- **Media**: Built-in media library for image management

## Core Features

### Product Management
- **Simplified Structure**: Each product is a unique item (no stock/quantity tracking)
- **Categories**: Three main categories - Mobile Phones, Laptops, Accessories
- **Media**: Support for multiple product images
- **Pricing**: Support for original price and discounted price

### Category System
- **Fixed Categories**: Mobile Phones, Laptops, Accessories
- **Category Filtering**: Simple category-based filtering
- **Show All**: Option to display all products across categories

### User Interface
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark Mode**: System preference with manual toggle
- **Active Navigation**: Visual indicators for current page/section
- **Clean Layout**: Minimalist design focused on product showcase

## Content Types

### Product Schema
```json
{
  "name": "string (required)",
  "description": "text (required)",
  "longDescription": "richtext",
  "price": "decimal (required)",
  "originalPrice": "decimal",
  "featured": "boolean",
  "image": "media (single)",
  "images": "media (multiple)",
  "category": "relation to category"
}
```

### Category Schema
```json
{
  "name": "string (required)",
  "description": "text",
  "image": "media (single)",
  "products": "relation to products"
}
```

## Key Design Decisions

### Simplified Approach
- **No Stock Management**: Products are treated as unique items
- **No Tags**: Removed to simplify product structure
- **Category-Only Filtering**: Removed price range and sorting filters
- **Individual Items**: Each product listing represents a unique item

### Visual Design
- **Active Tab Indicators**: Shadow overlays and background highlights
- **Consistent Spacing**: Standardized margins and padding
- **Color System**: Primary colors with semantic meanings
- **Typography**: Clear hierarchy with readable fonts

## API Integration

### Strapi Endpoints
- `GET /api/products?populate=*` - All products with relations
- `GET /api/categories?populate=*` - All categories with relations
- `GET /api/products/:id?populate=*` - Single product
- `GET /api/categories/:id?populate=*` - Single category

### Frontend Services
- **strapi.js**: API service layer for backend communication
- **ProductContext**: Global state management for products and categories
- **Error Handling**: Graceful fallback to local data when API fails

## Development Workflow

### Backend Management
1. Add categories through Strapi admin
2. Upload product images to media library
3. Create products with proper category relationships
4. Publish content to make it available via API

### Frontend Development
1. Components automatically fetch data from Strapi
2. Filtering happens client-side based on categories
3. Responsive design ensures mobile compatibility
4. Dark mode preference is persisted locally

## Deployment Strategy

### Backend (Strapi)
- Environment variables for database configuration
- Media uploads handled by Strapi
- API permissions configured for public access
- CORS enabled for frontend domain

### Frontend (React)
- Build process optimizes for production
- Environment variables for API endpoints
- Static assets served efficiently
- Progressive loading for better UX

## File Structure
```
/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React Context providers
│   ├── pages/          # Route components
│   ├── services/       # API and external services
│   └── lib/            # Utility functions
├── backend/
│   ├── src/api/        # Strapi API definitions
│   ├── config/         # Strapi configuration
│   └── public/         # Static assets and uploads
└── public/             # Frontend static assets
```

This simplified approach prioritizes ease of use and maintenance while providing a clean, professional ecommerce experience.
>>>>>>> refs/heads/main
