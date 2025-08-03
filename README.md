# ABKHD-store - Modern Ecommerce Platform

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)  
- [Development Setup](#development-setup)
- [Content Management](#content-management)
- [API Reference](#api-reference)
- [Deployment Guide](#deployment-guide)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)


Preview the app through : https://abkhd-store.netlify.app
## Project Overview
ABKHD-store is a modern ecommerce platform built with React (Vite) frontend and Strapi CMS backend. The platform focuses on simplicity and clean product categorization with three main categories: Mobile Phones, Laptops, and Accessories.

Key aspects:
- Simplified product management (no stock/quantity tracking)
- Clean, responsive UI with dark mode support
- Fixed category system for easy navigation
- React frontend with Tailwind CSS styling
- Strapi backend with RESTful API

## Key Features
### Product Management
- Each product is a unique item
- Support for multiple product images
- Pricing with original and discounted prices
- Featured product flagging

### Category System
- Fixed categories: Mobile Phones, Laptops, Accessories
- Simple category-based filtering
- Option to display all products across categories

### User Experience
- Responsive, mobile-first design
- System-preference dark mode with manual toggle
- Active navigation indicators
- Minimalist product-focused layout

## Technical Architecture
### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **Routing**: React Router v6
- **UI Components**: Custom reusable components

### Backend
- **CMS**: Strapi v4
- **Database**: SQLite (development), PostgreSQL (production)
- **API**: RESTful endpoints with auto-generated documentation
- **Media**: Built-in media library for image management

### File Structure
```
/
├── src/                 # React frontend
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Context providers
│   ├── pages/           # Route components
│   ├── services/        # API services
│   └── lib/             # Utility functions
├── backend/             # Strapi backend
│   ├── src/api/         # Content-type definitions
│   ├── config/          # Server configuration  
│   └── public/          # Uploaded media
└── public/              # Frontend static assets
```

## Development Setup
### Prerequisites
- Node.js v16+
- npm or yarn
- Strapi CLI (for backend development)

### Installation
1. Clone the repository
2. Install frontend dependencies:
```bash
npm install
```
3. Install backend dependencies:
```bash
cd backend && npm install
```

### Configuration
Create environment files:
1. Frontend `.env`:
```env
VITE_STRAPI_API_URL=http://localhost:1337/api
VITE_STRAPI_MEDIA_URL=http://localhost:1337
```

2. Backend `.env` (in backend directory):
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
```

## Content Management
### Admin Panel Access
1. Start Strapi backend:
```bash
cd backend && npm run develop
```
2. Access admin panel at `http://localhost:1337/admin`
3. Create admin account if first time

### Creating Content
1. **Categories**:
   - Navigate to Content Manager → Categories
   - Create three main categories: Mobile Phones, Laptops, Accessories
   - Publish each category

2. **Products**:
   - Go to Content Manager → Products
   - Fill required fields: name, description, price, category
   - Add optional fields: longDescription, originalPrice, images
   - Publish products

## API Reference
### Products
- `GET /api/products?populate=*` - List all products
- `GET /api/products/:id?populate=*` - Get single product

### Categories  
- `GET /api/categories?populate=*` - List all categories
- `GET /api/categories/:id?populate=*` - Get single category

### Media
- `GET /api/upload/files` - List uploaded media
- Media URLs follow pattern: `http://[host]/uploads/[filename]`

## Deployment Guide
### Replit Deployment
1. Configure `.replit` file:
```toml
[deployment]
run = ["npm", "run", "build"]
deploymentTarget = "cloudrun"

[[ports]]
localPort = 5173
externalPort = 80

[[ports]]  
localPort = 1337
externalPort = 3000
```

2. Set production environment variables:
```env
# Frontend
VITE_STRAPI_API_URL=[your-replit-url]:3000/api
VITE_STRAPI_MEDIA_URL=[your-replit-url]:3000

# Backend
HOST=0.0.0.0
PORT=1337
APP_KEYS=[your-production-keys]
```

3. Deploy using Replit's deployment interface

## Maintenance
### Regular Tasks
- Review and update product information
- Add new products regularly
- Monitor API performance
- Backup data weekly

### Performance Optimization
- Compress images before uploading
- Use appropriate image sizes (800x800px for products)
- Limit to 3-5 images per product
- Enable caching where possible

## Troubleshooting
### Products Not Showing
- Verify products are published in Strapi
- Check API permissions for Public role
- Ensure proper category relationships

### Images Not Loading  
- Confirm upload permissions are enabled
- Check media URL configuration
- Verify image files exist in media library

### API Connection Issues
- Test endpoints directly:
```bash
curl http://localhost:1337/api/products?populate=*
```
- Verify CORS settings in `backend/config/middlewares.js`
- Check backend server logs for errors