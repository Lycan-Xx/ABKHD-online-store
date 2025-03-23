## ABKHD Online Store Admin System

### Overview
This system consists of:
1. Frontend admin panel for managing products and settings
2. Backend API for handling data and file operations
3. MongoDB for data storage
4. Cloudinary for media management

### Features
- Product Management (CRUD)
- Image/Video Upload via Cloudinary
- WhatsApp Number Configuration
- Contact Email Management
- Secure Admin Authentication

### Setup Instructions

#### Prerequisites
- Node.js 16+
- MongoDB account
- Cloudinary account

#### Environment Variables
Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

Never commit `.env` files containing real credentials to version control.

#### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in your environment variables

#### Installation

1. Backend Setup:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Frontend Setup:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Project Structure

The project is organized into two main directories:
- `frontend`: Contains all frontend-related code
- `backend`: Contains all backend-related code

### Setting Up the Project

1. Create a new `frontend` directory and move all frontend-related files:
   ```bash
   mkdir -p frontend
   mv src frontend/
   mv public frontend/
   mv index.html frontend/
   mv vite.config.ts frontend/
   mv package*.json frontend/
   mv postcss.config.js frontend/
   mv tailwind.config.js frontend/
   mv tsconfig*.json frontend/
   ```

2. Update the paths in `vite.config.ts`:
   ```typescript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     base: '/', 
     server: {
       port: process.env.PORT || 3000,
       host: '0.0.0.0',
     },
     optimizeDeps: {
       exclude: ['lucide-react'],
     },
   });
   ```

3. Update `package.json` paths:
   ```json
   {
     "name": "abkhd-store-frontend",
     "private": true,
     "version": "0.0.0",
     "type": "module",
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
       "preview": "vite preview"
     }
   }
   ```

4. Create a root `package.json` for managing both frontend and backend:
   ```json
   {
     "name": "abkhd-store",
     "version": "1.0.0",
     "private": true,
     "workspaces": [
       "frontend",
       "backend"
     ],
     "scripts": {
       "frontend": "cd frontend && npm run dev",
       "backend": "cd backend && npm run dev",
       "dev": "concurrently \"npm run frontend\" \"npm run backend\"",
       "build": "cd frontend && npm run build",
       "start": "cd backend && npm start"
     },
     "devDependencies": {
       "concurrently": "^8.0.0"
     }
   }
   ```

5. Update your `.gitignore` file:
   ```gitignore
   # Dependencies
   node_modules
   frontend/node_modules
   backend/node_modules

   # Build
   frontend/dist
   frontend/dist-ssr
   *.local

   # Environment variables
   .env
   frontend/.env
   backend/.env
   .env.local
   .env.development
   .env.test
   .env.production

   # Editor directories and files
   .vscode/*
   !.vscode/extensions.json
   .idea
   .DS_Store
   *.suo
   *.ntvs*
   *.njsproj
   *.sln
   *.sw?
   ```

### Running the Project

1. Install dependencies:
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend && npm install

   # Install backend dependencies
   cd backend && npm install
   ```

2. Start the development servers:
   - To run the frontend only:
     ```bash
     npm run frontend
     ```
   - To run the backend only:
     ```bash
     npm run backend
     ```
   - To run both frontend and backend:
     ```bash
     npm run dev
     ```

### Additional Configuration

1. Update your backend CORS configuration in `index.js`:
   ```javascript
   const corsOptions = {
     origin: process.env.NODE_ENV === 'production' 
       ? process.env.FRONTEND_URL 
       : 'http://localhost:3000',
     credentials: true
   };
   app.use(cors(corsOptions));
   ```

2. Update the API URL in `api.js`:
   ```javascript
   import axios from 'axios';

   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
   });
   ```

### Additional Notes

To create a new user, ensure it is run in the directory of the `createAdmin.js` file.

Use this format:
```bash
node createAdmin.js "John Doe" "email.address.com" "password" "role"
```
`ROLE` can be either `user` or `admin`.

Example:
```bash
node createAdmin.js "Purple Guy" "purple@mail.com" "password" "admin"
```