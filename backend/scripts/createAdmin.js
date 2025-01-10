import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../src/models/Admin.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const email = process.argv[2];
    const password = process.argv[3];
    
    if (!email || !password) {
      console.error('Please provide email and password');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: hashedPassword });
    
    console.log('Admin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();