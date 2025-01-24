## ABKHD Online Store Admin System

### Overview
This system consists of:
1. Frontend admin panel for managing products and settings
2. Backend API for handling data and file operations
3. MongoDB for data storage
4. Cloudinary for media management

### Setup Instructions

#### Prerequisites
- Node.js 16+
- MongoDB account
- Cloudinary account

#### Environment Variables
Create `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

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

### Features
- Product Management (CRUD)
- Image/Video Upload via Cloudinary
- WhatsApp Number Configuration
- Contact Email Management
- Secure Admin Authentication

### API Documentation

#### Authentication
- POST /api/auth/login
- POST /api/auth/logout

#### Products
- GET /api/products
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

#### Settings
- GET /api/settings
- PUT /api/settings

### Security
- JWT-based authentication
- Input validation
- File upload restrictions
- CORS configuration



### Additional notes

to create a new user 

ensure it is ran in the directory of the createAdmin.js

Use this format (node createAdmin.js "John Doe" "email.address.com" "password" "role")

ROLE - is either (user OR admin)

{ node createAdmin.js "Purple Guy" "purple@mail.com" "password" "admin" }




