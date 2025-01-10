import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import products from '../../../src/components/products.json' assert { type: 'json' };

dotenv.config();

const importProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if products already exist
    const existingProducts = await Product.find();
    if (existingProducts.length > 0) {
      console.log(`${existingProducts.length} products already exist in the database`);
      process.exit(0);
    }

    // Transform products to match our schema
    const transformedProducts = products.map(product => ({
      title: product.name,
      description: product.description,
      price: product.price,
      images: product.images.map(url => ({
        url,
        publicId: url.split('/').pop() // Use the last part of URL as publicId
      })),
      videos: []
    }));

    // Insert products
    await Product.insertMany(transformedProducts);
    console.log(`${transformedProducts.length} products imported successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing products:', error);
    process.exit(1);
  }
};

importProducts();
