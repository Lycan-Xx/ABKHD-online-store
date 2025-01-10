import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from '../models/Settings.js';

dotenv.config();

const initializeSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if settings already exist
    const existingSettings = await Settings.findOne();
    if (existingSettings) {
      console.log('Settings already exist:', existingSettings);
      process.exit(0);
    }

    // Create default settings
    const defaultSettings = new Settings({
      whatsappNumber: '+1234567890',
      contactEmail: 'contact@example.com'
    });

    await defaultSettings.save();
    console.log('Default settings created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing settings:', error);
    process.exit(1);
  }
};

initializeSettings();
