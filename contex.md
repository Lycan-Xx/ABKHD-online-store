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