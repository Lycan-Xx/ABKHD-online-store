<<<<<<< HEAD
# ABKHD Store Backend - Deployment Guide

## 🚀 Complete Setup and Deployment Instructions

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn
- Git
- Render account (for deployment)

## 📁 Project Structure
```
backend/
├── config/
│   ├── admin.js
│   ├── api.js
│   ├── database.js
│   ├── middlewares.js
│   └── server.js
├── src/
│   ├── api/
│   │   ├── product/
│   │   └── category/
│   └── index.js
├── scripts/
│   └── seed.js
├── .env.example
├── .env
├── package.json
├── render.yaml
└── .gitignore
```

## 🛠️ Local Development Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Environment Configuration
1. For production configuration, copy the environment file:
```bash
cp .env.example .env
```

2. For local development, create a `.env.local` file:
```bash
cp .env.example .env.local
```

3. Configure your environment files:
- `.env` - Contains production values (committed to repo)
- `.env.local` - Contains local development values (ignored by git)

Example `.env.local` configuration:
```env
# Local development configuration
VITE_STRAPI_API_URL=http://localhost:1337/api
VITE_STRAPI_MEDIA_URL=http://localhost:1337
NODE_ENV=development
```

Example `.env` configuration (production):
```env
# Production configuration
VITE_STRAPI_API_URL=https://your-production-domain.com/api
VITE_STRAPI_MEDIA_URL=https://your-production-domain.com
NODE_ENV=production
```

### Step 3: Start Development Server
```bash
npm run develop
```

The backend will be available at:
- API: http://localhost:1337/api
- Admin Panel: http://localhost:1337/admin

### Step 4: Create Admin User
1. Visit http://localhost:1337/admin
2. Create your first admin user
3. Complete the setup wizard

### Step 5: Seed Database (Optional)
```bash
npm run seed
```

## 🌐 Render Deployment

### Step 1: Prepare for Deployment
1. Ensure all files are committed to your Git repository
2. Push your code to GitHub/GitLab

### Step 2: Create Render Services

#### Database Setup
1. Go to Render Dashboard
2. Click "New" → "PostgreSQL"
3. Configure:
   - Name: `abkhd-store-db`
   - Database Name: `abkhd_store`
   - User: `abkhd_store_user`
   - Plan: Starter (or higher)
4. Click "Create Database"
5. Note down the connection details

#### Web Service Setup
1. Click "New" → "Web Service"
2. Connect your Git repository
3. Configure:
   - Name: `abkhd-store-backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Starter (or higher)

### Step 3: Environment Variables
Add these environment variables in Render:

```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=[Auto-filled by Render when you connect the database]
DATABASE_SSL=true
HOST=0.0.0.0
PORT=10000

# Generate secure values for production
APP_KEYS=your-production-app-keys
API_TOKEN_SALT=your-production-api-token-salt
ADMIN_JWT_SECRET=your-production-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-production-transfer-token-salt
JWT_SECRET=your-production-jwt-secret

# Frontend URLs
FRONTEND_URL=https://your-frontend-domain.com
FRONTEND_URL_PROD=https://your-frontend-domain.com
STRAPI_ADMIN_BACKEND_URL=https://your-backend-domain.onrender.com
```

### Step 4: Connect Database
1. In your web service settings
2. Go to "Environment" tab
3. Add the PostgreSQL database you created
4. Render will automatically add `DATABASE_URL`

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for the build and deployment to complete
3. Your backend will be available at: `https://your-service-name.onrender.com`

## 🔧 Post-Deployment Setup

### Step 1: Access Admin Panel
1. Visit `https://your-backend-domain.onrender.com/admin`
2. Create your production admin user
3. Configure content types and permissions

### Step 2: Configure Permissions
1. Go to Settings → Users & Permissions Plugin → Roles
2. Configure Public role permissions:
   - Product: find, findOne
   - Category: find, findOne
3. Save the configuration

### Step 3: Update Frontend Configuration
For production, update your frontend's `.env` file:
```env
VITE_STRAPI_API_URL=https://your-backend-domain.onrender.com/api
VITE_STRAPI_MEDIA_URL=https://your-backend-domain.onrender.com
```

For local development, create/update `.env.local`:
```env
VITE_STRAPI_API_URL=http://localhost:1337/api
VITE_STRAPI_MEDIA_URL=http://localhost:1337
```

Note: `.env.local` is automatically git-ignored, so local development settings won't affect production.

### Step 4: Test Integration
1. Verify API endpoints:
   - `GET /api/products`
   - `GET /api/categories`
2. Test frontend connectivity
3. Upload sample images and test media serving

## 🔍 Verification Steps

### API Health Check
```bash
curl https://your-backend-domain.onrender.com/api/products
```

### Admin Panel Access
Visit: `https://your-backend-domain.onrender.com/admin`

### CORS Verification
Check browser console for CORS errors when frontend connects to backend.

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
- **Issue**: npm install fails
- **Solution**: Check Node.js version compatibility, clear npm cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 2. Database Connection Issues
- **Issue**: Cannot connect to PostgreSQL
- **Solution**: Verify DATABASE_URL and SSL settings
- Ensure `DATABASE_SSL=true` for Render PostgreSQL

#### 3. CORS Errors
- **Issue**: Frontend cannot access backend
- **Solution**: Check CORS configuration in `config/middlewares.js`
- Verify frontend URLs in environment variables

#### 4. Admin Panel 404
- **Issue**: Admin panel not accessible
- **Solution**: Check `STRAPI_ADMIN_BACKEND_URL` environment variable

#### 5. Media Upload Issues
- **Issue**: Images not uploading or displaying
- **Solution**: Check file permissions and media configuration

### Performance Optimization

#### 1. Database Optimization
```javascript
// In config/database.js
pool: {
  min: env.int('DATABASE_POOL_MIN', 2),
  max: env.int('DATABASE_POOL_MAX', 10),
},
```

#### 2. Enable Gzip Compression
Add to `config/middlewares.js`:
```javascript
{
  name: 'strapi::compression',
  config: {
    br: false
  }
}
```

## 🔐 Security Best Practices

### 1. Environment Variables
- Never commit `.env` files
- Use strong, unique secrets for production
- Rotate secrets regularly

### 2. Database Security
- Use SSL connections in production
- Implement proper backup strategies
- Monitor database access logs

### 3. API Security
- Configure proper CORS origins
- Implement rate limiting
- Use HTTPS only in production

### 4. Admin Security
- Use strong admin passwords
- Enable 2FA when available
- Limit admin access by IP if possible

## 📊 Monitoring and Maintenance

### Health Checks
Render automatically monitors your service health. The backend includes:
- Health check endpoint at `/_health`
- Automatic restart on failures
- Resource usage monitoring

### Logs
Access logs through Render dashboard:
1. Go to your web service
2. Click "Logs" tab
3. Monitor for errors and performance issues

### Updates
Keep Strapi updated:
```bash
npm update @strapi/strapi
npm audit fix
```

## 🎯 Next Steps

1. **Content Management**: Add your products and categories through the admin panel
2. **Media Management**: Upload product images and configure media settings
3. **API Customization**: Extend APIs as needed for your frontend requirements
4. **Performance Monitoring**: Set up monitoring and alerting
5. **Backup Strategy**: Implement regular database backups

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render logs for specific error messages
3. Consult Strapi documentation: https://docs.strapi.io
4. Check Render documentation: https://render.com/docs

---

**🎉 Congratulations!** Your Strapi backend is now ready for production use with your ABKHD Store frontend.
=======

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
>>>>>>> refs/heads/main
