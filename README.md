<<<<<<< HEAD
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
=======
# ABKHD Online Store

A simple online shopping platform for second-hand mobile and PC.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)
- [Acknowledgements](#acknowledgements)

## Features

- User-friendly interface for browsing second-hand mobile and PC products.
- Secure user authentication and authorization.
- Easy product listing and management for sellers.
- Search and filter options for better product discovery.

## Technologies Used

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Vite](https://vitejs.dev/) - A fast build tool and development server.
- [Node.js](https://nodejs.org/) - JavaScript runtime for building server-side applications.
- [Express](https://expressjs.com/) - Web framework for Node.js.

## Installation

To get started with this project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Lycan-Xx/ABKHD-online-store.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ABKHD-online-store
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To run the project in development mode, use the following command:

```bash
npm run start
```

Open your browser and go to `http://localhost:3000` (or the port specified in your Vite config) to see your app in action.

## Deployment

To deploy this project, run:

```bash
npm run deploy
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.

## Authors

- [@Lycan-Xx](https://github.com/Lycan-Xx/)

## Acknowledgements

- [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
- [Awesome README](https://github.com/matiassingers/awesome-readme)
- [How to write a Good README](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
```
>>>>>>> merge-test
