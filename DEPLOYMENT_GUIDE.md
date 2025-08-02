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