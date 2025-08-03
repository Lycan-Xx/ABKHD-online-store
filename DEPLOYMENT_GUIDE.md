
# Deployment Guide - Ecommerce Platform

This guide covers deploying your React + Strapi ecommerce platform on Replit.

## Prerequisites

- Replit account
- Basic understanding of React and Strapi
- Your ecommerce platform code ready

## Architecture Overview

- **Frontend**: React + Vite application
- **Backend**: Strapi CMS with SQLite database
- **Deployment**: Replit Reserved VM for production

## Local Development Setup

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start Strapi development server
npm run develop
```

## Environment Configuration

### Frontend Environment Variables
Create `.env` file in root directory:
```env
VITE_STRAPI_API_URL=http://0.0.0.0:1337/api
VITE_STRAPI_MEDIA_URL=http://0.0.0.0:1337
```

### Backend Environment Variables
Create `backend/.env` file:
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
```

## Strapi Configuration

### 1. Server Configuration
Update `backend/config/server.js`:
```javascript
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
```

### 2. Middleware Configuration
Update `backend/config/middlewares.js`:
```javascript
module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ['http://localhost:3000', 'http://localhost:5173', 'https://*.replit.dev', 'https://*.repl.co']
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### 3. Database Configuration
For development, SQLite is configured by default. For production, consider PostgreSQL.

## Content Setup

### 1. Categories
Create these three categories in Strapi admin:
- **Mobile Phones**: Smartphones and mobile devices
- **Laptops**: Notebooks and portable computers  
- **Accessories**: Computer and mobile accessories

### 2. Products
Add products for each category with:
- Name and description
- Price (and optional original price for discounts)
- High-quality images
- Proper category assignment

### 3. API Permissions
Configure public permissions for:
- ✅ Product: find, findOne
- ✅ Category: find, findOne
- ✅ Upload: find

## Replit Deployment

### 1. Project Structure
Ensure your project has this structure:
```
/
├── src/                 # React frontend
├── backend/             # Strapi backend
├── package.json         # Frontend dependencies
├── .replit             # Replit configuration
└── README.md
```

### 2. Replit Configuration
The `.replit` file should be configured to run both frontend and backend:

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

### 3. Build Scripts
Ensure your `package.json` has proper scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "backend:dev": "cd backend && npm run develop",
    "backend:build": "cd backend && npm run build",
    "start": "npm run build && npm run preview"
  }
}
```

### 4. Deployment Steps

1. **Prepare Backend**:
   ```bash
   cd backend
   npm install
   npm run build
   ```

2. **Prepare Frontend**:
   ```bash
   npm install
   npm run build
   ```

3. **Deploy on Replit**:
   - Go to the Deployments tab
   - Choose "Reserved VM" deployment
   - Configure build and run commands
   - Deploy your application

### 5. Production Environment Variables

Set these in Replit Secrets:
```
# Backend
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-production-keys
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Frontend
VITE_STRAPI_API_URL=https://your-repl-name--your-username.repl.co:3000/api
VITE_STRAPI_MEDIA_URL=https://your-repl-name--your-username.repl.co:3000
```

## Post-Deployment Setup

### 1. Strapi Admin
- Access admin at `https://your-deployment-url:3000/admin`
- Create admin user
- Configure content as per STRAPI_ADMIN_GUIDE.md

### 2. Content Migration
- Upload product images
- Create categories and products
- Set proper API permissions
- Test all endpoints

### 3. Frontend Verification
- Verify product listings load
- Test category filtering
- Check responsive design
- Confirm dark mode functionality

## Monitoring and Maintenance

### 1. Logs
Monitor both frontend and backend logs:
```bash
# Backend logs
cd backend && npm run develop

# Frontend logs  
npm run dev
```

### 2. Performance
- Monitor API response times
- Check image loading performance
- Verify mobile responsiveness

### 3. Updates
Regular maintenance tasks:
- Update product content
- Add new categories if needed
- Monitor API performance
- Update dependencies

## Troubleshooting

### Common Issues

**Backend not accessible**:
- Check if port 1337 is bound to 0.0.0.0
- Verify CORS configuration
- Ensure proper environment variables

**Frontend API calls failing**:
- Check API URL configuration
- Verify backend is running
- Test API endpoints directly

**Images not loading**:
- Check media URL configuration
- Verify upload permissions
- Test media endpoints

**Categories not showing**:
- Ensure categories are published
- Check API permissions
- Verify populate parameters

### Debug Commands
```bash
# Test API endpoints
curl http://0.0.0.0:1337/api/products?populate=*
curl http://0.0.0.0:1337/api/categories?populate=*

# Check backend status
cd backend && npm run develop

# Check frontend build
npm run build && npm run preview
```

## Security Considerations

1. **API Keys**: Keep APP_KEYS secure and unique
2. **CORS**: Configure for specific domains in production
3. **Media**: Validate uploaded file types
4. **Permissions**: Only enable necessary API permissions

## Performance Optimization

1. **Images**: Optimize size and format
2. **Caching**: Enable appropriate caching headers
3. **API**: Use populate parameter efficiently
4. **Frontend**: Optimize bundle size

Your ecommerce platform is now ready for production deployment on Replit!
