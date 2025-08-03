
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
